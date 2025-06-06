import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authenticate";
import { PrismaClient } from "@prisma/client";

import express from "express";
const router: express.Router = Router();
const prisma = new PrismaClient();

// Fonction pour regrouper les entrées par mois et humeur
function groupEntriesByMonth(entries: any[]) {
  const statsMap: Record<string, { totalEntries: number; moods: Record<string, number> }> = {};

  entries.forEach(entry => {
    const month = entry.date.slice(0, 7); // YYYY-MM
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

// Fonction pour regrouper les entrées par jour et humeur
function groupEntriesByDay(entries: any[]) {
  const statsMap: Record<string, Record<string, number>> = {};

  entries.forEach(entry => {
    const date = entry.date.slice(0, 10); // YYYY-MM-DD
    const mood = entry.mood || "neutral";

    if (!statsMap[date]) {
      statsMap[date] = {};
    }
    statsMap[date][mood] = (statsMap[date][mood] || 0) + 1;
  });

  return Object.entries(statsMap).map(([date, moods]) => ({
    date,
    moods,
  }));
}

// GET /api/mood_stats?month=YYYY-MM
router.get("/", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);
  const month = req.query.month as string;

  try {
    const userEntries = await prisma.entry.findMany({
      where: { userId },
      select: { date: true, mood: true }
    });

    if (!userEntries.length) {
      res.status(404).json({ message: "No entries found for this user." });
      return;
    }

    const transformed = userEntries.map(entry => ({
      date: new Date(entry.date).toISOString(),
      mood: entry.mood,
    }));

    const filteredEntries = month
      ? transformed.filter(entry => entry.date.slice(0, 7) === month)
      : transformed;

    const moodStats = groupEntriesByMonth(filteredEntries);
    res.json({ userId, moodStats });
  } catch (error) {
    console.error("Error fetching mood stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/mood_stats/daily?month=YYYY-MM
router.get("/daily", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = Number(req.user?.id);
  const month = req.query.month as string;

  try {
    const userEntries = await prisma.entry.findMany({
      where: { userId },
      select: { date: true, mood: true }
    });

    if (!userEntries.length) {
      res.status(404).json({ message: "No entries found for this user." });
      return;
    }

    const transformed = userEntries.map(entry => ({
      date: new Date(entry.date).toISOString(),
      mood: entry.mood,
    }));

    const filteredEntries = month
      ? transformed.filter(entry => entry.date.slice(0, 7) === month)
      : transformed;

    const moodStats = groupEntriesByDay(filteredEntries);
    res.json({ userId, moodStats });
  } catch (error) {
    console.error("Error fetching mood stats (daily):", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;