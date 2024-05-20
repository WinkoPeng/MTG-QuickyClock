// timer.js
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { DateTime } from 'luxon';
import db from '../firebase';

let intervalId = null;

export const updateWorkDuration = async (userId) => {
  const q = query(collection(db, "employee"), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, 'employee', userDoc.id);
    const userData = userDoc.data();

    const now = DateTime.now().setZone('America/Edmonton');
    const today = now.toISODate();
    const lastOnlineDate = userData.lastOnlineDate || today;

    let workDurationToday = userData.workDurationToday || 0;
    if (today !== lastOnlineDate) {
      workDurationToday = 0;
    }

    workDurationToday += 1;

    const totalWorkDuration = (userData.totalWorkDuration || 0) + 1;
    const twoWeeksWorkDuration = (userData.twoWeeksWorkDuration || 0) + 1;
    const thisMonthWorkDuration = (userData.thisMonthWorkDuration || 0) + 1;

    const thisMonth = now.month;
    const lastMonth = DateTime.fromISO(lastOnlineDate).month;
    let lastMonthWorkDuration = userData.lastMonthWorkDuration || 0;
    if (thisMonth !== lastMonth) {
      lastMonthWorkDuration = thisMonthWorkDuration;
    }

    await updateDoc(userRef, {
      workDurationToday,
      totalWorkDuration,
      twoWeeksWorkDuration,
      thisMonthWorkDuration,
      lastMonthWorkDuration,
      lastOnlineDate: today
    });

    console.log('Work duration updated successfully.');
  }
};

export const handleClockIn = async (userId, setClockInTime, setIsClockedIn, addLog) => {
  setIsClockedIn(true);
  const clockInTime = DateTime.now().setZone('America/Edmonton');
  setClockInTime(clockInTime);
  addLog(`Clocked In at ${clockInTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);

  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'employee', userDoc.id);
      await updateDoc(userRef, {
        status: 'online',
        workDurationToday: userDoc.data().workDurationToday || 0,
      });
      console.log('User status set to online and workDurationToday initialized.');

      intervalId = setInterval(() => {
        updateWorkDuration(userId);
      }, 60000); // Update every minute
    } else {
      console.log(`User document does not exist for ID: ${userId}`);
    }
  } catch (error) {
    console.error('Error clocking in:', error);
  }
};

export const handleClockOut = async (userId, setIsClockedIn, setTotalBreakDuration, addLog, clockInTime, totalBreakDuration, isOnBreak, breakTimer, setIsOnBreak) => {
  clearInterval(intervalId);
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
  const workDuration = clockOutTime.diff(clockInTime, 'minutes').minutes - totalBreakDuration;
  
  let hours = Math.floor(workDuration / 60);
  let minutes = workDuration % 60;

  if (hours < 0 || (hours === 0 && minutes < 0)) {
    hours = 0;
    minutes = 0;
  }

  addLog(`Clocked Out at ${clockOutTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
  addLog(`Duration: ${hours} hours ${minutes} minutes, from ${clockInTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)} to ${clockOutTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);

  const q = query(collection(db, "employee"), where("id", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'employee', userDoc.id);
      await updateDoc(userRef, {
        status: 'offline',
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
