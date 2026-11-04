import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
await client.connect();
console.log("Connected to MongoDB");

const db = client.db("socialEvents");
export const events = db.collection("events");
export const joins = db.collection("joinedEvents");

await joins.createIndex({ eventId: 1, userEmail: 1 }, { unique: true });