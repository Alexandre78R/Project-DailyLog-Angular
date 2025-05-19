import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../data/db.json");

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Entry {
  id: number;
  userId: number;
  date: string;
  title: string;
  content: string;
  mood: "happy" | "neutral" | "sad";
  createdAt: string;
}

export interface MoodStats {
  userId: number;
  month: string;
  totalEntries: number;
  moods: {
    happy: number;
    neutral: number;
    sad: number;
  };
}

interface Db {
  users: User[];
  entries: Entry[];
  mood_stats: MoodStats[];
}

export let data: Db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

export function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Génère un nouvel id unique pour un tableau d'éléments avec propriété id
export function generateId<T extends { id: number }>(array: T[]): number {
  return array.length ? Math.max(...array.map((item) => item.id)) + 1 : 1;
}