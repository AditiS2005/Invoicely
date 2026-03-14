const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ messgae: 'Access denied for this role' })
    }
    next()
  }
}

module.exports = authorizeRoles
