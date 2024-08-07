import React from 'react';
import './productCard.css';
const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.image} alt={product.imageTitle} />
    <h3>{product.imageTitle}</h3>
    <ul>
      {product.summary.map((point, i) => (
        <li key={i}>{point}</li>
      ))}
    </ul>
  </div>
);

export default ProductCard;