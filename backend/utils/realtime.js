// backend/utils/realtime.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function emitDashboardUpdate(io) {
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
    console.error("Realtime emit error:", err);
  }
}

module.exports = emitDashboardUpdate;
