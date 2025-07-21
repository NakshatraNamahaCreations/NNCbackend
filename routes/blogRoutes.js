const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog } = require('../Controllers/blogController');
const upload = require('../middleware/upload');

// POST /blogs - Create a new blog
router.post(
  '/',
  upload.fields([{ name: 'bannerImage', maxCount: 1 }]),
  createBlog
);

// GET /blogs - Fetch blogs with pagination and search
router.get('/', getBlogs);

// GET /blog/:id - Fetch a single blog
router.get('/blog/:id', getBlog);

// PUT /blog/:id - Update a blog
router.put(
  '/blog/:id',
  upload.fields([{ name: 'bannerImage', maxCount: 1 }]),
  updateBlog
);

// DELETE /blog/:id - Delete a blog
router.delete('/blog/:id', deleteBlog);

module.exports = router;