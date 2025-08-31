// src/components/EventCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function EventCard({ event, user, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/edit-event/${event.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-2">{event.description}</p>
        <p className="text-gray-700 font-medium mb-1">Category: {event.category}</p>
        <p className="text-gray-700 font-medium mb-1">Location: {event.location}</p>
        <p className="text-gray-800 font-semibold">${event.price}</p>
      </div>

      {user && (
        <div className="p-4 flex justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onDelete(event.id);
            }}
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;
