import { LayoutDashboard, FileText, Package, Users, Settings, Menu, X, ClipboardList, Tag } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAdmin } from "./AdminContext"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";

const navigation = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Blogs", url: "/admin/blogs", icon: FileText },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Orders", url: "/admin/orders", icon: ClipboardList },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Categories", url: "/admin/categories", icon: Tag },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAdmin();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [sidebarReady, setSidebarReady] = useState(false);

  // Persist sidebarCollapsed state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("adminSidebarCollapsed");
    if (stored !== null) {
      setSidebarCollapsed(stored === "true");
    }
    setSidebarReady(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sidebarReady) {
      localStorage.setItem("adminSidebarCollapsed", sidebarCollapsed ? "true" : "false");
    }
  }, [sidebarCollapsed, sidebarReady]);

  if (!sidebarReady) return null;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin"
    }
    return currentPath.startsWith(path)
  }

  const getNavClass = (path: string) => cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors w-full justify-start h-auto",
    isActive(path)
      ? "bg-admin-accent text-admin-sidebar-foreground font-medium"
      : "text-admin-sidebar-foreground/70 hover:bg-admin-accent/20 hover:text-admin-sidebar-foreground"
  )

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 flex flex-col bg-admin-sidebar border-r transition-all duration-300 h-screen",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Nayab co. logo and tag - improved color and collapsed state */}
      <div className={cn(
        "flex flex-col items-center justify-center border-b border-admin-accent/20 transition-all duration-300",
        sidebarCollapsed ? "py-4" : "py-5"
      )}>
        {sidebarCollapsed ? (
          <div className="w-9 h-9 rounded-full bg-[#B8956A] flex items-center justify-center">
            <span className="text-lg font-bold text-white">N</span>
          </div>
        ) : (
          <>
            <span className="text-xl font-bold" style={{ color: '#fff', letterSpacing: '0.5px' }}>
              <span style={{ color: '#B8956A' }}>Nayaab</span> <span style={{ color: '#fff' }}>Co.</span>
            </span>
            <span className="text-[11px] text-[#f7f5ef] font-normal italic mt-1 tracking-wide whitespace-nowrap">Admin Dashboard</span>
          </>
        )}
      </div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-admin-accent/20">
        {!sidebarCollapsed && (
          <h2 className="text-lg font-semibold text-admin-sidebar-foreground">
            Admin Panel
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-admin-sidebar-foreground hover:bg-admin-accent/20"
        >
          {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={getNavClass(item.url)}
            style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', paddingLeft: sidebarCollapsed ? 0 : '0.75rem', paddingRight: sidebarCollapsed ? 0 : '0.75rem' }}
          >
            <item.icon className={sidebarCollapsed ? "h-6 w-6 flex-shrink-0 mx-auto" : "h-4 w-4 flex-shrink-0"} />
            {!sidebarCollapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
        {/* Analytics NavLink */}
        <NavLink
          to="/admin/analytics"
          className={getNavClass("/admin/analytics")}
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', paddingLeft: sidebarCollapsed ? 0 : '0.75rem', paddingRight: sidebarCollapsed ? 0 : '0.75rem' }}
        >
          <svg className={sidebarCollapsed ? "h-6 w-6 mx-auto" : "h-5 w-5"} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18" /><path d="M9 17V9m4 8V5m4 12v-4" /></svg>
          {!sidebarCollapsed && <span>Analytics</span>}
        </NavLink>
      </nav>

      {/* Footer with clickable profile */}
      <div className="p-4 border-t border-admin-accent/20">
        <Button
          variant="ghost"
          className={cn(
            "w-full p-2 h-auto rounded-lg",
            "flex items-center gap-3 text-sm",
            "text-admin-sidebar-foreground/70 hover:text-admin-sidebar-foreground",
            "hover:bg-admin-accent/20 transition-colors duration-200",
            sidebarCollapsed ? "justify-center p-0" : ""
          )}
          style={{ minHeight: sidebarCollapsed ? 48 : undefined }}
          onClick={() => navigate('/admin/profile')}
        >
          <div className={sidebarCollapsed ? "w-9 h-9 rounded-full bg-admin-accent flex items-center justify-center flex-shrink-0" : "w-8 h-8 rounded-full bg-admin-accent flex items-center justify-center flex-shrink-0"}>
            <span className="text-xs font-medium text-admin-sidebar-foreground">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          {!sidebarCollapsed && (
            <div className="text-left">
              <p className="font-medium">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-admin-sidebar-foreground/60">{user?.email || 'admin@example.com'}</p>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}