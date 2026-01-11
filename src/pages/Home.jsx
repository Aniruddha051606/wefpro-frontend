import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Star, ArrowRight, Droplets, Leaf } from 'lucide-react';

// YOUR ASSETS
import heroImg from '../assets/jar-front.jpg'; 
import lifestyleImg from '../assets/jar-lifestyle.jpg';

const Home = ({ addToCart }) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  // 🍓 PRODUCT DATA
  const product = { 
    id: 1, 
    name: "WefPro Natural Strawberry Jam", 
    price: 249, 
    image: heroImg, 
    desc: "74% Real Strawberries." 
  };

  // 🖱️ TRACK SCROLL
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧮 CALCULATE ANIMATIONS BASED ON SCROLL
  // These values change from 0 to 1 as you scroll down
  const progress = Math.min(scrollY / 1000, 2); // Cap at 2
  
  // 1. Jar Animation (Zooms in then slides left)
  const jarScale = 1 + (progress * 0.2); // Grows slightly
  const jarOpacity = Math.max(1 - (scrollY / 1500), 0); // Fades out eventually
  
  // 2. Floating Elements (Parallax)
  const floatUp = scrollY * -0.2; 
  const floatDown = scrollY * 0.1;

  return (
    <div ref={containerRef} className="bg-black text-white font-sans overflow-x-hidden selection:bg-red-500">
      
      {/* 🟢 STICKY STAGE (The Jar stays fixed while you scroll) */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0">
         {/* THE GLOW BEHIND JAR */}
         <div className="absolute w-[600px] h-[600px] bg-red-900/20 blur-[100px] rounded-full transition-all duration-700"
              style={{ opacity: 1 - progress }} 
         ></div>

         {/* 🍓 THE HERO JAR (Animated) */}
         <img 
            src={heroImg} 
            alt="WefPro Jar" 
            className="w-[60vw] md:w-[25vw] object-contain drop-shadow-2xl transition-transform duration-100 ease-out"
            style={{ 
                transform: `scale(${jarScale}) translateY(${scrollY * 0.05}px)`,
                opacity: scrollY > 1200 ? 0 : 1 // Disappears at the very end
            }}
         />
      </div>

      {/* ================= SCROLL SECTIONS ================= */}
      
      {/* SECTION 1: INTRO (Content sits ON TOP of sticky jar) */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center pt-20 pointer-events-none">
          <div className="animate-fade-in-up mix-blend-difference text-white">
            <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tighter mb-4"
                style={{ transform: `translateY(${floatUp}px)`, opacity: 1 - progress }}
            >
              WEFPRO
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-[0.5em] uppercase text-red-500"
               style={{ transform: `translateY(${floatUp * 1.2}px)`, opacity: 1 - progress }}
            >
              The Real Taste
            </p>
          </div>
          
          {/* "Scroll Down" Indicator */}
          <div className="absolute bottom-10 animate-bounce text-stone-500 text-xs uppercase tracking-widest">
            Scroll to Explore
          </div>
      </div>

      {/* SECTION 2: DECONSTRUCTION (Ingredients "Float" in) */}
      <div className="relative z-10 min-h-screen flex items-center justify-between px-6 md:px-20 pointer-events-none">
          
          {/* Left Floating Text */}
          <div className="w-1/2 md:w-1/3 space-y-32 transition-all duration-500"
               style={{ 
                 opacity: progress > 0.3 ? 1 : 0, 
                 transform: `translateX(${progress > 0.3 ? 0 : -50}px)`
               }}
          >
              <div className="text-right">
                  <div className="text-red-500 mb-2"><Droplets size={40} className="ml-auto"/></div>
                  <h3 className="text-4xl font-serif font-bold">74% Fruit</h3>
                  <p className="text-stone-400 text-sm">Real Strawberries, not pulp.</p>
              </div>
          </div>

          {/* Right Floating Text */}
          <div className="w-1/2 md:w-1/3 space-y-32 transition-all duration-500"
               style={{ 
                 opacity: progress > 0.3 ? 1 : 0, 
                 transform: `translateX(${progress > 0.3 ? 0 : 50}px)`
               }}
          >
              <div className="text-left">
                  <div className="text-green-500 mb-2"><Leaf size={40}/></div>
                  <h3 className="text-4xl font-serif font-bold">100% Natural</h3>
                  <p className="text-stone-400 text-sm">Farm fresh, zero chemicals.</p>
              </div>
          </div>
      </div>

      {/* SECTION 3: LIFESTYLE & BUY (Solid Background covers the sticky jar) */}
      <div className="relative z-20 bg-stone-950 min-h-screen border-t border-stone-800 flex items-center">
          <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              
              {/* Image Reveal */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 group">
                  <img 
                    src={lifestyleImg} 
                    alt="Breakfast" 
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition duration-[2000ms]" 
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition duration-500"></div>
              </div>

              {/* The "Buy" Panel */}
              <div className="space-y-8">
                  <h2 className="text-5xl md:text-7xl font-serif font-bold leading-none">
                    Morning <br/><span className="text-red-600">Essence.</span>
                  </h2>
                  <p className="text-stone-400 text-lg leading-relaxed border-l-2 border-red-900 pl-6">
                    Handmade in small batches in Mahabaleshwar. 
                    The perfect texture for your toast, pancakes, or spoon.
                  </p>
                  
                  <div className="flex items-center gap-6 pt-8">
                      <div>
                        <p className="text-stone-500 text-xs uppercase tracking-widest">Price</p>
                        <p className="text-4xl font-bold text-white">₹{product.price}</p>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-white text-black px-10 py-5 rounded-full font-bold hover:bg-red-600 hover:text-white transition duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        Add to Cart <ShoppingBag size={20} />
                      </button>
                  </div>

                  <a 
                    href="https://www.amazon.in/WefPro-Natural-Strawberry-Traditional-Handmade/dp/B0G1GNXVY9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-stone-500 hover:text-white text-sm mt-4 flex items-center gap-2 transition"
                  >
                    View on Amazon.in <ArrowRight size={14}/>
                  </a>
              </div>

          </div>
      </div>

    </div>
  );
};

export default Home;