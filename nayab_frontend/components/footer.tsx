"use client"

import { ArrowUp, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-[#F5F3F0] mt-auto">
      {/* Main footer content */}
      <div className="py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          {/* Company Info - Horizontal */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">
                <span className="text-[#B8956A]">Nayaab</span> Co.
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium tracking-wider mb-2">ANTIQUE BOUTIQUE</div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                Curating timeless treasures for collectors.
              </p>
            </div>
            
            {/* Contact Info - Horizontal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#B8956A]" />
                <span className="text-xs sm:text-sm text-gray-600">+1-800-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#B8956A]" />
                <span className="text-xs sm:text-sm text-gray-600">info@nayaab.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Links - Horizontal */}
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Home
              </Link>
              <Link href="/shop" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Shop
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                About Us
              </Link>
              <Link href="/blogs" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Blogs
              </Link>
            </div>

            {/* Customer Service */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/contact" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Contact Us
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                FAQs
              </Link>
              <Link href="/wishlist" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Wishlist
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                My Account
              </Link>
            </div>

            {/* Policies */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/return-policy" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Return Policy
              </Link>
              <Link href="/privacy-policy" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Terms & Conditions
              </Link>
              <Link href="/shipping-info" className="text-gray-600 hover:text-[#B8956A] transition-colors text-xs sm:text-sm">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-[#B8956A]/10 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="text-center max-w-sm mx-auto">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Stay Updated</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3">Get notified about new arrivals</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-xs mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] text-xs sm:text-sm"
              />
              <button className="bg-[#B8956A] hover:bg-[#A0845A] text-white px-4 py-1.5 rounded-lg font-medium transition-colors text-xs sm:text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="border-t border-gray-200 py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm">Copyright © 2024 | Nayaab Co.</p>
            <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <Link href="/privacy-policy" className="hover:text-[#B8956A] transition-colors">Privacy</Link>
              <Link href="/terms-conditions" className="hover:text-[#B8956A] transition-colors">Terms</Link>
              <Link href="/cookie-policy" className="hover:text-[#B8956A] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 bg-[#B8956A] hover:bg-[#A0845A] text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </footer>
  )
}
