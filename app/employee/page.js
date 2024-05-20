'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { DateTime } from 'luxon';

import styles from './employee.module.css';
import withAuth from '../withAuth';
import { handleLogin, handleLogout } from './auth';
import { handleClockIn, handleClockOut } from './timer';

const Employee = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(DateTime.now().setZone('America/Edmonton').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS));
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [breakTime, setBreakTime] = useState('');
  const [customBreakTime, setCustomBreakTime] = useState('');
  const [selectedOption, setSelectedOption] = useState('select');
  const [log, setLog] = useState([]);
  const [breakTimer, setBreakTimer] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [totalBreakDuration, setTotalBreakDuration] = useState(0);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const timer = setInterval(() => {
      const now = DateTime.now().setZone('America/Edmonton');
      setCurrentTime(now.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS));
      const hour = now.hour;
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addLog = useCallback((message) => {
    setLog((prevLog) => [...prevLog, { time: currentTime, message }]);
  }, [currentTime]);

  const handleBreakTimeChange = (event) => {
    setBreakTime(event.target.value);
    setSelectedOption('select');
  };

  const handleCustomBreakTimeChange = (event) => {
    setCustomBreakTime(event.target.value);
    setSelectedOption('custom');
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === 'select') {
      setCustomBreakTime('');
    } else {
      setBreakTime('');
    }
  };

  const handleStartBreak = () => {
    let breakDuration = selectedOption === 'select' ? breakTime : customBreakTime;
    if (breakDuration === '' || parseInt(breakDuration) === 0) {
      alert('Break duration must be greater than 0 and not empty.');
      return;
    }
    setIsOnBreak(true);
    addLog(`Break started at ${currentTime}`);
    breakDuration = parseInt(breakDuration) * 60 * 1000; // convert minutes to milliseconds

    setBreakTimer(
      setTimeout(() => {
        addLog(`Break ended at ${DateTime.now().setZone('America/Edmonton').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
        alert('Break ended');
        setIsOnBreak(false);
        setTotalBreakDuration((prevDuration) => prevDuration + (breakDuration / 60000)); // add break duration in minutes
        setBreakTimer(null);
      }, breakDuration)
    );
  };

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (isClockedIn && confirm('Are you sure you want to close the window? You will be clocked out.')) {
        await handleClockOut(userId, setIsClockedIn, setTotalBreakDuration, addLog, clockInTime, totalBreakDuration, isOnBreak, breakTimer, setIsOnBreak);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isClockedIn, userId, clockInTime, totalBreakDuration, isOnBreak, breakTimer, addLog]);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{greeting}, {userName}!</h1>
        <div className={styles.currentTime}>Current Time: {currentTime}</div>
        <div className={styles.buttonAndBreakGroup}>
          <div className={styles.buttonGroup}>
            <button className={`${styles.clockInButton} ${isClockedIn ? styles.disabledButton : ''}`} onClick={() => handleClockIn(userId, setClockInTime, setIsClockedIn, addLog)} disabled={isClockedIn}>Clock In</button>
            <button className={`${styles.clockOutButton} ${!isClockedIn ? styles.disabledButton : ''}`} onClick={() => handleClockOut(userId, setIsClockedIn, setTotalBreakDuration, addLog, clockInTime, totalBreakDuration, isOnBreak, breakTimer, setIsOnBreak)} disabled={!isClockedIn}>Clock Out</button>
          </div>
          <div className={styles.breakGroup}>
            <div className={styles.breakOption}>
              <input
                type="radio"
                name="breakOption"
                value="select"
                checked={selectedOption === 'select'}
                onChange={handleOptionChange}
                disabled={!isClockedIn}
              />
              <select
                className={styles.breakSelect}
                value={breakTime}
                onChange={handleBreakTimeChange}
                disabled={selectedOption !== 'select' || !isClockedIn}
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
            <div className={styles.breakOption}>
              <input
                type="radio"
                name="breakOption"
                value="custom"
                checked={selectedOption === 'custom'}
                onChange={handleOptionChange}
                disabled={!isClockedIn}
              />
              <input
                type="number"
                className={styles.breakInput}
                placeholder="Custom"
                value={customBreakTime}
                onChange={handleCustomBreakTimeChange}
                disabled={selectedOption !== 'custom' || !isClockedIn}
                min="1"
              />
            </div>
            <button className={`${styles.startBreakButton} ${!isClockedIn || isOnBreak ? styles.disabledButton : ''}`} onClick={handleStartBreak} disabled={!isClockedIn || isOnBreak}>Start Break</button>
          </div>
        </div>
        <div className={styles.log}>
          <table className={styles.logTable}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.time}</td>
                  <td>{entry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className={styles.logoutButton} onClick={() => handleLogout(isClockedIn, () => handleClockOut(userId, setIsClockedIn, setTotalBreakDuration, addLog, clockInTime, totalBreakDuration, isOnBreak, breakTimer, setIsOnBreak), router)}>Log Out</button>
      </div>
    </div>
  );
};

export default withAuth(Employee);
