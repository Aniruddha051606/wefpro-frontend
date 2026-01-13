import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, FileText } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, amount, customerName } = location.state || {};

  useEffect(() => {
    if (!orderId) navigate('/');
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center space-y-8 animate-fade-in">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-green-100 p-6 rounded-full text-green-600">
                <CheckCircle size={48} strokeWidth={3} />
            </div>
        </div>
        <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-stone-900">Payment Successful!</h1>
            <p className="text-stone-500">Thank you, {customerName}. Your order has been placed.</p>
        </div>
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-4">
            <div className="flex justify-between text-sm"><span className="text-stone-500">Order ID</span><span className="font-mono font-bold text-stone-800">#{orderId}</span></div>
            <div className="flex justify-between text-sm"><span className="text-stone-500">Amount Paid</span><span className="font-bold text-stone-800">₹{amount}</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to={`/track?orderId=${orderId}`} className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition"><Package size={18} /> Track Order</Link>
            <Link to={`/invoice/${orderId}`} className="flex items-center justify-center gap-2 bg-stone-100 text-stone-900 py-3 rounded-xl font-bold hover:bg-stone-200 transition border border-stone-200"><FileText size={18} /> Get Invoice</Link>
        </div>
        <Link to="/" className="block text-stone-400 hover:text-red-600 text-sm transition">Return to Home</Link>
      </div>
    </div>
  );
};
export default OrderSuccess;