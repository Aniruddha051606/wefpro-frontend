import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { parse } from 'cookie';

// 🛡️ AUTH CHECK (Robust)
const isAuthenticated = (req) => {
  const cookies = parse(req.headers.cookie || '');
  return cookies.admin_token === process.env.JWT_SECRET;
};

// 🧼 SANITIZATION (Safe Inputs)
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[^\w\s@.,#\/-]/gi, '').trim(); 
};

export default async function handler(req, res) {
  await dbConnect();

  // GET: Fetch all (Admin Only) - Optimized for Speed ⚡
  if (req.method === 'GET') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });
    try {
      // ⚡ PERFORMANCE: .lean() returns plain JSON (2x faster)
      // ⚡ LIMIT: Restrict to last 200 orders to prevent crashing on large datasets
      const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(200) 
        .lean(); 
        
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Fetch Error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // POST: Create Order (Public)
  if (req.method === 'POST') {
    try {
      const { customerName, phone, items, orderId, awb, address, invoiceId } = req.body;

      // 1. Fetch REAL Price from DB (Security: Ignore frontend price)
      const Config = mongoose.models.Config || mongoose.model('Config', new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }));
      const priceConfig = await Config.findOne({ key: 'product_price' });
      const realPrice = priceConfig?.value || 249;

      // 2. Recalculate Total
      let calculatedTotal = 0;
      const cleanItems = items.map(item => {
        const qty = item.quantity || item.qty || 1;
        calculatedTotal += realPrice * qty;
        return { name: item.name, price: realPrice, quantity: qty };
      });

      // 3. Apply Shipping Rule
      if (calculatedTotal < 499) calculatedTotal += 40;

      // 4. Save Order
      const newOrder = await Order.create({
        orderId: sanitize(orderId),
        invoiceId: sanitize(invoiceId),
        customerName: sanitize(customerName),
        phoneNumber: sanitize(phone),
        address: sanitize(address),
        items: cleanItems,
        totalAmount: calculatedTotal,
        trackingId: awb,
        
        // 🟢 STATUS LOGIC
        paymentStatus: "Paid",      // 💰 Money received (Prepaid only)
        status: "Processing"        // 📦 Logistics status (Processing -> Shipped)
      });

      // 5. Send WhatsApp (Async - won't block response)
      try {
        const purePhone = phone.replace(/\D/g, '').replace(/^91/, ''); 
        await axios.post('https://api.interakt.ai/v1/public/message/', {
          countryCode: "+91",
          phoneNumber: purePhone,
          type: "Template",
          template: {
            name: "order_confirmed_01",
            languageCode: "en",
            bodyValues: [sanitize(customerName), orderId]
          }
        }, {
          headers: { 'Authorization': `Basic ${process.env.INTERAKT_API_KEY}` }
        });
      } catch (err) { console.warn("WhatsApp notification failed"); }

      return res.status(201).json({ success: true, data: newOrder });

    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // PUT: Update Status (Admin Only)
  if (req.method === 'PUT') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { orderId, status } = req.body;
        
        // Update ONLY the logistics status in MongoDB
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId }, 
            { status }, 
            { new: true }
        );

        return res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        return res.status(500).json({ error: "Update failed" });
    }
  }

  return res.status(405).end();
}