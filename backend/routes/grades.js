// backend/routes/grades.js
import express from "express";
import pool from "../db.js";
import { broadcastUpdate } from "../index.mjs"; // import broadcast utility

const router = express.Router();

// Get all grades
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM grades ORDER BY grade_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single grade
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM grades WHERE grade_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Grade record not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create grade
router.post("/", async (req, res, next) => {
  try {
    const { student_id, class_id, grade } = req.body;
    const result = await pool.query(
      "INSERT INTO grades (student_id, class_id, grade) VALUES ($1, $2, $3) RETURNING *",
      [student_id, class_id, grade]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("grades");
  } catch (err) {
    next(err);
  }
});

// Update grade
router.put("/:id", async (req, res, next) => {
  try {
    const { student_id, class_id, grade } = req.body;
    const result = await pool.query(
      "UPDATE grades SET student_id=$1, class_id=$2, grade=$3 WHERE grade_id=$4 RETURNING *",
      [student_id, class_id, grade, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Grade record not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("grades");
  } catch (err) {
    next(err);
  }
});

// Delete grade
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM grades WHERE grade_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Grade record not found" });
    }
    res.json({ status: "success", message: "Grade record deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("grades");
  } catch (err) {
    next(err);
  }
});

export default router;
