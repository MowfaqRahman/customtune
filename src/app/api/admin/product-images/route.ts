import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { product_id, image_url } = await request.json();

  const { data, error } = await supabase.from("product_images").insert([
    { product_id, image_url }
  ]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
