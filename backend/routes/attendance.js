// backend/routes/attendance.js
import express from "express";
import pool from "../config/db.js";


const router = express.Router();

// Get all attendance records
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM attendance ORDER BY attendance_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single attendance record
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM attendance WHERE attendance_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create attendance record
router.post("/", async (req, res, next) => {
  try {
    const { student_id, date, status } = req.body;
    const result = await pool.query(
      "INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, $3) RETURNING *",
      [student_id, date, status]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("attendance");
  } catch (err) {
    next(err);
  }
});

// Update attendance record
router.put("/:id", async (req, res, next) => {
  try {
    const { student_id, date, status } = req.body;
    const result = await pool.query(
      "UPDATE attendance SET student_id=$1, date=$2, status=$3 WHERE attendance_id=$4 RETURNING *",
      [student_id, date, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("attendance");
  } catch (err) {
    next(err);
  }
});

// Delete attendance record
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM attendance WHERE attendance_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    res.json({ status: "success", message: "Attendance record deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("attendance");
  } catch (err) {
    next(err);
  }
});

export default router;
