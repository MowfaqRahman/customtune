"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function NewProductPage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imageUrlPreviews, setImageUrlPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setProductImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImageUrlPreviews(previews);
    } else {
      setProductImages([]);
      setImageUrlPreviews([]);
    }
  };

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Create the product first (without image URL)
    const newProductData = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
    };

    let productId: string | null = null;
    try {
      const productResponse = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductData),
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.error || `Error creating product: ${productResponse.statusText}`);
      }
      const product = await productResponse.json();
      productId = product.id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
      return;
    }

    // 2. If product created and images exist, upload each image and link to product_images table
    if (productImages.length > 0 && productId) {
      try {
        await Promise.all(productImages.map(async (file) => {
          const uploadedImageUrl = await uploadImage(file);

          const imageInsertResponse = await fetch("/api/admin/product-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: productId, image_url: uploadedImageUrl }),
          });

          if (!imageInsertResponse.ok) {
            const errorData = await imageInsertResponse.json();
            throw new Error(errorData.error || `Error saving image URL to database: ${imageInsertResponse.statusText}`);
          }
        }));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
        return;
      }
    }

    router.push("/admin/products");
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">
            Product Name:
          </label>
          <input
            type="text"
            id="productName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="productDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="productPrice" className="block text-gray-700 text-sm font-bold mb-2">
            Product Price (₹):
          </label>
          <input
            type="number"
            id="productPrice"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="productImages" className="block text-gray-700 text-sm font-bold mb-2">
            Product Images:
          </label>
          <input
            type="file"
            id="productImages"
            accept="image/*"
            multiple // Enable multiple file selection
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleImageChange}
          />
          {imageUrlPreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {imageUrlPreviews.map((url, index) => (
                <Image key={index} src={url} alt={`Product Preview ${index + 1}`} width={100} height={100} className="object-cover rounded" />
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
