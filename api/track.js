import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';

export default async function handler(req, res) {
  // Allow Public Access (No Admin Check)
  if (req.method === 'GET') {
    await dbConnect();
    const { orderId } = req.query;

    if (!orderId) return res.status(400).json({ error: "Order ID is required" });

    try {
      // Find specific order
      const order = await Order.findOne({ orderId: orderId });
      
      if (!order) return res.status(404).json({ error: "Order not found" });

      // Return only safe data (exclude internal notes if you add them later)
      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      return res.status(500).json({ error: "Server Error" });
    }
  }
  
  return res.status(405).end();
}
