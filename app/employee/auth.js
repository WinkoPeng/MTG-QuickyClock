// auth.js
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";
import bcrypt from "bcryptjs";

export const verifyUser = async (id, password) => {
  try {
    // Fetch user data based on mtgId
    const q = query(collection(db, "employee"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No user found with the provided ID
      return false;
    }

    // Assuming there's only one document with this ID
    const userDoc = querySnapshot.docs[0].data();
    const hashedPassword = userDoc.password;

    // Compare provided password with the hashed password
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    if (isMatch || password == userDoc.password) {
      // Valid credentials
      return querySnapshot.docs[0].data();
    } else {
      // Invalid credentials
      return false;
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const handleLogout = async (isClockedIn, handleClockOut, router) => {
  if (confirm("Are you sure you want to logout?")) {
    if (isClockedIn) {
      await handleClockOut();
    }
    router.push("/");
  }
};
