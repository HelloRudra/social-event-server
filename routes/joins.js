import { Router } from "express";
import { ObjectId } from "mongodb";
import { events, joins } from "../config/db.js";
import { today, validId } from "../utils/validators.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = Router();

// Private: join an upcoming event
router.post("/events/:id/join", verifyJWT, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).send({ message: "Invalid event id." });
  const event = await events.findOne({ _id: new ObjectId(req.params.id) });
  if (!event) return res.status(404).send({ message: "Event not found." });
  if (event.eventDate < today()) return res.status(400).send({ message: "This event has already passed." });

  try {
    await joins.insertOne({
      eventId: req.params.id,
      userEmail: req.user.email,
      userName: req.user.name,
      title: event.title,
      thumbnail: event.thumbnail,
      location: event.location,
      eventType: event.eventType,
      eventDate: event.eventDate,
      joinedAt: new Date(),
    });
    res.status(201).send({ message: "You joined this event!" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).send({ message: "You already joined this event." });
    throw err;
  }
});

// Private: events joined by the logged-in user, sorted by event date
router.get("/joined-events", verifyJWT, async (req, res) => {
  res.send(await joins.find({ userEmail: req.user.email }).sort({ eventDate: 1 }).toArray());
});

export default router;