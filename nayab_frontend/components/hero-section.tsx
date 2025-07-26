"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/Slide1.webp",
    headline: "Explore Our Collection",
    subtext: "ARE YOU ANTIQUE LOVER",
    button: "Explore Now",
    link: "/shop",
  },
  {
    image: "/images/Slide3.webp",
    headline: "Vintage Masterpieces",
    subtext: "UNIQUE FINDS FOR YOU",
    button: "Shop Vintage",
    link: "/shop/vintage",
  },
  {
    image: "/images/Slide1.webp",
    headline: "Timeless Beauty",
    subtext: "ELEGANCE REDEFINED",
    button: "See More",
    link: "/collections",
  },
  {
    image: "/images/Slide3.webp",
    headline: "Classic Treasures",
    subtext: "DISCOVER HISTORY",
    button: "Discover",
    link: "/shop",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [showText, setShowText] = useState(true); // Start with text visible
  const [isPaused, setIsPaused] = useState(false);

  // Handle auto-slide and text animation
  useEffect(() => {
    if (isPaused) return;

    // Reset text visibility for new slide
    setShowText(false);
    const textTimer = setTimeout(() => setShowText(true), 100); // Reduced delay to 100ms
    const slideTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(textTimer);
    };
  }, [current, isPaused]);

  // Handle manual navigation
  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <section
      className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center bg-no-repeat overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Hero Carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
      }}
    >
      {/* Background Images */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.17), rgba(0,0,0,0.16)), url('${slide.image}')`,
              animation: idx === current ? "zoomIn 5s linear forwards" : "none",
            }}
            aria-hidden={idx !== current}
          />
        ))}
        <style>{`
          @keyframes zoomIn {
            from { transform: scale(1); }
            to { transform: scale(1.08); }
          }
        `}</style>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Text & Button */}
      <div className="relative container mx-auto px-3 sm:px-4 md:px-8 lg:px-16 h-full flex items-center justify-center z-20">
        <div
          className={`text-center text-white transition-all duration-500 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          role="heading"
          aria-level={1}
        >
          <p className="text-[#B8956A] text-xs sm:text-sm font-medium mb-1 sm:mb-2 md:mb-4 tracking-wider">
            {slides[current].subtext}
          </p>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[1px] sm:tracking-[2px] md:tracking-[5px] lg:tracking-[10px] font-bold mb-2 sm:mb-4 md:mb-6 lg:mb-8 px-2 sm:px-4">
            {slides[current].headline}
          </h1>
          <Button
            asChild
            className="bg-[#B8956A] hover:bg-[#A0845A] text-white px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-lg rounded-full"
          >
            <Link href={slides[current].link}>{slides[current].button}</Link>
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center z-30">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 rounded-full p-1 sm:p-2 mx-1 sm:mx-2 md:mx-4"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center z-30">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20 rounded-full p-1 sm:p-2 mx-1 sm:mx-2 md:mx-4"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </Button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-0 right-0 flex justify-center space-x-1 sm:space-x-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all ${
              idx === current ? "bg-[#B8956A] scale-125" : "bg-white/50"
            }`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === current ? "true" : "false"}
          />
        ))}
      </div>
    </section>
  );
}