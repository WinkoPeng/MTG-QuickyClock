"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import mtglogo from "../public/images/MTGBCSLogo.jpg";
import { verifyUser } from "./employee/auth";

export default function Home() {
  const router = useRouter();

  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const mtgId = document.getElementById("mtgId").value;
      const password = document.getElementById("password").value;

      const verifiedUser = await verifyUser(mtgId, password);

      if (verifiedUser) {
        const userData = verifiedUser;
        localStorage.setItem(
          "userName",
          `${userData.firstName} ${userData.lastName}`
        ); // Store user name
        localStorage.setItem("userId", mtgId); // Store user ID
        router.push("/employee");
      } else {
        setError("Username or password is incorrect");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleAdminLogin = async () => {
    const mtgId = document.getElementById("mtgId").value;
    const password = document.getElementById("password").value;

    const verifiedUser = await verifyUser(mtgId, password);

    if (verifiedUser) {
      const userData = verifiedUser;
      if (userData.class === "admin") {
        localStorage.setItem(
          "adminName",
          `${userData.firstName} ${userData.lastName}`
        ); // Store admin name
        localStorage.setItem("userId", mtgId); // Store user ID
        router.push("/admin");
      } else {
        setError("Invalid admin credentials");
      }
    } else {
      setError("Username or password is incorrect");
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
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
