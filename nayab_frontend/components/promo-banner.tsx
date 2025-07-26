"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image with Blur and Darkening */}
      <div className="absolute inset-0">
        <Image
          src="https://www.shutterstock.com/image-vector/vintage-typographic-decorative-ornament-design-260nw-2477285793.jpg" // Public fallback: High-quality antique image. Replace with your local path, e.g., "/images/antique-banner.jpg"
          alt="Curated Antique Collection"
          fill
          className="object-cover object-center brightness-50 blur-sm transition-transform duration-1000 hover:scale-110" // Added blur-sm and reduced brightness for darkening
          priority
          onError={(e) => { e.currentTarget.src = "/images/placeholder-banner.jpg"; }} // Fallback if URL fails
        />
        {/* Adjusted Gradient Overlay: Less opaque to keep some image visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50"></div> {/* Reduced opacity for better image visibility */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-0">
        <p className="text-[#D4AF37] text-lg md:text-2xl font-light tracking-widest uppercase mb-3 animate-fade-in">
          Discover Timeless Treasures
        </p>
        <h2 className="text-4xl md:text-7xl font-sans font-extrabold text-white mb-4 leading-tight drop-shadow-xl animate-fade-in-delay">
          Explore Our Antique Collection
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-md mb-6 animate-fade-in-delay-2">
          Uncover rare artifacts and vintage masterpieces curated for true enthusiasts.
        </p>
        <Button
          className="bg-[#B8956A]/80 backdrop-blur-sm hover:bg-[#B8956A] text-white px-8 py-3 text-lg font-medium transition-all duration-300 group shadow-lg hover:shadow-xl"
          asChild
        >
          <Link href="/shop">
            Explore Now
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </Button>
      </div>

      {/* Subtle animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 1.2s ease-out forwards 0.4s;
          opacity: 0;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1.2s ease-out forwards 0.8s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
