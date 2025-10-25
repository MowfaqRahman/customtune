"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        console.error("Admin access denied:", error || "Not an admin");
        router.push('/'); // Redirect to home if not admin or error fetching profile
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
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-sm h-16 flex items-center px-4">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
