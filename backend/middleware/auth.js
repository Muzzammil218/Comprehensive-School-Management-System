// backend/middleware/auth.js
import jwt from "jsonwebtoken";

// ✅ Verify JWT and attach user to request
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload (id, username, role)
    next();
  } catch (err) {
    return res.status(403).json({ status: "error", message: "Invalid or expired token" });
  }
}

// ✅ Optional: restrict by role directly
export function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ status: "error", message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
}
