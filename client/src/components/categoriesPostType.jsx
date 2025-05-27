import React, { useState } from "react";

const CategoriesPostType = ({ selectedCategory, onCategoryChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ["Birthday", "Event", "Holiday", "General"];

  // Function to get color classes for each category
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "general":
        return "bg-yellow-100 text-yellow-800";
      case "birthday":
        return "bg-red-100 text-red-800";
      case "event":
        return "bg-blue-100 text-blue-800";
      case "holiday":
        return "bg-green-100 text-green-800";
      default:
        return "bg-yellow-100 text-yellow-800"; // default same as general
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelect = (value) => {
    const fakeEvent = { target: { value } };
    onCategoryChange(fakeEvent);
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full px-4 py-2 rounded-full shadow-md transition font-semibold cursor-pointer flex items-center justify-between ${
          getCategoryColor(selectedCategory.toLowerCase())
        }`}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
      >
        <span>
          Category:{" "}
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </span>
        {/* Down arrow caret */}
        <svg
          className={`w-5 h-5 ml-2 text-current transition-transform duration-200 ${
            dropdownOpen ? "transform rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-xl shadow-xl bg-white ring-1 ring-purple-300">
          <div className="py-1">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => handleSelect(category)}
                className={`${getCategoryColor(category.toLowerCase())} block w-full px-4 py-2 text-sm rounded-lg transition text-left hover:brightness-95`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPostType;
