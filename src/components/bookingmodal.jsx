// src/components/BookingModal.jsx
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

function BookingModal({ event, user, onClose }) {
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [tickets, setTickets] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookings"), {
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        name,
        email,
        tickets,
        bookedAt: new Date(),
      });
      alert("✅ Ticket booked successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to book ticket.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Book Ticket for {event.title}</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            min={1}
            placeholder="Number of Tickets"
            className="border p-2 rounded outline-none"
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
            required
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition-colors">
              Book
            </button>
            <button type="button" onClick={onClose} className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
