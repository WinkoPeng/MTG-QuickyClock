"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import db from "./firebase";
import { DateTime } from "luxon";
import mtglogo from "../public/images/MTGBCSLogo.jpg";
import { updateWorkDuration } from "./employee/timer";

export default function Home() {
  const router = useRouter();

  const updateAllEmployeesWorkDuration = async () => {
    const now = DateTime.now().setZone("America/Edmonton");
    const today = now.toISODate();

    const employeesSnapshot = await getDocs(collection(db, "employee"));

    employeesSnapshot.forEach(async (employeeDoc) => {
      const userData = employeeDoc.data();
      const lastOnlineDate = userData.lastOnlineDate || today;

      if (today !== lastOnlineDate) {
        const userRef = doc(db, "employee", employeeDoc.id);
        await updateDoc(userRef, { workDurationToday: 0 });
      }
    });
  };

  useEffect(() => {
    updateAllEmployeesWorkDuration();
  }, []);

  const handleLogin = async () => {
    const mtgId = document.getElementById("mtgId").value;
    const password = document.getElementById("password").value;

    const q = query(
      collection(db, "employee"),
      where("id", "==", mtgId),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userId", mtgId); // Store user ID
      //updateWorkDuration(mtgId); // Continue updating work duration if user is online
      router.push("/employee");
    } else {
      console.error("Invalid credentials");
      alert("Invalid credentials");
    }
  };

  const handleAdminLogin = async () => {
    const mtgId = document.getElementById("mtgId").value;
    const password = document.getElementById("password").value;

    const q = query(
      collection(db, "employee"),
      where("id", "==", mtgId),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      if (userData.class === "admin") {
        localStorage.setItem("adminName", userData.name); // Store admin name
        localStorage.setItem("userId", mtgId); // Store user ID
        updateWorkDuration(mtgId); // Continue updating work duration if user is online
        router.push("/admin");
      } else {
        console.error("You are not authorized to access admin page");
        alert("You are not authorized to access admin page");
      }
    } else {
      console.error("Invalid credentials");
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/eebg.jpg')" }}
    >
      <div className="flex items-center justify-center lg:justify-end h-full px-4 lg:px-32">
        <div className="flex flex-col items-center w-full max-w-sm space-y-4 bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <Image src={mtglogo} alt="MTG Logo" className="w-64 h-auto" />
          <input
            type="text"
            placeholder="Enter Your MTG ID"
            className="p-4 block w-full bg-gray-200 border border-gray-300 rounded-lg text-sm placeholder-gray-400"
            id="mtgId"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-4 block w-full bg-gray-200 border border-gray-300 rounded-lg text-sm placeholder-gray-400"
            id="password"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600 transition-colors"
            onClick={handleLogin}
          >
            Login
          </button>
          <a
            onClick={handleAdminLogin}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login as Admin
          </a>
        </div>
      </div>
      <div className="absolute bottom-4 w-full text-center text-gray-600">
        &copy; 2024 MTG Healthcare Academy
      </div>
    </div>
  );
}
