const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas
const UserSchema = new Schema({
  id: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'guest', 'user', 'vk'],
  },
  token: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
module.exports.User = User;
