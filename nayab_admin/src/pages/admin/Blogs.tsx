import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { BlogForm } from "@/components/admin/BlogForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"

export default function Blogs() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewBlog, setViewBlog] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12;
  const { token } = useAuth();

  const reloadBlogs = () => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || [])
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load blogs.")
        setLoading(false)
      })
  }

  useEffect(() => {
    reloadBlogs()
    // eslint-disable-next-line
  }, [])

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || blog.status?.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setShowForm(true)
  }

  const handleCloseForm = (shouldReload = false) => {
    setShowForm(false)
    setEditingBlog(null)
    if (shouldReload) reloadBlogs()
  }

  const handleDelete = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs/${blogId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const result = await res.json();
      if (res.ok) {
        reloadBlogs();
      } else {
        setError(result.message || "Failed to delete blog.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to delete blog.");
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <AdminLayout>
        <div className="p-6">
          <BlogForm 
            onCancel={() => handleCloseForm(true)}
            initialData={editingBlog}
          />
        </div>
      </AdminLayout>
    )
  }

  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const getImageUrl = (img: string) => img && img.startsWith('http') ? img : `${backendUrl}${img}`;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage your blog posts</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Blog Post
          </Button>
        </div>

        {/* Total Blogs */}
        <div className="text-right text-sm text-muted-foreground font-medium">
          Total Blogs: {blogs.length}
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search blogs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blog List */}
        {loading ? (
          <Card><CardContent className="py-12 text-center">Loading blogs...</CardContent></Card>
        ) : error ? (
          <Card><CardContent className="py-12 text-center text-destructive">{error}</CardContent></Card>
        ) : (
        <>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedBlogs.map((blog) => (
            <div key={blog._id} className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
              {/* Image */}
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src={blog.featuredImage ? getImageUrl(blog.featuredImage) : "/placeholder.png"}
                  alt={blog.title}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Content */}
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{blog.category}</Badge>
                  <Badge variant={blog.status?.toLowerCase() === "published" ? "default" : "secondary"}>{blog.status}</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setViewBlog(blog);
                      setShowViewDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(blog)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(blog._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span className="ml-auto text-xs text-muted-foreground">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button size="icon" variant="ghost" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft /></Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i+1} variant={currentPage === i+1 ? "default" : "outline"} size="icon" onClick={() => setCurrentPage(i+1)}>{i+1}</Button>
            ))}
            <Button size="icon" variant="ghost" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight /></Button>
          </div>
        )}
        </>
        )}

        {(!loading && !error && filteredBlogs.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No blogs found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Blog Details Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
          {viewBlog && (
            <>
              <DialogHeader className="p-0 flex flex-row items-center justify-between">
                <DialogTitle className="text-2xl font-bold mb-2">{viewBlog.title}</DialogTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={() => {
                    setShowViewDialog(false);
                    setEditingBlog(viewBlog);
                    setShowForm(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </DialogHeader>
              <img
                src={viewBlog.featuredImage ? getImageUrl(viewBlog.featuredImage) : "/placeholder.png"}
                alt={viewBlog.title}
                className="w-full h-64 object-cover rounded-t-lg mb-4"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">{viewBlog.category}</Badge>
                  <Badge variant={viewBlog.status?.toLowerCase() === "published" ? "default" : "secondary"}>{viewBlog.status}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {viewBlog.createdAt ? new Date(viewBlog.createdAt).toLocaleString() : ""}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">Excerpt</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{viewBlog.excerpt}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Content</h4>
                  <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: viewBlog.content }} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}