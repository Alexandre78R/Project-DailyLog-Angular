import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authenticate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// POST /entries - création d'une nouvelle entrée
router.post("/", authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
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

    const newEntry = await prisma.entry.create({
      data: {
        userId,
        date,
        title,
        content,
        mood,
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: "Entrée ajoutée.", entry: newEntry });
  } catch (error) {
    next(error);
  }
});

// GET /entries - liste des entrées avec option limite
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const entries = await prisma.entry.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    res.json(entries);
  } catch (error) {
    next(error);
  }
});

// GET /entries/user - liste paginée des entrées de l'utilisateur
router.get('/user', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const limit = parseInt(req.query.limit as string, 10) || 10;
    const page = parseInt(req.query.page as string, 10) || 1;
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      prisma.entry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.entry.count({ where: { userId } }),
    ]);

    res.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// GET /entries/user/archive - filtres avancés pour un utilisateur
router.get('/user/archive', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const { mood, search, fromDate, toDate } = req.query;

    // Construction dynamique des filtres Prisma
    const filters: any = { userId };

    if (mood && typeof mood === "string") {
      filters.mood = mood;
    }

    if (search && typeof search === "string") {
      filters.OR = [
        // { title: { contains: search, mode: "insensitive" } },
        // { content: { contains: search, mode: "insensitive" } },
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (fromDate && typeof fromDate === "string") {
      filters.date = { ...filters.date, gte: fromDate };
    }

    if (toDate && typeof toDate === "string") {
      filters.date = { ...filters.date, lte: toDate };
    }

    const [entries, total] = await Promise.all([
      prisma.entry.findMany({
        where: filters,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.entry.count({ where: filters }),
    ]);

    res.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// GET /entries/:id - récupérer une entrée par son id
router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) res.status(400).json({ message: "ID invalide." });

    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) res.status(404).json({ message: "Entrée non trouvée." });

    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// DELETE /entries/:id - supprimer une entrée par son id (authentifié)
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = parseInt(req.params.id, 10);

    if (!userId) res.status(401).json({ message: "Utilisateur non authentifié." });
    if (isNaN(id)) res.status(400).json({ message: "ID invalide." });

    // Vérifier que l'entrée appartient à l'utilisateur
    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry || entry.userId !== userId) {
      res.status(404).json({ message: "Entrée non trouvée ou non autorisée." });
      return;
    }

    await prisma.entry.delete({ where: { id } });
    res.json({ message: "Entrée supprimée." });
  } catch (error) {
    next(error);
  }
});

// PUT /entries/:id - mettre à jour une entrée existante
router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = parseInt(req.params.id, 10);
    const { date, title, content, mood } = req.body;

    if (!userId) res.status(401).json({ message: "Utilisateur non authentifié." });
    if (isNaN(id)) res.status(400).json({ message: "ID invalide." });
    if (!date || !title || !content || !mood) {
      res.status(400).json({ message: "Champs requis manquants." });
      return;
    }

    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry || entry.userId !== userId) {
      res.status(404).json({ message: "Entrée non trouvée ou non autorisée." });
      return;
    }

    const updatedEntry = await prisma.entry.update({
      where: { id },
      data: { date, title, content, mood },
    });

    res.json({ message: "Entrée mise à jour.", entry: updatedEntry });
  } catch (error) {
    next(error);
  }
});

export default router;