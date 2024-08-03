"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../withAuth";
import Register from "./register";
import EmployeeList from "./employeeList";
import Dashboard from "./dashboard";
import Edit from "./edit";
import GeofenceManager from "./geofenceManager";
import Contact from "./contact";
import Bulletin from "./bulletin";
import Timesheet from "./timesheet";
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
    console.log("Admin name:", adminName);
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, "messages"),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);

      // Set pendingMessages based on whether there are any pending messages
      setPendingMessages(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminFirstName");
    localStorage.removeItem("adminLastName");
    router.push("/");
  };

  const renderPage = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Manage Employees":
        return (
          <EmployeeList
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setSelectedPage("Edit");
            }}
            onAdd={() => setSelectedPage("Register")}
          />
        );
      case "Register":
        return (
          <Register onCancel={() => setSelectedPage("Manage Employees")} />
        );
      case "Edit":
        return (
          <Edit
            employee={selectedEmployee}
            onCancel={() => setSelectedPage("Manage Employees")}
          />
        );
      case "Timesheets":
        return <Timesheet />;
      case "Announcements":
        return <Bulletin userId={userId} userName={adminName} />;
      case "Employee Messages":
        return <Contact userName={adminName} updateMessages={fetchMessages} />;
      case "Geofence Manager":
        return <GeofenceManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-light dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      <title>MTG - Admin</title>

      {/* Sidebar */}
      <Sidebar
        adminName={adminName}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        pendingMessages={pendingMessages}
      />

      {/* Main Content */}
      <div
        className={`flex-grow transition-all duration-300 ease-in-out p-6 bg-light dark:bg-gray-900 flex flex-col max-w-full overflow-hidden ${
          isSidebarOpen ? "md:ml-48" : ""
        }`}
      >
        <div className="flex-1 overflow-y-auto max-w-full">{renderPage()}</div>
      </div>

      {/* Overlay for smaller screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default withAuth(Admin);
