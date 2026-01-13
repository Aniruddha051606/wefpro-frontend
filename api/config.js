import dbConnect from '../lib/mongodb.js';
import mongoose from 'mongoose';
import { parse } from 'cookie'; // <--- NEW IMPORT

const ConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed
});
const Config = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

// 🛡️ ROBUST AUTH CHECK
const isAuthenticated = (req) => {
  const cookies = parse(req.headers.cookie || '');
  return cookies.admin_token === process.env.JWT_SECRET;
};

export default async function handler(req, res) {
  await dbConnect();

  // GET: Public
  if (req.method === 'GET') {
    const priceConfig = await Config.findOne({ key: 'product_price' });
    return res.status(200).json({ price: priceConfig?.value || 249 });
  }

  // POST: Protected (Admins Only)
  if (req.method === 'POST') {
    if (!isAuthenticated(req)) return res.status(401).json({ error: "Unauthorized" });

    const { price } = req.body;
    const updated = await Config.findOneAndUpdate(
      { key: 'product_price' },
      { value: price },
      { upsert: true, new: true }
    );
    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).end();
}