"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import Link from "next/link";

const mainFAQs = [
  {
    question: "How do you source your antique collections?",
    answer: "Our team travels globally to auctions, estates, and private sellers, ensuring each piece has verifiable provenance and historical value.",
  },
  {
    question: "What makes an item 'rare' in your inventory?",
    answer: "Rarity is determined by age, condition, historical significance, and limited availability—often pieces from specific eras or artisans.",
  },
  {
    question: "Do you offer restoration services?",
    answer: "Yes, we partner with expert restorers to maintain original integrity while enhancing durability for modern use.",
  },
];

const shoppingFAQs = [
  {
    question: "What's the process for international shipping?",
    answer: "We handle customs clearance and use insured carriers; delivery times vary from 7-21 days depending on destination.",
  },
  {
    question: "Can I reserve an item before purchase?",
    answer: "For high-demand pieces, we offer a 48-hour hold with a small deposit, refundable if you decide not to buy.",
  },
  {
    question: "How do gift wrapping options work?",
    answer: "Select gift wrapping at checkout; we use elegant, antique-inspired packaging with personalized notes.",
  },
];

const paymentFAQs = [
  {
    question: "Are installment plans available for expensive items?",
    answer: "For purchases over $500, we provide interest-free installments through trusted partners—apply during checkout.",
  },
  {
    question: "What security measures protect my payment?",
    answer: "We employ end-to-end encryption and fraud monitoring, complying with global standards for safe transactions.",
  },
  {
    question: "Do you accept cryptocurrency?",
    answer: "Currently, we support select cryptocurrencies like Bitcoin for verified purchases—contact support for details.",
  },
];

function FAQSection({ title, items }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">{title}</h3>
      {items.map((item, idx) => (
        <div key={idx} className="border-b border-gray-200 pb-4">
          <button
            className="w-full text-left font-semibold text-gray-800 hover:text-[#B8956A] transition-colors duration-300 flex justify-between items-center"
            onClick={() => setOpen(open === idx ? -1 : idx)}
          >
            {item.question}
            <span className={`text-[#B8956A] transition-transform duration-300 ${open === idx ? "rotate-180" : ""}`}>↓</span>
          </button>
          <div
            className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ${
              open === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Header />
      {/* Banner: Modern gradient with subtle animation */}
      <div
        className="relative h-56 sm:h-72 w-full flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/about-us-bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-16 flex flex-col md:flex-row justify-between items-center h-full animate-fade-in">
          <h1 className="text-white text-3xl sm:text-5xl font-bold font-serif tracking-tight">Frequently Asked Questions</h1>
          <div className="text-white text-base sm:text-lg flex gap-2 items-center mt-4 md:mt-0">
            <Link href="/" className="hover:text-[#B8956A] transition-colors duration-300">
              Home
            </Link>
            <span className="mx-1">|</span>
            <span>FAQs</span>
          </div>
        </div>
      </div>
      {/* Main Section: Clean, spacious layout with gradient background */}
      <div className="bg-gradient-to-b from-[#f7f5ef] to-[#fdfbf7] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-16">
          {/* Top Section: Image + Intro - Balanced and responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/images/about.webp"
                alt="Antique Collection"
                className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg transform transition-all hover:scale-105 duration-500"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">Discover Answers to Your Antique Queries</h2>
              <p className="text-gray-600 leading-relaxed">
                Explore insights on our unique collections, from sourcing rare pieces to care tips for timeless treasures.
              </p>
              <FAQSection items={mainFAQs} />
            </div>
          </div>
          {/* Info Sections: Two-column with fresh content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">Shopping Guidance</h3>
              <FAQSection items={shoppingFAQs} />
            </div>
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">Payment Insights</h3>
              <FAQSection items={paymentFAQs} />
            </div>
          </div>
          {/* Bottom Section: Call-to-action with open layout */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">Still Have Questions?</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Our experts are here to help with any inquiries about antiques or your orders.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </>
  );
}
