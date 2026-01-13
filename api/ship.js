import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';
import { createShipment } from '../lib/delhivery.js';
import { parse } from 'cookie';

const isAuthenticated = (req) => {
  const cookies = parse(req.headers.cookie || '');
  return cookies.admin_token === process.env.JWT_SECRET;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

  await dbConnect();
  const { orderId } = req.body;

  try {
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const shipment = await createShipment(order);

    if (shipment.success) {
      order.trackingId = shipment.awb;
      order.status = "Shipped";
      await order.save();
      return res.status(200).json({ success: true, awb: shipment.awb });
    } else {
      return res.status(500).json({ error: "Courier Booking Failed" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}