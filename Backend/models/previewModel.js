// models/previewModel.js
const mongoose = require('mongoose');

const previewSchema = new mongoose.Schema({
  _id: {
    type: String, // UUID or custom ID
    required: true
  },
  html: String,
  css: String,
  js: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800 // TTL: 30 minutes
  }
});

module.exports = mongoose.model('Preview', previewSchema);
