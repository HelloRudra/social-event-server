import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL.split(",") }));
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
await client.connect();
console.log("Connected to MongoDB");

const db = client.db("socialEvents");
const events = db.collection("events");
const joins = db.collection("joinedEvents");
await joins.createIndex({ eventId: 1, userEmail: 1 }, { unique: true });

app.get("/", (req, res) => res.send({ message: "Social Events API is running" }));

app.listen(port, () => console.log(`Server running on port ${port}`));