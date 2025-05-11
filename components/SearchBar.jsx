// components/SearchBar.jsx
import React, { useState, useEffect } from 'react';

// Categories derived from the product data
const PRODUCT_CATEGORIES = [
  "All Categories",
  "Electronics/Headphones",
  "Electronics/Smart Home",
  "Home/Kitchen",
  "Sports/Outdoors",
  "Toys/LEGO",
  "Clothing/Shoes",
  "Electronics/E-Readers",
  "Electronics/Audio",
  "Home/Vacuums",
  "Electronics/Wearables",
  "Electronics/Phone Accessories",
  "Electronics/Accessories",
  "Clothing/Accessories",
  "Home/Outdoor",
  "Electronics/Cameras",
  "Electronics/Drones",
  "Electronics/VR",
  "Clothing/Outerwear"
];

const SearchBar = ({ onSearch, searchType, onToggleSearchType }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If a specific category is selected, add it to the search query for semantic search
    let searchQuery = query;
    
    if (category !== 'All Categories' && searchType === 'semantic') {
      searchQuery = `${query} in category ${category}`;
    }
    
    onSearch(searchQuery, category !== 'All Categories' ? category : null);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            {query && (
              <button 
                type="button"
                onClick={() => {
                  setQuery('');
                  onSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white md:w-1/3"
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition"
          >
            Search
          </button>
          
          <button
            type="button"
            onClick={onToggleSearchType}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span>{searchType === 'regular' ? 'Regular' : 'Semantic'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </button>
        </div>
      </form>
      
      <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
        <div>
          <span className="font-medium">Search Type:</span> {searchType === 'regular' ? 'Regular Keyword Search' : 'Semantic Vector Search'}
        </div>
        {searchType === 'semantic' && (
          <div className="text-indigo-600">
            ✨ Try natural language queries like "waterproof outdoor items" or "kitchen tools under $50"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;