import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 🔐 THE SECRET CODES
    if (passcode === "admin2026" || passcode === "dev_master") {
        // Save the "Key" to browser memory
        // ⚠️ MUST MATCH THE KEY IN ADMIN.JSX
        localStorage.setItem("wefpro_admin_key", "true");
        
        // Go to Admin Dashboard
        navigate("/admin");
    } else {
        setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 w-full max-w-md shadow-2xl">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-serif text-white">WefPro Admin</h1>
            <p className="text-stone-500 text-sm mt-2">Restricted Access. Authorized Personnel Only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <input 
                    type="password" 
                    placeholder="Enter Security Passcode" 
                    value={passcode}
                    onChange={(e) => { setPasscode(e.target.value); setError(false); }}
                    className="w-full bg-black border border-stone-700 p-4 rounded-lg text-white text-center tracking-widest text-xl focus:outline-none focus:border-red-500 transition"
                />
                {error && <p className="text-red-500 text-xs text-center mt-2 animate-pulse">Access Denied: Invalid Passcode</p>}
            </div>

            <button 
                type="submit" 
                className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2"
            >
                Access Dashboard <ArrowRight size={18} />
            </button>
        </form>

        <p className="text-center text-stone-700 text-xs mt-8">
            System ID: 839-201-X • Secure Connection
        </p>

      </div>
    </div>
  );
};

export default Login;