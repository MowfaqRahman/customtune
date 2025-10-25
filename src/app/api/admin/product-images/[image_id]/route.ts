import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { image_id: string } }) {
  const { image_id } = params;

  // First, get the image URL to delete from storage
  const { data: imageData, error: fetchError } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("id", image_id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!imageData) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const imageUrl = imageData.image_url;
  const fileName = imageUrl.split('/').pop(); // Extract filename from URL

  // Delete from Supabase Storage
  if (fileName) {
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove([fileName]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      // Decide whether to return an error or proceed with DB deletion if storage deletion fails
      // For now, we'll log and proceed to delete the DB record.
    }
  }

  // Delete from product_images table
  const { error: dbError } = await supabase.from("product_images").delete().eq("id", image_id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
