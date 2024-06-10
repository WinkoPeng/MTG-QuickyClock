import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { DateTime } from 'luxon';
import db from '../firebase';

let intervalId = null;

const startInterval = (userId) => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(async () => {
    const isOnBreak = await checkIfOnBreak(userId);
    if (!isOnBreak) {
      updateWorkDuration(userId);
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
  const now = DateTime.now().setZone('America/Edmonton');
  const lastMonth = now.minus({ months: 1 }).month;
  let lastMonthWorkDuration = 0;

  for (let date in workPeriod) {
    const workDate = DateTime.fromISO(date).setZone('America/Edmonton');
    if (workDate.month === lastMonth) {
      lastMonthWorkDuration += workPeriod[date];
    }
  }

  return lastMonthWorkDuration;
};

const calculateTwoWeeksWorkDuration = (workPeriod) => {
  const now = DateTime.now().setZone('America/Edmonton');
  const thisMonth = now.month;
  const thisYear = now.year;
  let twoWeeksWorkDuration = 0;

  if (now.day <= 15) {
    const startDate = DateTime.local(thisYear, thisMonth, 1).setZone('America/Edmonton');
    const endDate = DateTime.local(thisYear, thisMonth, 15).setZone('America/Edmonton');

    for (let date in workPeriod) {
      const workDate = DateTime.fromISO(date).setZone('America/Edmonton');
      if (workDate >= startDate && workDate <= endDate) {
        twoWeeksWorkDuration += workPeriod[date];
      }
    }
  } else {
    const startDate = DateTime.local(thisYear, thisMonth, 16).setZone('America/Edmonton');
    const endDate = DateTime.local(thisYear, thisMonth, now.daysInMonth).setZone('America/Edmonton');

    for (let date in workPeriod) {
      const workDate = DateTime.fromISO(date).setZone('America/Edmonton');
      if (workDate >= startDate && workDate <= endDate) {
        twoWeeksWorkDuration += workPeriod[date];
      }
    }
  }

  return twoWeeksWorkDuration;
};

const calculateThisMonthWorkDuration = (workPeriod) => {
  const now = DateTime.now().setZone('America/Edmonton');
  const thisMonth = now.month;
  let thisMonthWorkDuration = 0;

  for (let date in workPeriod) {
    const workDate = DateTime.fromISO(date).setZone('America/Edmonton');
    if (workDate.month === thisMonth) {
      thisMonthWorkDuration += workPeriod[date];
    }
  }

  return thisMonthWorkDuration;
};

export const updateWorkDuration = async (userId) => {
  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'employee', userDoc.id);
    const userData = userDoc.data();

    if (userData.status === 'online') {
      const now = DateTime.now().setZone('America/Edmonton');
      const today = now.toISODate();
      const lastOnlineDate = userData.lastOnlineDate || today;

      let workDurationToday = userData.workDurationToday || 0;
      if (today !== lastOnlineDate) {
        workDurationToday = 0;
      }

      workDurationToday += 1;

      // Update workPeriod with today's date and current duration
      const updatedWorkPeriod = { ...userData.workPeriod, [today]: workDurationToday };

      const totalWorkDuration = (userData.totalWorkDuration || 0) + 1;
      const thisMonthWorkDuration = calculateThisMonthWorkDuration(updatedWorkPeriod);
      const twoWeeksWorkDuration = calculateTwoWeeksWorkDuration(updatedWorkPeriod);
      const lastMonthWorkDuration = calculateLastMonthWorkDuration(updatedWorkPeriod);

      await updateDoc(userRef, {
        workDurationToday,
        totalWorkDuration,
        twoWeeksWorkDuration,
        thisMonthWorkDuration,
        lastMonthWorkDuration,
        lastOnlineDate: today,
        workPeriod: updatedWorkPeriod
      });

      console.log('Work duration updated successfully.');
    } else {
      clearInterval(intervalId);
    }
  }
};

export const handleClockIn = async (userId, setClockInTime, setIsClockedIn, addLog) => {
  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'employee', userDoc.id);
      const userData = userDoc.data();

      // Check if the employee should work today
      const now = DateTime.now().setZone('America/Edmonton');
      const dayOfWeek = now.weekdayLong; // e.g., 'Monday'
      const workHoursToday = userData.workHours[dayOfWeek];

      if (workHoursToday === ' - ') {
        alert("You cannot clock in today as it's your day off.");
        return;
      }

      setIsClockedIn(true);
      const clockInTime = now;
      setClockInTime(clockInTime);
      addLog(`Clocked In at ${clockInTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);

      // Initialize workPeriod for today
      const today = now.toISODate();
      const updatedWorkPeriod = { ...userData.workPeriod, [today]: 0 };

      await updateDoc(userRef, {
        status: 'online',
        workDurationToday: userData.workDurationToday || 0,
        workPeriod: updatedWorkPeriod,
        isOnBreak: false
      });

      console.log('User status set to online and workDurationToday initialized.');
      startInterval(userId);
    } else {
      console.log(`User document does not exist for ID: ${userId}`);
    }
  } catch (error) {
    console.error('Error clocking in:', error);
  }
};

export const handleClockOut = async (userId, setIsClockedIn, setTotalBreakDuration, addLog, clockInTime, totalBreakDuration, isOnBreak, breakTimer, setIsOnBreak) => {
  setIsClockedIn(false);

  const now = DateTime.now().setZone('America/Edmonton');
  if (isOnBreak) {
    clearTimeout(breakTimer);
    addLog(`Break ended at ${now.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
    const breakEndTime = now;
    const breakStartTime = clockInTime.plus({ minutes: totalBreakDuration });
    const breakDuration = breakEndTime.diff(breakStartTime, 'minutes').minutes;
    setTotalBreakDuration((prevDuration) => prevDuration + breakDuration);
    setIsOnBreak(false);
  }

  const clockOutTime = now;

  addLog(`Clocked Out at ${clockOutTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);

  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'employee', userDoc.id);
      await updateDoc(userRef, {
        status: 'offline',
        isOnBreak: false
      });
      console.log('User status set to offline.');
    } else {
      console.log(`User document does not exist for ID: ${userId}`);
    }
  } catch (error) {
    console.error('Error clocking out:', error);
  }
  setTotalBreakDuration(0);
};

export const handleStartBreak = async (userId, setIsOnBreak, setBreakTimer, breakDuration, addLog) => {
  setIsOnBreak(true);
  addLog(`Break started at ${DateTime.now().setZone('America/Edmonton').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);

  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'employee', userDoc.id);

    await updateDoc(userRef, {
      isOnBreak: true
    });

    setBreakTimer(
      setTimeout(async () => {
        setIsOnBreak(false);
        addLog(`Break ended at ${DateTime.now().setZone('America/Edmonton').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
        const userRef = doc(db, 'employee', userDoc.id);
        await updateDoc(userRef, {
          isOnBreak: false
        });
        setBreakTimer(null);
      }, breakDuration * 60 * 1000) // breakDuration is in minutes, converting to milliseconds
    );
  }
};
