const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const emitDashboardUpdate = require("../utils/realtime");

// Create invoice
router.post("/", async (req, res) => {
  const { student_id, amount, status, due_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO INVOICES (student_id, amount, status, due_date)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [student_id, amount, status, due_date]
    );
    res.json({ status: "success", data: result.rows[0] });
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Read all invoices
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM INVOICES;`);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Update invoice
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { student_id, amount, status, due_date } = req.body;
  try {
    await pool.query(
      `UPDATE INVOICES 
       SET student_id=$1, amount=$2, status=$3, due_date=$4 
       WHERE invoice_id=$5;`,
      [student_id, amount, status, due_date, id]
    );
    res.json({ status: "success" });
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM INVOICES WHERE invoice_id=$1;`, [req.params.id]);
    res.json({ status: "success" });
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
