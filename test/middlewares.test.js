// Exercises the auth middleware in isolation so regressions are caught without starting the server.
const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

const { verifyToken } = require('../src/middlewares/authMiddleware')
const authorizeRoles = require('../src/middlewares/roleMiddleware')

function createRes() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.payload = body
      return this
    }
  }
}

test('verifyToken rejects missing authorization header', () => {
  const req = { headers: {} }
  const res = createRes()
  let nextCalled = false

  verifyToken(req, res, () => {
    nextCalled = true
  })

  assert.equal(nextCalled, false)
  assert.equal(res.statusCode, 401)
  assert.equal(res.payload.message, 'No token, authorization denied!')
})

test('verifyToken accepts a valid bearer token', () => {
  const req = {
    headers: {
      authorization: `Bearer ${jwt.sign({ id: '123', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' })}`
    }
  }
  const res = createRes()
  let nextCalled = false

  verifyToken(req, res, () => {
    nextCalled = true
  })

  assert.equal(nextCalled, true)
  assert.equal(req.user.role, 'user')
})

test('authorizeRoles blocks unauthorized roles', () => {
  const req = { user: { role: 'user' } }
  const res = createRes()
  let nextCalled = false
  const guard = authorizeRoles('admin')

  guard(req, res, () => {
    nextCalled = true
  })

  assert.equal(nextCalled, false)
  assert.equal(res.statusCode, 403)
  assert.equal(res.payload.message, 'Access denied for this role')
})
