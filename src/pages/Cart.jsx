import React from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart }) => {
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  if (cartItems.length === 0) {
      return (
          <div className="min-h-screen flex items-center justify-center flex-col bg-stone-950 text-white">
              <h1 className="text-3xl font-light tracking-wide mb-4">Your Bag is Empty</h1>
              <Link to="/" className="text-red-500 border-b border-red-500 pb-1 hover:text-red-400">Continue Shopping</Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-12 tracking-wider">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-8">
               {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 border-b border-stone-800 pb-8">
                  <div className="w-24 h-24 bg-stone-900 rounded overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover opacity-80" alt={item.name}/>
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-red-500 transition">
                            <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-stone-500 mt-1">{item.desc}</p>
                      <p className="text-stone-400 mt-4 text-sm">Qty: {item.qty} &times; ₹{item.price}</p>
                  </div>
                </div>
               ))}
          </div>

          {/* Summary Section */}
          <div className="bg-stone-900/50 p-8 rounded-2xl h-fit border border-stone-800 backdrop-blur-sm">
            <h2 className="text-xl font-serif mb-6">Order Summary</h2>
            <div className="flex justify-between mb-4 text-stone-400"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between mb-8 text-stone-400"><span>Shipping</span><span>Calculated at next step</span></div>
            
            <div className="flex justify-between text-2xl font-serif text-white pt-6 border-t border-stone-800 mb-8">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <Link to="/checkout" className="block w-full bg-white text-black py-4 rounded-full font-bold text-center hover:bg-stone-200 transition flex justify-center items-center gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;