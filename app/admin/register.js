import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import db from "../firebase";

function Register({ onCancel }) {
  const [options, setOptions] = useState([]);

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
  }, []);

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
    workHours: {
      Monday: { start: "", end: "" },
      Tuesday: { start: "", end: "" },
      Wednesday: { start: "", end: "" },
      Thursday: { start: "", end: "" },
      Friday: { start: "", end: "" },
      Saturday: { start: "", end: "" },
      Sunday: { start: "", end: "" },
    },
    workPeriod: [],
    geofence: null,
  });

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
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateWorkHours = () => {
    for (let day in formData.workHours) {
      const start = formData.workHours[day].start;
      const end = formData.workHours[day].end;
      if (
        start &&
        end &&
        new Date(`1970-01-01T${end}`) < new Date(`1970-01-01T${start}`)
      ) {
        alert(`${day}: End time cannot be earlier than start time.`);
        return false;
      }
    }
    return true;
  };

  const checkForDuplicates = async () => {
    const idQuery = query(
      collection(db, "employee"),
      where("id", "==", formData.id)
    );
    const emailQuery = query(
      collection(db, "employee"),
      where("email", "==", formData.email)
    );
    const idSnapshot = await getDocs(idQuery);
    const emailSnapshot = await getDocs(emailQuery);

    if (!idSnapshot.empty) {
      alert("Employee ID already exists");
      return false;
    }
    if (!emailSnapshot.empty) {
      alert("Email already exists");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateWorkHours()) {
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("Invalid email format");
      return;
    }
    if (!(await checkForDuplicates())) {
      return;
    }

    try {
      const formattedWorkHours = Object.keys(formData.workHours).reduce(
        (acc, day) => {
          acc[
            day
          ] = `${formData.workHours[day].start} - ${formData.workHours[day].end}`;
          return acc;
        },
        {}
      );

      await addDoc(collection(db, "employee"), {
        ...formData,
        workHours: formattedWorkHours,
      });
      alert("Employee added successfully!");
      setFormData({
        id: "",
        password: "",
        name: "",
        class: "employee",
        title: "Administrative Officer",
        gender: "male",
        email: "",
        cell: "",
        address: "",
        workHours: {
          Monday: { start: "", end: "" },
          Tuesday: { start: "", end: "" },
          Wednesday: { start: "", end: "" },
          Thursday: { start: "", end: "" },
          Friday: { start: "", end: "" },
          Saturday: { start: "", end: "" },
          Sunday: { start: "", end: "" },
        },
        workPeriod: [],
        geofence: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding employee." + error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Register Employee
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            htmlFor="class"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Class
          </label>
          <select
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:text-neutral-400 dark:focus:ring-neutral-600 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Title
          </label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:text-neutral-400 dark:focus:ring-neutral-600 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="" disabled>
              Select a title
            </option>
            <option value="Administrative Officer">
              Administrative Officer
            </option>
            <option value="Program Coordinator">Program Coordinator</option>
            <option value="Instructor">Instructor</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            htmlFor="cell"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Cell Number
          </label>
          <input
            type="text"
            id="cell"
            name="cell"
            placeholder="Cell Number"
            value={formData.cell}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            htmlFor="geofence"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Geofence
          </label>
          <select
            id="geofence"
            name="geofence"
            value={formData.geofence}
            onChange={handleChange}
            className="p-4 mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm dark:text-neutral-400 dark:focus:ring-neutral-600 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="None">None</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-lg font-semibold">Scheduled Hours</h3>
        {Object.keys(formData.workHours).map((day) => (
          <div key={day} className="flex items-center space-x-4">
            <div className="w-1/4">
              <label
                htmlFor={`${day}-start`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {day}
              </label>
            </div>
            <input
              type="time"
              id={`${day}-start`}
              name={`${day}.start`}
              value={formData.workHours[day].start}
              onChange={handleChange}
              className="w-1/2 p-2 border border-gray-500 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
            />
            <span className="mx-2 text-gray-700 dark:text-gray-300">to</span>
            <input
              type="time"
              id={`${day}-end`}
              name={`${day}.end`}
              value={formData.workHours[day].end}
              onChange={handleChange}
              className="w-1/2 p-2 border border-gray-500 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-100 font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
