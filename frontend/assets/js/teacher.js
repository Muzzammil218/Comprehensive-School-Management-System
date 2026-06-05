const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const emitDashboardUpdate = require("../utils/realtime");

// Create teacher
router.post("/", async (req, res) => {
  const { first_name, last_name, email, phone, hire_date, subject } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO TEACHERS (first_name, last_name, email, phone, hire_date, subject)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [first_name, last_name, email, phone, hire_date, subject]
    );
    res.json({ status: "success", data: result.rows[0] });

    // Push update to dashboard
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Read all teachers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM TEACHERS;`);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Update teacher
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, hire_date, subject } = req.body;
  try {
    await pool.query(
      `UPDATE TEACHERS 
       SET first_name=$1, last_name=$2, email=$3, phone=$4, hire_date=$5, subject=$6 
       WHERE teacher_id=$7;`,
      [first_name, last_name, email, phone, hire_date, subject, id]
    );
    res.json({ status: "success" });

    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete teacher
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM TEACHERS WHERE teacher_id=$1;`, [req.params.id]);
    res.json({ status: "success" });

    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
