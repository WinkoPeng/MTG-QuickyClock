'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/employee')
  };

  const adminLogin = () => {
    router.push('/admin')
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <input
          type="text"
          placeholder="Enter Your MTG ID"
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
        />
        <button className={styles.button} onClick={handleLogin}>Login</button>
        <a onClick={adminLogin} className={styles.forgetPassword}>
          Login as Admin
        </a>
      </div>
    </div>
  );
}
