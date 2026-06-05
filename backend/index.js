const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Neon PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// HTTP + WebSocket server
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Routes
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const classRoutes = require('./routes/classes');
const invoiceRoutes = require('./routes/invoices');
const analyticsRoutes = require('./routes/analytics');

// Mount routes
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Error handler middleware
app.use(errorHandler);

// Emit dashboard updates
async function emitDashboardUpdate() {
  try {
    const financeRes = await pool.query(`
      SELECT status, COUNT(*)::int AS invoice_count, 
             COALESCE(SUM(total_amount),0)::float AS total_amount
      FROM STUDENT_INVOICES
      GROUP BY status;
    `);

    const classRes = await pool.query(`
      SELECT c.class_name, COUNT(e.student_id)::int AS total_students
      FROM ENROLLMENTS e
      JOIN CLASSES c ON e.class_id = c.class_id
      WHERE e.status = 'Active'
      GROUP BY c.class_name;
    `);

    const teacherRes = await pool.query(`
      SELECT subject, COUNT(*)::int AS count
      FROM TEACHERS
      GROUP BY subject;
    `);

    const attendanceRes = await pool.query(`
      SELECT date, 
             COUNT(CASE WHEN status='Present' THEN 1 END)::int AS present,
             COUNT(CASE WHEN status='Absent' THEN 1 END)::int AS absent
      FROM ATTENDANCE
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC;
    `);

    const gradesRes = await pool.query(`
      SELECT subject, ROUND(AVG(marks),2)::float AS average
      FROM GRADES
      GROUP BY subject;
    `);

    io.emit("dashboard_update", {
      finance_analytics: financeRes.rows,
      class_analytics: classRes.rows,
      teacher_analytics: teacherRes.rows,
      attendance_analytics: attendanceRes.rows,
      grades_analytics: gradesRes.rows
    });
  } catch (err) {
    console.error("Emit error:", err);
  }
}

// Example: trigger emit after invoice creation
app.post('/api/v1/invoices', async (req, res) => {
  const { student_id, amount, due_date, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO STUDENT_INVOICES (student_id, total_amount, due_date, status) 
       VALUES ($1, $2, $3, $4) RETURNING invoice_id;`,
      [student_id, amount, due_date, status]
    );
    res.json({ status: "success", data: { invoice_id: result.rows[0].invoice_id } });
    emitDashboardUpdate(); // push update to dashboard
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Server start
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
