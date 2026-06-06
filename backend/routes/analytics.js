// backend/routes/analytics.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Teacher distribution by subject
router.get("/teachers-by-subject", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT subject, COUNT(*) AS count FROM teachers GROUP BY subject ORDER BY subject"
    );
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Attendance summary (present vs absent)
router.get("/attendance-summary", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT status, COUNT(*) AS count FROM attendance GROUP BY status"
    );
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Average grades per class
router.get("/grades-by-class", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT class_id, AVG(grade) AS average_grade FROM grades GROUP BY class_id ORDER BY class_id"
    );
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

export default router;
