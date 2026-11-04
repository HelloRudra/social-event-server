import { Router } from "express";
import { ObjectId } from "mongodb";
import { events, joins } from "../config/db.js";
import { today, validateEvent, validId } from "../utils/validators.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

// Public: upcoming events (soonest first), optional limit/type/search
router.get("/events", async (req, res) => {
  const { limit, type, search } = req.query;
  const query = { eventDate: { $gte: today() } };
  if (type && type !== "All") query.eventType = type;
  if (search) query.title = { $regex: search, $options: "i" };

  let cursor = events.find(query).sort({ eventDate: 1 });
  if (limit) cursor = cursor.limit(Math.min(parseInt(limit) || 6, 50));
  res.send(await cursor.toArray());
});

// Public: single event
router.get("/events/:id", async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).send({ message: "Invalid event id." });
  const event = await events.findOne({ _id: new ObjectId(req.params.id) });
  if (!event) return res.status(404).send({ message: "Event not found." });
  res.send(event);
});

// Private: create event
router.post("/events", verifyJWT, async (req, res) => {
  const { data, error } = validateEvent(req.body);
  if (error) return res.status(400).send({ message: error });
  const doc = {
    ...data,
    createdBy: req.user.email,
    creatorName: req.user.name,
    createdAt: new Date(),
  };
  const result = await events.insertOne(doc);
  res.status(201).send({ insertedId: result.insertedId });
});

// Private: events created by the logged-in user
router.get("/my-events", verifyJWT, async (req, res) => {
  res.send(await events.find({ createdBy: req.user.email }).sort({ eventDate: 1 }).toArray());
});

// Private: update own event
router.put("/events/:id", verifyJWT, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).send({ message: "Invalid event id." });
  const { data, error } = validateEvent(req.body);
  if (error) return res.status(400).send({ message: error });
  const result = await events.updateOne(
    { _id: new ObjectId(req.params.id), createdBy: req.user.email },
    { $set: data }
  );
  if (result.matchedCount === 0) return res.status(403).send({ message: "You can only edit your own events." });
  res.send({ message: "Event updated." });
});

// Private: delete own event
router.delete("/events/:id", verifyJWT, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).send({ message: "Invalid event id." });
  const result = await events.deleteOne({ _id: new ObjectId(req.params.id), createdBy: req.user.email });
  if (result.deletedCount === 0) return res.status(403).send({ message: "You can only delete your own events." });
  await joins.deleteMany({ eventId: req.params.id });
  res.send({ message: "Event deleted." });
});

export default router;