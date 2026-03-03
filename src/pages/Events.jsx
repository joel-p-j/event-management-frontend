import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { label: "Music", value: "music", image: "/categories/music.png" },
    { label: "Comedy", value: "comedy", image: "/categories/comedy.png" },
    { label: "Tech", value: "tech", image: "/categories/tech.png" },
    { label: "Dance", value: "dance", image: "/categories/dance.png" },
    { label: "Sports", value: "sports", image: "/categories/sports.png" },
  ];

  useEffect(() => {
    async function fetchEvents() {
      const res = await api.get("/events/");
      setEvents(res.data);
      setFeaturedEvents(res.data.slice(0, 4));
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <div className="hidden md:block">
        <HeroCarousel events={events} />
      </div>

      {/* CATEGORY GRID */}
      {/* CATEGORY SECTION */}
<div className="max-w-7xl mx-auto px-4 mt-8">
  <h2 className="text-xl font-bold mb-6">
    Browse by Category
  </h2>

  {/* MOBILE: BIG CARDS | DESKTOP: COMPACT GRID */}
  <div
    className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-5
    "
  >
    {categories.map((cat) => (
      <div
        key={cat.value}
        onClick={() => navigate(`/events/category/${cat.value}`)}
        className="
          relative
          cursor-pointer
          rounded-3xl
          overflow-hidden
          group
          h-56
          sm:h-44
          lg:h-40
          shadow-md
          hover:shadow-xl
          transition-all
        "
      >
        {/* IMAGE */}
        <img
          src={cat.image}
          alt={cat.label}
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50" />

        {/* TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h3 className="text-white text-2xl sm:text-xl font-extrabold tracking-wide">
            {cat.label}
          </h3>

          {/* CTA (Mobile Only) */}
          <span className="mt-2 text-sm text-white/80 md:hidden">
            Tap to explore →
          </span>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* FEATURED EVENTS */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredEvents.map(event => (
            <EventCard key={event.id} event={event} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* ALL EVENTS (DESKTOP ONLY) */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 mt-12 pb-16">
        <h2 className="text-2xl font-bold mb-6">All Events</h2>
        <div className="grid grid-cols-4 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
