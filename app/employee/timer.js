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

const startInterval = (userId, setWorkDurationToday) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(async () => {
    await updateWorkDuration(userId, setWorkDurationToday);
  }, 60000); // Update every minute
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

const updateWorkDuration = async (userId, setWorkDurationToday) => {
  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "employee", userDoc.id);
    const userData = userDoc.data();

    if (userData.status === "online") {
      const now = DateTime.now().setZone("America/Edmonton");
      const today = now.toISODate();
      const clockInEntry = userData.workTime[today];
      const startTime = DateTime.fromISO(clockInEntry.split(" - ")[0], {
        zone: "America/Edmonton",
      });
      const totalBreakDuration = userData.totalBreakDuration || 0;
      let workDurationToday = Math.round(
        now.diff(startTime, "minutes").minutes - totalBreakDuration
      );

      if (workDurationToday < 0) {
        workDurationToday = 0;
      }

      setWorkDurationToday(workDurationToday);

      const updatedWorkPeriod = {
        ...userData.workPeriod,
        [today]: workDurationToday,
      };

      await updateDoc(userRef, {
        workDurationToday,
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
  setWorkDurationToday
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
      const updatedWorkTime = {
        ...userData.workTime,
        [today]: clockInTime.toFormat("HH:mm"),
      };

      await updateDoc(userRef, {
        status: "online",
        workDurationToday: 0,
        workTime: updatedWorkTime,
        totalBreakDuration: 0,
        isOnBreak: false,
      });

      console.log(
        "User status set to online and workDurationToday initialized."
      );
      startInterval(userId, setWorkDurationToday);
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
  setWorkDurationToday,
  setIsOnBreak
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
      const clockInEntry = userData.workTime[today];
      const startTime = DateTime.fromISO(clockInEntry, {
        zone: "America/Edmonton",
      });
      let totalWorkDurationToday = Math.round(
        now.diff(startTime, "minutes").minutes -
          (userData.totalBreakDuration || 0)
      );

      // 确保工作时长不为负数
      if (totalWorkDurationToday < 0) {
        totalWorkDurationToday = 0;
      }

      const updatedWorkPeriod = {
        ...userData.workPeriod,
        [today]: totalWorkDurationToday,
      };
      const updatedWorkTime = {
        ...userData.workTime,
        [today]: `${clockInEntry} - ${clockOutTime.toFormat("HH:mm")}`,
      };

      await updateDoc(userRef, {
        status: "offline",
        lastOnlineDate: today, // 仅保存日期
        isOnBreak: false,
        workDurationToday: totalWorkDurationToday,
        workPeriod: updatedWorkPeriod,
        workTime: updatedWorkTime,
      });

      console.log("User status set to offline and work duration updated.");
      setWorkDurationToday(totalWorkDurationToday);
      setIsOnBreak(false); // 恢复休息按钮
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

const formatWorkDuration = (duration) => {
  if (duration === 0) {
    return "0 h 0 m";
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours} h ${minutes} m`;
};

export {
  handleClockIn,
  handleClockOut,
  handleStartBreak,
  updateWorkDuration,
  formatWorkDuration,
};
