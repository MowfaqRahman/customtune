import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { customer_name, customer_email, order_total, order_status, is_packed, items, shipping_address } = await request.json();

  const { data, error } = await supabase.from("orders").insert([
    { customer_name, customer_email, order_total, order_status, is_packed, items, shipping_address }
  ]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

export async function GET() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const { id, is_packed } = await request.json();

  const { data, error } = await supabase.from("orders").update({ is_packed }).eq("id", id).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
