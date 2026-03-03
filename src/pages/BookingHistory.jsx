import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const navigate=useNavigate()
  
  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await api.get("/booking/history/");
      setBookings(res.data);
    } catch (err) {
      console.log("Error fetching bookings", err);
    }
  }

  async function downloadQR(url, eventName) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `${eventName}-QR.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch {
      alert("Failed to download ticket");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
          🎟 My Bookings
        </h1>

        {bookings.length === 0 && (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        You haven’t booked any events yet
      </h2>
      <p className="text-gray-500 mb-6">
        Discover exciting events and book tickets in just a few clicks.
      </p>

      <button
        onClick={() => navigate("/events")}
        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
      >
        Browse Events
      </button>
    </div>
  </div>
)}


        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-6">

                {/* EVENT IMAGE */}
                <div className="w-full">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-200">
                    <img
                      src={booking.event_image}
                      alt={booking.event_name}
                      className="w-full h-full object-cover"
                    />

                    <span
                      className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="w-full">
                  <div className="bg-gray-50 rounded-xl p-4 h-full">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {booking.event_name}
                    </h2>

                    {booking.event_date && (
                      <p className="text-gray-500 text-sm mt-1">
                        📅{" "}
                        {new Date(booking.event_date).toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}

                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                      <p>
                        🎟 <span className="font-medium">Ticket:</span>{" "}
                        {booking.ticket_type_name}
                      </p>
                      <p>
                        🎫 <span className="font-medium">Quantity:</span>{" "}
                        {booking.quantity}
                      </p>
                      <p>
                        💰 <span className="font-medium">Amount Paid:</span>{" "}
                        ₹{booking.amount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR SECTION */}
                {booking.qr_code_url && (
                  <div className="w-full">
                    <div className="bg-gray-100 rounded-xl p-4 h-full flex flex-col items-center border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Entry QR Code
                      </p>

                      <img
                        src={booking.qr_code_url}
                        alt="QR Code"
                        className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                      />

                      <button
                        onClick={() =>
                          downloadQR(
                            booking.qr_code_url,
                            booking.event_name
                          )
                        }
                        className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                      >
                        Download QR
                      </button>

                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Show this QR at the event entrance
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;
