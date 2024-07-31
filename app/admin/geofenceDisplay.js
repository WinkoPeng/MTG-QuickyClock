"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase";

const GeofenceDisplay = () => {
  const [geofences, setGeofences] = useState([]);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "geofence"));
        const geofenceList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGeofences(geofenceList);
      } catch (error) {
        console.error("Error fetching geofences: ", error);
      }
    };
    fetchGeofences();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "geofence", id));
      setGeofences(geofences.filter((geofence) => geofence.id !== id));
      alert("Geofence deleted successfully");
    } catch (error) {
      console.error("Error deleting geofence: ", error);
      alert("Error deleting geofence");
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Geofences</h2>
      {geofences.length > 0 ? (
        <table className="min-w-full dark:bg-gray-800 border border-gray-700 rounded-lg shadow-md">
          <thead className="dark:bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left dark:text-gray-300">Name</th>
              <th className="px-6 py-3 text-left dark:text-gray-300">
                Address
              </th>
              <th className="px-6 py-3 text-left dark:text-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {geofences.map((geofence) => (
              <tr
                key={geofence.id}
                className="border-b border-gray-700 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 dark:text-gray-200">
                  {geofence.name}
                </td>
                <td className="px-6 py-4 dark:text-gray-200">
                  {geofence.address}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(geofence.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No geofences available</p>
      )}
    </div>
  );
};

export default GeofenceDisplay;
