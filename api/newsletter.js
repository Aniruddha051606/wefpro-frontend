import dbConnect from '../lib/mongodb.js';
import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now }
});

// Prevent model recompilation error
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();

  try {
    await Subscriber.create({ email: req.body.email });
    return res.status(200).json({ success: true });
  } catch (error) {
    // Duplicate email is fine, just say success
    return res.status(200).json({ success: true });
  }
}