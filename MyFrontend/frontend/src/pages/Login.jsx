import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome back ${data.name || 'User'}! You signed in successfully.`);
        setEmail('');
        setPassword('');
        navigate(`/user/${email}`); 
      } else {
        toast.error(data.message || 'Login failed!');
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  return (
    <>
      <div className="my-10">
        <h1 className="font-bold">Welcome back</h1>
        <p>Please login to see your products!</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center mx-24 my-20">
        <div className="grid gap-4">
          <label htmlFor="userEmail">Please enter your email</label>
          <input
            type="text"
            name="email"
            id="userEmail"
            placeholder="Enter your email"
            className="border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          <label htmlFor="userPassword">Enter your password</label>
          <input
            type="password"
            name="password"
            id="userPassword"
            placeholder="Enter your password"
            className="border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div id="submit">
          <button type="submit" className="rounded-2xl bg-blue-400 text-white px-6 py-2">
            Submit
          </button>
        </div>
      </form>

      <ToastContainer />
    </>
  );
};

export default Login;
