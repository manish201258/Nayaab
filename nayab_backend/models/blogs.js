const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: { 
    type: String, 
    required: false,
    maxlength: 500
  },
  content: { 
    type: String, 
    required: true 
  },
  featuredImage: { 
    type: String, 
    required: false 
  },
  // Enhanced author information
  author: {
    name: { type: String, required: true, default: 'Nayab Team' },
    bio: { type: String, default: 'Antique Collection Expert' },
    avatar: { type: String },
    email: { type: String },
    website: { type: String },
    socialLinks: {
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String }
    }
  },
  // Enhanced category system
  category: { 
    type: String, 
    required: true,
    enum: ['antique', 'art', 'collection', 'luxury', 'rare', 'vintage', 'history', 'culture', 'expertise', 'guide', 'news', 'featured']
  },
  subcategory: {
    type: String,
    required: false,
    enum: ['furniture', 'jewelry', 'paintings', 'sculptures', 'textiles', 'ceramics', 'metalwork', 'books', 'coins', 'other']
  },
  tags: [{ 
    type: String, 
    required: false,
    trim: true
  }],
  // Enhanced status management
  status: { 
    type: String, 
    enum: ['Draft', 'Published', 'Archived', 'Scheduled'], 
    default: 'Draft' 
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Enhanced reading metrics
  readingTime: {
    type: Number,
    default: 5
  },
  wordCount: {
    type: Number,
    default: 0
  },
  // Enhanced social sharing
  social: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    pinterest: { type: String },
    linkedin: { type: String }
  },
  // Enhanced statistics
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  // Content quality and moderation
  contentQuality: {
    isReviewed: { type: Boolean, default: false },
    reviewedBy: { type: String },
    reviewDate: { type: Date },
    qualityScore: { type: Number, min: 1, max: 10 },
    notes: { type: String }
  },
  // Publishing and scheduling
  publishDate: {
    type: Date,
    default: Date.now
  },
  scheduledDate: {
    type: Date
  },
  // Enhanced timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  publishedAt: {
    type: Date
  },
  // Content organization
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  // Related content
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  // Content type and format
  contentType: {
    type: String,
    enum: ['article', 'guide', 'news', 'review', 'interview', 'story'],
    default: 'article'
  },
  // Language and localization
  language: {
    type: String,
    default: 'en'
  },
  // Content difficulty level
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  // Content series
  series: {
    name: { type: String },
    part: { type: Number },
    totalParts: { type: Number }
  }
}, {
  timestamps: true
});

// Improved slug generation from title
BlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      // Handle duplicate slugs by adding timestamp if needed
      + '-' + Date.now().toString().slice(-4);
  }
  next();
});

// Calculate reading time and word count based on content
BlogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    this.wordCount = wordCount;
  }
  next();
});

// Set publishedAt when status changes to Published
BlogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'Published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for better query performance
BlogSchema.index({ status: 1, publishDate: -1 });
BlogSchema.index({ category: 1, status: 1 });
BlogSchema.index({ featured: 1, status: 1 });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ 'author.name': 1 });

module.exports = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
