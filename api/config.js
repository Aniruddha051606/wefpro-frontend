import dbConnect from '../lib/mongodb.js';
import mongoose from 'mongoose';

// Simple schema for global settings
const ConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed
});

const Config = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const priceConfig = await Config.findOne({ key: 'product_price' });
    return res.status(200).json({ price: priceConfig?.value || 249 });
  }

  if (req.method === 'POST') {
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