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
// ... inside App function ...

  // ⚡ NEW: Handle + and - inside the cart
  const updateQty = (id, amount) => {
    setCartItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + amount;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      })
    );
  };

  // ... keep existing return ...
  
  // ⚡ UPDATE THE ROUTE TO PASS THIS NEW FUNCTION
  return (
    <Router>
       {/* ... navbar ... */}
       <Routes>
          {/* ... other routes ... */}
          
          <Route 
            path="/cart" 
            element={
              <Cart 
                cartItems={cartItems} 
                removeFromCart={removeFromCart} 
                updateQty={updateQty} // <--- PASS THIS PROP
              />
            } 
          />
          
          {/* ... other routes ... */}
       </Routes>
    </Router>
  );
}

export default App;