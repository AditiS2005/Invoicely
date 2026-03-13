const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { username, password, role } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const newUser = new User({ username, password: hashedPassword, role })
    await newUser.save()

    res
      .status(201)
      .json({ message: `User registered with username ${username}` })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error registering user:  ${error.message}` })
  }
}

const login = async (req, res) => {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res
          .status(404)
          .json({ message: `user not found with username: ${username}` })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' })
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      res.status(200).json({ token })
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error logging in user:  ${error.message}` })
    }
  }

module.exports = {
  register,
  login
}
