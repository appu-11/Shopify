import React, { useState } from 'react';
import axios from 'axios';
import ProductGrid from './components/ProductGrid';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [domain, setDomain] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/scrape', { domain });
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Shopify Product Scraper</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter Shopify domain"
          required
        />
        <button className="submit-button" type="submit">Scrape</button>
      </form>
      {loading && <LoadingSpinner />}
      <ProductGrid products={products} />
    </div>
  );
}

export default App;