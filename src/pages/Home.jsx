import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Droplets, Leaf, ArrowRight } from 'lucide-react';

// ASSETS
import heroVideo from '../assets/hero-video.mp4'; 
import heroImg from '../assets/jar-front.jpg'; 
import lifestyleImg from '../assets/jar-lifestyle.jpg';

const Home = ({ addToCart }) => {
  const [scrollY, setScrollY] = useState(0);
  const [price, setPrice] = useState(249); // Single state for price
  const videoRef = useRef(null);

  // ⚡ FETCH REAL PRICE FROM CLOUD
  useEffect(() => {
    const fetchGlobalPrice = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();
        if (data.price) setPrice(data.price);
      } catch (err) {
        console.error("Error fetching price:", err);
      }
    };
    fetchGlobalPrice();
  }, []);

  // PRODUCT DATA (Now inside component to react to price changes)
  const product = { 
    id: 1, 
    name: "WefPro Natural Strawberry Jam", 
    price: price, 
    image: heroImg, 
    desc: "74% Real Strawberries." 
  };

  // TRACK SCROLL
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FORCE VIDEO PLAY
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay issue:", e));
    }
  }, []);

  const opacity = Math.max(1 - (scrollY / 800), 0); 
  const scale = 1 + (scrollY * 0.0005); 

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden selection:bg-red-500">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
         <div className="absolute inset-0 z-10 mix-blend-screen">
             <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-80"
                style={{ transform: `scale(${scale})` }}
             >
                <source src={heroVideo} type="video/mp4" />
             </video>
         </div>
         <div className="absolute inset-0 bg-black/50 z-20" style={{ opacity: opacity }}></div>
         <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-4"
              style={{ opacity: opacity, transform: `translateY(${scrollY * -0.5}px)` }}
         >
            <p className="text-red-500 tracking-[0.5em] text-xs md:text-sm uppercase mb-6">Handcrafted in Mahabaleshwar</p>
            <h1 className="text-6xl md:text-9xl font-serif font-black text-white tracking-tighter drop-shadow-2xl">WEFPRO</h1>
         </div>
      </div>

      <div className="h-screen w-full"></div>

      <div className="relative z-40 bg-stone-950 min-h-screen rounded-t-[3rem] border-t border-stone-800 -mt-20 shadow-[0_-20px_60px_rgba(0,0,0,1)]">
         <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative group">
                  <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full"></div>
                  <img src={heroImg} alt="Jar" className="relative w-full md:w-3/4 mx-auto object-contain drop-shadow-2xl transform group-hover:-translate-y-4 transition duration-500" />
              </div>

              <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-serif">The Taste of <br/><span className="text-red-600">Pure Fruit.</span></h2>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                          <Droplets className="text-red-500 mb-3" size={32}/>
                          <h3 className="font-bold text-xl">74% Fruit</h3>
                      </div>
                      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                          <Leaf className="text-green-500 mb-3" size={32}/>
                          <h3 className="font-bold text-xl">Natural</h3>
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

          <div className="h-[60vh] relative overflow-hidden">
             <img src={lifestyleImg} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Lifestyle" />
             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center pb-20">
                <a href="https://www.amazon.in/WefPro-Natural-Strawberry-Traditional-Handmade/dp/B0G1GNXVY9" target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">
                    Order on Amazon <ArrowRight size={18}/>
                </a>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Home;