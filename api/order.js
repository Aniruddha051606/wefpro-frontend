// Add .js to the end of these imports
import dbConnect from '../lib/mongodb.js'; 
import Order from '../models/Order.js';     

import axios from 'axios';

export default async function handler(req, res) {
  await dbConnect(); // Connect to MongoDB

  if (req.method === 'POST') {
    try {
      // req.body is automatically parsed by Vercel
      const newOrder = await Order.create(req.body); 
      return res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
      console.error("Cloud Sync Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}