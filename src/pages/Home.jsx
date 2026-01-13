import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Droplets, Leaf, ArrowRight } from 'lucide-react';

// 1. IMPORT THE NEW COMPONENTS
import Footer from '../components/Footer';
import Process from '../components/Process';

// ASSETS
import heroVideo from '../assets/hero-video.mp4'; 
import heroImg from '../assets/jar-front.jpg'; 
import lifestyleImg from '../assets/jar-lifestyle.jpg';

const Home = ({ addToCart }) => {
  // ... (Keep your existing state and useEffect logic) ...
  const [scrollY, setScrollY] = useState(0);
  const [price, setPrice] = useState(249);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchGlobalPrice = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.price) setPrice(data.price);
      } catch (err) { console.error(err); }
    };
    fetchGlobalPrice();
  }, []);

  const product = { 
    id: 1, name: "WefPro Natural Strawberry Jam", price: price, 
    image: heroImg, desc: "74% Real Strawberries." 
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(e => console.log(e));
  }, []);

  const opacity = Math.max(1 - (scrollY / 800), 0); 
  const scale = 1 + (scrollY * 0.0005); 

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden selection:bg-red-500">
      
      {/* ... (Keep your Video and Hero Section) ... */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
         {/* ... video code ... */}
         <div className="absolute inset-0 z-10 mix-blend-screen">
             <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" style={{ transform: `scale(${scale})` }}>
                <source src={heroVideo} type="video/mp4" />
             </video>
         </div>
         <div className="absolute inset-0 bg-black/50 z-20" style={{ opacity: opacity }}></div>
         <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-4" style={{ opacity: opacity, transform: `translateY(${scrollY * -0.5}px)` }}>
            <p className="text-red-500 tracking-[0.5em] text-xs md:text-sm uppercase mb-6">Handcrafted in Mahabaleshwar</p>
            <h1 className="text-6xl md:text-9xl font-serif font-black text-white tracking-tighter drop-shadow-2xl">WEFPRO</h1>
         </div>
      </div>

      <div className="h-screen w-full"></div>

      <div className="relative z-40 bg-stone-950 min-h-screen rounded-t-[3rem] border-t border-stone-800 -mt-20 shadow-[0_-20px_60px_rgba(0,0,0,1)]">
         {/* Product Details Section */}
         <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* ... (Keep floating jar and text details) ... */}
              <div className="relative group">
                  <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full"></div>
                  <img src={heroImg} alt="Jar" className="relative w-full md:w-3/4 mx-auto object-contain drop-shadow-2xl transform group-hover:-translate-y-4 transition duration-500" />
              </div>
              <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-serif">The Taste of <br/><span className="text-red-600">Pure Fruit.</span></h2>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                          <Droplets className="text-red-500 mb-3" size={32}/><h3 className="font-bold text-xl">74% Fruit</h3>
                      </div>
                      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                          <Leaf className="text-green-500 mb-3" size={32}/><h3 className="font-bold text-xl">Natural</h3>
                      </div>
                  </div>
                  <div className="flex items-center gap-6 pt-4">
                      <span className="text-4xl font-light">₹{product.price}</span>
                      <button onClick={() => addToCart(product)} className="flex-1 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-red-600 hover:text-white transition duration-300 flex justify-center items-center gap-2">
                        Add to Cart <ShoppingBag size={20} />
                      </button>
                  </div>
              </div>
         </div>

         {/* 2. ADD THE COMPARISON SECTION */}
         <section className="bg-black py-24 px-6 border-y border-stone-900">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-serif text-center mb-12">How We Compare</h3>
              <div className="grid grid-cols-2 gap-0 border border-stone-800 rounded-3xl overflow-hidden">
                <div className="p-8 bg-stone-900/30 border-r border-stone-800">
                  <h4 className="text-red-600 font-bold mb-6">Wefpro Jams</h4>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-2">✅ 74% Real Whole Fruit</li>
                    <li className="flex gap-2">✅ Traditional Handcrafted</li>
                    <li className="flex gap-2">✅ Zero Artificial Colors</li>
                    <li className="flex gap-2">✅ Small Batch Production</li>
                  </ul>
                </div>
                <div className="p-8 bg-stone-950 opacity-60">
                  <h4 className="text-stone-500 font-bold mb-6">Ordinary Jams</h4>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-2">❌ 35-45% Fruit Pulp</li>
                    <li className="flex gap-2">❌ Mass Machine Processed</li>
                    <li className="flex gap-2">❌ Synthetic Flavors & Colors</li>
                    <li className="flex gap-2">❌ Heavy Preservatives</li>
                  </ul>
                </div>
              </div>
            </div>
         </section>

         {/* 3. ADD THE PROCESS SECTION */}
         <Process />

         {/* Lifestyle Image Section */}
         <div className="h-[60vh] relative overflow-hidden">
             <img src={lifestyleImg} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Lifestyle" />
             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center pb-20">
                <a href="https://www.amazon.in/WefPro-Natural-Strawberry-Traditional-Handmade/dp/B0G1GNXVY9" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">
                    Order on Amazon <ArrowRight size={18}/>
                </a>
             </div>
         </div>

         {/* 4. ADD THE FOOTER */}
         <Footer />

      </div>
    </div>
  );
};

export default Home;