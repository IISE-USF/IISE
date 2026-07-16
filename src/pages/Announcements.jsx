import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { Announcements as AnnouncementsDB } from "../firebase/db";

const CATEGORIES = ["All", "General", "Event", "Opportunity", "Important"];

const CATEGORY_STYLES = {
  General: "bg-gray-100 text-gray-700",
  Event: "bg-blue-100 text-blue-700",
  Opportunity: "bg-green-100 text-green-700",
  Important: "bg-red-100 text-red-700",
};

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    AnnouncementsDB.getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? items : items.filter((a) => a.category === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-500">Stay up to date with chapter news and opportunities.</p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth ${
              filter === cat
                ? "bg-[#1B3A6B] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <article
              key={a.id}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-smooth"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="font-semibold text-gray-900 text-lg">{a.title}</h2>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    CATEGORY_STYLES[a.category] || CATEGORY_STYLES.General
                  }`}
                >
                  {a.category || "General"}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{a.body}</p>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 text-sm text-[#1B3A6B] font-medium hover:underline"
                >
                  Learn more →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
