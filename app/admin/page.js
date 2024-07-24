"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../withAuth";
import dynamic from "next/dynamic";
import Register from "./register";
import EmployeeList from "./employeeList";
import Dashboard from "./dashboard";
import Edit from "./edit";
import GeofenceManager from "./geofenceManager";
import Contact from "./contact";
import Bulletin from "./bulletin";
import Sidebar from "./sidebar";

import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";

const Admin = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [adminName, setAdminName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [pendingMessages, setPendingMessages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      case "Geofence Manager":
        return <GeofenceManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <title>MTG - Admin</title>

      {/* Sidebar */}
      <Sidebar
        adminName={adminName}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        handlePendingMessages={setPendingMessages}
      />

      {/* Main Content */}
      <div
        className={`flex-grow transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-48" : "ml-0"
        } p-6 bg-gray-100 dark:bg-gray-900 flex flex-col max-w-full overflow-hidden`}
      >
        <div className="flex-1 overflow-y-auto max-w-full">{renderPage()}</div>
      </div>
    </div>
  );
};

export default withAuth(Admin);
