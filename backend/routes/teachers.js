// backend/routes/teachers.js
import express from "express";
import pool from "../db.js";
import { broadcastUpdate } from "../index.js"; // import broadcast utility

const router = express.Router();

// Get all teachers
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM teachers ORDER BY teacher_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single teacher
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM teachers WHERE teacher_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create teacher
router.post("/", async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, hire_date, subject } = req.body;
    const result = await pool.query(
      "INSERT INTO teachers (first_name, last_name, email, phone, hire_date, subject) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, last_name, email, phone, hire_date, subject]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("teachers");
  } catch (err) {
    next(err);
  }
});

// Update teacher
router.put("/:id", async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, hire_date, subject } = req.body;
    const result = await pool.query(
      "UPDATE teachers SET first_name=$1, last_name=$2, email=$3, phone=$4, hire_date=$5, subject=$6 WHERE teacher_id=$7 RETURNING *",
      [first_name, last_name, email, phone, hire_date, subject, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("teachers");
  } catch (err) {
    next(err);
  }
});

// Delete teacher
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM teachers WHERE teacher_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.json({ status: "success", message: "Teacher deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("teachers");
  } catch (err) {
    next(err);
  }
});

export default router;
