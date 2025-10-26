"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  product_images?: { image_url: string }[];
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*, product_images(image_url)');

      if (searchQuery === 'new-arrivals') {
        // Fetch new arrival products, assuming a 'created_at' column
        query = query.order('created_at', { ascending: false }).limit(20); 
      } else if (searchQuery) {
        // Existing search by product name
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching search results:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    if (searchQuery) {
      fetchSearchResults();
    } else {
      setProducts([]); // Clear products if no query
      setLoading(false);
    }
  }, [searchQuery]);

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {searchQuery === 'new-arrivals' ? 'New Arrivals' : `Search Results for "${searchQuery}"`}
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-white rounded-[24.24px] border-0 shadow-sm">
              <CardContent className="p-0 flex flex-col h-full">
                <Link href={`/product/${product.id}`} className="block no-underline">
                  <div className="relative w-full h-[180px] aspect-square bg-gray-100 rounded-t-[24.24px] flex items-center justify-center cursor-pointer">
                    <Image
                      className="max-w-[180px] max-h-[110px] object-contain"
                      alt={product.name}
                      src={product.product_images?.[0]?.image_url || product.image || '/placeholder.png'}
                      width={180} // Max width of the container
                      height={110} // Max height of the image
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
      ) : (
        <p className="text-gray-600">No products found matching your search.</p>
      )}
    </div>
  );
}
