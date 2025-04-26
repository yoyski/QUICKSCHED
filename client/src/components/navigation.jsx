import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white shadow-lg rounded-t-lg sm:rounded-full bottom-0 left-1/2 transition-all duration-300 ease-in-out dark:bg-gray-800">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto sm:flex sm:justify-between sm:px-4">
        
        {/* Home */}
        <Link
          data-tooltip-target="tooltip-home"
          type="button"
          onClick={() => setActive("home")}
          className="inline-flex flex-col items-center justify-center px-5 rounded-t-lg sm:rounded-full transition duration-200 group hover:text-purple-500 "
          to="/"
        >  
          <i className={`fa-solid fa-house text-xl transition-all duration-200 ${active === "home" ? "scale-120 text-purple-500" : "scale-100 text-white"}`}></i>
        </Link>

        {/* Categories */}
        <Link
          data-tooltip-target="tooltip-wallet"
          type="button"
          onClick={() => setActive("categories")}
          className="inline-flex flex-col items-center justify-center px-5 transition duration-200 group hover:text-purple-500 active:scale-95"
          to="/categories"
        >
          <i className={`fa-solid fa-layer-group text-xl transition-all duration-200 ${active === "categories" ? "scale-120 text-purple-500" : "scale-100 text-white"}`}></i>
        </Link>

        {/* Plus Button */}
        <div className="flex items-center justify-center">
          <Link
            data-tooltip-target="tooltip-new"
            type="button"
            onClick={() => setActive("add")}
            className="inline-flex items-center justify-center w-12 h-12 font-medium bg-purple-700 rounded-full transition duration-200 group hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 focus:outline-none dark:focus:ring-purple-900 active:scale-95"
            to="/create"
          >
            <i className="fa-solid fa-plus text-xl text-white"></i>
          </Link>
        </div>

        {/* Calendar */}
        <Link
          data-tooltip-target="tooltip-settings"
          type="button"
          onClick={() => setActive("calendar")}
          className="inline-flex flex-col items-center justify-center px-5 transition duration-200 group hover:text-purple-500 active:scale-95"
          to="/calendar"
        >
          <i className={`fa-regular fa-calendar text-xl transition-all duration-200 ${active === "calendar" ? "scale-120 text-purple-500" : "scale-100 text-white"}`}></i>
        </Link>

        {/* Notifications */}
        <Link
          data-tooltip-target="tooltip-profile"
          type="button"
          onClick={() => setActive("notifications")}
          className="inline-flex flex-col items-center justify-center px-5 transition duration-200 group hover:text-purple-500 active:scale-95"
          to="/notifications"
        >
          <i className={`fa-regular fa-bell text-xl transition-all duration-200 ${active === "notifications" ? "scale-120 text-purple-500" : "scale-100 text-white"}`}></i>
        </Link>
      </div>
    </div>
  );
};
