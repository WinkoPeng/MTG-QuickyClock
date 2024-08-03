import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import db from "../firebase";

const Bulletin = ({ userId, userName }) => {
  // State to manage bulletins, new bulletin form data, and admin information
  const [bulletins, setBulletins] = useState([]);
  const [newBulletin, setNewBulletin] = useState({ title: "", message: "" });
  const [adminId, setAdminId] = useState(userId);
  const [adminName, setAdminName] = useState(userName);

  // Fetch bulletins from Firestore when the component mounts
  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        // Get all documents from the "bulletins" collection
        const querySnapshot = await getDocs(collection(db, "bulletins"));

        // Map each document to its data and include the document ID
        const bulletinsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort bulletins by 'createdAt' field in descending order
        const sortedBulletins = bulletinsData.sort((a, b) => {
          const dateA =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toDate()
              : new Date(a.createdAt.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
          const dateB =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toDate()
              : new Date(b.createdAt.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
          return dateB - dateA;
        });

        // Update state with sorted bulletins
        setBulletins(sortedBulletins);
      } catch (error) {
        console.error("Error fetching bulletins:", error);
      }
    };

    fetchBulletins();
  }, []); // Empty dependency array means this runs once when component mounts

  // Handle adding a new bulletin
  const handleAddBulletin = async () => {
    try {
      // Check if title and message are not empty
      if (newBulletin.title && newBulletin.message) {
        // Add a new document to the "bulletins" collection
        const docRef = await addDoc(collection(db, "bulletins"), {
          title: newBulletin.title,
          author: adminName,
          authorId: adminId,
          message: newBulletin.message,
          createdAt: Timestamp.now(), // Use Firestore Timestamp for creation time
        });

        // Create a new bulletin object with the ID and other details
        const newBulletinData = {
          id: docRef.id,
          title: newBulletin.title,
          author: adminName,
          authorId: adminId,
          message: newBulletin.message,
          createdAt: Timestamp.now(), // Use Firestore Timestamp for creation time
        };

        // Update state to include the new bulletin at the top
        setBulletins([newBulletinData, ...bulletins]);
        setNewBulletin({ title: "", message: "" }); // Clear form fields
      }
    } catch (error) {
      console.error("Error adding bulletin:", error);
    }
  };

  // Handle deleting a bulletin
  const handleDeleteBulletin = async (id) => {
    try {
      // Delete the document from the "bulletins" collection
      await deleteDoc(doc(db, "bulletins", id));

      // Remove the deleted bulletin from the state
      setBulletins(bulletins.filter((bulletin) => bulletin.id !== id));
    } catch (error) {
      console.error("Error deleting bulletin:", error);
    }
  };

  return (
    <div className="py-6 bg-light dark:bg-gray-900 min-h-screen">
      <div className="bg-lighter dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Make an Announcement
        </h2>
        <input
          type="text"
          value={newBulletin.title}
          onChange={(e) =>
            setNewBulletin({ ...newBulletin, title: e.target.value })
          }
          placeholder="Title"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <textarea
          value={newBulletin.message}
          onChange={(e) =>
            setNewBulletin({ ...newBulletin, message: e.target.value })
          }
          placeholder="Message"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
          rows="4"
        />
        <button
          onClick={handleAddBulletin}
          disabled={!newBulletin.title || !newBulletin.message}
          className={`mt-4 py-2 px-4 w-full rounded-lg font-medium text-white ${
            !newBulletin.title || !newBulletin.message
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
          } transition-colors`}
        >
          Add Announcement
        </button>
      </div>

      <div className="bg-lighter p-2 rounded-xl dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Announcements
        </h2>
        <ul className="space-y-4">
          {bulletins.map((bulletin) => (
            <li
              key={bulletin.id}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {bulletin.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By: {bulletin.author}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {bulletin.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(bulletin.createdAt.seconds * 1000).toLocaleString()}{" "}
                {/* Ensure valid date conversion */}
              </p>
              {userId === bulletin.authorId && (
                <button
                  className="mt-2 py-1 px-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  onClick={() => handleDeleteBulletin(bulletin.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bulletin;
