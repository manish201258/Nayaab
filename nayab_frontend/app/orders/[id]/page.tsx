"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import axios from "axios";
// Assuming Heroicons is installed for icons
import { ChevronLeftIcon, TruckIcon, CreditCardIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${backendUrl}/user/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId, backendUrl]);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] bg-gradient-to-b from-[#f7f5ef] to-white py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-8 max-w-4xl">
          <Link href="/profile?tab=orders" className="text-[#B8956A] hover:underline text-xs sm:text-sm mb-3 sm:mb-4 inline-flex items-center transition-colors duration-300">
            <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Back to Orders
          </Link>
          {loading ? (
            <div className="text-center py-8 sm:py-12 animate-pulse text-sm sm:text-base">Loading order details...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 sm:py-12 bg-red-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base">{error}</div>
          ) : order ? (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs sm:text-sm font-semibold px-2 sm:px-4 py-1 sm:py-1.5 rounded-full transition-all duration-300 ${
                  order.orderStatus === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
              {/* Tracking Progress */}
              <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base"><TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" /> Order Tracking</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2 sm:mb-3 overflow-hidden">
                  <div className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                    order.orderStatus === "delivered"
                      ? "bg-green-500 w-full"
                      : order.orderStatus === "shipped"
                      ? "bg-yellow-500 w-2/3"
                      : order.orderStatus === "processing"
                      ? "bg-blue-400 w-1/3"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-400 w-full"
                      : "bg-gray-400 w-1/6"
                  }`}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>
              {/* Products Table */}
              <div className="mb-4 sm:mb-6">
                <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Products</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-1 sm:border-spacing-y-2 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100 rounded-lg">
                        <th className="py-2 sm:py-3 px-2 sm:px-4 rounded-l-lg">Image</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-4">Name</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-4">Price</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-4">Qty</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-4 rounded-r-lg">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: any, idx: number) => (
                        <tr key={idx} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 rounded-l-lg"><img src={item.image} alt={item.name} className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-md shadow-sm" /></td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4">{item.name}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4">₹{item.price}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4">{item.qty}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 rounded-r-lg">₹{(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Shipping Address */}
              <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Shipping Address</h4>
                <p className="text-gray-700 text-xs sm:text-sm">
                  {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zip}, {order.shippingAddress.country} ({order.shippingAddress.tag})
                </p>
              </div>
              {/* Payment Info */}
              <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center text-sm sm:text-base"><CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" /> Payment</h4>
                <p className="text-gray-700 text-xs sm:text-sm">Method: {order.paymentMethod}</p>
                <p className="text-gray-700 text-xs sm:text-sm">Status: <span className={order.paymentStatus === 'paid' ? 'text-green-600' : order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}>{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span></p>
              </div>
              {/* Order Total */}
              <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg flex justify-between items-center">
                <h4 className="font-semibold text-sm sm:text-base">Order Total</h4>
                <p className="text-gray-900 text-base sm:text-lg font-bold flex items-center"><CurrencyRupeeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> {order.totalAmount.toFixed(2)}</p>
              </div>
              {/* Support/Help */}
              <div className="mt-4 sm:mt-6 text-center border-t pt-3 sm:pt-4">
                <p className="text-gray-500 text-xs sm:text-sm">Need help? <Link href="/contact" className="text-[#B8956A] hover:underline transition-colors duration-300">Contact Support</Link></p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
