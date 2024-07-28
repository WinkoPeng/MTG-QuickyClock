import React, { useEffect, useState, useCallback } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { DateTime } from "luxon";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Timesheet = () => {
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

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

  useEffect(() => {
    if (startDate && endDate) {
      const startDateTime = DateTime.fromISO(startDate).startOf("day");
      const endDateTime = DateTime.fromISO(endDate).endOf("day");
      const range = [];

      for (
        let date = startDateTime;
        date <= endDateTime;
        date = date.plus({ days: 1 })
      ) {
        range.push(date.toISODate());
      }

      setDateRange(range);
    }
  }, [startDate, endDate]);

  const handleExport = async () => {
    if (
      !startDate ||
      !endDate ||
      DateTime.fromISO(startDate) > DateTime.fromISO(endDate)
    ) {
      alert("Please select a valid start and end date.");
      return;
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    // Add headers
    const headers = ["ID", "Name", ...dateRange, "Total"];
    worksheet.addRow(headers);

    // Add data rows
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

      worksheet.addRow(row1);
      worksheet.addRow(row2);
      worksheet.addRow(row3);
      worksheet.addRow([]); // Add an empty row between employees
    });

    // Set column widths
    worksheet.columns = [
      { width: 10 }, // ID column
      { width: 20 }, // Name column
      ...dateRange.map(() => ({ width: 15 })), // Date & Duration columns
      { width: 15 }, // Total column
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "employees.xlsx");
  };

  const formatWorkDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    let sortableEmployees = [...employees];
    if (sortConfig !== null) {
      sortableEmployees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="start-date" className="mb-2">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="end-date" className="mb-2">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleExport}
            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600"
          >
            Export to Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900">
            <tr>
              <th
                className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID
              </th>
              <th
                className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name
              </th>
              {dateRange.length > 0 && (
                <>
                  {dateRange.map((date) => (
                    <th
                      key={date}
                      className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer"
                      onClick={() => handleSort(date)}
                    >
                      {date}
                    </th>
                  ))}
                  <th className="py-2 px-4 border-b dark:border-gray-700">
                    Total
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee) => {
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

              return (
                <tr key={employee.id}>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {employee.id}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {employee.name}
                  </td>
                  {dateRange.length > 0 && (
                    <>
                      {dailyDurations.map(({ date, workEntry, duration }) => (
                        <td
                          key={date}
                          className="py-2 px-4 border-b dark:border-gray-700"
                        >
                          {workEntry} ({formatWorkDuration(duration)})
                        </td>
                      ))}
                      <td className="py-2 px-4 border-b dark:border-gray-700">
                        {formattedTotal}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timesheet;
