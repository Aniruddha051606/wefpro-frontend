import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';

const Invoice = () => {
  const { id } = useParams(); // Get Invoice ID from URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Find the order that matches this Invoice ID
    const allOrders = JSON.parse(localStorage.getItem("wefpro_orders") || "[]");
    const foundOrder = allOrders.find(o => o.invoiceId === id);
    setOrder(foundOrder);
  }, [id]);

  if (!order) return <div className="min-h-screen flex items-center justify-center font-sans text-stone-500">Loading Invoice...</div>;

  return (
    <div className="min-h-screen bg-stone-100 p-8 flex justify-center font-sans text-slate-800">
      <div className="bg-white w-full max-w-2xl shadow-2xl p-12 relative h-fit">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-stone-200 pb-8 mb-8">
            <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900">INVOICE</h1>
                <p className="text-slate-500 text-sm mt-2">WefPro Foods Pvt Ltd.</p>
                <p className="text-slate-500 text-sm">Mahabaleshwar, Maharashtra, 412806</p>
                <p className="text-slate-500 text-sm">GSTIN: 27AABCU9603R1Z</p>
            </div>
            <div className="text-right">
                <h3 className="font-mono text-xl text-red-600 font-bold">#{order.invoiceId}</h3>
                <p className="text-slate-500 text-sm">Date: {order.date}</p>
            </div>
        </div>

        {/* Bill To */}
        <div className="flex justify-between mb-12">
            <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Billed To</p>
                <h3 className="font-bold text-lg">{order.customerName}</h3>
                <p className="text-slate-600 w-64 text-sm">{order.address}, {order.city} - {order.pincode}</p>
                <p className="text-slate-600 text-sm mt-1">Phone: {order.phone}</p>
            </div>
            <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Payment Method</p>
                <p className="font-bold flex items-center justify-end gap-2 text-green-600">
                    <CheckCircle size={14} /> Prepaid (Online)
                </p>
                <p className="text-slate-400 text-xs mt-1">Transaction ID: tx_{Math.floor(Math.random()*1000000)}</p>
            </div>
        </div>

        {/* Table */}
        <table className="w-full text-left mb-12">
            <thead className="bg-stone-50 text-slate-500 text-xs uppercase">
                <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Total</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
                {order.items && order.items.map((item, index) => (
                    <tr key={index}>
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4 text-center">{item.qty}</td>
                        <td className="p-4 text-right">₹{item.price}</td>
                        <td className="p-4 text-right">₹{item.price * item.qty}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end border-t border-slate-900 pt-6">
            <div className="text-right space-y-2">
                <div className="flex justify-between w-64">
                    <span className="text-slate-500">Subtotal</span>
                    <span>₹{order.amount - (order.amount > 499 ? 0 : 40)}</span>
                </div>
                <div className="flex justify-between w-64">
                    <span className="text-slate-500">Shipping</span>
                    <span>{order.amount > 499 ? "Free" : "₹40"}</span>
                </div>
                <div className="flex justify-between w-64 text-2xl font-bold border-t border-slate-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{order.amount}</span>
                </div>
            </div>
        </div>

        {/* Footer / AWB Linkage (Internal Use) */}
        <div className="absolute bottom-0 left-0 w-full bg-stone-50 p-6 flex justify-between items-center border-t border-stone-200 text-xs text-slate-400 rounded-b-lg">
            <p>Thank you for choosing WefPro.</p>
            <div className="flex items-center gap-2">
                <span>Tracking Ref:</span>
                <span className="font-mono bg-white border px-2 py-1 rounded text-slate-600">{order.awb}</span>
            </div>
        </div>

        {/* Print Button (Floating) */}
        <div className="fixed top-8 right-8 flex flex-col gap-4 print:hidden">
            <button onClick={() => window.print()} className="bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition">
                <Printer size={24} />
            </button>
            <Link to="/" className="bg-white text-slate-900 p-4 rounded-full shadow-xl hover:scale-110 transition">
                <ArrowLeft size={24} />
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Invoice;