"use client";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import { WishlistProvider } from "@/context/wishlistContext";

export default function Content({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
} 