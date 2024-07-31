"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";
import { DateTime } from "luxon";

// Generate random clock-in and clock-out times with a daily cap of 8 hours
const generateRandomClockTimes = (startDate, endDate) => {
  const times = [];
  const start = DateTime.fromISO(startDate).startOf("day");
  const end = DateTime.fromISO(endDate).endOf("day");

  for (let date = start; date <= end; date = date.plus({ days: 1 })) {
    let totalMinutes = 0;
    let lastClockOutTime = date.set({ hour: 9, minute: 0 }); // Start at 9 AM or the start of the day
    const maxMinutesPerDay = 8 * 60; // 8 hours in minutes

    while (totalMinutes < maxMinutesPerDay) {
      const clockIn = lastClockOutTime.plus({ hours: 1 }); // Set clock-in 1 hour after last clock-out
      const clockInHour = clockIn.hour + Math.floor(Math.random() * 4) + 1; // Clock out 1-4 hours after clock-in
      const clockInMinute = Math.floor(Math.random() * 60);
      const clockOut = clockIn
        .set({ hour: clockInHour, minute: clockInMinute })
        .toFormat("HH:mm");

      const duration = calculateDurationInMinutes(
        clockIn.toFormat("HH:mm"),
        clockOut
      );

      // Check if adding this duration exceeds the daily cap
      if (totalMinutes + duration > maxMinutesPerDay) {
        break;
      }

      times.push({
        clockIn: clockIn.toFormat("HH:mm"),
        clockOut: clockOut,
      });

      totalMinutes += duration;
      lastClockOutTime = DateTime.fromFormat(clockOut, "HH:mm");
    }
  }

  return times;
};

// Calculate the duration between two times
const calculateDurationInMinutes = (clockIn, clockOut) => {
  const clockInTime = DateTime.fromFormat(clockIn, "HH:mm");
  const clockOutTime = DateTime.fromFormat(clockOut, "HH:mm");
  return Math.max(
    0,
    Math.floor(clockOutTime.diff(clockInTime, "minutes").minutes)
  );
};

// Function to update workTime, workPeriod, and thisMonthWorkDuration for each employee
const updateEmployeeTimes = (employees, startDate, endDate) => {
  const dateRange = [];
  const start = DateTime.fromISO(startDate).startOf("day");
  const end = DateTime.fromISO(endDate).endOf("day");

  for (let date = start; date <= end; date = date.plus({ days: 1 })) {
    dateRange.push(date.toISODate());
  }

  return employees.map((employee) => {
    const workTime = {};
    const workPeriod = {};
    let totalMonthDuration = 0;
    let workDurationToday = 0;

    dateRange.forEach((date, index) => {
      const randomTimes = generateRandomClockTimes(date, date);
      let totalDuration = 0;

      randomTimes.forEach(({ clockIn, clockOut }) => {
        const duration = calculateDurationInMinutes(clockIn, clockOut);
        if (!workTime[date]) workTime[date] = [];
        workTime[date].push({ clockIn, clockOut });
        totalDuration += duration;
      });

      workPeriod[date] = totalDuration;
      totalMonthDuration += totalDuration;

      // Set workDurationToday only for the last day in the range
      if (index === dateRange.length - 1) {
        workDurationToday = totalDuration;
      }
    });

    return {
      ...employee,
      workTime,
      workPeriod,
      thisMonthWorkDuration: totalMonthDuration,
      workDurationToday,
      lastOnlineDate: end.toISODate(), // Set lastOnlineDate to the end date of the range
    };
  });
};

function MockData() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("2024-07-16");
  const [endDate, setEndDate] = useState("2024-07-30");

  const fetchEmployees = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "employee"));
    const employeeData = querySnapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));
    setEmployees(employeeData);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateEmployees = async () => {
    const updatedEmployees = updateEmployeeTimes(employees, startDate, endDate);

    for (const employee of updatedEmployees) {
      const employeeRef = doc(db, "employee", employee.firestoreId);
      await updateDoc(employeeRef, {
        workTime: employee.workTime,
        workPeriod: employee.workPeriod,
        thisMonthWorkDuration: employee.thisMonthWorkDuration,
        workDurationToday: employee.workDurationToday,
        lastOnlineDate: employee.lastOnlineDate, // Update lastOnlineDate
      });
    }

    // After updating, refetch the employees to reflect changes
    fetchEmployees();
  };

  useEffect(() => {
    // Optionally, you can call updateEmployees() here or on some trigger
    // For example: updateEmployees(); // Uncomment to execute immediately
  }, [employees, fetchEmployees]);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        {/* Add more filter options if needed */}
      </select>
      <button onClick={updateEmployees}>Update Employee Times</button>
      <ul>
        {filteredEmployees.map((employee) => (
          <li key={employee.firestoreId}>
            {employee.firstName} {employee.lastName} -{" "}
            {employee.thisMonthWorkDuration
              ? `${employee.thisMonthWorkDuration} minutes`
              : "No work period"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MockData;
