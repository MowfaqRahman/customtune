"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Profile {
  username: string | null;
  email: string | null;
  role: string | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  profiles: Profile | null;
}

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // console.log("Data from API:", data);
        setOrders(data);
      } catch (err: unknown) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const response = await fetch(`/api/admin/customer-orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      console.log(`Order ${orderId} status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally revert the UI state or show an error message
    }
  };

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Orders</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700">
                    {order.profiles ? (order.profiles.username || "N/A") : "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700">
                    ₹{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight ${order.status === "Pending" ? "text-yellow-900" : ""} ${order.status === "Rejected" ? "text-red-900" : ""}`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 opacity-50 rounded-full ${order.status === "Pending" ? "bg-yellow-200" : ""} ${order.status === "Shipped" ? "bg-green-200" : ""} ${order.status === "Confirmed" ? "bg-blue-200" : ""} ${order.status === "Rejected" ? "bg-red-200" : ""}`}
                      ></span>
                      <span className="relative">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-700">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center space-x-2">
                    <ToggleGroup
                      type="single"
                      value={order.status}
                      onValueChange={(newStatus) =>
                        handleStatusChange(order.id as string, newStatus)
                      }
                      className="mt-2"
                    >
                      <ToggleGroupItem value="Confirmed">Confirmed</ToggleGroupItem>
                      <ToggleGroupItem value="Packed">Packed</ToggleGroupItem>
                      <ToggleGroupItem value="Shipped">Shipped</ToggleGroupItem>
                      <ToggleGroupItem value="Rejected">Rejected</ToggleGroupItem>
                    </ToggleGroup>
                    <Link
                      href={`/admin/customer-orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900 ml-2"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
