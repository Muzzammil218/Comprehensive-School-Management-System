// backend/index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

// Routes
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
    origin: "*", // adjust for frontend domain in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req for realtime emits
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
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
