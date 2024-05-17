'use client';

import { useState } from 'react';
import styles from './admin.module.css';

export default function Admin() {
  const [selectedPage, setSelectedPage] = useState('Dashboard');
  
  const renderPage = () => {
    switch (selectedPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Employee':
        return <EmployeeList />;
      case 'Register':
        return <Register />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarItem} onClick={() => setSelectedPage('Dashboard')}>Dashboard</div>
        <div className={styles.sidebarItem} onClick={() => setSelectedPage('Employee')}>Employee</div>
        <div className={styles.sidebarItem} onClick={() => setSelectedPage('Register')}>Register</div>
      </div>
      <div className={styles.main}>
        {renderPage()}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>Today's Work Count: x/Total</div>
      <div className={styles.card}>Employees Working Today (Green: Online, Grey: Offline)</div>
      <div className={styles.card}>Real-time Online Count</div>
      <div className={styles.card}>Average Work Hours Today</div>
    </div>
  );
}

function EmployeeList() {
  return <div className={styles.content}>Employee List Page</div>;
}

function Register() {
  return <div className={styles.content}>Register Page</div>;
}
