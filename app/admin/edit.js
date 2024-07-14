"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for app directory
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

      // Set selected date work duration if workPeriod is available
      if (workPeriod && selectedDate && workPeriod[selectedDate]) {
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

      if (
        selectedDate &&
        (selectedDateWorkDuration.hours > 0 ||
          selectedDateWorkDuration.minutes > 0)
      ) {
        updatedFormData.workPeriod = {
          ...employee.workPeriod,
          [selectedDate]: convertHoursAndMinutesToMinutes(
            selectedDateWorkDuration
          ),
        };
      } else {
        updatedFormData.workPeriod = {
          ...employee.workPeriod,
        };
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
    <div className={styles.register}>
      <h2 className={styles.editTitle}>Edit Employee</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="id">ID</label>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="class">Class</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="Administrative Officer">
              Administrative Officer
            </option>
            <option value="Program Coordinator">Program Coordinator</option>
            <option value="Instructor">Instructor</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cell">Cell</label>
          <input
            type="text"
            name="cell"
            placeholder="Cell"
            value={formData.cell}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="geofence">Geofence</label>
          <select
            name="geofence"
            id="geofence-select"
            value={formData.geofence}
            onChange={handleChange}
            required
          >
            <option value={null}>None</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.workHours}>
          <h3>Work Hours</h3>
          {Object.keys(formData.workHours).map((day) => (
            <div key={day} className={styles.workHoursRow}>
              <label>{day}</label>
              <input
                type="time"
                name={`${day}.start`}
                value={formData.workHours[day].start}
                onChange={handleChange}
                className={styles.inputWorkHours}
              />
              <span>to</span>
              <input
                type="time"
                name={`${day}.end`}
                value={formData.workHours[day].end}
                onChange={handleChange}
                className={styles.inputWorkHours}
              />
            </div>
          ))}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="selectedDateWorkDuration.hours">
            Work Duration for Selected Date
          </label>
          <div className={styles.durationFields}>
            <input
              type="date"
              name="selectedDate"
              placeholder="Selected Date"
              value={selectedDate}
              onChange={handleDateChange}
              className={styles.input}
            />
            <input
              type="number"
              name="selectedDateWorkDuration.hours"
              placeholder="Hours"
              value={selectedDateWorkDuration.hours}
              onChange={handleChange}
              className={styles.inputTime}
            />
            <span>hours</span>
            <input
              type="number"
              name="selectedDateWorkDuration.minutes"
              placeholder="Minutes"
              value={selectedDateWorkDuration.minutes}
              onChange={handleChange}
              className={styles.inputTime}
            />
            <span>mins</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastOnlineDate">Last Online Date</label>
          <input
            type="date"
            name="lastOnlineDate"
            placeholder="Last Online Date"
            value={formData.lastOnlineDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastMonthWorkDuration.hours">
            Last Month Work Duration
          </label>
          <div className={styles.durationFields}>
            <input
              type="number"
              name="lastMonthWorkDuration.hours"
              placeholder="Hours"
              value={formData.lastMonthWorkDuration.hours}
              onChange={handleChange}
              className={styles.input}
            />
            <span>hours</span>
            <input
              type="number"
              name="lastMonthWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.lastMonthWorkDuration.minutes}
              onChange={handleChange}
              className={styles.input}
            />
            <span>mins</span>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="thisMonthWorkDuration.hours">
            This Month Work Duration
          </label>
          <div className={styles.durationFields}>
            <input
              type="number"
              name="thisMonthWorkDuration.hours"
              placeholder="Hours"
              value={formData.thisMonthWorkDuration.hours}
              onChange={handleChange}
              className={styles.input}
            />
            <span>hours</span>
            <input
              type="number"
              name="thisMonthWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.thisMonthWorkDuration.minutes}
              onChange={handleChange}
              className={styles.input}
            />
            <span>mins</span>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="twoWeeksWorkDuration.hours">
            Two Weeks Work Duration
          </label>
          <div className={styles.durationFields}>
            <input
              type="number"
              name="twoWeeksWorkDuration.hours"
              placeholder="Hours"
              value={formData.twoWeeksWorkDuration.hours}
              onChange={handleChange}
              className={styles.input}
            />
            <span>hours</span>
            <input
              type="number"
              name="twoWeeksWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.twoWeeksWorkDuration.minutes}
              onChange={handleChange}
              className={styles.input}
            />
            <span>mins</span>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="workDurationToday.hours">Work Duration Today</label>
          <div className={styles.durationFields}>
            <input
              type="number"
              name="workDurationToday.hours"
              placeholder="Hours"
              value={formData.workDurationToday.hours}
              onChange={handleChange}
              className={styles.input}
            />
            <span>hours</span>
            <input
              type="number"
              name="workDurationToday.minutes"
              placeholder="Minutes"
              value={formData.workDurationToday.minutes}
              onChange={handleChange}
              className={styles.input}
            />
            <span>mins</span>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="totalWorkDuration.hours">Total Work Duration</label>
          <div className={styles.durationFields}>
            <input
              type="number"
              name="totalWorkDuration.hours"
              placeholder="Hours"
              value={formData.totalWorkDuration.hours}
              onChange={handleChange}
              className={styles.input}
            />
            <span>hours</span>
            <input
              type="number"
              name="totalWorkDuration.minutes"
              placeholder="Minutes"
              value={formData.totalWorkDuration.minutes}
              onChange={handleChange}
              className={styles.input}
            />
            <span>mins</span>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.cancelButton}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
