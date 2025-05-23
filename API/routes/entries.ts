import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authenticate";
import { Entry, generateId, loadDb, saveDb } from "../utils/db";

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

  // Charge la base à jour
  const db = loadDb();

  const newEntry: Entry = {
    id: generateId(db.entries),
    userId,
    date,
    title,
    content,
    mood,
    createdAt: new Date().toISOString(),
  };

  db.entries.push(newEntry);

  // Sauvegarde la base mise à jour
  saveDb(db);

  res.status(201).json({ message: "Entrée ajoutée.", entry: newEntry });
});

// GET /entries - liste des entrées avec option limite
router.get("/", (req: Request, res: Response) => {
  const db = loadDb();
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
  const entries = limit ? db.entries.slice(0, limit) : db.entries;
  res.json(entries);
});

// GET /entries/:id - récupérer une entrée par son id
router.get("/:id", (req: Request, res: Response) => {
  const db = loadDb();
  const entry = db.entries.find((e) => e.id === Number(req.params.id));
  entry ? res.json(entry) : res.sendStatus(404);
});

export default router;