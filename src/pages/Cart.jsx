import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = ({ cartItems, addToCart, removeFromCart }) => {
  const navigate = useNavigate();

  // CALCULATIONS
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 499 ? 0 : 40; // Free shipping over ₹499
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mb-6 text-stone-600">
            <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-serif text-white mb-2">Your Cart is Empty</h2>
        <p className="text-stone-500 mb-8">Looks like you haven't added any jams yet.</p>
        <Link to="/" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-red-600 hover:text-white transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 bg-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT: CART ITEMS */}
        <div className="lg:col-span-2 space-y-6">
            <h1 className="text-4xl font-serif text-white mb-8">Your Selection</h1>
            
            {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 items-center bg-stone-900/40 p-6 rounded-2xl border border-stone-800">
                    {/* Image */}
                    <div className="w-24 h-24 bg-white/5 rounded-xl p-2 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-normal" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <p className="text-stone-500 text-sm mb-2">74% Real Fruit • 500g Jar</p>
                        <p className="text-red-500 font-mono text-lg">₹{item.price}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-3 bg-stone-950 rounded-lg p-1 border border-stone-800">
                            <button onClick={() => removeFromCart(item)} className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition">
                                <Minus size={16} />
                            </button>
                            <span className="font-mono w-4 text-center">{item.qty}</span>
                            <button onClick={() => addToCart(item)} className="p-2 hover:bg-stone-800 rounded text-stone-400 hover:text-white transition">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* RIGHT: SUMMARY CARD */}
        <div className="lg:col-span-1">
            <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 sticky top-32">
                <h3 className="text-xl font-serif text-white mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm text-stone-400 border-b border-stone-800 pb-6">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-white font-mono">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? "text-green-500" : "text-white font-mono"}>
                            {shipping === 0 ? "Free" : `₹${shipping}`}
                        </span>
                    </div>
                    {shipping === 0 && (
                        <p className="text-xs text-green-500 text-right">Free shipping unlocked!</p>
                    )}
                </div>

                <div className="flex justify-between items-center py-6">
                    <span className="text-lg text-white">Total</span>
                    <span className="text-3xl font-bold text-white font-serif">₹{total}</span>
                </div>

                <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-red-900/50"
                >
                    Checkout <ArrowRight size={20} />
                </button>
                
                <p className="text-center text-xs text-stone-600 mt-4">
                    Secure Checkout • Powered by Razorpay
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;