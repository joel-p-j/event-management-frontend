import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroCarousel({ events }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const visibleEvents = events.slice(0, 5);

  useEffect(() => {
    if (!visibleEvents.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % visibleEvents.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [visibleEvents.length]);

  if (!visibleEvents.length) return null;

  const event = visibleEvents[index];

  const minPrice = Array.isArray(event.ticket_types)
    ? Math.min(...event.ticket_types.map((t) => parseFloat(t.price)))
    : null;

  return (
    /* 🔒 HIDDEN BELOW 840px */
    <div className="hidden min-[840px]:block">
      <div
        className="
          relative w-full
          h-[280px] sm:h-[340px] lg:h-[500px] xl:h-[580px]
          overflow-hidden
          mb-10 sm:mb-16
        "
      >
        {/* BACKGROUND IMAGE */}
        {/* BACKGROUND IMAGE — DISTRICT EXACT */}
{/* DISTRICT-EXACT BACKGROUND FADE */}
{/* DISTRICT-EXACT HERO BACKGROUND */}
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: `url(http://127.0.0.1:8000${event.event_image})`,
    filter: "blur(4px)",

    WebkitMaskImage: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,1) 62%,
        rgba(0,0,0,0.95) 70%,
        rgba(0,0,0,0.75) 80%,
        rgba(0,0,0,0.35) 88%,
        rgba(0,0,0,0) 100%
      )
    `,
    maskImage: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,1) 62%,
        rgba(0,0,0,0.95) 70%,
        rgba(0,0,0,0.75) 80%,
        rgba(0,0,0,0.35) 88%,
        rgba(0,0,0,0) 100%
      )
    `,
  }}
/>



        {/* TOP → BOTTOM BLEND */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/80 to-white" />

        {/* SOFT CENTER HAZE */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6),transparent_60%)]" />

        {/* CONTENT */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-12 flex items-center">
          <div className="flex w-full items-center justify-between gap-12">
            
            {/* LEFT CONTENT */}
            <div className="max-w-2xl">
              <p className="text-lg text-black font-bold">
                {new Date(event.date).toDateString()}
              </p>

              <h1
                className="
                  mt-4
                  text-4xl sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem]
                  font-extrabold
                  text-black
                  leading-tight
                "
              >
                {event.title}
              </h1>

              <p
                className="
                  mt-4
                  text-xl lg:text-[1.55rem]
                  text-gray-900
                  font-medium
                "
              >
                {event.location}
              </p>

              <p className="mt-4 text-xl font-semibold text-black">
                {minPrice !== null ? `₹${minPrice} onwards` : "Tickets available"}
              </p>

              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className="
                  mt-8
                  bg-black text-white
                  px-12 py-[18px]
                  rounded-full
                  text-lg font-semibold
                  hover:bg-gray-900 transition
                "
              >
                Book tickets
              </button>
            </div>

            {/* RIGHT POSTER */}
            <div className="hidden min-[840px]:block">
              <img
                src={`http://127.0.0.1:8000${event.event_image}`}
                alt={event.title}
                className="
                  w-[220px] xl:w-[260px]
                  h-[300px] xl:h-[360px]
                  object-cover
                  rounded-2xl
                  shadow-2xl
                "
              />
            </div>
          </div>
        </div>

        {/* LEFT ARROW */}
        <button
          onClick={() =>
            setIndex(
              (prev) =>
                (prev - 1 + visibleEvents.length) % visibleEvents.length
            )
          }
          className="
            absolute left-3 sm:left-6
            top-1/2 -translate-y-1/2
            text-black
            text-4xl lg:text-6xl
            hover:scale-110 transition
            z-20
          "
        >
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() =>
            setIndex((prev) => (prev + 1) % visibleEvents.length)
          }
          className="
            absolute right-3 sm:right-6
            top-1/2 -translate-y-1/2
            text-black
            text-4xl lg:text-6xl
            hover:scale-110 transition
            z-20
          "
        >
          ›
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {visibleEvents.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? "bg-black w-6" : "bg-black/40 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
