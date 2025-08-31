// src/pages/AddEvent.jsx
import React, { useState } from "react";
import { useAuth } from "../hooks/useauth";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BellIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function AddEvent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Event fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [tickets, setTickets] = useState([
    { name: "VIP", price: "", start: "", end: "", maxPerUser: "", maxRegistration: "" },
    { name: "Standard", price: "", start: "", end: "", maxPerUser: "", maxRegistration: "" },
  ]);
  const [questions, setQuestions] = useState([
    { title: "Name", mandatory: true, oncePerOrder: false, type: "text", answers: "" },
    { title: "Email", mandatory: true, oncePerOrder: false, type: "email", answers: "" },
    { title: "Phone", mandatory: false, oncePerOrder: false, type: "phone", answers: "" },
    { title: "Gender", mandatory: false, oncePerOrder: false, type: "selection", answers: "" },
  ]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSaveEvent = async () => {
    if (!user) {
      alert("Please login to save the event");
      return;
    }

    try {
      // Upload images to Firebase Storage
      const imageUrls = [];
      for (let img of images) {
        const storageRef = ref(storage, `events/${img.name}_${Date.now()}`);
        await uploadBytes(storageRef, img);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      // Save event to Firestore
      await addDoc(collection(db, "events"), {
        title,
        description,
        category,
        published,
        location,
        images: imageUrls,
        tickets,
        questions,
        organizer: user.email,
        createdAt: new Date(),
      });

      alert("✅ Event saved successfully!");
      navigate("/"); // Go back to OrganizerHome

    } catch (err) {
      console.error(err);
      alert("❌ Failed to save event.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-gray-700">
          <ArrowLeftIcon className="w-5 h-5" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Event</h1>
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

      {/* Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>

        {/* Event Name & Description */}
        <input
          type="text"
          placeholder="Event Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        {/* Category & Published Toggle */}
        <div className="flex gap-4 items-center mb-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded flex-1"
          >
            <option value="">Select Category</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Concert">Concert</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish
          </label>
        </div>

        {/* Location & Images */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="mb-3"
        />

        {/* Ticket Section */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Tickets</h3>
        {tickets.map((ticket, idx) => (
          <div key={idx} className="border p-3 rounded mb-3">
            <h4 className="font-medium">{ticket.name}</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) => handleTicketChange(idx, "price", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Sales Start"
                value={ticket.start}
                onChange={(e) => handleTicketChange(idx, "start", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Sales End"
                value={ticket.end}
                onChange={(e) => handleTicketChange(idx, "end", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Max per User"
                value={ticket.maxPerUser}
                onChange={(e) => handleTicketChange(idx, "maxPerUser", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Max Registration"
                value={ticket.maxRegistration}
                onChange={(e) => handleTicketChange(idx, "maxRegistration", e.target.value)}
                className="border p-2 rounded col-span-2"
              />
            </div>
          </div>
        ))}

        {/* Questions Section */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Questions</h3>
        {questions.map((q, idx) => (
          <div key={idx} className="border p-3 rounded mb-3 grid grid-cols-6 gap-2 items-center">
            <input
              type="text"
              placeholder="Title"
              value={q.title}
              onChange={(e) => handleQuestionChange(idx, "title", e.target.value)}
              className="border p-2 rounded col-span-2"
            />
            <input
              type="checkbox"
              checked={q.mandatory}
              onChange={(e) => handleQuestionChange(idx, "mandatory", e.target.checked)}
              className="col-span-1"
            />
            <input
              type="checkbox"
              checked={q.oncePerOrder}
              onChange={(e) => handleQuestionChange(idx, "oncePerOrder", e.target.checked)}
              className="col-span-1"
            />
            <select
              value={q.type}
              onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
              className="border p-2 rounded col-span-1"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="selection">Selection</option>
            </select>
            <input
              type="text"
              placeholder="Answers"
              value={q.answers}
              onChange={(e) => handleQuestionChange(idx, "answers", e.target.value)}
              className="border p-2 rounded col-span-1"
            />
          </div>
        ))}

        {/* Save Button */}
        <button
          onClick={handleSaveEvent}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors mt-4"
        >
          Save Event
        </button>
      </div>
    </div>
  );
}

export default AddEvent;
