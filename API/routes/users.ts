import { Router, Request, Response } from "express";
import { loadDb, User } from "../utils/db";

const router = Router();

// GET /users - liste de tous les utilisateurs
router.get("/", (_req: Request, res: Response) => {
  const db = loadDb();
  res.json(db.users);
});

// GET /users/:id - récupérer un utilisateur par son id
router.get("/:id", (req: Request, res: Response) => {
  const db = loadDb();
  const user = db.users.find((u) => u.id === Number(req.params.id));
  user ? res.json(user) : res.sendStatus(404);
});

export default router;