function EventCard({ event, navigate }) {
  const minPrice = event.ticket_types?.length
    ? Math.min(...event.ticket_types.map(t => Number(t.price)))
    : null;

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="cursor-pointer bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition"
    >
<img
  src={event.event_image_url || "/placeholder-event.jpg"}
  alt={event.title}
  className="w-full h-[340px] object-cover"
/>

      <div className="p-4">
        <h2 className="font-semibold line-clamp-2">{event.title}</h2>
        <p className="text-sm text-gray-600">{event.location}</p>
        <p className="text-sm font-semibold mt-1">
          {minPrice ? `₹${minPrice} onwards` : "Tickets available"}
        </p>
      </div>
    </div>
  );
}

export default EventCard