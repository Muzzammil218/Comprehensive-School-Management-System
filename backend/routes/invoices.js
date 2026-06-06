// backend/routes/invoices.js
import express from "express";
import pool from "../config/db.js";


const router = express.Router();

// Get all invoices
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM invoices ORDER BY invoice_id");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get single invoice
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM invoices WHERE invoice_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Create invoice
router.post("/", async (req, res, next) => {
  try {
    const { student_id, amount, status } = req.body;
    const result = await pool.query(
      "INSERT INTO invoices (student_id, amount, status) VALUES ($1, $2, $3) RETURNING *",
      [student_id, amount, status]
    );
    res.status(201).json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("invoices");
  } catch (err) {
    next(err);
  }
});

// Update invoice
router.put("/:id", async (req, res, next) => {
  try {
    const { student_id, amount, status } = req.body;
    const result = await pool.query(
      "UPDATE invoices SET student_id=$1, amount=$2, status=$3 WHERE invoice_id=$4 RETURNING *",
      [student_id, amount, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ status: "success", data: result.rows[0] });

    // 🔄 Trigger real-time update
    broadcastUpdate("invoices");
  } catch (err) {
    next(err);
  }
});

// Delete invoice
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("DELETE FROM invoices WHERE invoice_id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ status: "success", message: "Invoice deleted" });

    // 🔄 Trigger real-time update
    broadcastUpdate("invoices");
  } catch (err) {
    next(err);
  }
});

export default router;
