import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/prisma.js";
import { generateAccessToken, generateRefreshToken } from "./token.service.js";

const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

async function createSession(userId) {
  const deviceId = uuidv4();

  const session = await prisma.session.create({
    data: {
      userId,
      deviceId,
      refreshToken: "",
      expiresAt: new Date(Date.now() + SESSION_TTL),
    },
  });

  const accessToken = generateAccessToken({
    userId,
    deviceId,
    sessionId: session.id,
  });

  const refreshToken = generateRefreshToken({
    userId,
    deviceId,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken, deviceId };
}

export async function registerUser(id, password) {
  const existingUser = await prisma.user.findUnique({ where: { login: id } });

  if (existingUser) throw { status: 400, message: "User already exists" };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { login: id, passwordHash } });

  return createSession(user.id);
}

export async function loginUser(id, password) {
  const user = await prisma.user.findUnique({ where: { login: id } });

  if (!user) throw { status: 401, message: "Invalid credentials" };

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) throw { status: 401, message: "Invalid credentials" };

  return createSession(user.id);
}

export async function logoutUser(deviceId) {
  await prisma.session.updateMany({
    where: { deviceId, isRevoked: false },
    data: { isRevoked: true },
  });
}

export async function getUserInfo(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return { id: user.login };
}
