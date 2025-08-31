import React from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, PlusIcon } from "@heroicons/react/24/outline";

function Navbar() {
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate("/add-event");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="EventHive Logo" className="w-10 h-10 rounded-full shadow-lg" />
          <h1 className="text-white font-bold text-2xl tracking-wide">EventHive</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            Add Event
          </button>

          <button className="relative text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
            <BellIcon className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 inline-flex w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
