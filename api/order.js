import dbConnect from '../lib/mongodb.js'; // Added .js extension
import Order from '../models/Order.js';     // Added .js extension
import axios from 'axios';

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'POST') {
      const newOrder = await Order.create(req.body); 
      return res.status(201).json({ success: true, data: newOrder });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}