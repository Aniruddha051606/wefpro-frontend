import React, { useState, useRef, useEffect } from 'react';
import { Barcode, Truck, Printer, AlertTriangle } from 'lucide-react';

const Dispatch = () => {
  const [scanInput, setScanInput] = useState('');
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Keep focus on the input box so the scanner always works
  useEffect(() => {
    const interval = setInterval(() => inputRef.current?.focus(), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = async (e) => {
    if (e.key === 'Enter') {
      const orderId = scanInput.trim();
      setScanInput('');
      if (!orderId) return;

      processDispatch(orderId);
    }
  };

  const processDispatch = async (id) => {
    setLoading(true);
    addToLog(id, "Processing...", "pending");

    try {
      // 1. Call Ship API
      const res = await fetch('/api/ship', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ orderId: id })
      });
      const data = await res.json();

      if (data.success) {
        updateLog(id, `Shipped! AWB: ${data.awb}`, "success");
        
        // 2. Automatically Open Label to Print
        window.open(`/api/label?awb=${data.awb}`, '_blank');
      } else {
        updateLog(id, `Error: ${data.error}`, "error");
      }
    } catch (err) {
      updateLog(id, "Network Error", "error");
    }
    setLoading(false);
  };

  const addToLog = (id, msg, status) => {
    setLog(prev => [{ id, msg, status, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const updateLog = (id, msg, status) => {
    setLog(prev => prev.map(item => item.id === id ? { ...item, msg, status } : item));
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      <div className="max-w-4xl mx-auto border-2 border-green-800 rounded-lg p-2 bg-green-900/10">
        
        <div className="flex justify-between items-center mb-8 p-4 border-b border-green-800">
            <h1 className="text-2xl font-bold flex items-center gap-3">
                <Barcode size={32} /> WEFPRO DISPATCH TERMINAL
            </h1>
            <div className="flex items-center gap-2 text-xs uppercase">
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                {loading ? "BUSY" : "READY"}
            </div>
        </div>

        <div className="mb-8 relative">
            <input 
                ref={inputRef}
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={handleScan}
                placeholder="SCAN BARCODE >"
                className="w-full bg-black border border-green-600 p-6 text-3xl outline-none focus:border-green-400 focus:shadow-[0_0_20px_rgba(74,222,128,0.5)] placeholder-green-800 rounded text-center"
                autoFocus
            />
        </div>

        <div className="space-y-2">
            <h3 className="text-sm text-green-600 mb-4 border-b border-green-800 pb-2">TRANSACTION LOG</h3>
            {log.map((entry, i) => (
                <div key={i} className={`flex justify-between items-center p-3 rounded border ${
                    entry.status === 'success' ? 'bg-green-900/20 border-green-800' : 
                    entry.status === 'error' ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-transparent border-green-900 text-green-600'
                }`}>
                    <div className="flex items-center gap-4">
                        <span className="text-xs opacity-50">{entry.time}</span>
                        <span className="font-bold tracking-widest">{entry.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{entry.msg}</span>
                        {entry.status === 'success' && <Printer size={16} />}
                        {entry.status === 'error' && <AlertTriangle size={16} />}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dispatch;