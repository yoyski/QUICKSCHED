import React, { useContext, useState, useEffect, useRef } from "react";
import { AdminContext } from "../App";

export const Header = () => {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error message
  const inputRef = useRef(null);

  const handleToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setError("");
    } else {
      setShowPasswordInput(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordInput(false);
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password. Please try again."); // Show error instead of alert
      setPassword("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Focus input when it shows
  useEffect(() => {
    if (showPasswordInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordInput]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowPasswordInput(false);
        setPassword("");
        setError("");
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-calendar-days text-purple-600 text-xl" />
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              QuickSched
            </h1>
          </div>

          {/* Toggle Mode Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggle}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isAdmin
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="relative flex items-center">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                    isAdmin ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {isAdmin ? "Admin Mode" : "Visitor Mode"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Password Prompt */}
      {showPasswordInput && !isAdmin && (
        <div className="fixed top-16 w-full flex justify-center z-40">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-xl px-6 py-4 flex flex-col gap-1"
          >
            <div className="flex items-center gap-3">
              <input
                type="password"
                ref={inputRef}
                placeholder="Enter admin password"
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-64 dark:bg-gray-700 dark:text-white"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={error ? "true" : "false"}
                aria-describedby="password-error"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Submit
              </button>
              <button
                type="button"
                className="text-gray-500 hover:text-red-500 text-xl"
                onClick={() => {
                  setShowPasswordInput(false);
                  setPassword("");
                  setError("");
                }}
                title="Cancel"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Inline error message below the input */}
            {error && (
              <p
                id="password-error"
                className="text-sm text-red-600 font-medium pl-1"
                style={{ marginLeft: "0.5rem" }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </>
  );
};
