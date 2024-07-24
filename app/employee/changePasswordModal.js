"use client";

import React, { useState } from "react";
import {
  query,
  where,
  getDocs,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase";

const ChangePasswordModal = ({
  userId,
  showPasswordModal,
  setShowPasswordModal,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

  if (!showPasswordModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          onClick={() => setShowPasswordModal(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Current Password:
            </label>
            <input
              type="password"
              className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              New Password:
            </label>
            <input
              type="password"
              className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Confirm New Password:
            </label>
            <input
              type="password"
              className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Confirm
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
