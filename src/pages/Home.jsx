import React from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle, Leaf, Droplets } from 'lucide-react';

const Home = ({ addToCart }) => {
  
  // 🍓 THE SINGLE HERO PRODUCT
  const product = { 
    id: 1, 
    name: "WefPro Natural Strawberry Jam", 
    price: 249, // Update this if Amazon price changes
    image: "https://images.unsplash.com/photo-1600423115367-87ea79269cd3?q=80&w=800", // High-Res Jam Image
    desc: "Traditional Handmade, 100% Natural, No Preservatives." 
  };

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (Split Screen) */}
      <div className="min-h-screen flex flex-col md:flex-row">
        
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-12 z-10 bg-black/80 backdrop-blur-sm md:bg-transparent">
          <div className="animate-fade-in-up">
            <span className="text-red-500 tracking-[0.4em] uppercase text-xs font-bold mb-4 block">Limited Batch</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Pure. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-900">Handmade.</span>
            </h1>
            <p className="text-stone-400 text-lg mb-8 leading-relaxed max-w-md">
              Experience the authentic taste of Mahabaleshwar strawberries. 
              Zero preservatives. 100% fruit content. Made the traditional way.
            </p>
            
            <div className="flex items-center gap-6">
              <span className="text-3xl font-light text-white">₹{product.price}</span>
              <button 
                onClick={() => addToCart(product)}
                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-red-600 hover:text-white transition duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-red-900/50"
              >
                Add to Cart <ShoppingBag size={20} />
              </button>
            </div>

            <div className="mt-12 flex gap-2 text-yellow-500">
               {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
               <span className="text-stone-500 text-sm ml-2">(4.8/5 Rated on Amazon)</span>
            </div>
          </div>
        </div>

        {/* Right: The Product Image (Full Height) */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 md:hidden"></div>
            <img 
                src={product.image} 
                alt="WefPro Jam Jar" 
                className="w-full h-full object-cover object-center"
            />
        </div>
      </div>

      {/* 2. "WHY WEFPRO?" SECTION (Details) */}
      <div className="max-w-6xl mx-auto px-6 py-24 border-t border-stone-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              
              <div className="p-8 rounded-2xl bg-stone-900/30 border border-stone-800 hover:border-red-900 transition duration-500">
                  <Leaf className="mx-auto text-green-500 mb-4" size={40} />
                  <h3 className="text-xl font-serif mb-2">100% Natural</h3>
                  <p className="text-stone-500 text-sm">No artificial colors or preservatives. Just pure fruit and sugar.</p>
              </div>

              <div className="p-8 rounded-2xl bg-stone-900/30 border border-stone-800 hover:border-red-900 transition duration-500">
                  <Droplets className="mx-auto text-red-500 mb-4" size={40} />
                  <h3 className="text-xl font-serif mb-2">High Fruit Content</h3>
                  <p className="text-stone-500 text-sm">Made with premium Mahabaleshwar strawberries picked at peak ripeness.</p>
              </div>

              <div className="p-8 rounded-2xl bg-stone-900/30 border border-stone-800 hover:border-red-900 transition duration-500">
                  <CheckCircle className="mx-auto text-blue-500 mb-4" size={40} />
                  <h3 className="text-xl font-serif mb-2">Traditional Recipe</h3>
                  <p className="text-stone-500 text-sm">Slow-cooked in small batches to retain the authentic texture and aroma.</p>
              </div>

          </div>
      </div>

      {/* 3. AMAZON TRUST BADGE */}
      <div className="bg-stone-900 py-12 text-center">
        <p className="text-stone-400 mb-4 text-sm tracking-widest uppercase">Also available on</p>
        <a 
            href="https://www.amazon.in/WefPro-Natural-Strawberry-Traditional-Handmade/dp/B0G1GNXVY9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white border border-stone-600 px-6 py-3 rounded hover:bg-white hover:text-black transition"
        >
            View on Amazon.in <ArrowRight size={16}/>
        </a>
      </div>

    </div>
  );
};

export default Home;