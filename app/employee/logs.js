"use client";

import { useState, useEffect } from "react";

export default function Logs({ employeeData }) {
  const [data, setData] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (employeeData && employeeData.workTime) {
      const entries = Object.entries(employeeData.workTime);
      const sortedEntries = entries.sort(
        ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
      );
      const flattenedData = sortedEntries
        .slice(0, 7) // Get the most recent 7 entries
        .flatMap(([date, logs]) => logs.map((log) => ({ ...log, date })));
      setData(flattenedData);
      setLogs(flattenedData);
    }
  }, [employeeData]);

  const groupedLogs = logs.reduce((acc, item) => {
    const { date, ...log } = item;
    acc[date] = acc[date] || [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="bg-light dark:bg-gray-900 p-4 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Logs for Last 7 Days Worked
      </h2>
      {Object.keys(groupedLogs).length > 0 ? (
        Object.keys(groupedLogs).map((date) => (
          <div key={date} className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {date}
            </h2>
            <table className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-left text-sm text-gray-600 dark:text-gray-300">
                    Clock In
                  </th>
                  <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-left text-sm text-gray-600 dark:text-gray-300">
                    Clock Out
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedLogs[date].map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 text-sm">
                      {log.clockIn}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 text-sm">
                      {log.clockOut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p className="text-gray-900 dark:text-gray-100">No logs available</p>
      )}
    </div>
  );
}
