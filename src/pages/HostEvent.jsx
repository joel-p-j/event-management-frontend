import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function HostEvent() {

  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "music",
  });

  const [eventImage, setEventImage] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [ticketTypes, setTicketTypes] = useState([
    {
      name: "",
      price: "",
      total_seats: "",
      available_seats: "",
      priority: 1,
    },
  ]);

  function handleEventChange(e) {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  }

  function handleTicketChange(index, e) {
    const updated = [...ticketTypes];
    updated[index][e.target.name] = e.target.value;
    setTicketTypes(updated);
  }

  function addTicketType() {
    setTicketTypes([
      ...ticketTypes,
      {
        name: "",
        price: "",
        total_seats: "",
        available_seats: "",
        priority: ticketTypes.length + 1,
      },
    ]);
  }

  async function submitEvent(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(eventData).forEach(([key, value]) =>
        data.append(key, value)
      );

      if (eventImage) data.append("event_image", eventImage);

      const res = await api.post("/events/create/", data);
      setEventId(res.data.id);

      toast.success("Event submitted for admin approval ⏳");

    } catch (err) {
      toast.error("Failed to create event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitTickets() {
    try {
      setLoading(true);

      for (let ticket of ticketTypes) {
        await api.post("/events/tickets/create/", {
          ...ticket,
          price: Number(ticket.price),
          total_seats: Number(ticket.total_seats),
          available_seats: Number(ticket.available_seats),
          event: eventId,
        });
      }

      toast.success("Tickets saved. Event will go live after admin approval ⏳");
      setTimeout(() => {
  navigate("/my-events");
}, 1200);
    } catch (err) {
      toast.error("Failed to create ticket types");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Host an Event
        </h1>

        {/* STEP 1: EVENT DETAILS */}
        {!eventId && (
          <form
            onSubmit={submitEvent}
            className="bg-white p-8 rounded-2xl border shadow-sm space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Event Details
            </h2>

            <input
              name="title"
              placeholder="Event Title"
              onChange={handleEventChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <textarea
              name="description"
              placeholder="Event Description"
              rows="4"
              onChange={handleEventChange}
              className="w-full border rounded-lg px-3 py-2"
            />

            <input
              name="location"
              placeholder="Venue Name"
              onChange={handleEventChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <input
              type="datetime-local"
              name="date"
              onChange={handleEventChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />

            <select
              name="category"
              onChange={handleEventChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="music">Music</option>
              <option value="comedy">Comedy</option>
              <option value="tech">Tech</option>
              <option value="dance">Dance</option>
              <option value="sports">Sports</option>
            </select>

            <input
              type="file"
              onChange={(e) => setEventImage(e.target.files[0])}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        )}

        {/* STEP 2: TICKETS */}
        {eventId && (
          <div className="bg-white p-8 rounded-2xl border shadow-sm mt-8">
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
              ⏳ Your event is pending admin approval.  
              Tickets are saved, but the event will be visible only after approval.
            </div>

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Ticket Types
            </h2>

            {ticketTypes.map((ticket, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 border p-4 rounded-xl mb-3"
              >
                <input
                  name="name"
                  placeholder="Ticket Name"
                  onChange={(e) => handleTicketChange(index, e)}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  onChange={(e) => handleTicketChange(index, e)}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  name="total_seats"
                  placeholder="Total Seats"
                  onChange={(e) => handleTicketChange(index, e)}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  name="available_seats"
                  placeholder="Available Seats"
                  onChange={(e) => handleTicketChange(index, e)}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
            ))}

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={addTicketType}
                className="px-4 py-2 border rounded-lg"
              >
                + Add Ticket Type
              </button>

              <button
                type="button"
                onClick={submitTickets}
                disabled={loading}
                className="ml-auto bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Finish Hosting"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
