import {
  collection,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { DateTime } from "luxon";
import db from "../firebase";
import { validateLocation } from "./geolocate";

const handleClockIn = async (
  employeeData,
  employeeDocId,
  setIsClockedIn,
  setIsLoading
) => {
  setIsLoading(true);

  const geofenceId = employeeData.geofence; // Extract geofence ID

  console.log("Geofence ID:", geofenceId);

  // Validate location using geofence ID
  if (!(await validateLocation(geofenceId))) {
    setIsLoading(false);
    alert("You are not within the allowed location to clock in.");
    return;
  }

  const now = DateTime.now().setZone("America/Edmonton");
  const dayOfWeek = now.weekdayLong;

  const workHoursToday = employeeData.workHours[dayOfWeek];

  if (workHoursToday === " - ") {
    setIsLoading(false);
    alert("Today is a day off, you cannot clock in.");
    return;
  }

  const [start, end] = workHoursToday.split(" - ");
  const startTime = DateTime.fromISO(start, { zone: "America/Edmonton" }).minus(
    { minutes: 30 }
  );
  const endTime = DateTime.fromISO(end, { zone: "America/Edmonton" }).plus({
    minutes: 30,
  });

  if (now < startTime || now > endTime) {
    setIsLoading(false);
    alert("You cannot clock in outside your scheduled hours.");
    return;
  }

  setIsClockedIn(true);
  const clockInTime = now;

  const today = now.toISODate();
  const updatedWorkTime = {
    ...employeeData.workTime,
    [today]: [
      ...(employeeData.workTime[today] || []),
      { clockIn: clockInTime.toFormat("HH:mm") },
    ],
  };

  try {
    // Use the stored document ID for updating
    const docRef = doc(db, "employee", employeeDocId);
    await updateDoc(docRef, {
      status: "online",
      workTime: updatedWorkTime,
      totalBreakDuration: 0,
      ...(!employeeData.workTime[today] && { workDurationToday: 0 }), // Reset work duration to 0 if no work time data exists for today
    });
  } catch (error) {
    console.error("Error updating document:", error);
  } finally {
    setIsLoading(false);
  }
};

const handleClockOut = async (employeeData, employeeDocId, setIsClockedIn) => {
  setIsClockedIn(false);

  const now = DateTime.now().setZone("America/Edmonton");
  const clockOutTime = now;
  const today = now.toISODate();

  try {
    const workTimeToday = employeeData.workTime[today] || [];

    // Ensure there is a clock-in entry to update
    const lastClockInEntry =
      workTimeToday.length > 0 ? workTimeToday[workTimeToday.length - 1] : null;

    if (
      !lastClockInEntry ||
      !lastClockInEntry.clockIn ||
      lastClockInEntry.clockOut
    ) {
      console.log("No valid clock-in entry found for today.");
      return;
    }

    const clockInDateTime = DateTime.fromISO(lastClockInEntry.clockIn, {
      zone: "America/Edmonton",
    });

    // Calculate work duration
    const workDurationToday = clockOutTime
      .startOf("minute")
      .diff(clockInDateTime, "minutes").minutes;

    if (workDurationToday < 0) {
      console.log("Clock-out time is earlier than clock-in time.");
      return;
    }

    const previousWorkDuration = employeeData.workPeriod[today] || 0;
    const totalWorkDurationToday = previousWorkDuration + workDurationToday;

    // Update the last clock-in entry with clock-out time
    const updatedWorkTimeToday = workTimeToday.map((entry) =>
      entry.clockIn === lastClockInEntry.clockIn
        ? { ...entry, clockOut: clockOutTime.toFormat("HH:mm") }
        : entry
    );

    // Update the document with new work time and period
    await updateDoc(doc(db, "employee", employeeDocId), {
      status: "offline",
      lastOnlineDate: today,
      workDurationToday: totalWorkDurationToday,
      workPeriod: {
        ...employeeData.workPeriod,
        [today]: totalWorkDurationToday,
      },
      workTime: {
        ...employeeData.workTime,
        [today]: updatedWorkTimeToday,
      },
    });
  } catch (error) {
    console.error("Error clocking out:", error);
  }
};

export { handleClockIn, handleClockOut };
