"use client";

import { usePathname } from "next/navigation";
import { NavigationBar } from "./Navigation/NavigationBar";
import { Footer } from "./Navigation/Footer";
import { CartProvider } from "@/context/CartContext";
import React from 'react';

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/login");
  const isSignupPage = pathname.startsWith("/signup");

  return (
    <CartProvider>
      <div className="bg-white w-full min-h-screen">
        {!isAdminPage && !isLoginPage && !isSignupPage && <NavigationBar />}
        <main>{children}</main>
        {!isAdminPage && !isLoginPage && !isSignupPage && <Footer />}
      </div>
    </CartProvider>
  );
}
