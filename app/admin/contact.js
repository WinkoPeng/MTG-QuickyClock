import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";
import "./contact.css";

const Contact = ({ userName, updateMessages }) => {
  const [contactForms, setContactForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState(userName);

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
  }, []);

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
    <div className="container">
      <h2>Employee Messages</h2>
      <ul>
        {contactForms.map((form) => (
          <li key={form.id}>
            <p>Employee ID: {form.userId}</p>
            <p>Name: {form.name}</p>
            <p>Time: {form.createdAt.toDate().toString()}</p>
            <p>Message: {form.message}</p>
            <p>Status: {form.status}</p>
            {form.status === "pending" && (
              <button
                onClick={() => {
                  handleUpdateStatus(
                    form.id,
                    `Resolved by ${adminName} at ${new Date()}`
                  );
                  updateMessages();
                }}
              >
                Mark as Resolved
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contact;
