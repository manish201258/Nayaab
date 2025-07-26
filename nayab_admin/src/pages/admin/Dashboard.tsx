import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/AdminLayout"
import { DashboardStats } from "@/components/admin/DashboardStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, TrendingUp, RefreshCw } from "lucide-react"
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const recentProducts = [
  {
    id: 1,
    name: "Vintage Leather Armchair",
    price: 1250,
    stock: 3,
    status: "active"
  },
  {
    id: 2,
    name: "Antique Gold Mirror",
    price: 680,
    stock: 1,
    status: "active"
  },
  {
    id: 3,
    name: "Art Deco Lamp",
    price: 420,
    stock: 0,
    status: "inactive"
  }
]

export default function Dashboard() {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([])
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const [errorBlogs, setErrorBlogs] = useState<string | null>(null)
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const handleDashboardRefresh = async () => {
    setLoadingRefresh(true);
    // Refresh dashboard stats
    window.dispatchEvent(new Event('dashboard-stats-refresh'));
    // Refresh recent blogs
    setLoadingBlogs(true);
    setErrorBlogs(null);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(res => res.json())
      .then(data => {
        setRecentBlogs((data.blogs || []).slice(0, 3));
        setLoadingBlogs(false);
      })
      .catch(() => {
        setErrorBlogs("Failed to load recent blogs.");
        setLoadingBlogs(false);
      });
    // Refresh recent products
    // setLoadingProducts(true); // This state doesn't exist in the original file
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, { // This state doesn't exist in the original file
    //   headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setRecentProducts((data.products || []).slice(0, 3));
    //     setLoadingProducts(false);
    //   })
    //   .catch(() => {
    //     setRecentProducts([]);
    //     setLoadingProducts(false);
    //   });
    setTimeout(() => setLoadingRefresh(false), 1000); // UX: show spinner briefly
  };

  useEffect(() => {
    setLoadingBlogs(true)
    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(res => res.json())
      .then(data => {
        setRecentBlogs((data.blogs || []).slice(0, 3))
        setLoadingBlogs(false)
      })
      .catch(() => {
        setErrorBlogs("Failed to load recent blogs.")
        setLoadingBlogs(false)
      })
  }, [token])

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
            <Button
              onClick={handleDashboardRefresh}
              disabled={loadingRefresh}
              title="Refresh"
              className="flex items-center gap-2 bg-[#f7f5ef] text-[#B8956A] border border-[#B8956A]/30 rounded-lg px-4 py-2 hover:bg-[#f7f5ef]/80 transition"
            >
              <RefreshCw className={loadingRefresh ? "animate-spin h-5 w-5" : "h-5 w-5"} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Recent Activity Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Blogs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Blog Posts</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/blogs")}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingBlogs ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">Loading blogs...</div>
                ) : errorBlogs ? (
                  <div className="text-center py-4 text-destructive text-sm">{errorBlogs}</div>
                ) : recentBlogs.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">No recent blogs found.</div>
                ) : recentBlogs.map((blog) => (
                  <div key={blog._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{blog.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                    <Badge variant={blog.status?.toLowerCase() === "published" ? "default" : "secondary"}>
                      {blog.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Products</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/products")}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>${product.price}</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2" onClick={() => navigate('/admin/blogs', { state: { openForm: true } })}>
                <TrendingUp className="h-4 w-4" />
                Create New Blog
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/admin/products', { state: { openForm: true } })}>
                <TrendingUp className="h-4 w-4" />
                Add New Product
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/admin/analytics')}>
                <Eye className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}