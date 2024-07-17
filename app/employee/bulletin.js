"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import "./bulletin.css";

const UserBulletinBoard = () => {
  const [bulletins, setBulletins] = useState([]);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching bulletins:", error);
      }
    };

    fetchBulletins();
  }, []);

  return (
    <div className="user-bulletin-board">
      <h1>User Bulletin Board</h1>
      <ul className="bulletin-list">
        {bulletins.map((bulletin) => (
          <li key={bulletin.id} className="bulletin-item">
            <div className="bulletin-header">
              <h2 className="bulletin-title">{bulletin.title}</h2>
              <p className="bulletin-author">By: {bulletin.author}</p>
            </div>
            <p className="bulletin-message">{bulletin.message}</p>
            <p className="bulletin-timestamp">
              {new Date(bulletin.createdAt.toDate()).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBulletinBoard;
