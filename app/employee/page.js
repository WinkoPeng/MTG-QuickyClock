"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DateTime } from "luxon";
import { query, where, getDocs, collection } from "firebase/firestore";
import db from "../firebase";
import WorkHours from "./workHours";
import withAuth from "../withAuth";
import ChangePasswordModal from "./changePasswordModal";
import UserBulletinBoard from "./bulletin";
import SentForms from "./sentForms";
import Contact from "./contact";
import {
  handleClockIn,
  handleClockOut,
  updateWorkDuration,
  handleStartBreak,
  formatWorkDuration,
} from "./timer";
import styles from "./employee.module.css";

const Employee = () => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(
    DateTime.now()
      .setZone("America/Edmonton")
      .toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)
  );
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [breakTime, setBreakTime] = useState("15");
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
  const [workDurationToday, setWorkDurationToday] = useState(0); // 新增状态

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

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="dark:bg-gray-900">
      <div className="container mx-auto dark:bg-gray-900">
        <title>MTG - Employee</title>
        <div className="bg-white min-w-full dark:bg-gray-900 p-4 shadow-lg">
          <h1 className="text-2xl text-center font-bold mb-2 text-gray-900 dark:text-gray-100">
            {greeting}, {userName}
          </h1>
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
            <div className="text-lg bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-gray-900 dark:text-gray-100">
                Current Time:{" "}
                <span className="font-semibold">{currentTime}</span>
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                Auto Logout In:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {Math.floor(autoLogoutTime / 60)}:
                  {String(autoLogoutTime % 60).padStart(2, "0")}
                </span>
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                Today&apos;s Work Duration:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatWorkDuration(workDurationToday)}
                </span>
              </p>
            </div>

            <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <UserBulletinBoard />
            </div>

            <div className="w-full md:w-1/3 flex flex-col space-y-4">
              <div className="space-y-2">
                <button
                  className={`w-full py-2 px-4 rounded ${
                    isClockedIn
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white"
                  }`}
                  onClick={() =>
                    handleClockIn(
                      userId,
                      setClockInTime,
                      setIsClockedIn,
                      addLog
                    )
                  }
                  disabled={isClockedIn}
                >
                  Clock In
                </button>
                <button
                  className={`w-full py-2 px-4 rounded ${
                    !isClockedIn
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 text-white"
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
              </div>

              <div className="space-y-2">
                <button
                  className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded"
                  onClick={() => setShowContactModal(true)}
                >
                  Contact Admins
                </button>
                <button
                  className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded"
                  onClick={() => setSentFormsModal(true)}
                >
                  View Sent Contact Forms
                </button>
                <button
                  className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <WorkHours employeeId={userId} />

          <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <table className="w-full text-left text-gray-900 dark:text-gray-100">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2 px-4">Time</th>
                  <th className="py-2 px-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {log.map((entry, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="py-2 px-4">{entry.time}</td>
                    <td className="py-2 px-4">{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="mt-4 w-full py-2 px-4 bg-red-600 dark:bg-red-700 text-white rounded"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>

        <ChangePasswordModal
          userId={userId}
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={setShowPasswordModal}
        />
        <Contact
          userId={userId}
          name={userName}
          showContactModal={showContactModal}
          setShowContactModal={setShowContactModal}
        />
        <SentForms
          userId={userId}
          showSentFormsModal={showSentFormsModal}
          setSentFormsModal={setSentFormsModal}
        />
      </div>
    </div>
  );
};

export default withAuth(Employee);
