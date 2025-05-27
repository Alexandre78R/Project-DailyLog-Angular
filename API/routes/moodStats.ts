// routes/moodStats.ts
import { Router, Request, Response } from "express";
import { loadDb } from "../utils/db";
import { authenticateToken, AuthRequest } from "../middleware/authenticate";

import express from "express";
const router: express.Router = Router();

// Fonction utilitaire pour regrouper les entrées par mois et humeur
function groupEntriesByMonth(entries: any[]) {
  const statsMap: Record<string, { totalEntries: number; moods: Record<string, number> }> = {};

  entries.forEach(entry => {
    const month = entry.date.slice(0, 7); // Format "YYYY-MM"
    if (!statsMap[month]) {
      statsMap[month] = { totalEntries: 0, moods: {} };
    }

    statsMap[month].totalEntries++;
    const mood = entry.mood || "neutral";
    statsMap[month].moods[mood] = (statsMap[month].moods[mood] || 0) + 1;
  });

  return Object.entries(statsMap).map(([month, data]) => ({
    month,
    totalEntries: data.totalEntries,
    moods: data.moods,
  }));
}

// GET /api/mood_stats
router.get("/", authenticateToken, (req: AuthRequest, res: Response): void => {
  const db = loadDb();
  const userId = Number(req.user?.id);

  const userEntries = db.entries.filter(entry => entry.userId === userId);

  if (!userEntries.length) {
    res.status(404).json({ message: "No entries found for this user." });
    return;
  }

  const moodStats = groupEntriesByMonth(userEntries);

  res.json({ userId, moodStats });
});

export default router;