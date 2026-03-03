import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await api.get("/booking/admin/all/");
      setBookings(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(bookingId, status) {
    await api.put(`/booking/admin/update/${bookingId}/`, { status });
    fetchBookings();
  }

  async function cancelBooking(bookingId) {
    await api.put(`/booking/admin/update/${bookingId}/`, {
      status: "CANCELLED",
    });
    fetchBookings();
  }

  if (loading) {
    return <p className="text-zinc-400">Loading bookings…</p>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Bookings
        </h1>
        <p className="text-sm text-zinc-400">
          Manage all user bookings
        </p>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-5 py-3 text-left">User</th>
              <th className="px-5 py-3 text-left">Event</th>
              <th className="px-5 py-3 text-center">Tickets</th>
              <th className="px-5 py-3 text-center">Amount</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.booking_id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4 text-white">
                  {b.user}
                </td>

                <td className="px-5 py-4 text-zinc-300">
                  {b.event}
                </td>

                <td className="px-5 py-4 text-center text-zinc-400">
                  {b.ticket_count}
                </td>

                <td className="px-5 py-4 text-center text-zinc-400">
                  ₹{b.amount}
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        b.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : b.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right space-x-2">
                  {b.status === "PENDING" && (
                    <button
                      onClick={() =>
                        updateStatus(b.booking_id, "PAID")
                      }
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                    >
                      Mark Paid
                    </button>
                  )}

                  {b.status === "PAID" && (
                    <button
                      onClick={() =>
                        cancelBooking(b.booking_id)
                      }
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {bookings.map((b) => (
          <div
            key={b.booking_id}
            className="bg-zinc-900/70 border border-white/5 rounded-2xl p-4 space-y-3"
          >
            <div>
              <p className="text-xs text-zinc-400">User</p>
              <p className="font-medium text-white">
                {b.user}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-400">Event</p>
              <p className="font-medium text-zinc-300">
                {b.event}
              </p>
            </div>

            <div className="flex justify-between text-sm text-zinc-400">
              <p>🎟 {b.ticket_count} tickets</p>
              <p className="font-semibold text-white">
                ₹{b.amount}
              </p>
            </div>

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                ${
                  b.status === "PAID"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : b.status === "PENDING"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
                }`}
            >
              {b.status}
            </span>

            <div className="flex gap-2 pt-2">
              {b.status === "PENDING" && (
                <button
                  onClick={() =>
                    updateStatus(b.booking_id, "PAID")
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg"
                >
                  Mark Paid
                </button>
              )}

              {b.status === "PAID" && (
                <button
                  onClick={() =>
                    cancelBooking(b.booking_id)
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminBookings;
