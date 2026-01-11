import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <--- Import Navbar
import Home from './pages/Home';
import Cart from './pages/Cart';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // We manage cart count here to show it in the Navbar
  const [cartCount, setCartCount] = useState(2); // Starting with 2 for demo

  return (
    <Router>
      <div className="bg-stone-50 min-h-screen">
        {/* ⚡ Navbar sits OUTSIDE Routes so it stays visible */}
        <Navbar cartCount={cartCount} /> 
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/track" element={<Tracking />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;