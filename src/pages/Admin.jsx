import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, DollarSign, Download, LogOut, Clock, Eye, X, MapPin, Phone, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { downloadInvoice } from '../utils/generateInvoice';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [price, setPrice] = useState(249);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // Track which order is updating
  const navigate = useNavigate();

  // 1. 🛡️ Safe Logout
  const handleLogout = () => {
    localStorage.removeItem("wefpro_admin_key");
    navigate("/login");
  };

  // 2. ⚡ Live Search Filter
  const filteredOrders = orders.filter(o => 
    (o.customerName?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (o.orderId?.toLowerCase() || "").includes(search.toLowerCase())
  );

  // 3. 🔄 Toggle Status Logic (Call API)
  const handleStatusToggle = async (order) => {
    const statusFlow = { 'Processing': 'Shipped', 'Shipped': 'Delivered', 'Delivered': 'Paid' };
    const nextStatus = statusFlow[order.status] || 'Processing';
    
    setUpdatingId(order.orderId);

    try {
      const res = await fetch('/api/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId, status: nextStatus })
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, status: nextStatus } : o));
      }
    } catch (err) {
      console.error("Status update failed");
    }
    setUpdatingId(null);
  };

  const StatusBadge = ({ order }) => {
    const colors = {
      'Paid': 'bg-green-100 text-green-700 border-green-200',
      'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Shipped': 'bg-blue-100 text-blue-700 border-blue-200',
      'Delivered': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    
    const isLoading = updatingId === order.orderId;

    return (
      <button 
        onClick={() => handleStatusToggle(order)}
        disabled={isLoading}
        className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all hover:scale-105 ${colors[order.status] || colors['Processing']}`}
      >
        {isLoading ? <RefreshCw size={10} className="animate-spin" /> : order.status}
      </button>
    );
  };

  const fetchData = async () => {
    try {
      const priceRes = await fetch('/api/config');
      const priceData = await priceRes.json();
      if (priceData.price) setPrice(priceData.price);

      const ordersRes = await fetch('/api/order');
      
      // 🛡️ Security: Kick user out if session expired
      if (ordersRes.status === 401) {
        handleLogout();
        return;
      }

      const ordersData = await ordersRes.json();
      if (ordersData.success) setOrders(ordersData.data);
      
    } catch (error) {
      console.error("Data Load Error:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdatePrice = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseInt(price) }),
      });
      localStorage.setItem("wefpro_product_price", price);
    } catch (error) { console.error("Price sync failed"); }
    setTimeout(() => setIsSaving(false), 800);
  };

  // 🛡️ Security: Prevent CSV Injection
  const sanitizeCSV = (str) => {
    const val = String(str || "");
    // If value starts with suspicious characters, escape it
    if (/^[=+\-@]/.test(val)) return `'${val}`; 
    return val.replace(/"/g, '""'); // Escape double quotes
  };

  const downloadReport = () => {
    const headers = "Order ID,Date,Customer,Status,Amount,Phone\n";
    const rows = orders.map(o => 
      `"${sanitizeCSV(o.orderId)}","${new Date(o.createdAt).toLocaleDateString()}","${sanitizeCSV(o.customerName)}","${o.status}",${o.totalAmount},"${sanitizeCSV(o.phoneNumber)}"`
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = `wefpro_sales_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Stats
  const totalRevenue = orders.reduce((acc, curr) => acc + (parseInt(curr.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex relative">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-800">
            <h1 className="text-2xl font-serif font-bold tracking-tighter">WEFPRO <span className="text-red-500">.</span></h1>
            <p className="text-slate-500 text-xs mt-1">Backoffice v2.0 (Secure)</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <div className="flex items-center gap-3 bg-red-600 text-white p-3 rounded-lg font-medium"><LayoutDashboard size={20} /> Dashboard</div>
            <div className="flex items-center gap-3 text-slate-400 p-3 rounded-lg hover:bg-slate-800 cursor-pointer"><Package size={20} /> Inventory</div>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white w-full"><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <button onClick={downloadReport} className="bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition">
                <Download size={16} /> Export CSV
            </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                <div><p className="text-slate-500 text-sm">Revenue</p><h3 className="text-3xl font-bold mt-1">₹{totalRevenue.toLocaleString()}</h3></div>
                <div className="p-3 bg-green-50 text-green-600 rounded-lg h-fit"><DollarSign size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                <div><p className="text-slate-500 text-sm">Total Orders</p><h3 className="text-3xl font-bold mt-1">{orders.length}</h3></div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg h-fit"><Package size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                <div><p className="text-slate-500 text-sm">Pending</p><h3 className="text-3xl font-bold mt-1">{pendingOrders}</h3></div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-lg h-fit"><Clock size={24}/></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold">Live Orders</h3>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 w-48 transition"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Invoice</th>
                                <th className="p-4 text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono text-slate-600 text-xs">{order.orderId}</td>
                                    <td className="p-4 font-medium">{order.customerName}</td>
                                    <td className="p-4"><StatusBadge order={order} /></td>
                                    <td className="p-4">
                                        <button onClick={() => downloadInvoice(order)} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1">
                                            <Download size={12}/> PDF
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setSelectedOrder(order)} className="text-slate-400 hover:text-blue-600 transition"><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-slate-400">No orders found matching "{search}"</div>
                    )}
                </div>
            </div>

            {/* Price Control */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-fit p-6">
                <h3 className="font-bold mb-4">Product Price</h3>
                <p className="text-xs text-slate-500 mb-4">Updates will reflect on the storefront immediately.</p>
                <div className="relative mb-4">
                    <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full pl-8 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <button onClick={handleUpdatePrice} className={`w-full py-2 rounded-lg font-bold text-white flex justify-center gap-2 transition ${isSaving ? 'bg-green-600' : 'bg-slate-900 hover:bg-slate-800'}`}>
                    {isSaving ? "Synced!" : "Update Global Price"}
                </button>
            </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100">
                <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Order Details</h3>
                    <button onClick={() => setSelectedOrder(null)} className="hover:rotate-90 transition"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-slate-100 p-3 rounded-full"><Package size={24} className="text-slate-600"/></div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase tracking-widest">Customer</p>
                            <p className="font-bold text-lg">{selectedOrder.customerName}</p>
                            <p className="text-slate-600 flex items-center gap-2 mt-1"><Phone size={14}/> {selectedOrder.phoneNumber}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14}/> Shipping Address</p>
                        <p className="text-slate-800 font-medium text-sm leading-relaxed">
                            {selectedOrder.address || "Address not provided"}
                        </p>
                    </div>
                    
                    {/* Items List */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Items</p>
                        <ul className="space-y-2">
                            {selectedOrder.items?.map((item, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span className="font-mono">₹{item.price * item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
                        <span>Total Amount</span><span>₹{selectedOrder.totalAmount}</span>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">Close</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Admin;