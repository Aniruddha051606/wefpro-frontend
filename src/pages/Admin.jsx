import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, DollarSign, Download, LogOut, CheckCircle, Clock, Truck, Eye, X, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [price, setPrice] = useState(249); 
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("wefpro_admin_key");
    navigate("/login"); 
  };

  const fetchData = () => {
    const storedOrders = localStorage.getItem("wefpro_orders");
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedPrice = localStorage.getItem("wefpro_product_price");
    if (storedPrice) setPrice(parseInt(storedPrice));
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdatePrice = () => {
    setIsSaving(true);
    localStorage.setItem("wefpro_product_price", price);
    setTimeout(() => setIsSaving(false), 800);
  };

  const updateStatus = (orderId, newStatus) => {
    const updatedList = orders.map(order => order.orderId === orderId ? { ...order, status: newStatus } : order);
    setOrders(updatedList);
    localStorage.setItem("wefpro_orders", JSON.stringify(updatedList));
  };

  const downloadReport = () => {
    const headers = ["Order ID, Invoice ID, Date, Customer, Status, Amount\n"];
    const rows = orders.map(o => `${o.orderId}, ${o.invoiceId}, ${o.date}, ${o.customerName}, ${o.status}, ${o.amount}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `wefpro_sales_${Date.now()}.csv`;
    link.click();
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + parseInt(curr.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex relative">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-800">
            <h1 className="text-2xl font-serif font-bold tracking-tighter">WEFPRO <span className="text-red-500">.</span></h1>
            <p className="text-slate-500 text-xs mt-1">Backoffice v1.2</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <div className="flex items-center gap-3 bg-red-600 text-white p-3 rounded-lg font-medium"><LayoutDashboard size={20} /> Dashboard</div>
            <div className="flex items-center gap-3 text-slate-400 p-3 rounded-lg hover:bg-slate-800 cursor-pointer"><Package size={20} /> Inventory</div>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white w-full"><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <button onClick={downloadReport} className="bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium">
                <Download size={16} /> Export Data
            </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                <div><p className="text-slate-500 text-sm">Revenue</p><h3 className="text-3xl font-bold mt-1">₹{totalRevenue}</h3></div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg h-fit"><DollarSign size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                <div><p className="text-slate-500 text-sm">Orders</p><h3 className="text-3xl font-bold mt-1">{orders.length}</h3></div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg h-fit"><Package size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                <div><p className="text-slate-500 text-sm">Pending</p><h3 className="text-3xl font-bold mt-1">{pendingOrders}</h3></div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg h-fit"><Clock size={24}/></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ORDER TABLE */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100"><h3 className="font-bold">Recent Orders</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Documents</th> {/* NEW COLUMN */}
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono text-slate-600">{order.orderId}</td>
                                    <td className="p-4 font-medium">{order.customerName}</td>
                                    
                                    {/* 📄 DOCUMENTS LINKAGE COLUMN */}
                                    <td className="p-4">
                                        {/* INVOICE LINK */}
                                        <div className="mb-2">
                                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Invoice</span>
                                            <a href={`/invoice/${order.invoiceId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono text-xs font-bold">
                                                {order.invoiceId}
                                            </a>
                                        </div>
                                        {/* AWB DISPLAY */}
                                        <div>
                                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Delhivery AWB</span>
                                            {order.awb ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono text-xs">{order.awb}</span>
                                                    <CheckCircle size={12} className="text-green-500" />
                                                </div>
                                            ) : (
                                                <span className="text-orange-400 text-xs italic">Processing...</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-4 text-right">
                                        <button onClick={() => setSelectedOrder(order)} className="text-slate-400 hover:text-blue-600 transition" title="View Details">
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PRICE CONTROL */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-fit p-6">
                <h3 className="font-bold mb-4">Set Price</h3>
                <div className="relative mb-4">
                    <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full pl-8 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <button onClick={handleUpdatePrice} className={`w-full py-2 rounded-lg font-bold text-white flex justify-center gap-2 ${isSaving ? 'bg-green-600' : 'bg-slate-900'}`}>
                    {isSaving ? "Saved!" : "Update Price"}
                </button>
            </div>
        </div>
      </main>

      {/* POPUP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Order Details</h3>
                    <button onClick={() => setSelectedOrder(null)}><X size={20}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-slate-100 p-3 rounded-full"><Package size={24} className="text-slate-600"/></div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase tracking-widest">Customer</p>
                            <p className="font-bold text-lg">{selectedOrder.customerName}</p>
                            <p className="text-slate-600 flex items-center gap-2 mt-1"><Phone size={14}/> {selectedOrder.phone}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14}/> Shipping Address</p>
                        <p className="text-slate-800 font-medium">{selectedOrder.address}<br/>{selectedOrder.city} - {selectedOrder.pincode}</p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
                        <span>Total Amount</span><span>₹{selectedOrder.amount}</span>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Close Details</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;