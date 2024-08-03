import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import db from "../firebase";

const Contact = ({ userName, updateMessages }) => {
  // State to manage contact forms, loading state, admin name, pagination, search query, and status filter
  const [contactForms, setContactForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter state
  const itemsPerPage = 5;

  const topRef = useRef(null);

  // Fetch contact forms from Firestore when the component mounts or userName changes
  useEffect(() => {
    const fetchContactForms = async () => {
      try {
        // Retrieve all documents from the "messages" collection
        const querySnapshot = await getDocs(collection(db, "messages"));

        // Map each document to its data and include the document ID
        const forms = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort forms by the 'createdAt' field in descending order
        forms.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

        // Update state with sorted contact forms
        setContactForms(forms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact forms:", error);
      }
    };

    fetchContactForms();
    setAdminName(userName); // Update adminName state with userName prop
  }, [userName]);

  // Handle updating the status of a contact form
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Reference to the document in Firestore
      const formDoc = doc(db, "messages", id);

      // Update the status field in the Firestore document
      await updateDoc(formDoc, { status: newStatus });

      // Update local state to reflect the status change
      setContactForms(
        contactForms.map((form) =>
          form.id === id ? { ...form, status: newStatus } : form
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filter contact forms based on the search query and status filter
  const filteredForms = contactForms.filter((form) => {
    const senderName = form.name.toLowerCase();
    const resolverName = form.status.toLowerCase().includes("resolved by")
      ? form.status.split("Resolved by ")[1]?.split(" at ")[0]?.toLowerCase() ||
        ""
      : "";
    const query = searchQuery.toLowerCase();

    // Check if the form matches the search query
    const matchesSearch =
      senderName.includes(query) || resolverName.includes(query);

    // Check if the form matches the status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && form.status === "pending") ||
      (statusFilter === "resolved" && form.status !== "pending");

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Scroll to the top of the page when the page changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div className="p-6 bg-lighter dark:bg-gray-800 min-h-screen">
      {/* Top ref for scrolling */}
      <div ref={topRef}></div>

      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Employee Messages
      </h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by sender or resolver name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <ul className="space-y-4">
        {currentItems.map((form) => (
          <li
            key={form.id}
            className="p-4 bg-light dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md"
          >
            <div className="flex items-start justify-between space-x-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Employee ID:
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {form.userId}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Name:
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {form.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Time:
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {form.createdAt.toDate().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2 bg-lighter dark:bg-gray-600 rounded-md mb-2">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                Message:
              </p>
              <p className="text-gray-800 dark:text-gray-200">{form.message}</p>
            </div>
            <div className="p-2 bg-lighter dark:bg-gray-600 rounded-md">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                Status:
              </p>
              <p className="text-gray-800 dark:text-gray-200">{form.status}</p>
            </div>
            {form.status === "pending" && (
              <div className="mt-2">
                <button
                  onClick={() => {
                    handleUpdateStatus(
                      form.id,
                      `Resolved by ${adminName} at ${new Date().toLocaleString()}`
                    );
                    updateMessages(); // Callback to update messages in parent component
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
                >
                  Mark as Resolved
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-600 dark:text-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Contact;
