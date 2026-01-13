import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, CheckCircle } from 'lucide-react';

const Invoice = () => {
  const { id } = useParams(); // This is the Order ID passed from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // 1. Try to get order from the Server (Public API)
        const response = await fetch(`/api/track?orderId=${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setOrder(data.data);
        } else {
          // 2. Fallback: Try Local Storage (For Admins or recent checkout)
          const allOrders = JSON.parse(localStorage.getItem("wefpro_orders") || "[]");
          // Check both OrderID and InvoiceID to be safe
          const found = allOrders.find(o => o.orderId === id || o.invoiceId === id);
          
          if (found) {
            setOrder(found);
          } else {
            setError("Invoice not found.");
          }
        }
      } catch (err) {
        console.error("Invoice Load Error:", err);
        setError("Could not load invoice.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInvoice();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans text-stone-500 animate-pulse">Generating Invoice...</div>;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center font-sans text-red-500 font-bold">{error || "Invoice not found"}</div>;

  // Helper to ensure numbers don't crash
  const safeTotal = parseFloat(order.totalAmount || order.amount || 0);
  const shippingCost = safeTotal > 499 ? 0 : 40;
  const subtotal = safeTotal - shippingCost;

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 flex justify-center font-sans text-slate-800">
      <div className="bg-white w-full max-w-2xl shadow-2xl p-8 md:p-12 relative h-fit rounded-lg">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-stone-200 pb-8 mb-8 gap-6">
            <div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tighter">INVOICE</h1>
                <p className="text-slate-500 text-sm mt-2 font-bold">WefPro Foods Pvt Ltd.</p>
                <p className="text-slate-500 text-sm">Mahabaleshwar, Maharashtra, 412806</p>
                <p className="text-slate-500 text-sm">GSTIN: 27AABCU9603R1Z</p>
            </div>
            <div className="text-left md:text-right">
                <h3 className="font-mono text-xl text-red-600 font-bold">#{order.invoiceId || 'PENDING'}</h3>
                <p className="text-slate-500 text-sm">Date: {new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                <p className="text-slate-500 text-sm mt-1">Order Ref: {order.orderId}</p>
            </div>
        </div>

        {/* Bill To */}
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-8">
            <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Billed To</p>
                <h3 className="font-bold text-lg">{order.customerName}</h3>
                <p className="text-slate-600 w-full md:w-64 text-sm leading-relaxed">
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
                    {order.items && order.items.map((item, index) => (
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

        {/* Print Button */}
        <div className="fixed top-6 right-6 md:top-8 md:right-8 flex flex-col gap-4 print:hidden z-50">
            <button onClick={() => window.print()} className="bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition flex items-center justify-center">
                <Printer size={20} />
            </button>
            <Link to="/" className="bg-white text-slate-900 p-4 rounded-full shadow-xl hover:scale-110 transition flex items-center justify-center">
                <ArrowLeft size={20} />
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Invoice;