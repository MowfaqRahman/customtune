"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';

interface Profile {
  id: string;
  username: string | null;
  role: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching customers:", error);
        setError(error.message);
      } else {
        setCustomers(data || []);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="p-4">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Customers</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email (ID)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/customer-orders/${customer.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
