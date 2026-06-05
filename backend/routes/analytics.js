const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Dashboard analytics route
router.get("/", async (req, res) => {
  try {
    // Finance analytics (invoice status counts)
    const financeResult = await pool.query(
      `SELECT status, COUNT(*) AS invoice_count 
       FROM INVOICES GROUP BY status;`
    );

    // Students per class
    const classResult = await pool.query(
      `SELECT c.class_name, COUNT(s.student_id) AS total_students
       FROM CLASSES c
       LEFT JOIN STUDENTS s ON c.class_id = s.class_id
       GROUP BY c.class_name;`
    );

    // Teachers per subject
    const teacherResult = await pool.query(
      `SELECT subject, COUNT(*) AS count 
       FROM TEACHERS GROUP BY subject;`
    );

    // Attendance (last 7 days)
    const attendanceResult = await pool.query(
      `SELECT date, SUM(CASE WHEN status='present' THEN 1 ELSE 0 END) AS present
       FROM ATTENDANCE
       WHERE date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY date ORDER BY date;`
    );

    // Grades per subject (average)
    const gradesResult = await pool.query(
      `SELECT subject, AVG(grade) AS average
       FROM GRADES GROUP BY subject;`
    );

    res.json({
      status: "success",
      data: {
        finance_analytics: financeResult.rows,
        class_analytics: classResult.rows,
        teacher_analytics: teacherResult.rows,
        attendance_analytics: attendanceResult.rows,
        grades_analytics: gradesResult.rows
      }
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
