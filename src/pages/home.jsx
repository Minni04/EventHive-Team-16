// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../hooks/useauth";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";

function Home() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  // Real-time fetch of events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
    });
    return () => unsub();
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, "events", id));
      alert("🗑️ Event deleted!");
    }
  };

  // Set event for editing
  const handleEdit = (event) => setEditingEvent(event);

  // Cancel editing
  const handleCancelEdit = () => setEditingEvent(null);

  // After saving, reset editing
  const handleSave = () => setEditingEvent(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">EventHive</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">{user.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <a href="/auth" className="text-blue-600 font-medium hover:underline">
            Login / Signup
          </a>
        )}
      </header>

      {/* Event Form */}
      {user && (
        <EventForm
          editingEvent={editingEvent}
          onCancel={handleCancelEdit}
          onSave={handleSave}
        />
      )}

      {/* Events List */}
      <h2 className="mt-6 text-xl font-bold max-w-4xl mx-auto">Events</h2>
      <EventList
        events={events}
        user={user}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Home;
