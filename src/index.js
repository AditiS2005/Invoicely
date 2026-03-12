const express = require('express')
const dotenv = require('dotenv').config()
const dbConnect = require('./config/db.Connect')

const app = express()

// Middleware
app.use(express.json())

// Connect to database
dbConnect()

// routes

// server start
const PORT = process.env.PORT || 7002

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})
