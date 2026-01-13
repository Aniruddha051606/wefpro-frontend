import React, { useState } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import Hook

const Checkout = ({ cartItems, clearCart }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Processing Payment..."); 
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', pincode: '' });
  const navigate = useNavigate(); // 2. Initialize Hook

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!formData.fullName || !formData.address || !formData.phone) return alert("Please fill in all details.");
    
    setLoading(true);
    setStatus("Verifying Payment...");

    // Simulated payment delay
    setTimeout(async () => {
        setStatus("Generating Tax Invoice...");
        
        const orderId = "ORD-" + Math.floor(Math.random() * 1000000);
        const invoiceId = "INV-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);
        const awbNumber = "DEL-" + Math.floor(Math.random() * 900000000 + 100000000);
        
        setStatus("Booking Delhivery Shipment...");
        
        const newOrder = {
            orderId: orderId,
            customerName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            items: cartItems,
            amount: total,
            date: new Date().toLocaleDateString(),
            status: "Paid", // Changed from "Shipped" to "Paid" initially
            invoiceId: invoiceId, 
            awb: awbNumber,      
            courier: "Delhivery Express",
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            if (response.ok) {
                if (clearCart) clearCart();
                setLoading(false);
                
                // 3. Navigate to Success Page with Data
                navigate('/order-success', { 
                    state: { 
                        orderId: orderId, 
                        amount: total, 
                        customerName: formData.fullName 
                    } 
                });
            } else {
                throw new Error("Failed to sync with Cloud Database");
            }
        } catch (error) {
            console.error("Cloud Error:", error);
            alert("Order processed but failed to sync. Please contact support.");
            setLoading(false);
        }
    }, 3000); 
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-serif mb-8 text-white">Secure Checkout</h2>
          <form onSubmit={handlePayment} className="space-y-6">
            {/* ... (Keep your existing inputs exactly as they were) ... */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-500">Contact</label>
                <input name="fullName" onChange={handleChange} placeholder="Full Name" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" required />
                <input name="phone" onChange={handleChange} placeholder="Phone Number" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" required />
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-stone-500">Delivery</label>
                <input name="address" onChange={handleChange} placeholder="Street Address" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" required />
                <div className="grid grid-cols-2 gap-4">
                    <input name="city" onChange={handleChange} placeholder="City" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" required />
                    <input name="pincode" onChange={handleChange} placeholder="PIN Code" className="w-full bg-stone-900 border border-stone-800 p-4 rounded text-white focus:outline-none focus:border-stone-600" required />
                </div>
            </div>
            {/* ... (End inputs) ... */}

            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded font-bold text-lg hover:bg-stone-200 transition mt-6 flex justify-center items-center gap-2">
               {loading ? <span className="animate-pulse">{status}</span> : <>Pay ₹{total} <Lock size={16} /></>}
            </button>
            <p className="text-center text-xs text-stone-600 flex justify-center items-center gap-1"><ShieldCheck size={12}/> 256-bit SSL Secured Payment</p>
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