import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { prisma } from "../prisma/client";

const router = Router();
const SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Champs requis manquants." });
      return
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email déjà utilisé." });
      return;
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, userId: user.id });
    
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Champs requis manquants." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await argon2.verify(user.password, password))) {
      res.status(401).json({ message: "Identifiants invalides." });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user.id });

  } catch (err) {
    next(err);
  }
});

export default router;