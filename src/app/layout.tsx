"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationBar } from "../components/Navigation/NavigationBar";
import { Footer } from "../components/Navigation/Footer";
import { CartProvider } from "../context/CartContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <div className="bg-white w-full min-h-screen">
            {!isAdminPage && <NavigationBar />}
            <main>{children}</main>
            {!isAdminPage && <Footer />}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
