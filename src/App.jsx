import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

function App() {
  // 1. LOAD CART FROM MEMORY (So it survives refresh)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("wefpro_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. SAVE CART TO MEMORY (Whenever it changes)
  useEffect(() => {
    localStorage.setItem("wefpro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🛒 ADD TO CART (With Price Auto-Update)
  const addToCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    
    if (exist) {
      // If item exists, UPDATE QUANTITY AND PRICE (In case Admin changed price)
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id 
            ? { ...exist, qty: exist.qty + 1, price: product.price } // <--- Force Price Update
            : x
        )
      );
    } else {
      // Add new item
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  // ➖ DECREASE QUANTITY
  const removeFromCart = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };

  // 🗑️ CLEAR CART (Used after checkout)
  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Router>
      {/* GLOBAL DARK THEME */}
      <div className="bg-black min-h-screen text-stone-100 font-sans selection:bg-red-900 selection:text-white">
        
        <Navbar cartCount={totalItems} /> 
        
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          
          <Route 
            path="/cart" 
            element={<Cart cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} />} 
          />
          
          {/* Pass clearCart so checkout can empty the cart on success */}
          <Route 
            path="/checkout" 
            element={<Checkout cartItems={cartItems} clearCart={clearCart} />} 
          />
          
          <Route path="/track" element={<Tracking />} />
          
          {/* ADMIN & SECURITY */}
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