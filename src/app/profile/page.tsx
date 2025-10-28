"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../components/supabase/SessionProvider';
import { User } from '@supabase/supabase-js';

const ProfilePage = () => {
  const { session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    } else {
      setUser(session.user);
      setLoading(false);
    }
  }, [session, router]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Email</h2>
        </div>
        <p className="text-gray-900">{user?.email}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Addresses</h2>
          <span className="text-yellow-500 cursor-pointer">+ Add</span>
        </div>
        <div className="text-gray-500">
          <p>No addresses added</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
