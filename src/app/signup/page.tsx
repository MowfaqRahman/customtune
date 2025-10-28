"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../components/supabase/SessionProvider';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      // If a session exists, check the user's role and redirect
      const checkRoleAndRedirect = async () => {
        // Create a profile for the new user if it doesn't exist
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert([
            { id: session.user.id, username: session.user.email, role: 'user' } // Default role to 'user'
          ]);

        if (profileInsertError) {
          console.error("Error creating profile for new user:", profileInsertError);
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id);
        
        if (profileError) {
          console.error("Error fetching profile after signup (useEffect):", profileError);
          router.push('/');
        } else if (profileData && profileData.length > 0) {
          if (profileData[0]?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        } else {
          console.log("No profile found for user after signup (useEffect):", session.user.id);
          router.push('/');
        }
      };
      checkRoleAndRedirect();
    }
  }, [session, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // After successful signup, the onAuthStateChange listener in SessionProvider will update the session,
      // and the useEffect above will handle the redirection.
      // No direct getUser() call needed here.
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Create an account</h3>
        <form onSubmit={handleSignup}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Sign Up
              </button>
              <a href="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Login</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
