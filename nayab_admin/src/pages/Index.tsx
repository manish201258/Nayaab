import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminLogin from "../components/adminLogin";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isAdmin) {
      navigate("/admin");
    }
  }, [user, navigate]);

  // Only show login form if not authenticated as admin
  if (!user || !user.isAdmin) {
    return <AdminLogin />;
  }

  // Optionally, render nothing or a loading spinner while redirecting
  return null;
};

export default Index;
