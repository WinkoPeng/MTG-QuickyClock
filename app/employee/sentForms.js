"use client";

import React, { useEffect, useState } from "react";

const SentForms = ({ formData, showSentFormsModal, setSentFormsModal }) => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    formData && setForms(formData);
  }, [formData]);

  return (
    <>
      {showSentFormsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              onClick={() => setSentFormsModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                My Sent Forms
              </h2>
              {forms.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No sent forms found.
                </p>
              ) : (
                <ul className="space-y-4">
                  {forms.map((form) => (
                    <li
                      key={form.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 shadow-md"
                    >
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong className="font-semibold">Message:</strong>{" "}
                        {form.message}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong className="font-semibold">Time:</strong>{" "}
                        {new Date(
                          form.createdAt.seconds * 1000
                        ).toLocaleString()}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong className="font-semibold">Status:</strong>{" "}
                        {form.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SentForms;
