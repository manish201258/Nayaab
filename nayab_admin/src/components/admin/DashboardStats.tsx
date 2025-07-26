import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, Users, Eye, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardStats({ externalRefresh }: { externalRefresh?: boolean }) {
  const { token } = useAuth();
  const [stats, setStats] = useState({ blogs: 0, products: 0, users: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const [blogsRes, productsRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/blogs`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, { headers }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, { headers })
      ]);
      const blogsData = await blogsRes.json();
      const productsData = await productsRes.json();
      const usersData = await usersRes.json();
      setStats({
        blogs: blogsData.blogs?.length || 0,
        products: productsData.products?.length || 0,
        users: usersData.users?.length || 0,
        views: 0 // Placeholder, unless you have a real API for this
      });
    } catch {
      setStats({ blogs: 0, products: 0, users: 0, views: 0 });
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [token, fetchStats]);

  // Listen for external refresh event
  useEffect(() => {
    const handler = () => fetchStats();
    window.addEventListener('dashboard-stats-refresh', handler);
    return () => window.removeEventListener('dashboard-stats-refresh', handler);
  }, [fetchStats]);

  const statList = [
    {
      title: "Total Blogs",
      value: loading ? "..." : stats.blogs,
      icon: FileText,
      color: "text-admin-accent"
    },
    {
      title: "Total Products",
      value: loading ? "..." : stats.products,
      icon: Package,
      color: "text-admin-success"
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats.users,
      icon: Users,
      color: "text-admin-warning"
    },
    {
      title: "Page Views",
      value: "-",
      icon: Eye,
      color: "text-primary"
    }
  ];

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 z-10"
        onClick={fetchStats}
        disabled={loading}
        title="Refresh Stats"
      >
        <RefreshCw className={loading ? "animate-spin h-5 w-5" : "h-5 w-5"} />
      </Button>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statList.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}