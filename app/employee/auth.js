// auth.js
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../firebase';

export const handleLogin = async (mtgId, password) => {
  const q = query(collection(db, "employee"), where("id", "==", mtgId), where("password", "==", password));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userId', mtgId);
    return userData;
  } else {
    throw new Error("Invalid credentials");
  }
};

export const handleLogout = async (isClockedIn, handleClockOut, router) => {
  if (confirm('Are you sure you want to logout?')) {
    if (isClockedIn) {
      await handleClockOut();
    }
    router.push('/');
  }
};
