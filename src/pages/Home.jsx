import React, { useEffect } from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle, Leaf, Droplets, MapPin } from 'lucide-react';

// IMPORT YOUR ASSETS
import heroImg from '../assets/jar-front.jpg'; 
import lifestyleImg from '../assets/jar-lifestyle.jpg';
import backImg from '../assets/jar-back.jpg'; 

const Home = ({ addToCart }) => {
  
  const product = { 
    id: 1, 
    name: "WefPro Natural Strawberry Jam", 
    price: 249, 
    image: heroImg, 
    desc: "74% Real Strawberries. No Artificial Colours." 
  };

  // 🎥 SCROLL OBSERVER (Triggers animations when you scroll)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of item is visible

    document.querySelectorAll('.reveal, .reveal-left').forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden selection:bg-red-900 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <div className="min-h-screen flex flex-col md:flex-row items-center relative overflow-hidden">
        
        {/* Background Gradient Blob for Atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 py-20 z-10">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <span className="bg-gradient-to-r from-red-600 to-red-800 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase shadow-lg shadow-red-900/50">
                  Best Seller
                </span>
                <span className="text-stone-400 text-xs tracking-[0.2em] uppercase">Batch No. 215</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-none tracking-tight">
              Pure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-900">Passion.</span>
            </h1>
            
            <p className="text-stone-300 text-lg mb-10 leading-relaxed max-w-md border-l-2 border-red-800 pl-6 opacity-80">
              "Experience the nostalgia of Mahabaleshwar." <br/>
              Handcrafted with <strong className="text-white">74.63% Real Strawberries</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <span className="text-5xl font-thin text-white tracking-tighter">₹{product.price}</span>
              <button 
                onClick={() => addToCart(product)}
                className="group bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]"
              >
                Add to Cart 
                <ShoppingBag size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Floating Hero Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center relative">
            {/* The Jar Floats Up and Down */}
            <img 
                src={heroImg} 
                alt="WefPro Jar" 
                className="w-3/4 md:w-2/3 object-contain drop-shadow-[0_20px_50px_rgba(220,38,38,0.15)] animate-float"
            />
        </div>
      </div>

      {/* 2. LIFESTYLE SECTION (Scroll Reveal) */}
      <div className="py-32 bg-stone-950 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              
              {/* Image Slides in from Left */}
              <div className="reveal-left relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800/50 group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-700 z-10"></div>
                  <img 
                    src={lifestyleImg} 
                    alt="Breakfast" 
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition duration-[2000ms]" 
                  />
                  <div className="absolute bottom-8 left-8 z-20">
                      <p className="text-white font-serif text-3xl">Morning Rituals</p>
                      <p className="text-stone-300 text-sm">Perfect with toast, pancakes, or just a spoon.</p>
                  </div>
              </div>

              {/* Text Fades Up */}
              <div className="reveal space-y-12">
                  <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                    Tastes like <br/>
                    <span className="text-red-500">Real Fruit</span>,<br/>
                    Not Sugar.
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-8">
                      <div className="flex gap-6 items-start hover:bg-white/5 p-4 rounded-xl transition duration-300">
                          <div className="p-4 bg-stone-900 rounded-full text-red-500"><Droplets size={28}/></div>
                          <div>
                              <h3 className="font-bold text-xl mb-2">High Fruit Content</h3>
                              <p className="text-stone-400 leading-relaxed">Most commercial jams are 45% fruit. We pack 74% strawberries into every jar.</p>
                          </div>
                      </div>

                      <div className="flex gap-6 items-start hover:bg-white/5 p-4 rounded-xl transition duration-300">
                          <div className="p-4 bg-stone-900 rounded-full text-green-500"><Leaf size={28}/></div>
                          <div>
                              <h3 className="font-bold text-xl mb-2">Clean Label</h3>
                              <p className="text-stone-400 leading-relaxed">Ingredients you can read: Strawberry, Sugar, Lime Juice, Pectin. Nothing else.</p>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>

      {/* 3. TRANSPARENCY SECTION (Back Label) */}
      <div className="py-32 bg-black border-t border-stone-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="text-red-500 tracking-widest uppercase text-sm font-bold mb-4 block reveal">Complete Transparency</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-16 reveal">Read the Label. We hide nothing.</h2>
            
            <div className="relative reveal group cursor-zoom-in">
                {/* Glow Effect behind the jar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/20 to-transparent blur-xl group-hover:opacity-100 transition duration-1000"></div>
                
                <img 
                    src={backImg} 
                    alt="Nutrition Label" 
                    className="mx-auto w-64 md:w-80 rounded-lg shadow-2xl border border-stone-800 rotate-0 md:rotate-3 transition duration-700 group-hover:rotate-0 group-hover:scale-110"
                />
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center reveal">
                <div>
                    <p className="text-3xl font-bold text-white">287</p>
                    <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Calories</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">0.4g</p>
                    <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Protein</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">0g</p>
                    <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Trans Fat</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-white">3 M</p>
                    <p className="text-stone-500 text-xs uppercase tracking-widest mt-2">Shelf Life</p>
                </div>
            </div>
        </div>
      </div>

      {/* 4. FOOTER CTA */}
      <div className="bg-gradient-to-t from-red-950 to-black py-24 text-center">
        <div className="reveal">
            <h2 className="text-4xl font-serif mb-8">Ready to taste the difference?</h2>
            <a 
                href="https://www.amazon.in/WefPro-Natural-Strawberry-Traditional-Handmade/dp/B0G1GNXVY9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white border border-white/30 px-8 py-4 rounded-full hover:bg-white hover:text-black transition duration-300"
            >
                Order on Amazon <ArrowRight size={18}/>
            </a>
        </div>
      </div>

    </div>
  );
};

export default Home;