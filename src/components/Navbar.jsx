import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50 py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-serif font-bold text-white tracking-tighter">
          WEFPRO
        </Link>

        {/* CUSTOMER LINKS ONLY (Hidden Admin) */}
        <div className="flex items-center gap-8">
            <Link to="/track" className="text-stone-400 hover:text-white transition flex items-center gap-2 text-sm uppercase tracking-widest hidden md:flex">
                <Truck size={16} /> Track Order
            </Link>
            
            <Link to="/cart" className="relative group">
                <ShoppingBag size={24} className="text-white group-hover:text-red-500 transition"/>
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                    </span>
                )}
            </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;