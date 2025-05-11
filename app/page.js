// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ProductList from '@/components/ProductList';
import ModelLoadingIndicator from '@/components/ModelLoadingIndicator';
import { getAllProducts } from '@/lib/products';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [searchType, setSearchType] = useState('regular'); // 'regular' or 'semantic'
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [error, setError] = useState(null);
  const [searchMethod, setSearchMethod] = useState(null);
  const [fallbackReason, setFallbackReason] = useState(null);

  // Load initial products on component mount
  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const handleSearch = async (query, category = null) => {
    setIsLoading(true);
    setCurrentQuery(query);
    setCurrentCategory(category);
    setError(null);
    setSearchMethod(null);
    setFallbackReason(null);

    try {
      // Show model loading indicator on first semantic search
      if (searchType === 'semantic' && !searchMethod) {
        setIsModelLoading(true);
      }

      // Determine which API to use based on search type
      const endpoint = searchType === 'regular' 
        ? `/api/search?query=${encodeURIComponent(query)}${category ? `&category=${encodeURIComponent(category)}` : ''}` 
        : `/api/semantic-search?query=${encodeURIComponent(query)}${category ? `&category=${encodeURIComponent(category)}` : ''}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      let filteredResults = data.results;
      
      // If a category was selected and we're doing regular search, filter the results
      // (For semantic search, we included the category in the query)
      if (category && searchType === 'regular' && !data.category) {
        filteredResults = filteredResults.filter(product => product.category === category);
      }
      
      setProducts(filteredResults);
      
      // Set any search method and fallback information from the API
      if (data.search_method) {
        setSearchMethod(data.search_method);
      }
      
      if (data.fallback_reason) {
        setFallbackReason(data.fallback_reason);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
      setIsModelLoading(false);
    }
  };

  const toggleSearchType = () => {
    const newSearchType = searchType === 'regular' ? 'semantic' : 'regular';
    setSearchType(newSearchType);
    
    // Re-run the search with the new search type if there's a query
    if (currentQuery) {
      handleSearch(currentQuery);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <ModelLoadingIndicator isLoading={isModelLoading} />
      
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Product Search</h1>
        <p className="text-gray-600">Find products with regular or semantic vector search</p>
      </header>

      <SearchBar 
        onSearch={handleSearch} 
        searchType={searchType} 
        onToggleSearchType={toggleSearchType} 
      />
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mt-4">
        {(currentQuery || currentCategory) && !isLoading && (
          <div className="text-gray-600">
            <div>
              Found {products.length} {products.length === 1 ? 'product' : 'products'} 
              {currentQuery ? ` for "${currentQuery}"` : ''}
              {currentCategory ? ` in category "${currentCategory}"` : ''}
            </div>
            
            {searchMethod && (
              <div className="text-sm mt-1">
                <span className="text-indigo-600 font-medium">Search method:</span> {searchMethod}
              </div>
            )}
            
            {fallbackReason && (
              <div className="text-sm mt-1 text-amber-600">
                Note: {fallbackReason}
              </div>
            )}
          </div>
        )}
      </div>

      <ProductList 
        products={products} 
        isLoading={isLoading}
        searchType={searchType}
      />
    </main>
  );
}