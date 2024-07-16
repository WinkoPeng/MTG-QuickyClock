import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";

const Contact = () => {
  const [contactForms, setContactForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactForms = async () => {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const forms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContactForms(forms);
      setLoading(false);
    };
    fetchContactForms();
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

  return (
    <div>
      <h2>Contact Forms</h2>
      <ul>
        {contactForms.map((form) => (
          <li key={form.id}>
            <p>Employee ID: {form.userId}</p>
            <p>Name: {form.name}</p>
            <p>Time: {form.createdAt.toDate().toString()}</p>
            <p>Message: {form.message}</p>
            <p>Status: {form.status}</p>
            <button onClick={() => handleUpdateStatus(form.id, "resolved")}>
              Mark as Resolved
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contact;
