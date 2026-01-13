import dbConnect from '../lib/mongodb.js';
import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  await dbConnect();

  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: "Invalid Email" });

    // Use findOneAndUpdate with upsert to prevent duplicates causing errors
    await Subscriber.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
}