// src/pages/Registration.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useauth";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";        // ✅ Corrected import
import html2canvas from "html2canvas";

function Registration() {
  const { eventId } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      const eventRef = doc(db, "events", eventId);
      const docSnap = await getDoc(eventRef);
      if (docSnap.exists()) setEvent(docSnap.data());
      else console.log("Event not found!");
    };
    fetchEvent();
  }, [eventId]);

  // Save booking
  const handleBooking = async () => {
    if (!ticketType) return alert("Select ticket type");
    if (!name || !email || !phone) return alert("Fill all details");
    if (quantity < 1) return alert("Enter valid quantity");

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
      user: { name, email, phone },
      bookingId,
      status: "confirmed",
      bookedAt: new Date(),
      checkedIn: false,
    };

    await addDoc(collection(db, "bookings"), bookingData);
    await updateDoc(eventRef, {
      [`tickets.${ticketType}.quantity`]: available - quantity,
    });

    setBooking(bookingData);
    alert("✅ Booking successful!");
  };

  // Simulated payment
  const handlePaymentAndBooking = async () => {
    if (!ticketType || quantity < 1) return alert("Select ticket type & quantity");
    const totalAmount = event.tickets[ticketType].price * quantity;
    const confirmPayment = window.confirm(`Pay ₹${totalAmount} to confirm booking?`);
    if (!confirmPayment) return;
    await handleBooking();
  };

  // Download ticket as PDF
  const downloadTicket = () => {
    const ticketElement = document.getElementById("ticket");
    html2canvas(ticketElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
      pdf.save(`Ticket_${booking.bookingId}.pdf`);
    });
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="mb-4">{event.description}</p>

      {!booking && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Ticket Type:</label>
          <select
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select</option>
            {Object.keys(event.tickets).map((type) => (
              <option key={type} value={type}>
                {type} - ₹{event.tickets[type].price} ({event.tickets[type].quantity} left)
              </option>
            ))}
          </select>

          <label className="block font-medium mb-1">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 p-2 border rounded mb-2"
          />

          <label className="block font-medium mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <label className="block font-medium mb-1">Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <button
            onClick={handlePaymentAndBooking}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            Pay & Book Ticket
          </button>
        </div>
      )}

      {booking && (
        <div id="ticket" className="p-4 border rounded mt-4">
          <h2 className="font-bold text-lg mb-2">Booking Confirmed!</h2>
          <p>Booking ID: {booking.bookingId}</p>
          <p>Ticket Type: {booking.ticketType}</p>
          <p>Quantity: {booking.quantity}</p>
          <QRCodeCanvas value={booking.bookingId} size={150} className="mt-2" />

          <button
            onClick={downloadTicket}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Download Ticket PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Registration;
