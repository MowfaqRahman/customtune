"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../components/supabase/SessionProvider';

interface OrderItem {
  id: string;
  product_id: string; // Assuming this is enough to display, or could fetch product details
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

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) {
        router.push('/login');
        return;
      }
      const user = session.user;

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setError(ordersError.message || JSON.stringify(ordersError));
      } else {
        setOrders(ordersData || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [session, router]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Order ID: {order.id.substring(0, 8)}...</h3>
                  <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <p><strong>Status:</strong> <span className={`font-medium ${order.status === 'confirmed' ? 'text-green-600' : order.status === 'shipped' ? 'text-blue-600' : 'text-gray-600'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                <p><strong>Total Amount:</strong> ₹{order.total_amount.toFixed(2)}</p>
                <h4 className="text-md font-semibold mt-2">Items:</h4>
                {order.order_items.length === 0 ? (
                  <p className="ml-4 text-sm text-gray-500">No items in this order.</p>
                ) : (
                  <ul className="ml-4 list-disc list-inside text-sm text-gray-700">
                    {order.order_items.map((item) => (
                      <li key={item.id}>{item.quantity} x Product ID: {item.product_id} (₹{item.price.toFixed(2)} each)</li>
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
};

export default OrdersPage;
