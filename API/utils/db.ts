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

interface Db {
  users: User[];
  entries: Entry[];
}

// ✅ Toujours charger dynamiquement la dernière version
export function loadDb(): Db {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

// ✅ Sauvegarde explicite (à utiliser avec `loadDb`)
export function saveDb(data: Db) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ✅ Génère un nouvel ID unique
export function generateId<T extends { id: number }>(array: T[]): number {
  return array.length ? Math.max(...array.map((item) => item.id)) + 1 : 1;
}