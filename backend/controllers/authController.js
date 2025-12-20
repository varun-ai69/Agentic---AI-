const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../db");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function signAccessToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign(
    { sub: user.id, email: user.email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function register(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, passwordHash]
    );

    const user = result.rows[0];
    const token = signAccessToken(user);

    return res.status(201).json({ user, token });
  } catch (error) {
    if (error && error.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }

    console.error("❌ Register Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
      [email]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = {
      id: userRow.id,
      email: userRow.email,
      created_at: userRow.created_at
    };

    const token = signAccessToken(user);

    return res.json({ user, token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function me(req, res) {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("❌ Me Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { register, login, me };
