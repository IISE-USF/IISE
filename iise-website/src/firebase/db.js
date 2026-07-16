import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// ── Generic helpers ──────────────────────────────────────────
export async function getAll(collectionName, orderField = "created_date", dir = "desc") {
  try {
    const q = query(collection(db, collectionName), orderBy(orderField, dir));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    // Fallback without ordering if Firestore index missing
    try {
      const snap = await getDocs(collection(db, collectionName));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error(`getAll(${collectionName}) failed:`, err);
      return [];
    }
  }
}

export async function create(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    created_date: serverTimestamp(),
  });
  return docRef.id;
}

export async function update(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updated_date: serverTimestamp(),
  });
}

export async function remove(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}

// ── Collection helpers ───────────────────────────────────────
export const Events = {
  getAll: async () => {
    const items = await getAll("events", "created_date", "desc");
    return items.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  },
  getUpcoming: async () => {
    const all = await getAll("events", "created_date", "desc");
    const today = new Date().toISOString().split("T")[0];
    return all.filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10);
  },
  create: (data) => create("events", data),
  update: (id, data) => update("events", id, data),
  delete: (id) => remove("events", id),
};

export const Announcements = {
  getAll: () => getAll("announcements", "created_date", "desc"),
  create: (data) => create("announcements", data),
  update: (id, data) => update("announcements", id, data),
  delete: (id) => remove("announcements", id),
};

export const GalleryImages = {
  getAll: () => getAll("gallery", "created_date", "desc"),
  create: (data) => create("gallery", data),
  update: (id, data) => update("gallery", id, data),
  delete: (id) => remove("gallery", id),
};

export const TeamMembers = {
  getAll: async () => {
    const items = await getAll("team", "created_date", "desc");
    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
  create: (data) => create("team", data),
  update: (id, data) => update("team", id, data),
  delete: (id) => remove("team", id),
};

export const Feedback = {
  getAll: () => getAll("feedback", "created_date", "desc"),
  create: (data) => create("feedback", data),
  update: (id, data) => update("feedback", id, data),
  delete: (id) => remove("feedback", id),
};
