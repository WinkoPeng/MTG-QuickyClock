"use client";

import { useRef, useEffect, useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Map Container */}
      <div className="relative flex-1 h-[400px] md:h-[75vh] bg-gray-800 rounded-lg shadow-md">
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
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>

      {/* Form Container */}
      <div className="flex-1 max-w-md p-4 bg-gray-900 text-gray-200 rounded-lg shadow-lg">
        {!selectedLocation && (
          <div className="mb-4 p-4 border border-dashed border-gray-700 rounded-md text-center bg-gray-800">
            <p className="text-gray-400">
              Please search for a location, then double-click on the intended
              result in the resulting list.
            </p>
          </div>
        )}
        {selectedLocation && (
          <>
            <h3 className="text-lg font-semibold mb-4">Selected Location</h3>
            <p className="text-gray-300">
              <strong>Place name:</strong> {selectedLocation.properties.name}
            </p>
            <p className="text-gray-300">
              <strong>Address:</strong>{" "}
              {selectedLocation.properties.full_address}
            </p>
            <form
              onSubmit={handleAddGeofence}
              className="mt-4 flex flex-col gap-4"
            >
              <input
                type="text"
                name="Geofence Name"
                placeholder="Name your geofence"
                value={geofenceName}
                onChange={(e) => setGeofenceName(e.target.value)}
                required
                className="p-3 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Location
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
