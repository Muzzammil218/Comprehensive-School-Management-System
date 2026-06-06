// backend/middleware/rbac.js

// Middleware to check user role
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      // Assuming JWT decoded user is attached to req.user
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ status: "error", message: "Unauthorized: No role found" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ status: "error", message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
