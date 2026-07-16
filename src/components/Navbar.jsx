import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LOGO_URL =
  "https://media.base44.com/images/public/user_6a3aa7fd0ea49712de376a48/b81471a40_IISELogo_Horiz_FullName_RGB.jpg";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "Announcements", path: "/announcements" },
  { label: "Gallery", path: "/gallery" },
  { label: "Meet the Crew", path: "/team" },
  { label: "Feedback", path: "/feedback" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-smooth ${
        scrolled ? "border-b border-[#1B3A6B]/20 shadow-sm" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center shrink-0">
            <img src={LOGO_URL} alt="IISE Logo" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-smooth group ${
                    active ? "text-[#1B3A6B]" : "text-gray-600 hover:text-[#1B3A6B]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-0.5 bg-[#1B3A6B] transition-smooth origin-left ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="ml-3 px-4 py-2 text-sm font-medium bg-[#1B3A6B] text-white rounded-lg hover:bg-[#1B3A6B]/90 transition-smooth"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#1B3A6B] hover:bg-gray-100 transition-smooth"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                    active
                      ? "bg-[#1B3A6B]/10 text-[#1B3A6B]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="mt-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#1B3A6B] text-white text-center"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
