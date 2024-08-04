import { getDoc, doc } from "firebase/firestore";
import db from "../firebase";
import { point, distance } from "@turf/turf";

const getCurrentPositionAsync = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000, // Use cached position if it's not older than 1 minute
    });
  });
};

const validateLocation = async (geofenceId) => {
  try {
    if (geofenceId === "None") {
      return true; // No location validation needed
    }

    if (!geofenceId) {
      console.error("Geofence location ID not provided");
      return true; // Allow clock-in if no geofence ID is provided
    }

    // Fetch geofence location
    const locationRef = doc(db, "geofence", geofenceId);
    const locationDoc = await getDoc(locationRef);

    if (!locationDoc.exists()) {
      console.error("No geofence document found");
      return false;
    }

    const location = locationDoc.data().geopoint;
    if (!location || !location.latitude || !location.longitude) {
      console.error("Invalid geofence location data");
      return false;
    }

    // Get the user's current location
    const position = await getCurrentPositionAsync();
    const userCoordinates = [
      position.coords.longitude,
      position.coords.latitude,
    ];

    const userLocation = point(userCoordinates);

    console.log("User location: ", userCoordinates);
    const geofenceLocation = point([location.longitude, location.latitude]);

    console.log("Geofence location: ", [location.longitude, location.latitude]);

    const userDistance = distance(geofenceLocation, userLocation, {
      units: "kilometers",
    });

    console.log("User distance: ", userDistance);

    return userDistance <= 2; // Check if within 2 km of the geofence
  } catch (error) {
    console.error("Error validating location:", error);
    return false;
  }
};

export { validateLocation };
