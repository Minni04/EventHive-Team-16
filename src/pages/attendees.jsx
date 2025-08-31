// src/pages/Attendees.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useauth";
import { BellIcon } from "@heroicons/react/24/outline";

function Attendees() {
  const { user, logout } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [genderFilter, setGenderFilter] = useState("");
  const [attendedFilter, setAttendedFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEventData(data);
          // Ensure attendees array exists
          setAttendees(data.attendees || []);
        } else {
          alert("Event not found");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch event data");
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // Filter attendees
  const filteredAttendees = attendees.filter((a) => {
    let genderMatch = true;
    let attendedMatch = true;
    let searchMatch = true;

    if (genderFilter) genderMatch = a.gender === genderFilter;
    if (attendedFilter)
      attendedMatch =
        attendedFilter === "attended" ? a.attended === true : a.attended === false;
    if (search)
      searchMatch = a.name.toLowerCase().includes(search.toLowerCase());

    return genderMatch && attendedMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          EventHive
        </h1>
        <div className="flex items-center gap-4">
          <BellIcon className="w-6 h-6 text-gray-700" />
          {user && (
            <button
              onClick={logout}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded shadow-md">
          <div>
            <label className="font-medium mr-2">Gender:</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="font-medium mr-2">Attended:</label>
            <select
              value={attendedFilter}
              onChange={(e) => setAttendedFilter(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">All</option>
              <option value="attended">Attended</option>
              <option value="not_attended">Not Attended</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search attendees"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-1 rounded w-full"
            />
          </div>
          <button
            onClick={() => {
              setGenderFilter("");
              setAttendedFilter("");
              setSearch("");
            }}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Attendees Table */}
        <div className="bg-white p-4 rounded shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Total Guests</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Gender</th>
                <th className="p-2">Attended</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No attendees found
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((att, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{att.name}</td>
                    <td className="p-2">{att.totalGuests}</td>
                    <td className="p-2">{att.email}</td>
                    <td className="p-2">{att.phone}</td>
                    <td className="p-2">{att.gender}</td>
                    <td className="p-2">{att.attended ? "Yes" : "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendees;
