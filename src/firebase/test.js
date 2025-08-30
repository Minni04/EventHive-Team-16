import { db } from "./config";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function testFirestore() {
  // Add a dummy event
  await addDoc(collection(db, "events"), {
    title: "Test Event",
    date: "2025-09-01",
    location: "Test Location",
    price: 100
  });

  // Fetch events
  const snapshot = await getDocs(collection(db, "events"));
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}
