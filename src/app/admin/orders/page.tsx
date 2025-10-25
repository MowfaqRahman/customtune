"use client";

import Link from "next/link";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    { id: "001", customer: "John Doe", total: 250, status: "Pending" },
    { id: "002", customer: "Jane Smith", total: 120, status: "Shipped" },
    { id: "003", customer: "Peter Jones", total: 340, status: "Confirmed" },
    { id: "004", customer: "Alice Brown", total: 80, status: "Rejected" },
  ]);

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Orders</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {order.id}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {order.customer}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  ₹{order.total.toFixed(2)}
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
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center space-x-2">
                  <ToggleGroup
                    type="single"
                    value={order.status}
                    onValueChange={(newStatus) =>
                      handleStatusChange(order.id, newStatus)
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
