// importing modules
const express = require('express')
const dotenv = require('dotenv').config()
const dbConnect = require('./config/db.Connect')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

// Middleware
app.use(express.json())

// Connect to database
dbConnect()

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

// server start
const PORT = process.env.PORT || 7002

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})
