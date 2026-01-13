import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { passcode } = req.body;

  // Verify against server-side environment variable
  if (passcode === process.env.ADMIN_PASSCODE) {
    
    const cookie = serialize('admin_token', process.env.JWT_SECRET, {
      httpOnly: true,  // Cannot be accessed by JS (XSS protection)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60 * 24, // 1 Day
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Unauthorized" });
}