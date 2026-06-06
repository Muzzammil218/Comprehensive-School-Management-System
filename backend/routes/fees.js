// backend/routes/fees.js
import express from "express";
import pool from "../db.js";
import { broadcastUpdate } from "../index.js"; // import broadcast utility

const router = express.Router();

// Get all fee records (invoices table)
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM invoices ORDER BY invoice_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single fee record
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM invoices WHERE invoice_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Fee record not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create fee record
router.post("/", async (req, res, next) => {
  try {
    const { student_id, amount, status } = req.body;
    const result = await pool.query(
      "INSERT INTO invoices (student_id, amount, status) VALUES ($1, $2, $3) RETURNING *",
      [student_id, amount, status]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("fees");
  } catch (err) {
    next(err);
  }
});

// Update fee record
router.put("/:id", async (req, res, next) => {
  try {
    const { student_id, amount, status } = req.body;
    const result = await pool.query(
      "UPDATE invoices SET student_id=$1, amount=$2, status=$3 WHERE invoice_id=$4 RETURNING *",
      [student_id, amount, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Fee record not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("fees");
  } catch (err) {
    next(err);
  }
});

// Delete fee record
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM invoices WHERE invoice_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Fee record not found" });
    }
    res.json({ status: "success", message: "Fee record deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("fees");
  } catch (err) {
    next(err);
  }
});

export default router;
