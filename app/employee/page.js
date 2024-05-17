'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './employee.module.css';
import { DateTime } from 'luxon';

const Employee = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(DateTime.now().setZone('America/Edmonton').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS));
  const userName = "Aaron";
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

  const handleLogout = () => {
    router.push('/');
  };

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

  const addLog = (message) => {
    setLog((prevLog) => [...prevLog, { time: currentTime, message }]);
  };

  const handleClockIn = () => {
    setIsClockedIn(true);
    setClockInTime(DateTime.now().setZone('America/Edmonton'));
    addLog(`Clocked In at ${currentTime}`);
  };

  const handleClockOut = () => {
    if (confirm('Are you sure you want to clock out?')) {
      if (isOnBreak) {
        clearTimeout(breakTimer);
        addLog(`Break ended at ${DateTime.now().setZone('America/Edmonton').toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
        setTotalBreakDuration((prevDuration) => prevDuration + (DateTime.now().setZone('America/Edmonton') - clockInTime) / 60000);
        setIsOnBreak(false);
      }
      setIsClockedIn(false);
      const clockOutTime = DateTime.now().setZone('America/Edmonton');
      const workDuration = clockOutTime.diff(clockInTime, ['hours', 'minutes']).minus({ minutes: totalBreakDuration });

      let hours = workDuration.hours;
      let minutes = workDuration.minutes;

      if (hours < 0 || (hours === 0 && minutes < 0)) {
        hours = 0;
        minutes = 0;
      }

      addLog(`Clocked Out at ${currentTime}`);
      addLog(`Duration: ${Math.floor(hours)} hours ${Math.floor(minutes)} minutes, from ${clockInTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)} to ${clockOutTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
      setTotalBreakDuration(0);
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

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <img src="/images/man.jpg" alt="Profile" className={styles.profilePic} />
        <h1>{greeting}, {userName}!</h1>
        <div className={styles.currentTime}>Current Time: {currentTime}</div>
        <div className={styles.buttonAndBreakGroup}>
          <div className={styles.buttonGroup}>
            <button className={`${styles.clockInButton} ${isClockedIn ? styles.disabledButton : ''}`} onClick={handleClockIn} disabled={isClockedIn}>Clock In</button>
            <button className={`${styles.clockOutButton} ${!isClockedIn ? styles.disabledButton : ''}`} onClick={handleClockOut} disabled={!isClockedIn}>Clock Out</button>
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
        <button className={styles.logoutButton} onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default Employee;
