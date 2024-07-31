import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { DateTime } from "luxon";
import db from "../firebase";
import { validateLocation } from "./geolocate";

const handleClockIn = async (
  userId,
  setClockInTime,
  setIsClockedIn,
  addLog,
  setIsLoading
) => {
  setIsLoading(true);
  if (!(await validateLocation(userId))) {
    setIsLoading(false);
    alert("You are not within the allowed location to clock in.");
    return;
  }
  setIsLoading(false);

  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "employee", userDoc.id);
      const userData = userDoc.data();

      const now = DateTime.now().setZone("America/Edmonton");
      const dayOfWeek = now.weekdayLong;
      const workHoursToday = userData.workHours[dayOfWeek];

      if (workHoursToday === " - ") {
        alert("Today is a day off, you cannot clock in.");
        return;
      }

      const [start, end] = workHoursToday.split(" - ");
      const startTime = DateTime.fromISO(start, {
        zone: "America/Edmonton",
      }).minus({ minutes: 30 });
      const endTime = DateTime.fromISO(end, { zone: "America/Edmonton" }).plus({
        minutes: 30,
      });

      if (now < startTime || now > endTime) {
        alert("You cannot clock in outside your scheduled hours.");
        return;
      }

      setIsClockedIn(true);
      const clockInTime = now;
      setClockInTime(clockInTime);
      addLog(
        `Clocked In at ${clockInTime.toLocaleString(
          DateTime.DATETIME_FULL_WITH_SECONDS
        )}`
      );

      const today = now.toISODate();
      //If work time data already exists
      let updatedWorkTime = "";
      if (userData.workTime) {
        updatedWorkTime = {
          ...userData.workTime,
          [today]: [
            ...(userData.workTime[today] || []),
            { clockIn: clockInTime.toFormat("HH:mm") },
          ],
        };
      }
      //If work time data does not exist
      else {
        updatedWorkTime = {
          [today]: [{ clockIn: clockInTime.toFormat("HH:mm") }],
        };
      }

      await updateDoc(userRef, {
        status: "online",
        workTime: updatedWorkTime,
        totalBreakDuration: 0,
        ...(!userData.workTime[today] && { workDurationToday: 0 }), //If no work time data exists for today, reset work duration to 0
      });
    } else {
      console.log(`User document does not exist for ID: ${userId}`);
    }
  } catch (error) {
    console.error("Error clocking in:", error);
  }
};

const handleClockOut = async (
  userId,
  setIsClockedIn,
  addLog,
  setWorkDurationToday
) => {
  setIsClockedIn(false);

  const now = DateTime.now().setZone("America/Edmonton");
  const clockOutTime = now;
  addLog(
    `Clocked Out at ${clockOutTime.toLocaleString(
      DateTime.DATETIME_FULL_WITH_SECONDS
    )}`
  );

  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "employee", userDoc.id);
      const userData = userDoc.data();

      const today = now.toISODate();
      const workTimeToday = userData.workTime[today];

      if (!workTimeToday || workTimeToday.length === 0) {
        console.log("No clock-in entry found for today.");
        return;
      }

      // Get the last clock-in entry for today
      const lastClockInEntry = workTimeToday[workTimeToday.length - 1];
      if (!lastClockInEntry.clockIn || lastClockInEntry.clockOut) {
        console.log("No valid clock-in entry found for today.");
        return;
      }

      const clockInDateTime = DateTime.fromISO(lastClockInEntry.clockIn, {
        zone: "America/Edmonton",
      });

      let workDurationToday = clockOutTime
        .startOf("minute")
        .diff(clockInDateTime, "minutes").minutes;

      if (workDurationToday < 0) {
        workDurationToday = 0;
      }

      const previousWorkDuration = userData.workPeriod[today] || 0;
      const totalWorkDurationToday = previousWorkDuration + workDurationToday;

      const updatedWorkPeriod = {
        ...userData.workPeriod,
        [today]: totalWorkDurationToday,
      };

      // Update the last clock-in entry with clock-out time
      const updatedWorkTimeToday = workTimeToday.map((entry) =>
        entry.clockIn === lastClockInEntry.clockIn
          ? { ...entry, clockOut: clockOutTime.toFormat("HH:mm") }
          : entry
      );

      const updatedWorkTime = {
        ...userData.workTime,
        [today]: updatedWorkTimeToday,
      };

      await updateDoc(userRef, {
        status: "offline",
        lastOnlineDate: today,
        isOnBreak: false,
        workDurationToday: totalWorkDurationToday,
        workPeriod: updatedWorkPeriod,
        workTime: updatedWorkTime,
      });

      // Handle clock-out after midnight
      if (clockOutTime.hasSame(clockInDateTime, "day") === false) {
        const nextDay = clockOutTime.toISODate();
        const nextDayWorkDuration = userData.workPeriod[nextDay] || 0;

        await updateDoc(userRef, {
          workPeriod: {
            ...userData.workPeriod,
            [nextDay]: nextDayWorkDuration + workDurationToday,
          },
        });
      }

      console.log("User status set to offline and work duration updated.");
      setWorkDurationToday(totalWorkDurationToday);
    } else {
      console.log(`User document does not exist for ID: ${userId}`);
    }
  } catch (error) {
    console.error("Error clocking out:", error);
  }
};

const handleStartBreak = async (
  userId,
  setIsOnBreak,
  setBreakTimer,
  breakDuration,
  addLog
) => {
  setIsOnBreak(true);
  addLog(
    `Break started at ${DateTime.now()
      .setZone("America/Edmonton")
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`
  );

  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "employee", userDoc.id);

    const totalBreakDuration =
      (userDoc.data().totalBreakDuration || 0) + parseInt(breakDuration);

    await updateDoc(userRef, {
      isOnBreak: true,
      totalBreakDuration,
    });

    setBreakTimer(
      setTimeout(async () => {
        setIsOnBreak(false);
        addLog(
          `Break ended at ${DateTime.now()
            .setZone("America/Edmonton")
            .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`
        );
        await updateDoc(userRef, {
          isOnBreak: false,
        });
        setBreakTimer(null);
      }, breakDuration * 60 * 1000) // breakDuration is in minutes, converting to milliseconds
    );
  }
};

export { handleClockIn, handleClockOut, handleStartBreak };
