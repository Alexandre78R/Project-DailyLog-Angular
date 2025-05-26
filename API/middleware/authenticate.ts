import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  console.log("authHeader -->", authHeader)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token manquant" });
    return;
  }
  console.log("secret", SECRET)

  try {
    const payload = jwt.verify(token, SECRET) as { id: number; email: string };
    console.log("payload", payload)
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.log("err", err)
    res.status(401).json({ message: "Token invalide" });
    return;
  }
}