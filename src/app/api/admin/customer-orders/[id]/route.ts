import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = await request.json();

  // In a real application, you would update the order status in your database here.
  // For now, we'll just log the update.
  console.log(`Updating order ${id} status to: ${status}`);

  return NextResponse.json({ message: `Order ${id} status updated to ${status}` });
}
