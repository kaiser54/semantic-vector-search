// lib/products.js
import productsData from '../public/products.json';

// Get all products
export function getAllProducts() {
  return productsData.products;
}

// Regular search function - searches product name, description, and tags
export function searchProducts(query) {
  if (!query) return getAllProducts();
  
  const searchTerm = query.toLowerCase();
  
  return productsData.products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
}

// Format product price from cents to dollars with proper formatting
export function formatPrice(priceInCents, currency = 'USD') {
  const price = priceInCents / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}