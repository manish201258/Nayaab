"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, isLogin, loading: authLoading } = useAuth();
  const router = useRouter();

  const url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess("Registration successful! Redirecting to login...");
        // Store user and token in context
        if (data.user && data.token) {
          register(data.user, data.token);
        }
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isLogin) {
      router.replace("/");
    }
  }, [isLogin, authLoading, router]);

  if (authLoading || isLogin) return null;

  return (
    <>
      <Header />
      {/* Modern Banner: Gradient overlay, larger text, fade-in animation */}
      <div
        className="relative h-56 sm:h-72 w-full flex items-center overflow-hidden"
        style={{
          backgroundImage: "url(/images/about-us-bg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-16 flex flex-col md:flex-row justify-between items-center h-full animate-fade-in">
          <h1 className="text-white text-3xl sm:text-5xl font-bold font-serif tracking-tight">Sign Up</h1>
          <div className="text-white text-base sm:text-lg flex gap-2 items-center mt-4 md:mt-0">
            <Link href="/" className="hover:text-[#B8956A] transition-colors duration-300">
              Home
            </Link>
            <span className="mx-1">|</span>
            <span>Sign Up</span>
          </div>
        </div>
      </div>
      {/* Main Content: Centered form with modern design */}
      <div className="bg-gradient-to-b from-[#f7f5ef] to-[#fdfbf7] min-h-[60vh] flex flex-col items-center justify-center py-12 sm:py-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md flex flex-col gap-6 border border-[#B8956A]/10 transform transition-all hover:shadow-xl"
        >
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-serif text-center">
            Create Your Account
          </div>
          {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">{success}</div>}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 transition-all shadow-sm"
              value={form.name}
              onChange={handleChange}
              required
            />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 transition-all shadow-sm"
              value={form.email}
              onChange={handleChange}
              required
            />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B8956A]/50 focus:border-[#B8956A] bg-gray-50 text-gray-800 transition-all shadow-sm"
              value={form.password}
              onChange={handleChange}
              required
            />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <button
            type="submit"
            className="bg-[#B8956A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A0845A] disabled:opacity-60 transition-all duration-300 transform hover:scale-105 shadow-md"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#B8956A] hover:underline transition-colors duration-300">
              Login
            </Link>
          </div>
        </form>
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
