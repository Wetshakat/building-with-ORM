import React, { useEffect, useState } from 'react';

const ProductCards = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            {Array.isArray(products) && products.map((product) => (
                <div key={product._id || product.id} className="border flex flex-col h-full rounded-2xl p-4">
                    <div className="h-[140px] w-full mb-4 flex justify-center items-center">
                        <img
                            src={product.image}
                            alt={product.name || 'Product image'}
                            className="h-[140px] w-[240px] object-scale-down"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-bold truncate">{product.name}</p>
                        <p>Rating: 5 stars</p>
                        <p className="text-blue-800 font-bold">
                            Price: {product.price} <span className="text-black/30 font-light">/each</span>
                        </p>
                        <div className="flex bg-blue-700 rounded my-2 w-fit">
                            <div className="text-white flex gap-3 py-1 px-3">
                                <span>-</span>
                                <span>1</span>
                                <span>+</span>
                            </div>
                        </div>
                        <p className="text-[15px]">In stock: {product.quantity}</p>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProductCards;
