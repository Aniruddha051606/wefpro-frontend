import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Droplets, Leaf, ArrowRight } from 'lucide-react';

// KEEP YOUR STATIC ASSETS FOR FALLBACK
import heroImg from '../assets/jar-front.jpg'; 
import lifestyleImg from '../assets/jar-lifestyle.jpg';

const Home = ({ addToCart }) => {
  const [scrollY, setScrollY] = useState(0);

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

  // 🧮 ANIMATION MATH
  const progress = Math.min(scrollY / 1000, 2); 
  const opacity = Math.max(1 - (scrollY / 800), 0); // Video fades out as you scroll
  const scale = 1 + (scrollY * 0.0005); // Subtle zoom effect

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden selection:bg-red-500">
      
      {/* 🟢 1. STICKY VIDEO BACKGROUND (The "Cinematic" Layer) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         
         {/* OVERLAY: Darken video so text pops */}
         <div className="absolute inset-0 bg-black/40 z-10" style={{ opacity: opacity }}></div>
         
         {/* 🎥 THE VIDEO */}
         {/* I used a free 4K Strawberry stock video link here. 
             Replace 'src' with your local file later if you want: src={myVideoFile} */}
         <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover transition-transform duration-100 ease-out"
            style={{ 
                opacity: opacity,
                transform: `scale(${scale})`
            }}
         >
            <source src="https://cdn.pixabay.com/video/2024/02/05/199464-910408544_large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
         </video>

         {/* CENTRED TEXT (Floats on top of video) */}
         <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center"
              style={{ opacity: opacity, transform: `translateY(${scrollY * -0.5}px)` }}
         >
            <p className="text-red-500 tracking-[0.5em] text-sm uppercase mb-4 animate-fade-in-up">Handcrafted in Mahabaleshwar</p>
            <h1 className="text-6xl md:text-9xl font-serif font-black text-white mix-blend-overlay opacity-90">
                WEFPRO
            </h1>
         </div>
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      
      {/* SPACER (To let the video shine for the first 100vh) */}
      <div className="h-screen w-full"></div>

      {/* SECTION 2: THE PRODUCT REVEAL (White Card floating up) */}
      <div className="relative z-10 bg-stone-950 min-h-screen rounded-t-[3rem] border-t border-stone-800 -mt-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
          
          <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              
              {/* Product Image (Slides in) */}
              <div className="relative group">
                  <div className="absolute inset-0 bg-red-600/20 blur-[80px] rounded-full group-hover:bg-red-600/30 transition duration-700"></div>
                  <img 
                    src={heroImg} 
                    alt="Jar" 
                    className="relative w-full md:w-3/4 mx-auto object-contain drop-shadow-2xl transform group-hover:-translate-y-4 transition duration-500" 
                  />
              </div>

              {/* Details */}
              <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-serif">
                    The Taste of <br/><span className="text-red-600">Pure Fruit.</span>
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                          <Droplets className="text-red-500 mb-3" size={32}/>
                          <h3 className="font-bold text-xl">74% Fruit</h3>
                          <p className="text-stone-500 text-sm">Real Strawberries</p>
                      </div>
                      <div className="bg-stone-900/50 p-6 rounded-2xl border border-stone-800">
                          <Leaf className="text-green-500 mb-3" size={32}/>
                          <h3 className="font-bold text-xl">100% Natural</h3>
                          <p className="text-stone-500 text-sm">No Preservatives</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                      <span className="text-4xl font-light">₹{product.price}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-red-600 hover:text-white transition duration-300 flex justify-center items-center gap-2"
                      >
                        Add to Cart <ShoppingBag size={20} />
                      </button>
                  </div>
              </div>
          </div>

          {/* SECTION 3: LIFESTYLE IMAGE (Parallax) */}
          <div className="h-[60vh] relative overflow-hidden">
             <img 
                src={lifestyleImg} 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: `translateY(${(scrollY - 1500) * 0.1}px)` }} // slow parallax
                alt="Lifestyle"
             />
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <a 
                    href="https://www.amazon.in/WefPro-Natural-Strawberry-Traditional-Handmade/dp/B0G1GNXVY9" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition flex items-center gap-2"
                >
                    View on Amazon <ArrowRight size={18}/>
                </a>
             </div>
          </div>

          {/* FOOTER */}
          <div className="bg-black py-12 text-center text-stone-600 text-sm">
              <p>© 2026 WefPro Foods. Mahabaleshwar, India.</p>
          </div>

      </div>

    </div>
  );
};

export default Home;