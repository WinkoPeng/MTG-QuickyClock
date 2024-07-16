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

function Admin() {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [adminName, setAdminName] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) {
      setAdminName(name);
    }
  }, []);

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
      case "Messages":
        return <Contact />;
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
            onClick={() => setSelectedPage("Messages")}
          >
            Messages
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
