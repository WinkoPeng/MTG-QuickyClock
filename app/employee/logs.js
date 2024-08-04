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
    <div className="bg-light dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Logs for last 7 days worked
      </h2>
      {Object.keys(groupedLogs).length > 0 ? (
        Object.keys(groupedLogs).map((date) => (
          <div key={date} className="mb-2">
            <h2 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
              {date}
            </h2>
            <table className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
              <thead>
                <tr className="border-b dark:border-gray-600">
                  <th className="py-1 px-2 text-left text-gray-900 dark:text-gray-100 text-sm">
                    Clock In
                  </th>
                  <th className="py-1 px-2 text-left text-gray-900 dark:text-gray-100 text-sm">
                    Clock Out
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedLogs[date].map((log, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="py-1 px-2 text-gray-900 dark:text-gray-100 text-sm">
                      {log.clockIn}
                    </td>
                    <td className="py-1 px-2 text-gray-900 dark:text-gray-100 text-sm">
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
