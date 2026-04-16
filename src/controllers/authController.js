// Handles user sign-up and login, including password hashing and JWT issuance.
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const { username, password } = req.body || {}
    const normalizedUsername = typeof username === 'string' ? username.trim() : ''

    if (!normalizedUsername || typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    // Public registration is intentionally limited to standard users.
    const newUser = new User({
      username: normalizedUsername,
      password: hashedPassword,
      role: 'user'
    })
    await newUser.save()

    res
      .status(201)
      .json({ message: `User registered with username ${normalizedUsername}` })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username already exists' })
    }

    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Unable to register user' })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body || {}
    const normalizedUsername = typeof username === 'string' ? username.trim() : ''

    if (!normalizedUsername || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = await User.findOne({ username: normalizedUsername })
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured')
    }

    // The token carries only the user identity and role needed by protected routes.
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(500).json({ message: 'Unable to log in user' })
  }
  }

module.exports = {
  register,
  login
}
