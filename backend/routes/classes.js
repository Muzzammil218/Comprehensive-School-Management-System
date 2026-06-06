// backend/routes/classes.js
import express from "express";
import pool from "../config/db.js";


const router = express.Router();

// Get all classes
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM classes ORDER BY class_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single class
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM classes WHERE class_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create class
router.post("/", async (req, res, next) => {
  try {
    const { class_name, teacher_id } = req.body;
    const result = await pool.query(
      "INSERT INTO classes (class_name, teacher_id) VALUES ($1, $2) RETURNING *",
      [class_name, teacher_id]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("classes");
  } catch (err) {
    next(err);
  }
});

// Update class
router.put("/:id", async (req, res, next) => {
  try {
    const { class_name, teacher_id } = req.body;
    const result = await pool.query(
      "UPDATE classes SET class_name=$1, teacher_id=$2 WHERE class_id=$3 RETURNING *",
      [class_name, teacher_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("classes");
  } catch (err) {
    next(err);
  }
});

// Delete class
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM classes WHERE class_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ status: "success", message: "Class deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("classes");
  } catch (err) {
    next(err);
  }
});

export default router;
