import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

function CategoryEvents() {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategoryEvents() {
      const res = await api.get(`/events/?category=${category}`);
      setEvents(res.data);
    }
    fetchCategoryEvents();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/events")}
            className="mb-3 text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to Categories
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold capitalize">
            {category} Events
          </h1>

          <p className="text-gray-500 mt-1">
            Discover the best {category} experiences around you
          </p>
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {events.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">
              No events available in this category
            </p>
            <button
              onClick={() => navigate("/events")}
              className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-900 transition"
            >
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div
            className="
              grid gap-8
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {events.map((event) => {
              const minPrice =
                event.ticket_types?.length > 0
                  ? Math.min(...event.ticket_types.map(t => Number(t.price)))
                  : null;

              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="
                    group cursor-pointer
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    border
                    transition-all
                    hover:-translate-y-1
                    hover:shadow-2xl
                  "
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        event.event_image
                          ? `http://127.0.0.1:8000${event.event_image}`
                          : "/placeholder-event.jpg"
                      }
                      alt={event.title}
                      className="
                        w-full
                        h-[340px] sm:h-[300px] lg:h-[280px]
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />

                    {/* GRADIENT */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* CATEGORY BADGE */}
                    <span className="
                      absolute top-4 left-4
                      bg-white/90
                      text-xs font-bold
                      px-3 py-1
                      rounded-full
                    ">
                      {category.toUpperCase()}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 space-y-1">
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {event.location}
                    </p>

                    <p className="text-sm font-semibold text-gray-900 pt-2">
                      {minPrice ? `₹${minPrice} onwards` : "Tickets available"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryEvents;
