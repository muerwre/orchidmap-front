const mongoose = require('mongoose');

const { Schema } = mongoose;

const RouteSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, default: '' },
    // address: { type: String, required: true },
    version: { type: Number, default: 2 },
    route: { type: Array, default: [] },
    stickers: { type: Array, default: [] },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    distance: { type: Number, default: 0 },
    is_public: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
    logo: { type: String, default: 'DEFAULT' },
    provider: { type: String, default: 'DEFAULT' },
  },
);

module.exports.RouteSchema = RouteSchema;
