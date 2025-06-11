import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !email || !password) {
            toast.error('Please fill in all fields!');
            return;
        }

        const formData = { name, email, password };

        try {
            const response = await fetch('http://localhost:3001/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Welcome ${data.name || name}! You signed up successfully.`);
                setName('');
                setEmail('');
                setPassword('');
                navigate(`/user/${email}`);
            } else {
                toast.error(data.message || 'Signup failed!');
            }
        } catch (error) {
            toast.error(`Network error: ${error.message}`);
        }
    };

    return (
        <>
            <div className="my-10">
                <h1 className="font-bold text-xl">Create an account</h1>
                <p>Please sign up to see your products!</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center mx-24 my-20">
                    <div className="grid gap-4">
                        <label htmlFor="username">Your Name</label>
                        <input
                            type="text"
                            id="username"
                            name="name"
                            placeholder="Enter your name"
                            className="border p-3 rounded-lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-4">
                        <label htmlFor="userEmail">Your Email</label>
                        <input
                            type="email"
                            id="userEmail"
                            name="email"
                            placeholder="Enter your email"
                            className="border p-3 rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-4">
                        <label htmlFor="userPassword">Password</label>
                        <input
                            type="password"
                            id="userPassword"
                            name="password"
                            placeholder="Enter your password"
                            className="border p-3 rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button type="submit" className="rounded-2xl bg-blue-500 text-white px-6 py-2 hover:bg-blue-600">
                            Sign Up
                        </button>
                    </div>
                </form>

                <ToastContainer />
            </div>
        </>
    );
};

export default Signup;
