"use client";
import { useState, useEffect } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CartSidebar = dynamic(() => import("@/components/cart-sidebar"), { ssr: false });

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
}

export default function CollectionSection() {
  const [activeTab, setActiveTab] = useState<"TRENDING" | "NEW ARRIVED">("TRENDING");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Scroll animation refs and hooks
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 }); // Trigger when 20% in view

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${backendUrl}/api/user/products`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok && data.products) {
          setProducts(data.products);
        } else {
          throw new Error(data.message || "Failed to load products");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred while fetching products";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  // Filtering logic
  let filteredProducts: Product[] = [];
  if (activeTab === "TRENDING") {
    filteredProducts = products.filter((p) => p.featured);
    if (filteredProducts.length === 0 && products.length > 0) {
      filteredProducts = products; // Fallback to all
    }
  } else {
    filteredProducts = products
      .slice()
      .sort((a, b) =>
        (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
        (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
      );
  }
  const showProducts = filteredProducts.slice(0, 4); // Show only 4 products

  const inCart = (id: string) => cart.some((item: any) => item.id === id);

  function getImageUrl(product: Product) {
    const image = product.images?.[0] || product.image;
    if (!image || image.trim() === "") {
      return "/images/placeholder-logo.png";
    }
    if (/^https?:\/\//i.test(image)) {
      return image;
    }
    const backend = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const path = image.startsWith("/") ? image : "/" + image;
    return backend + path;
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: getImageUrl(product),
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
    // Does NOT open sidebar
  };

  const handleGoToCart = () => setCartSidebarOpen(true);

  const handleToggleWishlist = (product: Product) => {
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product),
    };
    toggleWishlist(item);
    if (isWishlisted(product._id)) {
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  // Updated animation variants: Slide from top only (no shifting/left-right)
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Come from top
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.2, ease: "easeOut" as const }, // Staggered one-by-one
    }),
  };

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-[#F7F5F0]/50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Header & Tabs with improved design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          {/* Main Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
              Our <span className="text-[#B8956A]">Collection</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of timeless antique treasures
            </p>
          </div>

          {/* Tab Buttons - Centered and Responsive */}
          <div className="flex justify-center gap-2 sm:gap-4">
            <Button
              variant={activeTab === "TRENDING" ? "default" : "outline"}
              className={`${
                activeTab === "TRENDING" 
                  ? "bg-[#B8956A] text-white shadow-md" 
                  : "text-gray-600 hover:text-[#B8956A] border-gray-300"
              } rounded-full transition-all duration-300 text-xs sm:text-sm px-4 sm:px-6 py-2`}
              onClick={() => setActiveTab("TRENDING")}
            >
              Trending
            </Button>
            <Button
              variant={activeTab === "NEW ARRIVED" ? "default" : "outline"}
              className={`${
                activeTab === "NEW ARRIVED" 
                  ? "bg-[#B8956A] text-white shadow-md" 
                  : "text-gray-600 hover:text-[#B8956A] border-gray-300"
              } rounded-full transition-all duration-300 text-xs sm:text-sm px-4 sm:px-6 py-2`}
              onClick={() => setActiveTab("NEW ARRIVED")}
            >
              New Arrivals
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8956A]"></div>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Loading collection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          </div>
        ) : showProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-sm sm:text-base">No items available in this collection.</p>
          </div>
        ) : (
          <>
            {/* Responsive Product Grid - Scrollable on mobile, grid on larger screens */}
            <div className="flex overflow-x-auto gap-4 sm:gap-6 md:gap-8 pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
              {showProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  custom={index}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={cardVariants}
                  className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden min-w-[240px] sm:min-w-0 flex-shrink-0 sm:flex-shrink snap-center"
                >
                  {/* Wishlist Icon */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleWishlist(product)}
                      className="p-1 sm:p-1.5 md:p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                      aria-label={`${isWishlisted(product._id) ? 'Remove' : 'Add'} ${product.name} to wishlist`}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                          isWishlisted(product._id) 
                            ? "text-[#B8956A] fill-[#B8956A]" 
                            : "text-gray-600"
                        } transition-colors duration-300`}
                      />
                    </Button>
                  </div>

                  {/* Image with improved hover effect */}
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      width={240}
                      height={240}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 sm:p-3 md:p-4">
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-[#B8956A] transition-colors duration-300 mb-1 sm:mb-2">
                        {product.name}
                      </h3>
                      <p className="text-[#B8956A] font-bold text-xs sm:text-sm md:text-base">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <Button
                      className="w-full rounded-full transition-all duration-300 text-xs sm:text-sm py-1.5 sm:py-2"
                      variant={inCart(product._id) ? "secondary" : "default"}
                      onClick={() =>
                        inCart(product._id)
                          ? handleGoToCart()
                          : handleAddToCart(product)
                      }
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : inCart(product._id)
                          ? "Go to Cart"
                          : "Add to Cart"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* More Products Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-6 sm:mt-8 md:mt-12"
            >
              <Button 
                variant="outline" 
                asChild 
                className="rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base hover:bg-[#B8956A] hover:text-white transition-all duration-300 border-[#B8956A] text-[#B8956A]"
              >
                <Link href="/shop">
                  View All Products <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </>
        )}
      </div>
      {/* Cart Sidebar */}
      <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />
    </section>
  );
}
