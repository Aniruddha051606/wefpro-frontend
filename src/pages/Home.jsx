import React from 'react';
import { ShoppingBag, Star, ArrowDown } from 'lucide-react';

const Home = ({ addToCart }) => {
  
  const products = [
    { id: 1, name: "Velvet Strawberry", price: 249, image: "https://images.unsplash.com/photo-1621251347628-8798cb3cb602?q=80&w=400", desc: "Harvested at dawn. Crushed by hand." },
    { id: 2, name: "Midnight Honey", price: 399, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=400", desc: "Wild foraged from the deep forest." },
    { id: 3, name: "Scarlet Blend", price: 199, image: "https://images.unsplash.com/photo-1600423115367-87ea79269cd3?q=80&w=400", desc: "A symphony of five rare berries." }
  ];

  return (
    <div className="bg-black text-white font-sans">
      
      {/* 1. CINEMATIC HERO SECTION (Full Screen) */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1599940824399-b87987ce179a?q=80&w=2000" 
                className="w-full h-full object-cover opacity-60" 
                alt="Luxury Jam Background"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
        </div>

        {/* Floating Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <p className="text-red-500 tracking-[0.3em] text-sm uppercase mb-4 animate-fade-in-up">The Collection</p>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight">
                Pure. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">Organic.</span>
            </h1>
            <p className="text-stone-300 max-w-lg text-lg mb-10 font-light leading-relaxed">
                Experience the taste of nature's finest ingredients, preserved in time for your absolute pleasure.
            </p>
            <button 
                onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition duration-500 flex items-center gap-2"
            >
                Explore Collection <ArrowDown size={18}/>
            </button>
        </div>
      </div>

      {/* 2. THE SHOWCASE (Minimalist Grid) */}
      <div id="shop" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-serif">Curated Selections</h2>
            <p className="text-stone-500 hidden md:block">Fall / Winter 2026</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Container with Zoom Effect */}
              <div className="h-[400px] overflow-hidden rounded-sm mb-6 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" 
                  />
                  {/* Quick Add Button appearing on hover */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition duration-500 shadow-xl"
                  >
                    <ShoppingBag size={20} />
                  </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-medium text-stone-100">{product.name}</h3>
                    <span className="text-lg text-stone-400 font-light">₹{product.price}</span>
                </div>
                <p className="text-sm text-stone-500 font-light">{product.desc}</p>
                <div className="flex text-yellow-600 gap-1 text-xs">
                    <Star size={12} fill="currentColor"/>
                    <Star size={12} fill="currentColor"/>
                    <Star size={12} fill="currentColor"/>
                    <Star size={12} fill="currentColor"/>
                    <Star size={12} fill="currentColor"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;