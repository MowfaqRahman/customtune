import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
 
export function createClient() {
  const cookieStore = cookies()
 
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler
            // This error is typically not a problem if you're still rendering a server component that sets cookies
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler
            // This error is typically not a problem if you're still rendering a server component that sets cookies
          }
        },
      },
    }
  )
}
