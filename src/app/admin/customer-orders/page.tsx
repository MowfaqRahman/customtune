"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  username: string | null;
  role: string;
  created_at: string;
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

interface CustomerWithOrders extends Profile {
  orders: Order[];
}

export default function AdminCustomerOrdersPage() {
  const [customersWithOrders, setCustomersWithOrders] = useState<CustomerWithOrders[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomersAndOrders = async () => {
      setLoading(true);
      setError(null);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, role, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        setError(profilesError.message);
        setLoading(false);
        return;
      }

      if (!profilesData) {
        setCustomersWithOrders([]);
        setLoading(false);
        return;
      }

      const customersPromises = profilesData.map(async (profile) => {
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
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error(`Error fetching orders for user ${profile.id}:`, ordersError);
          // Optionally handle individual order fetch errors, e.g., by setting an error state for that customer
          return { ...profile, orders: [] };
        }

        return { ...profile, orders: ordersData || [] };
      });

      const customers = await Promise.all(customersPromises);
      setCustomersWithOrders(customers);
      setLoading(false);
    };

    fetchCustomersAndOrders();
  }, []);

  if (loading) {
    return <div className="p-4">Loading customers and orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Customer Orders</h1>
      {customersWithOrders.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="space-y-8">
          {customersWithOrders.map((customer) => (
            <div key={customer.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Customer: {customer.username || customer.id}</h2>
              <p><strong>User ID:</strong> {customer.id}</p>
              <p><strong>Role:</strong> {customer.role}</p>
              <p className="mb-4"><strong>Account Created:</strong> {new Date(customer.created_at).toLocaleString()}</p>

              <h3 className="text-lg font-semibold mb-2">Orders:</h3>
              {customer.orders.length === 0 ? (
                <p>No orders found for this customer.</p>
              ) : (
                <div className="space-y-4">
                  {customer.orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold">Order ID: {order.id.substring(0, 8)}...</h4>
                        <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</span>
                      </div>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Total Amount:</strong> ₹{order.total_amount.toFixed(2)}</p>
                      <h5 className="text-md font-semibold mt-2">Items:</h5>
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
          ))}
        </div>
      )}
    </div>
  );
}


