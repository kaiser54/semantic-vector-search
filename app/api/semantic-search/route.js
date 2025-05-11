// app/api/semantic-search/route.js
import { NextResponse } from 'next/server';
import { getAllProducts, searchProducts } from '@/lib/products';
import { initializeVectorSearch, vectorSearch } from '@/lib/vectorSearch';

let vectorSearchInitialized = false;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || null;

    console.log('Incoming search request:', { query, category });

    if (!query && !category) {
      const products = getAllProducts();
      console.log('No query or category specified. Returning all products.');
      return NextResponse.json({ 
        success: true, 
        results: products,
        count: products.length,
        query: '',
        category: null,
        search_method: 'none' 
      });
    }

    if (!query && category) {
      const allProducts = getAllProducts();
      const categoryResults = allProducts.filter(product => product.category === category);
      console.log(`Category "${category}" filter only. Found ${categoryResults.length} results.`);
      return NextResponse.json({ 
        success: true, 
        results: categoryResults,
        count: categoryResults.length,
        query: '',
        category,
        search_method: 'category filter'
      });
    }

    const allProducts = getAllProducts();

    try {
      if (!vectorSearchInitialized) {
        console.log('Initializing vector search...');
        vectorSearchInitialized = await initializeVectorSearch(allProducts);
        console.log('Vector search initialized:', vectorSearchInitialized);
      }

      const augmentedQuery = category 
        ? `${query} in category ${category}` 
        : query;

      console.log('Performing vector search with query:', augmentedQuery);

      let results = await vectorSearch(augmentedQuery, allProducts, 20);
      console.log(`Vector search returned ${results.length} results.`);

      if (category) {
        results = results.filter(product => product.category === category);
        console.log(`Filtered vector results by category "${category}". Remaining: ${results.length}`);
      }

      return NextResponse.json({ 
        success: true, 
        results,
        count: results.length,
        query,
        category,
        search_method: 'vector embedding search'
      });
    } catch (vectorError) {
      console.error('Vector search failed, falling back to regular search:', vectorError);

      const fallbackResults = searchProducts(query);
      const filteredFallbackResults = category 
        ? fallbackResults.filter(product => product.category === category)
        : fallbackResults;

      console.log(`Fallback search returned ${filteredFallbackResults.length} results.`);

      return NextResponse.json({ 
        success: true, 
        results: filteredFallbackResults,
        count: filteredFallbackResults.length,
        query,
        category,
        search_method: 'regular (fallback)',
        fallback_reason: 'Vector search unavailable'
      });
    }
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
