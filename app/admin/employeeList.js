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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleExport = () => {
    if (!startDate || !endDate || DateTime.fromISO(startDate) > DateTime.fromISO(endDate)) {
      alert('Please select a valid start and end date.');
      return;
    }
  
    const startDateTime = DateTime.fromISO(startDate).startOf('day');
    const endDateTime = DateTime.fromISO(endDate).endOf('day');
    const dateRange = [];
  
    for (let date = startDateTime; date <= endDateTime; date = date.plus({ days: 1 })) {
      dateRange.push(date.toISODate());
    }
  
    const exportData = employees.map(employee => {
      const workPeriod = employee.workPeriod || {};
      const workTime = employee.workTime || {};
      const dailyDurations = dateRange.map(date => {
        const workEntry = workTime[date] ? workTime[date] : 'N/A';
        const duration = workPeriod[date] ? workPeriod[date] : 0;
        return {
          date,
          workEntry,
          duration
        };
      });
  
      const totalDuration = dailyDurations.reduce((sum, { duration }) => sum + duration, 0);
      const formattedTotal = formatWorkDuration(totalDuration);
  
      return {
        ID: employee.id,
        Name: employee.name,
        dailyDurations,
        Total: formattedTotal
      };
    });
  
    const headers = ['ID', 'Name', ...dateRange, 'Total'];
    const worksheetData = [headers];
  
    exportData.forEach(employee => {
      const row1 = [employee.ID, employee.Name];
      const row2 = ['', ''];
      const row3 = ['', ''];
  
      employee.dailyDurations.forEach(({ date, workEntry, duration }) => {
        row1.push(date);
        row2.push(workEntry);
        row3.push(formatWorkDuration(duration));
      });
  
      row1.push('');
      row2.push('');
      row3.push(employee.Total);
  
      worksheetData.push(row1);
      worksheetData.push(row2);
      worksheetData.push(row3);
      worksheetData.push([]); // Add an empty row between employees
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Set column widths
    const colWidths = [
      { wpx: 50 },  // ID column
      { wpx: 110 },  // Name column
      ...dateRange.map(() => ({ wpx: 150 })),  // Date & Duration columns
      { wpx: 100 }   // Total column
    ];
    worksheet['!cols'] = colWidths;
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'employees.xlsx');
  };
  
  const formatWorkDuration = (duration) => {
    const hours = (duration / 60).toFixed(1);
    return `${hours}h`;
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

  const getLast7Days = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      last7Days.push(DateTime.now().minus({ days: i }).toISODate());
    }
    return last7Days;
  };

  const last7Days = getLast7Days();

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
        <input type="date" value={startDate} onChange={handleStartDateChange} className={styles.input} />
        <input type="date" value={endDate} onChange={handleEndDateChange} className={styles.input} />
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
      <div className={styles.tableContainer}>
        <table className={styles.workTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Title</th>
              {last7Days.map(date => (
                <th key={date}>{date}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => {
              const totalLast7Days = last7Days.reduce((sum, date) => {
                return sum + ((employee.workPeriod && employee.workPeriod[date]) || 0);
              }, 0);

              return (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.title}</td>
                  {last7Days.map(date => (
                    <td key={date}>{formatWorkDuration((employee.workPeriod && employee.workPeriod[date]) || 0)}</td>
                  ))}
                  <td>{formatWorkDuration(totalLast7Days)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
