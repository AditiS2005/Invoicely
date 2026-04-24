// Boots the Express app, applies security middleware, and starts the API only after the database is ready.
const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config()
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dbConnect = require('./config/db.Connect')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

// Render runs behind a reverse proxy, so trust one hop in production.
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false)

app.disable('x-powered-by')
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
)
app.use(express.json({ limit: '1mb' }))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
})

const blockedPaths = [
  /^\/src(\/|$)/,
  /^\/node_modules(\/|$)/,
  /^\/\.git(\/|$)/,
  /^\/memories(\/|$)/
]
const blockedFiles = new Set([
  '/package.json',
  '/package-lock.json',
  '/README.md',
  '/PROJECT_OVERVIEW.md',
  '/.env',
  '/.env.example'
])

app.use((req, res, next) => {
  if (blockedFiles.has(req.path) || blockedPaths.some((pattern) => pattern.test(req.path))) {
    return res.status(404).send('Not found')
  }

  return next()
})

app.use(express.static(path.resolve(__dirname, '..')))

const PORT = process.env.PORT || 7002

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  await dbConnect()

  // Auth endpoints get a tighter limit because they are the most likely target for brute force attempts.
  app.use('/api/auth', authLimiter, authRoutes)
  app.use('/api/user', userRoutes)

  // Keep file and API 404s explicit so the app does not leak internal structure.
  app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.status(404).send('Not found')
  })

  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })

  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
