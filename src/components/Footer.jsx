import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1B3A6B] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">IISE Chapter</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Institute of Industrial and Systems Engineers — dedicated to excellence
              in industrial engineering and continuous improvement.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Events", path: "/events" },
                { label: "Announcements", path: "/announcements" },
                { label: "Gallery", path: "/gallery" },
                { label: "Meet the Crew", path: "/team" },
                { label: "Feedback", path: "/feedback" },
              ].map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-white/70 hover:text-white transition-smooth">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect</h3>
            <p className="text-white/70 text-sm">
              Stay connected with our chapter through events and announcements.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} IISE Chapter. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
