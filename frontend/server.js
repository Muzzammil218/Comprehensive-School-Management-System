import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend/pages"));

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "frontend/assets")));

// Routes
app.get("/", (req, res) => res.render("index"));
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/students", (req, res) => res.render("students"));
app.get("/teachers", (req, res) => res.render("teachers"));
app.get("/classes", (req, res) => res.render("classes"));
app.get("/invoices", (req, res) => res.render("invoices"));
app.get("/fee", (req, res) => res.render("fee"));
app.get("/admin", (req, res) => res.render("admin"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
