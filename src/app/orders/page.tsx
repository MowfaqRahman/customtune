
import React from 'react';

const OrdersPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500">No orders found.</p>
        {/* Future: Display list of orders here */}
      </div>
    </div>
  );
};

export default OrdersPage;
