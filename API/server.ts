import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

// Types
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

interface Entry {
  id: number;
  userId: number;
  date: string;
  title: string;
  content: string;
  mood: "happy" | "neutral" | "sad";
  createdAt: string;
}

interface MoodStats {
  userId: number;
  month: string;
  totalEntries: number;
  moods: {
    happy: number;
    neutral: number;
    sad: number;
  };
}

// Chargement du fichier JSON
const dbPath = path.join(__dirname, "db.json");
const rawData = fs.readFileSync(dbPath, "utf-8");
const data: {
  users: User[];
  entries: Entry[];
  mood_stats: MoodStats[];
} = JSON.parse(rawData);

// Initialisation
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("📘 Bienvenue sur l’API DailyLog !");
});

app.get("/users", (_req: Request, res: Response) => {
  res.json(data.users);
});

app.get("/users/:id", (req: Request, res: Response) => {
  const user = data.users.find((u) => u.id === Number(req.params.id));
  user ? res.json(user) : res.sendStatus(404);
});

app.get("/entries", (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const entries = limit ? data.entries.slice(0, limit) : data.entries;
  res.json(entries);
});

app.get("/entries/:id", (req: Request, res: Response) => {
  const entry = data.entries.find((e) => e.id === Number(req.params.id));
  entry ? res.json(entry) : res.sendStatus(404);
});

app.get("/mood_stats", (_req: Request, res: Response) => {
  res.json(data.mood_stats);
});

app.get("/mood_stats/:userId", (req: Request, res: Response) => {
  const stats = data.mood_stats.find((s) => s.userId === Number(req.params.userId));
  stats ? res.json(stats) : res.sendStatus(404);
});


app.listen(port, () => {
  console.log(`✅ Serveur  démarré sur http://localhost:${port}`);
});