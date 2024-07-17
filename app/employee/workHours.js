import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase";
import styles from "./workHours.module.css";

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
    <div className={styles.container}>
      <h2 className={styles.heading}>Your weekly work hours</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {sortedWorkHours.map(([day, hours]) => (
            <tr key={day}>
              <td>{day}</td>
              <td>{hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkHours;
