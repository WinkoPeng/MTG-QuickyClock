"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase"; // Adjust the path to your firebase config file

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
    <div>
      <h2>Geofences</h2>
      {geofences.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {geofences.map((geofence) => (
              <tr key={geofence.id}>
                <td>{geofence.name}</td>
                <td>{geofence.address}</td>
                <td>
                  <button onClick={() => handleDelete(geofence.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No geofences available</p>
      )}
    </div>
  );
};

export default GeofenceDisplay;
