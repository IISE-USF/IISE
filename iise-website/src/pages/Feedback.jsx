import { useState } from "react";
import { MessageSquare, CheckCircle } from "lucide-react";
import { Feedback as FeedbackDB } from "../firebase/db";

const TYPES = ["General", "Event", "Suggestion", "Complaint", "Other"];

export default function Feedback() {
  const [form, setForm] = useState({ name: "", email: "", type: "General", message: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) { setError("Please enter a message."); return; }
    setError("");
    setSubmitting(true);
    try {
      await FeedbackDB.create({ ...form, status: "New" });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks for your feedback!</h2>
        <p className="text-gray-500 mb-6">Your response has been recorded. We appreciate you helping us improve.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", email: "", type: "General", message: "", rating: 5 }); }}
          className="px-5 py-2.5 bg-[#1B3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#1B3A6B]/90 transition-smooth"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h1>
        <p className="text-gray-500">Help us improve by sharing your thoughts and suggestions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-gray-200 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-gray-400">(optional)</span></label>
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-smooth"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400">(optional)</span></label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-smooth"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <select
            value={form.type}
            onChange={set("type")}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-smooth bg-white"
          >
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Rating: <span className="text-[#1B3A6B] font-semibold">{form.rating}/10</span>
          </label>
          <input
            type="range" min="1" max="10"
            value={form.rating}
            onChange={set("rating")}
            className="w-full accent-[#1B3A6B]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 – Poor</span><span>10 – Excellent</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
          <textarea
            value={form.message}
            onChange={set("message")}
            rows={5}
            placeholder="Share your thoughts, suggestions, or concerns..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-smooth resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#1B3A6B] text-white font-semibold rounded-xl hover:bg-[#1B3A6B]/90 disabled:opacity-60 transition-smooth flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
          ) : (
            <><MessageSquare className="w-4 h-4" /> Submit Feedback</>
          )}
        </button>
      </form>
    </div>
  );
}
