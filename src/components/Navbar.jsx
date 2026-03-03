import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import logo from "../assets/eventx-logo.png";

export default function Navbar({ onSearchOpen }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin"; // ✅ ADMIN CHECK

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">

      {/* ================= TOP BAR ================= */}
      <div className="max-w-7xl mx-auto px-4 min-h-[80px] flex items-center justify-between gap-6">

        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <Link to="/events" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="EventX"
              className="h-14 lg:h-16 w-auto object-contain"
            />
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden [@media(min-width:1024px)]:flex items-center gap-8 text-[15px] whitespace-nowrap">
          <Link to="/events" className="font-semibold">Events</Link>
          <Link to="/history" className="font-semibold">My Bookings</Link>
          <Link to="/host-event" className="font-semibold">Host Event</Link>
          <Link to="/my-events" className="font-semibold">Hosted Events</Link>

          {/* ✅ ADMIN LINK (DESKTOP) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="font-semibold text-indigo-600"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">

          {/* SEARCH (DESKTOP/TABLET) */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                readOnly
                onFocus={onSearchOpen}
                placeholder="Search for events, categories or locations"
                className="w-[260px] lg:w-[320px] pl-11 pr-4 h-10 rounded-xl border text-sm"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
            </div>
          </div>

          {/* AUTH */}
          {!user ? (
            <Link
              to="/login"
              className="hidden md:flex h-9 px-4 items-center rounded-full border text-sm"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="hidden md:flex h-9 px-4 items-center rounded-full border text-sm"
            >
              Logout
            </button>
          )}

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="[@media(min-width:1024px)]:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="[@media(min-width:1024px)]:hidden bg-white border-t border-gray-200">
          <div className="mx-4 my-4 rounded-2xl border border-gray-200 p-4 space-y-3">

            {/* SEARCH */}
            <button
              onClick={() => {
                onSearchOpen();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-3 rounded-xl border text-left"
            >
              🔍 Search events
            </button>

            {/* LINKS */}
            <Link to="/events" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100">
              Events
            </Link>
            <Link to="/history" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100">
              My Bookings
            </Link>
            <Link to="/host-event" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100">
              Host Event
            </Link>
            <Link to="/my-events" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100">
              Hosted Events
            </Link>

            {/* ✅ ADMIN LINK (MOBILE) */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-indigo-600 font-semibold hover:bg-indigo-50"
              >
                Admin Panel
              </Link>
            )}

            {/* AUTH */}
            <div className="border-t pt-3">
              {!user ? (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-gray-100">
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded-xl"
                >
                  Logout
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
