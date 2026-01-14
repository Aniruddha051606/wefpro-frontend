import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount } = req.body;
  
  // 🟢 CHECK: If keys are missing, enable DEMO MODE
  if (!process.env.RAZORPAY_KEY_ID) {
    console.log("⚠️ No Razorpay Keys found. Running in DEMO MODE.");
    return res.status(200).json({ 
        success: true, 
        isMock: true, // Tell frontend this is a simulation
        order: { 
            id: "order_mock_" + Date.now(), 
            amount: Math.round(amount * 100),
            currency: "INR"
        } 
    });
  }

  // Real Razorpay Initialization
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.status(200).json({ success: true, isMock: false, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}