import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";

/* =======================
   INNER FORM
======================= */
function PaymentForm({ booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg("");

    const bookingId = localStorage.getItem("booking_id");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/success?booking_id=${bookingId}`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur flex items-center justify-center z-20 rounded-xl">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* SUMMARY */}
      <div className="mb-5 border-b pb-4">
        <h3 className="text-lg font-semibold">{booking.event}</h3>
        <p className="text-sm text-gray-500">
          {booking.ticket_type} × {booking.quantity}
        </p>
        <p className="mt-2 font-bold">₹{booking.amount}</p>
      </div>

      <PaymentElement options={{ layout: "tabs" }} />

      {errorMsg && (
        <p className="mt-3 text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        disabled={!stripe || loading}
        className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg font-semibold"
      >
        Pay ₹{booking.amount}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => navigate(-1)}
        className="w-full mt-3 text-sm text-gray-500"
      >
        Cancel
      </button>
    </form>
  );
}

/* =======================
   PAGE
======================= */
export default function StripePaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = localStorage.getItem("booking_id");

    if (!bookingId) {
      navigate("/events");
      return;
    }

    async function init() {
      try {
        // 1️⃣ Create payment intent
        const intentRes = await api.post(
          "/booking/create-payment-intent/",
          { booking_id: bookingId }
        );

        // 2️⃣ Fetch booking details
        const bookingRes = await api.get(
          `/booking/payment/${bookingId}/`
        );

        setClientSecret(intentRes.data.client_secret);
        setBooking(bookingRes.data);
      } catch (err) {
        console.error(err);
        navigate("/events");
      }
    }

    init();
  }, [navigate]);

  if (!clientSecret || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading payment…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: "stripe" },
        }}
      >
        <PaymentForm booking={booking} />
      </Elements>
    </div>
  );
}
