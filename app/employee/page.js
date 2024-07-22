"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DateTime } from "luxon";
import {
  query,
  where,
  getDocs,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase";
import Contact from "./contact";
import SentForms from "./sentForms";
import WorkHours from "./workHours";
import styles from "./employee.module.css";
import withAuth from "../withAuth";
import {
  handleClockIn,
  handleClockOut,
  updateWorkDuration,
  handleStartBreak,
  formatWorkDuration,
} from "./timer";

const Employee = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(
    DateTime.now()
      .setZone("America/Edmonton")
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
  );
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [breakTime, setBreakTime] = useState("15"); // 初始化为 15 分钟
  const [customBreakTime, setCustomBreakTime] = useState("");
  const [selectedOption, setSelectedOption] = useState("select");
  const [log, setLog] = useState([]);
  const [breakTimer, setBreakTimer] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [totalBreakDuration, setTotalBreakDuration] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [autoLogoutTime, setAutoLogoutTime] = useState(600); // 10 minutes in seconds
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSentFormsModal, setSentFormsModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [workDurationToday, setWorkDurationToday] = useState(0); // 新增状态

  const [bulletins, setBulletins] = useState([]);
  const [showBulletinOverlay, setShowBulletinOverlay] = useState(false);
  const [newestBulletin, setNewestBulletin] = useState(null);

  const addLog = useCallback(
    (message) => {
      setLog((prevLog) => [...prevLog, { time: currentTime, message }]);
    },
    [currentTime]
  );

  const handleAutoLogout = useCallback(() => {
    router.push("/");
    return 600;
  }, [router]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }

    const fetchData = async () => {
      if (storedUserId) {
        const employeeQuery = query(
          collection(db, "employee"),
          where("id", "==", storedUserId)
        );
        const querySnapshot = await getDocs(employeeQuery);

        if (!querySnapshot.empty) {
          const employeeDoc = querySnapshot.docs[0];
          const employeeData = employeeDoc.data();

          if (employeeData.status === "online") {
            setIsClockedIn(true);
            updateWorkDuration(storedUserId, setWorkDurationToday); // 继续更新工作时长
          } else {
            setIsClockedIn(false);
          }
        }
      }
    };

    fetchData();

    const fetchBulletins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bulletins"));
        const bulletinsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort bulletins by the 'createdAt' field in descending order
        const sortedBulletins = bulletinsData.sort((a, b) => {
          const dateA = a.createdAt.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });

        setBulletins(sortedBulletins);
        setNewestBulletin(sortedBulletins[0]);
      } catch (error) {
        console.error("Error fetching bulletins:", error);
      }
    };

    fetchBulletins();

    const timer = setInterval(() => {
      const now = DateTime.now().setZone("America/Edmonton");
      setCurrentTime(now.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS));
      setAutoLogoutTime((prevTime) =>
        prevTime <= 1 ? handleAutoLogout() : prevTime - 1
      );
      updateWorkDuration(userId, setWorkDurationToday); // 每分钟更新工作时长

      const hour = now.hour;
      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [handleAutoLogout, userId]);

  const handleBreakTimeChange = (event) => {
    setBreakTime(event.target.value);
    setSelectedOption("select");
  };

  const handleCustomBreakTimeChange = (event) => {
    setCustomBreakTime(event.target.value);
    setSelectedOption("custom");
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "select") {
      setCustomBreakTime("");
    } else {
      setBreakTime("");
    }
  };

  const handleStartBreakClick = () => {
    let breakDuration =
      selectedOption === "select" ? breakTime : customBreakTime;
    if (breakDuration === "" || parseInt(breakDuration) === 0) {
      alert("Break duration must be greater than 0 and not empty.");
      return;
    }
    handleStartBreak(
      userId,
      setIsOnBreak,
      setBreakTimer,
      breakDuration,
      addLog
    );
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm new password do not match.");
      return;
    }

    try {
      const employeeQuery = query(
        collection(db, "employee"),
        where("id", "==", userId)
      );
      const querySnapshot = await getDocs(employeeQuery);

      if (querySnapshot.empty) {
        alert("Employee ID does not exist");
        return;
      }

      const employeeDoc = querySnapshot.docs[0];
      const employeeData = employeeDoc.data();

      if (employeeData.password !== currentPassword) {
        alert("Current password is incorrect.");
        return;
      }

      const docRef = doc(db, "employee", employeeDoc.id);

      await updateDoc(docRef, {
        password: newPassword,
      });

      alert("Password changed successfully!");
      setShowPasswordModal(false);
    } catch (error) {
      console.error("Error updating password: ", error);
      alert("Error updating password.");
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  const formatWorkDuration = (duration) => {
    if (duration === 0) {
      return "0 h 0 m";
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} h ${minutes} m`;
  };

  return (
    <div className={styles.container}>
      <title>MTG - Employee</title>
      <div
        className={`overflow-y-auto
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ${styles.formContainer}`}
      >
        <h1>
          {greeting}, {userName}!
        </h1>

        <div className={styles.currentTime}>Current Time: {currentTime}</div>
        <div className={styles.currentTime}>
          Auto Logout In: {Math.floor(autoLogoutTime / 60)}:
          {String(autoLogoutTime % 60).padStart(2, "0")}
          <div className={styles.currentTime}>
            Today&apos;s Work Duration: {formatWorkDuration(workDurationToday)}
          </div>{" "}
        </div>
        {newestBulletin && (
          <div className={styles.bulletinSection}>
            <h2>Bulletin Board</h2>
            <div className={styles.bulletinHeader}>
              <h3>{newestBulletin.title}</h3>
              <p>By: {newestBulletin.author}</p>
              <p>
                {new Date(newestBulletin.createdAt.toDate()).toLocaleString()}
              </p>
            </div>
            <p>{newestBulletin.message}</p>
            <button
              className={styles.viewAllButton}
              onClick={() => setShowBulletinOverlay(true)}
            >
              View All Bulletins
            </button>
          </div>
        )}

        <div className={styles.buttonAndBreakGroup}>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.clockInButton} ${
                isClockedIn ? styles.disabledButton : ""
              }`}
              onClick={() =>
                handleClockIn(userId, setClockInTime, setIsClockedIn, addLog)
              }
              disabled={isClockedIn}
            >
              Clock In
            </button>
            <button
              className={`${styles.clockOutButton} ${
                !isClockedIn ? styles.disabledButton : ""
              }`}
              onClick={() =>
                handleClockOut(
                  userId,
                  setIsClockedIn,
                  setTotalBreakDuration,
                  addLog,
                  clockInTime,
                  totalBreakDuration,
                  isOnBreak,
                  breakTimer,
                  setIsOnBreak
                )
              }
              disabled={!isClockedIn}
            >
              Clock Out
            </button>
            <button
              className={styles.changePasswordButton}
              onClick={() => setShowContactModal(true)}
            >
              Contact Admins
            </button>

            <button
              className={styles.changePasswordButton}
              onClick={() => setSentFormsModal(true)}
            >
              View Sent Contact Forms
            </button>
            <button
              className={styles.changePasswordButton}
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          </div>
          <div className={styles.breakGroup}>
            <div className={styles.breakOption}>
              <input
                type="radio"
                name="breakOption"
                value="select"
                checked={selectedOption === "select"}
                onChange={handleOptionChange}
                disabled={!isClockedIn}
              />
              <select
                className={styles.breakSelect}
                value={breakTime}
                onChange={handleBreakTimeChange}
                disabled={selectedOption !== "select" || !isClockedIn}
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
                checked={selectedOption === "custom"}
                onChange={handleOptionChange}
                disabled={!isClockedIn}
              />
              <input
                type="number"
                className={styles.breakInput}
                placeholder="Custom"
                value={customBreakTime}
                onChange={handleCustomBreakTimeChange}
                disabled={selectedOption !== "custom" || !isClockedIn}
                min="1"
              />
            </div>
            <button
              className={`${styles.startBreakButton} ${
                !isClockedIn || isOnBreak ? styles.disabledButton : ""
              }`}
              onClick={handleStartBreakClick}
              disabled={!isClockedIn || isOnBreak}
            >
              Start Break
            </button>
          </div>
        </div>
        <WorkHours employeeId={userId} />
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
        <button className={styles.logoutButton} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Bulletin Overlay */}
      {showBulletinOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <h2>All Bulletins</h2>
            <button
              className={styles.closeButton}
              onClick={() => setShowBulletinOverlay(false)}
            >
              Close
            </button>
            <ul className={styles.bulletinList}>
              {bulletins.map((bulletin) => (
                <li key={bulletin.id} className={styles.bulletinItem}>
                  <h3>{bulletin.title}</h3>
                  <p>By: {bulletin.author}</p>
                  <p>
                    {new Date(bulletin.createdAt.toDate()).toLocaleString()}
                  </p>
                  <p>{bulletin.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className={styles.passwordModal}>
          <div className={styles.passwordModalContent}>
            <Contact userId={userId} name={userName} />
            <button onClick={() => setShowContactModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showSentFormsModal && (
        <div className={styles.passwordModal}>
          <div className={styles.passwordModalContent}>
            <SentForms userId={userId} />
            <button onClick={() => setSentFormsModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className={styles.passwordModal}>
          <div className={styles.passwordModalContent}>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.formGroup}>
                <label>Current Password:</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <div className={styles.passwordModalButtons}>
                <button type="submit">Confirm</button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Employee);
