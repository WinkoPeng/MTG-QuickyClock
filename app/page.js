'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from './firebase';

export default function Home() {
  const router = useRouter();

  const handleLogin = async () => {
    const mtgId = document.getElementById('mtgId').value;
    const password = document.getElementById('password').value;

    const q = query(collection(db, "employee"), where("id", "==", mtgId), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userId', mtgId);  // Store user ID
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
    </div>
  );
}
