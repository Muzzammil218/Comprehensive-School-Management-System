const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const result = await pool.query(`SELECT * FROM users WHERE username=$1;`, [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password with stored hash
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ status: "success", token, role: user.role });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
