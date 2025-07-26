"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Clock, User, Eye, Calendar, Tag, ArrowRight } from "lucide-react";

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
  publishDate: string;
  createdAt: string;
  slug: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const blogsPerPage = 3; // Show only 3 blogs initially

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/user/blogs`);
      const data = await response.json();
      
      if (response.ok) {
        setBlogs(data.blogs || []);
      } else {
        setError(data.message || "Failed to load blogs");
      }
    } catch (err) {
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Sort blogs: featured first, then by publish date
  const sortedBlogs = filteredBlogs.sort((a, b) => {
    return new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, endIndex);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const getImageUrl = (img: string) => img && img.startsWith('http') ? img : `${backendUrl}${img}`;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center py-12 text-gray-500">Loading blogs...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center py-12 text-red-500">{error}</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Hero Section - Previous Design */}
      <div className="relative h-48 w-full flex items-center" style={{ backgroundImage: 'url(/images/about-us-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 container mx-auto px-16 flex justify-between items-center h-full">
          <h1 className="text-white text-4xl font-bold">Blogs</h1>
          <div className="text-white text-lg flex gap-2 items-center">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-1">|</span>
            <span>Blogs</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#f7f5ef] min-h-screen py-16">
        <div className="container mx-auto px-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="col-span-1">
            {/* Search */}
            <div className="mb-8">
              <div className="font-semibold mb-2">Search</div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blog"
                  className="w-full border rounded px-3 py-2 text-sm bg-white"
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#B8956A" strokeWidth="2"/><path stroke="#B8956A" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
                </span>
              </div>
            </div>



            {/* Recent Posts */}
            <div className="mb-8">
              <div className="font-semibold mb-2">Recent post</div>
              <div className="flex flex-col gap-3">
                {blogs.slice(0, 3).map((blog, idx) => (
                  <div key={blog._id || idx} className="flex gap-3 items-center">
                    <img src={blog.featuredImage ? getImageUrl(blog.featuredImage) : "/images/about.webp"} alt={blog.title} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <Link href={`/blogs/${blog._id}`} className="text-xs font-medium text-gray-800 leading-tight hover:text-[#B8956A] transition-colors duration-200">{blog.title}</Link>
                      <div className="text-xs text-gray-500">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 md:col-span-3">
            {currentBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No blogs found matching your criteria.</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentBlogs.map((blog) => (
                    <div key={blog._id} className="bg-white rounded shadow p-0 flex flex-col">
                      <div className="relative">
                        <img 
                          src={blog.featuredImage ? getImageUrl(blog.featuredImage) : "/images/about.webp"} 
                          alt={blog.title} 
                          className="w-full h-48 object-cover rounded-t" 
                        />
                        <div className="absolute left-4 bottom-4 bg-[#f7f5ef] text-gray-700 text-xs font-semibold px-3 py-1 rounded shadow">
                          {blog.publishDate || blog.createdAt ? new Date(blog.publishDate || blog.createdAt).toLocaleDateString() : ""}
                        </div>
                        {/* Featured badge removed */}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="font-semibold text-md mb-1">{blog.title}</div>
                        <div className="text-gray-500 text-sm mb-4 flex-1">{blog.excerpt || blog.content}</div>
                        
                        {/* Author Info */}
                        <div className="flex items-center gap-2 mb-3">
                          {blog.author?.avatar ? (
                            <img
                              src={`${backendUrl}${blog.author.avatar}`}
                              alt={blog.author.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                          )}
                          <span className="text-xs text-gray-600">{blog.author?.name || 'Nayab Team'}</span>
                        </div>

                        {/* Show tags if available */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {blog.tags.slice(0, 2).map((tag: string, i: number) => (
                              <span key={i} className="bg-gray-100 border border-gray-200 text-xs px-2 py-0.5 rounded">{tag}</span>
                            ))}
                          </div>
                        )}
                        
                        <Link 
                          href={`/blogs/${blog._id}`} 
                          className="bg-[#B8956A] text-white px-5 py-2 rounded text-sm font-medium hover:bg-[#A0845A] w-fit transition-colors duration-200"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-[#B8956A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm border rounded transition ${
                          currentPage === page
                            ? "bg-[#B8956A] text-white border-[#B8956A]"
                            : "border-gray-300 hover:bg-[#B8956A] hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-[#B8956A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
                
                {/* Results info */}
                <div className="text-center mt-6 text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, sortedBlogs.length)} of {sortedBlogs.length} blogs
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}