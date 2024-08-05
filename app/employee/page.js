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
import Header from "./header";
import Logs from "./logs";
import { handleClockIn, handleClockOut } from "./timer";

const Employee = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [autoLogoutTime, setAutoLogoutTime] = useState(600); // 10 minutes in seconds
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSentFormsModal, setSentFormsModal] = useState(false);
  const [empData, setEmpData] = useState({});
  const [employeeDocId, setEmployeeDocId] = useState("");
  const [forms, setForms] = useState([]);

  const handleAutoLogout = useCallback(() => {
    router.push("/");
    return 600;
  }, [router]);

  const fetchData = async (storedUserId) => {
    if (!storedUserId) return;

    try {
      const employeeQuery = query(
        collection(db, "employee"),
        where("id", "==", storedUserId)
      );
      const querySnapshot = await getDocs(employeeQuery);

      if (!querySnapshot.empty) {
        const employeeDoc = querySnapshot.docs[0];
        const employeeData = employeeDoc.data();
        setEmpData(employeeData);
        setEmployeeDocId(employeeDoc.id); // Use a different name for the document ID
        setIsClockedIn(employeeData.status === "online");
      } else {
        console.error("No employee found with the given ID");
        setEmpData(null);
        setEmployeeDocId(""); // Clear the document ID
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedUserId) {
      setUserId(storedUserId);
      fetchData(storedUserId); // Fetch data when userId changes
      fetchSentForms(storedUserId);
    }
  }, [userId]);

  const fetchSentForms = async (userId) => {
    try {
      const messagesRef = collection(db, "messages");
      const q = query(messagesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const formsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort forms by the most recent date
      formsData.sort((a, b) => {
        const dateA = new Date(a.createdAt.seconds * 1000);
        const dateB = new Date(b.createdAt.seconds * 1000);
        return dateB - dateA; // Sort in descending order
      });
      setForms(formsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Timer for current time and greeting
    const timeInterval = setInterval(() => {
      const now = DateTime.now().setZone("America/Edmonton");
      setCurrentTime(now.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS));

      const hour = now.hour;
      if (hour < 12) {
        setGreeting("morning");
      } else if (hour < 18) {
        setGreeting("afternoon");
      } else {
        setGreeting("evening");
      }
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [userId]);

  // Handle auto logout timer
  useEffect(() => {
    if (autoLogoutTime > 0) {
      const autoLogoutInterval = setInterval(() => {
        setAutoLogoutTime((prevTime) =>
          prevTime <= 1 ? handleAutoLogout() : prevTime - 1
        );
      }, 1000); // 1000 milliseconds = 1 second

      return () => clearInterval(autoLogoutInterval);
    }
  }, [autoLogoutTime]);

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
    <div className="bg-light dark:bg-gray-900">
      <Header title="Employee" adminName={userName} onLogout={handleLogout} />
      <div className="container mx-auto dark:bg-gray-900">
        <title>MTG - Employee</title>
        <div className="bg-light min-w-full dark:bg-gray-900">
          {/* Greeting and Time Section */}
          <div className="min-w-full dark:bg-gray-900 pt-2">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              {/* Greeting Section */}
              <div className="text-center flex-grow">
                <h1 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                  Good {greeting}, {userName}
                </h1>
              </div>
            </div>

            {/* Time Section */}
            <div className="text-sm md:text-base lg:text-lg xl:text-xl bg-lighter dark:bg-gray-800 rounded-lg text-center md:text-left lg:text-center">
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
            </div>
          </div>

          {/* Announcements and Clock In/Out */}
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
            {/* Announcements */}
            <div className="w-full md:w-2/3 bg-gray-200 bg-light dark:bg-dark rounded-lg">
              <UserBulletinBoard />
            </div>

            {/* Clock In/Out Section */}
            <div className="w-full dark:bg-dark rounded-lg bg-light md:w-1/3 flex flex-col space-y-4">
              {/* Clock In/Out */}
              <div className="space-y-2 pb-2">
                {!isClockedIn ? (
                  <button
                    className={`w-full h-full py-5 text-4xl px-4 rounded-full ${
                      isClockedIn
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 text-white"
                    }`}
                    onClick={async () => {
                      await handleClockIn(
                        empData,
                        employeeDocId,
                        setIsClockedIn,
                        setIsLoading
                      );
                      fetchData(userId);
                    }}
                    disabled={isClockedIn}
                  >
                    Clock In
                  </button>
                ) : (
                  <button
                    className={`w-full h-full py-5 text-4xl px-4 rounded-full ${
                      !isClockedIn
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white"
                    }`}
                    onClick={async () => {
                      await handleClockOut(
                        empData,
                        employeeDocId,
                        setIsClockedIn
                      );
                      fetchData(userId);
                    }}
                    disabled={!isClockedIn}
                  >
                    Clock Out
                  </button>
                )}
              </div>

              <div className="flex flex-row space-x-4 sm:flex-col sm:space-x-0 sm:space-y-4 mt-4">
                <button
                  className="w-full py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm bg-blue-600 dark:bg-blue-700 text-white rounded"
                  onClick={() => setShowContactModal(true)}
                >
                  Contact Admins
                </button>
                <button
                  className="w-full py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm bg-blue-600 dark:bg-blue-700 text-white rounded"
                  onClick={() => {
                    setSentFormsModal(true);
                    console.log(showSentFormsModal);
                  }}
                >
                  View Sent Contact Forms
                </button>
                <button
                  className="w-full py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm bg-blue-600 dark:bg-blue-700 text-white rounded"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <WorkHours employeeId={userId} />
          <Logs employeeData={empData} />
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-lg">
              <svg
                className="animate-spin h-8 w-8 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="none"
                  d="M4 12a8 8 0 0116 0"
                ></path>
              </svg>
              <p className="mt-2">Checking Location</p>
            </div>
          </div>
        )}

        {/* Modals */}
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
          fetchForms={fetchSentForms}
        />

        <SentForms
          formData={forms}
          showSentFormsModal={showSentFormsModal}
          setSentFormsModal={setSentFormsModal}
        />
      </div>
    </div>
  );
};

export default withAuth(Employee);
