// middleware/requireRole.js — Role checking middleware
module.exports = function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.auth || req.auth.role !== requiredRole) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    }
    next();
  };
};
