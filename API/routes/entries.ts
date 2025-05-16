import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authenticate";
import { data, Entry, generateId, saveDb } from "../utils/db";

const router = Router();

// POST /entries - création d'une nouvelle entrée, protégée par JWT
router.post("/", authenticateToken, (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { date, title, content, mood } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }

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

// GET /entries - liste des entrées avec option limite
router.get("/", (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  const entries = limit ? data.entries.slice(0, limit) : data.entries;
  res.json(entries);
});

// GET /entries/:id - récupérer une entrée par son id
router.get("/:id", (req: Request, res: Response) => {
  const entry = data.entries.find((e) => e.id === Number(req.params.id));
  entry ? res.json(entry) : res.sendStatus(404);
});

export default router;