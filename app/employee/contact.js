"use client";

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";
import styles from "./employee.module.css";

const Contact = ({ userId, name }) => {
  const [formData, setFormData] = useState({
    userId: userId,
    name: name,
    message: "",
  });
  const [status, setStatus] = useState(null);

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
        message: "",
      });
      setStatus("Form submitted successfully.");
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("Error submitting form. Please try again.");
    }
  };

  return (
    <div className={styles.formGroup}>
      <form onSubmit={handleSubmit}>
        <h2>Contact Admins</h2>
        <div className="max-w-sm">
          <label
            for="id"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            ID
          </label>
          <input
            type="text"
            id="id"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            value={formData.userId}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="max-w-sm">
          <label
            for="name"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            value={formData.name}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="max-w-sm">
          <label
            for="textarea-label"
            className="block text-sm font-medium mb-2 dark:text-white"
          >
            Comment
          </label>
          <textarea
            id="textarea-label"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        >
          Submit
        </button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
