import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, description, price } = await request.json();

  const { data, error } = await supabase.from("products").update({ name, description, price }).eq("id", id).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
