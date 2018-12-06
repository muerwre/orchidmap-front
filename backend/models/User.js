const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas
const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'guest', 'user', 'vk'],
    },
    token: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },

    first_name: { type: String },
    last_name: { type: String },
    photo: { type: String },
    version: { type: Number, default: 2 },
    routes: [{ type: Schema.Types.ObjectId, ref: 'Route' }]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports.UserSchema = UserSchema;
