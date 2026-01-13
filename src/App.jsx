import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// COMPONENTS
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// PAGES
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Invoice from './pages/Invoice';
import NotFound from './pages/NotFound';
import { Privacy, Terms, Refund } from './pages/Legal';

// HELPER: Main Content Wrapper
const AppContent = () => {
  const location = useLocation();
  
  // Cart State with LocalStorage Persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("wefpro_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("wefpro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart Actions
  const addToCart = (product) => {
    setCartItems(prev => {
      const exist = prev.find(x => x.id === product.id);
      if (exist) {
        return prev.map(x => x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCartItems(prev => {
      const exist = prev.find(x => x.id === product.id);
      if (exist.qty === 1) return prev.filter(x => x.id !== product.id);
      return prev.map(x => x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x);
    });
  };

  const clearCart = () => setCartItems([]);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Hide Navbar on Admin/Login pages
  const isNoNavRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="bg-black min-h-screen text-stone-100 font-sans selection:bg-red-900 selection:text-white">
      {!isNoNavRoute && <Navbar cartCount={totalItems} />}
      
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
        <Route path="/track" element={<Tracking />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        
        {/* Utility Routes */}
        <Route path="/invoice/:id" element={<Invoice />} />
        
        {/* Legal Routes */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}