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
  const [titleFilter, setTitleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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
    setStartDate(DateTime.now().minus({ days: 14 }).toISODate());
    setEndDate(DateTime.now().toISODate());
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

  const getDailyDurations = (employee) => {
    const workPeriod = employee.workPeriod || {};
    const workTime = employee.workTime || {};

    return dateRange.map((date) => {
      const workEntriesForDate = workTime[date] || [];
      const workEntry = workEntriesForDate.length
        ? workEntriesForDate
            .map((entry) => {
              const clockIn = DateTime.fromISO(entry.clockIn).toLocaleString(
                DateTime.TIME_24_SIMPLE
              );
              const clockOut = entry.clockOut
                ? DateTime.fromISO(entry.clockOut).toLocaleString(
                    DateTime.TIME_24_SIMPLE
                  )
                : "---";
              return `${clockIn} - ${clockOut}`;
            })
            .join(", ")
        : "N/A";

      const duration = workPeriod[date] || 0;
      const formattedDuration = formatWorkDuration(duration);

      return {
        date,
        workEntry,
        duration,
        formattedDuration,
      };
    });
  };

  const getTotalDuration = (employee) => {
    const workPeriod = employee.workPeriod || {};
    return dateRange.reduce((sum, date) => sum + (workPeriod[date] || 0), 0);
  };

  const generateExcelData = () => {
    return filteredEmployees
      .filter(
        (employee) => titleFilter === "All" || employee.title === titleFilter
      )
      .map((employee) => {
        const dailyDurations = getDailyDurations(employee);
        const totalDuration = getTotalDuration(employee);
        const formattedTotal = formatWorkDuration(totalDuration);

        return {
          ID: employee.id,
          Name: employee.firstName + " " + employee.lastName,
          dailyDurations,
          Total: formattedTotal,
        };
      });
  };

  const createWorkbook = (exportData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    // Add headers
    const headers = ["ID", "Name", ...dateRange, "Total"];
    worksheet.addRow(headers);

    // Add data rows
    exportData.forEach((employee) => {
      const row1 = [employee.ID, employee.Name];
      const row2 = ["", ""];
      const row3 = [];

      employee.dailyDurations.forEach(
        ({ date, workEntry, formattedDuration }) => {
          row1.push(workEntry);
          row2.push(formattedDuration);
        }
      );

      row1.push(employee.Total);

      worksheet.addRow(row1);
      worksheet.addRow(row2);
      worksheet.addRow(row3);
    });

    worksheet.columns = [
      { width: 10 },
      { width: 20 },
      ...dateRange.map(() => ({ width: 30 })),
      { width: 15 },
    ];

    return workbook;
  };

  const handleExport = async () => {
    if (
      !startDate ||
      !endDate ||
      DateTime.fromISO(startDate) > DateTime.fromISO(endDate)
    ) {
      alert("Please select a valid start and end date.");
      return;
    }

    // Generate Excel data based on the sorted and filtered employees
    const exportData = generateExcelData();
    const workbook = createWorkbook(exportData);
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `timesheet-${startDate}-${endDate}-${titleFilter}.xlsx`;
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
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
        let aValue, bValue;

        if (sortConfig.key === "name") {
          // Sorting by concatenated full name
          aValue = `${a.lastName}, ${a.firstName}`;
          bValue = `${b.lastName}, ${b.firstName}`;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEmployees;
  }, [employees, sortConfig]);

  const filteredEmployees = React.useMemo(() => {
    let sortableEmployees = [...sortedEmployees];
    if (titleFilter !== "All") {
      sortableEmployees = sortableEmployees.filter(
        (employee) => employee.title === titleFilter
      );
    }
    if (searchTerm) {
      sortableEmployees = sortableEmployees.filter((employee) =>
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    return sortableEmployees;
  }, [sortedEmployees, titleFilter, searchTerm]);

  return (
    <div className="bg-light dark:bg-gray-900 pt-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4 bg-lighter dark:bg-gray-800 p-2 rounded-lg">
        <div className="flex flex-col w-full md:w-1/4">
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
        <div className="flex flex-col w-full md:w-1/4">
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
        <div className="flex flex-col w-full md:w-1/4">
          <label htmlFor="title-filter" className="mb-2">
            Employee Title
          </label>
          <select
            id="title-filter"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="p-2 border bg-white rounded-md w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="All">All</option>
            <option value="Instructor">Instructor</option>
            <option value="Administrative Officer">
              Administrative Officer
            </option>
            <option value="Receptionist">Receptionist</option>
            <option value="Program Coordinator">Program Coordinator</option>
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label htmlFor="search" className="mb-2">
            Search by Name
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
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
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700">
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
                      className="py-2 px-4 border-b dark:border-gray-700"
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
            {filteredEmployees.map((employee) => {
              const dailyDurations = getDailyDurations(employee);
              const totalDuration = getTotalDuration(employee);
              const formattedTotal = formatWorkDuration(totalDuration);

              return (
                <tr key={employee.id}>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {employee.id}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    {employee.firstName + " " + employee.lastName}
                  </td>
                  {dateRange.length > 0 && (
                    <>
                      {dailyDurations.map(
                        ({ date, workEntry, formattedDuration }) => (
                          <td
                            key={date}
                            className="py-2 px-4 border-b dark:border-gray-700"
                          >
                            {workEntry} ({formattedDuration})
                          </td>
                        )
                      )}
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
