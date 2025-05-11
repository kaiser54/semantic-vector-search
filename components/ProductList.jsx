// components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isLoading, searchType }) => {
  if (isLoading) {
    return (
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded"></div>
            <div className="mt-2 h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-600">No products found</h3>
        <p className="mt-2 text-gray-500">
          Try a different search term or switch to {searchType === 'regular' ? 'semantic' : 'regular'} search.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;