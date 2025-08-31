import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useauth";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function EventDetailAttendee() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setEvent(docSnap.data());
    };

    const fetchBookings = async () => {
      if (!user) return;
      const q = query(
        collection(db, "bookings"),
        where("eventId", "==", eventId),
        where("user.email", "==", user.email)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    };

    fetchEvent();
    fetchBookings();
  }, [eventId, user]);

  const downloadTicket = (bookingId) => {
    const ticketElement = document.getElementById(`ticket-${bookingId}`);
    html2canvas(ticketElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
      pdf.save(`Ticket_${bookingId}.pdf`);
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: "cancelled" });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      alert("✅ Booking cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to cancel booking.");
    }
  };

  if (!event) return <p>Loading event details...</p>;

  const userHasBooked = bookings.length > 0;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <p className="mb-2">{event.description}</p>
      <p className="mb-2">
        <strong>Date:</strong> {event.date} | <strong>Time:</strong>{" "}
        {event.time}
      </p>
      <p className="mb-4">
        <strong>Location:</strong> {event.location}
      </p>

      {!userHasBooked && user && (
        <button
          onClick={() => navigate(`/register/${eventId}`)}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          Register
        </button>
      )}

      {!user && (
        <button
          onClick={() => navigate("/auth")}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Login to Register
        </button>
      )}

      {userHasBooked && (
        <>
          <h2 className="text-2xl font-bold mb-2">Your Tickets</h2>
          {bookings.map((b) => (
            <div
              key={b.id}
              id={`ticket-${b.bookingId}`}
              className="p-4 border rounded mb-4 bg-gray-50"
            >
              <p>
                <strong>Booking ID:</strong> {b.bookingId}
              </p>
              <p>
                <strong>Ticket Type:</strong> {b.ticketType}
              </p>
              <p>
                <strong>Quantity:</strong> {b.quantity}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    b.status === "cancelled" ? "text-red-600" : "text-green-600"
                  }
                >
                  {b.status}
                </span>
              </p>

              <QRCodeCanvas value={b.bookingId} size={150} className="mt-2" />

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => downloadTicket(b.bookingId)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download Ticket PDF
                </button>

                {b.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default EventDetailAttendee;
