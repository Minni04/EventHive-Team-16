// src/pages/EventDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useauth";
import { QRCodeCanvas } from "qrcode.react";

function EventDetail() {
  const { eventId } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      const eventRef = doc(db, "events", eventId);
      const docSnap = await getDoc(eventRef);
      if (docSnap.exists()) {
        setEvent(docSnap.data());
      } else {
        console.log("Event not found!");
      }
    };
    fetchEvent();
  }, [eventId]);

  // Handle ticket booking
  const handleBookTicket = async () => {
    if (!ticketType || quantity < 1) return alert("Select ticket type & quantity");

    if (!event) return;

    const eventRef = doc(db, "events", eventId);
    const docSnap = await getDoc(eventRef);
    if (!docSnap.exists()) return alert("Event not found");

    const eventData = docSnap.data();
    const available = eventData.tickets[ticketType].quantity;

    if (quantity > available) return alert(`Only ${available} tickets left`);

    const bookingId = "BK" + Date.now();
    const bookingData = {
      eventId,
      eventTitle: eventData.title,
      ticketType,
      quantity,
      user: {
        name: user?.displayName || "Guest",
        email: user?.email || "guest@example.com",
        phone: "0000000000",
      },
      bookingId,
      status: "confirmed",
      bookedAt: new Date(),
      checkedIn: false,
    };

    // Save booking in Firestore
    const bookingsRef = collection(db, "bookings");
    await addDoc(bookingsRef, bookingData);

    // Reduce ticket inventory
    await updateDoc(eventRef, {
      [`tickets.${ticketType}.quantity`]: available - quantity,
    });

    setBooking(bookingData); // Show confirmation + QR code
    alert("✅ Ticket booked successfully!");
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-2">{event.description}</p>
      <p className="mt-1 text-sm text-gray-600">
        Category: {event.category} | Location: {event.location}
      </p>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Ticket Type:</label>
        <select
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          className="block mb-2 p-2 border rounded w-full"
        >
          <option value="">Select</option>
          {Object.keys(event.tickets).map((type) => (
            <option key={type} value={type}>
              {type} - ₹{event.tickets[type].price} ({event.tickets[type].quantity} left)
            </option>
          ))}
        </select>

        <label className="block mb-1 font-medium">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="block mb-2 p-2 border rounded w-24"
        />

        <button
          onClick={handleBookTicket}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          Book Ticket
        </button>
      </div>

      {booking && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="font-bold text-lg">Booking Confirmed!</h2>
          <p>Booking ID: {booking.bookingId}</p>
          <p>Ticket Type: {booking.ticketType}</p>
          <p>Quantity: {booking.quantity}</p>
          <QRCodeCanvas value={booking.bookingId} size={150} className="mt-2" />
        </div>
      )}
    </div>
  );
}

export default EventDetail;
