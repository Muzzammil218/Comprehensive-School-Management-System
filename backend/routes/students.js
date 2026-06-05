const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const emitDashboardUpdate = require("../utils/realtime");

// Create student
router.post("/", async (req, res) => {
  const { first_name, last_name, email, contact_number, class_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO STUDENTS (first_name, last_name, email, contact_number, class_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [first_name, last_name, email, contact_number, class_id]
    );
    res.json({ status: "success", data: result.rows[0] });
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Read all students
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM STUDENTS;`);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, contact_number, class_id } = req.body;
  try {
    await pool.query(
      `UPDATE STUDENTS SET first_name=$1, last_name=$2, email=$3, contact_number=$4, class_id=$5 WHERE student_id=$6;`,
      [first_name, last_name, email, contact_number, class_id, id]
    );
    res.json({ status: "success" });
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM STUDENTS WHERE student_id=$1;`, [req.params.id]);
    res.json({ status: "success" });
    emitDashboardUpdate(req.io);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
