const express = require('express')
const verifyToken = require('../middlewares/authMiddleware').verifyToken
const authorizeRoles = require('../middlewares/roleMiddleware')
const router = express.Router()

// for admin only routes
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'admin route' })
})

// all can access routes user+ admin
router.get(
  '/user',
  verifyToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.json({ message: 'user route' })
  }
)

module.exports = router
