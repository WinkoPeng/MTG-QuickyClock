"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";

const UserBulletinBoard = () => {
  const [bulletins, setBulletins] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  // Get the latest bulletin
  const latestBulletin = bulletins.length > 0 ? bulletins[0] : null;

  return (
    <div className="relative rounded-lg p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Announcements
      </h1>

      {latestBulletin && !showAll ? (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-4">
          {/* Latest bulletin preview */}
          <div className="mb-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {latestBulletin.title}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              By: {latestBulletin.author}
            </p>
          </div>
          <p
            className={`text-gray-700 dark:text-gray-300 mb-1 ${
              !expanded ? "line-clamp-3" : ""
            }`}
          >
            {latestBulletin.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {new Date(latestBulletin.createdAt.toDate()).toLocaleString()}
          </p>
          {latestBulletin.message.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-sm"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
          <button
            onClick={() => setShowAll(true)}
            className="mt-2 ml-2 px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 text-sm"
          >
            Show All Messages
          </button>
        </div>
      ) : null}

      {/* Full list overlay */}
      {showAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setShowAll(false)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              All Bulletins
            </h2>
            <ul className="space-y-2">
              {bulletins.map((bulletin) => (
                <li
                  key={bulletin.id}
                  className="p-2 bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg"
                >
                  <div className="mb-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {bulletin.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      By: {bulletin.author}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    {bulletin.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(bulletin.createdAt.toDate()).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBulletinBoard;
