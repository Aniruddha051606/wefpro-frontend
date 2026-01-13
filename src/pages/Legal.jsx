import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

// 1. Layout Component
const LegalLayout = ({ title, content }) => (
  <div className="bg-white min-h-screen text-stone-800 font-sans">
    <nav className="p-6 border-b border-stone-100 flex justify-between items-center">
      <Link to="/" className="font-serif font-bold text-xl tracking-tighter">WEFPRO</Link>
      <Link to="/" className="text-sm text-stone-500 hover:text-red-600">Back to Shop</Link>
    </nav>
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-serif font-bold mb-8 text-black">{title}</h1>
      <div className="prose prose-stone prose-lg">{content}</div>
    </div>
    <Footer />
  </div>
);

// 2. Exported Page Components
export const Privacy = () => (
  <LegalLayout title="Privacy Policy" content={
    <div className="space-y-6">
      <p><strong>Last Updated: January 2026</strong></p>
      <p>At WefPro, we take your privacy seriously. We collect only the information necessary to process your order.</p>
    </div>
  } />
);

export const Terms = () => (
  <LegalLayout title="Terms of Service" content={
    <div className="space-y-6">
      <p>Welcome to WefPro. By accessing our website, you agree that our jams are handcrafted and may vary slightly in texture.</p>
    </div>
  } />
);

export const Refund = () => (
  <LegalLayout title="Refund Policy" content={
    <div className="space-y-6">
      <p>If your jar arrives broken, send us a photo via WhatsApp within 24 hours for a free replacement.</p>
    </div>
  } />
);