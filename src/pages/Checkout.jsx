import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cartItems, clearCart }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Load Razorpay SDK Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!formData.fullName || !formData.address || !formData.phone) return alert("Please fill in all details.");
    
    setLoading(true);

    // 1. Load Script
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert('Razorpay failed to load. Check internet connection.');
      setLoading(false);
      return;
    }

    // 2. Create Order on Server
    const data = await fetch('/api/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total }),
    }).then((t) => t.json());

    if (!data.success) {
      alert("Could not initiate payment. Server error.");
      setLoading(false);
      return;
    }

    // 3. Open Popup
    const options = {
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_YOUR_TEST_KEY", // Use env variable in prod
      amount: data.order.amount,
      currency: data.order.currency,
      name: "WefPro Foods",
      description: "Order Payment",
      order_id: data.order.id,
      handler: async function (response) {
        await saveOrder(response); // Save to DB only if successful
      },
      prefill: {
        name: formData.fullName,
        contact: formData.phone,
      },
      theme: { color: "#dc2626" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  const saveOrder = async (paymentResponse) => {
    setLoading(true);
    const orderId = "ORD-" + Math.floor(Math.random() * 1000000);
    const invoiceId = "INV-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);

    const newOrder = {
        orderId,
        invoiceId,
        customerName: formData.fullName,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        items: cartItems,
        totalAmount: total,
        paymentStatus: "Paid",
        paymentId: paymentResponse.razorpay_payment_id,
        status: "Processing"
    };

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder),
        });

        if (response.ok) {
            if (clearCart) clearCart();
            navigate('/order-success', { 
                state: { orderId, amount: total, customerName: formData.fullName } 
            });
        }
    } catch (error) {
        alert("Payment success, but order saving failed. Please contact support.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-serif mb-8 text-white">Secure Checkout</h2>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-500">Contact</label>
                <input name="fullName" onChange={handleChange} placeholder="Full Name" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white" required />
                <input name="phone" onChange={handleChange} placeholder="Phone Number" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white" required />
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-500">Delivery</label>
                <input name="address" onChange={handleChange} placeholder="Street Address" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white" required />
                <div className="grid grid-cols-2 gap-4">
                    <input name="city" onChange={handleChange} placeholder="City" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white" required />
                    <input name="pincode" onChange={handleChange} placeholder="PIN Code" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white" required />
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded font-bold text-lg hover:bg-stone-200 transition mt-6 flex justify-center items-center gap-2">
               {loading ? "Processing..." : <>Pay ₹{total} <Lock size={16} /></>}
            </button>
            <p className="text-center text-xs text-stone-600 flex justify-center items-center gap-1"><ShieldCheck size={12}/> 100% Secure Payments via Razorpay</p>
          </form>
        </div>
        
        {/* Cart Summary */}
        <div className="bg-stone-900 p-8 rounded-2xl h-fit border border-stone-800">
            <h3 className="text-lg font-serif mb-6 text-stone-400">Order Details</h3>
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between mb-4 text-sm">
                    <span>{item.name} <span className="text-stone-500">x{item.qty}</span></span>
                    <span>₹{item.price * item.qty}</span>
                </div>
            ))}
            <div className="border-t border-stone-800 mt-4 pt-4 flex justify-between font-bold text-xl">
                <span>Total</span><span>₹{total}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;