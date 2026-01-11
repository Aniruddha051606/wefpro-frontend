import React, { useState } from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [loading, setLoading] = useState(false);
  
  // 1. STATE FOR FORM DATA (Stores what user types)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Mock Cart Data
  const [cartItems] = useState([
    { id: 1, name: "Premium Organic Strawberry Jam (250g)", price: 249, qty: 2, image: "https://images.unsplash.com/photo-1600423115367-87ea79269cd3?q=80&w=200" }
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const total = subtotal + (subtotal > 499 ? 0 : 40);

  // 2. HANDLER: Updates state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Basic Validation
    if(!formData.fullName || !formData.address) {
      alert("Please fill in your Shipping Details first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: "WF-" + Math.floor(Math.random() * 10000),
          amount: total,
          // 3. SEND REAL DATA TO BACKEND
          customerName: formData.fullName,
          customerAddress: formData.address,
          customerCity: formData.city,
          customerPincode: formData.pincode
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${formData.fullName}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      window.location.href = '/track?id=${orderId}';

    } catch (error) {
      console.error("Error:", error);
      alert("Server error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            {/* Cart Items (Hidden for brevity, same as before) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
               <h2 className="font-bold mb-4">Items</h2>
               {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between border-b py-2">
                  <span>{item.name} (x{item.qty})</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
               ))}
            </div>

            {/* 4. CONNECTED FORM INPUTS */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  name="fullName" value={formData.fullName} onChange={handleChange}
                  type="text" placeholder="Full Name" className="p-3 border rounded-lg" 
                />
                <input 
                  name="phone" value={formData.phone} onChange={handleChange}
                  type="text" placeholder="Phone Number" className="p-3 border rounded-lg" 
                />
                <input 
                  name="address" value={formData.address} onChange={handleChange}
                  type="text" placeholder="Address Line 1" className="md:col-span-2 p-3 border rounded-lg" 
                />
                <input 
                  name="city" value={formData.city} onChange={handleChange}
                  type="text" placeholder="City" className="p-3 border rounded-lg" 
                />
                <input 
                  name="pincode" value={formData.pincode} onChange={handleChange}
                  type="text" placeholder="Pincode" className="p-3 border rounded-lg" 
                />
              </form>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-100 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Total: ₹{total}</h2>
              <button 
                onClick={handlePayment} 
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition flex justify-center space-x-2"
              >
                {loading ? "Processing..." : "Pay & Get Invoice"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;