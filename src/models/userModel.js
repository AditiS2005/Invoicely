// Stores login credentials and the role used by the API's authorization checks.
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user']
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.toJSON = function () {
  // Hide the password when a user document is serialized back to JSON.
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model('User', userSchema)
