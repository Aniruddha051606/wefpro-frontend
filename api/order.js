import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import axios from 'axios';

export default async function handler(req, res) {
  await dbConnect();

  // GET: Fetch all orders for Admin panel
  if (req.method === 'GET') {
    try {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: orders });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST: Create new order and send WhatsApp
  if (req.method === 'POST') {
    try {
      const { customerName, phone, items, amount, orderId, awb } = req.body;

      const newOrder = await Order.create({
        customerName,
        phoneNumber: phone,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty
        })),
        totalAmount: amount,
        trackingId: awb,
        status: "Shipped"
      });

      // Send via Interakt API
      const purePhone = phone.replace(/\D/g, '').replace(/^91/, ''); 
      try {
        await axios.post('https://api.interakt.ai/v1/public/message/', {
          countryCode: "+91",
          phoneNumber: purePhone,
          type: "Template",
          template: {
            name: "order_confirmed_01", // Make sure this matches Interakt
            languageCode: "en",
            bodyValues: [customerName, orderId]
          }
        }, {
          headers: {
            'Authorization': `Basic ${process.env.INTERAKT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) { console.error("WhatsApp failed but order saved"); }

      return res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
  return res.status(405).end();
}