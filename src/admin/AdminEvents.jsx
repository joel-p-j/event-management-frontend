
import { useEffect, useState } from "react";
import api from "../api/axios";

/* =========================
   ADMIN EVENTS
========================= */
export default function AdminEvents() {
  const [events, setEvents] = useState([]);

  /* Event modal */
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  /* Ticket modal */
  const [ticketEventId, setTicketEventId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [editingTicketId, setEditingTicketId] = useState(null);

  /* Event form fields */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("music");
  const [image, setImage] = useState(null);

  /* Ticket form fields */
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [priority, setPriority] = useState(1);

  /* =========================
     LOAD EVENTS
  ========================= */
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const res = await api.get("/events/admin/events/");
    setEvents(res.data);
  }

  /* =========================
     HELPERS
  ========================= */
  function resetEventForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setCategory("music");
    setImage(null);
    setEditingEventId(null);
  }

  function resetTicketForm() {
    setTicketName("");
    setTicketPrice("");
    setTotalSeats("");
    setAvailableSeats("");
    setPriority(1);
    setEditingTicketId(null);
  }

  function formatDate(dateString) {
    return dateString ? dateString.slice(0, 16) : "";
  }

  /* =========================
     EVENT CREATE / UPDATE
  ========================= */
  async function submitEvent(e) {
    e.preventDefault();

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("date", date);
    data.append("location", location);
    data.append("category", category);
    if (image) data.append("event_image", image);

    try {
      if (editingEventId) {
        await api.patch(`/events/update/${editingEventId}/`, data);
      } else {
        await api.post("/events/create/", data);
      }

      resetEventForm();
      setShowEventForm(false);
      fetchEvents();
    } catch {
      alert("Failed to save event");
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;
    await api.delete(`/events/update/${id}/`);
    fetchEvents();
  }

  /* =========================
     TICKETS
  ========================= */
  async function openTickets(eventId) {
    setTicketEventId(eventId);
    resetTicketForm();
    const res = await api.get(`/events/tickets/${eventId}/`);
    setTickets(res.data);
  }

  async function submitTicket(e) {
    e.preventDefault();

    const payload = {
      event: ticketEventId,
      name: ticketName,
      price: ticketPrice,
      total_seats: totalSeats,
      available_seats: availableSeats,
      priority,
    };

    try {
      if (editingTicketId) {
await api.put(
  `/events/tickets/update/${editingTicketId}/`,
  payload
);

      } else {
        await api.post("/events/tickets/create/", payload);
      }

      resetTicketForm();
      const res = await api.get(`/events/tickets/${ticketEventId}/`);
      setTickets(res.data);
    } catch {
      alert("Ticket save failed");
    }
  }

  async function deleteTicket(id) {
    if (!window.confirm("Delete ticket?")) return;
    await api.delete(`/events/tickets/delete/${id}/`);
    const res = await api.get(`/events/tickets/${ticketEventId}/`);
    setTickets(res.data);
  }

  async function approveEvent(id) {
    try {
      await api.patch(`/events/admin/events/${id}/approve/`);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, approval_status: "approved" } : e
        )
      );
    } catch {
      alert("Approval failed");
    }
  }

  async function rejectEvent(id) {
    try {
      await api.patch(`/events/admin/events/${id}/reject/`);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, approval_status: "rejected" } : e
        )
      );
    } catch {
      alert("Rejection failed");
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Events</h1>

        <button
          onClick={() => {
            resetEventForm();
            setShowEventForm(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Create Event
        </button>
      </div>

      {/* ================= TABLE VIEW (xl and above) ================= */}
      <div className="hidden xl:block rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-5 py-3 text-left">Event</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3 text-right">Actions</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4 flex items-center gap-3">
                  {event.event_image && (
                    <img
                      src={`http://127.0.0.1:8000${event.event_image}`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="text-xs text-zinc-500">ID: {event.id}</p>
                  </div>
                </td>

                <td className="px-5 py-4 capitalize text-zinc-400">
                  {event.category}
                </td>

                <td className="px-5 py-4 text-zinc-400">
                  {new Date(event.date).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-zinc-400">
                  {event.location}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditingEventId(event.id);
                        setTitle(event.title);
                        setDescription(event.description);
                        setDate(formatDate(event.date));
                        setLocation(event.location);
                        setCategory(event.category);
                        setShowEventForm(true);
                      }}
                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openTickets(event.id)}
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-sm"
                    >
                      Tickets
                    </button>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {event.approval_status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveEvent(event.id)}
                        className="px-2 py-1 rounded bg-emerald-600 text-white text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectEvent(event.id)}
                        className="px-2 py-1 rounded bg-red-600 text-white text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {event.approval_status === "approved" && (
                    <span className="text-emerald-400 font-medium">Approved</span>
                  )}

                  {event.approval_status === "rejected" && (
                    <span className="text-red-400 font-medium">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= CARD / GRID VIEW (below xl) ================= */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 space-y-4"
          >
            <div className="flex gap-3">
              {event.event_image && (
                <img
                  src={`http://127.0.0.1:8000${event.event_image}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-white font-semibold">{event.title}</h3>
                <p className="text-xs text-zinc-500">ID: {event.id}</p>
                <p className="text-sm text-zinc-400 capitalize">
                  {event.category}
                </p>
              </div>
            </div>

            <div className="text-sm text-zinc-400 space-y-1">
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>📍 {event.location}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setEditingEventId(event.id);
                  setTitle(event.title);
                  setDescription(event.description);
                  setDate(formatDate(event.date));
                  setLocation(event.location);
                  setCategory(event.category);
                  setShowEventForm(true);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => openTickets(event.id)}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-1 rounded"
              >
                Tickets
              </button>

              <button
                onClick={() => deleteEvent(event.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>

            <div>
              {event.approval_status === "approved" && (
                <span className="text-emerald-400 font-medium">Approved</span>
              )}
              {event.approval_status === "rejected" && (
                <span className="text-red-400 font-medium">Rejected</span>
              )}
              {event.approval_status === "pending" && (
                <span className="text-yellow-400 font-medium">Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* EVENT MODAL */}
       {showEventForm && (
  <Modal onClose={() => setShowEventForm(false)}>
    <div className="max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Edit Event
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Update event information below
        </p>
      </div>

      <form onSubmit={submitEvent} className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Event Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-dark"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-dark resize-none"
            placeholder="Describe your event"
          />
        </div>

        {/* DATE + LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-dark"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-dark"
              placeholder="Event venue"
              required
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-dark"
          >
            <option value="music">Music</option>
            <option value="tech">Tech</option>
            <option value="sports">Sports</option>
            <option value="comedy">Comedy</option>
            <option value="dance">Dance</option>
          </select>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Event Image
          </label>

          <label className="flex flex-col items-center justify-center gap-2
                            border border-dashed border-white/15 rounded-xl
                            p-6 cursor-pointer hover:border-indigo-500 transition">
            <span className="text-sm text-zinc-300">
              Click to upload image
            </span>
            <span className="text-xs text-zinc-500">
              JPG or PNG up to 5MB
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-4 h-40 w-full object-cover rounded-lg border border-white/10"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowEventForm(false)}
            className="flex-1 border border-white/10 rounded-lg py-2
                       text-zinc-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700
                       rounded-lg py-2 text-white font-medium transition"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  </Modal>
)}


{ticketEventId && (
  <Modal onClose={() => setTicketEventId(null)}>
    <div className="space-y-6">

      <h2 className="text-xl font-semibold text-white">
        Ticket Types
      </h2>

      {/* ADD / EDIT TICKET */}
      <form
        onSubmit={submitTicket}
        className="grid grid-cols-1 md:grid-cols-5 gap-3"
      >
        <input
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
          placeholder="Name"
          className="input-dark"
          required
        />

        <input
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="input-dark"
          required
        />

        <input
          value={totalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          placeholder="Total"
          type="number"
          className="input-dark"
          required
        />

        <input
          value={availableSeats}
          onChange={(e) => setAvailableSeats(e.target.value)}
          placeholder="Available"
          type="number"
          className="input-dark"
          required
        />

        <input
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    placeholder="Priority"
    type="number"
    min="1"
    className="input-dark"
    required
  />

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm">
          {editingTicketId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800 text-zinc-400">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Seats</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3 text-white">
                  {t.name}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  ₹{t.price}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {t.available_seats}/{t.total_seats}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button
  onClick={() => {
    setEditingTicketId(t.id);        // ✅ REQUIRED
    setTicketName(t.name);
    setTicketPrice(t.price);
    setTotalSeats(t.total_seats);
    setAvailableSeats(t.available_seats);
    setPriority(t.priority ?? 1);   // ✅ IMPORTANT
  }}
  className="text-indigo-400 hover:underline"
>
  Edit
</button>


                  <button
                    onClick={() => deleteTicket(t.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </Modal>
)}
    </div>
  );
}

/* =========================
   MODAL
========================= */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 text-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
