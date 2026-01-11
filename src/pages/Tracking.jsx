import React, { useState, useEffect } from 'react';
import { Check, Package, Truck, Home, MapPin, Search, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Define the Steps
  const steps = [
    { label: "Order Placed", icon: Package },
    { label: "Processing", icon: MapPin },
    { label: "Shipped", icon: Truck },
    { label: "Out for Delivery", icon: Home }, // Optional step
    { label: "Delivered", icon: Check }
  ];

  // Helper: Convert Text Status to Number
  const getStepIndex = (status) => {
    if (!status) return 0;
    if (status === 'Processing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 4;
    return 0; // Default
  };

  const fetchOrder = async (idToSearch) => {
    if(!idToSearch) return;
    setLoading(true);
    setError('');
    
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${idToSearch}`);
        if (res.ok) {
            const data = await res.json();
            setOrderData(data);
        } else {
            setError("Order ID not found. Please check and try again.");
            setOrderData(null);
        }
    } catch (err) {
        setError("Connection failed. Is the server running?");
    }
    setLoading(false);
  };

  // If URL has ID (e.g. /track?id=WF-1234), search automatically
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
        setOrderId(urlId);
        fetchOrder(urlId);
    }
  }, [searchParams]);

  const currentStep = orderData ? getStepIndex(orderData.status) : 0;

  return (
    <div className="min-h-screen bg-stone-50 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* 1. SEARCH BAR SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8 text-center">
            <h1 className="text-2xl font-bold text-stone-800 mb-4">Track Your Order</h1>
            <div className="flex max-w-md mx-auto relative">
                <Search className="absolute left-4 top-3.5 text-stone-400" size={20}/>
                <input 
                    type="text" 
                    placeholder="Enter Order ID (e.g. WF-1234)" 
                    className="w-full pl-12 pr-4 py-3 border rounded-l-xl focus:outline-red-500 bg-stone-50"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                />
                <button 
                    onClick={() => fetchOrder(orderId)}
                    className="bg-stone-900 text-white px-6 rounded-r-xl font-bold hover:bg-black transition"
                >
                    Track
                </button>
            </div>
            {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
        </div>

        {/* 2. ORDER DETAILS (Only show if data found) */}
        {loading && <p className="text-center text-stone-500">Searching satellite network...</p>}
        
        {orderData && (
        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden fade-in">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-stone-400 text-sm">Order #{orderData.orderId}</p>
              <p className="font-bold text-xl">{orderData.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-stone-400 text-sm">Current Status</p>
              <p className="font-bold text-yellow-400 text-xl uppercase tracking-wider">{orderData.status}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-8 relative">
            <div className="absolute left-[51px] top-10 bottom-10 w-1 bg-stone-100"></div>
            
            {/* DYNAMIC GREEN LINE */}
            <div 
                className="absolute left-[51px] top-10 w-1 bg-green-500 transition-all duration-1000"
                style={{ height: `${currentStep * 25}%` }} 
            ></div>

            <div className="space-y-8 relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStep;
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500
                      ${isCompleted ? 'bg-green-500 border-green-100 text-white scale-110' : 'bg-white border-stone-100 text-stone-300'}
                    `}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className={`font-bold ${isCompleted ? 'text-stone-800' : 'text-stone-300'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default Tracking;