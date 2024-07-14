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

let intervalId = null;

const startInterval = (
  userId,
  setIsClockedIn,
  setTotalBreakDuration,
  addLog,
  clockInTime,
  totalBreakDuration,
  isOnBreak,
  breakTimer,
  setIsOnBreak
) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(async () => {
    const isOnBreak = await checkIfOnBreak(userId);
    if (!isOnBreak) {
      await updateWorkDuration(
        userId,
        setIsClockedIn,
        setTotalBreakDuration,
        addLog,
        clockInTime,
        totalBreakDuration,
        isOnBreak,
        breakTimer,
        setIsOnBreak
      );
    }
  }, 60000); // Update every minute
};

const checkIfOnBreak = async (userId) => {
  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return userData.isOnBreak;
  }
  return false;
};

const calculateLastMonthWorkDuration = (workPeriod) => {
  const now = DateTime.now().setZone("America/Edmonton");
  const lastMonth = now.minus({ months: 1 }).month;
  let lastMonthWorkDuration = 0;

  for (let date in workPeriod) {
    const workDate = DateTime.fromISO(date).setZone("America/Edmonton");
    if (workDate.month === lastMonth) {
      lastMonthWorkDuration += workPeriod[date];
    }
  }

  return lastMonthWorkDuration;
};

const calculateTwoWeeksWorkDuration = (workPeriod) => {
  const now = DateTime.now().setZone("America/Edmonton");
  const thisMonth = now.month;
  const thisYear = now.year;
  let twoWeeksWorkDuration = 0;

  if (now.day <= 15) {
    const startDate = DateTime.local(thisYear, thisMonth, 1).setZone(
      "America/Edmonton"
    );
    const endDate = DateTime.local(thisYear, thisMonth, 15).setZone(
      "America/Edmonton"
    );

    for (let date in workPeriod) {
      const workDate = DateTime.fromISO(date).setZone("America/Edmonton");
      if (workDate >= startDate && workDate <= endDate) {
        twoWeeksWorkDuration += workPeriod[date];
      }
    }
  } else {
    const startDate = DateTime.local(thisYear, thisMonth, 16).setZone(
      "America/Edmonton"
    );
    const endDate = DateTime.local(
      thisYear,
      thisMonth,
      now.daysInMonth
    ).setZone("America/Edmonton");

    for (let date in workPeriod) {
      const workDate = DateTime.fromISO(date).setZone("America/Edmonton");
      if (workDate >= startDate && workDate <= endDate) {
        twoWeeksWorkDuration += workPeriod[date];
      }
    }
  }

  return twoWeeksWorkDuration;
};

const calculateThisMonthWorkDuration = (workPeriod) => {
  const now = DateTime.now().setZone("America/Edmonton");
  const thisMonth = now.month;
  let thisMonthWorkDuration = 0;

  for (let date in workPeriod) {
    const workDate = DateTime.fromISO(date).setZone("America/Edmonton");
    if (workDate.month === thisMonth) {
      thisMonthWorkDuration += workPeriod[date];
    }
  }

  return thisMonthWorkDuration;
};

