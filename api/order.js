// api/order.js
import dbConnect from '../lib/mongodb.js';
import Order from '../models/Order.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { 
        customerName, 
        phone,    // Frontend sends 'phone'
        items, 
        amount,   // Frontend sends 'amount'
        orderId, 
        awb 
      } = req.body;

      // Map frontend fields to the backend Schema
      const newOrder = await Order.create({
        customerName,
        phoneNumber: phone,   // Map 'phone' to 'phoneNumber'
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty   // Map 'qty' to 'quantity'
        })),
        totalAmount: amount,  // Map 'amount' to 'totalAmount'
        trackingId: awb,      // Map 'awb' to 'trackingId'
        status: "Shipped"     // Match the status from your frontend
      });

      return res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
      console.error("Cloud Sync Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}