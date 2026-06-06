// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Validate role
    const validRoles = ["admin", "teacher", "student"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ status: "error", message: "Invalid role" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, role]
    );

    res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ status: "success", token });
  } catch (err) {
    next(err);
  }
});

export default router;
