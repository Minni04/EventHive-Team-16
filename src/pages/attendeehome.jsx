// src/pages/AttendeeHome.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useauth";
import EventCard from "../components/eventcard";
import { useNavigate } from "react-router-dom";

function AttendeeHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trendingEvents, setTrendingEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // Fetch user points
  useEffect(() => {
    if (!user) return;
    const fetchPoints = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) setLoyaltyPoints(docSnap.data().loyaltyPoints || 0);
    };
    fetchPoints();
  }, [user]);

  // Fetch my booked events
  useEffect(() => {
    if (!user) return;

    const fetchBookedEvents = async () => {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("user.email", "==", user.email)
      );
      const snapshot = await getDocs(bookingsQuery);
      const bookedEvents = snapshot.docs.map((doc) => ({
        id: doc.data().eventId,
        ...doc.data(),
      }));

      const uniqueEventsMap = {};
      bookedEvents.forEach((b) => {
        uniqueEventsMap[b.id] = b;
      });

      const uniqueEvents = Object.values(uniqueEventsMap);
      setMyEvents(uniqueEvents);
      setFilteredEvents(uniqueEvents);
    };

    fetchBookedEvents();
  }, [user]);

  // Fetch trending events (top 3 by bookings count)
  useEffect(() => {
    const fetchTrendingEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const eventsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const eventsWithBookings = await Promise.all(
        eventsData.map(async (event) => {
          const bookingsSnap = await getDocs(
            query(collection(db, "bookings"), where("eventId", "==", event.id))
          );
          return { ...event, bookingsCount: bookingsSnap.size };
        })
      );

      eventsWithBookings.sort((a, b) => b.bookingsCount - a.bookingsCount);
      setTrendingEvents(eventsWithBookings.slice(0, 3));
    };

    fetchTrendingEvents();
  }, []);

  // Filter events by search
  const handleFilter = (search) => {
    if (!search) return setFilteredEvents(myEvents);
    const filtered = myEvents.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1
          className="text-3xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/attendee-home")}
        >
          EventHive
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Back to Organizer Home
          </button>

          {user && (
            <>
            
              <button
                onClick={() => navigate("/my-tickets")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                My Bookings
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white shadow-md rounded-md p-4 mt-4 mx-4 md:mx-8">
        <input
          type="text"
          placeholder="Search your events..."
          className="w-full p-2 border rounded"
          onChange={(e) => handleFilter(e.target.value)}
        />
      </div>

      {/* Trending Events */}
      {trendingEvents.length > 0 && (
        <div className="max-w-7xl mx-auto p-4 mt-6">
          <h2 className="text-2xl font-bold mb-4">Trending Events</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/event-attendee/${event.id}`)}
                className="cursor-pointer border rounded shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {event.date} | {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Booked Events */}
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 mt-6">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">
            No booked events found.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate(`/event-attendee/${event.id}`)}
              className="cursor-pointer border rounded shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.description}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {event.date} | {event.location}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AttendeeHome;
