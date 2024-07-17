import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import db from "../firebase";
import "./bulletin.css";

const Bulletin = ({ userId, userName }) => {
  const [bulletins, setBulletins] = useState([]);
  const [newBulletin, setNewBulletin] = useState({ title: "", message: "" });
  const [adminId, setAdminId] = useState(userId);
  const [adminName, setAdminName] = useState(userName);

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

  const handleAddBulletin = async () => {
    try {
      if (newBulletin.title && newBulletin.message) {
        await addDoc(collection(db, "bulletins"), {
          title: newBulletin.title,
          author: adminName,
          authorId: adminId,
          message: newBulletin.message,
          createdAt: new Date(),
        });
        setNewBulletin({ title: "", message: "" }); // Clear form
        // Fetch updated list of bulletins
        const querySnapshot = await getDocs(collection(db, "bulletins"));
        const bulletinsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBulletins(bulletinsData);
      }
    } catch (error) {
      console.error("Error adding bulletin:", error);
    }
  };

  const handleDeleteBulletin = async (id) => {
    try {
      await deleteDoc(doc(db, "bulletins", id));
      // Fetch updated list of bulletins
      const querySnapshot = await getDocs(collection(db, "bulletins"));
      const bulletinsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBulletins(bulletinsData);
    } catch (error) {
      console.error("Error deleting bulletin:", error);
    }
  };

  return (
    <div>
      <div className="admin-bulletin-board">
        <div>
          <h2>Add New Bulletin</h2>
          <input
            type="text"
            value={newBulletin.title}
            onChange={(e) =>
              setNewBulletin({ ...newBulletin, title: e.target.value })
            }
            placeholder="Title"
          />
          <textarea
            value={newBulletin.message}
            onChange={(e) =>
              setNewBulletin({ ...newBulletin, message: e.target.value })
            }
            placeholder="Message"
          />
          <button
            onClick={() => handleAddBulletin(newBulletin)}
            disabled={!newBulletin.title || !newBulletin.message}
          >
            Add Bulletin
          </button>
        </div>
      </div>
      <div>
        <h2>Bulletin List</h2>
        <ul className="bulletin-list">
          {bulletins.map((bulletin) => (
            <li key={bulletin.id} className="bulletin-item">
              <div className="bulletin-header">
                <h3 className="bulletin-title">{bulletin.title}</h3>
                <p className="bulletin-author">By: {bulletin.author}</p>
              </div>
              <p className="bulletin-message">{bulletin.message}</p>
              <p className="bulletin-timestamp">
                {new Date(bulletin.createdAt.toDate()).toLocaleString()}
              </p>
              {userId === bulletin.authorId && (
                <button
                  className="bulletin-delete-button"
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
