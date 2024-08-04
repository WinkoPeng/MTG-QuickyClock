"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClockIcon,
  MegaphoneIcon,
  UsersIcon,
  EnvelopeIcon,
  MapIcon,
} from "@heroicons/react/24/outline"; // Import icons
import Image from "next/image";

const pageIcons = {
  Dashboard: HomeIcon,
  Timesheets: ClockIcon,
  Announcements: MegaphoneIcon,
  "Manage Employees": UsersIcon,
  "Employee Messages": EnvelopeIcon,
  "Geofence Manager": MapIcon,
}; // Map page names to icons

const Sidebar = ({
  adminName,
  selectedPage,
  setSelectedPage,
  handleLogout,
  handlePendingMessages,
  isSidebarOpen,
  setIsSidebarOpen,
  pendingMessages,
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
    setIsSidebarOpen(false); // Close sidebar when a page is selected
  };

  return (
    <div className="relative h-full">
      {/* Burger Menu Icon */}
      <button
        className="md:hidden p-2 fixed top-4 left-4 z-50 text-black dark:text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-48 bg-primaryDark text-white h-full py-4 px-2 flex flex-col justify-between transition-transform duration-300 transform z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 overflow-y-auto`}
        aria-label="Sidebar"
      >
        {/* Sidebar Content */}
        <div className="flex flex-col flex-grow">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2 -ml-3">
              <Image
                src="/images/mtgLogo.png"
                alt="MTG Logo"
                width={48}
                height={48}
                className="mr-0"
                style={{ alignSelf: "center" }}
              />
              <div className="leading-tight">
                <h2 className="text-md font-bold">
                  MTG Healthcare Administration
                </h2>
              </div>
            </div>
            <h2 className="">Welcome,</h2>
            <h3 className="font-semibold">{adminName}</h3>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col flex-grow space-y-2">
            {Object.keys(pageIcons).map((page) => {
              const Icon = pageIcons[page];
              return (
                <button
                  key={page}
                  className={`w-full text-left text-sm py-2 px-4 rounded transition-colors focus:outline-none flex items-center space-x-2 ${
                    selectedPage === page
                      ? "bg-accent text-white"
                      : "bg-primaryDark text-gray-200 hover:bg-accent focus:bg-accent"
                  } ${
                    page === "Employee Messages" && pendingMessages > 0
                      ? "animate-blink-bg" // Apply the blink-bg animation if the conditions are met
                      : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Go to ${page}`}
                >
                  <Icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span>
                    {page === "Employee Messages" && pendingMessages > 0
                      ? `${page} (${pendingMessages})`
                      : page}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
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
