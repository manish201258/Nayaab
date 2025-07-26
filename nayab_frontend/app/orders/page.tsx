"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/authContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { FaShoppingBag, FaCheck, FaClock, FaTruck, FaTimes } from "react-icons/fa";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface Order {
  _id: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    };
    qty: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
}

export default function OrdersPage() {
  const { user, token, isLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.replace("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [isLogin, token, router]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheck className="text-green-500" />;
      case 'in progress':
        return <FaClock className="text-yellow-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaShoppingBag className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'in progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isLogin) {
    return null;
  }

  return (
    <>
      <Header />
      
      {/* Banner */}
      <div className="relative h-64 w-full flex items-center overflow-hidden" style={{ backgroundImage: 'url(/images/about-us-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-6 md:px-16 flex justify-between items-center h-full">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg animate-fade-in">
            My Orders
          </h1>
          <div className="text-white text-lg flex gap-3 items-center font-medium">
            <Link href="/" className="hover:text-[#B8956A] transition-colors">
              Home
            </Link>
            <span className="text-[#B8956A]">/</span>
            <span>Orders</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-[#f7f5ef] to-white min-h-[80vh] py-16">
        <div className="container mx-auto px-6 md:px-16">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No Orders Yet</h2>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
              <Link 
                href="/shop" 
                className="bg-[#B8956A] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#A0845A] transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h2>
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.product.images && item.product.images.length > 0 
                            ? `${backendUrl}${item.product.images[0]}` 
                            : "/placeholder.svg"} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                          <p className="text-sm text-gray-600">₹{item.product.price * item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Shipping Address:</p>
                        <p className="text-sm text-gray-800">{order.shippingAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Payment Method:</p>
                        <p className="text-sm text-gray-800 capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Link 
                        href={`/orders/${order._id}`}
                        className="text-[#B8956A] hover:text-[#A0845A] font-medium"
                      >
                        View Details
                      </Link>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount:</p>
                        <p className="text-lg font-bold text-gray-800">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
} 