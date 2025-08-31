// src/pages/OrganizerHome.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../hooks/useauth";
import EventCard from "../components/eventcard";
import FilterBar from "../components/filterbar";
import { BellIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function OrganizerHome() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch events from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setFilteredEvents(data);
    });
    return () => unsub();
  }, []);

  // Delete an event
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, "events", id));
      alert("🗑️ Event deleted!");
    }
  };

  // Edit an event (navigate to edit page)
  const handleEdit = (event) => navigate(`/edit-event/${event.id}`);

  // Filter events
  const handleFilter = ({ category, date, location, search }) => {
    let filtered = events;
    if (category) filtered = filtered.filter(e => e.category === category);
    if (date) filtered = filtered.filter(e => e.date === date);
    if (location) filtered = filtered.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
    if (search) filtered = filtered.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1
          className="text-3xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          EventHive
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/add-event")}
            className="flex items-center gap-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" /> Add Event
          </button>

          <button className="relative">
            <BellIcon className="w-6 h-6 text-gray-700" />
            <span className="absolute top-0 right-0 bg-red-500 rounded-full text-white text-xs px-1">
              3
            </span>
          </button>

          {user && (
            <>
              <button
                onClick={logout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>

              <button
                onClick={() => navigate("/attendee-home")}
                className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
              >
                Switch to Attendee View
              </button>
            </>
          )}
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white shadow-md rounded-md p-4 mt-4 mx-4 md:mx-8">
        <FilterBar onFilter={handleFilter} />
      </div>

      {/* Event Cards */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 mt-6">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">No events found.</p>
        ) : (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default OrganizerHome;
