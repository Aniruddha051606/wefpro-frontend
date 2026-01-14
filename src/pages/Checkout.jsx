import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Truck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ cartItems, clearCart }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Pay Now");
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });
  
  const [shippingCost, setShippingCost] = useState(0); 
  const [shippingStatus, setShippingStatus] = useState("Enter Pincode"); 
  
  const navigate = useNavigate();

  // ⚖️ WEIGHT LOGIC: 1 Jar = 400g (0.4kg)
  const totalWeight = cartItems.reduce((acc, item) => acc + (item.qty * 0.4), 0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const total = subtotal + shippingCost;

  // ⚡ Auto-Calculate when PIN changes OR Cart Quantity changes
  useEffect(() => {
    if (formData.pincode.length === 6) {
        checkShipping(formData.pincode);
    } else {
        setShippingCost(0);
        setShippingStatus("Enter Pincode");
    }
  }, [formData.pincode, totalWeight]); // Re-run if weight changes

  const checkShipping = async (pin) => {
    setShippingStatus("checking");
    try {
        // Send Weight to API
        const res = await fetch(`/api/shipping?pincode=${pin}&weight=${totalWeight}`);
        const data = await res.json();
        
        if (data.success) {
            setShippingCost(data.cost);
            setShippingStatus("valid");
        } else {
            setShippingCost(0);
            setShippingStatus("invalid");
        }
    } catch (e) {
        setShippingStatus("invalid");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ... (Keep loadRazorpay same as before) ...
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
    if (shippingStatus !== "valid") return alert("Please enter a valid pincode.");
    if(!formData.fullName || !formData.address || !formData.phone) return alert("Please fill details.");
    
    setLoading(true);
    setStatus("Initiating...");

    try {
        const response = await fetch('/api/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total }),
        });
        const data = await response.json();

        if (data.isMock) {
            setStatus("Simulating Gateway...");
            setTimeout(() => { saveOrder({ razorpay_payment_id: "pay_mock_" + Date.now() }); }, 2000);
            return;
        }

        if (!data.success) throw new Error("Payment Init Failed");
        const isLoaded = await loadRazorpay();
        if (!isLoaded) return alert("Razorpay SDK failed");

        const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "WefPro Foods",
            description: `Order of ${totalWeight}kg`,
            order_id: data.order.id,
            handler: function (response) { saveOrder(response); },
            prefill: { name: formData.fullName, contact: formData.phone },
            theme: { color: "#dc2626" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (err) {
        alert("Payment Error. Try again.");
        setLoading(false);
    }
  };

  const saveOrder = async (paymentResponse) => {
    setStatus("Confirming...");
    const orderId = "ORD-" + Math.floor(Math.random() * 1000000);
    const invoiceId = "INV-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);

    const newOrder = {
        orderId,
        invoiceId,
        customerName: formData.fullName,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        pincode: formData.pincode,
        items: cartItems,
        totalAmount: total,
        shippingCost: shippingCost, 
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
                    
                    {/* Dynamic PIN Field */}
                    <div className="relative">
                        <input name="pincode" onChange={handleChange} placeholder="PIN Code (e.g 412806)" maxLength={6} className={`w-full bg-stone-900 border p-4 rounded text-white transition-colors ${shippingStatus === 'invalid' ? 'border-red-500' : 'border-stone-800 focus:border-white'}`} required />
                        <div className="absolute right-3 top-4">
                            {shippingStatus === 'checking' && <div className="w-4 h-4 border-2 border-stone-600 border-t-white rounded-full animate-spin"></div>}
                            {shippingStatus === 'valid' && <Truck size={18} className="text-green-500" />}
                            {shippingStatus === 'invalid' && <AlertCircle size={18} className="text-red-500" />}
                        </div>
                    </div>
                </div>
                {shippingStatus === 'invalid' && <p className="text-xs text-red-500 mt-1">Delivery not available here.</p>}
            </div>

            <button type="submit" disabled={loading || shippingStatus !== 'valid'} className={`w-full py-4 rounded font-bold text-lg transition mt-6 flex justify-center items-center gap-2 ${loading || shippingStatus !== 'valid' ? 'bg-stone-800 text-stone-500 cursor-not-allowed' : 'bg-white text-black hover:bg-stone-200'}`}>
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
            <div className="border-t border-stone-800 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-stone-400 text-sm">
                    <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-400 text-sm">
                    <span>Est. Weight</span><span>{totalWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between text-stone-400 text-sm">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-stone-600" : "text-white"}>
                        {shippingCost === 0 ? "Enter PIN" : `₹${shippingCost}`}
                    </span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-stone-800 text-white">
                    <span>Total</span><span>₹{total}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;