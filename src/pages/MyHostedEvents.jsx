import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import VerifyQRModal from "../components/VerifyQRModal";
import { toast } from "react-hot-toast";

export default function MyHostedEvents() {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [verifyEvent, setVerifyEvent] = useState(null);

  /* BOOKINGS */
  const [showBookingsFor, setShowBookingsFor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  /* EVENT EDIT */
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "music",
  });
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  /* TICKETS */
  const [showTicketsFor, setShowTicketsFor] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    name: "",
    price: "",
    total_seats: "",
    available_seats: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [eventsRes, statsRes] = await Promise.all([
          api.get("events/my-events/"),
          api.get("events/my-events/stats/"),
        ]);
        setEvents(eventsRes.data);
        setStats(statsRes.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  function getStats(eventId) {
    return stats.find(s => s.event_id === eventId);
  }

  /* ================= BOOKINGS ================= */
  async function openBookings(event) {
    setShowBookingsFor(event);
    setBookingLoading(true);
    try {
      const res = await api.get(`events/bookings/${event.id}/`);
      setBookings(res.data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setBookingLoading(false);
    }
  }

  /* ================= EVENT EDIT ================= */
  function openEditEvent(event) {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.slice(0, 16),
      category: event.category,
    });
    setPreviewImage(
      event.event_image
        ? `http://127.0.0.1:8000${event.event_image}`
        : null
    );
    setEditImage(null);
  }

  function handleEventChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function saveEvent(e) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(editForm).forEach(([k, v]) => data.append(k, v));
    if (editImage) data.append("event_image", editImage);

    const res = await api.patch(`events/update/${editingEvent.id}/`, data);
    setEvents(events.map(ev => (ev.id === editingEvent.id ? res.data : ev)));
    setEditingEvent(null);
    toast.success("Event updated");
  }

  async function deleteEvent(id) {
    try {
      await api.delete(`events/delete/${id}/`);
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete event");
    }
  }

  /* ================= TICKETS ================= */
  async function openTickets(event) {
    setShowTicketsFor(event);
    const res = await api.get(`events/tickets/${event.id}/`);
    setTickets(res.data);
  }

  function handleTicketChange(id, field, value) {
    setTickets(tickets.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  }

  async function saveTicket(ticket) {
    await api.put(`events/tickets/update/${ticket.id}/`, {
      ...ticket,
      price: Number(ticket.price),
      total_seats: Number(ticket.total_seats),
      available_seats: Number(ticket.available_seats),
    });
    toast.success("Ticket updated");
  }

  async function deleteTicket(id) {
    await api.delete(`events/tickets/delete/${id}/`);
    setTickets(tickets.filter(t => t.id !== id));
  }

  async function createTicket() {
    const res = await api.post("events/tickets/create/", {
      ...newTicket,
      event: showTicketsFor.id,
      price: Number(newTicket.price),
      total_seats: Number(newTicket.total_seats),
      available_seats: Number(newTicket.available_seats),
    });
    setTickets([...tickets, res.data]);
    setNewTicket({ name: "", price: "", total_seats: "", available_seats: "" });
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          🎤 My Hosted Events
        </h1>

        {events.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-4">
              You haven’t hosted any events yet.
            </p>
            <button
              onClick={() => navigate("/host-event")}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Host Your First Event
            </button>
          </div>
        )}

        {events.map(event => {
          const stat = getStats(event.id);
          return (
            <div
              key={event.id}
              className="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-4"
            >
              {event.event_image && (
                <img
                  src={`http://127.0.0.1:8000${event.event_image}`}
                  className="w-full sm:w-44 h-40 sm:h-32 object-cover rounded-lg"
                />
              )}

              <div className="flex-1">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500">{event.location}</p>

                {stat && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm">
                    <div className="bg-gray-200 rounded-lg p-3 text-center">
                      Total {stat.total_tickets}
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                      Sold {stat.sold_tickets}
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3 text-center">
                      Left {stat.remaining_tickets}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:flex gap-2 mt-5">
                  <ActionBtn onClick={() => navigate(`/events/${event.id}`)}>View</ActionBtn>
                  <ActionBtn onClick={() => openEditEvent(event)}>Edit</ActionBtn>
                  <ActionBtn onClick={() => openTickets(event)}>Tickets</ActionBtn>
                  <ActionBtn onClick={() => openBookings(event)}>Bookings</ActionBtn>
                  <ActionBtn danger onClick={() => deleteEvent(event.id)}>Delete</ActionBtn>
                  <ActionBtn blue onClick={() => setVerifyEvent(event)}>Verify QR</ActionBtn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= BOOKINGS MODAL ================= */}
      {showBookingsFor && (
        <Modal onClose={() => setShowBookingsFor(null)}>
          <h2 className="text-xl font-semibold mb-4">
            Bookings — {showBookingsFor.title}
          </h2>

          {bookingLoading && <p>Loading...</p>}

          {!bookingLoading && bookings.length === 0 && (
            <p className="text-center text-gray-500">No bookings yet</p>
          )}

          {!bookingLoading &&
            bookings.map((b, i) => (
              <div key={i} className="border rounded-lg p-3 mb-2 flex justify-between">
                <div>
                  <p className="font-medium">{b.user_email}</p>
                  <p className="text-sm text-gray-500">
                    {b.ticket_type} × {b.quantity}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  b.used ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                }`}>
                  {b.used ? "QR Used" : "QR Active"}
                </span>
              </div>
            ))}
        </Modal>
      )}

      {/* ================= EDIT EVENT MODAL ================= */}
      {editingEvent && (
  <Modal onClose={() => setEditingEvent(null)}>
    <form
      onSubmit={saveEvent}
      className="bg-white w-full max-w-3xl rounded-xl border shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Event
          </h2>
          <p className="text-sm text-gray-500">
            Update event information below
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingEvent(null)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6">
        {/* Event Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title
          </label>
          <input
            name="title"
            value={editForm.title}
            onChange={handleEventChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEventChange}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm resize-none
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={editForm.date}
              onChange={handleEventChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              name="location"
              value={editForm.location}
              onChange={handleEventChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={editForm.category}
            onChange={handleEventChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="music">Music</option>
            <option value="comedy">Comedy</option>
            <option value="tech">Tech</option>
            <option value="dance">Dance</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>

          <label className="flex flex-col items-center justify-center h-36 rounded-lg
                             border-2 border-dashed border-gray-300 cursor-pointer
                             hover:border-blue-500 transition">
            <span className="text-sm text-gray-600">
              Click to upload image
            </span>
            <span className="text-xs text-gray-400 mt-1">
              JPG or PNG up to 5MB
            </span>

            <input
              type="file"
              onChange={e => setEditImage(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
        <button
          type="button"
          onClick={() => setEditingEvent(null)}
          className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <ActionBtn blue type="submit">
          Save Changes
        </ActionBtn>
      </div>
    </form>
  </Modal>
)}



      {/* ================= VERIFY QR ================= */}
      {verifyEvent && (
        <VerifyQRModal
          event={verifyEvent}
          onClose={() => setVerifyEvent(null)}
        />
      )}

      {/* ================= TICKET MODAL ================= */}
      {showTicketsFor && (
        <Modal onClose={() => setShowTicketsFor(null)}>
          <h2 className="text-xl font-semibold mb-4">Tickets</h2>

          {tickets.map(ticket => (
            <div key={ticket.id} className="border rounded-lg p-3 mb-3">
              {["name", "price", "total_seats", "available_seats"].map(f => (
                <input
                  key={f}
                  value={ticket[f]}
                  onChange={e => handleTicketChange(ticket.id, f, e.target.value)}
                  className="input mb-2"
                />
              ))}
              <ActionBtn onClick={() => saveTicket(ticket)}>Save</ActionBtn>
              <ActionBtn danger onClick={() => deleteTicket(ticket.id)}>Delete</ActionBtn>
            </div>
          ))}

          <h3 className="font-semibold mt-4">Add Ticket</h3>

          {Object.keys(newTicket).map(f => (
            <input
              key={f}
              value={newTicket[f]}
              placeholder={f.replace("_", " ")}
              onChange={e => setNewTicket({ ...newTicket, [f]: e.target.value })}
              className="input mb-2"
            />
          ))}

          <ActionBtn green onClick={createTicket}>Add Ticket</ActionBtn>
        </Modal>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="mb-4 text-sm text-blue-600">
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

function ActionBtn({ children, danger, blue, green, ...props }) {
  let cls = "px-4 py-2 rounded-lg text-sm border";
  if (danger) cls += " text-red-600 border-red-300";
  else if (blue) cls += " bg-blue-600 text-white";
  else if (green) cls += " bg-green-600 text-white";
  else cls += " bg-black text-white";

  return (
    <button {...props} className={cls}>
      {children}
    </button>
  );
}
