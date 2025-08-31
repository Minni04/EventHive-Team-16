import { useAuth } from "../hooks/useauth";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { QRCodeCanvas } from "qrcode.react";

function MyTickets() {
  const { user } = useAuth(); // logged-in user
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // wait until user is available

    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        where("user.email", "==", user.email)
      );
      const snapshot = await getDocs(q);
      const bookingList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingList);
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  if (!user) return <p>Please log in first.</p>;
  if (loading) return <p>Loading your tickets...</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      {bookings.map((b) => (
        <div key={b.id} className="mb-4 p-4 border rounded">
          <p><strong>Event:</strong> {b.eventTitle}</p>
          <p><strong>Ticket Type:</strong> {b.ticketType}</p>
          <p><strong>Quantity:</strong> {b.quantity}</p>
          <p><strong>Booking ID:</strong> {b.bookingId}</p>
          <QRCodeCanvas value={b.bookingId} size={120} />
        </div>
      ))}
    </div>
  );
}

export default MyTickets;
