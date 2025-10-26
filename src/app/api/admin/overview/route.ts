import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("total_amount, user_id");

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let totalIncome = 0;
    const uniqueCustomers = new Set();

    orders.forEach((order) => {
      totalIncome += order.total_amount;
      uniqueCustomers.add(order.user_id);
    });

    return NextResponse.json({
      customers: uniqueCustomers.size,
      income: totalIncome,
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
