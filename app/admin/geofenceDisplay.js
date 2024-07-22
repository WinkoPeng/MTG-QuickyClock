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
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Geofences</h2>
      {geofences.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-gray-600">Address</th>
              <th className="px-6 py-3 text-left text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {geofences.map((geofence) => (
              <tr
                key={geofence.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-gray-800">{geofence.name}</td>
                <td className="px-6 py-4 text-gray-800">{geofence.address}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(geofence.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No geofences available</p>
      )}
    </div>
  );
};

export default GeofenceDisplay;
