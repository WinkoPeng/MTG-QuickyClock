import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import { DateTime } from "luxon";

function EmployeeList({ onEdit, onAdd }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

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
    <div className="p-4 bg-lighter dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-grow">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 text-sm border rounded-md w-full md:w-1/3 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <select
            value={filter}
            onChange={handleFilterChange}
            className="p-2 text-sm border bg-white rounded-md w-full md:w-1/4 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="all">Show All</option>
            <option value="online">Clocked In Only</option>
            <option value="workingToday">Working Today</option>
            <option value="offToday">Off Today</option>
          </select>
        </div>
        <div className="flex justify-end w-full md:w-auto">
          <button
            onClick={() => onAdd()}
            className="p-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Add New Employee
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
              <div>
                {employee.firstName} {employee.lastName}
              </div>
              <div className="text-sm">{employee.title}</div>
            </h3>
            <p className="text-sm mb-2 dark:text-gray-200">ID: {employee.id}</p>
            <p className="text-sm mb-2 dark:text-gray-200">
              Status:{" "}
              <span
                className={`font-bold ${
                  employee.status === "online"
                    ? "text-green-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {employee.status === "online" ? "Clocked In" : "Clocked Out"}
              </span>
            </p>
            {/*<p className="text-sm mb-2 dark:text-gray-200">
              Today&apos;s Work Hours:{" "}
              {formatWorkDuration(employee.workDurationToday)}
            </p>*/}
            <button
              onClick={() => onEdit(employee)}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;
