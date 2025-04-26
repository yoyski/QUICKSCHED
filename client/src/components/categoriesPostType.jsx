import React, { useState } from "react";

const CategoriesPostType = ({ selectedCategory, onCategoryChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ["Birthday", "Event", "Holiday", "General"];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelect = (value) => {
    const fakeEvent = { target: { value } }; // mimic an event object
    onCategoryChange(fakeEvent);
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleDropdown}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </button>

      {dropdownOpen && (
        <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => handleSelect(category)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
