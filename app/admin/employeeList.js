'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase';
import styles from './admin.module.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';

function EmployeeList({ onEdit }) {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchEmployees = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'employee'));
    const employeeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmployees(employeeData);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleExport = () => {
    const exportData = employees.map(employee => ({
      id: employee.id,
      gender: employee.gender,
      class: employee.class,
      title: employee.title,
      address: employee.address,
      email: employee.email,
      cell: employee.cell,
      lastOnlineDate: employee.lastOnlineDate,
      totalWorkDuration: employee.totalWorkDuration,
      workDurationToday: employee.workDurationToday,
      thisMonthWorkDuration: employee.thisMonthWorkDuration,
      twoWeeksWorkDuration: employee.twoWeeksWorkDuration,
      lastMonthWorkDuration: employee.lastMonthWorkDuration,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'employees.xlsx');
  };

  const formatWorkDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} hours ${minutes} mins`;
  };

  const getToday = () => {
    const today = DateTime.now().setZone('America/Edmonton').toFormat('cccc');
    return today;
  };

  const today = getToday();

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || Object.values(employee).some(value => value.toString().toLowerCase().includes(searchTerm));
    const isOnline = employee.status === 'online';
    const workDurationToday = employee.workDurationToday || 0;

    const isWorkingToday = employee.workHours && employee.workHours[today] !== ' - ';
    const matchesFilter = 
      (filter === 'all') ||
      (filter === 'online' && isOnline) ||
      (filter === 'workingToday' && isWorkingToday) ||
      (filter === 'offToday' && !isWorkingToday);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.content}>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search employees..." value={searchTerm} onChange={handleSearchChange} className={styles.input} />
        <select value={filter} onChange={handleFilterChange} className={styles.input}>
          <option value="all">Show All</option>
          <option value="online">Online Only</option>
          <option value="workingToday">Working Today</option>
          <option value="offToday">Off Today</option>
        </select>
        <button onClick={handleExport} className={styles.exportButton}>Export Employee List</button>
      </div>
      <div className={styles.employeeList}>
        {filteredEmployees.map(employee => (
          <div key={employee.id} className={styles.employeeCard}>
            <h3>{employee.name} - {employee.title}</h3>
            <p>Status: <span style={{ color: employee.status === 'online' ? 'green' : 'grey', fontWeight: 'bold' }}>{employee.status === 'online' ? 'Online' : 'Offline'}</span></p>
            <p>Today&apos;s Work Hours: {formatWorkDuration(employee.workDurationToday)}</p>
            <p>This Month&apos;s Work Hours: {formatWorkDuration(employee.thisMonthWorkDuration || 0)}</p>
            <button onClick={() => onEdit(employee)} className={styles.button}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;
