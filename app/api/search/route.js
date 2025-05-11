// app/api/search/route.js
import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || null;
    
    let results = searchProducts(query);
    
    // If a category is specified, filter results by that category
    if (category) {
      results = results.filter(product => product.category === category);
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      count: results.length,
      query,
      category,
      search_method: 'regular'
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}