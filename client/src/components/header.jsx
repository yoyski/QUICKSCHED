import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left side: Logo and Title */}
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-calendar-days text-purple-600 text-xl"></i>
          <h1 className="text-base font-semibold text-gray-800 dark:text-white">
            QuickSched
          </h1>
        </div>

        {/* Right side: New Button */}
        <div>
          <Link 
            to="/create"
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition"
          >
            Create
          </Link>
        </div>
      </div>
    </header>
  );
};
