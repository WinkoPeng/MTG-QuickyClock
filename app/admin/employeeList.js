import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DateTime } from "luxon";

function EmployeeList({ onEdit }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchEmployees = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "employee"));
    const employeeData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(employeeData);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleExport = () => {
    if (
      !startDate ||
      !endDate ||
      DateTime.fromISO(startDate) > DateTime.fromISO(endDate)
    ) {
      alert("Please select a valid start and end date.");
      return;
    }

    const startDateTime = DateTime.fromISO(startDate).startOf("day");
    const endDateTime = DateTime.fromISO(endDate).endOf("day");
    const dateRange = [];

    for (
      let date = startDateTime;
      date <= endDateTime;
      date = date.plus({ days: 1 })
    ) {
      dateRange.push(date.toISODate());
    }

    const exportData = employees.map((employee) => {
      const workPeriod = employee.workPeriod || {};
      const workTime = employee.workTime || {};
      const dailyDurations = dateRange.map((date) => {
        const workEntry = workTime[date] ? workTime[date] : "N/A";
        const duration = workPeriod[date] ? workPeriod[date] : 0;
        return {
          date,
          workEntry,
          duration,
        };
      });

      const totalDuration = dailyDurations.reduce(
        (sum, { duration }) => sum + duration,
        0
      );
      const formattedTotal = formatWorkDuration(totalDuration);

      return {
        ID: employee.id,
        Name: employee.name,
        dailyDurations,
        Total: formattedTotal,
      };
    });

    const headers = ["ID", "Name", ...dateRange, "Total"];
    const worksheetData = [headers];

    exportData.forEach((employee) => {
      const row1 = [employee.ID, employee.Name];
      const row2 = ["", ""];
      const row3 = ["", ""];

      employee.dailyDurations.forEach(({ date, workEntry, duration }) => {
        row1.push(date);
        row2.push(workEntry);
        row3.push(formatWorkDuration(duration));
      });

      row1.push("");
      row2.push("");
      row3.push(employee.Total);

      worksheetData.push(row1);
      worksheetData.push(row2);
      worksheetData.push(row3);
      worksheetData.push([]); // Add an empty row between employees
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = [
      { wpx: 50 }, // ID column
      { wpx: 110 }, // Name column
      ...dateRange.map(() => ({ wpx: 150 })), // Date & Duration columns
      { wpx: 100 }, // Total column
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "employees.xlsx");
  };

  const formatWorkDuration = (duration) => {
    const hours = (duration / 60).toFixed(1);
    return `${hours}h`;
  };

  const getToday = () => {
    const today = DateTime.now().setZone("America/Edmonton").toFormat("cccc");
    return today;
  };

  const today = getToday();

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchTerm === "" ||
      Object.values(employee).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      );
    const isOnline = employee.status === "online";
    const workDurationToday = employee.workDurationToday || 0;

    const isWorkingToday =
      employee.workHours && employee.workHours[today] !== " - ";
    const matchesFilter =
      filter === "all" ||
      (filter === "online" && isOnline) ||
      (filter === "workingToday" && isWorkingToday) ||
      (filter === "offToday" && !isWorkingToday);

    return matchesSearch && matchesFilter;
  });

  const getLast7Days = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      last7Days.push(DateTime.now().minus({ days: i }).toISODate());
    }
    return last7Days;
  };

  const last7Days = getLast7Days();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded-md w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="p-2 border rounded-md w-full md:w-1/4 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">Show All</option>
            <option value="online">Online Only</option>
            <option value="workingToday">Working Today</option>
            <option value="offToday">Off Today</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="p-2 border rounded-md w-full md:w-1/4 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="p-2 border rounded-md w-full md:w-1/4 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            onClick={handleExport}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 w-full md:w-auto"
          >
            Export Employee List
          </button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">
              {employee.name} - {employee.title}
            </h3>
            <p className="text-sm mb-2 dark:text-gray-200">
              Status:{" "}
              <span
                className={`font-bold ${
                  employee.status === "online"
                    ? "text-green-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {employee.status === "online" ? "Online" : "Offline"}
              </span>
            </p>
            <p className="text-sm mb-2 dark:text-gray-200">
              Today's Work Hours:{" "}
              {formatWorkDuration(employee.workDurationToday)}
            </p>
            <p className="text-sm mb-4 dark:text-gray-200">
              This Month's Work Hours:{" "}
              {formatWorkDuration(employee.thisMonthWorkDuration || 0)}
            </p>
            <button
              onClick={() => onEdit(employee)}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse bg-gray-100 dark:bg-gray-800">
          <thead>
            <tr>
              <th className="border p-2 dark:bg-gray-700 dark:text-gray-300">
                ID
              </th>
              <th className="border p-2 dark:bg-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="border p-2 dark:bg-gray-700 dark:text-gray-300">
                Title
              </th>
              {last7Days.map((date) => (
                <th
                  key={date}
                  className="border p-2 dark:bg-gray-700 dark:text-gray-300"
                >
                  {date}
                </th>
              ))}
              <th className="border p-2 dark:bg-gray-700 dark:text-gray-300">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const totalLast7Days = last7Days.reduce((sum, date) => {
                return (
                  sum +
                  ((employee.workPeriod && employee.workPeriod[date]) || 0)
                );
              }, 0);

              return (
                <tr key={employee.id} className="dark:text-gray-200">
                  <td className="border p-2">{employee.id}</td>
                  <td className="border p-2">{employee.name}</td>
                  <td className="border p-2">{employee.title}</td>
                  {last7Days.map((date) => (
                    <td key={date} className="border p-2">
                      {(employee.workPeriod && employee.workPeriod[date]) ||
                        "0"}
                    </td>
                  ))}
                  <td className="border p-2">
                    {formatWorkDuration(totalLast7Days)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
