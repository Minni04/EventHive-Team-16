// src/pages/EditEvent.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useauth";
import { BellIcon } from "@heroicons/react/24/outline";

function EditEvent() {
  const { user, logout } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Real-time listener for the event to get live attendee updates
  useEffect(() => {
    const docRef = doc(db, "events", eventId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEventData({
          ...data,
          questions: data.questions || [],
        });
        setAttendeeCount(data.attendees || 0); // live attendee count
        setLoading(false);
      } else {
        alert("Event not found");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [eventId, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...eventData.questions];
    updatedQuestions[index][field] = value;
    setEventData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setEventData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { title: "", mandatory: false, oncePerOrder: false, type: "text", answers: "" },
      ],
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...eventData.questions];
    updatedQuestions.splice(index, 1);
    setEventData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save the event");
      navigate("/auth");
      return;
    }

    try {
      const docRef = doc(db, "events", eventId);
      await updateDoc(docRef, eventData);
      alert("✅ Event updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update event.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Edit Event
        </h1>
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

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Attendee Count */}
<div
  className="bg-white p-4 rounded shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
  onClick={() => navigate(`/attendees/${eventId}`)}
>
  <h2 className="text-lg font-semibold">Attendees</h2>
  <p className="text-gray-700">
    {eventData.attendees && Array.isArray(eventData.attendees)
      ? eventData.attendees.length
      : 0}{" "}
    registered (click to view)
  </p>
</div>



        {/* Event Details */}
        <div className="bg-white p-4 rounded shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Event Details</h2>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="border p-2 rounded w-full"
          />
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="category"
            value={eventData.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={eventData.published || false}
              onChange={handleChange}
            />
            Publish Event
          </label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Location"
            className="border p-2 rounded w-full"
          />
          <div>
            <label className="font-medium">Image URL:</label>
            <input
              type="text"
              name="image"
              value={eventData.image || ""}
              onChange={handleChange}
              placeholder="Image URL"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Ticket Types */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Ticket Types</h2>
          {["VIP", "Standard"].map((ticketType) => (
            <div key={ticketType} className="border rounded p-3 mb-2 space-y-2">
              <h3 className="font-medium">{ticketType}</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <input
                  type="number"
                  placeholder="Price"
                  className="border p-1 rounded"
                  value={eventData[`${ticketType}_price`] || ""}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      [`${ticketType}_price`]: Number(e.target.value),
                    }))
                  }
                />
                <input
                  type="date"
                  placeholder="Sales Start"
                  className="border p-1 rounded"
                  value={eventData[`${ticketType}_salesStart`] || ""}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      [`${ticketType}_salesStart`]: e.target.value,
                    }))
                  }
                />
                <input
                  type="date"
                  placeholder="Sales End"
                  className="border p-1 rounded"
                  value={eventData[`${ticketType}_salesEnd`] || ""}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      [`${ticketType}_salesEnd`]: e.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max per User"
                  className="border p-1 rounded"
                  value={eventData[`${ticketType}_maxPerUser`] || ""}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      [`${ticketType}_maxPerUser`]: Number(e.target.value),
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Total Registration"
                  className="border p-1 rounded"
                  value={eventData[`${ticketType}_registrations`] || ""}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      [`${ticketType}_registrations`]: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            Questions
            <button
              onClick={addQuestion}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Add Question
            </button>
          </h2>
          {eventData.questions.length === 0 && <p className="text-gray-500">No questions added</p>}
          {eventData.questions.map((q, idx) => (
            <div
              key={idx}
              className="border rounded p-3 mb-2 flex flex-col md:flex-row gap-2 items-center"
            >
              <input
                type="text"
                placeholder="Question Title"
                className="border p-1 rounded flex-1"
                value={q.title}
                onChange={(e) => handleQuestionChange(idx, "title", e.target.value)}
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={q.mandatory || false}
                  onChange={(e) => handleQuestionChange(idx, "mandatory", e.target.checked)}
                />
                Mandatory
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={q.oncePerOrder || false}
                  onChange={(e) => handleQuestionChange(idx, "oncePerOrder", e.target.checked)}
                />
                Once per Order
              </label>
              <select
                className="border p-1 rounded"
                value={q.type}
                onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="selection">Selection</option>
              </select>
              <input
                type="text"
                placeholder="Answers (comma separated)"
                className="border p-1 rounded flex-1"
                value={q.answers || ""}
                onChange={(e) => handleQuestionChange(idx, "answers", e.target.value)}
              />
              <button
                onClick={() => removeQuestion(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors w-full text-lg"
        >
          Save Event
        </button>
      </div>
    </div>
  );
}

export default EditEvent;
