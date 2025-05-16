import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
let rawData = fs.readFileSync(dbPath, "utf-8");
let data: {
  users: User[];
  entries: Entry[];
  mood_stats: MoodStats[];
} = JSON.parse(rawData);

// Helper : sauvegarde la DB
function saveDb(): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

// Helper : générer un nouvel ID unique
function generateId<T extends { id: number }>(arr: T[]): number {
  return arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
}

// Init serveur
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "dev_secret";

// Middleware JWT
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token manquant" });
    return;
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Token invalide" });
      return;
    }
    (req as any).user = user;
    next();
  });
}

// Auth: login
app.post("/auth/login", (req: Request, res: Response) => {

  console.log("req.body", req.body)

  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ message: "Aucune donnée reçue. Assurez-vous d’envoyer un JSON valide." });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Champs requis manquants." });
    return;
  }

  const user = data.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ message: "Identifiants invalides." });
    return;
  }

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });

  res.json({ token, userId: user.id });
});

// Auth: register
app.post("/auth/register", (req: Request, res: Response) => {

  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ message: "Aucune donnée reçue. Assurez-vous d’envoyer un JSON valide." });
    return;
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: "Champs requis manquants." });
    return;
  }

  if (data.users.some((u) => u.email === email)) {
    res.status(409).json({ message: "Email déjà utilisé." });
    return;
  }

  const newUser: User = {
    id: generateId(data.users),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  saveDb();

  const payload = { id: newUser.id, email: newUser.email };
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, userId: newUser.id });
});

// Ajouter une entrée
app.post("/entries", authenticateToken, (req: Request, res: Response) => {

  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ message: "Aucune donnée reçue. Assurez-vous d’envoyer un JSON valide." });
    return;
  }

  const { date, title, content, mood } = req.body;
  const userId = (req as any).user.id;

  if (!date || !title || !content || !mood) {
    res.status(400).json({ message: "Champs requis manquants." });
    return;
  }

  const newEntry: Entry = {
    id: generateId(data.entries),
    userId,
    date,
    title,
    content,
    mood,
    createdAt: new Date().toISOString(),
  };

  data.entries.push(newEntry);
  saveDb();

  res.status(201).json({ message: "Entrée ajoutée.", entry: newEntry });
});

// Routes GET
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

// Lancer le serveur
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});