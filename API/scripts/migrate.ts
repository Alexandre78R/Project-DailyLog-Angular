import fs from "fs";
import path from "path";
import readline from "readline";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const defaultDataPath = path.join(__dirname, "../data/default-data.json");

interface RawUser {
  email: string;
  password: string;
  name: string;
}

interface RawEntry {
  userId: number;
  date: string;
  title: string;
  content: string;
  mood: "happy" | "neutral" | "sad";
  createdAt?: string;
}

interface RawData {
  users: RawUser[];
  entries?: RawEntry[];
}

async function seedPrisma() {
  const rawData: RawData = JSON.parse(fs.readFileSync(defaultDataPath, "utf-8"));

  console.log("🚀 Début du seed dans la base Prisma...");

  // Nettoyage (optionnel selon tes besoins)
  await prisma.entry.deleteMany();
  await prisma.user.deleteMany();

  // Crée les utilisateurs
  for (const user of rawData.users) {
    const hashedPassword = await argon2.hash(user.password);

    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
      },
    });
  }

  // Récupère les utilisateurs avec leurs ID générés
  const usersInDb = await prisma.user.findMany();

  // Crée les entrées
  for (const entry of rawData.entries || []) {
    const userExists = usersInDb.find((u) => u.id === entry.userId);
    if (!userExists) continue;

    await prisma.entry.create({
      data: {
        userId: entry.userId,
        date: entry.date,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        createdAt: entry.createdAt ? new Date(entry.createdAt) : undefined,
      },
    });
  }

  console.log("✅ Données insérées dans Prisma avec succès !");
  await prisma.$disconnect();
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("⚠️ Ceci va réinitialiser la base de données. Continuer ? (yes/no) ", async (answer) => {
    if (answer.toLowerCase() === "yes") {
      await seedPrisma();
    } else {
      console.log("❌ Opération annulée.");
    }
    rl.close();
  });
}

main();