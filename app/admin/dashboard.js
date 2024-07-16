// dashboard.js

'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Pie, Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { DateTime } from 'luxon';
import db from '../firebase';
import styles from './dashboard.module.css';

function Dashboard() {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredEmployeeData, setFilteredEmployeeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [workingTodayCount, setWorkingTodayCount] = useState(0);
  const [workingTodayEmployees, setWorkingTodayEmployees] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [averageWorkHours, setAverageWorkHours] = useState({ hours: 0, minutes: 0 });
  const [weeklyWorkHours, setWeeklyWorkHours] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployeeData = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'employee'));
    const employees = querySnapshot.docs.map(doc => doc.data());
  
    const today = DateTime.now();
    const startDate = today.minus({ days: 6 }).startOf('day');
    const endDate = today.endOf('day');
    const dateRange = [];
    for (let date = startDate; date <= endDate; date = date.plus({ days: 1 })) {
      dateRange.push(date.toFormat('yyyy-MM-dd'));
    }
  
    const employeesWorkingToday = employees.filter(emp => {
      const workHours = emp.workHours && emp.workHours[today.weekdayLong];
      return workHours && workHours !== ' - ';
    });
  
    const onlineEmployees = employeesWorkingToday.filter(emp => emp.status === 'online');
  
    const totalWorkHoursInMinutes = employees.reduce((acc, emp) => acc + (emp.workDurationToday || 0), 0);
    const avgWorkHoursInMinutes = totalWorkHoursInMinutes / employees.length;
    const avgHours = Math.floor(avgWorkHoursInMinutes / 60);
    const avgMinutes = Math.floor(avgWorkHoursInMinutes % 60);
  
    const weeklyData = employees.map(emp => {
      const workPeriod = emp.workPeriod || {};
      const workHours = dateRange.map(date => (workPeriod[date] || 0) / 60);
      return { name: emp.name, workHours };
    });
  
    setEmployeeData(employees);
    setFilteredEmployeeData(employees); // 初始化显示所有员工
    setWorkingTodayCount(employeesWorkingToday.length);
    setWorkingTodayEmployees(employeesWorkingToday); // 设置今天上班的员工
    setOnlineCount(onlineEmployees.length);
    setTotalEmployees(employees.length);
    setAverageWorkHours({ hours: avgHours, minutes: avgMinutes });
    setWeeklyWorkHours(weeklyData);
  }, []);
  

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEmployeeData(employeeData.filter(emp => 
      emp.name.toLowerCase().includes(term) || 
      emp.title.toLowerCase().includes(term)
    ));
  };

  const pieData = {
    labels: ['Online', 'Offline'],
    datasets: [
      {
        data: [onlineCount, workingTodayCount - onlineCount],
        backgroundColor: ['#4caf50', '#9e9e9e']
      }
    ]
  };

  const areaData = {
    labels: Array.from({ length: 7 }, (_, i) => DateTime.now().minus({ days: 6 - i }).toFormat('yyyy-MM-dd')),
    datasets: selectedEmployee ? [{
      label: selectedEmployee.name,
      data: selectedEmployee.workHours,
      fill: true,
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)'
    }] : []
  };

  const barData = {
    labels: Array.from({ length: 7 }, (_, i) => DateTime.now().minus({ days: 6 - i }).toFormat('yyyy-MM-dd')),
    datasets: [{
      label: 'Average Weekly Work Hours',
      data: weeklyWorkHours.reduce((acc, emp) => {
        emp.workHours.forEach((hours, index) => {
          acc[index] = (acc[index] || 0) + hours;
        });
        return acc;
      }, []).map(total => (total / weeklyWorkHours.length) / 60),
      backgroundColor: '#007bff'
    }]
  };

  const handleEmployeeClick = (employee) => {
    const selected = weeklyWorkHours.find(emp => emp.name === employee.name);
    setSelectedEmployee(selected);
  };

  const areaOptions = {
    plugins: {
      legend: {
        display: false // 隐藏图表自带的标签
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.cardsContainer}>
        <div className={`${styles.card} ${styles.cardPrimary}`}>
          <h3>Today&apos;s Work Count</h3>
          <p>{workingTodayCount}/{totalEmployees}</p>
        </div>
        <div className={`${styles.card} ${styles.cardWarning}`}>
          <h3>Employees Working Today</h3>
          <ul className={styles.employeeList}>
            {workingTodayEmployees.map((emp, index) => (
              <li key={index} className={styles.employeeItem}>
                {emp.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.card} ${styles.cardSuccess}`}>
          <h3>Real-time Online Count</h3>
          <p>{onlineCount}</p>
        </div>
        <div className={`${styles.card} ${styles.cardDanger}`}>
          <h3>Average Work Hours Today</h3>
          <p>{averageWorkHours.hours} hours {averageWorkHours.minutes} mins</p>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <h3>Weekly Work Hours</h3>
          <div className={styles.employeeTags}>
            {weeklyWorkHours.map((emp, index) => (
              <span
                key={index}
                className={`${styles.employeeTag} ${selectedEmployee?.name === emp.name ? styles.selectedTag : ''}`}
                onClick={() => handleEmployeeClick(emp)}
              >
                {emp.name}
              </span>
            ))}
          </div>
          <Line data={areaData} options={areaOptions} />
        </div>
        <div className={styles.chart}>
          <h3>Average Weekly Work Hours</h3>
          <Bar data={barData} />
        </div>
      </div>
      <div className={styles.employeeTable}>
        <input 
          type="text" 
          placeholder="Search by name or position" 
          value={searchTerm} 
          onChange={handleSearch} 
          className={styles.searchBar}
        />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Last Online</th>
              <th>This Month&apos;s Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployeeData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.title}</td>
                <td>{row.status}</td>
                <td>{row.lastOnlineDate}</td>
                <td>{(row.thisMonthWorkDuration / 60).toFixed(1)}h</td> {/* 显示本月工作小时 */}
              </tr>
            ))}
          </tbody>
        </table>  
      </div>
    </div>
  );
  
}

export default Dashboard;
