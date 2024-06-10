'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import db from '../firebase';
import styles from './dashboard.module.css';

function Dashboard() {
  const [employeeData, setEmployeeData] = useState([]);
  const [workingTodayCount, setWorkingTodayCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [averageWorkHours, setAverageWorkHours] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const querySnapshot = await getDocs(collection(db, "employee"));
      const employees = querySnapshot.docs.map(doc => doc.data());

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      console.log(today);

      const employeesWorkingToday = employees.filter(emp => {
        const workHours = emp.workHours[today];
        return workHours && workHours !== " - ";
      });

      const onlineEmployees = employeesWorkingToday.filter(emp => emp.status === 'online');

      const totalWorkHoursInMinutes = employees.reduce((acc, emp) => acc + (emp.workDurationToday || 0), 0);
      const avgWorkHoursInMinutes = totalWorkHoursInMinutes / employees.length;
      const avgHours = Math.floor(avgWorkHoursInMinutes / 60);
      const avgMinutes = Math.floor(avgWorkHoursInMinutes % 60);

      setEmployeeData(employeesWorkingToday);
      setWorkingTodayCount(employeesWorkingToday.length);
      setOnlineCount(onlineEmployees.length);
      setTotalEmployees(employees.length);
      setAverageWorkHours({ hours: avgHours, minutes: avgMinutes });
    };

    fetchEmployeeData();
  }, []);

  const pieData = {
    labels: ['Online', 'Offline'],
    datasets: [
      {
        data: [onlineCount, workingTodayCount - onlineCount],
        backgroundColor: ['#4caf50', '#9e9e9e']
      }
    ]
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h3>Today&apos;s Work Count: {workingTodayCount}/{totalEmployees} (Total Amount)</h3>
      </div>
      <div className={styles.card}>
        <h3>Employees Working Today</h3>
        <ul className={styles.employeeList}>
          {employeeData.map((emp, index) => (
            <li
              key={index}
              className={`${styles.employeeItem} ${emp.status === 'online' ? styles.online : styles.offline}`}
            >
              {emp.name}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.card}>
        <h3>Real-time Online Count: {onlineCount}</h3>
        <div className={styles.pieChartContainer}>
          <Pie data={pieData} />
        </div>
      </div>
      <div className={styles.card}>
        <h3>Average Work Hours Today: {averageWorkHours.hours} hours {averageWorkHours.minutes} mins</h3>
      </div>
    </div>
  );
}

export default Dashboard;
