"use client";

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { useCart } from "../context/CartContext";
import { SkeletonCard } from "../components/ui/skeleton-card";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Image from "next/image";

const categoryTabs = [
  { id: "wheels", label: "Wheels" },
  { id: "tires", label: "Tires" },
  { id: "suspension", label: "Suspension" },
  { id: "intake", label: "Intake" },
];

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  created_at: string; // Add created_at field
  product_images?: { image_url: string }[]; // Optional, as it might not be directly in the root product object from the homepage API
}

export const HomePageContent = () => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(image_url)')
        .order('created_at', { ascending: false }) // Order by creation date, newest first
        .limit(4); // Get only the latest 4 products

      if (error) {
        console.error("Error fetching products:", error);
        setLoading(false); // Also set loading to false on error
      } else {
        setProducts(data || []);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <>
      <section className="relative px-4 py-8 md:px-[100px] md:py-12 mb-12 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[756px]">
          <div className="relative rounded-[10px] overflow-hidden bg-[#e0e0e0] h-[300px] md:h-auto">
            <Image
              className="absolute inset-0 w-full h-full object-cover"
              alt="Header left"
              src="/assets/header1.jpg"
              width={756} 
              height={756} 
            />
          </div>
          <div className="relative flex flex-col items-center justify-center bg-[url(/bg.svg)] bg-cover bg-center rounded-[10px] h-[300px] md:h-auto p-4">
            <div className="text-center">
              <div className="[font-family:'Poppins',Helvetica] font-medium text-[#484848] text-[40px] md:text-[91px] tracking-[-1.6px] md:tracking-[-3.64px] leading-[40px] md:leading-[91px] whitespace-nowrap">
                ULTIMATE
              </div>
              <div className="[-webkit-text-stroke:1px_#484848] [font-family:'Poppins',Helvetica] font-medium text-transparent text-[80px] md:text-[187px] tracking-[-4.1px] md:tracking-[-10.29px] leading-[80px] md:leading-[187px] whitespace-nowrap">
                SALE
              </div>
              <Button className="mt-6 md:mt-12 bg-black text-white rounded-[10px] shadow-[0px_20px_35px_#00000026] px-8 py-3 h-10 md:px-[59px] md:py-5 md:h-14 [font-family:'Poppins',Helvetica] font-medium text-sm md:text-base tracking-[0] leading-4">
                SHOP NOW
              </Button>
            </div>
          </div>

          <div className="relative rounded-[10px] overflow-hidden bg-[#e0e0e0] h-[300px] md:h-auto">
            <Image
              className="absolute inset-0 w-full h-full object-cover"
              alt="Header right"
              src="/assets/header2.jpg"
              width={756} 
              height={756} 
            />
          </div>
        </div>
      </section>

      {/* removed small double-image feature to match new order */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="[font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-[#1e1e1e] text-[30px] md:text-[50.9px] tracking-[0] leading-[normal] text-center md:text-left">
            Best Selling Product
          </h2>
          <button className="text-[#e58311] text-sm" onClick={() => router.push("/search")}>View All →</button>
        </div>

        <div className="flex justify-center mb-12 overflow-x-auto">
          <ToggleGroup
            type="single"
            defaultValue="wheels"
            className="bg-[#eeeeee] rounded-[53.33px] p-[7.27px] flex-nowrap"
          >
            {categoryTabs.map((tab) => (
              <ToggleGroupItem
                key={tab.id}
                value={tab.id}
                className="rounded-[38.79px] px-[12.12px] py-[4.85px] data-[state=on]:bg-white [font-family:'Gilroy-Medium-Medium',Helvetica] font-medium text-[#1e1e1e] text-[16px] md:text-[21.8px] leading-[40.4px] tracking-[0] opacity-80 h-auto whitespace-nowrap"
              >
                {tab.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

          <div className="relative">
          {/* Removed desktop-only chevron buttons for simplicity; can re-add with responsive hiding */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[50.9px] px-0 md:px-[150px]">
            {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : products.slice(0, 4).map((product) => (
              <Card key={product.id} className="bg-white rounded-[24.24px] border-0 shadow-sm">
                <CardContent className="p-0 flex flex-col h-full">
                  <Link href={`/product/${product.id}`} className="block no-underline">
                    <div className="relative w-full h-[180px] aspect-square bg-gray-100 rounded-t-[24.24px] flex items-center justify-center cursor-pointer">
                      <Image
                        className="max-w-[180px] max-h-[110px] object-contain"
                        alt={product.name}
                        src={product.product_images?.[0]?.image_url || product.image || '/placeholder.png'}
                        width={180}
                        height={110}
                      />
                    </div>
                  </Link>

                  <div className="p-[18px] flex flex-col flex-grow">
                    <div className="mb-[7.4px]">
                      <span className="[font-family:'Inter',Helvetica] font-normal text-[#8d8d8d] text-[20.3px] leading-[normal] tracking-[0]">
                        {product.category}
                      </span>
                    </div>
                    <Link href={`/product/${product.id}`} className="block no-underline">
                      <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#0d1a39] text-[20.3px] tracking-[0] leading-[normal] mb-[4px] cursor-pointer hover:text-[#0d1a39]/80">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-[3.7px]">
                        <span className="[font-family:'Inter',Helvetica] font-semibold text-[#0d1a39] text-[18.5px] tracking-[0] leading-[normal]">
                          ₹
                        </span>
                        <span className="[font-family:'Inter',Helvetica] font-semibold text-[#0d1a39] text-[25.8px] tracking-[0] leading-[normal]">
                          {product.price}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        className="w-9 h-9 rounded-full bg-black hover:bg-black/90"
                        aria-label="Add to cart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <PlusIcon className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Re-adding chevron buttons with responsive classes */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-[108px] md:h-[108px] rounded-full hidden lg:flex"
          >
            <ChevronLeftIcon className="w-6 h-6 md:w-12 md:h-12" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-[108px] md:h-[108px] rounded-full hidden lg:flex"
          >
            <ChevronRightIcon className="w-6 h-6 md:w-12 md:h-12" />
          </Button>
        </div>
      </section>

      {/* Experiences */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 md:-top-8 md:-left-8 w-[180px] h-[140px] md:w-[260px] md:h-[200px] bg-black/5 rounded-[12px] md:rounded-[24px]" />
            <Image
              src="/assets/f1.jpg"
              alt="Experience car"
              className="relative z-10 w-full max-w-full md:max-w-[620px] h-[240px] md:h-[360px] object-cover rounded-[12px] md:rounded-[16px] shadow-[0_10px_20px_rgba(0,0,0,0.1)] md:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
              width={620}
              height={360}
            />
          </div>
          <div className="text-center md:text-left">
            <div className="text-[#e58311] text-xs md:text-sm tracking-[1px] md:tracking-[2px] uppercase mb-2">Experiences</div>
            <h2 className="[font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-[#1e1e1e] text-[30px] md:text-[42px] leading-[1.2] md:leading-[1.1] mb-4">
              We Provide You The
              <br />
              Best Experience
            </h2>
            <p className="opacity-80 [font-family:'Gilroy-Regular-Regular',Helvetica] font-normal text-[#1e1e1e] text-sm md:text-lg leading-[24px] md:leading-[33.3px] mb-6">
              You don&apos;t have to worry about the result because all of our
              interiors are made by professionals with elegant and luxurious
              design and premium quality materials.
            </p>
            <button className="inline-flex items-center gap-2 md:gap-3 text-[#e58311] text-sm">
              <span>More info</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Materials + gallery (f2 as the large image) */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <div className="text-[#e58311] text-xs md:text-sm tracking-[1px] md:tracking-[2px] uppercase mb-2">Performance</div>
            <h2 className="[font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-[#1e1e1e] text-[30px] md:text-[42px] leading-[1.2] md:leading-[1.1] mb-4">
              Premium Aftermarket Parts For
              <br />
              Car Enthusiasts
            </h2>
            <p className="opacity-80 [font-family:'Gilroy-Regular-Regular',Helvetica] font-normal text-[#1e1e1e] text-sm md:text-lg leading-[24px] md:leading-[33.3px]">
              Because we&apos;re serious about automotive performance, using premium
              materials and advanced engineering to enhance your ride at competitive prices.
            </p>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="absolute -top-4 -right-4 md:-top-8 md:-right-10 w-[220px] h-[160px] md:w-[300px] md:h-[220px] bg-black/5 rounded-[12px] md:rounded-[24px]" />
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-4">
                <Image
                  src="/assets/header2.jpg"
                  alt="thumb 1"
                  className="w-full h-[100px] md:w-[180px] md:h-[140px] object-cover rounded-[14px]"
                  width={180}
                  height={140}
                />
                <Image
                  src="/assets/header1.jpg"
                  alt="thumb 2"
                  className="w-full h-[100px] md:w-[180px] md:h-[180px] object-cover rounded-[14px]"
                  width={180}
                  height={180}
                />
              </div>
              <Image
                src="/assets/f2.jpg"
                alt="materials feature"
                className="w-full h-[200px] md:w-[520px] md:h-[320px] object-cover rounded-[18px] shadow-[0_10px_20px_rgba(0,0,0,0.1)] md:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                width={520}
                height={320}
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-center [font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-[#1e1e1e] text-[30px] md:text-[36px] tracking-[0] leading-[normal]">
            <span className="text-black/70">New</span> Arrivals <span className="text-black">Product</span>
          </h2>
          <button className="text-[#e58311] text-sm" onClick={() => router.push("/search?query=new-arrivals")}>View All →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[50.9px] px-0 md:px-[150px]">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : products.slice(0, 4).map((product) => (
            <Card key={`new-${product.id}`} className="bg-white rounded-[24.24px] border-0 shadow-sm">
              <CardContent className="p-0 flex flex-col h-full">
                <Link href={`/product/${product.id}`} className="block no-underline">
                  <div className="relative w-full h-[180px] aspect-square bg-gray-100 rounded-t-[24.24px] flex items-center justify-center cursor-pointer">
                    <Image className="max-w-[180px] max-h-[110px] object-contain" alt={product.name} src={product.product_images?.[0]?.image_url || product.image || '/placeholder.png'} width={180} height={110} />
                  </div>
                </Link>
                <div className="p-[18px] flex flex-col flex-grow">
                  <div className="mb-[4px]"><span className="text-[#8d8d8d]">{product.category}</span></div>
                  <Link href={`/product/${product.id}`} className="block no-underline">
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#0d1a39] text-[20.3px] tracking-[0] leading-[normal] mb-[4px] cursor-pointer hover:text-[#0d1a39]/80">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-semibold">₹ {product.price}</span>
                    <Button 
                      size="icon" 
                      className="w-9 h-9 rounded-full bg-black hover:bg-black/90" 
                      aria-label="Add to cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <PlusIcon className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Full width hero between sections */}
      <section className="mb-12 md:mb-24">
        <div className="relative w-full" style={{ paddingTop: "42.86%" }}>
          <video
            src="/assets/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Performance Product */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="[font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-[#1e1e1e] text-[30px] md:text-[36px]">Performance Product</h2>
          <button className="text-[#e58311] text-sm" onClick={() => router.push("/search")}>View All →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[50.9px] px-0 md:px-[150px]">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : products.slice(0, 4).map((product) => (
            <Card key={`perf-${product.id}`} className="bg-white rounded-[24.24px] border-0 shadow-sm">
              <CardContent className="p-0 flex flex-col h-full">
                <Link href={`/product/${product.id}`} className="block no-underline">
                  <div className="relative w-full h-[180px] aspect-square bg-gray-100 rounded-t-[24.24px] flex items-center justify-center cursor-pointer">
                    <Image className="max-w-[180px] max-h-[110px] object-contain" alt={product.name} src={product.product_images?.[0]?.image_url || product.image || '/placeholder.png'} width={180} height={110} />
                  </div>
                </Link>
                <div className="p-[18px] flex flex-col flex-grow">
                  <div className="mb-[4px]"><span className="text-[#8d8d8d]">{product.category}</span></div>
                  <Link href={`/product/${product.id}`} className="block no-underline">
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#0d1a39] text-[20.3px] tracking-[0] leading-[normal] mb-[4px] cursor-pointer hover:text-[#0d1a39]/80">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-semibold">₹ {product.price}</span>
                    <Button 
                      size="icon" 
                      className="w-9 h-9 rounded-full bg-black hover:bg-black/90" 
                      aria-label="Add to cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <PlusIcon className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fog Lights */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="[font-family:'Gilroy-Bold-Bold',Helvetica] font-bold text-[#1e1e1e] text-[24px]">Fog Lights</h2>
          <button className="text-[#e58311] text-sm" onClick={() => router.push("/search")}>View All →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[50.9px] px-0 md:px-[150px]">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : products.slice(0, 4).map((product) => (
            <Card key={`fog-${product.id}`} className="bg-white rounded-[24.24px] border-0 shadow-sm">
              <CardContent className="p-0 flex flex-col h-full">
                <Link href={`/product/${product.id}`} className="block no-underline">
                  <div className="relative w-full h-[180px] aspect-square bg-gray-100 rounded-t-[24.24px] flex items-center justify-center cursor-pointer">
                    <Image className="max-w-[180px] max-h-[110px] object-contain" alt={product.name} src={product.product_images?.[0]?.image_url || product.image || '/placeholder.png'} width={180} height={110} />
                  </div>
                </Link>
                <div className="p-[18px] flex flex-col flex-grow">
                  <div className="mb-[4px]"><span className="text-[#8d8d8d]">{product.category}</span></div>
                  <Link href={`/product/${product.id}`} className="block no-underline">
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-[#0d1a39] text-[20.3px] tracking-[0] leading-[normal] mb-[7.4px] cursor-pointer hover:text-[#0d1a39]/80">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-semibold">₹ {product.price}</span>
                    <Button 
                      size="icon" 
                      className="w-9 h-9 rounded-full bg-black hover:bg-black/90" 
                      aria-label="Add to cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <PlusIcon className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Promo duo section - moved near bottom */}
      <section className="px-4 md:px-[100px] mb-12 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="relative rounded-[16px] overflow-hidden bg-black/5 h-[200px] md:h-[260px]">
            <Image
              src="/rectangle-1456.png"
              alt="Free shipping"
              className="w-full h-full object-cover opacity-80"
              width={600}
              height={260}
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-[#ffeb3b] text-[10px] md:text-[12px] px-2 py-1 rounded-full uppercase tracking-wide">
                Free shipping for amount above ₹ 800
              </span>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md shadow text-sm">FREE SHIPPING</span>
            </div>
          </div>
          <div className="relative rounded-[16px] overflow-hidden bg-[#0a0a0a] h-[200px] md:h-[260px] flex items-start">
            <div className="m-4 md:m-6">
              <div className="inline-flex bg-[#ffe000] px-2 py-1 rounded-md">
                <div className="text-black font-semibold text-[18px] md:text-[22px] leading-none">36% OFF</div>
              </div>
              <div className="mt-2 text-white/60 text-xs md:text-sm">Flash Sale • Limited Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple footer */}
      {/* The Footer component was removed, so this section is now empty */}
    </>
  );
};
