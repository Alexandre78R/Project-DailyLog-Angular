import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /users - liste de tous les utilisateurs
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/:id - récupérer un utilisateur par son id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    user ? res.json(user) : res.sendStatus(404);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /users/name/:id - récupérer le nom d'un utilisateur
router.get("/name/:id", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true },
    });

    user ? res.json({ name: user.name }) : res.sendStatus(404);
  } catch (error) {
    console.error("Error fetching user name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;