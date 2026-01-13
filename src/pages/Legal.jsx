import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

const LegalLayout = ({ title, content }) => (
  <div className="bg-white min-h-screen text-stone-800">
    <SEO title={title} description={`Read our ${title}`} />
    <Navbar cartCount={0} />
    <div className="max-w-3xl mx-auto px-6 py-32">
      <h1 className="text-4xl font-serif font-bold mb-8">{title}</h1>
      <div className="prose prose-stone">
        {content}
      </div>
    </div>
    <Footer />
  </div>
);

export const Privacy = () => (
  <LegalLayout title="Privacy Policy" content={
    <div className="space-y-4">
      <p><strong>Last Updated: January 2026</strong></p>
      <p>At WefPro, we respect your privacy. We only collect information necessary to process your order (Name, Address, Phone).</p>
      <h3>1. Data Collection</h3>
      <p>We do not sell your data. Your phone number is used strictly for order updates via WhatsApp.</p>
      <h3>2. Cookies</h3>
      <p>We use secure cookies to keep you logged in and remember your cart.</p>
    </div>
  } />
);

export const Terms = () => (
  <LegalLayout title="Terms of Service" content={
    <div className="space-y-4">
      <p>By using WefPro.com, you agree to the following terms.</p>
      <h3>1. Products</h3>
      <p>Our jams are handcrafted. Minor variations in color or texture are natural and proof of authenticity.</p>
      <h3>2. Pricing</h3>
      <p>Prices are subject to change without notice. We reserve the right to cancel orders with pricing errors.</p>
    </div>
  } />
);

export const Refund = () => (
  <LegalLayout title="Refund Policy" content={
    <div className="space-y-4">
      <p><strong>No-Questions-Asked Replacement</strong></p>
      <p>If your jar arrives broken or unsealed, send us a photo on WhatsApp within 24 hours for a free replacement.</p>
      <p>Due to the nature of food products, we cannot accept returns for taste preferences.</p>
    </div>
  } />
);