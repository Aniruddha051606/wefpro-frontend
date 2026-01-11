import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Truck, MapPin, Clock, ArrowRight, CheckCircle, FileText, Download } from 'lucide-react';

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id"); 
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  
  // DATES
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3); 

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    // 1. TRY TO FIND REAL ORDER IN DATABASE
    const savedOrders = JSON.parse(localStorage.getItem("wefpro_orders") || "[]");
    const foundOrder = savedOrders.find(o => o.orderId === orderId);

    if (foundOrder) {
        // FOUND IT! Use real data
        setOrderData(foundOrder);
        setLoading(false);
    } else {
        // NOT FOUND (Use Simulation Data for demo purposes)
        setTimeout(() => {
            setOrderData({
                awb: "DEL-" + Math.floor(Math.random() * 900000000),
                status: "Shipped",
                invoiceId: null // No invoice for fake orders
            });
            setLoading(false);
        }, 2000); 
    }
  }, [orderId]);

  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="tracking-widest uppercase text-xs animate-pulse">Retrieving Shipment Details...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans overflow-x-hidden">
      
      {/* 1. MAP HEADER */}
      <div className="h-[40vh] w-full relative bg-stone-900 overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale" 
            alt="Live Map"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950"></div>
        
        {/* Status Card */}
        <div className="absolute bottom-0 w-full p-6">
            <div className="max-w-2xl mx-auto flex items-end justify-between">
                <div>
                    <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Estimated Arrival</p>
                    <h1 className="text-4xl font-serif text-white">{formatDate(deliveryDate)}</h1>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-500/30">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> {orderData.status || "In Transit"}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. TRACKING DETAILS */}
      <div className="max-w-2xl mx-auto px-6 pb-24 -mt-4 relative z-10">
        
        {/* 📄 INVOICE BUTTON (NEW) */}
        {orderData.invoiceId && (
            <div className="bg-gradient-to-r from-stone-900 to-stone-800 border border-stone-700 p-4 rounded-xl mb-6 flex justify-between items-center shadow-lg transform -translate-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <FileText size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Tax Invoice Available</p>
                        <p className="text-xs text-stone-400">Order #{orderId}</p>
                    </div>
                </div>
                <Link 
                    to={`/invoice/${orderData.invoiceId}`}
                    target="_blank"
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                >
                    <Download size={14} /> Download
                </Link>
            </div>
        )}

        <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-6">
                <div>
                    <p className="text-xs text-stone-500 uppercase">Courier Partner</p>
                    <p className="font-bold">{orderData.courier || "Delhivery Express"}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-stone-500 uppercase">AWB Number</p>
                    <p className="font-mono text-red-500">{orderData.awb}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative pl-2">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-800"></div>

                <div className="relative flex gap-6">
                    <div className="relative z-10 w-6 h-6 bg-stone-900 border-2 border-red-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-red-500"/>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Order Confirmed</h3>
                        <p className="text-xs text-stone-500 mt-1">{formatDate(today)}, 10:42 AM</p>
                    </div>
                </div>

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

                <div className="relative flex gap-6 opacity-40">
                    <div className="relative z-10 w-6 h-6 bg-stone-800 rounded-full"></div>
                    <div>
                        <h3 className="font-bold text-white">Out for Delivery</h3>
                        <p className="text-xs text-stone-500 mt-1">Pending</p>
                    </div>
                </div>
            </div>
        </div>

        <Link to="/" className="mt-8 flex items-center justify-center gap-2 text-stone-500 hover:text-white transition">
            Continue Shopping <ArrowRight size={16}/>
        </Link>

      </div>
    </div>
  );
};

export default Tracking;