import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, RefreshCcw, Truck, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Destroy the Key
    navigate("/login"); // Kick to login screen
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    setLoading(false);
  };

  // ⚡ NEW FUNCTION: Update Status
  const updateStatus = async (orderId, newStatus) => {
    try {
        await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        // Refresh the table to show changes
        fetchOrders(); 
    } catch (error) {
        alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Wefpro <span className="text-red-600">Admin</span></h1>
          <div className="flex space-x-4">
            <button 
                onClick={handleLogout}
                className="bg-white px-4 py-2 rounded-lg shadow-sm font-medium text-stone-600 hover:text-red-600 border border-stone-200"
            >
                Logout
            </button>
            <button 
                onClick={fetchOrders} 
                className="bg-white px-4 py-2 rounded-lg shadow-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            >
                <RefreshCcw size={18} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Package /></div>
                <div><p className="text-sm text-stone-500">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
            </div>
            {/* Add more stats here if needed */}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex justify-between">
            <h2 className="text-lg font-bold text-stone-800">Order Management</h2>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-stone-500 text-sm uppercase">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-stone-50 transition">
                  <td className="p-4 font-bold text-stone-800">{order.orderId}</td>
                  <td className="p-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-stone-400">Paid: ₹{order.amount}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border
                      ${order.status === 'Processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                      ${order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {/* STATUS CHANGING DROPDOWN */}
                    <select 
                        className="p-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                        value={order.status}
                        onChange={(e) => updateStatus(order.orderId, e.target.value)}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Admin;