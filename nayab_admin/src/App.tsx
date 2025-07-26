import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Blogs from "./pages/admin/Blogs";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/admin/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Analytics from "./pages/admin/Analytics";
import Categories from "./pages/admin/Categories";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
            <Route path="/admin/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/admin/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/admin/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
            <Route path="/admin/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/" element={<Index />} />\
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
