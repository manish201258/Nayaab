"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { FaHeart, FaCheck, FaTimes, FaShareAlt, FaSortAmountDown, FaFilter } from "react-icons/fa";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/context/wishlistContext";
import CartSidebar from "@/components/cart-sidebar";
import Link from "next/link";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const getImageUrl = (img: string | undefined) =>
  img && img.startsWith("http")
    ? img
    : img
      ? `${backendUrl}${img}`
      : "/placeholder.svg";

const initialWishlist = [
  {
    id: 1,
    brand: "Louis Vuitton",
    name: "Star Trail ankle boot 8CM",
    description: "Louis Vuitton's emblematic Star Trail ankle boot 8CM",
    price: 1350,
    oldPrice: 1359,
    image: "/images/watch.webp",
    discount: "10% Off",
    isAddedToBag: false,
  },
  {
    id: 2,
    brand: "Prada",
    name: "Re-edition 2005 saffiano leather bag",
    description: "Prada re-edition 2005 saffiano leather bag medium size bag",
    price: 1990,
    image: "/images/handbag.webp",
    isAddedToBag: true,
  },
  {
    id: 3,
    brand: "Valentino",
    name: "Small roman stud the handle bag in nappa",
    description: "Small roman stud the handle bag in nappa",
    price: 3150,
    image: "/images/sunglasses.webp",
    isAddedToBag: false,
  },
];

