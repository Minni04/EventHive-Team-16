// src/components/EventList.jsx
import React from "react";
import EventCard from "./eventcard";

function EventList({ events, user, onEdit, onDelete }) {
  if (events.length === 0) {
    return <p className="text-gray-600 col-span-full">No events yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default EventList;
