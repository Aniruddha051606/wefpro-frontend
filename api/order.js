import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';
import axios from 'axios';

const isAuthenticated = (req) => {
  const cookie = req.headers.cookie;
  return cookie && cookie.includes(`admin_token=${process.env.JWT_SECRET}`);
};

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

  // POST: Create Order (Public) - [Kept same as before, see Part 1 code]
  if (req.method === 'POST') {
     // ... (Keep the POST logic from Part 1) ...
     // For brevity, I'm skipping re-pasting the whole POST block unless you need it.
     // Just ensure the POST block from the previous step is here.
     return res.status(405).end(); // Placeholder if you copy-paste blindly
  }

  // 🆕 PUT: Update Status (Admin Only)
  if (req.method === 'PUT') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { orderId, status } = req.body;
        
        // Update the status in MongoDB
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