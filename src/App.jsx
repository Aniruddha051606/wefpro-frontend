import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; // <--- NEW PAGE
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // 1. LOAD CART FROM STORAGE (Real User Memory)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("wefpro_cart");
    return saved ? JSON.parse(saved) : []; // Start EMPTY if nothing saved
  });

  // 2. SAVE ON EVERY CHANGE
  useEffect(() => {
    localStorage.setItem("wefpro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total items for Badge
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Router>
      <div className="bg-black min-h-screen text-stone-100 font-sans selection:bg-red-900 selection:text-white">
        <Navbar cartCount={totalItems} /> 
        
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} />} />
          <Route path="/track" element={<Tracking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;