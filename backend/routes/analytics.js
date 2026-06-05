const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET Dashboard Analytics
router.get('/dashboard', async (req, res) => {
  try {
    // Finance Analytics
    const financeRes = await pool.query(`
      SELECT status, COUNT(*)::int AS invoice_count, 
             COALESCE(SUM(total_amount),0)::float AS total_amount
      FROM STUDENT_INVOICES
      GROUP BY status;
    `);

    // Class Enrollment Analytics
    const classRes = await pool.query(`
      SELECT c.class_name, COUNT(e.student_id)::int AS total_students
      FROM ENROLLMENTS e
      JOIN CLASSES c ON e.class_id = c.class_id
      WHERE e.status = 'Active'
      GROUP BY c.class_name;
    `);

    // Teacher Distribution Analytics
    const teacherRes = await pool.query(`
      SELECT subject, COUNT(*)::int AS count
      FROM TEACHERS
      GROUP BY subject;
    `);

    // Attendance Analytics (last 7 days)
    const attendanceRes = await pool.query(`
      SELECT date, 
             COUNT(CASE WHEN status='Present' THEN 1 END)::int AS present,
             COUNT(CASE WHEN status='Absent' THEN 1 END)::int AS absent
      FROM ATTENDANCE
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date ASC;
    `);

    // Grades Analytics
    const gradesRes = await pool.query(`
      SELECT subject, ROUND(AVG(marks),2)::float AS average
      FROM GRADES
      GROUP BY subject;
    `);

    res.json({
      status: "success",
      data: {
        finance_analytics: financeRes.rows,
        class_analytics: classRes.rows,
        teacher_analytics: teacherRes.rows,
        attendance_analytics: attendanceRes.rows,
        grades_analytics: gradesRes.rows
      }
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
