import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Events as EventsDB } from "../firebase/db";
import { formatDate } from "../utils/formatDate";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventsDB.getAll()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-500">Workshops, networking events, and chapter activities.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No events yet.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
                {past.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-smooth">
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-3">{event.title}</h3>
        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0 text-[#1B3A6B]" />
            <span>{formatDate(event.date)}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-[#1B3A6B]" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-[#1B3A6B]" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        {event.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-3">{event.description}</p>
        )}
        {event.rsvp_link && (
          <a href={event.rsvp_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#1B3A6B] text-white text-sm font-medium rounded-lg hover:bg-[#1B3A6B]/90 transition-smooth">
            RSVP <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
