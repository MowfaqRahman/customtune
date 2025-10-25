import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type'); // Get the type parameter

  if (id) {
    // Fetch a single product by ID with its images
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } else {
    // Fetch all products with their images
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (
          image_url
        )
      `);

    if (type === 'new-arrivals') {
      query = query.order('created_at', { ascending: false }).limit(20);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(products);
  }
}
