// backend/utils/emitDashboardUpdate.js

/**
 * Broadcasts dashboard update event to all connected clients
 * @param {object} io - Socket.IO server instance
 */
function emitDashboardUpdate(io) {
  if (!io) return;

  // You can extend this to fetch fresh analytics before emitting
  io.emit("dashboard_update", {
    message: "Dashboard data updated"
    // Optionally attach analytics payload here
  });
}

module.exports = emitDashboardUpdate;
