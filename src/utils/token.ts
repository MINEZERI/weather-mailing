import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret";

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