export default function WishlistPage() {
  const { addToCart, cart } = useCart();
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const { wishlist, removeFromWishlist, addToWishlist, isWishlisted } = useWishlist();
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // Added sorting
  const [filterBy, setFilterBy] = useState("all"); // Added filtering
  const [totalValue, setTotalValue] = useState(0); // Added total value calculation

  useEffect(() => {
    // Calculate total value with animation trigger
    const value = wishlist.reduce((sum, item) => sum + item.price, 0);
    setTotalValue(value);
  }, [wishlist]);

  const isInCart = (id: number | string) => cart.some((item) => String(item.id) === String(id));

  const removeItem = (id: string) => removeFromWishlist(id);
  const addToBag = (id: number) => {
    const item = wishlist.find((item) => String(item.id) === String(id));
    if (item) {
      addToCart({
        id: String(item.id),
        name: item.name,
        price: item.price,
        qty: 1,
        image: item.image,
      });
      toast && toast({ title: "Added to Cart", description: `${item.name} has been added to your cart.` });
    }
  };
  const moveAllToBag = () => {
    wishlist.forEach((item) => {
      addToCart({
        id: String(item.id),
        name: item.name,
        price: item.price,
        qty: 1,
        image: item.image,
      });
    });
    toast && toast({ title: "All items added to Cart", description: `All wishlist items have been added to your cart.` });
  };

  const shareWishlist = () => {
    // Placeholder for sharing logic (e.g., generate link)
    toast && toast({ title: "Wishlist Shared", description: "Your wishlist link has been copied to clipboard." });
  };

  // Sorting and Filtering Logic
  let displayedWishlist = [...wishlist];
  if (filterBy === "addedToBag") {
    displayedWishlist = displayedWishlist.filter((item) => isInCart(item.id));
  } else if (filterBy === "discounted") {
    displayedWishlist = displayedWishlist.filter((item) => item.discount);
  }

  if (sortBy === "priceLow") {
    displayedWishlist.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    displayedWishlist.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    displayedWishlist.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <>
      <Header />
      {/* Modern Banner: Gradient with animation */}
      <div className="relative bg-gradient-to-br from-[#2e2e2e] to-[#1a1a1a] text-white py-16 sm:py-20 px-6 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight mb-4 animate-fade-in-down">
            Your Wishlist <span className="text-[#B8956A]">({wishlist.length})</span>
          </h1>
          <p className="text-lg sm:text-xl opacity-80 animate-fade-in-up max-w-2xl mx-auto">
            Curate your favorite antiques and treasures in one place.
          </p>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8956A]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8956A]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-b from-[#f7f5ef] to-white min-h-[80vh] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-16">
          {/* Controls: Modern toolbar with sorting, filtering, and actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 sm:gap-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-serif">
              Wishlist Items
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-white text-gray-800 shadow-sm transition-all text-base flex items-center gap-2"
              >
                <option value="name">Sort by Name</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-white text-gray-800 shadow-sm transition-all text-base flex items-center gap-2"
              >
                <option value="all">All Items</option>
                <option value="addedToBag">Added to Bag</option>
                <option value="discounted">Discounted</option>
              </select>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[#B8956A] hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md"
                onClick={shareWishlist}
              >
                <FaShareAlt /> Share Wishlist
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white ${
                  wishlist.length === 0 || wishlist.every((item) => isInCart(item.id))
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B8956A] hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md"
                }`}
                onClick={moveAllToBag}
                disabled={wishlist.length === 0 || wishlist.every((item) => isInCart(item.id))}
              >
                <FaHeart /> Move All to Bag
              </button>
            </div>
          </div>

       

          {/* Wishlist Items */}
          {displayedWishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {displayedWishlist.map((item, index) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Discount Badge */}
                  {item.discount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-sm">
                      {item.discount}
                    </span>
                  )}
                  {/* Remove Button */}
                  <button
                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200 z-10 shadow-md backdrop-blur-sm hover:bg-white"
                    onClick={() => removeItem(String(item.id))}
                    aria-label="Remove from wishlist"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                  {/* Product Image */}
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Product Info */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 truncate">{item.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-[#B8956A]">
                        ${item.price.toLocaleString()}
                      </span>
                      {item.oldPrice && (
                        <span className="text-gray-400 line-through text-sm sm:text-base">${item.oldPrice}</span>
                      )}
                    </div>
                    {/* Add to Bag or Go to Cart button */}
                    {isInCart(item.id) ? (
                      <button
                        className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors bg-black text-white hover:bg-gray-900 shadow-md"
                        onClick={() => setCartSidebarOpen(true)}
                      >
                        <FaCheck className="text-green-500" /> Go to Cart
                      </button>
                    ) : (
                      <button
                        className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors bg-[#B8956A] text-white hover:bg-[#A0845A] shadow-md"
                        onClick={() => addToBag(item.id)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center transform hover:scale-105 transition-transform duration-300 max-w-2xl mx-auto">
              <FaHeart className="text-[#B8956A] text-6xl sm:text-7xl mx-auto mb-6 animate-pulse" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-serif">
                Your Wishlist is Empty
              </div>
              <div className="text-gray-500 mb-8 text-base sm:text-lg max-w-md mx-auto">
                Discover timeless antiques and add your favorites to build your collection.
              </div>
              <Link
                href="/shop"
                className="inline-block bg-[#B8956A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105 shadow-md text-base sm:text-lg"
              >
                Explore Shop
              </Link>
            </div>
          )}
          {/* Wishlist Stats: Modern cards with animations */}
          {displayedWishlist.length > 0 && (
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-[#B8956A]/10 p-6 rounded-2xl text-center shadow-sm animate-fade-in-up">
                <p className="text-[#B8956A] text-3xl font-bold mb-2">{wishlist.length}</p>
                <p className="text-gray-600 text-lg">Items in Wishlist</p>
              </div>
              <div className="bg-[#B8956A]/10 p-6 rounded-2xl text-center shadow-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <p className="text-[#B8956A] text-3xl font-bold mb-2">${totalValue.toLocaleString()}</p>
                <p className="text-gray-600 text-lg">Total Value</p>
              </div>
              <div className="bg-[#B8956A]/10 p-6 rounded-2xl text-center shadow-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <p className="text-[#B8956A] text-3xl font-bold mb-2">
                  {wishlist.filter((item) => isInCart(item.id)).length}
                </p>
                <p className="text-gray-600 text-lg">In Cart</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
