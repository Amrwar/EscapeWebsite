/**
 * POST /api/book
 * Body: { date, time, barber, name, phone, service, notes }
 *
 * Reserves a (date, time, barber) slot so nobody else can pick the same
 * one. The set membership add is atomic (Redis SADD returns how many
 * elements it actually added), so two people submitting the same slot at
 * once still can't both win it. Booking with "no preference" (no barber)
 * always succeeds — it isn't tied to a specific chair, so there's nothing
 * to reserve.
 *
 * This only tracks requests made through this form. It still doesn't know
 * about anything arranged directly by phone or WhatsApp, same as before.
 */
import { redis } from './_redis.mjs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  const { date, time, barber, name, phone, service, notes } = body ?? {};
  if (typeof date !== 'string' || !DATE_RE.test(date) || typeof time !== 'string' || !TIME_RE.test(time)) {
    res.status(400).json({ error: 'invalid date or time' });
    return;
  }

  /* No Redis connected yet — nothing to reserve against, so let it through
     rather than error. The booking still reaches the shop on WhatsApp
     either way; this is only what feeds the slot picker. */
  if (!redis) {
    res.status(200).json({ ok: true });
    return;
  }

  const cleanBarber = typeof barber === 'string' ? barber.trim().slice(0, 60) : '';
  const record = JSON.stringify({
    date,
    time,
    barber: cleanBarber,
    name: String(name ?? '').slice(0, 120),
    phone: String(phone ?? '').slice(0, 40),
    service: String(service ?? '').slice(0, 120),
    notes: String(notes ?? '').slice(0, 500),
    createdAt: new Date().toISOString(),
  });

  if (cleanBarber) {
    const added = await redis.sadd(`booked:${date}:${cleanBarber}`, time);
    if (added === 0) {
      res.status(409).json({ error: 'taken' });
      return;
    }
  }

  await redis.rpush(`bookings:${date}`, record);
  res.status(200).json({ ok: true });
}
