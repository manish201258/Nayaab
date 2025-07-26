"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AntiqueProductCard, AntiqueProduct } from "@/components/AntiqueProductCard";
import { useCart } from "@/context/cartContext";
import CartSidebar from "@/components/cart-sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = typeof params.slug === "string" ? params.slug : (Array.isArray(params.slug) ? params.slug[0] : "all");

  // CATEGORY TO SUBCATEGORY MAPPING (sync with admin)
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || "all"); // Main category from slug
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all"); // Subcategory filter
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState<string>("az");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [priceInput, setPriceInput] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [imageIndexes, setImageIndexes] = useState<{ [id: string]: number }>({});
  const { addToCart, cart } = useCart();
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for categories from backend
  const [categories, setCategories] = useState<{ name: string; subcategories: string[] }[]>([]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${backendUrl}/api/user/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        if (data.products && data.products.length > 0) {
          const prices = data.products.map((p: any) => Number(p.price));
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    fetch(`${backendUrl}/api/user/categories`)
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  // Update selectedCategory when slug changes
  useEffect(() => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategory("all"); // Reset subcategory on main category change
    setCurrentPage(1);
  }, [categorySlug]);

  // When main category changes, reset subcategory
  useEffect(() => {
    setSelectedSubcategory("all");
    setCurrentPage(1);
  }, [selectedCategory]);

  // Category and subcategory options
  const categoryOptions = categories.map(cat => cat.name);
  const subcategoryOptions =
    categories.find(cat => cat.name === selectedCategory)?.subcategories || [];

  // Compute product counts for categories and subcategories
  const categoryProductCounts: Record<string, number> = {};
  categories.forEach(cat => {
    categoryProductCounts[cat.name] = products.filter(p => p.category === cat.name).length;
  });
  const subcategoryProductCounts: Record<string, Record<string, number>> = {};
  categories.forEach(cat => {
    subcategoryProductCounts[cat.name] = {};
    cat.subcategories.forEach(subcat => {
      subcategoryProductCounts[cat.name][subcat] = products.filter(p => p.category === cat.name && p.subcategory === subcat).length;
    });
  });

  // Filtering logic: Now uses selectedCategory and selectedSubcategory from backend data
  let filteredProducts = products.filter((product) => {
    const inCategory =
      selectedCategory === "all" ||
      (product.category && product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
    const inSubcategory =
      selectedSubcategory === "all" ||
      (product.subcategory && product.subcategory.trim().toLowerCase() === selectedSubcategory.trim().toLowerCase());
    const price = Number(product.price);
    const min = priceInput.from ? Number(priceInput.from) : priceRange[0];
    const max = priceInput.to ? Number(priceInput.to) : priceRange[1];
    const inPrice = price >= min && price <= max;
    let filterMatch = true;
    if (productFilter === "featured") filterMatch = !!product.featured;
    else if (productFilter === "inStock") filterMatch = Number(product.stock) > 0 || product.inStock;
    else if (productFilter === "outOfStock") filterMatch = !(Number(product.stock) > 0 || product.inStock);
    return inCategory && inSubcategory && inPrice && filterMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProducts.length, totalPages]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]));
  };

  const handlePrevImage = (id: string, images: string[]) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : images.length - 1,
    }));
  };

  const handleNextImage = (id: string, images: string[]) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: prev[id] < images.length - 1 ? prev[id] + 1 : 0,
    }));
  };

  const fallbackProducts: AntiqueProduct[] = [
    {
      id: "demo1",
      name: "Victorian Silver Locket",
      description: "A beautiful Victorian-era silver locket with intricate engravings.",
      price: 320,
      originalPrice: 400,
      rating: 4.8,
      reviewCount: 21,
      image: "/images/placeholder-logo.png",
      category: "jewelry",
      era: "Victorian",
      condition: "Excellent",
      rarity: "Rare",
      isWishlisted: false,
      seller: "Antique Emporium",
      inStock: true,
    },
    {
      id: "demo2",
      name: "Art Deco Table Lamp",
      description: "A stunning Art Deco lamp with a brass finish and frosted glass shade.",
      price: 210,
      originalPrice: 250,
      rating: 4.5,
      reviewCount: 14,
      image: "/images/placeholder-logo.png",
      category: "lighting",
      era: "Art Deco",
      condition: "Very Good",
      rarity: "Uncommon",
      isWishlisted: false,
      seller: "Vintage Finds",
      inStock: true,
    },
  ];

  const mapToAntiqueProduct = (product: any): AntiqueProduct => ({
    id: product._id || product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    originalPrice: product.mrp ? Number(product.mrp) : product.originalPrice,
    rating: product.rating || 4.5,
    reviewCount: product.reviewCount || 12,
    image:
      product.images && product.images.length > 0
        ? product.images[0].startsWith("http")
          ? product.images[0]
          : `${backendUrl}${product.images[0]}`
        : product.image && product.image.startsWith("http")
        ? product.image
        : product.image
        ? `${backendUrl}${product.image}`
        : "/images/placeholder-logo.png",
    category: product.category,
    era: product.era || "Unknown Era",
    condition: product.condition || "Excellent",
    rarity: product.rarity || "Rare",
    isWishlisted: wishlist.includes(product._id || product.id),
    seller: product.seller || "Antique Seller",
    inStock: Number(product.stock) > 0 || product.inStock,
    featured: product.featured || false,
  });

  const pageTitle =
    selectedCategory === "all"
      ? "All Products"
      : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`;

  return (
    <>
      <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />
      <Header />
      {/* Banner (unchanged) */}
      <div
        className="relative h-48 sm:h-56 md:h-64 w-full flex items-center overflow-hidden"
        style={{
          backgroundImage: "url(/images/about-us-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-8 md:px-16 flex flex-col md:flex-row justify-between items-center h-full">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold font-sans tracking-tight">
            {pageTitle}
          </h1>
          <div className="text-white text-sm sm:text-base md:text-lg flex gap-2 items-center mt-4 md:mt-0">
            <Link href="/" className="hover:text-[#B8956A] transition-colors duration-300">
              Home
            </Link>
            <span className="mx-1">|</span>
            <span>{pageTitle}</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="min-h-screen py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#f7f5ef] to-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-16">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <span className="font-medium text-gray-800">Filters & Categories</span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Sidebar: Category dropdown now for SUBCATEGORIES ONLY (based on current slug) */}
            <aside className={`lg:col-span-1 bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-md border border-gray-100 flex flex-col gap-3 sm:gap-4 lg:gap-6 w-full max-w-full lg:max-w-[260px] h-fit self-start ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Main Category Dropdown */}
              <div>
                <div className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                  Category
                </div>
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("all");
                    setCurrentPage(1);
                  }}
                  className="w-full p-2 sm:p-3 border border-gray-200 rounded-md bg-white text-gray-700 focus:border-[#B8956A] focus:outline-none transition-colors duration-300 text-sm sm:text-base"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} ({categoryProductCounts[cat] || 0})
                    </option>
                  ))}
                </select>
              </div>
              {/* Subcategory Dropdown (only if not 'all' and has subcategories) */}
              {selectedCategory !== "all" && subcategoryOptions.length > 0 && (
                <div>
                  <div className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                    Subcategory
                  </div>
                  <select
                    value={selectedSubcategory || ""}
                    onChange={(e) => {
                      setSelectedSubcategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full p-2 sm:p-3 border border-gray-200 rounded-md bg-white text-gray-700 focus:border-[#B8956A] focus:outline-none transition-colors duration-300 text-sm sm:text-base"
                  >
                    <option value="all">All Subcategories</option>
                    {subcategoryOptions.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat.charAt(0).toUpperCase() + subcat.slice(1)} ({subcategoryProductCounts[selectedCategory]?.[subcat] || 0})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Rest of sidebar unchanged */}
              <div>
                <div className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                  Filter
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {filteredProducts.length} products
                </div>
              </div>
              <div>
                <div className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                  Price
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  The highest price is{" "}
                  <span className="text-[#B8956A] font-semibold">
                    ${priceRange[1].toFixed(2)}
                  </span>{" "}
                  <a
                    href="#"
                    className="text-[#B8956A] ml-2 underline hover:text-[#A0845A] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setPriceInput({ from: "", to: "" });
                    }}
                  >
                    Reset
                  </a>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    className="w-16 sm:w-20 p-2 border border-gray-200 rounded-md text-xs focus:border-[#B8956A] focus:outline-none transition-colors"
                    placeholder="From"
                    min={priceRange[0]}
                    value={priceInput.from}
                    onChange={(e) =>
                      setPriceInput((p) => ({ ...p, from: e.target.value }))
                    }
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="w-16 sm:w-20 p-2 border border-gray-200 rounded-md text-xs focus:border-[#B8956A] focus:outline-none transition-colors"
                    placeholder="To"
                    min={priceRange[0]}
                    value={priceInput.to}
                    onChange={(e) =>
                      setPriceInput((p) => ({ ...p, to: e.target.value }))
                    }
                  />
                </div>
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={priceInput.to || priceRange[1]}
                  onChange={(e) =>
                    setPriceInput((p) => ({ ...p, to: e.target.value }))
                  }
                  className="w-full accent-[#B8956A] cursor-pointer"
                />
              </div>
              <div>
                <div className="text-base sm:text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                  Show
                </div>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-200 rounded-md bg-white text-gray-700 focus:border-[#B8956A] focus:outline-none transition-colors text-sm sm:text-base"
                >
                  <option value="all">All Products</option>
                  <option value="featured">Featured</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Sold Out</option>
                </select>
              </div>
            </aside>
            {/* Main Section (unchanged except using updated filteredProducts) */}
            <main className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="text-base sm:text-lg font-semibold text-gray-800">
                  Products ({filteredProducts.length})
                </div>
              </div>
              {loading ? (
                <div className="text-center py-12 text-gray-600">Loading products...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-600">{error}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <svg
                    width="64"
                    height="64"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="mb-4 text-[#B8956A]"
                  >
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm-2-7.5h4m-6-2h8m-7-2h6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-xl text-[#B8956A] mb-2 font-semibold">
                    No products available
                  </div>
                  <div className="text-gray-500">
                    Try adjusting your filters or check back later for new arrivals.
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {(paginatedProducts.length > 0 ? paginatedProducts : fallbackProducts).map(
                      (product) => {
                        const mapped = mapToAntiqueProduct(product);
                        return (
                          <Link
                            key={mapped.id}
                            href={`/shop/${mapped.id}`}
                            className="block group"
                            style={{ textDecoration: "none" }}
                          >
                            <AntiqueProductCard
                              product={mapped}
                              onToggleWishlist={() => toggleWishlist(product._id || product.id)}
                            />
                          </Link>
                        );
                      }
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button
                        className="px-4 py-2 rounded-md bg-[#B8956A] text-white font-medium disabled:opacity-50 hover:bg-[#A0845A] transition-colors duration-300 text-sm sm:text-base"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Back
                      </button>
                      <span className="text-[#B8956A] font-medium text-sm sm:text-base">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="px-4 py-2 rounded-md bg-[#B8956A] text-white font-medium disabled:opacity-50 hover:bg-[#A0845A] transition-colors duration-300 text-sm sm:text-base"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        View More
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
