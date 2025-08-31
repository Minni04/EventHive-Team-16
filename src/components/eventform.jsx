import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function EventForm({ editingEvent, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description);
      setPrice(editingEvent.price);
      setCategory(editingEvent.category || "");
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !category) return;

    try {
      if (editingEvent) {
        const eventRef = doc(db, "events", editingEvent.id);
        await updateDoc(eventRef, { title, description, price: Number(price), category });
        alert("✅ Event updated!");
      } else {
        await addDoc(collection(db, "events"), { title, description, price: Number(price), category });
        alert("✅ Event created!");
      }
      onSave();
      setTitle(""); setDescription(""); setPrice(""); setCategory("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save event.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">
        {editingEvent ? "Edit Event" : "Create New Event"}
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required />
        <textarea placeholder="Event Description" value={description} onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" required>
          <option value="">Select Category</option>
          <option value="Workshop">Workshop</option>
          <option value="Concert">Concert</option>
          <option value="Sports">Sports</option>
          <option value="Hackathon">Hackathon</option>
        </select>

        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
          {editingEvent && <button type="button" onClick={onCancel} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors">Cancel</button>}
        </div>
      </form>
    </div>
  );
}

export default EventForm;
