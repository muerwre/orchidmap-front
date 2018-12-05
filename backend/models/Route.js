const mongoose = require('mongoose');

const { Schema } = mongoose;

const RouteSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, default: '' },
    // address: { type: String, required: true },
    version: { type: Number, default: 2 },
    route: { type: Array },
    stickers: { type: Array },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    logo: { type: String, default: 'DEFAULT' },
    distance: { type: Number, default: 0 },
    public: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports.RouteSchema = RouteSchema;
