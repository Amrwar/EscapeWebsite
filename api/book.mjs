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
import { slotProblem, clientKey, overRateLimit, KEEP_SECONDS } from './_slot.mjs';

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

  /* The form checks this too, but anything can post here: a slot in the past,
     at 3am, or on a day the shop is shut would otherwise sit in the picker
     greying out a time nobody could book. */
  const problem = slotProblem(date, time);
  if (problem) {
    res.status(400).json({ error: problem });
    return;
  }

  if (await overRateLimit(redis, clientKey(req))) {
    res.status(429).json({ error: 'too many requests' });
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
    const key = `booked:${date}:${cleanBarber}`;
    const added = await redis.sadd(key, time);
    if (added === 0) {
      res.status(409).json({ error: 'taken' });
      return;
    }
    /* Long past the appointment, and it stops old days accumulating for ever. */
    await redis.expire(key, KEEP_SECONDS);
  }

  const log = `bookings:${date}`;
  await redis.rpush(log, record);
  /* The same expiry covers the customer's name and number: this is a copy of a
     WhatsApp message, not a record the shop is keeping. */
  await redis.expire(log, KEEP_SECONDS);
  res.status(200).json({ ok: true });
}
