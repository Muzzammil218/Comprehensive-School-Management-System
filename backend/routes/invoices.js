const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const emitDashboardUpdate = require('../utils/realtime'); // no curly braces

// Create invoice
router.post('/', async (req, res) => {
  const { student_id, total_amount, due_date, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO STUDENT_INVOICES (student_id,total_amount,due_date,status)
       VALUES ($1,$2,$3,$4) RETURNING invoice_id;`,
      [student_id, total_amount, due_date, status]
    );
    res.json({ status: "success", data: result.rows[0] });

    // push update to dashboard
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Read all invoices
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM STUDENT_INVOICES;`);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { total_amount, due_date, status } = req.body;
  try {
    await pool.query(
      `UPDATE STUDENT_INVOICES SET total_amount=$1,due_date=$2,status=$3 WHERE invoice_id=$4;`,
      [total_amount, due_date, status, id]
    );
    res.json({ status: "success" });

    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM STUDENT_INVOICES WHERE invoice_id=$1;`, [req.params.id]);
    res.json({ status: "success" });

    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
