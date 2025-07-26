"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Animation variants for fade-in
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        {/* Banner (Updated to use /images/about-us-bg.webp as background, matching ShopPage reference) */}
        <div className="relative h-64 md:h-80 w-full flex items-center" style={{ backgroundImage: 'url(/images/about-us-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          <div className="relative z-10 container mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center h-full">
            <h1 className="text-white text-4xl md:text-5xl font-sans font-bold">About Nayab Co.</h1>
            <div className="text-white text-lg flex gap-2 items-center mt-4 md:mt-0">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">|</span>
              <span>About Us</span>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInVariants}
          className="container mx-auto px-4 md:px-16 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center"
        >
          {/* Left: Text */}
          <div className="col-span-1 flex flex-col justify-center items-start">
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-gray-900 mb-2">Curating Timeless</h2>
            <h3 className="text-3xl font-serif text-[#B8956A] mb-6">Antique & Vintage Treasures</h3>
            <p className="text-gray-600 mb-4 text-base leading-relaxed">
              At Nayab Co., we are passionate about preserving history through exquisite antique pieces, vintage artifacts, and rare items. Founded in 2001, our journey began with a vision to connect collectors with unique treasures that tell stories of the past.
            </p>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              From ornate Victorian jewelry to mid-century furniture, each item is carefully sourced and authenticated to ensure authenticity and quality.
            </p>
            <Button
              className="bg-[#B8956A] hover:bg-[#A0845A] text-white px-8 py-3 text-lg rounded-full transition-all duration-300 hover:shadow-md"
              asChild
            >
              <Link href="/products">Explore Our Collection</Link>
            </Button>
          </div>

          {/* Center: Image with Modern Hover */}
          <div className="flex justify-center group">
            <div className="relative w-full max-w-md h-[400px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/images/about.webp" // Replace with a relevant antique collection image
                alt="Nayab Co. Curated Antiques"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Info Cards with Hover */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#F7F5F0] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-[#B8956A] group-hover:scale-110 transition-transform duration-300">
                <path stroke="#B8956A" strokeWidth="2" d="M6 19a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.9 1.5A3.5 3.5 0 1 1 18 19H6Z"/>
              </svg>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#B8956A] transition-colors">Unique Rare Finds</h4>
                <p className="text-gray-600 text-sm">We handpick antique and vintage items with historical significance, ensuring exclusivity for collectors.</p>
              </div>
            </div>
            <div className="bg-[#F7F5F0] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-[#B8956A] group-hover:scale-110 transition-transform duration-300">
                <path stroke="#B8956A" strokeWidth="2" d="M12 21c-4.97 0-9-4.03-9-9 0-4.97 4.03-9 9-9s9 4.03 9 9c0 4.97-4.03 9-9 9Zm0-9V3m0 9h9"/>
              </svg>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#B8956A] transition-colors">Global Sourcing</h4>
                <p className="text-gray-600 text-sm">Our network spans the world to bring you rare vintage pieces from forgotten eras.</p>
              </div>
            </div>
            <div className="bg-[#F7F5F0] p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 group">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-[#B8956A] group-hover:scale-110 transition-transform duration-300">
                <circle cx="12" cy="12" r="9" stroke="#B8956A" strokeWidth="2"/><path stroke="#B8956A" strokeWidth="2" d="M12 7v5l3 3"/>
              </svg>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#B8956A] transition-colors">Expert Authentication</h4>
                <p className="text-gray-600 text-sm">Every item is verified by experts to guarantee authenticity and value.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="bg-[#F7F5F0] py-20">
          <div className="container mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4 text-[#B8956A]">
                <path stroke="#B8956A" strokeWidth="2" d="M3 17V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v11M16 17h2a2 2 0 0 0 2-2v-3.586a1 1 0 0 0-.293-.707l-2.414-2.414A1 1 0 0 0 16 9.586V17ZM7 20a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
              </svg>
              <div className="font-bold text-lg mb-1">Free Worldwide Delivery</div>
              <div className="text-sm text-gray-600">On orders over $99 for your antique treasures.</div>
            </motion.div>
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4 text-[#B8956A]">
                <rect x="3" y="7" width="18" height="10" rx="2" stroke="#B8956A" strokeWidth="2"/><path stroke="#B8956A" strokeWidth="2" d="M7 7V5m10 2V5M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
              </svg>
              <div className="font-bold text-lg mb-1">Money-Back Guarantee</div>
              <div className="text-sm text-gray-600">Full refund if your vintage item doesn't meet expectations.</div>
            </motion.div>
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4 text-[#B8956A]">
                <path stroke="#B8956A" strokeWidth="2" d="M4 15v-3a8 8 0 1 1 16 0v3"/><rect width="6" height="4" x="3" y="15" rx="2" stroke="#B8956A" strokeWidth="2"/><rect width="6" height="4" x="15" y="15" rx="2" stroke="#B8956A" strokeWidth="2"/>
              </svg>
              <div className="font-bold text-lg mb-1">24/7 Expert Support</div>
              <div className="text-sm text-gray-600">Dedicated assistance for all your rare item inquiries.</div>
            </motion.div>
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-4 text-[#B8956A]">
                <path stroke="#B8956A" strokeWidth="2" d="M12 5v6l4-4m-4 8a7 7 0 1 0-7-7"/>
              </svg>
              <div className="font-bold text-lg mb-1">90-Day Returns</div>
              <div className="text-sm text-gray-600">Easy returns for antique and vintage purchases.</div>
            </motion.div>
          </div>
        </div>

        {/* Vision, Mission, Values Section */}
        <div className="container mx-auto px-4 md:px-16 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-[#F7F5F0] p-6 rounded-xl shadow-sm">
            <div className="font-bold text-lg mb-2 text-[#B8956A]">Our Vision</div>
            <div className="text-gray-600 text-base">To become the global leader in curating and preserving antique, vintage, and rare items, making historical treasures accessible to all enthusiasts.</div>
          </motion.div>
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-[#F7F5F0] p-6 rounded-xl shadow-sm">
            <div className="font-bold text-lg mb-2 text-[#B8956A]">Our Mission</div>
            <div className="text-gray-600 text-base">We source, authenticate, and deliver exceptional antique pieces that inspire and connect people with the beauty of the past.</div>
          </motion.div>
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="bg-[#F7F5F0] p-6 rounded-xl shadow-sm">
            <div className="font-bold text-lg mb-2 text-[#B8956A]">Our Values</div>
            <div className="text-gray-600 text-base">Authenticity, quality, and passion drive us to offer 20% more exclusive rare items than competitors, ensuring unparalleled value.</div>
          </motion.div>
        </div>

        {/* Highlight Section with Parallax Effect */}
        <div className="relative w-full flex items-center justify-center min-h-[540px] overflow-hidden" style={{ backgroundImage: 'url(/images/Slide3.webp)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 max-w-xl w-full bg-white/90 rounded-xl p-8 md:p-10 m-6 shadow-xl text-center">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 mb-4">We Provide Unique & Luxury Antique Items</h2>
            <p className="text-gray-600 mb-6 text-base">At Nayab Co., every piece is a gateway to history. Explore our curated selection of vintage masterpieces and rare artifacts that blend timeless elegance with modern appeal.</p>
            <Button className="bg-[#B8956A] hover:bg-[#A0845A] text-white px-6 py-3 rounded-full transition-all duration-300" asChild>
              <Link href="/products">Read More</Link>
            </Button>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="container mx-auto px-4 md:px-16 py-20">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-12 text-gray-800">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="flex flex-col items-center group">
              <div className="relative w-36 h-36 overflow-hidden rounded-full shadow-md mb-4 group-hover:shadow-lg transition-shadow duration-300">
                <Image src="/images/team1.webp" alt="Johnny Walker" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="font-bold text-lg text-gray-900 group-hover:text-[#B8956A] transition-colors">Johnny Walker</div>
              <div className="text-sm text-gray-600">Lead Curator</div>
              <p className="text-center text-gray-500 text-sm mt-2">Specialist in Victorian antiques with over 15 years of experience.</p>
            </motion.div>
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="flex flex-col items-center group">
              <div className="relative w-36 h-36 overflow-hidden rounded-full shadow-md mb-4 group-hover:shadow-lg transition-shadow duration-300">
                <Image src="/images/team2.webp" alt="Rebecca Flex" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="font-bold text-lg text-gray-900 group-hover:text-[#B8956A] transition-colors">Rebecca Flex</div>
              <div className="text-sm text-gray-600">Vintage Specialist</div>
              <p className="text-center text-gray-500 text-sm mt-2">Expert in mid-century vintage artifacts and restoration.</p>
            </motion.div>
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="flex flex-col items-center group">
              <div className="relative w-36 h-36 overflow-hidden rounded-full shadow-md mb-4 group-hover:shadow-lg transition-shadow duration-300">
                <Image src="/images/team3.webp" alt="Jan Ringo" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="font-bold text-lg text-gray-900 group-hover:text-[#B8956A] transition-colors">Jan Ringo</div>
              <div className="text-sm text-gray-600">Rare Items Expert</div>
              <p className="text-center text-gray-500 text-sm mt-2">Focuses on sourcing rare global treasures and authentication.</p>
            </motion.div>
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeInVariants} className="flex flex-col items-center group">
              <div className="relative w-36 h-36 overflow-hidden rounded-full shadow-md mb-4 group-hover:shadow-lg transition-shadow duration-300">
                <Image src="/images/team4.webp" alt="Ringo Kai" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="font-bold text-lg text-gray-900 group-hover:text-[#B8956A] transition-colors">Ringo Kai</div>
              <div className="text-sm text-gray-600">Customer Relations</div>
              <p className="text-center text-gray-500 text-sm mt-2">Ensures seamless experiences for collectors worldwide.</p>
            </motion.div>
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="rounded-full px-6 py-3 text-lg hover:bg-[#B8956A] hover:text-white transition-colors" asChild>
              <Link href="/contact">Join Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
