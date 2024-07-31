"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Pie, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { DateTime } from "luxon";
import db from "../firebase";

function Dashboard() {
  // State variables for managing employee data, filters, and statistics
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [titleFilter, setTitleFilter] = useState("All Positions");
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

  // Fetch employee data from Firestore and apply filters
  const fetchEmployeeData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "employee"));
    const employees = querySnapshot.docs.map((doc) => doc.data());
    setEmployeeData(employees);
    applyFilters("", "All Positions"); // Apply default filters after fetching data
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  // Apply filters whenever employee data, search term, or title filter changes
  useEffect(() => {
    applyFilters(searchTerm, titleFilter);
  }, [employeeData, searchTerm, titleFilter]);

  // Filter employee data based on search term and title filter, and update statistics
  const applyFilters = (searchTerm, titleFilter) => {
    const term = searchTerm.toLowerCase();
    const filtered = employeeData.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearchTerm = fullName.includes(term);
      const matchesTitleFilter =
        titleFilter === "All Positions" || emp.title === titleFilter;

      return matchesSearchTerm && matchesTitleFilter;
    });

    setFilteredEmployeeData(filtered);
    updateStatistics(filtered);
  };

  // Update statistics based on the filtered data
  const updateStatistics = (filteredData) => {
    const today = DateTime.now();

    const yesterday = today.minus({ days: 1 }).toISODate();

    // Calculate the number of employees working today
    const employeesWorkingToday = filteredData.filter((emp) => {
      const workHours = emp.workHours && emp.workHours[today.weekdayLong];
      return workHours && workHours !== " - ";
    });

    // Calculate the number of online employees
    const onlineEmployees = employeesWorkingToday.filter(
      (emp) => emp.status === "online"
    );

    // Calculate average work hours for filtered employees
    const totalWorkHoursInMinutes = filteredData.reduce(
      (acc, emp) => acc + (emp.workPeriod[yesterday] || 0),
      0
    );
    const avgWorkHoursInMinutes =
      filteredData.length > 0
        ? totalWorkHoursInMinutes / filteredData.length
        : 0;
    const avgHours = Math.floor(avgWorkHoursInMinutes / 60);
    const avgMinutes = Math.floor(avgWorkHoursInMinutes % 60);

    // Calculate weekly work hours data
    const startDate = today.minus({ days: 6 }).startOf("day");
    const endDate = today.endOf("day");
    const dateRange = [];
    for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
      dateRange.push(date.toFormat("yyyy-MM-dd"));
    }

    const weeklyData = filteredData.map((emp) => {
      const workPeriod = emp.workPeriod || {};
      const workHours = dateRange.map((date) => (workPeriod[date] || 0) / 60);
      return { name: `${emp.firstName} ${emp.lastName}`, workHours };
    });

    // Update state with calculated statistics
    setWorkingTodayCount(employeesWorkingToday.length);
    setWorkingTodayEmployees(employeesWorkingToday);
    setOnlineCount(onlineEmployees.length);
    setTotalEmployees(filteredData.length);
    setAverageWorkHours({ hours: avgHours, minutes: avgMinutes });
    setWeeklyWorkHours(weeklyData);
  };

  // Handle search input change
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(term, titleFilter);
  };

  // Data for Pie chart displaying online vs offline employees
  const pieData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [onlineCount, workingTodayCount - onlineCount],
        backgroundColor: ["#4caf50", "#9e9e9e"],
      },
    ],
  };

  // Data for Line chart displaying weekly work hours for selected employee
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

  // Data for Bar chart displaying average weekly work hours
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
          .map((total) => total / weeklyWorkHours.length),
        backgroundColor: "#007bff",
      },
    ],
  };

  // Handle employee click to display their work hours in the Line chart
  const handleEmployeeClick = (employee) => {
    const selected = weeklyWorkHours.find((emp) => emp.name === employee.name);
    setSelectedEmployee(selected);
  };

  // Options for the Line chart
  const areaOptions = {
    plugins: {
      legend: {
        display: false, // Hide chart legend
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-200 dark:bg-gray-900">
      {/* Search and filter inputs */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employee by name"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-900 dark:text-gray-100"
        />
        <select
          value={titleFilter}
          onChange={(e) => {
            setTitleFilter(e.target.value);
            applyFilters(searchTerm, e.target.value);
          }}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value="All Positions">All Positions</option>
          <option value="Instructor">Instructor</option>
          <option value="Program Coordinator">Program Coordinator</option>
          <option value="Administrative Officer">Administrative Officer</option>
          <option value="Receptionist">Receptionist</option>
        </select>
      </div>

      {/* Statistics cards */}
      <div className="flex flex-wrap gap-5 mb-5">
        <div className="bg-blue-600 text-white p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">
            {titleFilter} Employee Utilization for Today
          </h3>
          <p className="text-xl">
            {workingTodayCount}/{totalEmployees}
          </p>
        </div>
        <div className="bg-yellow-400 text-black p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">
            {titleFilter} Employees Scheduled for Today
          </h3>
          <ul className="flex flex-col items-center w-full mt-4">
            {workingTodayEmployees.map((emp, index) => (
              <li
                key={index}
                className="bg-gray-200 text-black p-2 rounded-lg mb-1 w-full text-center dark:bg-gray-700 dark:text-gray-200"
              >
                {emp.firstName} {emp.lastName}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-green-600 text-white p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">
            {titleFilter} Employees Currently Clocked In
          </h3>
          <p className="text-xl">
            {onlineCount}/{workingTodayCount}
          </p>
        </div>
        <div className="bg-pink-600 text-white p-5 rounded-lg shadow-lg flex-1 min-w-[250px] flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">
            {titleFilter} Average Work Hours Yesterday
          </h3>
          <p className="text-xl">
            {averageWorkHours.hours} hours {averageWorkHours.minutes} mins
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-wrap gap-5 text-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg flex-1 min-w-[250px]">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
            {titleFilter} Weekly Work Hours
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
            {titleFilter} Average Weekly Work Hours
          </h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Employee data table */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg mt-5 w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  First Name
                </th>
                <th className="border-b px-4 py-2 text-left bg-gray-100 dark:bg-gray-700 text-sm md:text-base dark:text-gray-300">
                  Last Name
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
                  This Month&apos;s Work Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployeeData.map((row, index) => (
                <tr
                  key={index}
                  className="text-sm md:text-base dark:text-gray-200"
                >
                  <td className="border-b px-4 py-2">{row.firstName}</td>
                  <td className="border-b px-4 py-2">{row.lastName}</td>
                  <td className="border-b px-4 py-2">{row.title}</td>
                  <td className="border-b px-4 py-2">
                    {row.status == "offline" ? "Clocked out" : "Clocked in"}
                  </td>
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
