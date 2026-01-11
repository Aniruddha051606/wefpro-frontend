import React from 'react';
import { Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

// RECEIVE THE NEW PROP: updateQty
const Cart = ({ cartItems, removeFromCart, updateQty }) => {
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  if (cartItems.length === 0) {
      return (
          <div className="min-h-screen flex items-center justify-center flex-col bg-stone-950 text-white font-serif">
              <h1 className="text-4xl mb-6 italic text-stone-300">Your collection is empty.</h1>
              <Link to="/" className="px-8 py-3 border border-stone-600 rounded-full hover:bg-white hover:text-black transition uppercase text-xs tracking-widest">
                  Start Shopping
              </Link>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 p-6 md:p-12 pt-24 font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif mb-12 text-white">Shopping Bag <span className="text-stone-600 text-2xl">({cartItems.length})</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Interactive Items List */}
          <div className="lg:col-span-2 space-y-6">
               {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 rounded-xl hover:bg-stone-900/50 transition border border-transparent hover:border-stone-800">
                  {/* Image */}
                  <div className="w-28 h-28 bg-stone-900 rounded-lg overflow-hidden shadow-lg">
                    <img src={item.image} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition duration-500 hover:scale-110" alt={item.name}/>
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-serif text-xl text-white">{item.name}</h3>
                            <p className="text-stone-500 text-sm mt-1">{item.desc}</p>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-stone-600 hover:text-red-500 transition p-2 hover:bg-stone-800 rounded-full"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>

                      {/* ⚡ INTERACTIVE CONTROLS ⚡ */}
                      <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center gap-3 bg-stone-900 rounded-lg p-1 border border-stone-800">
                              <button 
                                onClick={() => updateQty(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 rounded transition"
                              >
                                  <Minus size={14}/>
                              </button>
                              <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                              <button 
                                onClick={() => updateQty(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 rounded transition"
                              >
                                  <Plus size={14}/>
                              </button>
                          </div>
                          <p className="text-lg font-medium text-stone-300">₹{item.price * item.qty}</p>
                      </div>
                  </div>
                </div>
               ))}
          </div>

          {/* Checkout Panel */}
          <div className="h-fit sticky top-24">
            <div className="bg-stone-900/40 p-8 rounded-2xl border border-stone-800 backdrop-blur-md shadow-2xl">
                <h2 className="text-xl font-serif mb-8 text-white">Summary</h2>
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-stone-400 text-sm"><span>Subtotal</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between text-stone-400 text-sm"><span>Shipping</span><span>Calculated at checkout</span></div>
                </div>
                
                <div className="flex justify-between text-2xl font-serif text-white pt-6 border-t border-stone-800 mb-8">
                <span>Total</span>
                <span>₹{subtotal}</span>
                </div>

                <Link 
                    to="/checkout" 
                    className="group w-full bg-white text-black py-4 rounded-full font-bold text-center hover:bg-stone-200 transition flex justify-center items-center gap-3"
                >
                Proceed to Checkout 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition"/>
                </Link>
                
                <p className="text-center text-stone-600 text-xs mt-4 tracking-wider uppercase">Free Shipping on orders over ₹500</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;