"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";

const Contact = ({ userName, updateMessages }) => {
  const [contactForms, setContactForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchContactForms = async () => {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const forms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      forms.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

      setContactForms(forms);
      setLoading(false);
    };
    fetchContactForms();
    setAdminName(userName);
  }, [userName]);

  const handleUpdateStatus = async (id, newStatus) => {
    const formDoc = doc(db, "messages", id);
    await updateDoc(formDoc, { status: newStatus });
    setContactForms(
      contactForms.map((form) =>
        form.id === id ? { ...form, status: newStatus } : form
      )
    );
  };

  const handleReply = async (id, reply) => {
    const formDoc = doc(db, "messages", id);
    await updateDoc(formDoc, { reply: reply });
    setContactForms(
      contactForms.map((form) =>
        form.id === id ? { ...form, reply: reply } : form
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Employee Messages
      </h2>
      <ul className="space-y-6">
        {contactForms.map((form) => (
          <li
            key={form.id}
            className="p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md"
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-md">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Employee ID:
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {form.userId}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-md">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Name:
                </p>
                <p className="text-gray-800 dark:text-gray-200">{form.name}</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-md">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Time:
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {form.createdAt.toDate().toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-md">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Message:
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {form.message}
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-md">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  Status:
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {form.status}
                </p>
              </div>
              {form.status === "pending" && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      handleUpdateStatus(
                        form.id,
                        `Resolved by ${adminName} at ${new Date().toLocaleString()}`
                      );
                      updateMessages();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contact;
