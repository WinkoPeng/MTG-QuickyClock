"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";

const Contact = ({
  userId,
  name,
  showContactModal,
  setShowContactModal,
  fetchForms,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    console.log("Props received:", { userId, name });

    setFormData({
      userId: userId,
      name: name,
      message: "",
    });
  }, [userId, name]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        status: "pending",
        createdAt: new Date(),
      });
      setFormData({
        ...formData,
        message: "",
      });
      setStatus("Form submitted successfully.");
      fetchForms(userId);
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("Error submitting form. Please try again.");
    }
  };

  return (
    <>
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              onClick={() => setShowContactModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="p-4">
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Contact Admins
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="id"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400"
                  >
                    ID
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="userId"
                    className="py-2 px-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="py-2 px-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-400"
                  >
                    Comment
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="py-2 px-3 block w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 w-full bg-blue-600 dark:bg-blue-700 text-white dark:text-gray-200 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:bg-blue-700 dark:focus:bg-blue-600"
                >
                  Submit
                </button>
                {status && (
                  <p className="mt-4 text-sm text-center text-gray-800 dark:text-gray-200">
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
