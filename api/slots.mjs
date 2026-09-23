/**
 * GET /api/slots?date=YYYY-MM-DD&barber=Name
 *
 * Returns the times already booked with that barber on that day, so the
 * booking form can grey them out. Slots aren't tracked when no barber is
 * picked ("no preference") — there's no way to know which barber that
 * would occupy, so those stay open and the shop still sorts it out on
 * WhatsApp, as it always has.
 */
import { redis } from './_redis.mjs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const { date, barber } = req.query;
  if (typeof date !== 'string' || !DATE_RE.test(date)) {
    res.status(400).json({ error: 'invalid date' });
    return;
  }
  /* No Redis connected yet (the one-time Vercel Storage setup in the
     README hasn't been done) — fail open rather than error, same as if no
     barber were picked: every time just shows as available. */
  if (!redis || typeof barber !== 'string' || !barber.trim()) {
    res.status(200).json({ taken: [] });
    return;
  }

  const taken = await redis.smembers(`booked:${date}:${barber.trim().slice(0, 60)}`);
  res.status(200).json({ taken });
}
