const Blog = require("../../models/blogs");

// Create a new blog
async function createBlog(req, res) {
  try {
    const { 
      title, 
      excerpt, 
      content, 
      category, 
      tags, 
      status,
      featured,
      authorName,
      authorBio,
      metaTitle,
      metaDescription,
      keywords,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      publishDate
    } = req.body;

    let featuredImage = req.body.featuredImage;
    let authorAvatar = req.body.authorAvatar;

    // Handle featured image upload
    if (req.files && req.files.featuredImage) {
      featuredImage = `/uploads/${req.files.featuredImage[0].filename}`;
    }

    // Handle author avatar upload
    if (req.files && req.files.authorAvatar) {
      authorAvatar = `/uploads/${req.files.authorAvatar[0].filename}`;
    }

    // Parse tags as array if sent as comma-separated string
    let tagsArray = tags;
    if (typeof tags === 'string') {
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    // Parse keywords as array if sent as comma-separated string
    let keywordsArray = keywords;
    if (typeof keywords === 'string') {
      keywordsArray = keywords.split(',').map(keyword => keyword.trim()).filter(Boolean);
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const blogData = {
      title,
      excerpt,
      content,
      featuredImage,
      category,
      tags: tagsArray,
      status,
      featured: featured === 'true',
      author: {
        name: authorName || 'Nayab Team',
        bio: authorBio || 'Antique Collection Expert',
        avatar: authorAvatar
      },
      seo: {
        metaTitle,
        metaDescription,
        keywords: keywordsArray
      },
      social: {
        facebook: facebookUrl,
        twitter: twitterUrl,
        instagram: instagramUrl
      },
      publishDate: publishDate ? new Date(publishDate) : new Date()
    };

    const blog = await Blog.create(blogData);
    return res.status(201).json({ message: "Blog created successfully.", blog });
  } catch (error) {
    return res.status(500).json({ message: "Blog creation failed.", error: error.message });
  }
}

// Get all blogs
async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blogs.", error: error.message });
  }
}

// Get a single blog by ID
async function getBlogById(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch blog.", error: error.message });
  }
}

// Update an existing blog
async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { 
      title, 
      excerpt, 
      content, 
      category, 
      tags, 
      status,
      featured,
      authorName,
      authorBio,
      metaTitle,
      metaDescription,
      keywords,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      publishDate
    } = req.body;

    let updateData = {
      title,
      excerpt,
      content,
      category,
      status,
      featured: featured === 'true',
      author: {
        name: authorName || 'Nayab Team',
        bio: authorBio || 'Antique Collection Expert'
      },
      seo: {
        metaTitle,
        metaDescription
      },
      social: {
        facebook: facebookUrl,
        twitter: twitterUrl,
        instagram: instagramUrl
      },
      publishDate: publishDate ? new Date(publishDate) : new Date()
    };

    // Handle featured image upload
    if (req.files && req.files.featuredImage) {
      updateData.featuredImage = `/uploads/${req.files.featuredImage[0].filename}`;
    }

    // Handle author avatar upload
    if (req.files && req.files.authorAvatar) {
      updateData.author.avatar = `/uploads/${req.files.authorAvatar[0].filename}`;
    }

    // Parse tags as array if sent as comma-separated string
    if (typeof tags === 'string') {
      updateData.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    // Parse keywords as array if sent as comma-separated string
    if (typeof keywords === 'string') {
      updateData.seo.keywords = keywords.split(',').map(keyword => keyword.trim()).filter(Boolean);
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    return res.status(200).json({ message: "Blog updated successfully.", blog });
  } catch (error) {
    return res.status(500).json({ message: "Blog update failed.", error: error.message });
  }
}

// Delete a blog
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    return res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Blog deletion failed.", error: error.message });
  }
}

module.exports = { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById };
