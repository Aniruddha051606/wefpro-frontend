import React, { useState } from 'react';
import { ShoppingBag, Star, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [qty, setQty] = useState(1);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      
      {/* 1. NAVBAR */}
      <nav className="p-5 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-600 tracking-tighter">WEFPRO.</h1>
        <Link to="/cart" className="relative p-2 bg-stone-100 rounded-full hover:bg-stone-200">
          <ShoppingBag size={24} />
          {/* Badge showing 1 item for demo */}
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</span>
        </Link>
      </nav>

      {/* 2. MAIN PRODUCT SECTION */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        
        {/* LEFT: Product Image */}
        <div className="relative">
            <div className="bg-red-100 rounded-3xl h-96 md:h-[500px] flex items-center justify-center shadow-inner overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1600423115367-87ea79269cd3?q=80&w=1000&auto=format&fit=crop" 
                    alt="Wefpro Strawberry Jam" 
                    className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
                />
            </div>
        </div>

        {/* RIGHT: Product Details */}
        <div className="flex flex-col justify-center space-y-6">
          
          {/* Title & Rating */}
          <div>
            <div className="flex items-center space-x-1 text-yellow-500 mb-2">
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <Star fill="currentColor" size={18} />
              <span className="text-stone-400 text-sm ml-2">(124 Reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight">
              Premium Organic <span className="text-red-600">Strawberry Jam</span>
            </h1>
            <p className="text-xl text-stone-500 mt-2 font-medium">From Mahabaleshwar Farms</p>
          </div>

          {/* Price */}
          <div className="flex items-end space-x-3 border-b pb-6 border-stone-200">
            <span className="text-4xl font-bold text-stone-900">₹249</span>
            <span className="text-lg text-stone-400 line-through">₹399</span>
            <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-sm">38% OFF</span>
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed">
            Experience the taste of real fruit. Wefpro jam is made with 100% organic strawberries, zero preservatives, and traditional slow-cooking methods to preserve the natural sweetness. Perfect for your morning toast.
          </p>

          {/* Quantity & Cart Actions */}
          <div className="flex space-x-4 pt-4">
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty-1))} className="px-4 py-3 hover:bg-stone-100">-</button>
              <span className="px-4 font-bold">{qty}</span>
              <button onClick={() => setQty(qty+1)} className="px-4 py-3 hover:bg-stone-100">+</button>
            </div>
            
            {/* The Link to Cart Page */}
            <Link to="/cart" className="flex-1">
                <button className="w-full h-full bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-lg hover:shadow-red-500/30">
                Add to Cart - ₹{249 * qty}
                </button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm border border-stone-100">
              <Truck className="text-red-500" />
              <span className="text-sm font-semibold text-stone-700">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm border border-stone-100">
              <ShieldCheck className="text-red-500" />
              <span className="text-sm font-semibold text-stone-700">Organic Certified</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;