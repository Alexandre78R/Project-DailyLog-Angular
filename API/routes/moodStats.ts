import { Router, Request, Response } from "express";
import { data } from "../utils/db";

const router = Router();

// GET /mood_stats - stats générales
router.get("/", (_req: Request, res: Response) => {
  res.json(data.mood_stats);
});

// GET /mood_stats/:userId - stats pour un utilisateur donné
router.get("/:userId", (req: Request, res: Response) => {
  const stats = data.mood_stats.find((s) => s.userId === Number(req.params.userId));
  stats ? res.json(stats) : res.sendStatus(404);
});

export default router;