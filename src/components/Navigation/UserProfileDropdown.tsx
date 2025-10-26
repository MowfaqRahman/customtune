import React, { useState, useEffect } from 'react';
import { UserIcon, ChevronDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user }, error: userSessionError } = await supabase.auth.getUser();
      if (userSessionError) {
        console.error("Error getting user session:", userSessionError);
      }

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id);
        
        if (profileError) {
          console.error("Error fetching profile (getProfile): ", profileError);
        } else if (profileData && profileData.length > 0) {
          setUserRole(profileData[0].role);
        } else {
          console.log("No profile found for user (getProfile):", user.id);
        }
        setUser(user);
      }
      setLoading(false);
    };
    getProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const fetchRole = async () => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id);

          if (profileError) {
            console.error("Error fetching profile on auth change (fetchRole): ", profileError);
            console.log("Full error object on auth change:", JSON.stringify(profileError, null, 2));
            console.trace("Stack trace for profile fetch error on auth change"); // Add this line
          } else if (profileData && profileData.length > 0) {
            setUserRole(profileData[0].role);
          } else {
            console.log("No profile found for user on auth change (fetchRole):", session.user.id);
          }
        };
        fetchRole();
      } else {
        setUserRole(null);
      }
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setIsOpen(false);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-1 cursor-pointer"
      >
        <UserIcon className="w-6 h-6" />
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && user && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
            <UserIcon className="w-5 h-5" />
            <span>{user.email}</span>
            {userRole && <span className="text-gray-500 text-xs">({userRole})</span>}
          </div>
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
            Orders
          </Link>
          {userRole === 'admin' && (
            <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
