import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  /* 🔹 EVENT CATEGORIES */
  const categories = [
    { label: "All", value: "" },
    { label: "Music", value: "music" },
    { label: "Comedy", value: "comedy" },
    { label: "Tech", value: "tech" },
    { label: "Dance", value: "dance" },
    { label: "Sports", value: "sports" },
  ];

  /* 🔄 RESET WHEN MODAL CLOSES */
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setSelectedCategory("");
    }
  }, [open]);

  /* 🔍 LIVE SEARCH (ALL + CATEGORY + QUERY) */
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();

        // search text (optional)
        if (query.trim()) {
          params.append("search", query.trim());
        }

        // category (skip when "All")
        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        const res = await api.get(`/events?${params.toString()}`);

        // show first 8 results like District
        setResults(res.data.slice(0, 8));
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory, open]);

  useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [open]);


useEffect(() => {
  const appRoot = document.getElementById("app-root");

  if (!appRoot) return;

  if (open) {
    appRoot.classList.add("app-blur");
    document.body.style.overflow = "hidden";
  } else {
    appRoot.classList.remove("app-blur");
    document.body.style.overflow = "";
  }

  return () => {
    appRoot.classList.remove("app-blur");
    document.body.style.overflow = "";
  };
}, [open]);


if (!open) return null;

return (
<div className="fixed inset-0 z-[100] backdrop-blur-sm">
    {/* CLICK OUTSIDE */}
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

    {/* MODAL */}
    <div
      className="
        relative
        bg-white
        max-w-3xl
        w-full
        mx-auto
        mt-28
        rounded-2xl
        shadow-2xl
        p-6
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-3">
        {/* SEARCH INPUT */}
        <input
          autoFocus
          type="text"
          placeholder="Search events, categories or locations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            flex-1
            px-4 py-3
            rounded-xl
            border border-gray-300
            focus:outline-none
            focus:ring-2
            focus:ring-yellow-400
            text-sm
          "
        />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            h-10 w-10
            flex items-center justify-center
            rounded-full
            text-gray-500
            hover:bg-gray-100
            hover:text-black
            transition
          "
        >
          ✕
        </button>
      </div>

      {/* CATEGORY PILLS */}
      <div className="flex gap-3 mt-4 text-sm font-medium flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`
              px-4 py-2 rounded-full transition
              ${
                selectedCategory === cat.value
                  ? "bg-yellow-200 text-yellow-900"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* RESULTS */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Trending in your city
        </h3>

        {results.length === 0 ? (
          <p className="text-sm text-gray-500">
            Start typing or select a category
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {results.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  navigate(`/events/${event.id}`);
                  onClose();
                }}
                className="
                  flex items-center gap-3
                  p-2
                  rounded-lg
                  cursor-pointer
                  hover:bg-gray-50
                "
              >
                <img
                  src={`http://127.0.0.1:8000${event.event_image}`}
                  alt={event.title}
                  className="w-12 h-12 rounded-md object-cover"
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {event.category || "Event"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

}
