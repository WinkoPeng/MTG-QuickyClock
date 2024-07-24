"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import GeofenceDisplay from "./geofenceDisplay";
const GeofenceSetup = dynamic(() => import("./geofenceSetup"), {
  ssr: false,
});

const GeofenceManager = () => {
  // State to manage the active view
  const [view, setView] = useState("Display");

  // Handlers to switch views
  const handleDisplayClick = () => setView("Display");
  const handleSetupClick = () => setView("Setup");

  return (
    <div className="flex flex-col h-full p-4">
      {/* Navigation Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          className={`py-2 px-4 rounded ${
            view === "Display" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={handleDisplayClick}
        >
          Display
        </button>
        <button
          className={`py-2 px-4 rounded ${
            view === "Setup" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={handleSetupClick}
        >
          Setup
        </button>
      </div>

      {/* Conditional Rendering */}
      {view === "Display" && <GeofenceDisplay />}
      {view === "Setup" && <GeofenceSetup />}
    </div>
  );
};

export default GeofenceManager;
