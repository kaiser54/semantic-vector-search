# Product Search App with Next.js and Vector Search

This is a product search application built with Next.js that implements both regular keyword search and semantic search powered by TensorFlow.js with the Universal Sentence Encoder model.

## Features

- Regular search that matches keywords in product names, descriptions, categories, and tags
- Semantic search using vector embeddings (TensorFlow.js) for natural language understanding
- Toggle between regular and semantic search modes
- Category filtering for more specific results
- Responsive product card grid with detailed product information
- Clean, modern UI built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or later

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/product-search-app.git
cd product-search-app
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How It Works

### Regular Search

The regular search feature performs a simple keyword-based search across product names, descriptions, categories, and tags. This is handled on the server-side with the `/api/search` API route.

### Semantic Vector Search

The semantic search feature uses TensorFlow.js with the Universal Sentence Encoder model to convert both the search query and product descriptions into vector embeddings. It then finds products whose embeddings are most similar to the query embedding using cosine similarity.

This allows for natural language understanding without depending on external APIs like Google Gemini, which would incur usage costs.

For example, a search for "something to keep my coffee hot" might return insulated tumblers and coffee machines, even if they don't explicitly mention those keywords.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [TensorFlow.js](https://www.tensorflow.org/js) - JavaScript library for machine learning
- [Universal Sentence Encoder](https://tfhub.dev/google/universal-sentence-encoder/4) - Pre-trained model for text embeddings
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Customization

### Adding More Products

To add more products to the application, update the `public/products.json` file with your product data. The app will automatically use the updated product list.

### Improving Vector Search

You can improve the vector search by:

1. Using a more domain-specific embedding model
2. Fine-tuning parameters like vector dimensionality and similarity thresholds
3. Implementing more sophisticated search algorithms like approximate nearest neighbors

## Performance Considerations

The first semantic search will take longer as it needs to load the TensorFlow.js model and generate embeddings for all products. Subsequent searches will be faster as the model and embeddings are cached in memory.

For large product catalogs, consider implementing server-side vector search with optimized libraries like FAISS or Annoy for better performance.# semantic-vector-search
