import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${id}/`);
        setEvent(res.data);
      } catch (err) {
        console.log("Error loading event:", err);
      }
    }
    loadEvent();
  }, [id]);

  function handleTicketSelect(ticket) {
    setSelectedTicket(ticket);
    setQuantity(1);
    setTotal(Number(ticket.price));
  }

  function increaseQty() {
    if (quantity < selectedTicket.available_seats) {
      const q = quantity + 1;
      setQuantity(q);
      setTotal(q * Number(selectedTicket.price));
    }
  }

  function decreaseQty() {
    if (quantity > 1) {
      const q = quantity - 1;
      setQuantity(q);
      setTotal(q * Number(selectedTicket.price));
    }
  }

  async function handleBooking() {
    if (!selectedTicket) {
      alert("Please select a ticket type");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/booking/create-temp/", {
        ticket_type_id: selectedTicket.id,
        quantity: quantity,
      });

      localStorage.setItem("booking_id", res.data.booking_id);
      navigate("/payment");
    } catch (err) {
      console.log("Booking error:", err);
      alert("Not enough seats or please login");
    } finally {
      setLoading(false);
    }
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10 px-4">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE – EVENT + TICKETS */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">

          {/* EVENT INFO */}
          <h1 className="text-3xl font-bold text-black">
            {event.title}
          </h1>
          <p className="text-gray-600 mt-1">
            📍 {event.location}
          </p>

          {/* TICKET TYPES */}
          <h2 className="text-xl font-semibold mt-8 mb-4 text-black">
            Select Ticket Type
          </h2>

          <div className="space-y-4">
            {event.ticket_types?.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketSelect(ticket)}
                className={`p-4 border rounded-lg cursor-pointer transition
                  ${
                    selectedTicket?.id === ticket.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-black">
                      {ticket.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ticket.available_seats} seats available
                    </p>
                  </div>
                  <p className="text-lg font-bold text-black">
                    ₹{ticket.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – SUMMARY */}
        <div className="bg-white rounded-xl border p-6 h-fit sticky top-24">

          <h2 className="text-xl font-bold text-black mb-4">
            Booking Summary
          </h2>

          {!selectedTicket ? (
            <p className="text-gray-500">
              Select a ticket type to continue
            </p>
          ) : (
            <>
              {/* SELECTED TICKET */}
              <div className="flex justify-between text-gray-700 mb-2">
                <span>{selectedTicket.name}</span>
                <span>₹{selectedTicket.price}</span>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-700">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                    className="w-8 h-8 border rounded-md text-lg"
                  >
                    –
                  </button>
                  <span className="font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="w-8 h-8 border rounded-md text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TOTAL */}
              <div className="flex justify-between text-lg font-bold mt-6">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading}
                className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
