import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Download, FileText, ArrowRight } from 'lucide-react';
import { downloadInvoice } from '../utils/generateInvoice'; // <--- IMPORT THIS

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id"); 
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  
  // DATES
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 3); 

  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("wefpro_orders") || "[]");
    const foundOrder = savedOrders.find(o => o.orderId === orderId);

    if (foundOrder) {
        setOrderData(foundOrder);
        setLoading(false);
    } else {
        setTimeout(() => {
            setOrderData({
                awb: "DEL-" + Math.floor(Math.random() * 900000000),
                status: "Shipped",
                invoiceId: null 
            });
            setLoading(false);
        }, 2000); 
    }
  }, [orderId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans overflow-x-hidden">
      
      {/* HEADER VISUALS */}
      <div className="h-[40vh] w-full relative bg-stone-900 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950"></div>
        <div className="absolute bottom-6 w-full px-6 flex justify-between items-end max-w-2xl mx-auto">
            <div><p className="text-stone-400 text-xs uppercase mb-1">Estimated Arrival</p><h1 className="text-4xl font-serif">{formatDate(deliveryDate)}</h1></div>
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">In Transit</div>
        </div>
      </div>

      {/* TRACKING CARD */}
      <div className="max-w-2xl mx-auto px-6 pb-24 -mt-4 relative z-10">
        
        {/* 📄 DIRECT DOWNLOAD BUTTON */}
        {orderData.invoiceId && (
            <div className="bg-stone-800/80 border border-stone-700 p-4 rounded-xl mb-6 flex justify-between items-center shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg"><FileText size={20} /></div>
                    <div><p className="text-sm font-bold">Tax Invoice</p><p className="text-xs text-stone-400">Ready for download</p></div>
                </div>
                {/* BUTTON TRIGGERS DOWNLOAD FUNCTION */}
                <button 
                    onClick={() => downloadInvoice(orderData)} 
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                >
                    <Download size={14} /> Download PDF
                </button>
            </div>
        )}

        <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-800 pb-4 mb-6">
                <div><p className="text-xs text-stone-500 uppercase">Courier</p><p className="font-bold">{orderData.courier || "Delhivery"}</p></div>
                <div className="text-right"><p className="text-xs text-stone-500 uppercase">AWB</p><p className="font-mono text-red-500">{orderData.awb}</p></div>
            </div>
            
            {/* Timeline (Simplified) */}
            <div className="space-y-6 relative pl-4 border-l border-stone-800 ml-2">
                <div className="relative pl-6">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                    <h3 className="font-bold text-white">Shipped</h3>
                    <p className="text-xs text-stone-500">{formatDate(today)}, Mahabaleshwar</p>
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