import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json({ user: null, role: null, error: userError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ user: null, role: null }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ user: null, role: null, error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ user, role: profile?.role });
  } catch (error: unknown) {
    console.error("Unexpected error in GET /api/admin/auth:", error);
    return NextResponse.json({ user: null, role: null, error: (error instanceof Error) ? error.message : String(error) }, { status: 500 });
  }
}
