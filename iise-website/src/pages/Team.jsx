import { useEffect, useState } from "react";
import { Users, Mail, Linkedin } from "lucide-react";
import { TeamMembers } from "../firebase/db";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TeamMembers.getAll()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet the Crew</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          The dedicated team behind our IISE chapter — driven by passion for industrial engineering.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No team members listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-smooth text-center"
            >
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  alt={m.name}
                  className="w-full h-48 object-cover object-top"
                />
              ) : (
                <div className="w-full h-48 bg-[#1B3A6B]/10 flex items-center justify-center">
                  <Users className="w-16 h-16 text-[#1B3A6B]/30" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{m.name}</h3>
                {m.role && (
                  <p className="text-sm text-[#1B3A6B] font-medium mt-0.5">{m.role}</p>
                )}
                {m.bio && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3">{m.bio}</p>
                )}
                <div className="flex justify-center gap-3 mt-3">
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="text-gray-400 hover:text-[#1B3A6B] transition-smooth">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1B3A6B] transition-smooth">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
