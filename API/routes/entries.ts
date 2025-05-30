import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authenticate";
import { Entry, generateId, loadDb, saveDb } from "../utils/db";

const router = Router();

// POST /entries - création d'une nouvelle entrée
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

// GET /entries/user - liste des entrées d'un utilisateur avec option limite
router.get('/user', authenticateToken, (req: AuthRequest, res: Response): void => {
  
  const userId = req.user?.id;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const page = parseInt(req.query.page as string, 10) || 1;
  const offset = (page - 1) * limit;
  
  if (!userId) {
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }
  
  const db = loadDb();
  
  const userEntries = db.entries
  .filter((entry) => entry.userId === userId)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const paginatedEntries = userEntries.slice(offset, offset + limit);
  
  res.json({
    entries: paginatedEntries,
    total: userEntries.length,
    page,
    totalPages: Math.ceil(userEntries.length / limit),
  });
  
  return;
});

// GET /entries//user/archive - entrées filtrées par utilisateur
router.get('/user/archive', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { page = '1', limit = '10', mood, search, fromDate, toDate } = req.query;

  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }

  const db = loadDb();
  let entries = db.entries.filter(e => e.userId === userId);

  // Filtrage par mot-clé (dans le titre ou le contenu)
  if (search && typeof search === 'string') {
    const keyword = search.toLowerCase();
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(keyword) ||
      e.content.toLowerCase().includes(keyword)
    );
  }

  // Filtrage par humeur
  if (mood && typeof mood === 'string') {
    entries = entries.filter(e => e.mood === mood);
  }

  // Filtrage par plage de dates
  if (fromDate && typeof fromDate === 'string') {
    entries = entries.filter(e => new Date(e.date) >= new Date(fromDate));
  }
  
  if (toDate && typeof toDate === 'string') {
    entries = entries.filter(e => new Date(e.date) <= new Date(toDate));
  }

  // Tri décroissant
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  const paginatedEntries = entries.slice(offset, offset + limitNum);

  res.json({
    entries: paginatedEntries,
    total: entries.length,
    page: pageNum,
    totalPages: Math.ceil(entries.length / limitNum),
  });
});

// GET /entries/:id - récupérer une entrée par son id
router.get("/:id", (req: Request, res: Response) => {
  const db = loadDb();
  const entry = db.entries.find((e) => e.id === Number(req.params.id));
  entry ? res.json(entry) : res.sendStatus(404);
});

// DELETE /entries/:id - supprimer une entrée par son id (authentifié)
router.delete("/:id", authenticateToken, (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const entryId = Number(req.params.id);

  const db = loadDb();
  const entryIndex = db.entries.findIndex(e => e.id === entryId && e.userId === userId);

  if (entryIndex === -1) {
    res.status(404).json({ message: "Entrée non trouvée ou non autorisée." });
    return;
  }

  db.entries.splice(entryIndex, 1);
  saveDb(db);

  res.json({ message: "Entrée supprimée." });
});

// PUT /entries/:id - mettre à jour une entrée existante
router.put("/:id", authenticateToken, (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const entryId = Number(req.params.id);
  const { date, title, content, mood } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Utilisateur non authentifié." });
    return;
  }

  if (!date || !title || !content || !mood) {
    res.status(400).json({ message: "Champs requis manquants." });
    return;
  }

  const db = loadDb();
  const entry = db.entries.find(e => e.id === entryId && e.userId === userId);

  if (!entry) {
    res.status(404).json({ message: "Entrée non trouvée ou non autorisée." });
    return;
  }

  entry.date = date;
  entry.title = title;
  entry.content = content;
  entry.mood = mood;

  saveDb(db);

  res.json({ message: "Entrée mise à jour.", entry });
});

export default router;