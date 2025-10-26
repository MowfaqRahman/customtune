import { ChevronDown } from "lucide-react";
import AllOrders from "@/components/admin/AllOrders";

export default function AdminPage() {
  // Dummy data for the dashboard
  const customers = 10243;
  const income = 39403450;
  const incomeGrowth = 8;

  const totalIncomeData = [
    { month: "Jan", value: 320000 },
    { month: "Feb", value: 140000 },
    { month: "Mar", value: 330000 },
    { month: "Apr", value: 250000 },
    { month: "May", value: 60000 },
    { month: "Jun", value: 180000 },
    { month: "Jul", value: 90000 },
    { month: "Aug", value: 210000 },
    { month: "Sep", value: 30000 },
    { month: "Oct", value: 290000 },
    { month: "Nov", value: 295000 },
    { month: "Dec", value: 20000 }
  ];

  const maxIncome = Math.max(...totalIncomeData.map(d => d.value));
  const scaleFactor = 250 / maxIncome; // To scale bars to a max height of 250px

  return (
    <div className="p-4">
      {/* Overview Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="flex items-center space-x-2 border rounded-md px-3 py-1 text-gray-700">
            <span>All Time</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-600">Customers</p>
              <p className="text-2xl font-bold">{customers.toLocaleString()}</p>
            </div>
            <span className="text-green-500 font-semibold">{incomeGrowth}%</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-600">Income</p>
              <p className="text-2xl font-bold">₹{income.toLocaleString()}</p>
            </div>
            <span className="text-green-500 font-semibold">{incomeGrowth}%</span>
          </div>
        </div>
      </div>

      {/* Total Income Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <div className="flex items-center space-x-2 border rounded-md px-3 py-1 text-gray-700">
            <span>All Time</span>
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
