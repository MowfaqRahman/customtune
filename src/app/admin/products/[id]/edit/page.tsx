"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductImage {
  id: string;
  image_url: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newProductImages, setNewProductImages] = useState<File[]>([]);
  const [newImageUrlPreviews, setNewImageUrlPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductAndImages = async () => {
    try {
      // Fetch product details
      const productResponse = await fetch(`/api/admin/products/${id}`);
      if (!productResponse.ok) {
        throw new Error(`Error fetching product: ${productResponse.statusText}`);
      }
      const productData: Product = await productResponse.json();
      setProductName(productData.name);
      setProductDescription(productData.description || "");
      setProductPrice(productData.price.toString());

      // Fetch associated images
      const imagesResponse = await fetch(`/api/admin/product-images?product_id=${id}`);
      if (!imagesResponse.ok) {
        throw new Error(`Error fetching images: ${imagesResponse.statusText}`);
      }
      const imagesData: ProductImage[] = await imagesResponse.json();
      setExistingImages(imagesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndImages();
  }, [id]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewProductImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setNewImageUrlPreviews(previews);
    } else {
      setNewProductImages([]);
      setNewImageUrlPreviews([]);
    }
  };

  const uploadImageToStorage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase.storage
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

  const handleImageDelete = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/product-images/${imageId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error deleting image: ${response.statusText}`);
        }

        setExistingImages(existingImages.filter(img => img.id !== imageId));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Update product details
    const updatedProductData = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
    };

    try {
      const productResponse = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProductData),
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.error || `Error updating product: ${productResponse.statusText}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return;
    }

    // 2. If new images are selected, upload them and link to product_images table
    if (newProductImages.length > 0) {
      try {
        await Promise.all(newProductImages.map(async (file) => {
          const newUploadedImageUrl = await uploadImageToStorage(file);

          const imageInsertResponse = await fetch("/api/admin/product-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: id, image_url: newUploadedImageUrl }),
          });

          if (!imageInsertResponse.ok) {
            const errorData = await imageInsertResponse.json();
            throw new Error(errorData.error || `Error saving new image URL to database: ${imageInsertResponse.statusText}`);
          }
        }));
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    router.push("/admin/products");
    setLoading(false);
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product {id}</h1>
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

        {/* Existing Images Section */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Existing Product Images:
          </label>
          <div className="flex flex-wrap gap-4">
            {existingImages.length > 0 ? (
              existingImages.map((image) => (
                <div key={image.id} className="relative w-24 h-24 group">
                  <Image src={image.image_url} alt="Product Image" layout="fill" objectFit="cover" className="rounded" />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete image"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No images for this product.</p>
            )}
          </div>
        </div>

        {/* Add New Image Section */}
        <div className="mb-4">
          <label htmlFor="newProductImage" className="block text-gray-700 text-sm font-bold mb-2">
            Add New Product Images:
          </label>
          <input
            type="file"
            id="newProductImage"
            accept="image/*"
            multiple // Enable multiple file selection
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleNewImageChange}
          />
          {newImageUrlPreviews.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {newImageUrlPreviews.map((url, index) => (
                <Image key={index} src={url} alt={`New Image Preview ${index + 1}`} width={100} height={100} className="object-cover rounded" />
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
