// backend/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import studentsRouter from "./routes/students.js";
import teachersRouter from "./routes/teachers.js";
import invoicesRouter from "./routes/invoices.js";
import classesRouter from "./routes/classes.js";
import feesRouter from "./routes/fees.js";
import attendanceRouter from "./routes/attendance.js";
import gradesRouter from "./routes/grades.js";
import analyticsRouter from "./routes/analytics.js";
import authRouter from "./routes/auth.js";

import errorHandler from "./middleware/errorHandler.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Static + Views
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend/pages"));
app.use("/assets", express.static(path.join(__dirname, "frontend/assets")));

// ✅ Protect routes with JWT
app.use(authenticateToken);

// Routes
app.use("/students", studentsRouter);
app.use("/teachers", teachersRouter);
app.use("/invoices", invoicesRouter);
app.use("/classes", classesRouter);
app.use("/fees", feesRouter);
app.use("/auth", authRouter);
app.use("/attendance", attendanceRouter);
app.use("/grades", gradesRouter);
app.use("/analytics", analyticsRouter);

// Page routes (EJS views)
app.get("/", (req, res) => res.render("index"));
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/admin", (req, res) => res.render("admin"));
app.get("/students", (req, res) => res.render("students"));
app.get("/teachers", (req, res) => res.render("teachers"));
app.get("/classes", (req, res) => res.render("classes"));
app.get("/invoices", (req, res) => res.render("invoices"));
app.get("/fee", (req, res) => res.render("fee"));

// ✅ Global error handler
app.use(errorHandler);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

// Utility: broadcast updates
export function broadcastUpdate(type) {
  io.emit("dataUpdated", { type });
}

// Server
const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
