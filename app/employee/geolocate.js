import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
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

const validateLocation = async (userId) => {
  try {
    // Fetch user data
    const userQuery = query(
      collection(db, "employee"),
      where("id", "==", userId)
    );
    const userQuerySnap = await getDocs(userQuery);

    if (userQuerySnap.empty) {
      console.error("No user found with the given ID");
      return false;
    }

    const locationId = userQuerySnap.docs[0].data().geofence;

    if (!locationId) {
      console.error("No geofence location ID found for the user");
      return false;
    }

    // Fetch geofence location
    const locationRef = doc(db, "geofence", locationId);
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
    const geofenceLocation = point([location.longitude, location.latitude]);

    const userDistance = distance(geofenceLocation, userLocation, {
      units: "kilometers",
    });

    return userDistance <= 5;
  } catch (error) {
    console.error("Error validating location:", error);
    return false;
  }
};

export { validateLocation };
