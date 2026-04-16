// Exposes the public login and registration endpoints used by the frontend auth forms.
const express = require('express')
const router = express.Router()

const { register, login } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)

module.exports = router
