const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Global CORS bypass taake frontend components hit kar sakein

// Neon Serverless Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Default Root Diagnostics
app.get('/', (req, res) => {
    res.json({ status: "Online", message: "Core Intel Network Engine Connected." });
});

// 📊 1. DYNAMIC ANALYTICS ROUTE (For Dashboard Charts)
app.get('/api/v1/analytics/dashboard', async (req, res) => {
    try {
        const financeRes = await pool.query(`
            SELECT status, 
                   COUNT(*)::int as invoice_count, 
                   COALESCE(SUM(total_amount), 0)::float as total_amount 
            FROM STUDENT_INVOICES 
            GROUP BY status;
        `);

        const classRes = await pool.query(`
            SELECT c.class_name, COUNT(e.student_id)::int as total_students 
            FROM ENROLLMENTS e 
            JOIN CLASSES c ON e.class_id = c.class_id 
            WHERE e.status = 'Active' 
            GROUP BY c.class_name;
        `);

        res.json({
            status: "success",
            data: {
                finance_analytics: financeRes.rows,
                class_analytics: classRes.rows
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 🎒 2. DROP-DOWN ROUTE (Fetch Classes for Admission Form Mapping)
app.get('/api/v1/classes', async (req, res) => {
    try {
        const result = await pool.query("SELECT class_id, class_name, room_number FROM CLASSES ORDER BY class_name;");
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 📝 3. INGESTION ROUTE: REGISTER STUDENT
app.post('/api/v1/students', async (req, res) => {
    const { first_name, last_name, email, phone, class_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO STUDENTS (first_name, last_name, email, phone, class_id) 
             VALUES ($1, $2, $3, $4, $5) RETURNING student_id;`,
            [first_name, last_name, email, phone, class_id]
        );
        res.json({ status: "success", data: { student_id: result.rows[0].student_id } });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 👩‍🏫 4. INGESTION ROUTE: REGISTER FACULTY
app.post('/api/v1/teachers', async (req, res) => {
    const { first_name, last_name, email, phone, hire_date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO TEACHERS (first_name, last_name, email, phone, hire_date) 
             VALUES ($1, $2, $3, $4, $5) RETURNING teacher_id;`,
            [first_name, last_name, email, phone, hire_date]
        );
        res.json({ status: "success", data: { teacher_id: result.rows[0].teacher_id } });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 💰 5. INGESTION ROUTE: GENERATE FEE INVOICE
app.post('/api/v1/invoices', async (req, res) => {
    const { student_id, amount, due_date, status } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO STUDENT_INVOICES (student_id, total_amount, due_date, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING invoice_id;`,
            [student_id, amount, due_date, status]
        );
        res.json({ status: "success", data: { invoice_id: result.rows[0].invoice_id } });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Node.js Core Network Active on Port ${PORT}`));