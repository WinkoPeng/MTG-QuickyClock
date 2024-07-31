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

function Edit({ employee, onCancel }) {
  const router = useRouter();

  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    firstName: "",
    lastName: "",
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
    /*lastMonthWorkDuration: { hours: 0, minutes: 0 },
    lastOnlineDate: "",
    thisMonthWorkDuration: { hours: 0, minutes: 0 },
    twoWeeksWorkDuration: { hours: 0, minutes: 0 },
    workDurationToday: { hours: 0, minutes: 0 },
    totalWorkDuration: { hours: 0, minutes: 0 },*/
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateWorkDuration, setSelectedDateWorkDuration] = useState({
    hours: 0,
    minutes: 0,
  });
  const [selectedDateClockIn, setSelectedDateClockIn] = useState("");
  const [selectedDateClockOut, setSelectedDateClockOut] = useState("");

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
        //lastMonthWorkDuration,
        //thisMonthWorkDuration,
        //twoWeeksWorkDuration,
        //workDurationToday,
        //totalWorkDuration,
        workHours,
        workPeriod,
        workTime,
        ...rest
      } = employee;

      setFormData({
        ...rest,
        workHours: transformWorkHours(workHours),
        /*lastMonthWorkDuration: convertMinutesToHoursAndMinutes(
          lastMonthWorkDuration
        ),
        thisMonthWorkDuration: convertMinutesToHoursAndMinutes(
          thisMonthWorkDuration
        ),
        twoWeeksWorkDuration:
          convertMinutesToHoursAndMinutes(twoWeeksWorkDuration),
        workDurationToday: convertMinutesToHoursAndMinutes(workDurationToday),
        totalWorkDuration: convertMinutesToHoursAndMinutes(totalWorkDuration),*/
      });

      if (workPeriod && selectedDate) {
        setSelectedDateWorkDuration(
          convertMinutesToHoursAndMinutes(workPeriod[selectedDate])
        );
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

  const handleClockInChange = (e) => {
    setSelectedDateClockIn(e.target.value);
  };

  const handleClockOutChange = (e) => {
    setSelectedDateClockOut(e.target.value);
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

        workHours: Object.keys(formData.workHours).reduce((acc, day) => {
          acc[day] =
            `${formData.workHours[day].start} - ${formData.workHours[day].end}` ||
            "- -";

          return acc;
        }, {}),
      };

      if (selectedDate) {
        if (convertHoursAndMinutesToMinutes(selectedDateWorkDuration) !== 0) {
          console.log(
            "selectedDateWorkDuration: ",
            convertHoursAndMinutesToMinutes(selectedDateWorkDuration)
          );
          updatedFormData.workPeriod = {
            ...employee.workPeriod,

            [selectedDate]: convertHoursAndMinutesToMinutes(
              selectedDateWorkDuration
            ),
          };
        }

        if (selectedDateClockIn && selectedDateClockOut) {
          const clockInDateTime = new Date(
            `${selectedDate}T${selectedDateClockIn}`
          );
          const clockOutDateTime = new Date(
            `${selectedDate}T${selectedDateClockOut}`
          );

          const duration = Math.floor(
            (clockOutDateTime - clockInDateTime) / (1000 * 60)
          );

          if (duration > 0) {
            updatedFormData.workTime = {
              ...employee.workTime,
              [selectedDate]: [
                {
                  clockIn: selectedDateClockIn,
                  clockOut: selectedDateClockOut,
                },
              ],
            };
            updatedFormData.workPeriod = {
              ...employee.workPeriod,
              [selectedDate]: duration,
            };
          }
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
            htmlFor="first name"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="last name"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
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

        <div className="flex flex-col space-y-4">
          <label
            htmlFor="selectedDate"
            className="font-medium text-gray-900 dark:text-gray-100"
          >
            Manually Adjust Clock In/Out Time for Selected Date
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              name="selectedDate"
              placeholder="Selected Date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full max-w-xs"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col space-y-2 w-full max-w-xs">
              <label
                htmlFor="selectedDateClockIn"
                className="font-medium text-gray-900 dark:text-gray-100"
              >
                Clock In Time
              </label>
              <input
                type="time"
                name="selectedDateClockIn"
                value={selectedDateClockIn}
                onChange={handleClockInChange}
                className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full max-w-xs">
              <label
                htmlFor="selectedDateClockOut"
                className="font-medium text-gray-900 dark:text-gray-100"
              >
                Clock Out Time
              </label>
              <input
                type="time"
                name="selectedDateClockOut"
                value={selectedDateClockOut}
                onChange={handleClockOutChange}
                className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-full"
              />
            </div>
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
