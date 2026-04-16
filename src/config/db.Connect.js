// Opens the MongoDB connection once at startup and fails fast when the database is unavailable.
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    if (!process.env.CONNECTION_STRING) {
      throw new Error('CONNECTION_STRING is not configured')
    }

    const connect = await mongoose.connect(process.env.CONNECTION_STRING)
    console.log(
      `db connected: ${connect.connection.host}, ${connect.connection.name}`
    )
  } catch (err) {
    console.error(`db connection error: ${err.message}`)
    throw err
  }
}

module.exports = connectDB
