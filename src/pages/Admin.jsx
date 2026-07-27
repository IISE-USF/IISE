import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Events, Announcements, GalleryImages, TeamMembers, Feedback } from "../firebase/db";
import { uploadImage } from "../firebase/cloudinary";
import { formatDate } from "../utils/formatDate";
import {
  LogOut, Plus, Trash2, Pencil, Save, X, UploadCloud,
  Calendar, Megaphone, ImageIcon, Users, MessageSquare,
  ChevronDown, GripVertical, ArrowUp, ArrowDown,
} from "lucide-react";

const TABS = [
  { id: "events",        label: "Events",        icon: Calendar },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "gallery",       label: "Gallery",       icon: ImageIcon },
  { id: "team",          label: "Team",          icon: Users },
  { id: "feedback",      label: "Feedback",      icon: MessageSquare },
];

export default function Admin() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("events");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-[#1B3A6B] text-lg">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile tab picker */}
        <div className="sm:hidden mb-6 relative">
          <button
            onClick={() => setMobileTabOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium"
          >
            {TABS.find(t => t.id === tab)?.label}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {mobileTabOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {TABS.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setMobileTabOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-smooth">
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-1 mb-8 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                tab === id ? "bg-[#1B3A6B] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {tab === "events"        && <EventsPanel />}
        {tab === "announcements" && <AnnouncementsPanel />}
        {tab === "gallery"       && <GalleryPanel />}
        {tab === "team"          && <TeamPanel />}
        {tab === "feedback"      && <FeedbackPanel />}
      </div>
    </div>
  );
}

/* ── Shared helpers ─────────────────────────────────────────── */

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] transition-smooth";

function ImageUploader({ value, onChange, shape = "square" }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed. Check your Cloudinary secrets.");
    } finally {
      setUploading(false);
    }
  };

  const previewCls = shape === "circle"
    ? "w-20 h-20 rounded-full object-cover border-2 border-[#1B3A6B]/20"
    : "h-24 w-auto rounded-lg object-cover border border-gray-200";

  return (
    <div className="space-y-2">
      {value && <img src={value} alt="preview" className={previewCls} />}
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-[#1B3A6B] hover:text-[#1B3A6B] transition-smooth disabled:opacity-60">
          <UploadCloud className="w-4 h-4" />
          {uploading ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")}
            className="flex items-center gap-1 px-3 py-2 border border-dashed border-red-200 rounded-lg text-sm text-red-400 hover:text-red-600 hover:border-red-400 transition-smooth">
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />)}
    </div>
  );
}

function Empty({ label }) {
  return <p className="text-center py-16 text-gray-400">{label}</p>;
}

/* ── Events Panel ───────────────────────────────────────────── */

const EMPTY_EVENT = { title: "", date: "", time: "", location: "", description: "", rsvp_link: "", image_url: "" };

function EventsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);

  const load = () => Events.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const startNew  = () => { setForm(EMPTY_EVENT); setEditing("new"); };
  const startEdit = item => { setForm(item); setEditing(item.id); };
  const cancel    = () => { setEditing(null); setForm(EMPTY_EVENT); };

  const save = async () => {
    if (!form.title || !form.date) { alert("Title and date are required."); return; }
    setSaving(true);
    try {
      if (editing === "new") await Events.create(form);
      else await Events.update(editing, form);
      cancel(); load();
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm("Delete this event?")) return;
    await Events.delete(id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Events</h2>
        <button onClick={startNew} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm font-medium rounded-xl hover:bg-[#1B3A6B]/90 transition-smooth">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">{editing === "new" ? "New Event" : "Edit Event"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title *"><input value={form.title} onChange={set("title")} className={inputCls} placeholder="Event title" /></Field>
            <Field label="Date *"><input type="date" value={form.date} onChange={set("date")} className={inputCls} /></Field>
            <Field label="Time"><input type="time" value={form.time} onChange={set("time")} className={inputCls} /></Field>
            <Field label="Location"><input value={form.location} onChange={set("location")} className={inputCls} placeholder="Room / building" /></Field>
            <Field label="RSVP Link"><input value={form.rsvp_link} onChange={set("rsvp_link")} className={inputCls} placeholder="https://…" /></Field>
            <Field label="Event Image">
              <ImageUploader value={form.image_url} onChange={v => setForm(f => ({ ...f, image_url: v }))} />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={set("description")} rows={3} className={inputCls} placeholder="Optional details…" />
          </Field>
          <div className="flex gap-3 justify-end">
            <button onClick={cancel} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-sm rounded-xl hover:bg-gray-50 transition-smooth"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm rounded-xl hover:bg-[#1B3A6B]/90 disabled:opacity-60 transition-smooth"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      )}

      {loading ? <Skeleton /> : items.length === 0 ? <Empty label="No events yet." /> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-sm text-gray-500">{formatDate(item.date)}{item.time && ` · ${item.time}`}{item.location && ` · ${item.location}`}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(item)} className="p-2 text-gray-500 hover:text-[#1B3A6B] hover:bg-[#1B3A6B]/10 rounded-lg transition-smooth"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => del(item.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Announcements Panel ────────────────────────────────────── */

const CATS = ["General", "Event", "Opportunity", "Important"];
const EMPTY_ANN = { title: "", body: "", category: "General", link: "" };

function AnnouncementsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_ANN);
  const [saving, setSaving] = useState(false);

  const load = () => Announcements.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const startNew  = () => { setForm(EMPTY_ANN); setEditing("new"); };
  const startEdit = item => { setForm(item); setEditing(item.id); };
  const cancel    = () => setEditing(null);

  const save = async () => {
    if (!form.title || !form.body) { alert("Title and body are required."); return; }
    setSaving(true);
    try {
      if (editing === "new") await Announcements.create(form);
      else await Announcements.update(editing, form);
      cancel(); load();
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm("Delete?")) return;
    await Announcements.delete(id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Announcements</h2>
        <button onClick={startNew} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm font-medium rounded-xl hover:bg-[#1B3A6B]/90 transition-smooth">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold">{editing === "new" ? "New Announcement" : "Edit Announcement"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title *"><input value={form.title} onChange={set("title")} className={inputCls} /></Field>
            <Field label="Category">
              <select value={form.category} onChange={set("category")} className={inputCls + " bg-white"}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Body *"><textarea value={form.body} onChange={set("body")} rows={4} className={inputCls} /></Field>
          <Field label="Link (optional)"><input value={form.link} onChange={set("link")} className={inputCls} placeholder="https://…" /></Field>
          <div className="flex gap-3 justify-end">
            <button onClick={cancel} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-sm rounded-xl hover:bg-gray-50 transition-smooth"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm rounded-xl hover:bg-[#1B3A6B]/90 disabled:opacity-60 transition-smooth"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      )}

      {loading ? <Skeleton /> : items.length === 0 ? <Empty label="No announcements yet." /> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{item.body}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(item)} className="p-2 text-gray-500 hover:text-[#1B3A6B] hover:bg-[#1B3A6B]/10 rounded-lg transition-smooth"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => del(item.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Gallery Panel ──────────────────────────────────────────── */

const EMPTY_IMG = { image_url: "", caption: "", event_tag: "" };

function GalleryPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_IMG);
  const [saving, setSaving] = useState(false);

  const load = () => GalleryImages.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const startEdit = item => { setForm(item); setEditingItem(item.id); setAdding(false); };
  const cancel = () => { setAdding(false); setEditingItem(null); setForm(EMPTY_IMG); };

  const save = async () => {
    if (!form.image_url) { alert("Please upload an image first."); return; }
    setSaving(true);
    try {
      if (editingItem) await GalleryImages.update(editingItem, form);
      else await GalleryImages.create(form);
      cancel(); load();
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm("Delete image?")) return;
    await GalleryImages.delete(id); load();
  };

  const showForm = adding || editingItem;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Gallery</h2>
        <button onClick={() => { setAdding(true); setEditingItem(null); setForm(EMPTY_IMG); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm font-medium rounded-xl hover:bg-[#1B3A6B]/90 transition-smooth">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold">{editingItem ? "Edit Photo" : "Add Photo"}</h3>
          <Field label="Image *">
            <ImageUploader value={form.image_url} onChange={v => setForm(f => ({ ...f, image_url: v }))} />
          </Field>
          <Field label="Caption"><input value={form.caption} onChange={set("caption")} className={inputCls} placeholder="Optional caption" /></Field>
          <Field label="Event tag"><input value={form.event_tag} onChange={set("event_tag")} className={inputCls} placeholder="e.g. Spring Banquet 2024" /></Field>
          <div className="flex gap-3 justify-end">
            <button onClick={cancel} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-sm rounded-xl hover:bg-gray-50 transition-smooth"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm rounded-xl hover:bg-[#1B3A6B]/90 disabled:opacity-60 transition-smooth"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      )}

      {loading ? <Skeleton /> : items.length === 0 ? <Empty label="No photos yet." /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white">
              <img src={item.image_url} alt={item.caption || ""} className="w-full aspect-square object-cover" />
              {/* Hover overlay with edit + delete */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2">
                <button onClick={() => startEdit(item)}
                  className="p-2 bg-white text-[#1B3A6B] rounded-lg hover:bg-[#1B3A6B] hover:text-white transition-smooth">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del(item.id)}
                  className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-smooth">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {item.caption && <p className="text-xs text-gray-500 px-2 py-1.5 truncate">{item.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Team Panel (with reorder + photo editing) ──────────────── */

const EMPTY_MEMBER = { name: "", role: "", bio: "", email: "", linkedin: "", photo_url: "", order: 0 };

function TeamPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  const load = () => TeamMembers.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const startNew  = () => { setForm(EMPTY_MEMBER); setEditing("new"); };
  const startEdit = item => { setForm(item); setEditing(item.id); };
  const cancel    = () => setEditing(null);

  const save = async () => {
    if (!form.name) { alert("Name is required."); return; }
    setSaving(true);
    try {
      if (editing === "new") await TeamMembers.create({ ...form, order: items.length });
      else await TeamMembers.update(editing, form);
      cancel(); load();
    } catch (err) { alert("Save failed: " + err.message); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!confirm("Remove member?")) return;
    await TeamMembers.delete(id); load();
  };

  // Move up / move down buttons
  const move = async (index, direction) => {
    const newItems = [...items];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    setItems(newItems);
    // Save new order to Firestore
    await Promise.all(newItems.map((item, i) => TeamMembers.update(item.id, { order: i })));
  };

  // Drag-and-drop handlers
  const onDragStart = (e, index) => { dragItem.current = index; e.dataTransfer.effectAllowed = "move"; };
  const onDragEnter = (e, index) => { dragOver.current = index; };
  const onDragEnd   = async () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const newItems = [...items];
    const dragged = newItems.splice(dragItem.current, 1)[0];
    newItems.splice(dragOver.current, 0, dragged);
    dragItem.current = null;
    dragOver.current = null;
    setItems(newItems);
    setReordering(true);
    await Promise.all(newItems.map((item, i) => TeamMembers.update(item.id, { order: i })));
    setReordering(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
          <p className="text-xs text-gray-400 mt-0.5">Drag rows or use ↑↓ buttons to reorder</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm font-medium rounded-xl hover:bg-[#1B3A6B]/90 transition-smooth">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold">{editing === "new" ? "New Member" : "Edit Member"}</h3>

          {/* Photo editor at the top */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <div className="shrink-0">
              {form.photo_url
                ? <img src={form.photo_url} alt={form.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#1B3A6B]/20" />
                : <div className="w-20 h-20 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center text-[#1B3A6B] font-bold text-2xl">
                    {form.name?.[0] || "?"}
                  </div>
              }
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Profile Photo</p>
              <ImageUploader
                value={form.photo_url}
                onChange={v => setForm(f => ({ ...f, photo_url: v }))}
                shape="circle"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name *"><input value={form.name} onChange={set("name")} className={inputCls} /></Field>
            <Field label="Role / Title"><input value={form.role} onChange={set("role")} className={inputCls} placeholder="President, VP…" /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={set("email")} className={inputCls} /></Field>
            <Field label="LinkedIn URL"><input value={form.linkedin} onChange={set("linkedin")} className={inputCls} placeholder="https://linkedin.com/in/…" /></Field>
          </div>
          <Field label="Bio"><textarea value={form.bio} onChange={set("bio")} rows={3} className={inputCls} /></Field>

          <div className="flex gap-3 justify-end">
            <button onClick={cancel} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-sm rounded-xl hover:bg-gray-50 transition-smooth"><X className="w-4 h-4" /> Cancel</button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-sm rounded-xl hover:bg-[#1B3A6B]/90 disabled:opacity-60 transition-smooth"><Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      )}

      {reordering && (
        <div className="text-center text-sm text-[#1B3A6B] bg-[#1B3A6B]/10 rounded-xl py-2">
          Saving new order…
        </div>
      )}

      {loading ? <Skeleton /> : items.length === 0 ? <Empty label="No team members yet." /> : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={e => onDragStart(e, index)}
              onDragEnter={e => onDragEnter(e, index)}
              onDragEnd={onDragEnd}
              onDragOver={e => e.preventDefault()}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-smooth group"
            >
              {/* Drag handle */}
              <div className="text-gray-300 group-hover:text-gray-400 transition-smooth shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Position number */}
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                {index + 1}
              </div>

              {/* Photo */}
              {item.photo_url
                ? <img src={item.photo_url} alt={item.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                : <div className="w-12 h-12 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center text-[#1B3A6B] font-bold shrink-0">
                    {item.name?.[0]}
                  </div>
              }

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500 truncate">{item.role}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Up/down arrows for non-drag users */}
                <button onClick={() => move(index, -1)} disabled={index === 0}
                  className="p-1.5 text-gray-400 hover:text-[#1B3A6B] hover:bg-[#1B3A6B]/10 rounded-lg transition-smooth disabled:opacity-20">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === items.length - 1}
                  className="p-1.5 text-gray-400 hover:text-[#1B3A6B] hover:bg-[#1B3A6B]/10 rounded-lg transition-smooth disabled:opacity-20">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => startEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-[#1B3A6B] hover:bg-[#1B3A6B]/10 rounded-lg transition-smooth">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => del(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Feedback Panel ─────────────────────────────────────────── */

const STATUS_STYLES = {
  New: "bg-blue-100 text-blue-700",
  Reviewed: "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
};

function FeedbackPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => Feedback.getAll().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => { await Feedback.update(id, { status }); load(); };
  const del = async id => { if (!confirm("Delete feedback?")) return; await Feedback.delete(id); load(); };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Feedback Submissions</h2>
      {loading ? <Skeleton /> : items.length === 0 ? <Empty label="No feedback yet." /> : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-900">{item.name || "Anonymous"}</p>
                  {item.email && <p className="text-sm text-gray-500">{item.email}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[item.status] || STATUS_STYLES.New}`}>
                    {item.status || "New"}
                  </span>
                  <select value={item.status || "New"} onChange={e => updateStatus(item.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none">
                    {Object.keys(STATUS_STYLES).map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => del(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

