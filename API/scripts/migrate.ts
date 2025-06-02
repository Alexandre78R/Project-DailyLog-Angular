import fs from "fs";
import path from "path";
import readline from "readline";
import argon2 from "argon2";
import { User, Entry, generateId } from "../utils/db";

const defaultDataPath = path.join(__dirname, "../data/default-data.json");
const outputPath = path.join(__dirname, "../data/db.json");

interface RawUser {
  email: string;
  password: string;
  name: string;
}

interface RawEntry extends Omit<Entry, "id" | "createdAt"> {
  id?: number;
  createdAt?: string;
}

interface RawData {
  users: RawUser[];
  entries?: RawEntry[];
}

async function prepareDb(): Promise<{
  users: User[];
  entries: Entry[];
}> {
  const rawData: RawData = JSON.parse(fs.readFileSync(defaultDataPath, "utf-8"));

  const users: User[] = await Promise.all(
    rawData.users.map(async (user, index) => ({
      id: index + 1,
      email: user.email,
      password: await argon2.hash(user.password),
      name: user.name,
      createdAt: new Date().toISOString(),
    }))
  );

  const entries: Entry[] = (rawData.entries || []).map((entry, index) => ({
    id: entry.id ?? index + 101,
    userId: entry.userId,
    date: entry.date,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    createdAt: entry.createdAt ?? new Date().toISOString(),
  }));

  return { users, entries };
}

async function confirmAndWrite() {
  const newDb = await prepareDb();
  fs.writeFileSync(outputPath, JSON.stringify(newDb, null, 2));
  console.log("✅ db.json généré avec succès !");
}

async function main() {
  if (fs.existsSync(outputPath)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("⚠️ db.json existe déjà. Réinitialiser ? (yes/no) ", async (answer) => {
      if (answer.toLowerCase() === "yes") {
        await confirmAndWrite();
      } else {
        console.log("❌ Opération annulée.");
      }
      rl.close();
    });
  } else {
    await confirmAndWrite();
  }
}

main();