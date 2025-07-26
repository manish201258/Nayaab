"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ProductShowcase() {
  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white to-[#F7F5F0]/30">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left: Enhanced Cool & Modern Image Section */}
          <div className="relative flex flex-col items-center group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500 order-2 lg:order-1">
            <div className="relative w-full max-w-md h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[520px] overflow-hidden">
              <Image
                src="/images/about.webp" // Replace with a high-quality antique/vintage item image if needed
                alt="Nayab Co. Antique Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" // Added cool scaling and slight rotation on hover
                priority
              />
              {/* Modern Overlay: Gradient border and dynamic text */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#B8956A]/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Cool Text Overlay with Animation */}
              <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-script text-[#B8956A] select-none pointer-events-none opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-[-10px]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Vintage Elegance
              </span>
              {/* Subtle Border Frame for Modernity */}
              <div className="absolute inset-0 border-2 border-[#B8956A]/30 rounded-2xl group-hover:border-[#B8956A]/60 transition-colors duration-300"></div>
            </div>
          </div>

          {/* Center: About Us Content */}
          <div className="col-span-1 flex flex-col justify-center items-start px-0 order-1 lg:order-2">
            <span className="text-[#B8956A] text-xs sm:text-sm md:text-lg font-medium tracking-wide uppercase mb-1 sm:mb-2">About Us</span>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-sans font-bold text-gray-900 mb-1">Nayab Co.</h2>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-serif text-gray-700 mb-2 sm:mb-3 md:mb-4 lg:mb-6">Curators of Antique, Vintage & Rare Treasures</h3>
            <p className="text-gray-600 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
              At Nayab Co., we specialize in sourcing and offering exquisite antique pieces, vintage artifacts, and rare items that tell stories of history and craftsmanship.
            </p>
            <p className="text-gray-600 mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-xs sm:text-sm md:text-base leading-relaxed">
              Our collection is curated for enthusiasts who appreciate timeless beauty and unique heritage. Discover pieces that elevate any space.
            </p>
            <Button
              asChild
              className="bg-[#B8956A] hover:bg-[#A0845A] text-white px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-lg font-medium rounded-full transition-all duration-300 hover:shadow-md"
            >
              <Link href="/shop">
                Explore Collection
              </Link>
            </Button>
          </div>

          {/* Right: Info Cards */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 order-3">
            <div className="bg-[#F7F5F0] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex flex-col justify-between group">
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-[#B8956A] transition-colors">Founded in 2001</h4>
              <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed">
                Nayab Co. began as a passion project, dedicated to preserving and sharing the world's finest antique and vintage items.
              </p>
              <Link href="/about" className="text-[#B8956A] font-medium text-xs sm:text-sm underline underline-offset-4 hover:no-underline transition-all">
                See More
              </Link>
            </div>
            <div className="bg-[#F7F5F0] p-3 sm:p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] flex flex-col justify-between group">
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-[#B8956A] transition-colors">Expanding in 2024</h4>
              <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed">
                We're growing our collection of rare vintage pieces, bringing more unique treasures to collectors worldwide.
              </p>
              <Link href="/about" className="text-[#B8956A] font-medium text-xs sm:text-sm underline underline-offset-4 hover:no-underline transition-all">
                See More
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Google Fonts for Modern Script if not already included */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');
      `}</style>
    </section>
  );
}
