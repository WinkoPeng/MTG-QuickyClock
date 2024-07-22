import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";

const WEEKDAYS_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WorkHours = ({ employeeId }) => {
  const [workHours, setWorkHours] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        const q = query(
          collection(db, "employee"),
          where("id", "==", employeeId)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          console.log(docData);
          setWorkHours(docData.workHours);
        }
      } catch (err) {
        setError("Error fetching work hours: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkHours();
  }, [employeeId]);

  const sortedWorkHours = Object.entries(workHours).sort(
    (a, b) => WEEKDAYS_ORDER.indexOf(a[0]) - WEEKDAYS_ORDER.indexOf(b[0])
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Your Weekly Work Hours
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-6 py-3 border-b border-gray-200">Day</th>
              <th className="px-6 py-3 border-b border-gray-200">Hours</th>
            </tr>
          </thead>
          <tbody>
            {sortedWorkHours.map(([day, hours]) => (
              <tr key={day} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200">{day}</td>
                <td className="px-6 py-4 border-b border-gray-200">{hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkHours;
