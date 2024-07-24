"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Import icons

const Sidebar = ({
  adminName,
  selectedPage,
  setSelectedPage,
  handleLogout,
  handlePendingMessages,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const sidebarRef = useRef(null);

  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handlePageChange = (page) => {
    setSelectedPage(page);
    if (page === "Messages") handlePendingMessages(false);
  };

  return (
    <div className="relative">
      {/* Burger Menu Icon */}
      <button
        className="md:hidden p-2 absolute top-4 left-4 text-white"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-5 h-5" />
        ) : (
          <Bars3Icon className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-48 bg-primaryDark text-white h-full p-4 flex flex-col justify-between md:relative md:w-48 md:flex md:flex-col md:justify-between transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto md:overflow-y-auto`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col flex-grow">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">Welcome,</h3>
            <h2 className="text-xl font-bold">{adminName}</h2>
          </div>
          <div className="flex flex-col flex-grow space-y-2">
            {[
              "Dashboard",
              "Employee List",
              "Register",
              "Bulletin",
              "Messages",
              "Geofence Manager",
            ].map((page) => (
              <button
                key={page}
                className={`text-left py-2 px-4 rounded transition-colors focus:outline-none ${
                  selectedPage === page
                    ? "bg-accent text-white"
                    : "bg-primaryDark text-gray-200 hover:bg-accent focus:bg-accent"
                }`}
                onClick={() => {
                  handlePageChange(page);
                  setIsSidebarOpen(false); // Close sidebar when a page is selected
                }}
                aria-label={`Go to ${page}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded text-white focus:outline-none"
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false); // Close sidebar on logout
            }}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
