"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';
import { useParams } from 'next/navigation';

interface Profile {
  id: string;
  username: string | null;
  role: string;
  created_at: string;
}

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  category: string | null;
  price: number;
  image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const userId = id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, role, created_at')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError(profileError.message);
        setLoading(false);
        return;
      }
      setProfile(profileData);

      // Fetch cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id, product_id, name, category, price, image, size, color, quantity')
        .eq('user_id', userId);

      if (cartError) {
        console.error("Error fetching cart:", cartError);
        setError(cartError.message);
      } else {
        setCart(cartData || []);
      }

      // Fetch orders and order items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(
          `
          id,
          total_amount,
          status,
          created_at,
          order_items(
            id,
            product_id,
            quantity,
            price
          )
          `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setError(ordersError.message);
      } else {
        setOrders(ordersData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading customer details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="p-4">Customer not found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Details: {profile.username || profile.id}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <p><strong>Username:</strong> {profile.username || 'N/A'}</p>
        <p><strong>User ID:</strong> {profile.id}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Account Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Orders History</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Order ID: {order.id.substring(0, 8)}...</h3>
                  <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> ₹{order.total_amount.toFixed(2)}</p>
                <h4 className="text-md font-semibold mt-2">Items:</h4>
                {order.order_items.length === 0 ? (
                  <p className="ml-4 text-sm text-gray-500">No items in this order.</p>
                ) : (
                  <ul className="ml-4 list-disc list-inside text-sm text-gray-700">
                    {order.order_items.map((item) => (
                      <li key={item.id}>{item.quantity} x {item.product_id} (₹{item.price.toFixed(2)} each)</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
