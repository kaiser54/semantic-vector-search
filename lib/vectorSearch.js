// lib/vectorSearch.js
import '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

// Store the model globally so we don't reload it for each query
let encoder = null;

// Store the product embeddings once computed
let productEmbeddings = null;
let productIndexMap = null;

// Initialize the encoder and precompute product embeddings
export async function initializeVectorSearch(products) {
  if (!encoder) {
    console.log('Loading Universal Sentence Encoder model...');
    try {
      encoder = await use.load();
      console.log('Universal Sentence Encoder model loaded');
    } catch (error) {
      console.error('Error loading Universal Sentence Encoder:', error);
      return false;
    }
  }

  // Prepare text descriptions for each product
  const productTexts = products.map(product => 
    `${product.name}. ${product.description}. Category: ${product.category}. Tags: ${product.tags.join(', ')}`
  );
  
  try {
    // Generate embeddings for all products
    console.log('Generating embeddings for products...');
    productEmbeddings = await encoder.embed(productTexts);
    
    // Create a mapping from index to product ID for retrieval
    productIndexMap = products.map(product => product.id);
    
    console.log('Product embeddings generated');
    return true;
  } catch (error) {
    console.error('Error generating product embeddings:', error);
    return false;
  }
}

// Perform vector search
export async function vectorSearch(query, products, topK = 10) {
  if (!encoder || !productEmbeddings || !productIndexMap) {
    const initialized = await initializeVectorSearch(products);
    if (!initialized) {
      console.error('Vector search is not initialized');
      return [];
    }
  }
  
  try {
    // Generate embedding for the query
    const queryEmbedding = await encoder.embed(query);
    
    // Calculate cosine similarity between query and all products
    // Get tensor shape and convert to array for processing
    const queryVector = await queryEmbedding.array();
    const productVectors = await productEmbeddings.array();
    
    // Calculate similarities and create pairs of [index, similarity]
    const similarities = productVectors.map((productVector, index) => {
      // Compute cosine similarity
      const dotProduct = queryVector[0].reduce((sum, val, i) => sum + val * productVector[i], 0);
      const queryMagnitude = Math.sqrt(queryVector[0].reduce((sum, val) => sum + val * val, 0));
      const productMagnitude = Math.sqrt(productVector.reduce((sum, val) => sum + val * val, 0));
      
      const similarity = dotProduct / (queryMagnitude * productMagnitude);
      return [index, similarity];
    });
    
    // Sort by similarity (descending) and take top K
    const topIndices = similarities
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(pair => pair[0]);
    
    // Map indices back to product IDs
    const topProductIds = topIndices.map(index => productIndexMap[index]);
    
    // Return the actual product objects
    return products.filter(product => topProductIds.includes(product.id));
  } catch (error) {
    console.error('Error performing vector search:', error);
    return [];
  }
}