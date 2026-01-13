import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, CheckCircle, Download, FileCheck } from 'lucide-react';
import { downloadInvoice } from '../utils/generateInvoice';

// 🦴 SKELETON LOADER
const InvoiceSkeleton = () => (
  <div className="min-h-screen bg-stone-100 p-4 md:p-8 flex justify-center font-sans">
    <div className="bg-white w-full max-w-2xl shadow-sm p-8 md:p-12 rounded-lg border border-stone-200">
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
            <div className="h-8 w-32 bg-stone-200 rounded"></div>
            <div className="h-8 w-24 bg-stone-200 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 w-full bg-stone-100 rounded"></div>
            <div className="h-4 w-full bg-stone-100 rounded"></div>
            <div className="h-4 w-2/3 bg-stone-100 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State to track if we already auto-downloaded to prevent loops
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/track?orderId=${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setOrder(data.data);
        } else {
          // Fallback: Try Local Storage
          const allOrders = JSON.parse(localStorage.getItem("wefpro_orders") || "[]");
          const found = allOrders.find(o => o.orderId === id || o.invoiceId === id);
          if (found) setOrder(found);
          else setError("Invoice not found.");
        }
      } catch (err) {
        setError("Could not retrieve invoice.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvoice();
  }, [id]);

  // ⚡ AUTO-DOWNLOAD EFFECT
  useEffect(() => {
    if (order && !hasDownloaded) {
      // Small delay to ensure UI renders first (smoothness)
      const timer = setTimeout(() => {
        downloadInvoice(order);
        setHasDownloaded(true);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [order, hasDownloaded]);

  if (loading) return <InvoiceSkeleton />;
  
  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans text-stone-500 gap-4">
        <p className="text-xl">{error || "Invoice not found"}</p>
        <Link to="/" className="text-red-600 hover:underline">Return Home</Link>
    </div>
  );

  const safeTotal = parseFloat(order.totalAmount || order.amount || 0);
  const shippingCost = safeTotal > 499 ? 0 : 40;
  const subtotal = safeTotal - shippingCost;

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 flex justify-center font-sans text-slate-800">
      <div className="bg-white w-full max-w-2xl shadow-2xl p-8 md:p-12 relative h-fit rounded-lg animate-fade-in-up">
        
        {/* 🟢 Notification Banner */}
        {hasDownloaded && (
            <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-xs font-bold text-center py-2 rounded-t-lg animate-fade-in flex items-center justify-center gap-2">
                <FileCheck size={14} /> Invoice Downloaded Automatically
            </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-stone-200 pb-8 mb-8 gap-6 mt-6">
            <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tighter">INVOICE</h1>
                <p className="text-slate-500 text-sm mt-2 font-bold">WefPro Foods Pvt Ltd.</p>
                <p className="text-slate-500 text-sm">Mahabaleshwar, Maharashtra, 412806</p>
                <p className="text-slate-500 text-sm">GSTIN: 27AABCU9603R1Z</p>
            </div>
            <div className="text-left md:text-right">
                <h3 className="font-mono text-xl text-red-600 font-bold">#{order.invoiceId || 'INV-PENDING'}</h3>
                <p className="text-slate-500 text-sm">Date: {new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                <p className="text-slate-500 text-sm mt-1">Order Ref: {order.orderId}</p>
            </div>
        </div>

        {/* Bill To */}
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-8">
            <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Billed To</p>
                <h3 className="font-bold text-lg">{order.customerName}</h3>
                <p className="text-slate-600 w-full md:w-64 text-sm leading-relaxed whitespace-pre-wrap">
                    {order.address || "Address not provided"}
                </p>
                <p className="text-slate-600 text-sm mt-2 font-mono">{order.phoneNumber || order.phone}</p>
            </div>
            <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Payment Method</p>
                <p className="font-bold flex items-center md:justify-end gap-2 text-green-600">
                    <CheckCircle size={14} /> Prepaid (Online)
                </p>
                <p className="text-slate-400 text-xs mt-1">Status: {order.status}</p>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left mb-12 min-w-[500px]">
                <thead className="bg-stone-50 text-slate-500 text-xs uppercase">
                    <tr>
                        <th className="p-4 rounded-l-lg">Item</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right rounded-r-lg">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                    {(order.items || []).map((item, index) => (
                        <tr key={index}>
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4 text-center">{item.quantity || item.qty}</td>
                            <td className="p-4 text-right">₹{item.price}</td>
                            <td className="p-4 text-right">₹{item.price * (item.quantity || item.qty)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Total */}
        <div className="flex justify-end border-t border-slate-900 pt-6">
            <div className="text-right space-y-2 w-full md:w-64">
                <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t border-slate-200 pt-4 mt-2">
                    <span>Total</span>
                    <span>₹{safeTotal}</span>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-dashed border-stone-300 text-center text-xs text-slate-400">
            <p>This is a computer-generated invoice. No signature required.</p>
            <p className="mt-1">Thank you for choosing WefPro.</p>
        </div>

        {/* Buttons (Manual fallback) */}
        <div className="fixed top-6 right-6 md:top-8 md:right-8 flex flex-col gap-3 print:hidden z-50">
            <button 
                onClick={() => downloadInvoice(order)} 
                className="bg-slate-900 text-white p-4 rounded-full shadow-xl hover:bg-red-600 transition flex items-center justify-center group"
                title="Download Again"
            >
               <Download size={20} className="group-hover:scale-110 transition" />
            </button>
            <Link to="/" className="bg-white text-slate-900 p-4 rounded-full shadow-xl hover:bg-slate-50 transition flex items-center justify-center border border-slate-200">
                <ArrowLeft size={20} />
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Invoice;