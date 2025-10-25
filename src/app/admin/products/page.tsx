"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  // image_url: string | null; // No longer directly on product
}

interface ProductWithImage extends Product {
  imageUrl: string | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const productsResponse = await fetch("/api/admin/products");
      if (!productsResponse.ok) {
        throw new Error(`Error fetching products: ${productsResponse.statusText}`);
      }
      const productsData: Product[] = await productsResponse.json();

      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          const imagesResponse = await fetch(`/api/admin/product-images?product_id=${product.id}`);
          if (!imagesResponse.ok) {
            console.error(`Error fetching images for product ${product.id}: ${imagesResponse.statusText}`);
            return { ...product, imageUrl: null };
          }
          const imagesData = await imagesResponse.json();
          return { ...product, imageUrl: imagesData.length > 0 ? imagesData[0].image_url : null };
        })
      );
      setProducts(productsWithImages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product and all its associated images?")) {
      try {
        // Fetch images associated with the product first to delete from storage
        const imagesResponse = await fetch(`/api/admin/product-images?product_id=${id}`);
        if (!imagesResponse.ok) {
          throw new Error(`Error fetching images for deletion: ${imagesResponse.statusText}`);
        }
        const imagesData: { id: string; image_url: string }[] = await imagesResponse.json();

        // Delete images from Supabase Storage and product_images table
        await Promise.all(imagesData.map(async (image) => {
          await fetch(`/api/admin/product-images/${image.id}`, {
            method: "DELETE",
          });
        }));

        // Then delete the product itself
        const productResponse = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        });
        if (!productResponse.ok) {
          throw new Error(`Error deleting product: ${productResponse.statusText}`);
        }
        setProducts(products.filter((product) => product.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <Link href="/admin/products/new">
        <span className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
          Add New Product
        </span>
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">ID</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">Image</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">Name</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">Price</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="py-3 px-4">{product.id}</td>
                <td className="py-3 px-4">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} width={50} height={50} className="object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">No Image</div>
                  )}
                </td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">₹{product.price.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <span className="text-blue-600 hover:text-blue-900 mr-2">Edit</span>
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
