import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

const Tracking = () => {
  const location = useLocation();
  // Allow auto-filling ID from URL query params
  const queryParams = new URLSearchParams(location.search);
  const initialOrderId = queryParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-track if ID exists in URL on load
  useEffect(() => {
    if (initialOrderId) handleTrack(initialOrderId);
  }, [initialOrderId]);

  const handleTrack = async (idToTrack) => {
    const id = typeof idToTrack === 'string' ? idToTrack : orderId;
    if (!id) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/track?orderId=${id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || "Order not found. Please check your Order ID.");
      }
    } catch (err) {
      setError("Unable to connect to tracking service.");
    }
    setLoading(false);
  };

  // Helper to determine active step
  const getStepStatus = (step) => {
    if (!order) return 'inactive';
    const flow = ['Processing', 'Shipped', 'Delivered'];
    const currentIdx = flow.indexOf(order.status);
    const stepIdx = flow.indexOf(step);
    
    if (order.status === 'Paid' && step === 'Processing') return 'current';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'inactive';
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-800 pt-24 pb-12 px-4 md:px-8">
      
      {/* 1. HERO SEARCH SECTION */}
      <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Track Your Shipment</h1>
        <p className="text-slate-500 mb-8">Enter your Order ID (e.g., ORD-8291) to see live updates.</p>
        
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Enter Order ID..." 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 shadow-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-lg bg-white"
            />
            <button 
                onClick={() => handleTrack()} 
                disabled={loading}
                className="absolute inset-y-2 right-2 bg-slate-900 text-white px-6 rounded-lg font-bold hover:bg-red-600 transition flex items-center gap-2"
            >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <ArrowRight size={18} />}
            </button>
        </div>
        {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 text-sm font-medium animate-shake">
                <AlertCircle size={16} /> {error}
            </div>
        )}
      </div>

      {/* 2. ORDER DETAILS CARD */}
      {order && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">Order Details</p>
                    <h2 className="text-2xl font-bold">{order.orderId}</h2>
                    <p className="text-slate-400 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-xs text-slate-300">Total Amount</p>
                    <p className="text-xl font-bold">₹{order.totalAmount}</p>
                </div>
            </div>

            <div className="p-6 md:p-8">
                {/* 3. VISUAL PROGRESS BAR */}
                <div className="mb-12 relative">
                    {/* Connecting Line */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-stone-100 rounded-full -z-10"></div>
                    <div className="absolute top-5 left-0 h-1 bg-green-500 rounded-full -z-10 transition-all duration-1000" 
                         style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '50%' : '5%' }}></div>

                    <div className="flex justify-between w-full">
                        <Step icon={<Package size={20} />} label="Processing" status={getStepStatus('Processing')} />
                        <Step icon={<Truck size={20} />} label="Shipped" status={getStepStatus('Shipped')} />
                        <Step icon={<CheckCircle size={20} />} label="Delivered" status={getStepStatus('Delivered')} />
                    </div>
                </div>

                {/* 4. COURIER INFO */}
                {order.trackingId && (
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-8 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm text-slate-700"><Truck size={24} /></div>
                        <div>
                            <p className="font-bold text-slate-900">Shipped via Delhivery</p>
                            <p className="text-slate-500 text-sm font-mono">AWB: {order.trackingId}</p>
                        </div>
                    </div>
                )}

                {/* 5. LIVE ACTIVITY FEED */}
                <div>
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" /> Tracking History
                    </h3>
                    
                    <div className="space-y-0 pl-2">
                        {/* Live Delhivery Scans */}
                        {(order.liveTracking || []).length > 0 ? (
                            order.liveTracking.map((scan, i) => (
                                <TimelineItem 
                                    key={i}
                                    title={scan.ScanDetail?.Scan || scan.status}
                                    date={scan.ScanDetail?.ScanDateTime || scan.date}
                                    location={scan.ScanDetail?.ScannedLocation || scan.location}
                                    isFirst={i === 0}
                                    isLast={i === order.liveTracking.length - 1}
                                />
                            ))
                        ) : (
                            // Fallback if no scans yet
                            <div className="text-center py-8 text-slate-400 italic">
                                No tracking updates available yet. Check back shortly.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const Step = ({ icon, label, status }) => {
    const colors = {
        inactive: "bg-stone-100 text-stone-400 border-stone-200",
        current: "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100",
        completed: "bg-green-600 text-white border-green-600"
    };

    return (
        <div className="flex flex-col items-center gap-3 bg-white px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${colors[status]}`}>
                {status === 'completed' ? <CheckCircle size={18} /> : icon}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${status === 'inactive' ? 'text-stone-400' : 'text-slate-800'}`}>
                {label}
            </span>
        </div>
    );
};

const TimelineItem = ({ title, date, location, isFirst, isLast }) => (
    <div className="flex gap-4 relative pb-8">
        {/* Vertical Line */}
        {!isLast && <div className="absolute left-[7px] top-8 bottom-0 w-0.5 bg-stone-200"></div>}
        
        {/* Dot */}
        <div className={`w-4 h-4 rounded-full border-2 z-10 flex-shrink-0 mt-1 ${isFirst ? 'bg-green-600 border-green-600 ring-4 ring-green-50' : 'bg-stone-200 border-stone-200'}`}></div>
        
        {/* Content */}
        <div>
            <p className={`font-medium ${isFirst ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{title}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{new Date(date).toLocaleString()}</span>
                {location && (
                    <>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={10} /> {location}</span>
                    </>
                )}
            </div>
        </div>
    </div>
);

export default Tracking;