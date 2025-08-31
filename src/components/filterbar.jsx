// src/components/FilterBar.jsx
import React, { useState } from "react";
import { CalendarIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function FilterBar({ onFilter }) {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const handleApply = () => {
    onFilter({ category, date, search });
  };

  const handleReset = () => {
    setCategory("");
    setDate("");
    setSearch("");
    onFilter({ category: "", date: "", search: "" });
  };

  return (
    <div className="bg-white shadow-md rounded-lg max-w-6xl mx-auto p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      
      {/* Category Selector */}
      <div className="flex items-center gap-2 w-full md:w-1/4">
        <FunnelIcon className="w-5 h-5 text-gray-600" />
        <select
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="hackathon">Hackathon</option>
          <option value="coding challenge">Coding Challenge</option>
          <option value="tech workshop">Tech Workshop</option>
          <option value="project showcase">Project Showcase</option>
          <option value="seminar">Seminar</option>
        </select>
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-2 w-full md:w-1/4">
        <CalendarIcon className="w-5 h-5 text-gray-600" />
        <input
          type="date"
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 w-full md:w-1/4">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
        <input
          type="text"
          placeholder="Search events..."
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
