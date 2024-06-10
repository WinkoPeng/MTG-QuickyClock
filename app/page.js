'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import db from './firebase';
import { DateTime } from 'luxon';
import mtglogo from '../public/images/MTGBCSLogo.jpg';
import { updateWorkDuration } from './employee/timer';

export default function Home() {
  const router = useRouter();

  const updateAllEmployeesWorkDuration = async () => {
    const now = DateTime.now().setZone('America/Edmonton');
    const today = now.toISODate();

    const employeesSnapshot = await getDocs(collection(db, "employee"));

    employeesSnapshot.forEach(async (employeeDoc) => {
      const userData = employeeDoc.data();
      const lastOnlineDate = userData.lastOnlineDate || today;

      if (today !== lastOnlineDate) {
        const userRef = doc(db, 'employee', employeeDoc.id);
        await updateDoc(userRef, { workDurationToday: 0 });
      }
    });
  };

  useEffect(() => {
    updateAllEmployeesWorkDuration();
  }, []);

  const handleLogin = async () => {
    const mtgId = document.getElementById('mtgId').value;
    const password = document.getElementById('password').value;

    const q = query(collection(db, "employee"), where("id", "==", mtgId), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userId', mtgId);  // Store user ID
      updateWorkDuration(mtgId); // Continue updating work duration if user is online
      router.push('/employee');
    } else {
      console.error("Invalid credentials");
      alert("Invalid credentials");
    }
  };

  const handleAdminLogin = async () => {
    const mtgId = document.getElementById('mtgId').value;
    const password = document.getElementById('password').value;

    const q = query(collection(db, "employee"), where("id", "==", mtgId), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      if (userData.class === 'admin') {
        localStorage.setItem('adminName', userData.name);  // Store admin name
        localStorage.setItem('userId', mtgId);  // Store user ID
        updateWorkDuration(mtgId); // Continue updating work duration if user is online
        router.push('/admin');
      } else {
        console.error("You are not authorized to access admin page");
        alert("You are not authorized to access admin page");
      }
    } else {
      console.error("Invalid credentials");
      alert("Invalid credentials");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Image
          src={mtglogo}
          alt='MTG Logo'
          className={styles.logo}
          width={250}
          height={110}
        />
        <input
          type="text"
          placeholder="Enter Your MTG ID"
          className={styles.input}
          id="mtgId"
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          id="password"
        />
        <button className={styles.button} onClick={handleLogin}>Login</button>
        <a onClick={handleAdminLogin} className={styles.forgetPassword}>
          Login as Admin
        </a>
      </div>
      <div className={styles.copyright}>
        &copy; 2024 MTG Healthcare Academy
      </div>
    </div>
  );
}
