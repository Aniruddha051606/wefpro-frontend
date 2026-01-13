import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { passcode } = req.body;

  // 1. Check Password vs Environment Variable
  if (passcode === process.env.ADMIN_PASSCODE) {
    
    // 2. Set Secure Cookie
    const cookie = serialize('admin_token', process.env.JWT_SECRET, {
      httpOnly: true, // JavaScript cannot read this (prevents XSS theft)
      secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 Day
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Invalid Passcode" });
}