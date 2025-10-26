import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = await req.json();

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: status })
      .eq("id", id);

    if (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Order status updated successfully", data });
  } catch (error: unknown) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: (error instanceof Error) ? error.message : String(error) },
      { status: 500 }
    );
  }
}
