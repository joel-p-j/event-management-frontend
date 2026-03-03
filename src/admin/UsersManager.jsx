import React, { useEffect, useState } from "react";
import api from "../api/axios";

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.get("/admin-api/users/");
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin-api/users/delete/${id}/`);
    fetchUsers();
  }

  async function updateRole(id, role) {
    await api.put(`/admin-api/users/update/${id}/`, { role });
    fetchUsers();
  }

  async function viewBookings(user) {
    const res = await api.get(`/admin-api/users/${user.id}/bookings/`);
    setBookings(res.data);
    setSelectedUser(user);
  }

  if (loading) {
    return <p className="text-zinc-400">Loading users…</p>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          Users
        </h1>
        <p className="text-sm text-zinc-400">
          Manage platform users and roles
        </p>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block rounded-2xl overflow-hidden bg-zinc-900/70 border border-white/5">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="px-5 py-3 text-left">Username</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {user.username}
                </td>

                <td className="px-5 py-4 text-zinc-400">
                  {user.email}
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-zinc-700 text-zinc-300"
                      }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4 text-right space-x-2">
                  {user.role !== "admin" && (
                    <>
                      <button
                        onClick={() => updateRole(user.id, "admin")}
                        className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Make Admin
                      </button>

                      <button
                        onClick={() => viewBookings(user)}
                        className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Bookings
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-zinc-900/70 border border-white/5 rounded-2xl p-4 space-y-3"
          >
            <div>
              <p className="font-medium text-white">
                {user.username}
              </p>
              <p className="text-sm text-zinc-400">
                {user.email}
              </p>
            </div>

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                ${
                  user.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-zinc-700 text-zinc-300"
                }`}
            >
              {user.role}
            </span>

            {user.role !== "admin" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateRole(user.id, "admin")}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                >
                  Make Admin
                </button>

                <button
                  onClick={() => viewBookings(user)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg"
                >
                  Bookings
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BOOKINGS MODAL */}
      {selectedUser && (
        <Modal onClose={() => setSelectedUser(null)}>
          <h2 className="text-xl font-semibold text-white mb-4">
            Bookings – {selectedUser.username}
          </h2>

          {bookings.length === 0 && (
            <p className="text-zinc-400">
              No bookings found.
            </p>
          )}

          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="border border-white/10 rounded-lg p-3"
              >
                <p className="font-medium text-white">
                  {b.event}
                </p>
                <p className="text-sm text-zinc-400">
                  🎟 {b.ticket_count} tickets
                </p>
                <p className="text-sm text-zinc-400">
                  Status: {b.status}
                </p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default UsersManager;

/* ================= MODAL ================= */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 text-white rounded-xl p-6 w-full max-w-lg relative border border-white/10">
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
