import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserPage = () => {
    const { email } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProducts, setUserProducts] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:3001/users/email/${email}`);
                if (!res.ok) throw new Error('User not found');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [email]);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const res = await fetch(`http://localhost:3001/product/${user.id}`);
                if (!res.ok) throw new Error('Failed to load user products');
                const data = await res.json();
                setUserProducts(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (user?.id) {
            fetchUserProducts();
        }
    }, [user]);

    if (loading) return <p className="p-8">Loading user data...</p>;
    if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

    return (
        <>
            <div id="user-page" className="bg-black text-white flex justify-between px-24 py-8">
                <h1>Welcome, {user.username}!</h1>
                <p>Email: {user.email}</p>
            </div>

            <div className="grid grid-cols-5 gap-6 px-24 py-10">
                {userProducts.length > 0 ? (
                    userProducts.map((product) => (
                        <div key={product.id} className="border flex flex-col h-full rounded-2xl">
                            <div className="h-[140px] w-full my-4">
                                <img
                                    src={product.image}
                                    alt="product"
                                    className="h-[140px] w-[240px] object-scale-down mx-auto"
                                />
                            </div>
                            <div className="flex flex-col mx-3">
                                <p className="font-bold truncate">{product.name}</p>
                                <p>rating: 5-stars</p>
                                <p className="text-blue-800 font-bold">
                                    price: {product.price}{' '}
                                    <span className="text-black/30 font-light">/each</span>
                                </p>
                                <div className="flex bg-blue-700 my-2">
                                    <span className="text-white flex gap-3 py-1 px-2">
                                        <span>-</span>
                                        <span>1</span>
                                        <span>+</span>
                                    </span>
                                </div>
                                <p className="text-[15px]">in stock: {product.quantity}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-5 text-center text-gray-500">
                        No products found for this user.
                    </p>
                )}
            </div>
        </>
    );
};

export default UserPage;
