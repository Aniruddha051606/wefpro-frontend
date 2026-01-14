import { getShippingLabel } from '../lib/delhivery.js';

export default async function handler(req, res) {
  const { awb } = req.query;
  if (!awb) return res.status(400).json({ error: "AWB Required" });

  const labelUrl = await getShippingLabel(awb);
  
  if (labelUrl) {
    return res.redirect(labelUrl); // Redirects browser to the PDF
  } else {
    return res.status(404).json({ error: "Label not available yet" });
  }
}