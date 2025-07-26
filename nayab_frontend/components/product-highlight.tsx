"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  // Add other fields as needed from your API
}

export default function ProductHighlight() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getImageUrl = (img: string | undefined) => {
    if (!img || img.trim() === "") {
      return "/images/placeholder-logo.png";
    }
    if (/^https?:\/\//i.test(img)) {
      return img;
    }
    const backend = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
    const path = img.startsWith("/") ? img : "/" + img;
    return backend + path;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backendUrl}/user/products`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok && data.products) {
          // Display first 2 products; filter for featured if available
          setProducts(data.products.slice(0, 2));
        } else {
          throw new Error(data.message || "Failed to load products");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching products";
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

  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12 md:py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8956A]"></div>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Loading highlights...</p>
      </div>
    );
  }

  if (error || products.length < 2) {
    return (
      <div className="text-center py-8 sm:py-12 md:py-16">
        <p className="text-red-500 text-sm sm:text-base">{error || "No highlights available."}</p>
      </div>
    );
  }

  // Use fetched products (first for left, second for right)
  const leftProduct = products[0];
  const rightProduct = products[1];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-[#F7F5F0]/50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Featured <span className="text-[#B8956A]">Highlights</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Discover our most exceptional antique pieces
          </p>
        </div>

        {/* Responsive Product Grid: flex scroll on mobile, grid on desktop */}
        <div
          className="flex flex-nowrap gap-3 sm:gap-4 md:gap-8 overflow-x-auto scrollbar-hide md:grid md:grid-cols-2 md:overflow-visible md:gap-8 lg:gap-12 pb-2 px-4 sm:px-0"
        >
          {/* Left Product Highlight */}
          <div
            className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-[160px] flex-shrink-0 md:w-auto md:flex-shrink flex flex-col ml-2 md:ml-0"
          >
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
              <Image
                src={getImageUrl(leftProduct.images?.[0])}
                alt={leftProduct.name}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            <div className="p-2 sm:p-3 md:p-6 flex flex-col flex-1">
              <div className="mb-2 sm:mb-3 md:mb-4 flex-1">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-lg line-clamp-2 group-hover:text-[#B8956A] transition-colors duration-300 mb-1 sm:mb-2">
                  <span className="text-[#B8956A]">{leftProduct.name.split(" ")[0]}</span> {leftProduct.name.split(" ").slice(1).join(" ")}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base line-clamp-2 mb-1 sm:mb-2">
                  {leftProduct.description || "Discover timeless elegance with this exquisite antique item."}
                </p>
                <p className="text-[#B8956A] font-bold text-xs sm:text-sm md:text-lg">
                  ${leftProduct.price.toFixed(2)}
                </p>
              </div>
              <Button
                asChild
                className="w-full rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-3 bg-[#B8956A] hover:bg-[#A0845A] text-white mt-auto"
              >
                <Link href={`/shop/${leftProduct._id}`}>
                  View Details <ArrowRight className="ml-1 sm:ml-2 md:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Product Highlight */}
          <div
            className="group relative bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-[160px] flex-shrink-0 md:w-auto md:flex-shrink flex flex-col mr-2 md:mr-0"
          >
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
              <Image
                src={getImageUrl(rightProduct.images?.[0])}
                alt={rightProduct.name}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                priority
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            <div className="p-2 sm:p-3 md:p-6 flex flex-col flex-1">
              <div className="mb-2 sm:mb-3 md:mb-4 flex-1">
                <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-lg line-clamp-2 group-hover:text-[#B8956A] transition-colors duration-300 mb-1 sm:mb-2">
                  {rightProduct.name.split(" ")[0]} <span className="text-[#B8956A]">{rightProduct.name.split(" ").slice(1).join(" ")}</span>
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base line-clamp-2 mb-1 sm:mb-2">
                  {rightProduct.description || "Elevate your collection with this rare antique item."}
                </p>
                <p className="text-[#B8956A] font-bold text-xs sm:text-sm md:text-lg">
                  ${rightProduct.price.toFixed(2)}
                </p>
              </div>
              <Button
                asChild
                className="w-full rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base py-1.5 sm:py-2 md:py-3 bg-gray-900 hover:bg-gray-700 text-white mt-auto"
              >
                <Link href={`/shop/${rightProduct._id}`}>
                  View Details <ArrowRight className="ml-1 sm:ml-2 md:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
