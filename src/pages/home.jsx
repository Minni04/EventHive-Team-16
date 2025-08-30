import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  async function fetchEvents() {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      querySnapshot.forEach(doc => {
        console.log("🔥 Firestore Data:", doc.id, "=>", doc.data());
      });

      const eventsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  fetchEvents();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🎟 Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <div key={event.id} className="border p-4 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm">💰 Price: ₹{event.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
