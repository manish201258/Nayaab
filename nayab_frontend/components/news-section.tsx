"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay, FreeMode } from 'swiper/modules'; // Added FreeMode for smoother scrolling
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function NewsSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userApiUrl = "http://localhost:5000/api/user";
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const getImageUrl = (img: string | undefined) =>
    img && img.startsWith("http")
      ? img
      : img
        ? `${backendUrl}${img}`
        : "/placeholder.svg?height=200&width=300";
  
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${backendUrl}/user/blogs`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data.blogs ? data.blogs.slice(0, 8) : []);
    } catch (err) {
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-full">
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="w-full h-32 sm:h-40 md:h-48 mb-3 sm:mb-4" />
            <Skeleton className="w-16 sm:w-20 h-3 sm:h-4 mb-2" />
            <Skeleton className="w-full h-4 sm:h-6 mb-2 sm:mb-3" />
            <Skeleton className="w-full h-3 sm:h-4 mb-2" />
            <Skeleton className="w-3/4 h-3 sm:h-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-8 sm:py-12">
      <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Unable to load blogs</h3>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
      <Button 
        onClick={fetchBlogs}
        className="bg-[#B8956A] hover:bg-[#A0845A] text-white text-sm sm:text-base px-4 py-2"
      >
        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
  
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
            Latest <span className="text-gray-600">Blogs</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Discover our latest articles, stories, and insights about antique collecting and preservation.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState />
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">No blogs available</h3>
            <p className="text-gray-600 text-sm sm:text-base">Check back later for new content.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Left Blur */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 sm:w-16 z-20" style={{background: "linear-gradient(to right, white 60%, transparent)"}} />
            {/* Right Blur */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 sm:w-16 z-20" style={{background: "linear-gradient(to left, white 60%, transparent)"}} />
            <Swiper
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 24 }
              }}
              autoplay={{
                delay: 0, // Set to 0 for continuous scrolling
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={5000} // Slower speed for smoother, continuous infinite scroll
              loop={true} // Enables infinite looping
              freeMode={{ // Enables momentum-based free scrolling for infinite feel
                enabled: true,
                momentumRatio: 1,
                momentumVelocityRatio: 0.5,
              }}
              grabCursor={true}
              allowTouchMove={true}
              modules={[Autoplay, FreeMode]} // Added FreeMode module
              style={{ padding: '0 1rem sm:0 2rem' }}
            >
              {blogs.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link href={`/blogs/${item._id}`} className="block h-full group" prefetch={false}>
                    <Card className="h-full group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <CardContent className="p-3 sm:p-4">
                        <div className="mb-3 sm:mb-4 overflow-hidden rounded-lg">
                          <img
                            src={item.featuredImage ? getImageUrl(item.featuredImage) : "/placeholder.svg?height=200&width=300"}
                            alt={item.title}
                            className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-[#B8956A] text-xs sm:text-sm mb-2 flex items-center">
                          <span className="mr-1 sm:mr-2">📅</span>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "No date"}
                        </p>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 group-hover:text-[#B8956A] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                          {item.excerpt || item.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Read more →</span>
                          <span className="text-xs text-[#B8956A] font-medium">5 min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
