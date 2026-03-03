import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminEvents from "./AdminEvents";
import AdminBookings from "./AdminBookings";
import UsersManager from "./UsersManager";
import { Outlet, useNavigate, useLocation } from "react-router-dom";


export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
const location = useLocation();
const path = location.pathname;


  return (
    <div className="bg-zinc-950 text-white">

      {/* ================= MOBILE ADMIN HEADER ================= */}
      <header
        className="
          lg:hidden
          sticky
          top-[72px]   /* below main navbar */
          z-40
          h-14
          bg-zinc-900
          border-b border-white/10
          flex items-center
          px-4
        "
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl"
        >
          ☰
        </button>
        <span className="ml-4 text-sm font-semibold">
          Admin Panel
        </span>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= LAYOUT ================= */}
      <div className="flex min-h-[calc(100vh-72px)]">

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`
            fixed lg:static
            top-[72px] lg:top-0
            left-0
            w-64
            bg-zinc-900
            border-r border-white/10
            z-40
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            flex flex-col
          `}
        >
          {/* MOBILE CLOSE */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-semibold">Admin Panel</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-xl text-zinc-400"
            >
              ✕
            </button>
          </div>

          {/* DESKTOP TITLE */}
          <div className="hidden lg:block p-6 text-lg font-semibold">
            Admin Panel
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <SidebarItem
  label="📊 Dashboard"
  active={path === "/admin" || path === "/admin/dashboard"}
  onClick={() => navigate("/admin/dashboard")}
/>

<SidebarItem
  label="🎪 Events"
  active={path === "/admin/events"}
  onClick={() => navigate("/admin/events")}
/>

<SidebarItem
  label="🎟 Bookings"
  active={path === "/admin/bookings"}
  onClick={() => navigate("/admin/bookings")}
/>

<SidebarItem
  label="👥 Users"
  active={path === "/admin/users"}
  onClick={() => navigate("/admin/users")}
/>

          </nav>

          <div className="p-4 text-xs text-zinc-500 border-t border-white/10">
            Event Management System
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6">
          <div className="max-w-6xl mx-auto">
           <Outlet />

          </div>
        </main>

      </div>
    </div>
  );
}

function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition ${
        active
          ? "bg-white/10 text-white"
          : "text-zinc-400 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
