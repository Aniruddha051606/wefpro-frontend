import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Download, 
  LogOut, 
  Save, 
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [price, setPrice] = useState(249); 
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // AUTH CHECK & LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("wefpro_admin_key");
    navigate("/login"); 
  };

  // FETCH DATA
  const fetchData = () => {
    const storedOrders = localStorage.getItem("wefpro_orders");
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedPrice = localStorage.getItem("wefpro_product_price");
    if (storedPrice) setPrice(parseInt(storedPrice));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SAVE PRICE
  const handleUpdatePrice = () => {
    setIsSaving(true);
    localStorage.setItem("wefpro_product_price", price);
    setTimeout(() => setIsSaving(false), 800);
  };

  // UPDATE ORDER STATUS
  const updateStatus = (orderId, newStatus) => {
    const updatedList = orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedList);
    localStorage.setItem("wefpro_orders", JSON.stringify(updatedList));
  };

  // DOWNLOAD CSV REPORT
  const downloadReport = () => {
    const headers = ["Order ID, Date, Customer, Status, Amount\n"];
    const rows = orders.map(o => `${o.orderId}, ${o.date || 'N/A'}, ${o.customerName}, ${o.status}, ${o.amount}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wefpro_sales_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CALCULATE STATS
  const totalRevenue = orders.reduce((acc, curr) => acc + parseInt(curr.amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      
      {/* 1. SIDEBAR (Professional Look) */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-8 border-b border-slate-800">
            <h1 className="text-2xl font-serif font-bold tracking-tighter">WEFPRO <span className="text-red-500">.</span></h1>
            <p className="text-slate-500 text-xs mt-1">Backoffice v1.0</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <div className="flex items-center gap-3 bg-red-600 text-white p-3 rounded-lg font-medium cursor-pointer">
                <LayoutDashboard size={20} /> Dashboard
            </div>
            {/* These are visual placeholders for future features */}
            <div className="flex items-center gap-3 text-slate-400 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition">
                <Package size={20} /> Inventory
            </div>
            <div className="flex items-center gap-3 text-slate-400 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition">
                <TrendingUp size={20} /> Analytics
            </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition w-full">
                <LogOut size={18} /> Sign Out
            </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, Owner.</p>
            </div>
            <button 
                onClick={downloadReport}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-2 font-medium transition"
            >
                <Download size={18} /> Export Data
            </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                        <h3 className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign size={24}/></div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                        <h3 className="text-3xl font-bold mt-2">{orders.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={24}/></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Pending Shipment</p>
                        <h3 className="text-3xl font-bold mt-2">{pendingOrders}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Clock size={24}/></div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: ORDER TABLE */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase">
                            <tr>
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono text-slate-600">{order.orderId}</td>
                                    <td className="p-4 font-medium">{order.customerName}</td>
                                    <td className="p-4">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.orderId, e.target.value)}
                                            className={`px-2 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none
                                                ${order.status === 'Processing' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                                                ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                            `}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right font-medium">₹{order.amount}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No orders yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT COLUMN: PRICE CONTROL */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-fit">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg">Product Management</h3>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Price (INR)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                            <input 
                                type="number" 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleUpdatePrice}
                        className={`w-full py-2.5 rounded-lg font-bold text-white flex justify-center items-center gap-2 transition
                            ${isSaving ? 'bg-green-600' : 'bg-slate-900 hover:bg-black'}
                        `}
                    >
                        {isSaving ? <CheckCircle size={18}/> : <Save size={18}/>}
                        {isSaving ? "Price Updated" : "Save Changes"}
                    </button>
                    <p className="text-xs text-slate-400 mt-4 text-center">
                        Changes reflect immediately on the storefront.
                    </p>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default Admin;