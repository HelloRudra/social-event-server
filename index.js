import express from "express";
import cors from "cors";
import "dotenv/config";
import { ObjectId } from "mongodb";
import { events, joins } from "./config/db.js";
import { today, validateEvent, validId } from "./utils/validators.js";
import { verifyJWT } from "./middleware/verifyJWT.js";
import eventsRouter from "./routes/events.js";



const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL.split(",") }));
app.use(express.json());
app.use(eventsRouter);






app.get("/", (req, res) => res.send({ message: "Social Events API is running" }));

app.listen(port, () => console.log(`Server running on port ${port}`));