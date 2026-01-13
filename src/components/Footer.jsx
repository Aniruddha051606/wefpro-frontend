import React, { useState } from 'react'; // Add useState
import { Link } from 'react-router-dom'; // Use Link for faster navigation

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = async () => {
    if(!email) return;
    setStatus('Subscribing...');
    await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email })
    });
    setStatus('Subscribed! 🍓');
    setEmail('');
  };

  return (
    <footer className="bg-black text-stone-500 py-12 px-6 border-t border-stone-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h4 className="text-white font-serif text-xl mb-4">WEFPRO</h4>
          <p className="text-sm">FSSAI License: 215XXXXXXXXXXX</p>
          <p className="text-sm mt-2">Panchgani-Mahabaleshwar, Maharashtra</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-white text-xs font-bold uppercase">Legal</h5>
            <Link to="/privacy" className="block text-xs hover:text-red-500">Privacy Policy</Link>
            <Link to="/terms" className="block text-xs hover:text-red-500">Terms of Service</Link>
            <Link to="/refund" className="block text-xs hover:text-red-500">Refund Policy</Link>
          </div>
          <div className="space-y-2">
            <h5 className="text-white text-xs font-bold uppercase">Support</h5>
            <Link to="/contact" className="block text-xs hover:text-red-500">Contact Us</Link>
            <Link to="/shipping" className="block text-xs hover:text-red-500">Shipping Policy</Link>
          </div>
        </div>
        <div className="text-sm">
          <h5 className="text-white text-xs font-bold uppercase mb-4">Join the Family</h5>
          <div className="flex gap-2">
             <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-stone-900 p-2 rounded w-full border border-stone-800 outline-none focus:border-red-600 transition" 
             />
             <button onClick={handleSubscribe} className="bg-red-600 text-white px-4 rounded font-bold hover:bg-red-700">
                {status || 'Go'}
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;