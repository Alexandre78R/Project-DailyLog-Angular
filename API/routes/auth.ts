import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loadDb, saveDb, generateId, User } from "../utils/db";
import argon2 from "argon2";

const router = Router();
const SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/register", async (req: Request, res: Response) => {
  console.log("req.body", req.body);

  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ message: "Aucune donnée reçue. Assurez-vous d’envoyer un JSON valide." });
    return;
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: "Champs requis manquants." });
    return;
  }

  const db = loadDb();

  if (db.users.some((u) => u.email === email)) {
    res.status(409).json({ message: "Email déjà utilisé." });
    return;
  }

  const hashedPassword = await argon2.hash(password);

  const newUser: User = {
    id: generateId(db.users),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const payload = { id: newUser.id, email: newUser.email };
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });

  res.status(201).json({ token, userId: newUser.id });
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("req.body", req.body);

  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ message: "Aucune donnée reçue. Assurez-vous d’envoyer un JSON valide." });
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Champs requis manquants." });
    return;
  }

  const db = loadDb();
  const user = db.users.find((u) => u.email === email);

  if (!user) {
    res.status(401).json({ message: "Identifiants invalides." });
    return;
  }

  const passwordMatch = await argon2.verify(user.password, password);

  if (!passwordMatch) {
    res.status(401).json({ message: "Identifiants invalides." });
    return;
  }

  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });

  res.json({ token, userId: user.id });
});

export default router;