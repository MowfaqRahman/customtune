import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total_amount,
        status,
        created_at,
        user_id,
        profiles (
          username,
          email,
          role
        )
      `
      )
      .order('created_at', { ascending: false });

    console.log("Fetched orders:", orders);
    console.log("Supabase error:", error);

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
