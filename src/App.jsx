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

// 1. HELPER COMPONENT TO HIDE NAVBAR ON ADMIN PAGES
const AppContent = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("wefpro_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("wefpro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      setCartItems(cartItems.map((x) => x.id === product.id ? { ...exist, qty: exist.qty + 1, price: product.price } : x));
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(cartItems.map((x) => x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x));
    }
  };

  const clearCart = () => setCartItems([]);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // 🕵️‍♂️ CHECK: ARE WE ON AN ADMIN PAGE?
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="bg-black min-h-screen text-stone-100 font-sans selection:bg-red-900 selection:text-white">
      
      {/* 2. ONLY SHOW NAVBAR IF NOT ADMIN */}
      {!isAdminRoute && <Navbar cartCount={totalItems} />} 
      
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
        <Route path="/track" element={<Tracking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/invoice/:id" element={<Invoice />} />
      </Routes>
    </div>
  );
};

// 3. MAIN WRAPPER
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;