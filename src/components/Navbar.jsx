import React from 'react';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="bg-[#131921] text-white p-4 sticky top-0 z-50 shadow-md font-sans">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-1 hover:border border-transparent hover:border-white p-1 rounded">
            <span className="text-2xl font-bold">wefpro<span className="text-red-500">.</span></span>
          </Link>
          
          {/* Location Mockup (Amazon Style) */}
          <div className="hidden md:block leading-tight text-xs hover:border border-transparent hover:border-white p-1 rounded cursor-pointer">
            <p className="text-gray-300">Deliver to</p>
            <p className="font-bold">India 🇮🇳</p>
          </div>
        </div>

        {/* Search Bar (Visual Only) */}
        <div className="hidden md:flex flex-1 mx-6 h-10 bg-white rounded overflow-hidden">
          <button className="bg-gray-100 px-3 text-gray-500 border-r text-xs">All</button>
          <input type="text" className="flex-1 px-3 text-black outline-none" placeholder="Search Wefpro..." />
          <button className="bg-red-500 text-white px-4 hover:bg-red-600">
            <Search size={20} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6">
          
          {/* Admin / Login Link */}
          <Link to="/admin" className="leading-tight text-xs hover:border border-transparent hover:border-white p-1 rounded">
            <p className="text-gray-300">Hello, Admin</p>
            <p className="font-bold">Account & Lists</p>
          </Link>

          {/* Orders / Tracking */}
          <Link to="/track" className="leading-tight text-xs hover:border border-transparent hover:border-white p-1 rounded">
            <p className="text-gray-300">Returns</p>
            <p className="font-bold">& Orders</p>
          </Link>

          {/* Cart with Badge */}
          <Link to="/cart" className="flex items-end space-x-1 hover:border border-transparent hover:border-white p-1 rounded relative">
            <div className="relative">
              <ShoppingCart size={28} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="font-bold hidden sm:block">Cart</span>
          </Link>
        </div>

      </div>
      
      {/* Mobile Search Bar (Visible only on phone) */}
      <div className="md:hidden mt-3 flex h-10 bg-white rounded overflow-hidden">
          <input type="text" className="flex-1 px-3 text-black outline-none" placeholder="Search Wefpro..." />
          <button className="bg-red-500 text-white px-4">
            <Search size={20} />
          </button>
      </div>
    </nav>
  );
};

export default Navbar;