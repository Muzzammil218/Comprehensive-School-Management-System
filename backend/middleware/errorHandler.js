// backend/middleware/errorHandler.js

export default function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.stack || err);

  // Default status code
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}
