import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminTickets({ eventId, onClose }) {
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    const res = await api.get(`/events/tickets/${eventId}/`);
    setTickets(res.data);
  }

  function resetForm() {
    setName("");
    setPrice("");
    setTotalSeats("");
    setAvailableSeats("");
    setPriority(1);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      event: eventId,
      name,
      price,
      total_seats: totalSeats,
      available_seats: availableSeats,
      priority,
    };

    try {
      if (editingId) {
        await api.put(`/events/tickets/update/${editingId}/`, data);
      } else {
        await api.post("/events/tickets/create/", data);
      }

      resetForm();
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save ticket");
    }
  }

  async function deleteTicket(id) {
    if (!window.confirm("Delete ticket?")) return;
    await api.delete(`/events/tickets/delete/${id}/`);
    fetchTickets();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white text-black w-full max-w-3xl p-6 rounded-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Manage Tickets</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mb-6">
          <input
            placeholder="Ticket name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2"
            required
          />

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2"
            required
          />

          <input
            placeholder="Total seats"
            type="number"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            className="border p-2"
            required
          />

          <input
            placeholder="Available seats"
            type="number"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(e.target.value)}
            className="border p-2"
            required
          />

          <input
            placeholder="Priority"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2"
          />

          <button className="bg-green-600 text-white rounded px-4 py-2 col-span-2">
            {editingId ? "Update Ticket" : "Add Ticket"}
          </button>
        </form>

        {/* TICKET LIST */}
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th>Price</th>
              <th>Total</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.name}</td>
                <td>₹{t.price}</td>
                <td>{t.total_seats}</td>
                <td>{t.available_seats}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setName(t.name);
                      setPrice(t.price);
                      setTotalSeats(t.total_seats);
                      setAvailableSeats(t.available_seats);
                      setPriority(t.priority);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTicket(t.id)}
                    className="text-red-600"
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
  );
}
