import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { parse } from 'cookie'; // <--- NEW IMPORT

// 🛡️ ROBUST AUTH CHECK
const isAuthenticated = (req) => {
  // Parse the cookie header into a real object
  const cookies = parse(req.headers.cookie || '');
  // Check if the token matches your secret exactly
  return cookies.admin_token === process.env.JWT_SECRET;
};

// 🧼 SANITIZATION
const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[^\w\s@.-]/gi, '').trim(); 
};

export default async function handler(req, res) {
  await dbConnect();

  // GET: Fetch all (Admin Only)
  if (req.method === 'GET') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // POST: Create Order (Public)
  if (req.method === 'POST') {
    try {
      const { customerName, phone, items, orderId, awb } = req.body;

      const Config = mongoose.models.Config || mongoose.model('Config', new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }));
      const priceConfig = await Config.findOne({ key: 'product_price' });
      const realPrice = priceConfig?.value || 249;

      let calculatedTotal = 0;
      const cleanItems = items.map(item => {
        const qty = item.quantity || item.qty || 1;
        calculatedTotal += realPrice * qty;
        return { name: item.name, price: realPrice, quantity: qty };
      });

      if (calculatedTotal < 499) calculatedTotal += 40;

      const newOrder = await Order.create({
        customerName: sanitize(customerName),
        phoneNumber: sanitize(phone),
        items: cleanItems,
        totalAmount: calculatedTotal,
        trackingId: awb,
        status: "Shipped",
        orderId: orderId
      });

      try {
        const purePhone = phone.replace(/\D/g, '').replace(/^91/, ''); 
        await axios.post('https://api.interakt.ai/v1/public/message/', {
          countryCode: "+91",
          phoneNumber: purePhone,
          type: "Template",
          template: { name: "order_confirmed_01", languageCode: "en", bodyValues: [sanitize(customerName), orderId] }
        }, { headers: { 'Authorization': `Basic ${process.env.INTERAKT_API_KEY}` } });
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
        const updatedOrder = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
        return res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        return res.status(500).json({ error: "Update failed" });
    }
  }

  return res.status(405).end();
}