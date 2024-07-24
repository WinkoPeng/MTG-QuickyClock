import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import db from "../firebase";

function Register() {
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
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Register Employee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            id="id"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-transparent focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label
            htmlFor="id"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            ID
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-transparent focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label
            htmlFor="password"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Password
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-transparent focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label
            htmlFor="name"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Name
          </label>
        </div>

        <div className="relative">
          <select
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <label
            htmlFor="class"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Employee Type
          </label>
        </div>

        <div className="relative">
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="Administrative Officer">
              Administrative Officer
            </option>
            <option value="Manager">Manager</option>
            <option value="Clerk">Clerk</option>
          </select>
          <label
            htmlFor="title"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Title
          </label>
        </div>

        <div className="relative">
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
          </select>
          <label
            htmlFor="gender"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Gender
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-transparent focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label
            htmlFor="email"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Email
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="cell"
            name="cell"
            placeholder="Cell Number"
            value={formData.cell}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-transparent focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label
            htmlFor="cell"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Cell Number
          </label>
        </div>

        <div className="relative">
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm placeholder-transparent focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          />
          <label
            htmlFor="address"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Address
          </label>
        </div>

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
              required
              className="w-1/2 p-2 border border-gray-500 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
            />
            <span className="mx-2 text-gray-700 dark:text-gray-300">to</span>
            <input
              type="time"
              id={`${day}-end`}
              name={`${day}.end`}
              value={formData.workHours[day].end}
              onChange={handleChange}
              required
              className="w-1/2 p-2 border border-gray-500 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg"
            />
          </div>
        ))}

        <div className="relative">
          <select
            id="geofence"
            name="geofence"
            value={formData.geofence}
            onChange={handleChange}
            className="peer p-4 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none"
          >
            <option value="">Select Geofence</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <label
            htmlFor="geofence"
            className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none transition-all duration-300 transform origin-top-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
          >
            Geofence
          </label>
        </div>

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
