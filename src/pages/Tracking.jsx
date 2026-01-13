import React, { useState } from 'react';
import { Search, Package, CheckCircle, Clock, Truck } from 'lucide-react';

const Tracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // 🟢 Call the new Public API
      const res = await fetch(`/api/track?orderId=${orderId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || "Order not found. Check your ID.");
      }
    } catch (err) {
      setError("Unable to track order. Try again later.");
    }
    setLoading(false);
  };

  const getStatusStep = (status) => {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status) + 1 || 1;
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 px-6 pb-12">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold mb-4">Track Your Order</h1>
          <p className="text-stone-500">Enter your Order ID (e.g., #WP-8392) to see live status.</p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 mb-12">
          <input 
            type="text" 
            placeholder="Order ID" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.trim())}
            className="flex-1 p-4 rounded-xl border border-stone-200 outline-none focus:border-red-600 shadow-sm"
          />
          <button disabled={loading} className="bg-black text-white px-6 rounded-xl font-bold hover:bg-stone-800 transition">
            {loading ? "..." : <Search />}
          </button>
        </form>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-8">{error}</div>}

        {order && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 animate-fade-in">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-bold text-xl">{order.customerName}</h3>
                <p className="text-sm text-stone-500">Order {order.orderId}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {order.status}
              </span>
            </div>

            {/* Status Steps */}
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-100">
              <StatusItem 
                icon={<Clock size={18} />} 
                title="Order Placed" 
                date={new Date(order.createdAt).toLocaleDateString()} 
                active={true} 
              />
              <StatusItem 
                icon={<Package size={18} />} 
                title="Processing" 
                desc="We are hand-packing your jar." 
                active={getStatusStep(order.status) >= 1} 
              />
              <StatusItem 
                icon={<Truck size={18} />} 
                title="Shipped" 
                desc={order.trackingId ? `AWB: ${order.trackingId}` : "Waiting for courier"} 
                active={getStatusStep(order.status) >= 2} 
              />
              <StatusItem 
                icon={<CheckCircle size={18} />} 
                title="Delivered" 
                active={getStatusStep(order.status) >= 3} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusItem = ({ icon, title, desc, date, active }) => (
  <div className={`relative pl-12 flex flex-col justify-center transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${active ? 'border-red-600 text-red-600' : 'border-stone-200 text-stone-300'}`}>
      {icon}
    </div>
    <h4 className="font-bold text-sm">{title}</h4>
    {desc && <p className="text-xs text-stone-500 mt-1">{desc}</p>}
    {date && <p className="text-xs text-stone-400 mt-1">{date}</p>}
  </div>
);

export default Tracking;