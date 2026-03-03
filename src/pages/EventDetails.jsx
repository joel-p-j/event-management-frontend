import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // Static Event Guide data
  const eventGuide = {
    language: "English",
    age: "18 yrs & above",
  };

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${id}/`);
        setEvent(res.data);
      } catch (err) {
      if (err.response?.status === 403) {
        alert("This event is awaiting admin approval ⏳");
        navigate("/");
      } else if (err.response?.status === 404) {
        alert("Event not found");
        navigate("/");
      } else {
        console.log("Error loading event:", err);
      }
    }

    }
    loadEvent();
  }, [id]);

  if (!event) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  // ✅ Calculate minimum ticket price safely
  const minPrice =
    event.ticket_types && event.ticket_types.length > 0
      ? Math.min(...event.ticket_types.map(t => Number(t.price)))
      : null;

  return (
    <div className="bg-[#f8f8f8] min-h-screen">

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* EVENT IMAGE */}
          <div className="lg:col-span-2">
           <img
              src={
                event.event_image
                  ? `http://127.0.0.1:8000${event.event_image}`
                  : "/placeholder-event.jpg"
              }
              alt={event.title}
              className="w-full h-[420px] object-cover rounded-xl"
            />

          </div>

          {/* BOOKING CARD */}
          <div className="bg-white rounded-xl p-6 border shadow-sm h-fit">

            <h1 className="text-2xl font-bold text-black">
              {event.title}
            </h1>

            <div className="mt-4 space-y-2 text-gray-600">
              <p>📅 {new Date(event.date).toLocaleString()}</p>
              <p>📍 {event.location}</p>
            </div>

            {/* PRICE */}
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-500">Starts from</p>
              <p className="text-2xl font-bold text-black">
                {minPrice ? `₹${minPrice}` : "See ticket options"}
              </p>

              {/* Optional ticket type preview */}
              {event.ticket_types?.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {event.ticket_types.map(t => t.name).join(" • ")}
                </p>
              )}
            </div>

            <button
                onClick={() => navigate(`/book/${event.id}`)}
                disabled={!event.ticket_types || event.ticket_types.length === 0}
                className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
                  event.ticket_types?.length > 0
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {event.ticket_types?.length > 0
                  ? "BOOK TICKETS"
                  : "Tickets not available yet"}
              </button>
              

          </div>
        </div>

        {/* ABOUT THE EVENT */}
        <div className="mt-10 bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">
            About the Event
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* EVENT GUIDE */}
        <div className="mt-5 bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="text-lg font-bold text-black mb-4">
            Event Guide
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Language */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg">
                🌐
              </div>
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-semibold text-black">
                  {eventGuide.language}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg">
                📅
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-black">
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Age */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg">
                🎟
              </div>
              <div>
                <p className="text-sm text-gray-500">Tickets Needed For</p>
                <p className="font-semibold text-black">
                  {eventGuide.age}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* VENUE */}
        <div className="mt-5 bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">
            Venue
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {event.location}
          </p>
        </div>

      </div>
    </div>
  );
}

export default EventDetails;
