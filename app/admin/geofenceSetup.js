"use client";

import { useRef, useEffect, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./admin.module.css";
import {
  collection,
  addDoc,
  GeoPoint,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import db from "../firebase";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function GeofenceSetup() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [geofenceName, setGeofenceName] = useState("");

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40], // Default center
      zoom: 9, // Default zoom
    });

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => mapInstanceRef.current.remove(); // Clean up on unmount
  }, []);

  const checkForDuplicates = async () => {
    const nameQuery = query(
      collection(db, "geofence"),
      where("name", "==", geofenceName)
    );
    const geopointQuery = query(
      collection(db, "geofence"),
      where("address", "==", selectedLocation.properties.full_address)
    );
    const nameSnapshot = await getDocs(nameQuery);
    const geopointSnapshot = await getDocs(geopointQuery);

    if (!nameSnapshot.empty) {
      alert("A geofence with that name already exists");
      return false;
    }
    if (!geopointSnapshot.empty) {
      alert("The location already exists as a geofence");
      return false;
    }
    return true;
  };

  const handleRetrieve = (res) => {
    if (res && res.features && res.features.length > 0) {
      console.log(res);
      const location = res.features[0];
      setSelectedLocation(location);

      if (mapInstanceRef.current) {
        const [lng, lat] = location.geometry.coordinates;

        // Set the new center to the selected location
        mapInstanceRef.current.flyTo({
          center: [lng, lat],
          essential: true,
          zoom: 14,
        });

        // Create a new marker and set it to the selected location
        new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapInstanceRef.current);
      }
    } else {
      console.error("No features found in the response:", res);
    }
  };

  const handleAddGeofence = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please select a location first!");
      return;
    }
    if (!geofenceName) {
      alert("Please enter a name for the geofence.");
      return;
    }
    if (!(await checkForDuplicates())) {
      return;
    }
    try {
      const geoPoint = new GeoPoint(
        selectedLocation.geometry.coordinates[1],
        selectedLocation.geometry.coordinates[0]
      );

      await addDoc(collection(db, "geofence"), {
        geopoint: geoPoint,
        name: geofenceName,
        address: selectedLocation.properties.full_address,
      });
      alert("Geofence added successfully.");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding geofence.");
    }
  };

  return (
    <>
      <SearchBox
        accessToken={accessToken}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        onRetrieve={handleRetrieve}
        marker={false}
      />
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ height: "75%", width: "100%" }}
      />
      {selectedLocation && (
        <div>
          <h3>Selected Location:</h3>
          <p>Place name: {selectedLocation.properties.name}</p>
          <p>Address: {selectedLocation.properties.full_address}</p>
          <form onSubmit={handleAddGeofence}>
            <input
              type="text"
              name="Geofence Name"
              placeholder="Location Name"
              value={geofenceName}
              onChange={(e) => setGeofenceName(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Add Location
            </button>
          </form>
        </div>
      )}
    </>
  );
}
