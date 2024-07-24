"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Pie, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { DateTime } from "luxon";
import db from "../firebase";

function Dashboard() {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [workingTodayCount, setWorkingTodayCount] = useState(0);
  const [workingTodayEmployees, setWorkingTodayEmployees] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [averageWorkHours, setAverageWorkHours] = useState({
    hours: 0,
    minutes: 0,
  });
  const [weeklyWorkHours, setWeeklyWorkHours] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployeeData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "employee"));
    const employees = querySnapshot.docs.map((doc) => doc.data());

    const today = DateTime.now();
    const startDate = today.minus({ days: 6 }).startOf("day");
    const endDate = today.endOf("day");
    const dateRange = [];
    for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
      dateRange.push(date.toFormat("yyyy-MM-dd"));
    }

    const employeesWorkingToday = employees.filter((emp) => {
      const workHours = emp.workHours && emp.workHours[today.weekdayLong];
      return workHours && workHours !== " - ";
    });

    const onlineEmployees = employeesWorkingToday.filter(
      (emp) => emp.status === "online"
    );

    const totalWorkHoursInMinutes = employees.reduce(
      (acc, emp) => acc + (emp.workDurationToday || 0),
      0
    );
    const avgWorkHoursInMinutes = totalWorkHoursInMinutes / employees.length;
    const avgHours = Math.floor(avgWorkHoursInMinutes / 60);
    const avgMinutes = Math.floor(avgWorkHoursInMinutes % 60);

    const weeklyData = employees.map((emp) => {
      const workPeriod = emp.workPeriod || {};
      const workHours = dateRange.map((date) => (workPeriod[date] || 0) / 60);
      return { name: emp.name, workHours };
    });

    setEmployeeData(employees);
    setFilteredEmployeeData(employees); // Initialize to show all employees
    setWorkingTodayCount(employeesWorkingToday.length);
    setWorkingTodayEmployees(employeesWorkingToday);
    setOnlineCount(onlineEmployees.length);
    setTotalEmployees(employees.length);
    setAverageWorkHours({ hours: avgHours, minutes: avgMinutes });
    setWeeklyWorkHours(weeklyData);
  }, []);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEmployeeData(
      employeeData.filter(
        (emp) =>
          emp.name.toLowerCase().includes(term) ||
          emp.title.toLowerCase().includes(term)
      )
    );
  };

  const pieData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [onlineCount, workingTodayCount - onlineCount],
        backgroundColor: ["#4caf50", "#9e9e9e"],
      },
    ],
  };

  const areaData = {
    labels: Array.from({ length: 7 }, (_, i) =>
      DateTime.now()
        .minus({ days: 6 - i })
        .toFormat("yyyy-MM-dd")
    ),
    datasets: selectedEmployee
      ? [
          {
            label: selectedEmployee.name,
            data: selectedEmployee.workHours,
            fill: true,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
          },
        ]
      : [],
  };

  const barData = {
    labels: Array.from({ length: 7 }, (_, i) =>
      DateTime.now()
        .minus({ days: 6 - i })
        .toFormat("yyyy-MM-dd")
    ),
    datasets: [
      {
        label: "Average Weekly Work Hours",
        data: weeklyWorkHours
          .reduce((acc, emp) => {
            emp.workHours.forEach((hours, index) => {
              acc[index] = (acc[index] || 0) + hours;
            });
            return acc;
          }, [])
          .map((total) => total / weeklyWorkHours.length / 60),
        backgroundColor: "#007bff",
      },
    ],
  };

  const handleEmployeeClick = (employee) => {
    const selected = weeklyWorkHours.find((emp) => emp.name === employee.name);
    setSelectedEmployee(selected);
  };

  const areaOptions = {
    plugins: {
      legend: {
        display: false, // Hide chart legend
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap gap-5 mb-5">
        <div className="bg-blue-600 text-white p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Today's Work Count</h3>
          <p className="text-xl">
            {workingTodayCount}/{totalEmployees}
          </p>
        </div>
        <div className="bg-yellow-400 text-black p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Employees Working Today</h3>
          <ul className="flex flex-col items-center w-full mt-4">
            {workingTodayEmployees.map((emp, index) => (
              <li
                key={index}
                className="bg-gray-200 text-black p-2 rounded-lg mb-1 w-full text-center dark:bg-gray-700 dark:text-gray-200"
              >
                {emp.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-green-600 text-white p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Real-time Online Count</h3>
          <p className="text-xl">{onlineCount}</p>
        </div>
        <div className="bg-pink-600 text-white p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Average Work Hours Today</h3>
          <p className="text-xl">
            {averageWorkHours.hours} hours {averageWorkHours.minutes} mins
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 text-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg flex-1 min-w-[250px]">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
            Weekly Work Hours
          </h3>
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {weeklyWorkHours.map((emp, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  selectedEmployee?.name === emp.name
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => handleEmployeeClick(emp)}
              >
                {emp.name}
              </span>
            ))}
          </div>
          <Line data={areaData} options={areaOptions} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg flex-1 min-w-[250px]">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
            Average Weekly Work Hours
          </h3>
          <Bar data={barData} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg mt-5 w-full">
        <input
          type="text"
          placeholder="Search by name or position"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-900 dark:text-gray-100"
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  Name
                </th>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  Position
                </th>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  Status
                </th>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  Last Online
                </th>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  This Month's Work Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployeeData.map((row, index) => (
                <tr
                  key={index}
                  className="text-sm md:text-base dark:text-gray-200"
                >
                  <td className="border-b px-4 py-2">{row.name}</td>
                  <td className="border-b px-4 py-2">{row.title}</td>
                  <td className="border-b px-4 py-2">{row.status}</td>
                  <td className="border-b px-4 py-2">{row.lastOnlineDate}</td>
                  <td className="border-b px-4 py-2">
                    {(row.thisMonthWorkDuration / 60).toFixed(1)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
