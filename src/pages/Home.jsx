import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Megaphone, Users, ImageIcon, ArrowRight } from "lucide-react";
import { Events, Announcements } from "../firebase/db";
import { formatDate, formatTime } from "../utils/formatDate";

const CATEGORY_COLORS = {
  General: "bg-gray-100 text-gray-700",
  Event: "bg-blue-100 text-blue-700",
  Opportunity: "bg-green-100 text-green-700",
  Important: "bg-red-100 text-red-700",
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([Events.getUpcoming(), Announcements.getAll()])
      .then(([ev, an]) => {
        setEvents(ev.slice(0, 3));
        setAnnouncements(an.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1B3A6B] via-[#1B3A6B]/90 to-[#2a5298] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#C9A84C] blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white/90 text-sm font-medium mb-6">
              IISE Student Chapter
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Engineering a Better <span className="text-[#C9A84C]">Tomorrow</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/80 mb-8 leading-relaxed">
              Join our chapter of the Institute of Industrial and Systems Engineers.
              Connect with peers, attend workshops, and build the skills that shape industries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="px-6 py-3 bg-[#C9A84C] text-white font-semibold rounded-xl hover:bg-[#C9A84C]/90 transition-smooth">
                View Events
              </Link>
              <Link to="/feedback" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-smooth backdrop-blur-sm">
                Give Feedback
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calendar,  label: "Events",        desc: "Workshops, tours & socials", path: "/events" },
            { icon: Megaphone, label: "Announcements", desc: "Stay in the loop",           path: "/announcements" },
            { icon: Users,     label: "Meet the Crew", desc: "Our board members",          path: "/team" },
            { icon: ImageIcon, label: "Gallery",       desc: "Photos from our events",     path: "/gallery" },
          ].map(({ icon: Icon, label, desc, path }) => (
            <Link key={path} to={path} className="group p-6 rounded-2xl border border-gray-200 hover:border-[#1B3A6B]/30 hover:shadow-lg transition-smooth bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#1B3A6B]/10 flex items-center justify-center mb-4 group-hover:bg-[#1B3A6B]/20 transition-smooth">
                <Icon className="w-6 h-6 text-[#1B3A6B]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <Link to="/events" className="flex items-center gap-1 text-sm text-[#1B3A6B] font-medium hover:gap-2 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No upcoming events yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-smooth">
                  <div className="flex items-center gap-2 text-xs text-[#1B3A6B] font-medium mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(ev.date)}
                    {ev.time && <span className="text-gray-400">· {ev.time}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{ev.title}</h3>
                  {ev.location && <p className="text-sm text-gray-500">{ev.location}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Announcements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Announcements</h2>
            <Link to="/announcements" className="flex items-center gap-1 text-sm text-[#1B3A6B] font-medium hover:gap-2 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a.id} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 hover:shadow-sm transition-smooth bg-white">
                  <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[a.category] || CATEGORY_COLORS.General}`}>
                    {a.category || "General"}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
