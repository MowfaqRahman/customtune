"use client";

import { ChevronDown } from "lucide-react";
import AllOrders from "@/components/admin/AllOrders";
import { useState, useEffect } from "react";

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

export default function AdminPage() {
  const [customers, setCustomers] = useState(0);
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalIncomeData, setTotalIncomeData] = useState<
    { month: string; value: number }[]
  >([]);

  const incomeGrowth = 8; // This remains dummy data for now

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch overview data (customers and total income)
        const overviewResponse = await fetch("/api/admin/overview");
        if (!overviewResponse.ok) {
          throw new Error(`Error fetching overview: ${overviewResponse.statusText}`);
        }
        const overviewData = await overviewResponse.json();
        setCustomers(overviewData.customers);
        setIncome(overviewData.income);

        // Fetch all orders for monthly income calculation
        const ordersResponse = await fetch("/api/admin/orders");
        if (!ordersResponse.ok) {
          throw new Error(`Error fetching orders: ${ordersResponse.statusText}`);
        }
        const ordersData = await ordersResponse.json();

        const monthlyIncome: { [key: string]: number } = {};
        ordersData.forEach((order: Order) => {
          const date = new Date(order.created_at);
          const month = date.toLocaleString("default", { month: "short" });
          monthlyIncome[month] = (monthlyIncome[month] || 0) + order.total_amount;
        });

        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const dynamicTotalIncomeData = months.map(month => ({
          month,
          value: monthlyIncome[month] || 0,
        }));

        setTotalIncomeData(dynamicTotalIncomeData);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const maxIncome = Math.max(...totalIncomeData.map(d => d.value));
  const scaleFactor = maxIncome > 0 ? 250 / maxIncome : 0; // To scale bars to a max height of 250px

  return (
    <div className="p-4">
      {/* Overview Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          <div className="flex items-center space-x-2 border rounded-md px-3 py-1 text-gray-700">
            <span className="text-gray-700">All Time</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-700">Customers</p>
              <p className="text-2xl font-bold">{loading ? "Loading..." : customers.toLocaleString()}</p>
            </div>
            <span className="text-green-500 font-semibold">{incomeGrowth}%</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-700">Income</p>
              <p className="text-2xl font-bold">{loading ? "Loading..." : `₹${income.toLocaleString()}`}</p>
            </div>
            <span className="text-green-500 font-semibold">{incomeGrowth}%</span>
          </div>
        </div>
      </div>

      {/* Total Income Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Total Income</h2>
          <div className="flex items-center space-x-2 border rounded-md px-3 py-1 text-gray-700">
            <span className="text-gray-700">All Time</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end h-72 space-x-2 mt-8">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between h-full pr-2 text-sm text-gray-500">
            <span>400K</span>
            <span>300K</span>
            <span>200K</span>
            <span>100K</span>
            <span>0K</span>
          </div>
          {/* Bars */}
          <div className="flex flex-1 h-full items-end justify-around border-l border-gray-200">
            {totalIncomeData.map((data) => (
              <div key={data.month} className="flex flex-col items-center h-full justify-end">
                <div
                  className="w-8 bg-blue-500 rounded-t-md"
                  style={{ height: `${data.value * scaleFactor}px` }}
                ></div>
                <span className="mt-2 text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Orders Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <AllOrders />
      </div>
    </div>
  );
}
