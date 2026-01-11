import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Truck, MapPin, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id"); 
  const [loading, setLoading] = useState(true);
  
  // GENERATE FAKE DATES (So it always looks fresh)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3); // Delivery in 3 days

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    // SIMULATE API CALL
    setTimeout(() => setLoading(false), 2500); 
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="tracking-widest uppercase text-xs animate-pulse">Connecting to Courier Network...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans overflow-x-hidden">
      
      {/* 1. MAP HEADER (Visual Only) */}
      <div className="h-[40vh] w-full relative bg-stone-900 overflow-hidden">
        {/* Fake Map Background */}
        <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale" 
            alt="Live Map"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950"></div>
        
        {/* Floating Status Card */}
        <div className="absolute bottom-0 w-full p-6">
            <div className="max-w-2xl mx-auto flex items-end justify-between">
                <div>
                    <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Estimated Arrival</p>
                    <h1 className="text-4xl font-serif text-white">{formatDate(deliveryDate)}</h1>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-500/30">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> In Transit
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. TRACKING DETAILS */}
      <div className="max-w-2xl mx-auto px-6 pb-24 -mt-4 relative z-10">
        
        <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-6">
                <div>
                    <p className="text-xs text-stone-500 uppercase">Courier Partner</p>
                    <p className="font-bold">Delhivery Express</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-stone-500 uppercase">AWB Number</p>
                    <p className="font-mono text-red-500">1890{Math.floor(Math.random() * 10000)}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative pl-2">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-800"></div>

                {/* Step 1: Order Placed */}
                <div className="relative flex gap-6">
                    <div className="relative z-10 w-6 h-6 bg-stone-900 border-2 border-red-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-red-500"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Order Confirmed</h3>
                        <p className="text-xs text-stone-500 mt-1">{formatDate(today)}, 10:42 AM</p>
                    </div>
                </div>

                {/* Step 2: Picked Up */}
                <div className="relative flex gap-6">
                    <div className="relative z-10 w-6 h-6 bg-stone-900 border-2 border-red-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-red-500"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Picked up by Courier</h3>
                        <p className="text-xs text-stone-500 mt-1">{formatDate(today)}, 02:15 PM • Mahabaleshwar Hub</p>
                    </div>
                </div>

                {/* Step 3: In Transit (Active) */}
                <div className="relative flex gap-6">
                    <div className="relative z-10 w-6 h-6 bg-red-600 rounded-full shadow-[0_0_15px_red] flex items-center justify-center animate-pulse">
                        <Truck size={12} className="text-white"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">In Transit</h3>
                        <p className="text-sm text-stone-400 mt-1">Package has left the Origin Facility.</p>
                        <p className="text-xs text-stone-500 mt-1">Expected: {formatDate(deliveryDate)}</p>
                    </div>
                </div>

                {/* Step 4: Delivered (Future) */}
                <div className="relative flex gap-6 opacity-40">
                    <div className="relative z-10 w-6 h-6 bg-stone-800 rounded-full"></div>
                    <div>
                        <h3 className="font-bold text-white">Out for Delivery</h3>
                        <p className="text-xs text-stone-500 mt-1">Pending</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Home Button */}
        <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-stone-500 hover:text-white transition">
            Continue Shopping <ArrowRight size={16}/>
        </Link>

      </div>
    </div>
  );
};

export default Tracking;