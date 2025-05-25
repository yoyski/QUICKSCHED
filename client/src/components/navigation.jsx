import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [active, setActive] = useState("home");
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-gray-800 shadow-lg rounded-t-lg sm:rounded-full bottom-0 left-1/2 transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto sm:flex sm:justify-between sm:px-4">
        {/* Home */}
        <Link
          onClick={() => setActive("home")}
          className="inline-flex flex-col items-center justify-center px-5 rounded-t-lg sm:rounded-full transition duration-200 group hover:text-purple-500"
          to="/"
        >
          <i
            className={`fa-solid fa-house text-xl transition-all duration-200 ${
              active === "home" ? "text-purple-500" : "text-white"
            }`}
          ></i>
        </Link>

        {/* Categories */}
        <Link
          onClick={() => setActive("categories")}
          className="inline-flex flex-col items-center justify-center px-5 transition duration-200 group hover:text-purple-500 active:scale-95"
          to="/categories"
        >
          <i
            className={`fa-solid fa-layer-group text-xl transition-all duration-200 ${
              active === "categories" ? "text-purple-500" : "text-white"
            }`}
          ></i>
        </Link>

        {/* Plus Button */}
        <div className="flex items-center justify-center">
          <Link
            onClick={() => setActive("add")}
            className="inline-flex items-center justify-center w-12 h-12 font-medium bg-purple-700 rounded-full transition duration-200 group hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 active:scale-95"
            to="/create"
          >
            <i className="fa-solid fa-plus text-xl text-white"></i>
          </Link>
        </div>

        {/* Calendar */}
        <Link
          onClick={() => setActive("calendar")}
          className="inline-flex flex-col items-center justify-center px-5 transition duration-200 group hover:text-purple-500 active:scale-95"
          to="/calendar"
        >
          <i
            className={`fa-regular fa-calendar text-xl transition-all duration-200 ${
              active === "calendar" ? "text-purple-500" : "text-white"
            }`}
          ></i>
        </Link>

        {/* Notifications */}
        <Link
          onClick={() => setActive("notifications")}
          className="inline-flex flex-col items-center justify-center px-5 transition duration-200 group hover:text-purple-500 active:scale-95"
          to="/notifications"
        >
          <i
            className={`fa-regular fa-bell text-xl transition-all duration-200 ${
              active === "notifications" ? "text-purple-500" : "text-white"
            }`}
          ></i>
        </Link>
      </div>
    </div>
  );
};
