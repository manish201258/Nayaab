"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, User, Eye, Calendar, Tag, Share2, Facebook, Twitter, Instagram, Heart, ArrowLeft, ShoppingCart } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: string;
  featured: boolean;
  author: {
    name: string;
    bio: string;
    avatar?: string;
  };
  readingTime: number;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  publishDate: string;
  createdAt: string;
  slug: string;
  relatedProducts?: { id: string; name: string; image: string; price: number }[]; // For e-commerce integration
}

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [likes, setLikes] = useState(0); // Local state for likes
  const [hasLiked, setHasLiked] = useState(false); // Track if user has liked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const blogId = params.id;

  const userApiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const getImageUrl = (img: string) => img && img.startsWith('http') ? img : `${backendUrl}${img}`;

  useEffect(() => {
    if (!blogId) {
      setError("Blog ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${userApiUrl}/blogs/${blogId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Blog not found");
        }
        return res.json();
      })
      .then((data) => {
        const fetchedBlog = data.blog || data;
        setBlog(fetchedBlog);
        setLikes(fetchedBlog.stats?.likes || 0);
        // Check local storage for like status (simple client-side persistence)
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        setHasLiked(likedPosts.includes(blogId));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load blog.");
        setLoading(false);
      });
  }, [blogId, userApiUrl]);

  const handleLike = () => {
    if (hasLiked) return; // Prevent multiple likes

    // Optimistic update
    setLikes((prev) => prev + 1);
    setHasLiked(true);

    // Simulate API call (replace with actual backend endpoint)
    fetch(`${userApiUrl}/blogs/${blogId}/like`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to like');
        // Update local storage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        likedPosts.push(blogId);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      })
      .catch(() => {
        // Rollback on error
        setLikes((prev) => prev - 1);
        setHasLiked(false);
      });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center py-12 text-gray-500">Loading blog...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center py-12 text-red-500">
              {error || "Blog not found"}
            </div>
            <div className="text-center">
              <Link href="/blogs" className="inline-flex items-center gap-2 text-[#B8956A] hover:text-[#A0845A] font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Simple and Clean Blog Layout */}
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link 
              href="/blogs" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#B8956A] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blogs</span>
            </Link>
          </div>

          {/* Hero Section */}
          {blog.featuredImage && (
            <div className="mb-12">
              <img 
                src={getImageUrl(blog.featuredImage)} 
                alt={blog.title} 
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title and Category */}
          <div className="mb-8">
            <span className="block text-sm uppercase text-gray-500 mb-2">{blog.category}</span>
            <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-12">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {blog.author?.name || 'Nayab Team'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{blog.stats?.views || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.readingTime || 5} min read</span>
            </div>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="mb-12 text-gray-700 italic">
              <p>{blog.excerpt}</p>
            </div>
          )}

          {/* Main Content */}
          <article className="text-gray-800 mb-12">
            <div 
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt || '' }}
            />
          </article>

          {/* Like and Stats - Simple Design */}
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={handleLike} 
              disabled={hasLiked}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md ${hasLiked ? 'text-gray-400 cursor-not-allowed' : 'text-[#B8956A] hover:bg-gray-100'}`}
            >
              <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-sm text-gray-600">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Author Section */}
          <div className="border-t pt-8 mb-12">
            <div className="flex items-center gap-4">
              {blog.author?.avatar ? (
                <img
                  src={getImageUrl(blog.author.avatar)}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <User className="w-12 h-12 text-gray-600" />
              )}
              <div>
                <h3 className="font-semibold">{blog.author?.name || 'Nayab Team'}</h3>
                <p className="text-gray-600 text-sm">{blog.author?.bio || 'Antique Collection Expert'}</p>
              </div>
            </div>
          </div>

          {/* Related Products (Kept for E-commerce) */}
          {blog.relatedProducts && blog.relatedProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Related Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blog.relatedProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-32 object-cover mb-2" />
                    <h4 className="font-semibold">{product.name}</h4>
                    <p>${product.price.toFixed(2)}</p>
                    <button className="mt-2 text-[#B8956A] hover:underline">Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
