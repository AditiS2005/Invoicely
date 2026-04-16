// Defines a couple of protected example routes for testing token and role checks.
const express = require('express')
const verifyToken = require('../middlewares/authMiddleware').verifyToken
const authorizeRoles = require('../middlewares/roleMiddleware')
const router = express.Router()

// Admin-only path used to confirm RBAC enforcement.
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'admin route' })
})

// Shared protected path that both standard users and admins can access.
router.get(
  '/user',
  verifyToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.json({ message: 'user route' })
  }
)

module.exports = router
