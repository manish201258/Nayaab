"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <Header />
      {/* Banner: Enhanced with gradient overlay and centered text for a premium look */}
      <div
        className="relative h-56 sm:h-64 w-full flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/about-us-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-16 flex flex-col md:flex-row justify-between items-center h-full">
          <h1 className="text-white text-3xl sm:text-4xl font-bold font-serif tracking-tight animate-fade-in">
            Contact Us
          </h1>
          <div className="text-white text-base sm:text-lg flex gap-2 items-center mt-4 md:mt-0 animate-fade-in">
            <Link href="/" className="hover:text-[#B8956A] transition-colors duration-300">
              Home
            </Link>
            <span className="mx-1">|</span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>
      {/* Main Section: Gradient background with refined spacing */}
      <div className="bg-gradient-to-b from-[#f7f5ef] to-[#fdfbf7] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-start">
          {/* Contact Info: Modern card with elegant icons and hover effects */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 border border-[#B8956A]/10 transform transition-all hover:shadow-xl">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-serif">Get in Touch</h2>
              <p className="text-gray-600 leading-relaxed">
                We'd love to hear from you! Reach out via the form or use the details below.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-gray-700 text-base">
              <div className="flex items-start gap-4 group">
                <svg
                  className="w-6 h-6 text-[#B8956A] group-hover:text-[#A0845A] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a2 2 0 0 0-2.828 0l-4.243 4.243a8 8 0 1 1 11.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                <span className="group-hover:text-gray-900 transition-colors">
                  123 Antique Street, Old City, India
                </span>
              </div>
              <div className="flex items-start gap-4 group">
                <svg
                  className="w-6 h-6 text-[#B8956A] group-hover:text-[#A0845A] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8m-9 13a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                </svg>
                <span className="group-hover:text-gray-900 transition-colors">info@nayaab.com</span>
              </div>
              <div className="flex items-start gap-4 group">
                <svg
                  className="w-6 h-6 text-[#B8956A] group-hover:text-[#A0845A] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 0 1 2-2h2.28a2 2 0 0 1 1.7 1l1.54 2.59a2 2 0 0 0 1.7 1H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z" />
                </svg>
                <span className="group-hover:text-gray-900 transition-colors">+91-000-00-000</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Link
                href="#"
                className="text-[#B8956A] hover:text-[#A0845A] transform transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-[#B8956A] hover:text-[#A0845A] transform transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-[#B8956A] hover:text-[#A0845A] transform transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.7 1.64.9c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z" />
                </svg>
              </Link>
            </div>
          </div>
          {/* Contact Form: Clean, modern inputs with subtle shadows */}
          <form className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col gap-6 border border-[#B8956A]/10 transform transition-all hover:shadow-xl">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-serif">
              Send Us a Message
            </div>
            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 transition-all shadow-sm"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 transition-all shadow-sm"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 resize-none transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] w-fit shadow-md transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
        {/* Map Section: Modern placeholder with hover effect */}
        <div className="container mx-auto px-4 sm:px-16 mt-12 sm:mt-16">
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-[#B8956A]/10 transform transition-all hover:shadow-xl">
            {/* Replace with real map embed (e.g., Google Maps iframe) if desired */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
              <img
                src="/images/full-layout.png"
                alt="Location Map"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center text-[#B8956A] text-lg font-semibold bg-black/30">
                Visit Us at 123 Antique Street
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* Simple fade-in animation for banner */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </>
  );
}
