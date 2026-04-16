// Gates route handlers by role after authentication has already populated req.user.
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied for this role' })
    }
    next()
  }
}

module.exports = authorizeRoles
