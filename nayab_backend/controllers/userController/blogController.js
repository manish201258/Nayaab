const Blog = require("../../models/blogs");

// Get all blogs (for users)
async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find({ status: "Published" })
      .sort({ featured: -1, publishDate: -1, createdAt: -1 })
      .select('-__v');
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blogs.", error: error.message });
  }
}

// Get a single blog by ID (for users)
async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id, status: "Published" }).select('-__v');
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    
    // Increment view count
    await Blog.findByIdAndUpdate(id, { $inc: { 'stats.views': 1 } });
    
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blog.", error: error.message });
  }
}

// Get featured blogs
async function getFeaturedBlogs(req, res) {
  try {
    const blogs = await Blog.find({ 
      status: "Published", 
      featured: true 
    })
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(6)
    .select('-__v');
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch featured blogs.", error: error.message });
  }
}

// Get blogs by category
async function getBlogsByCategory(req, res) {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ 
      status: "Published", 
      category: category 
    })
    .sort({ publishDate: -1, createdAt: -1 })
    .select('-__v');
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blogs by category.", error: error.message });
  }
}

// Search blogs
async function searchBlogs(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const blogs = await Blog.find({
      status: "Published",
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .sort({ publishDate: -1, createdAt: -1 })
    .select('-__v');
    
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to search blogs.", error: error.message });
  }
}

module.exports = { 
  getAllBlogs, 
  getBlogById, 
  getFeaturedBlogs, 
  getBlogsByCategory, 
  searchBlogs 
};
