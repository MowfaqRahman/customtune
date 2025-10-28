"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import React from "react";
import Image from "next/image";
import { PlusIcon, MinusIcon } from "lucide-react";

interface Product {
  id: string; // uuid
  name: string;
  description: string | null;
  price: number;
  stock: number | null;
  created_at: string;
  updated_at: string;
  product_images: { image_url: string }[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [qty, setQty] = useState<number>(1);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { addToCart } = useCart();
  const router = useRouter();
  const { id } = React.use(params) as { id: string }; // Get product ID from URL, unwrapped with use() - Next.js 13 App Router

  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?id=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data) {
          setProductData(data);
        } else {
          setProductData(null);
          setError("Product not found.");
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-fetch when ID changes

  const gallery: { image_url: string }[] = productData?.product_images || [];

  useEffect(() => {
    // Reset activeIndex when productData changes
    setActiveIndex(0);
  }, [productData]);

  const handleAddToCart = () => {
    if (!productData) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        category: productData.category || "", // Use actual category or default
        image: productData.product_images?.[0]?.image_url || '/placeholder.png', // Use the first image for cart thumbnail
      });
    }
  };

  const handleBuyNow = () => {
    if (!productData) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        category: productData.category || "", // Use actual category or default
        image: productData.product_images?.[0]?.image_url || '/placeholder.png',
      });
    }
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-10 px-[100px] py-10 w-full max-w-7xl">
          <div className="grid grid-cols-[120px_1fr] gap-6 items-start">
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[90px] w-[120px] rounded-[12px] bg-gray-200 animate-pulse" />
              ))}
            </div>
            <div className="relative rounded-[16px] overflow-hidden bg-gray-200 animate-pulse w-full h-[520px]" />
          </div>
          <div>
            <div className="h-8 bg-gray-200 animate-pulse w-3/4 mb-4 rounded" />
            <div className="h-6 bg-gray-200 animate-pulse w-1/4 mb-6 rounded" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-12 h-6 bg-gray-200 animate-pulse rounded" />
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 h-12 rounded-md bg-gray-200 animate-pulse" />
              <div className="flex-1 h-12 rounded-md bg-gray-200 animate-pulse" />
            </div>
            <div className="border rounded-md mb-4 bg-gray-200 animate-pulse h-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>
          <button onClick={() => router.push('/')} className="mt-4 text-blue-500 hover:underline">Go to Homepage</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 py-6 md:py-10">
        {/* Left: large image with vertical thumbnails */}
        <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-4 sm:gap-6 items-start">
          <div className="flex flex-col gap-2 sm:gap-4">
            {gallery.map((image, idx) => (
              <button
                key={image.image_url}
                onClick={() => setActiveIndex(idx)}
                className={`h-[60px] w-[80px] sm:h-[90px] sm:w-[120px] rounded-[8px] sm:rounded-[12px] overflow-hidden border ${
                  activeIndex === idx ? "border-black" : "border-transparent"
                }`}
              >
                <Image src={image.image_url} alt={`thumb-${idx}`} width={120} height={90} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative rounded-[12px] sm:rounded-[16px] overflow-hidden bg-black/5">
            <Image src={gallery[activeIndex]?.image_url || '/placeholder.png'} alt="product" width={520} height={520} className="w-full h-[300px] sm:h-[520px] object-cover" />
          </div>
        </div>

        {/* Right: details */}
        <div>
          <h1 className="[font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-xl sm:text-[32px] leading-tight mb-2">
            {productData.name}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="text-lg sm:text-[22px] font-semibold">₹{productData.price}</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center"
              aria-label="decrease"
            >
              <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <div className="w-10 text-center text-sm sm:text-base">{qty}</div>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center"
              aria-label="increase"
            >
              <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              className="flex-1 h-10 sm:h-12 rounded-md bg-black text-white hover:bg-black/90 transition-colors text-sm sm:text-base"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
            <button
              className="flex-1 h-10 sm:h-12 rounded-md bg-[#ffe000] hover:bg-[#ffe000]/90 transition-colors text-sm sm:text-base"
              onClick={handleBuyNow}
            >
              BUY IT NOW
            </button>
          </div>

          {/* Accordion for Description */}
          {productData.description && (
            <details className="border rounded-md mb-4" open>
              <summary className="cursor-pointer select-none px-3 py-2 sm:px-4 sm:py-3 font-medium text-sm sm:text-base">Description</summary>
              <div className="px-3 pb-3 sm:px-4 sm:pb-4 text-xs sm:text-sm text-black/80 leading-6 sm:leading-7">
                {productData.description}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
