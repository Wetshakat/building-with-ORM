import React from 'react';
import ProductsContext from './ProductsCarts';

const ProductCard = () => {
  return (
    <div className="grid grid-cols-4 gap-6 my-6">
      <ProductsContext />
    </div>
  );
};

export default ProductCard;
