/**
 * Ownership middleware factory.
 * Checks that the authenticated user is the owner of the resource (any role allowed).
 * @param {string} paramName - Name of the route param that contains the resource owner id (e.g. 'id' or 'userId').
 */
function checkOwnership(paramName) {
  return function (req, res, next) {
    const auth = req.auth || {};
    const ownerId = req.params[paramName];
    console.log('Ownership check - auth.id:', auth.id, 'ownerId:', ownerId, 'role:', auth.role);
    if (!ownerId) {
      return res.status(400).json({ message: 'Owner ID missing in route params' });
    }
    // Allow any role as long as the JWT id matches the requested resource id
    if (auth.id === ownerId) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  };
}

module.exports = { checkOwnership };
