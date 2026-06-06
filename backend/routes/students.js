// backend/routes/students.js
import express from "express";
import pool from "../db.js";
import { broadcastUpdate } from "../index.js"; // import broadcast utility

const router = express.Router();

// Get all students
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY student_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single student
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM students WHERE student_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create student
router.post("/", async (req, res, next) => {
  try {
    const { first_name, last_name, email, contact_number, class_id } = req.body;
    const result = await pool.query(
      "INSERT INTO students (first_name, last_name, email, contact_number, class_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email, contact_number, class_id]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("students");
  } catch (err) {
    next(err);
  }
});

// Update student
router.put("/:id", async (req, res, next) => {
  try {
    const { first_name, last_name, email, contact_number, class_id } = req.body;
    const result = await pool.query(
      "UPDATE students SET first_name=$1, last_name=$2, email=$3, contact_number=$4, class_id=$5 WHERE student_id=$6 RETURNING *",
      [first_name, last_name, email, contact_number, class_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("students");
  } catch (err) {
    next(err);
  }
});

// Delete student
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM students WHERE student_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ status: "success", message: "Student deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("students");
  } catch (err) {
    next(err);
  }
});

export default router;
