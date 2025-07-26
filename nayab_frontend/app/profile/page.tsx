"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/authContext";
import { useWishlist } from "@/context/wishlistContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios"; // For API calls
import { useSearchParams } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferredEra?: string;
  avatar?: string;
  addresses?: string[];
  address?: string;
}

const SIDEBAR_OPTIONS = [
  { key: "profile", label: "Profile", icon: "user" },
  { key: "wishlist", label: "Wishlist", icon: "heart" },
  { key: "orders", label: "Orders", icon: "shopping-bag" },
  { key: "logout", label: "Logout", icon: "sign-out-alt" },
];

export default function ProfilePage() {
  const { logout, user, isLogin, loading } = useAuth();
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "",
    name: "User Name",
    email: "user@example.com",
    phone: "Not provided",
    preferredEra: "Victorian",
    avatar: "",
    addresses: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>(currentUser);
  const [selectedTab, setSelectedTab] = useState<string>("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(60); // Placeholder
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsError, setOrderDetailsError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL ;

  useEffect(() => {
    if (user?.id) { // Only fetch if user.id exists (guards against undefined)
      setCurrentUser((prev) => ({ ...prev, id: user.id })); // Sync ID immediately
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !isLogin) {
      router.replace("/login");
    }
  }, [isLogin, loading, router]);

  // Fetch orders when orders tab is selected
  useEffect(() => {
    if (selectedTab === "orders" && isLogin) {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [selectedTab, isLogin]);

  // Open order details if ?orderId= is present
  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      handleViewOrderDetails(orderId);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  const fetchUserProfile = async () => {
    setApiLoading(true);
    setApiError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setApiError("No authentication token found. Please log in again.");
      setApiLoading(false);
      return;
    }
    if (!user?.id) {
      setApiError("User ID not available. Please log in again.");
      setApiLoading(false);
      return;
    }
    try {
      
      const response = await axios.get(`${backendUrl}/user/profile/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        // Map _id to id for frontend consistency
        const userData = { ...response.data, id: response.data._id };
        // Ensure addresses is always an array
        if (!Array.isArray(userData.addresses)) userData.addresses = [];
        setCurrentUser(userData);
        setFormData(userData);
      } else {
        setApiError("No data returned from server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      setApiError(`Failed to fetch profile: ${errorMessage}`);
    } finally {
      setApiLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setOrdersError("No authentication token found. Please log in again.");
      setOrdersLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/user/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error: any) {
      setOrdersError(error.response?.data?.message || error.message || "Unknown error");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.patch(`${backendUrl}/user/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh orders
      fetchOrders();
      handleCloseOrderDetails(); // Close modal after cancellation
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || "Failed to cancel order");
    }
  };

  const handleViewOrderDetails = async (orderId: string) => {
    setOrderDetailsLoading(true);
    setOrderDetailsError(null);
    setOrderDetails(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setOrderDetailsError("Please log in.");
      setOrderDetailsLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/user/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderDetails(response.data);
    } catch (err: any) {
      setOrderDetailsError(err.response?.data?.message || err.message || "Failed to fetch order");
    } finally {
      setOrderDetailsLoading(false);
    }
  };
  const handleCloseOrderDetails = () => {
    setOrderDetails(null);
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/([&?])orderId=[^&]*/, ''));
  };

  if (loading || !isLogin) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Address handlers
  const handleAddressChange = (idx: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses?.map((addr, i) => (i === idx ? value : addr)) || [],
    }));
  };
  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), ""],
    }));
  };
  const handleRemoveAddress = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses?.filter((_, i) => i !== idx) || [],
    }));
  };
  const handleMakeDefaultAddress = (idx: number) => {
    setFormData((prev) => {
      if (!prev.addresses) return prev;
      const addresses = [...prev.addresses];
      const [selected] = addresses.splice(idx, 1);
      addresses.unshift(selected);
      return { ...prev, addresses };
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiLoading(true);
    setApiError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setApiError("No authentication token found. Please log in again.");
      setApiLoading(false);
      return;
    }
    // Use currentUser.id or fallback to user?.id
    const userId = currentUser.id || user?.id;
  
    if (!userId) { // Guard against undefined ID
      setApiError("User ID not available. Please refresh the page.");
      setApiLoading(false);
      return;
    }
    try {
     
      const response = await axios.patch(`${backendUrl}/user/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      setCurrentUser(response.data);
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      setApiError(`Failed to update profile: ${errorMessage}`);
  
    } finally {
      setApiLoading(false);
    }
  };

  const handleSidebarClick = (key: string) => {
    if (key === "logout") {
      logout();
      router.push("/");
    } else {
      setSelectedTab(key);
      setIsEditing(false);
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans text-base">
      <Header />
      {/* Modern Banner: Gradient with animation, increased spacing */}
      <div className="relative bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] text-white py-16 sm:py-20 px-6 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight mb-4 animate-fade-in-down">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-lg sm:text-xl opacity-80 animate-fade-in-up max-w-2xl mx-auto">
            Manage your account, track orders, and explore your antique journey.
          </p>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8956A]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8956A]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12"> {/* Increased gap */}
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden bg-[#B8956A] text-white p-3 rounded-lg mb-4 flex items-center justify-center shadow-md hover:bg-[#A0845A] transition-all duration-300"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </button>

          {/* Sidebar: Modern card design with hover effects, increased font size */}
          <aside
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } lg:block w-full lg:w-72 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-[#B8956A]/10 transition-all duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
          >
            <div className="space-y-3"> {/* Increased spacing */}
              <h3 className="text-xl font-bold text-gray-900 font-serif mb-6">Account Dashboard</h3>
              {SIDEBAR_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`w-full flex items-center space-x-4 py-4 px-4 rounded-lg text-base font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedTab === opt.key
                      ? "bg-[#B8956A] text-white shadow-md"
                      : "text-gray-700 hover:bg-[#f7f5ef] hover:text-[#B8956A]"
                  }`}
                  onClick={() => handleSidebarClick(opt.key)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {opt.icon === "user" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                    {opt.icon === "heart" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                    {opt.icon === "shopping-bag" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                    {opt.icon === "sign-out-alt" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />}
                  </svg>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {/* Profile Completion Bar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-base font-semibold text-gray-700 mb-2">Profile Completion</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#B8956A] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{profileCompletion}% Complete</p>
              <button className="mt-2 text-[#B8956A] text-sm font-semibold hover:underline" onClick={() => setSelectedTab("profile")}>
                Complete Now
              </button>
            </div>
          </aside>

          {/* Main Content: Modern card with tabbed interface, increased spacing and font sizes */}
          <main className="flex-1 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-[#B8956A]/10 overflow-hidden transition-all duration-500">
            {apiLoading && <p>Loading...</p>}
            {apiError && <p className="text-red-500">{apiError}</p>}
            <div className="tab-content">
              {selectedTab === "profile" && (
                isEditing ? (
                  <div className="animate-tab-content">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-serif">Edit Profile</h2>
                    <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl mx-auto"> {/* Increased spacing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Name</label>
                          <input
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 shadow-sm transition-all text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Email</label>
                          <input
                            name="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            placeholder="Email Address"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 shadow-sm transition-all text-base"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 shadow-sm transition-all text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Preferred Era</label>
                          <select
                            name="preferredEra"
                            value={formData.preferredEra || ""}
                            onChange={e => setFormData(prev => ({ ...prev, preferredEra: e.target.value }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 shadow-sm transition-all text-base"
                          >
                            <option value="">Select Era</option>
                            <option value="Victorian">Victorian</option>
                            <option value="Edwardian">Edwardian</option>
                            <option value="Art Deco">Art Deco</option>
                            <option value="Mid-Century">Mid-Century</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-2">Address</label>
                        <input
                          name="address"
                          value={formData.address || ''}
                          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Address"
                          className="w-full p-3 border border-gray-200 rounded-lg mb-2"
                        />
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button
                          type="submit"
                          className="bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md text-base"
                          disabled={apiLoading}
                        >
                          {apiLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 text-base"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="animate-tab-content text-center">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8"> {/* Increased spacing */}
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border-4 border-[#B8956A]/30 shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#B8956A] rounded-full flex items-center justify-center text-5xl sm:text-6xl font-bold text-white shadow-lg">
                          {currentUser.name?.charAt(0)}
                        </div>
                      )}
                      <button className="absolute bottom-2 right-2 bg-white text-[#B8956A] p-2 rounded-full shadow-md hover:bg-[#f7f5ef] transition-all duration-300 transform hover:scale-110">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a6 6 0 0112 0v6a6 6 0 01-12 0V9zM12 15a3 3 0 11-6 0 3 3 0 016 0zM21 12h-2" />
                        </svg>
                      </button>
                      <div className="absolute inset-0 rounded-full border-4 border-[#B8956A]/20 animate-pulse opacity-20"></div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mb-4">{currentUser.name}</h2>
                    <p className="text-gray-600 text-base mb-2">{currentUser.email}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto mb-8"> {/* Increased gap */}
                      <div className="text-gray-600 text-base">
                        <strong>Phone:</strong> {currentUser.phone}
                      </div>
                      <div className="text-gray-600 text-base">
                        <strong>Preferred Era:</strong> {currentUser.preferredEra}
                      </div>
                    </div>
                    {currentUser.address && (
                      <div className="text-gray-600 text-base mt-2">
                        <strong>Address:</strong> {currentUser.address}
                        <div className="text-xs text-gray-500">(This address will be used for checkout)</div>
                      </div>
                    )}
                    <div className="flex gap-4 justify-center mt-4">
                      <button
                        className="bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md text-base"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )
              )}

              {selectedTab === "wishlist" && (
                <div className="animate-tab-content">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-serif">Your Wishlist</h2>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12 sm:py-16"> 
                      <svg className="mx-auto w-20 h-20 text-[#B8956A] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <p className="text-gray-600 text-lg sm:text-xl">Your wishlist is empty.</p>
                      <Link
                        href="/shop"
                        className="inline-block mt-4 bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md text-base"
                      >
                        Explore Shop
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"> {/* Increased gap */}
                      {wishlist.map((item) => (
                        <div
                          key={item.id}
                          className="relative bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
                        >
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-3 right-3 bg-white/80 text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white hover:text-red-600 transition-all duration-200 shadow-md backdrop-blur-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-52 sm:h-60 object-cover" // Increased height
                          />
                          <div className="p-4 sm:p-6"> 
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate">{item.name}</h3>
                            <p className="text-[#B8956A] font-semibold text-lg sm:text-xl">₹{item.price}</p>
                            <Link
                              href={`/shop/${item.id}`}
                              className="mt-4 block bg-[#B8956A] text-white text-center py-2 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 shadow-sm text-base"
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedTab === "orders" && (
                <div className="animate-tab-content">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 font-serif">Your Orders</h2>
                  {ordersLoading ? (
                    <div className="text-center py-12 sm:py-16">Loading orders...</div>
                  ) : ordersError ? (
                    <div className="text-center py-12 sm:py-16 text-red-500">{ordersError}</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                      <svg className="mx-auto w-20 h-20 text-[#B8956A] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="text-gray-600 text-lg sm:text-xl">You have no orders yet.</p>
                      <Link
                        href="/shop"
                        className="inline-block mt-4 bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md text-base"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {orders.flatMap((order) => (
                        order.items.map((item: any, idx: number) => (
                          <div
                            key={order._id + '-' + idx}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200 shadow-sm border border-gray-200"
                          >
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                              <div>
                                <p className="font-semibold text-gray-900 text-lg sm:text-xl">{item.name}</p>
                                <p className="text-sm sm:text-base text-gray-600">Order #{order._id.slice(-6).toUpperCase()}</p>
                                <p className="text-sm sm:text-base text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm sm:text-base text-gray-600">Qty: {item.qty} | Price: ₹{item.price} | Subtotal: ₹{(item.price * item.qty).toFixed(2)}</p>
                                <p className="text-sm sm:text-base text-gray-600">Order Total: ₹{order.totalAmount.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                              <span
                                className={`text-sm sm:text-base font-semibold px-3 py-1 rounded-full ${
                                  order.orderStatus === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.orderStatus === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                              <button
                                className="text-[#B8956A] text-sm sm:text-base font-semibold hover:underline transition-all duration-300"
                                onClick={() => router.push(`/orders/${order._id}`)}
                              >
                                View Details
                              </button>
                              {order.orderStatus === "processing" && (
                                <button
                                  className="text-red-600 text-sm sm:text-base font-semibold hover:underline transition-all duration-300"
                                  onClick={() => handleCancelOrder(order._id)}
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  )}
                  {/* Order Details Modal */}
                  {orderDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full relative">
                        <button
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                          onClick={handleCloseOrderDetails}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4">Order #{orderDetails._id.slice(-6).toUpperCase()}</h3>
                        <p className="mb-2 text-gray-700">Date: {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                        <p className="mb-2 text-gray-700">Status: {orderDetails.orderStatus.charAt(0).toUpperCase() + orderDetails.orderStatus.slice(1)}</p>
                        <p className="mb-2 text-gray-700">Total: ₹{orderDetails.totalAmount.toFixed(2)}</p>
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Products:</h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="py-2">Image</th>
                                <th className="py-2">Name</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Qty</th>
                                <th className="py-2">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetails.items.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b last:border-b-0">
                                  <td className="py-2"><img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" /></td>
                                  <td className="py-2">{item.name}</td>
                                  <td className="py-2">₹{item.price}</td>
                                  <td className="py-2">{item.qty}</td>
                                  <td className="py-2">₹{(item.price * item.qty).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mb-2">
                          <h4 className="font-semibold mb-2">Shipping Address:</h4>
                          <p className="text-gray-700 text-sm">
                            {orderDetails.shippingAddress.fullName}, {orderDetails.shippingAddress.street}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}, {orderDetails.shippingAddress.zip}, {orderDetails.shippingAddress.country} ({orderDetails.shippingAddress.tag})
                          </p>
                        </div>
                        <div className="mb-2">
                          <h4 className="font-semibold mb-2">Payment:</h4>
                          <p className="text-gray-700 text-sm">Method: {orderDetails.paymentMethod}</p>
                          <p className="text-gray-700 text-sm">Status: <span className={orderDetails.paymentStatus === 'paid' ? 'text-green-600' : orderDetails.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}>{orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === "preferences" && null}
            </div>
          </main>
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tab-content {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-tab-content {
          animation: tab-content 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
