import { ObjectId } from "mongodb";

export const today = () =>
  new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 10);

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Health Camp",
  "Education",
  "Food Distribution",
  "Other",
];

export function validateEvent(b = {}) {
  const e = {
    title: b.title?.trim(),
    description: b.description?.trim(),
    eventType: b.eventType,
    thumbnail: b.thumbnail?.trim(),
    location: b.location?.trim(),
    eventDate: b.eventDate,
  };
  if (!e.title || e.title.length < 5) return { error: "Title must be at least 5 characters." };
  if (!e.description || e.description.length < 20) return { error: "Description must be at least 20 characters." };
  if (!EVENT_TYPES.includes(e.eventType)) return { error: "Please choose a valid event type." };
  if (!e.location) return { error: "Location is required." };
  try {
    new URL(e.thumbnail);
  } catch {
    return { error: "Thumbnail must be a valid image URL." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.eventDate || "")) return { error: "Event date is invalid." };
  if (e.eventDate <= today()) return { error: "Event date must be in the future." };
  return { data: e };
}

export const validId = (id) => ObjectId.isValid(id);