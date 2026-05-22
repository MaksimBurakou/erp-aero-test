import {
  createFile,
  getFiles,
  getFile,
  removeFile,
  replaceFile,
} from "../services/file.service.js";

export async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const file = await createFile(req.file, req.user.userId);

    return res.status(201).json(file);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getFileList(req, res) {
  try {
    const page = Number(req.query.page) || 1;

    const listSize = Number(req.query.list_size) || 10;

    const files = await getFiles(req.user.userId, page, listSize);

    return res.json(files);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getFileById(req, res) {
  try {
    const file = await getFile(Number(req.params.id));

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.json(file);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function downloadFile(req, res) {
  try {
    const file = await getFile(Number(req.params.id));

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    return res.download(file.path, file.originalName);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteFile(req, res) {
  try {
    await removeFile(Number(req.params.id));

    return res.json({
      message: "File deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
}

export async function updateFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const updatedFile = await replaceFile(Number(req.params.id), req.file);

    return res.json(updatedFile);
  } catch (err) {
    console.error(err);

    return res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
}
