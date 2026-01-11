import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
// import { API_URL } from '../config'; // <--- Not needed for demo mode

const Checkout = ({ cartItems }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });

  // Math
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ⚡ DEMO MODE PAYMENT HANDLER ⚡
  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent form submit refresh
    
    // Basic Validation
    if(!formData.fullName || !formData.address || !formData.phone) {
        return alert("Please fill in all details to proceed.");
    }
    
    setLoading(true);

    // 🕒 SIMULATE SERVER DELAY (2 Seconds)
    // This makes it feel like a "Real" payment is processing
    setTimeout(() => {
        
        // 1. Generate a Fake Order ID (e.g., order_839201)
        const fakeOrderId = "order_" + Math.floor(Math.random() * 1000000);
        
        // 2. Redirect to Tracking Page
        setLoading(false);
        window.location.href = `/track?id=${fakeOrderId}`;
        
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Form */}
        <div>
          <h2 className="text-3xl font-serif mb-8 text-white">Secure Checkout</h2>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-500">Contact</label>
                <input name="fullName" onChange={handleChange} placeholder="Full Name" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" />
                <input name="phone" onChange={handleChange} placeholder="Phone Number" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" />
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-500">Delivery</label>
                <input name="address" onChange={handleChange} placeholder="Street Address" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" />
                <div className="grid grid-cols-2 gap-4">
                    <input name="city" onChange={handleChange} placeholder="City" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" />
                    <input name="pincode" onChange={handleChange} placeholder="PIN Code" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" />
                </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded font-bold text-lg hover:bg-stone-200 transition mt-6 flex justify-center items-center gap-2">
               {loading ? "Processing Payment..." : `Pay ₹${total}`} <Lock size={16} />
            </button>
            <p className="text-center text-xs text-stone-600 flex justify-center items-center gap-1">
                <ShieldCheck size={12}/> 256-bit SSL Secured Payment
            </p>
          </form>
        </div>

        {/* Right: Summary (Visual) */}
        <div className="bg-stone-900 p-8 rounded-2xl h-fit border border-stone-800">
            <h3 className="text-lg font-serif mb-6 text-stone-400">Order Details</h3>
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between mb-4 text-sm">
                    <span>{item.name} <span className="text-stone-500">x{item.qty}</span></span>
                    <span>₹{item.price * item.qty}</span>
                </div>
            ))}
            <div className="border-t border-stone-800 mt-4 pt-4 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>₹{total}</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;