import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Nav = () => {
  const navLinkStyles = ({ isActive }) =>
    isActive
      ? 'w-full p-2 bg-gray-500 lg:text-white lg:underline lg:bg-transparent'
      : 'text-white text-[15px] p-2';

  return (
    <nav className="flex justify-between items-center mx-24 py-4">
      <div>
        <h1 className="text-[24px] font-bold text-white">
          <Link to="/">Racyy</Link>
        </h1>
      </div>
      <ul className="flex gap-6">
        <li>
          <NavLink to="/home" className={navLinkStyles}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={navLinkStyles}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={navLinkStyles}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={navLinkStyles}>
            Contact Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={navLinkStyles}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup" className={navLinkStyles}>
            Sign Up
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
