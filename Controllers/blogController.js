const Blog = require('../models/Blog');


const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/\s+/g, '-') // spaces to dashes
    .replace(/--+/g, '-') // multiple dashes to one
    .replace(/^-+|-+$/g, ''); // trim dashes
};

exports.createBlog = async (req, res) => {
  try {
    const { title, metaTitle, metaDescription, description } = req.body;

    if (!title || !req.files.bannerImage || !metaTitle || !metaDescription || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const slug = generateSlug(title);

     const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug already exists. Use a different title.' });
    }

    const newBlog = new Blog({
      title,
      slug,
      // bannerImage: `${req.protocol}://${req.get('host')}/uploads/${req.files.bannerImage[0].filename}`, // Store full URL
      bannerImage: req.files.bannerImage[0].filename,
      metaTitle,
      metaDescription,
      description,
    });

    await newBlog.save();

    res.status(201).json({ success: true, message: 'Blog created successfully.' });
  } catch (err) {
    console.error('Blog creation failed:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { metaTitle: { $regex: search, $options: 'i' } },
            { metaDescription: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

const blogs = await Blog.find(query)
  .sort({ createdAt: -1 }) 
  .skip((page - 1) * limit)
  .limit(parseInt(limit))
  .select('title bannerImage description createdAt');


    const totalDocuments = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      success: true,
      data: blogs,
      totalPages,
    });
  } catch (err) {
    console.error('Failed to fetch blogs:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).select('title bannerImage metaTitle metaDescription description');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error('Failed to fetch blog:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


// GET /blogs/title/:slugOrTitle - Fetch blog by title
exports.getBlogByTitle = async (req, res) => {
  try {
    let { title } = req.params;
    // Replace hyphens with spaces
    title = title.replace(/-/g, ' ');
    // Query with case-insensitive regex
    const blog = await Blog.findOne({ 
      title: { $regex: `^${title}$`, $options: 'i' }
    }).select('title bannerImage metaTitle metaDescription description createdAt');
    if (!blog) {
      console.log(`Blog not found for title: ${title}`);
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    console.error('Failed to fetch blog by title:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, metaTitle, metaDescription, description } = req.body;

    if (!title || !metaTitle || !metaDescription || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const updateData = {
      title,
      metaTitle,
      metaDescription,
      description,
    };

    if (req.files && req.files.bannerImage) {
      updateData.bannerImage = req.files.bannerImage[0].filename;
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    res.status(200).json({ success: true, message: 'Blog updated successfully.' });
  } catch (err) {
    console.error('Blog update failed:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    res.status(200).json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Blog deletion failed:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};