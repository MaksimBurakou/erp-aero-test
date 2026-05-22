import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    let payload;

    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const session = await prisma.session.findFirst({
      where: {
        deviceId: payload.deviceId,
        refreshToken,
        isRevoked: false,
      },
    });

    if (!session) {
      return res
        .status(401)
        .json({ message: "Refresh token already used or revoked" });
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      deviceId: payload.deviceId,
      sessionId: newSession.id,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      deviceId: payload.deviceId,
    });

    await prisma.session.create({
      data: {
        userId: payload.userId,
        deviceId: payload.deviceId,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
