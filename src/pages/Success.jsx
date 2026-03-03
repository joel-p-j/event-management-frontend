import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function Success() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bookingId = params.get("booking_id");

  const [status, setStatus] = useState("LOADING");

  useEffect(() => {
    if (!bookingId) {
      navigate("/");
      return;
    }

    async function checkStatus() {
      try {
        const res = await api.get(`/booking/status/${bookingId}/`);
        setStatus(res.data.status);
      } catch {
        setStatus("FAILED");
      }
    }

    checkStatus();
  }, [bookingId, navigate]);

  if (status === "LOADING") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Confirming payment…
      </div>
    );
  }

  if (status !== "PAID") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-600">
            Payment Failed ❌
          </h1>
          <p className="mt-4 text-gray-600">
            Your payment was not completed. Seats were not booked.
          </p>

          <button
            onClick={() => navigate("/events")}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="mt-4 text-gray-600">
          Your booking has been confirmed.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/history")}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border py-3 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
