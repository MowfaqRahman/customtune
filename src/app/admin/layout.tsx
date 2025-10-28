"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavigation from "@/components/admin/AdminNavigation";
import { MenuIcon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const response = await fetch('/api/admin/auth');
      const { user, role, error } = await response.json();

      if (error) {
        console.error("Error fetching admin auth:", error);
        router.push('/login');
        return;
      }

      if (!user || role !== 'admin') {
        router.push('/login');
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading admin panel...</div>; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <AdminNavigation isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
