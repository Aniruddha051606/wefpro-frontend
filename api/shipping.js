import { checkShippingRate } from '../lib/delhivery.js';

export default async function handler(req, res) {
  const { pincode, weight } = req.query;

  if (!pincode || pincode.length < 6) {
    return res.status(400).json({ error: "Invalid PIN" });
  }

  // Parse weight or default to 1 Jar (0.4kg)
  const weightVal = parseFloat(weight) || 0.4;

  const result = await checkShippingRate(pincode, weightVal);

  if (result.service) {
    return res.status(200).json({ success: true, cost: result.cost });
  } else {
    return res.status(400).json({ success: false, error: result.error || "Not serviceable" });
  }
}