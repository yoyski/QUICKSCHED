import React, { useState } from "react";

const CategoriesPostType = ({ selectedCategory, onCategoryChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ["Birthday", "Event", "Holiday", "General"];

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
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition font-semibold cursor-pointer"
      >
        Category: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </button>

      {dropdownOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-xl shadow-xl bg-white ring-1 ring-purple-300">
          <div className="py-1">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => handleSelect(category)}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition text-left"
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
