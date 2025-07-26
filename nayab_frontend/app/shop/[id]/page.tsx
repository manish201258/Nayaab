"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart, Share2, Star, ChevronLeft } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import CartSidebar from "@/components/cart-sidebar";
import { useWishlist } from "@/context/wishlistContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  sku: string;
  category: string;
  featured: boolean;
  rating?: number;
  images: string[];
  features?: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const { user, isLogin } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedFilter, setRelatedFilter] = useState<string>("all");
  const [relatedSort, setRelatedSort] = useState<string>("");
  const { addToCart, cart, increaseQuantity, decreaseQuantity } = useCart();
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { toast } = useToast ? useToast() : { toast: () => {} };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const apiUrl = `${backendUrl}/api/user/products/${id}`;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product || null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product.");
        setLoading(false);
      });
  }, [id]);

  // Fetch comments when product loads
  useEffect(() => {
    if (product) {
      fetchComments();
    }
  }, [product]);

  // Fetch all products for related section
  useEffect(() => {
    if (!id) return;
    fetch(`${backendUrl}/api/user/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      });
  }, [id]);

  // Compute related products
  useEffect(() => {
    if (!product || allProducts.length === 0) return;
    // Exclude current product
    const others = allProducts.filter(p => p._id !== product._id);
    // 1. Featured
    let featured = others.filter(p => p.featured);
    // 2. Same category
    let sameCategory = others.filter(p => p.category === product.category);
    // 3. Latest (by createdAt or fallback)
    let latest = others.slice().sort((a, b) => {
      const aDate = new Date((a as any).createdAt || 0).getTime();
      const bDate = new Date((b as any).createdAt || 0).getTime();
      return bDate - aDate;
    });
    // Merge, remove duplicates
    let merged: Product[] = [];
    for (const arr of [featured, sameCategory, latest]) {
      for (const p of arr) {
        if (!merged.find(mp => mp._id === p._id)) merged.push(p);
        if (merged.length === 4) break;
      }
      if (merged.length === 4) break;
    }
    setRelatedProducts(merged.slice(0, 4));
  }, [product, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] via-[#F7F5EF] to-[#EDEBE3]">
        <div className="text-2xl font-semibold text-[#B8956A] animate-pulse font-playfair">Loading your antique treasure...</div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] via-[#F7F5EF] to-[#EDEBE3]">
        <div className="text-2xl font-semibold text-red-600 font-playfair">{error || "Product not found."}</div>
      </div>
    );
  }

  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : ["/placeholder.svg"];
  const inCart = product ? cart.some((item) => item.id === product._id) : false;
  const cartItem = product ? cart.find((item) => item.id === product._id) : null;
  const inWishlist = product ? isWishlisted(product._id) : false;
  const handleWishlist = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast && toast({ title: "Removed from Wishlist", description: `${product.name} removed from your wishlist.` });
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
      });
      toast && toast({ title: "Added to Wishlist", description: `${product.name} added to your wishlist.` });
    }
  };

  // Fetch comments for the product
  const fetchComments = async () => {
    if (!id) return;
    try {
      const response = await fetch(`${backendUrl}/api/user/products/${id}/comments`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Submit comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      setCommentError("Please login to comment.");
      return;
    }
    
    if (!commentText.trim()) {
      setCommentError("Please enter your comment.");
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/api/user/products/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: commentText.trim()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setComments([data.comment, ...comments]);
        setCommentText("");
        toast && toast({ 
          title: "Comment Posted", 
          description: "Your comment has been posted successfully." 
        });
      } else {
        setCommentError(data.message || "Failed to post comment.");
      }
    } catch (error) {
      setCommentError("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const placeholder = "/placeholder.svg";
  const getImageUrl = (img: string | undefined) =>
    img && img.startsWith('http')
      ? img
      : img
        ? `${backendUrl}${img}`
        : placeholder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F7F5EF] to-[#EDEBE3] font-inter">
      <CartSidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)} />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <style jsx>{`
        .image-zoom {
          transition: transform 0.4s ease-in-out;
        }
        .image-zoom:hover {
          transform: scale(1.1);
        }
        .button-glow {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .button-glow::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300%;
          height: 300%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.4s ease;
        }
        .button-glow:hover::after {
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        {/* Back link */}
        <div className="mb-4 sm:mb-6">
          <Link href="/shop" className="inline-flex items-center text-[#B8956A] hover:text-[#A0845A] transition-colors duration-300 group">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base md:text-lg font-medium font-playfair">Back to Shop</span>
          </Link>
        </div>
        <div className="bg-white/95 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 border border-[#B8956A]/20 backdrop-blur-sm">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[30rem] bg-[#F7F5EF] rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center overflow-hidden border border-[#B8956A]/30 shadow-md sm:shadow-lg">
              <img
                src={images[selectedImage].startsWith("/") ? `${backendUrl}${images[selectedImage]}` : images[selectedImage]}
                alt={product.name}
                className="object-contain w-full h-full max-h-[180px] sm:max-h-[220px] md:max-h-[280px] lg:max-h-[30rem] image-zoom drop-shadow-lg sm:drop-shadow-xl lg:drop-shadow-2xl"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl border-2 ${selectedImage === idx ? "border-[#B8956A] shadow-md" : "border-[#EDEBE3]"} overflow-hidden focus:outline-none bg-[#F7F5EF] hover:border-[#A0845A] transition-colors flex-shrink-0`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img
                      src={img.startsWith("/") ? `${backendUrl}${img}` : img}
                      alt={`Preview ${idx + 1}`}
                      className="object-contain w-full h-full image-zoom"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight font-playfair">{product.name}</h1>
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#B8956A]">₹{product.price}</span>
              {product.featured && (
                <span className="px-2 sm:px-4 py-1 bg-[#B8956A] text-white text-xs sm:text-sm rounded-full shadow-md animate-pulse">Featured</span>
              )}
            </div>
            {/* Stock */}
            <div className="mb-2">
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold text-sm sm:text-base">In Stock ({product.stock})</span>
              ) : (
                <span className="text-red-600 font-semibold text-sm sm:text-base">Sold Out</span>
              )}
            </div>
            {/* Description */}
            <div className="mb-2">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-[#B8956A] font-playfair">About this antique piece</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{product.description}</p>
            </div>
            {/* Features/Specs */}
            {product.features && product.features.length > 0 && (
              <div className="mb-2">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-[#B8956A] font-playfair">Features & Details</h2>
                <ul className="list-disc list-inside text-gray-700 pl-2 space-y-1 text-sm sm:text-base">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* SKU, Brand, Category */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 mb-2 text-xs sm:text-sm text-gray-600 border-t border-[#B8956A]/20 pt-3 sm:pt-4">
              <span>SKU: <span className="font-medium text-gray-800">{product.sku}</span></span>
              <span>Brand: <span className="font-medium text-gray-800">{product.brand}</span></span>
              <span>Category: <span className="font-medium text-gray-800">{product.category}</span></span>
            </div>
            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              {/* Quantity Counter (when product is in cart) */}
              {inCart && cartItem && (
                <div className="flex items-center justify-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => decreaseQuantity(product._id)}
                      className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-xs sm:text-sm font-medium text-gray-800 min-w-[20px] text-center">
                      {cartItem.qty}
                    </span>
                    <button
                      onClick={() => increaseQuantity(product._id)}
                      className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm"
                      disabled={cartItem.qty >= product.stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Add to Cart / Go to Cart Button */}
                {inCart && cartItem ? (
                  <button
                    onClick={() => setCartSidebarOpen(true)}
                    className="bg-gradient-to-r from-[#B8956A] to-[#A0845A] hover:from-[#A0845A] hover:to-[#8B6F47] text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-lg button-glow transition-all text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Go to Cart
                  </button>
                ) : (
                  <button
                    className={`bg-gradient-to-r from-[#B8956A] to-[#A0845A] hover:from-[#A0845A] hover:to-[#8B6F47] text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-lg button-glow transition-all text-sm sm:text-base ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={product.stock === 0}
                    onClick={() => {
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        qty: 1,
                        image: product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : placeholder,
                      });
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                  </button>
                )}

                {/* Buy Now Button */}
                {product.stock > 0 && (
                  <button 
                    className="bg-gradient-to-r from-[#4A919E] to-[#3A767F] hover:from-[#3A767F] hover:to-[#2C5D64] text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-lg button-glow transition-all text-sm sm:text-base"
                    onClick={() => {
                      localStorage.setItem('directBuy', JSON.stringify({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        qty: 1,
                        image: product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : placeholder,
                      }));
                      window.location.href = '/checkout';
                    }}
                  >
                    Buy Now
                  </button>
                )}
              </div>

              {/* Wishlist and Share Buttons */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {product && (
                  <button
                    onClick={handleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-full border font-semibold flex items-center gap-2 transition-colors text-sm sm:text-base ${inWishlist ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
                    style={{ verticalAlign: 'middle' }}
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      fill={inWishlist ? 'red' : 'none'}
                    />
                    {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>
                )}
                <button className="bg-white border border-[#B8956A]/30 hover:border-[#B8956A] text-gray-700 hover:text-[#B8956A] font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-sm button-glow transition-all text-sm sm:text-base">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Comments Section */}
        <div className="bg-white/95 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8 lg:mt-12 border border-[#B8956A]/20 backdrop-blur-sm">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-[#B8956A] font-playfair">Comments & Reviews</h2>
          
          {!isLogin ? (
            <div className="mb-6 sm:mb-8 p-4 bg-[#F7F5EF] rounded-lg border border-[#B8956A]/20">
              <p className="text-gray-600 text-sm sm:text-base text-center">
                Please <Link href="/login" className="text-[#B8956A] hover:text-[#A0845A] font-semibold">login</Link> to leave a comment.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4">
              <textarea
                placeholder="Write your comment..."
                className="border border-[#B8956A]/30 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:border-[#B8956A] bg-[#F7F5EF] text-gray-800 min-h-[40px] sm:min-h-[48px] text-sm sm:text-base"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                disabled={commentLoading}
              />
              {commentError && <div className="text-red-500 text-xs sm:text-sm font-medium">{commentError}</div>}
              <button
                type="submit"
                disabled={commentLoading}
                className="self-end bg-[#B8956A] hover:bg-[#A0845A] disabled:bg-gray-400 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg shadow button-glow transition-all text-sm sm:text-base"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          )}
          
          <div className="space-y-4 sm:space-y-6">
            {comments.length === 0 ? (
              <div className="text-gray-600 text-sm sm:text-base">No comments yet. Be the first to share your thoughts!</div>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="border-b border-[#B8956A]/10 pb-3 sm:pb-4 mb-3 sm:mb-4 last:mb-0 last:pb-0 last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#B8956A] font-playfair text-sm sm:text-base">{c.userName}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="text-gray-800 text-sm sm:text-base leading-relaxed">{c.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Related Products */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-[#B8956A] font-playfair">You may also like</h2>
          {/* Filter & Sort Controls - always visible */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6 items-start sm:items-center">
            <label className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Filter:</span>
              <select
                className="border border-[#B8956A]/30 rounded px-2 py-1 bg-[#F7F5EF] focus:outline-none text-xs sm:text-sm"
                value={relatedFilter}
                onChange={e => setRelatedFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Sold Out</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs sm:text-sm">
              <span>Sort by:</span>
              <select
                className="border border-[#B8956A]/30 rounded px-2 py-1 bg-[#F7F5EF] focus:outline-none text-xs sm:text-sm"
                value={relatedSort}
                onChange={e => setRelatedSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </label>
          </div>
          {/* Filter and sort related products */}
          {(() => {
            let filtered = [...relatedProducts];
            if (relatedFilter === "featured") {
              filtered = filtered.filter(p => p.featured);
            } else if (relatedFilter === "inStock") {
              filtered = filtered.filter(p => p.stock > 0);
            } else if (relatedFilter === "outOfStock") {
              filtered = filtered.filter(p => p.stock === 0);
            }
            if (relatedSort === "priceLow") {
              filtered.sort((a, b) => a.price - b.price);
            } else if (relatedSort === "priceHigh") {
              filtered.sort((a, b) => b.price - a.price);
            }
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filtered.length === 0 ? (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-gray-400 text-center text-sm sm:text-base">No related products found.</div>
                ) : (
                  filtered.map((item) => (
                    <Link
                      key={item._id}
                      href={`/shop/${item._id}`}
                      className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-md hover:shadow-xl transition-shadow duration-300 border border-[#B8956A]/20 group cursor-pointer"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-[#F7F5EF] rounded-lg mb-2 sm:mb-3 flex items-center justify-center border border-[#B8956A]/20 overflow-hidden">
                        <img
                          src={item.images && item.images.length > 0
                            ? getImageUrl(item.images[0])
                            : "/placeholder.svg"}
                          alt={item.name}
                          className="object-contain w-full h-full image-zoom group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-gray-800 font-medium text-center text-xs sm:text-sm md:text-base line-clamp-2">{item.name}</div>
                      <div className="text-[#B8956A] text-xs sm:text-sm font-semibold mt-1">₹{item.price}</div>
                    </Link>
                  ))
                )}
              </div>
            );
          })()}
        </div>
      </div>
      <Footer />
    </div>
  );
}