// Header.js
import React from "react";

const Header = ({ title, adminName, onLogout }) => {
  return (
    <div className="bg-primaryDark border-b border-b-1 border-black p-1 shadow-md flex items-center justify-between">
      <div className="flex items-center justify-center">
        <img
          src="/images/mtglogo.png"
          alt="MTG Logo"
          width={48}
          height={48}
          className="mr-0"
          style={{ alignSelf: "center" }}
        />
        <div className="leading-tight">
          <h2 className="text-white text-md font-bold">
            MTG Healthcare Quicky Clock
          </h2>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={onLogout}
          className=" text-white px-3 py-1 rounded-md hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Header;
