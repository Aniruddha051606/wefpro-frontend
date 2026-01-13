import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { passcode } = req.body;

  if (passcode === process.env.ADMIN_PASSCODE) {
    const cookie = serialize('admin_token', process.env.JWT_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Better for navigation flow
      maxAge: 60 * 60 * 24, // 1 Day
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Unauthorized" });
}