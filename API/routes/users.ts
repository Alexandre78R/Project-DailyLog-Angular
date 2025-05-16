import { Router, Request, Response } from "express";
import { data, User } from "../utils/db";

const router = Router();

// GET /users - liste de tous les utilisateurs
router.get("/", (_req: Request, res: Response) => {
  res.json(data.users);
});

// GET /users/:id - récupérer un utilisateur par son id
router.get("/:id", (req: Request, res: Response) => {
  const user = data.users.find((u) => u.id === Number(req.params.id));
  user ? res.json(user) : res.sendStatus(404);
});

export default router;