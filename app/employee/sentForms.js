import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";
import "./employee.module.css";

const SentForms = ({ userId }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentForms = async () => {
      setLoading(true);
      try {
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const formsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setForms(formsData);
      } catch (err) {
        setError("Error fetching messages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentForms();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Sent Forms</h2>
      {forms.length === 0 ? (
        <p className="text-gray-500">No sent forms found.</p>
      ) : (
        <ul className="space-y-4">
          {forms.map((form) => (
            <li
              key={form.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-md"
            >
              <p className="text-gray-800">
                <strong className="font-semibold">Message:</strong>{" "}
                {form.message}
              </p>
              <p className="text-gray-800">
                <strong className="font-semibold">Status:</strong> {form.status}
              </p>
              <p className="text-gray-800">
                <strong className="font-semibold">Time:</strong>{" "}
                {new Date(form.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SentForms;
