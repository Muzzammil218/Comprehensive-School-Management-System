// backend/index.mjs
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import studentsRouter from "./routes/students.js";
import teachersRouter from "./routes/teachers.js";
import invoicesRouter from "./routes/invoices.js";
import classesRouter from "./routes/classes.js";
import feesRouter from "./routes/fees.js";
import attendanceRouter from "./routes/attendance.js";
import gradesRouter from "./routes/grades.js";
import analyticsRouter from "./routes/analytics.js";
import authRouter from "./routes/auth.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Save the io instance globally into Express settings
app.set("io", io);

app.use(cors());
app.use(express.json());

// Static + Views config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
// 💡 Use ".." to step OUT of the backend folder and into the root project directory
app.set("views", path.join(__dirname, "../frontend/views"));
app.use("/assets", express.static(path.join(__dirname, "../frontend/assets")));

// ==========================================
// 1. PUBLIC ROUTES (No Token Needed)
// ==========================================
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.use("/auth", authRouter); 

// ==========================================
// 2. PROTECTED EJS VIEW ROUTES (Requires Auth)
// ==========================================
app.get("/", (req, res) => res.render("index"));
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/admin", (req, res) => res.render("admin"));
app.get("/view-students", (req, res) => res.render("students"));
app.get("/view-teachers", (req, res) => res.render("teachers"));
app.get("/view-classes", (req, res) => res.render("classes"));
app.get("/view-invoices", (req, res) => res.render("invoices"));
app.get("/fee", (req, res) => res.render("fee"));

// ==========================================
// 3. PROTECTED DATA API ROUTES (Prefix with /api)
// ==========================================
app.use("/api/students", authenticateToken, studentsRouter);
app.use("/api/teachers", authenticateToken, teachersRouter);
app.use("/api/invoices", authenticateToken, invoicesRouter);
app.use("/api/classes", authenticateToken, classesRouter);
app.use("/api/fees", authenticateToken, feesRouter);
app.use("/api/attendance", authenticateToken, attendanceRouter);
app.use("/api/grades", authenticateToken, gradesRouter);
app.use("/api/analytics", authenticateToken, analyticsRouter);

// ==========================================
// ERROR HANDLING & SOCKETS
// ==========================================
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));