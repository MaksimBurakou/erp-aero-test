import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const session = await prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        isRevoked: false,
      },
    });

    if (!session) {
      return res.status(401).json({ message: "Session expired or logged out" });
    }

    req.user = { userId: payload.userId, deviceId: payload.deviceId };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
