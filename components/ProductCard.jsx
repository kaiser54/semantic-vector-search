// components/ProductCard.jsx
import React from 'react';
import { formatPrice } from '@/lib/products';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{product.name}</h2>
        
        <div className="mt-1 mb-2 text-sm text-gray-700 line-clamp-2" title={product.description}>
          {product.description}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-indigo-700">
            {formatPrice(product.price, product.currency)}
          </span>
          
          <span className={`px-2 py-1 text-xs rounded-full ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.in_stock ? `In Stock (${product.quantity_available})` : 'Out of Stock'}
          </span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {product.tags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;