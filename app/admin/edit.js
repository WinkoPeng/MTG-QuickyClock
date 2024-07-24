"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import db from "../firebase";
import styles from "./admin.module.css";

function Edit({ employee, onCancel }) {
  const router = useRouter();

  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    class: "employee",
    title: "Administrative Officer",
    gender: "male",
    email: "",
    cell: "",
    address: "",
    geofence: null,
    workHours: {
      Monday: { start: "", end: "" },
      Tuesday: { start: "", end: "" },
      Wednesday: { start: "", end: "" },
      Thursday: { start: "", end: "" },
      Friday: { start: "", end: "" },
      Saturday: { start: "", end: "" },
      Sunday: { start: "", end: "" },
    },
    lastMonthWorkDuration: { hours: 0, minutes: 0 },
    lastOnlineDate: "",
    thisMonthWorkDuration: { hours: 0, minutes: 0 },
    twoWeeksWorkDuration: { hours: 0, minutes: 0 },
    workDurationToday: { hours: 0, minutes: 0 },
    totalWorkDuration: { hours: 0, minutes: 0 },
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateWorkDuration, setSelectedDateWorkDuration] = useState({
    hours: 0,
    minutes: 0,
  });
  const [selectedDateWorkTime, setSelectedDateWorkTime] = useState("");

  useEffect(() => {
    const fetchGeofences = async () => {
      const q = query(collection(db, "geofence"));
      const querySnapshot = await getDocs(q);
      const geofences = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOptions(geofences);
    };
    fetchGeofences();

    if (employee) {
      const {
        lastMonthWorkDuration,
        thisMonthWorkDuration,
        twoWeeksWorkDuration,
        workDurationToday,
        totalWorkDuration,
        workHours,
        workPeriod,
        workTime,
        ...rest
      } = employee;

      setFormData({
        ...rest,
        workHours: transformWorkHours(workHours),
        lastMonthWorkDuration: convertMinutesToHoursAndMinutes(
          lastMonthWorkDuration
        ),
        thisMonthWorkDuration: convertMinutesToHoursAndMinutes(
          thisMonthWorkDuration
        ),
        twoWeeksWorkDuration:
          convertMinutesToHoursAndMinutes(twoWeeksWorkDuration),
        workDurationToday: convertMinutesToHoursAndMinutes(workDurationToday),
        totalWorkDuration: convertMinutesToHoursAndMinutes(totalWorkDuration),
      });

      if (workPeriod && selectedDate && workPeriod[selectedDate]) {
        setSelectedDateWorkDuration(
          convertMinutesToHoursAndMinutes(workPeriod[selectedDate])
        );
      }

      if (workTime && selectedDate && workTime[selectedDate]) {
        setSelectedDateWorkTime(workTime[selectedDate]);
      } else {
        setSelectedDateWorkTime("");
      }
    }
  }, [employee, selectedDate]);

  const convertMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return { hours, minutes: remainingMinutes };
  };

  const convertHoursAndMinutesToMinutes = ({ hours, minutes }) => {
    return (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
  };

  const transformWorkHours = (workHours) => {
    const transformed = {};
    Object.keys(workHours).forEach((day) => {
      const [start, end] = workHours[day]
        .split(" - ")
        .map((time) => (time === "-" ? "" : time));
      transformed[day] = { start, end };
    });
    return transformed;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".start") || name.includes(".end")) {
      const [day, timeType] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        workHours: {
          ...prevData.workHours,
          [day]: {
            ...prevData.workHours[day],
            [timeType]: value,
          },
        },
      }));
    } else if (name.includes(".hours") || name.includes(".minutes")) {
      const [field, timeType] = name.split(".");
      if (field === "selectedDateWorkDuration") {
        setSelectedDateWorkDuration((prevDuration) => ({
          ...prevDuration,
          [timeType]: value,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [field]: {
            ...prevData[field],
            [timeType]: value,
          },
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (employee.workPeriod && employee.workPeriod[e.target.value]) {
      setSelectedDateWorkDuration(
        convertMinutesToHoursAndMinutes(employee.workPeriod[e.target.value])
      );
    } else {
      setSelectedDateWorkDuration({ hours: 0, minutes: 0 });
    }

    if (employee.workTime && employee.workTime[e.target.value]) {
      setSelectedDateWorkTime(employee.workTime[e.target.value]);
    } else {
      setSelectedDateWorkTime("");
    }
  };

  const handleWorkTimeChange = (e) => {
    setSelectedDateWorkTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const employeeQuery = query(
        collection(db, "employee"),
        where("id", "==", formData.id)
      );

      const querySnapshot = await getDocs(employeeQuery);

      if (querySnapshot.empty) {
        alert("Employee ID does not exist");

        return;
      }

      const employeeDoc = querySnapshot.docs[0];

      const docRef = doc(db, "employee", employeeDoc.id);

      const updatedFormData = {
        ...formData,

        lastMonthWorkDuration: convertHoursAndMinutesToMinutes(
          formData.lastMonthWorkDuration
        ),

        thisMonthWorkDuration: convertHoursAndMinutesToMinutes(
          formData.thisMonthWorkDuration
        ),

        twoWeeksWorkDuration: convertHoursAndMinutesToMinutes(
          formData.twoWeeksWorkDuration
        ),

        workDurationToday: convertHoursAndMinutesToMinutes(
          formData.workDurationToday
        ),

        totalWorkDuration: convertHoursAndMinutesToMinutes(
          formData.totalWorkDuration
        ),

        workHours: Object.keys(formData.workHours).reduce((acc, day) => {
          acc[day] =
            `${formData.workHours[day].start} - ${formData.workHours[day].end}` ||
            "- -";

          return acc;
        }, {}),
      };

      if (selectedDate) {
        if (convertHoursAndMinutesToMinutes(selectedDateWorkDuration) !== 0) {
          updatedFormData.workPeriod = {
            ...employee.workPeriod,

            [selectedDate]: convertHoursAndMinutesToMinutes(
              selectedDateWorkDuration
            ),
          };
        }

        if (selectedDateWorkTime) {
          updatedFormData.workTime = {
            ...employee.workTime,

            [selectedDate]: selectedDateWorkTime,
          };
        }
      }

      await updateDoc(docRef, updatedFormData);

      alert("Employee updated successfully!");

      onCancel();
    } catch (error) {
      console.error("Error updating document: ", error);

      alert("Error updating employee.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmDelete) {
      try {
        const employeeQuery = query(
          collection(db, "employee"),
          where("id", "==", formData.id)
        );
        const querySnapshot = await getDocs(employeeQuery);

        if (querySnapshot.empty) {
          alert("Employee ID does not exist");
          return;
        }

        const employeeDoc = querySnapshot.docs[0];
        const docRef = doc(db, "employee", employeeDoc.id);

        await deleteDoc(docRef);
        alert("Employee deleted successfully!");
        onCancel();
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Error deleting employee.");
      }
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Edit Employee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="id"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            ID
          </label>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="password"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="name"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="class"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Class
          </label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="title"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Title
          </label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="Administrative Officer">
              Administrative Officer
            </option>
            <option value="Program Coordinator">Program Coordinator</option>
            <option value="Instructor">Instructor</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="gender"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="email"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="cell"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Cell
          </label>
          <input
            type="text"
            name="cell"
            placeholder="Cell"
            value={formData.cell}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="address"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="geofence"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Geofence
          </label>
          <select
            name="geofence"
            id="geofence-select"
            value={formData.geofence}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value={null}>None</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Work Hours
          </h3>
          {Object.keys(formData.workHours).map((day) => (
            <div key={day} className="flex items-center space-x-2 mb-2">
              <label className="w-16 text-gray-900 dark:text-gray-100">
                {day}
              </label>
              <input
                type="time"
                name={`${day}.start`}
                value={formData.workHours[day].start}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-24 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <span className="mx-2 text-gray-900 dark:text-gray-100">to</span>
              <input
                type="time"
                name={`${day}.end`}
                value={formData.workHours[day].end}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-24 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="selectedDateWorkDuration.hours"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Work Duration for Selected Date
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="selectedDate"
              placeholder="Selected Date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <input
              type="number"
              name="selectedDateWorkDuration.hours"
              placeholder="Hours"
              value={selectedDateWorkDuration.hours}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">hours</span>
            <input
              type="number"
              name="selectedDateWorkDuration.minutes"
              placeholder="Minutes"
              value={selectedDateWorkDuration.minutes}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">mins</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="selectedDateWorkTime"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Start Time - End Time
          </label>
          <input
            type="text"
            name="selectedDateWorkTime"
            placeholder="Start time & End time"
            value={selectedDateWorkTime}
            onChange={handleWorkTimeChange}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="lastOnlineDate"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Last Online Date
          </label>
          <input
            type="date"
            name="lastOnlineDate"
            placeholder="Last Online Date"
            value={formData.lastOnlineDate}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="lastMonthWorkDuration.hours"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Last Month Work Duration
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="lastMonthWorkDuration.hours"
              placeholder="Hours"
              value={formData.lastMonthWorkDuration.hours}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">hours</span>
            <input
              type="number"
              name="lastMonthWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.lastMonthWorkDuration.minutes}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">mins</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="thisMonthWorkDuration.hours"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            This Month Work Duration
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="thisMonthWorkDuration.hours"
              placeholder="Hours"
              value={formData.thisMonthWorkDuration.hours}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">hours</span>
            <input
              type="number"
              name="thisMonthWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.thisMonthWorkDuration.minutes}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">mins</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="twoWeeksWorkDuration.hours"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Two Weeks Work Duration
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="twoWeeksWorkDuration.hours"
              placeholder="Hours"
              value={formData.twoWeeksWorkDuration.hours}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">hours</span>
            <input
              type="number"
              name="twoWeeksWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.twoWeeksWorkDuration.minutes}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">mins</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="workDurationToday.hours"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Work Duration Today
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="workDurationToday.hours"
              placeholder="Hours"
              value={formData.workDurationToday.hours}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">hours</span>
            <input
              type="number"
              name="workDurationToday.minutes"
              placeholder="Minutes"
              value={formData.workDurationToday.minutes}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">mins</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="totalWorkDuration.hours"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Total Work Duration
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="totalWorkDuration.hours"
              placeholder="Hours"
              value={formData.totalWorkDuration.hours}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">hours</span>
            <input
              type="number"
              name="totalWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.totalWorkDuration.minutes}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 w-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <span className="mx-1 text-gray-900 dark:text-gray-100">mins</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 dark:bg-blue-700 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-800"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-gray-600 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 dark:bg-red-700 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-red-600 dark:hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
