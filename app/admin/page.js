// page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../withAuth";
import styles from "./admin.module.css";
import { Register } from "./register";
import EmployeeList from "./employeeList";
import Dashboard from "./dashboard";
import Edit from "./edit";
import GeofenceDisplay from "./geofenceDisplay";
import GeofenceSetup from "./geofenceSetup";
import Contact from "./contact";
import Bulletin from "./bulletin";

import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";

function Admin() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [adminName, setAdminName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pendingMessages, setPendingMessages] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    const name = localStorage.getItem("adminName");
    if (name) {
      setAdminName(name);
    }

    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const q = query(
      collection(db, "messages"),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    setPendingMessages(!querySnapshot.empty);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminName");
    router.push("/");
  };

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Employee List":
        return (
          <EmployeeList
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setSelectedPage("Edit");
            }}
          />
        );
      case "Register":
        return <Register />;
      case "Edit":
        return (
          <Edit
            employee={selectedEmployee}
            onCancel={() => setSelectedPage("Employee List")}
          />
        );
      case "Bulletin":
        return <Bulletin userId={userId} userName={adminName} />;
      case "Messages":
        return <Contact userName={adminName} updateMessages={fetchMessages} />;
      case "GeofenceDisplay":
        return <GeofenceDisplay />;
      case "GeofenceSetup":
        return <GeofenceSetup />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.welcome}>
          <h3>Welcome,</h3>
          <h2>{adminName}</h2>
        </div>
        <div className={styles.menu}>
          <div
            className={styles.sidebarItem}
            onClick={() => setSelectedPage("Dashboard")}
          >
            Dashboard
          </div>
          <div
            className={styles.sidebarItem}
            onClick={() => setSelectedPage("Employee List")}
          >
            Employee List
          </div>
          <div
            className={styles.sidebarItem}
            onClick={() => setSelectedPage("Register")}
          >
            Register
          </div>
          <div
            className={styles.sidebarItem}
            onClick={() => setSelectedPage("Bulletin")}
          >
            Bulletin
          </div>
          <div
            className={`${styles.sidebarItem} ${
              pendingMessages ? styles.blinking : ""
            }`}
            onClick={() => {
              setSelectedPage("Messages");
              setPendingMessages(false);
            }}
          >
            Employee Messages
          </div>
          <div
            className={styles.sidebarItem}
            onClick={() => setSelectedPage("GeofenceDisplay")}
          >
            Geofences
          </div>
          <div
            className={styles.sidebarItem}
            onClick={() => setSelectedPage("GeofenceSetup")}
          >
            Geofence Setup
          </div>
        </div>
        <div className={styles.logout}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.dashboardHeader}>
          <h1>Admin</h1>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default withAuth(Admin);
