import path from "path";
import fs from "fs/promises";
import { prisma } from "../config/prisma.js";

export async function createFile(fileData, userId) {
  return prisma.file.create({
    data: {
      originalName: fileData.originalname,
      storedName: fileData.filename,
      extension: path.extname(fileData.originalname),
      mimeType: fileData.mimetype,
      size: fileData.size,
      path: fileData.path,
      userId,
    },
  });
}

export async function getFiles(userId, page, listSize) {
  const skip = (page - 1) * listSize;

  return prisma.file.findMany({
    where: {
      userId,
    },
    skip,
    take: listSize,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getFile(id) {
  return prisma.file.findUnique({
    where: {
      id,
    },
  });
}

export async function removeFile(id) {
  const file = await prisma.file.findUnique({
    where: {
      id,
    },
  });

  if (!file) {
    throw {
      status: 404,
      message: "File not found",
    };
  }

  try {
    await fs.unlink(file.path);
  } catch (err) {
    console.error("Failed to delete file:", err);
  }

  await prisma.file.delete({
    where: {
      id,
    },
  });

  return true;
}

export async function replaceFile(id, fileData) {
  const existingFile = await prisma.file.findUnique({
    where: {
      id,
    },
  });

  if (!existingFile) {
    throw {
      status: 404,
      message: "File not found",
    };
  }

  try {
    await fs.unlink(existingFile.path);
  } catch (err) {
    console.error("Failed to delete old file:", err);
  }

  return prisma.file.update({
    where: {
      id,
    },

    data: {
      originalName: fileData.originalname,
      storedName: fileData.filename,
      extension: path.extname(fileData.originalname),
      mimeType: fileData.mimetype,
      size: fileData.size,
      path: fileData.path,
    },
  });
}
