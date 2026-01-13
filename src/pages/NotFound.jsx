import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-center px-4 font-sans text-white">
    <h1 className="text-9xl font-serif text-red-600 mb-4 font-bold">404</h1>
    <p className="text-stone-400 text-xl mb-8">Oops! This jar is empty.</p>
    <Link to="/" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-red-600 hover:text-white transition duration-300">
        Return to Shop
    </Link>
  </div>
);

export default NotFound;
