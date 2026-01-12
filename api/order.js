import dbConnect from '../lib/mongodb';
import Order from '../models/Order';

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

  // Fallback for non-POST requests to prevent 405 error
  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}