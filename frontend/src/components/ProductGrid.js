import React from 'react';
import ProductCard from './ProductCard';
import './productGrid.css';
const ProductGrid = ({ products }) => (
  <div className="product-grid">
    {products.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))}
  </div>
);

export default ProductGrid;