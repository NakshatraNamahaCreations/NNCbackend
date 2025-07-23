const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate slugs
    trim: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true,
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);