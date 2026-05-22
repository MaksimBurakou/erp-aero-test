import { isValidLogin } from "../utils/validation.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
} from "../services/auth.service.js";

export async function signup(req, res) {
  try {
    const { id, password } = req.body;
    if (!id || !password)
      return res
        .status(400)
        .json({ message: "Email/phone and password are required" });
    if (!isValidLogin(id))
      return res.status(400).json({ message: "Invalid email or phone format" });

    const tokens = await registerUser(id, password);
    return res.status(201).json(tokens);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
}

export async function signin(req, res) {
  try {
    const { id, password } = req.body;
    if (!id || !password)
      return res
        .status(400)
        .json({ message: "Email/phone and password are required" });

    const tokens = await loginUser(id, password);
    return res.json(tokens);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    await logoutUser(req.user.deviceId);
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function info(req, res) {
  try {
    const data = await getUserInfo(req.user.userId);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
