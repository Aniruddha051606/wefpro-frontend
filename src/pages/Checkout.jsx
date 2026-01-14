import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cartItems, clearCart }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Pay Now");
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
    setStatus("Initiating...");

    try {
        // 1. Call Backend
        const response = await fetch('/api/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total }),
        });
        const data = await response.json();

        if (!data.success) throw new Error("Payment Init Failed");

        // 🟢 DEMO MODE CHECK
        if (data.isMock) {
            setStatus("Simulating Bank Gateway...");
            setTimeout(() => {
                saveOrder({ razorpay_payment_id: "pay_mock_123456" });
            }, 2000); // 2 second fake delay
            return;
        }

        // 🔴 REAL MODE (Only runs if keys exist)
        const isLoaded = await loadRazorpay();
        if (!isLoaded) return alert("Razorpay SDK failed to load");

        const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "WefPro Foods",
            description: "Order Payment",
            order_id: data.order.id,
            handler: function (response) {
                saveOrder(response);
            },
            prefill: { name: formData.fullName, contact: formData.phone },
            theme: { color: "#dc2626" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (err) {
        alert("Payment System Error. Please try again.");
        setLoading(false);
        setStatus("Pay Now");
    }
  };

  const saveOrder = async (paymentResponse) => {
    setStatus("Confirming Order...");
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

    const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
    });

    if (res.ok) {
        if (clearCart) clearCart();
        navigate('/order-success', { state: { orderId, amount: total, customerName: formData.fullName } });
    }
    setLoading(false);
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
               {loading ? <span className="animate-pulse">{status}</span> : <>Pay ₹{total} <Lock size={16} /></>}
            </button>
            <p className="text-center text-xs text-stone-600 flex justify-center items-center gap-1"><ShieldCheck size={12}/> Secure Payment Gateway</p>
          </form>
        </div>
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