const updateWorkDuration = async (
  userId,
  setIsClockedIn,
  setTotalBreakDuration,
  addLog,
  clockInTime,
  totalBreakDuration,
  isOnBreak,
  breakTimer,
  setIsOnBreak
) => {
  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "employee", userDoc.id);
    const userData = userDoc.data();

    if (userData.status === "online") {
      const now = DateTime.now().setZone("America/Edmonton");
      const today = now.toISODate();
      const lastOnlineDate = userData.lastOnlineDate || today;

      let workDurationToday = userData.workDurationToday || 0;
      if (today !== lastOnlineDate) {
        workDurationToday = 0;
      }

      const dayOfWeek = now.weekdayLong; // e.g., 'Sunday'
      const workHoursToday = userData.workHours[dayOfWeek];
      const [start, end] = workHoursToday.split(" - ");
      const workDurationLimit = DateTime.fromISO(end).diff(
        DateTime.fromISO(start),
        "minutes"
      ).minutes;

      if (workDurationToday >= workDurationLimit) {
        clearInterval(intervalId);
        alert("Work duration limit for today has been reached.");
        await handleClockOut(
          userId,
          setIsClockedIn,
          setTotalBreakDuration,
          addLog,
          clockInTime,
          totalBreakDuration,
          isOnBreak,
          breakTimer,
          setIsOnBreak
        );
        return;
      }

      const endTime = DateTime.fromISO(end, { zone: "America/Edmonton" }).plus({
        minutes: 30,
      });
      if (now > endTime) {
        clearInterval(intervalId);
        alert("Auto clocking out as work time has ended.");
        await handleClockOut(
          userId,
          setIsClockedIn,
          setTotalBreakDuration,
          addLog,
          clockInTime,
          totalBreakDuration,
          isOnBreak,
          breakTimer,
          setIsOnBreak
        );
        return;
      }

      workDurationToday += 1;

      const updatedWorkPeriod = {
        ...userData.workPeriod,
        [today]: workDurationToday,
      };

      const totalWorkDuration = (userData.totalWorkDuration || 0) + 1;
      const thisMonthWorkDuration =
        calculateThisMonthWorkDuration(updatedWorkPeriod);
      const twoWeeksWorkDuration =
        calculateTwoWeeksWorkDuration(updatedWorkPeriod);
      const lastMonthWorkDuration =
        calculateLastMonthWorkDuration(updatedWorkPeriod);

      await updateDoc(userRef, {
        workDurationToday,
        totalWorkDuration,
        twoWeeksWorkDuration,
        thisMonthWorkDuration,
        lastMonthWorkDuration,
        lastOnlineDate: today,
        workPeriod: updatedWorkPeriod,
      });

      console.log("Work duration updated successfully.");
    } else {
      clearInterval(intervalId);
    }
  }
};

const handleClockIn = async (
  userId,
  setClockInTime,
  setIsClockedIn,
  addLog,
  setTotalBreakDuration,
  clockInTime,
  totalBreakDuration,
  isOnBreak,
  breakTimer,
  setIsOnBreak
) => {
  if (!(await validateLocation(userId))) {
    alert("You are not within the allowed location to clock in.");
    return;
  }
  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "employee", userDoc.id);
      const userData = userDoc.data();

      const now = DateTime.now().setZone("America/Edmonton");
      const dayOfWeek = now.weekdayLong; // e.g., 'Sunday'
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
        alert("It is not within the allowed clock-in time range.");
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
      const updatedWorkPeriod = { ...userData.workPeriod, [today]: 0 };

      await updateDoc(userRef, {
        status: "online",
        workDurationToday: userData.workDurationToday || 0,
        workPeriod: updatedWorkPeriod,
        isOnBreak: false,
      });

      console.log(
        "User status set to online and workDurationToday initialized."
      );
      startInterval(
        userId,
        setIsClockedIn,
        setTotalBreakDuration,
        addLog,
        clockInTime,
        totalBreakDuration,
        isOnBreak,
        breakTimer,
        setIsOnBreak
      );
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
  setTotalBreakDuration,
  addLog,
  clockInTime,
  totalBreakDuration,
  isOnBreak,
  breakTimer,
  setIsOnBreak
) => {
  setIsClockedIn(false);

  const now = DateTime.now().setZone("America/Edmonton");
  if (isOnBreak) {
    clearTimeout(breakTimer);
    addLog(
      `Break ended at ${now.toLocaleString(
        DateTime.DATETIME_FULL_WITH_SECONDS
      )}`
    );
    const breakEndTime = now;
    const breakStartTime = clockInTime.plus({ minutes: totalBreakDuration });
    const breakDuration = breakEndTime.diff(breakStartTime, "minutes").minutes;
    setTotalBreakDuration((prevDuration) => prevDuration + breakDuration);
    setIsOnBreak(false);
  }

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
      await updateDoc(userRef, {
        status: "offline",
        isOnBreak: false,
      });
      console.log("User status set to offline.");
    } else {
      console.log(`User document does not exist for ID: ${userId}`);
    }
  } catch (error) {
    console.error("Error clocking out:", error);
  }
  setTotalBreakDuration(0);
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

    await updateDoc(userRef, {
      isOnBreak: true,
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

export {
  startInterval,
  checkIfOnBreak,
  calculateLastMonthWorkDuration,
  calculateTwoWeeksWorkDuration,
  calculateThisMonthWorkDuration,
  updateWorkDuration,
  handleClockIn,
  handleClockOut,
  handleStartBreak,
};
