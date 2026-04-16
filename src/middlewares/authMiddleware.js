// Verifies bearer tokens and attaches the decoded user payload to the request.
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  let token
  let authHeader = req.headers.Authorization || req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Token format is invalid' })
    }
    token = parts[1]

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decode
      next()
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' })
    }
  } else {
    return res.status(401).json({ message: 'No token, authorization denied!' })
  }
}

exports.verifyToken = verifyToken
