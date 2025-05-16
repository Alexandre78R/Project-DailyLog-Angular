import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import entriesRoutes from "./routes/entries";
import usersRoutes from "./routes/users";
import moodStatsRoutes from "./routes/moodStats";

dotenv.config();

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/entries", entriesRoutes);
app.use("/users", usersRoutes);
app.use("/mood_stats", moodStatsRoutes);

app.get("/", (_req, res) => {
  res.send("📘 Bienvenue sur l’API DailyLog !");
});

app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});