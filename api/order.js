import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import axios from 'axios';

// Helper to check for the Admin Cookie
const isAuthenticated = (req) => {
  const cookie = req.headers.cookie;
  return cookie && cookie.includes(`admin_token=${process.env.JWT_SECRET}`);
};

// Helper to sanitize input (Stop XSS)
const sanitize = (str) => str.replace(/[^\w\s@.-]/gi, ''); 

export default async function handler(req, res) {
  await dbConnect();

  // 🛡️ SECURE GET: Only Admins can see orders
  if (req.method === 'GET') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 🛡️ SECURE POST: Create Order (Price Recalculation)
  if (req.method === 'POST') {
    try {
      const { customerName, phone, items, orderId, awb } = req.body;

      // 1. Fetch REAL Price from Database
      const Config = mongoose.models.Config || mongoose.model('Config', new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }));
      const priceConfig = await Config.findOne({ key: 'product_price' });
      const realPrice = priceConfig?.value || 249; // Default fallback

      // 2. Recalculate Total (Ignore client sent amount)
      let calculatedTotal = 0;
      const cleanItems = items.map(item => {
        calculatedTotal += realPrice * (item.quantity || item.qty || 1);
        return {
          name: item.name,
          price: realPrice, // Force real price
          quantity: item.quantity || item.qty || 1
        };
      });

      // 3. Add Shipping (Simple logic: if > 499 free, else 40)
      if (calculatedTotal < 499) calculatedTotal += 40;

      // 4. Save to DB (Sanitized)
      const newOrder = await Order.create({
        customerName: sanitize(customerName), // Remove <script> tags
        phoneNumber: sanitize(phone),
        items: cleanItems,
        totalAmount: calculatedTotal, // Use our calculated total
        trackingId: awb,
        status: "Shipped",
        orderId: orderId
      });

      // 5. Send WhatsApp (Wrapped in try/catch so it doesn't fail order)
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
      } catch (err) { console.log("WhatsApp skipped"); }

      return res.status(201).json({ success: true, data: newOrder });

    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  return res.status(405).end();
}