import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import { trackShipment } from '../lib/delhivery.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();
    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ error: "Order ID is required" });

    try {
      const order = await Order.findOne({ orderId }).lean();
      if (!order) return res.status(404).json({ error: "Order not found" });

      let liveTracking = [];
      if (order.trackingId) liveTracking = await trackShipment(order.trackingId);

      return res.status(200).json({ success: true, data: { ...order, liveTracking } });
    } catch (error) { return res.status(500).json({ error: "Server Error" }); }
  }
  return res.status(405).end();
}