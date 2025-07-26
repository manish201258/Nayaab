"use client";

import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaTag } from "react-icons/fa";

export default function CartSidebar({ open, onClose }) {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Mock coupon logic - you can replace with actual API call
      if (couponCode.toLowerCase() === "discount10") {
        setAppliedCoupon({ code: couponCode, discount: 10 });
        setCouponCode("");
      } else {
        alert("Invalid coupon code");
      }
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay: Modern fade-in with blur */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-72 md:w-80 lg:w-96 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-[#F7F5F0]">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <FaTimes className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-32">
          {cart.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-gray-400 text-3xl sm:text-4xl mb-2 sm:mb-3">🛒</div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Your cart is empty</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Add some items to get started!</p>
              <button
                onClick={onClose}
                className="bg-[#B8956A] hover:bg-[#A0845A] text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      ${item.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors text-xs"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium text-gray-800 min-w-[16px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors text-xs"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed at Bottom */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3 sm:p-4 bg-[#F7F5F0]">
            {/* Coupon Section */}
            <div className="mb-3 sm:mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg mb-2">
                  <div className="flex items-center gap-2">
                    <FaTag className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">
                      {appliedCoupon.code} applied (-${(total * appliedCoupon.discount / 100).toFixed(2)})
                    </span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#B8956A] focus:border-[#B8956A]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-[#B8956A] hover:bg-[#A0845A] text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm font-medium text-gray-800">Total:</span>
              <span className="text-base sm:text-lg font-bold text-[#B8956A]">
                ${appliedCoupon ? (total * (1 - appliedCoupon.discount / 100)).toFixed(2) : total.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                className="block w-full bg-[#B8956A] hover:bg-[#A0845A] text-white text-center py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={onClose}
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 px-3 sm:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
