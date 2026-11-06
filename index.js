import "dotenv/config";
import express from "express";
import cors from "cors";
import eventsRouter from "./routes/events.js";
import joinsRouter from "./routes/joins.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL.split(",").map((u) => u.trim().replace(/\/+$/, "")) }));
app.use(express.json());

app.get("/", (req, res) => res.send({ message: "Social Events API is running" }));

app.use(eventsRouter);
app.use(joinsRouter);
app.use((req, res) => {
  res.status(404).send({ message: "This route does not exist." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Something went wrong on the server." });
});

app.listen(port, () => console.log(`Server running on port ${port}`));