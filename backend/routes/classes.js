const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Create class
router.post('/', async (req, res) => {
  const { class_name, room_number } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO CLASSES (class_name, room_number) VALUES ($1,$2) RETURNING class_id;`,
      [class_name, room_number]
    );
    res.json({ status: "success", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Read all classes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM CLASSES;`);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Update class
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { class_name, room_number } = req.body;
  try {
    await pool.query(
      `UPDATE CLASSES SET class_name=$1, room_number=$2 WHERE class_id=$3;`,
      [class_name, room_number, id]
    );
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM CLASSES WHERE class_id=$1;`, [req.params.id]);
    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
