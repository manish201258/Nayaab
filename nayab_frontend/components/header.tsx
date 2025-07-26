"use client";

import { User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CartSidebar from "@/components/cart-sidebar";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLogin, loading, user } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;
  const router = useRouter();
  const pathname = usePathname();

  // Handle user click based on login state
  const handleUserClick = () => {
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push("/profile");
    }
  };

  // Banner messages (refined for clarity and appeal)
  const bannerMessages = [
    "Get 20% off your first order with code: 20%OFF",
    "Three-day sale! Get the deals rolling"
  ];

  return (
    <>
      {/* Show banner only on home page */}
      {pathname === "/" && (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#B8956A] via-[#A0845A] to-[#B8956A] text-white text-sm py-1 sm:py-2 font-sans shadow-lg rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" style={{ mixBlendMode: 'overlay' }} />
          {/* Fixed Mobile Number for Orders with Icon */}
          <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#A0845A]/90 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-1 sm:gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden sm:inline">Order Now: +1-800-123-4567</span>
            <span className="sm:hidden">Call Now</span>
          </div>
          <div className="marquee-outer">
            <div className="marquee-inner">
              {bannerMessages.map((msg, index) => (
                <span
                  key={index}
                  className="mx-4 sm:mx-6 md:mx-12 text-center font-bold tracking-wider animate-fade-in hover:scale-105 transition-transform duration-200"
                  style={{
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    textShadow: '0 2px 6px rgba(0,0,0,0.3), 0 0 10px #fff6',
                    color: '#ffffff',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {msg}
                </span>
              ))}
              {bannerMessages.map((msg, index) => (
                <span
                  key={'dup-' + index}
                  className="mx-4 sm:mx-6 md:mx-12 text-center font-bold tracking-wider animate-fade-in hover:scale-105 transition-transform duration-200"
                  style={{
                    fontSize: '0.875rem',
                    letterSpacing: '0.05em',
                    textShadow: '0 2px 6px rgba(0,0,0,0.3), 0 0 10px #fff6',
                    color: '#ffffff',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {msg}
                </span>
              ))}
            </div>
          </div>
          <style jsx>{`
            .marquee-outer {
              width: 100%;
              overflow: hidden;
              position: relative;
              padding-right: 80px;
            }
            @media (min-width: 640px) {
              .marquee-outer {
                padding-right: 120px;
              }
            }
            @media (min-width: 768px) {
              .marquee-outer {
                padding-right: 240px;
              }
            }
            .marquee-inner {
              display: flex;
              width: max-content;
              animation: marquee-rtl 50s linear infinite;
              will-change: transform;
            }
            @keyframes marquee-rtl {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 relative font-serif z-[9999]">
        <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-16 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
              <Link href="/">
                <span className="text-[#B8956A]">Nayaab</span> Co.
              </Link>
              <div className="text-xs sm:text-sm text-gray-600 font-normal italic">Antique Boutique</div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 md:space-x-8 text-base md:text-lg">
              <Link href="/" className="hover:text-[#B8956A] font-medium">
                HOME
              </Link>
              <Link href="/about" className="hover:text-[#B8956A]">
                ABOUT US
              </Link>
              <Link href="/shop" className="hover:text-[#B8956A] font-medium">
                SHOP
              </Link>
              <Link href="/blogs" className="hover:text-[#B8956A]">
                BLOGS
              </Link>
              <Link href="/contact" className="hover:text-[#B8956A]">
                CONTACT
              </Link>
              <Link href="/faq" className="hover:text-[#B8956A]">
                FAQ
              </Link>
            </nav>

            {/* Desktop Icons and buttons */}
            <div className="hidden lg:flex items-center space-x-4 md:space-x-6">
              <button onClick={handleUserClick} className="focus:outline-none group relative">
                <User className="w-6 h-6 md:w-7 md:h-7 text-gray-600 hover:text-[#B8956A] transition-colors duration-300 transform hover:scale-110" />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Profile</span>
              </button>
              <div className="relative group">
                <Link href="/wishlist" className="focus:outline-none relative">
                  <Heart className="w-6 h-6 md:w-7 md:h-7 text-gray-600 hover:text-[#B8956A] transition-colors duration-300 transform hover:scale-110" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#B8956A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Wishlist</span>
              </div>
              <div className="relative group">
                <button
                  className="relative focus:outline-none"
                  onClick={() => setCartSidebarOpen(true)}
                  aria-label="Open cart"
                >
                  <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-gray-600 hover:text-[#B8956A] transition-colors duration-300 transform hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#B8956A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cart</span>
              </div>
              {/* Auth buttons */}
              {!loading && !isLogin ? (
                <div className="auth-buttons flex gap-2 md:gap-3">
                  <button
                    className="signup-btn bg-[#B8956A] hover:bg-[#A0845A] text-white rounded-full px-4 md:px-6 py-2 font-semibold shadow-lg transition-all duration-300 border border-[#B8956A] hover:scale-105 hover:shadow-xl text-sm md:text-base"
                    onClick={() => router.push("/signup")}
                  >
                    Sign Up
                  </button>
                  <button
                    className="login-btn bg-white hover:bg-[#f7f5ef] text-[#B8956A] rounded-full px-4 md:px-6 py-2 font-semibold shadow-lg transition-all duration-300 border border-[#B8956A] hover:scale-105 hover:shadow-xl text-sm md:text-base"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                </div>
              ) : null}
            </div>

            {/* Mobile Icons and Menu Button */}
            <div className="flex lg:hidden items-center space-x-1 sm:space-x-2 md:space-x-3">
              {/* Mobile Icons */}
              <button onClick={handleUserClick} className="focus:outline-none p-1 md:p-2">
                <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
              <Link href="/wishlist" className="focus:outline-none relative p-1 md:p-2">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B8956A] text-white text-xs rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                className="relative focus:outline-none p-1 md:p-2 z-10"
                onClick={() => setCartSidebarOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B8956A] text-white text-xs rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 md:p-2 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-3 md:mt-4 pb-4 border-t border-gray-200`}>
            <nav className="flex flex-col space-y-3 md:space-y-4 pt-3 md:pt-4">
              <Link 
                href="/" 
                className="text-gray-800 hover:text-[#B8956A] font-medium py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link 
                href="/about" 
                className="text-gray-800 hover:text-[#B8956A] py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT US
              </Link>
              <Link 
                href="/shop" 
                className="text-gray-800 hover:text-[#B8956A] font-medium py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                SHOP
              </Link>
              <Link 
                href="/blogs" 
                className="text-gray-800 hover:text-[#B8956A] py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                BLOGS
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-800 hover:text-[#B8956A] py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/wishlist" 
                className="text-gray-800 hover:text-[#B8956A] py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                WISHLIST
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-800 hover:text-[#B8956A] py-1 md:py-2 text-sm md:text-base"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              
              {/* Mobile Auth Buttons */}
              {!loading && !isLogin && (
                <div className="flex flex-col space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-gray-200">
                  <button
                    className="bg-[#B8956A] text-white rounded-lg px-3 md:px-4 py-2 md:py-3 font-semibold shadow-lg transition-all duration-300 text-sm md:text-base"
                    onClick={() => {
                      router.push("/signup");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                  <button
                    className="bg-white text-[#B8956A] rounded-lg px-3 md:px-4 py-2 md:py-3 font-semibold shadow-lg transition-all duration-300 border border-[#B8956A] text-sm md:text-base"
                    onClick={() => {
                      router.push("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />
    </>
  );
}
