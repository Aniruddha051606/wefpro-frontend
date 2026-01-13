import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, ArrowLeft, CheckCircle, Download, FileCheck } from 'lucide-react';
import { downloadInvoice } from '../utils/generateInvoice';

const InvoiceSkeleton = () => (
  <div className="min-h-screen bg-stone-100 p-4 md:p-8 flex justify-center font-sans">
    <div className="bg-white w-full max-w-2xl shadow-sm p-8 md:p-12 rounded-lg border border-stone-200">
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between"><div className="h-8 w-32 bg-stone-200 rounded"></div><div className="h-8 w-24 bg-stone-200 rounded"></div></div>
        <div className="space-y-2"><div className="h-4 w-full bg-stone-100 rounded"></div><div className="h-4 w-2/3 bg-stone-100 rounded"></div></div>
      </div>
    </div>
  </div>
);

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/track?orderId=${id}`);
        const data = await response.json();
        if (response.ok && data.success) setOrder(data.data);
        else {
            const local = JSON.parse(localStorage.getItem("wefpro_orders") || "[]");
            const found = local.find(o => o.orderId === id || o.invoiceId === id);
            if(found) setOrder(found); else setError("Invoice not found.");
        }
      } catch (err) { setError("Could not retrieve invoice."); } finally { setLoading(false); }
    };
    if (id) fetchInvoice();
  }, [id]);

  useEffect(() => {
    if (order && !hasDownloaded) {
      const timer = setTimeout(() => { downloadInvoice(order); setHasDownloaded(true); }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [order, hasDownloaded]);

  if (loading) return <InvoiceSkeleton />;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{error || "Not found"}</div>;

  const subtotal = (order.totalAmount || order.amount) - ((order.totalAmount || order.amount) > 499 ? 0 : 40);

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 flex justify-center font-sans text-slate-800">
      <div className="bg-white w-full max-w-2xl shadow-2xl p-8 md:p-12 relative h-fit rounded-lg">
        {hasDownloaded && <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-xs font-bold text-center py-2 rounded-t-lg flex items-center justify-center gap-2"><FileCheck size={14} /> Auto-Downloaded</div>}
        
        <div className="flex justify-between items-start border-b border-stone-200 pb-8 mb-8 mt-6">
            <div><h1 className="text-4xl font-serif font-bold text-slate-900">INVOICE</h1><p className="text-slate-500 text-sm mt-2">WefPro Foods Pvt Ltd.</p></div>
            <div className="text-right"><h3 className="font-mono text-xl text-red-600 font-bold">#{order.invoiceId}</h3></div>
        </div>

        <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Billed To</p>
            <h3 className="font-bold text-lg">{order.customerName}</h3>
            <p className="text-slate-600 text-sm whitespace-pre-wrap">{order.address}</p>
        </div>

        <div className="flex justify-end border-t border-slate-900 pt-6">
            <div className="text-right w-64 space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-2xl font-bold border-t pt-4"><span>Total</span><span>₹{order.totalAmount}</span></div>
            </div>
        </div>

        <div className="fixed top-6 right-6 flex flex-col gap-3 print:hidden z-50">
            <button onClick={() => downloadInvoice(order)} className="bg-slate-900 text-white p-4 rounded-full shadow-xl hover:bg-red-600 transition"><Download size={20} /></button>
            <Link to="/" className="bg-white text-slate-900 p-4 rounded-full shadow-xl hover:bg-slate-50 transition border border-slate-200"><ArrowLeft size={20} /></Link>
        </div>
      </div>
    </div>
  );
};
export default Invoice;