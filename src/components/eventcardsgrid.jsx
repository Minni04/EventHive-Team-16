// src/components/EventCard.jsx
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

function EventCard({ event, user, onEdit, onDelete }) {
  const [isPublished, setIsPublished] = useState(event.published ?? false);
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async (e) => {
    e.stopPropagation(); // Prevent card click
    setLoading(true);
    try {
      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, { published: !isPublished });
      setIsPublished(!isPublished);
    } catch (err) {
      console.error("Error updating publish status:", err);
      alert("Failed to update publish status");
    }
    setLoading(false);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col cursor-pointer"
      onClick={() => onEdit(event)}
    >
      {/* Event Image */}
      <div className="relative">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="h-48 w-full object-cover rounded-t-lg"
          />
        )}
        {isPublished && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            Published
          </span>
        )}
      </div>

      {/* Event Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
          <p className="text-gray-600 mb-1 line-clamp-3">{event.description}</p>
          <p className="text-gray-700 mb-1 font-medium">Price: ${event.price}</p>
          <p className="text-gray-500 text-sm mb-1">Category: {event.category}</p>
          <p className="text-gray-500 text-sm mb-1">Date: {event.date}</p>
          <p className="text-gray-500 text-sm mb-2">Location: {event.location}</p>
        </div>

        {/* Action Buttons */}
        {user && (
          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <button
              onClick={handleTogglePublish}
              disabled={loading}
              className={`px-3 py-1 rounded text-white transition-colors ${
                isPublished
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              {isPublished ? "Published" : "Unpublished"}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onEdit(event); }}
              className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition-colors"
            >
              <PencilIcon className="w-4 h-4" /> Edit
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
