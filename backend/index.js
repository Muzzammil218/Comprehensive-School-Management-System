// backend/index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// API Routes
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const classRoutes = require("./routes/classes");
const invoiceRoutes = require("./routes/invoices");
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to req for realtime emits
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Static assets
app.use("/assets", express.static(path.join(__dirname, "../frontend/assets")));

// View engine setup
app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

// Frontend routes
app.get("/", (req, res) => res.render("index", { title: "Cyberpunk School Management" }));
app.get("/dashboard", (req, res) => res.render("dashboard", { title: "Admin Dashboard" }));
app.get("/students", (req, res) => res.render("students", { title: "Manage Students" }));
app.get("/teachers", (req, res) => res.render("teachers", { title: "Manage Teachers" }));
app.get("/classes", (req, res) => res.render("classes", { title: "Manage Classes" }));
app.get("/invoices", (req, res) => res.render("invoices", { title: "Manage Invoices" }));
app.get("/fee", (req, res) => res.render("fee", { title: "Manage Fees" }));
app.get("/admin", (req, res) => res.render("admin", { title: "Manage Admins" }));
app.get("/login", (req, res) => res.render("login", { title: "Admin Login" }));
app.get("/register", (req, res) => res.render("register", { title: "Admin Registration" }));

// API routes
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
