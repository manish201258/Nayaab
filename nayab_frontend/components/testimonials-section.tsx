"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");

  const testimonials = [
    {
      name: "Jack Sparrow",
      role: "Store Owner",
      quote: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
      image: "/images/team1.webp",
      rating: 5
    },
    {
      name: "Jane Doe",
      role: "Entrepreneur",
      quote: "This platform has transformed the way we do business. Highly recommended for its ease and efficiency!",
      image: "/images/team2.webp",
      rating: 4
    },
    {
      name: "John Smith",
      role: "Freelancer",
      quote: "A game-changer in the industry. The support and features are unmatched!",
      image: "/images/team4.webp",
      rating: 5
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection("right");
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setSlideDirection("left");
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideDirection("right");
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#f7f5ef] to-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight font-serif">
            Voices of <span className="text-[#B8956A]">Satisfaction</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-lg leading-relaxed">
            Discover what our clients say about their experiences with us.<br />
            Their stories inspire us to keep pushing forward.
          </p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          {/* Testimonial Card */}
          <div
            className={`bg-white rounded-2xl border border-[#B8956A]/20 shadow-xl p-8 md:p-12 transition-all duration-500 ease-in-out transform 
              ${slideDirection === "right" ? "animate-slide-in-right" :
                slideDirection === "left" ? "animate-slide-in-left" : "opacity-100"}
              hover:scale-[1.02]`
            }
            key={currentTestimonial}
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 transition-all duration-300 ${
                    i < testimonials[currentTestimonial].rating
                      ? "text-[#B8956A] fill-[#B8956A]"
                      : "text-gray-300"
                  }`}
                  strokeWidth={1.5}
                  fill={i < testimonials[currentTestimonial].rating ? "#B8956A" : "none"}
                />
              ))}
            </div>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center mb-8 italic font-serif">
              "{testimonials[currentTestimonial].quote}"
            </p>
            <div className="flex justify-center items-center space-x-4">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-[#B8956A]/20 shadow"
              />
              <div className="text-center">
                <p className="text-[#B8956A] font-bold text-lg">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-500 text-sm tracking-wide">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
          </div>
          {/* Navigation Arrows */}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-4 z-10">
            <button
              onClick={handlePrev}
              className="p-3 bg-[#B8956A] text-white rounded-full shadow hover:bg-[#A0845A] transition-colors duration-300 focus:outline-none"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-[#B8956A] text-white rounded-full shadow hover:bg-[#A0845A] transition-colors duration-300 focus:outline-none"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        {/* Dots for navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentTestimonial ? "bg-[#B8956A]" : "bg-gray-300"}`}
              onClick={() => {
                setSlideDirection(index > currentTestimonial ? "right" : "left");
                setCurrentTestimonial(index);
              }}
              aria-label={`Show testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(40px);}
          to { opacity: 1; transform: translateX(0);}
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px);}
          to { opacity: 1; transform: translateX(0);}
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.55s cubic-bezier(.56,.13,.26,.98);
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.55s cubic-bezier(.56,.13,.26,.98);
        }
      `}</style>
    </section>
  );
}
