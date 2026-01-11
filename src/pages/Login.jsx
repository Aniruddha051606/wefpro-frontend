import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
        // Ask the Server: "Are these credentials correct?"
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Server said YES. Save the key.
            localStorage.setItem("authToken", data.token);
            navigate("/admin");
        } else {
            // Server said NO.
            setError(data.message);
        }
    } catch (err) {
        setError("Cannot connect to Login Server.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">Wefpro<span className="text-stone-800">.</span></h1>
          <p className="text-stone-500 mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-stone-400" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-stone-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg"
          >
            Access Dashboard
          </button>
        </form>
        
        <p className="text-center text-xs text-stone-400 mt-6">
          Secured by Wefpro Internal Systems v1.0
        </p>

      </div>
    </div>
  );
};

export default Login;