"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useCart } from "@/context/cartContext";
import { useState, useEffect } from "react";
import { FaCheck, FaPlus, FaMinus, FaTimes, FaCreditCard, FaWallet, FaUniversity, FaMoneyBillWave, FaTag, FaLock, FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation"; // Added import for useRouter

type UserWithAddress = {
  _id?: string;
  address?: string;
  id?: string; // Added to match user.id
  [key: string]: any;
};

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'; // Removed duplicate
const placeholder = "/placeholder.svg";
const getImageUrl = (img: string | undefined) =>
  img && img.startsWith("http")
    ? img
    : img
      ? `${backendUrl}${img}`
      : placeholder;

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, token, isLogin, loading } = useAuth(); // Fixed usage (removed ternary)
  const [userWithAddress, setUserWithAddress] = useState<UserWithAddress | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter(); // Proper hook usage
  const [useDirectBuy, setUseDirectBuy] = useState(false);
  const [directBuyItem, setDirectBuyItem] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Route protection: redirect if not logged in or cart is empty (and not direct buy)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Wait for auth to be checked and not loading
    if (isLogin === undefined || loading) return;
    
    setAuthChecked(true);
    
    if (!isLogin) {
      router.replace("/login");
      return;
    }
    
    const directBuy = JSON.parse(localStorage.getItem("directBuy") || "null");
    const isCartEmpty = !directBuy && (!cart || cart.length === 0);
    
    if (isCartEmpty) {
      router.replace("/shop");
    }
  }, [isLogin, cart, router, loading]);

  useEffect(() => {
    const directBuy = JSON.parse(localStorage.getItem("directBuy") || "null");
    if (directBuy) {
      setUseDirectBuy(true);
      setDirectBuyItem(directBuy);
    } else {
      setUseDirectBuy(false);
      setDirectBuyItem(null);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id || !token) return; // Guard against missing id/token
      try {
        const res = await axios.get(`${backendUrl}/user/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserWithAddress(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        // Optionally set error state
      }
    };
    fetchUser();
  }, [user, token]);

  // Remove the cleanup effect that was causing redirects
  // useEffect(() => {
  //   return () => {
  //     // Clear directBuy if user navigates away from checkout
  //     localStorage.removeItem('directBuy');
  //   };
  // }, []);

  // Update subtotal calculation:
  const showDirectBuy = useDirectBuy && directBuyItem && cart.length === 0;
  const subtotal = showDirectBuy
    ? directBuyItem.price * (directBuyItem.qty || 1)
    : cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 50; // Placeholder
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    // Placeholder logic
    if (couponCode === "ANTIQUE10") {
      setDiscount(subtotal * 0.1);
    }
  };

  const placeOrder = async () => {
    setOrderLoading(true);
    setError(null);
    try {
      if (!isLogin || !token) {
        setError("Please log in to place an order.");
        setOrderLoading(false);
        return;
      }
      if (!paymentMethod) {
        setError("Please select a payment method.");
        setOrderLoading(false);
        return;
      }
      const shippingAddress = "Sharma PG near ryan international school , sitapura";
      const response = await axios.post(
        `${backendUrl}/user/checkout`,
        {
          items: showDirectBuy && directBuyItem && cart.length === 0
            ? [{ product: directBuyItem.id, qty: directBuyItem.qty || 1 }]
            : cart.map(item => ({ product: item.id, qty: item.qty })),
          shippingAddress,
          paymentMethod,
          directBuy: useDirectBuy,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      localStorage.removeItem('directBuy'); // Clear direct buy after order
      setOrderSuccess(true);
      setOrderId(response.data._id);
      router.replace(`/`); // Redirect to home page after successful order
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Order failed");
    } finally {
      setOrderLoading(false);
    }
  };

  // Show loading while auth is being checked
  if (!authChecked || isLogin === undefined || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <div className="bg-white p-8 rounded shadow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8956A] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Add a login prompt if not logged in
  if (!isLogin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to proceed to checkout</h2>
          <Link href="/login" className="text-[#B8956A] underline">Go to Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      {/* Banner */}
      <div className="relative h-64 w-full flex items-center overflow-hidden" style={{ backgroundImage: 'url(/images/about-us-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-6 md:px-16 flex justify-between items-center h-full">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg animate-fade-in">
            Checkout
          </h1>
          <div className="text-white text-lg flex gap-3 items-center font-medium">
            <Link href="/" className="hover:text-[#B8956A] transition-colors">
              Home
            </Link>
            <span className="text-[#B8956A]">/</span>
            <span>Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-[#f7f5ef] to-white min-h-[80vh] py-16">
        <div className="container mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-8">
          {/* Left: Steps */}
          <div className="flex-1 space-y-8">
            {/* Step 1: Show Shipping Address from Profile */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#B8956A]" /> Shipping Address
              </h2>
              {userWithAddress?.address ? (
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                  <strong>Shipping Address:</strong> {userWithAddress.address}
                  <div className="text-xs text-gray-500">(This address is from your profile. To update, edit your profile.)</div>
                </div>
              ) : (
                <div className="text-red-500 italic">No address found. Please add your address in your profile before checkout.</div>
              )}
            </div>

            {/* Step 2: Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaShoppingBag className="text-[#B8956A]" /> Order Summary
              </h2>
              {showDirectBuy ? (
                <div className="flex items-center gap-4 border-b py-4">
                  <img src={getImageUrl(directBuyItem.image)} alt={directBuyItem.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{directBuyItem.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {directBuyItem.qty || 1} | Price: ₹{directBuyItem.price * (directBuyItem.qty || 1)}</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b py-4">
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.qty} | Price: ₹{item.price * item.qty}</p>
                      <div className="flex gap-4 mt-2 text-sm text-[#B8956A]">
                        <button onClick={() => removeFromCart(item.id)}>REMOVE</button>
                        <button>SAVE FOR LATER</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Step 3: Payment Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaCreditCard className="text-[#B8956A]" /> Payment Options
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                  <FaWallet /> UPI
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === "wallet"} onChange={() => setPaymentMethod("wallet")} />
                  <FaMoneyBillWave /> Wallets
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  <FaCreditCard /> Credit/Debit/ATM Card
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} />
                  <FaUniversity /> Net Banking
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  <FaShoppingBag /> Cash on Delivery
                </label>
              </div>
            </div>
          </div>

          {/* Right: Sticky Price Details */}
          <div className="lg:w-80 bg-white rounded-lg shadow-md p-6 sticky top-20 h-fit">
            <h3 className="font-bold mb-4">PRICE DETAILS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Price ({useDirectBuy && directBuyItem ? (directBuyItem.qty || 1) : cart.length} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">-₹{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 text-green-600 text-sm">You will save ₹{discount.toFixed(2)} on this order</div>
                         <button
               onClick={placeOrder}
               className="w-full bg-[#B8956A] text-white py-3 rounded-md font-bold mt-6 hover:bg-[#A0845A] transition-colors"
               disabled={orderLoading}
             >
               {orderLoading ? "Placing Order..." : "PLACE ORDER"}
             </button>
            {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
            <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
              <FaLock /> Safe and Secure Payments. Easy returns. 100% Authentic products.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
