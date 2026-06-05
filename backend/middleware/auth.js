const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ status: "error", message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Only admins can access protected routes
    if (decoded.role !== "admin") {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
}

module.exports = authMiddleware;
