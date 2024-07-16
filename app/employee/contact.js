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
      setStatus("Form submitted successfully.");
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("Error submitting form. Please try again.");
    }
  };

  return (
    <div className={styles.formGroup}>
      <form onSubmit={handleSubmit}>
        <h2>Contact Us</h2>
        <label htmlFor="id">ID</label>
        <input
          type="text"
          name="id"
          value={formData.userId}
          onChange={handleChange}
          placeholder="ID"
          required
          disabled
        />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          disabled
        />
        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          required
        />
        <button type="submit">Submit</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
};

export default Contact;
