/**
 * Slot rules shared by the booking endpoints, kept apart from the request
 * handling so they can be read (and tested) on their own.
 *
 * The form already checks all of this in the browser, but the browser is not
 * where it counts: anything can POST to /api/book, and a slot reserved for
 * 3am on a day the shop is shut would sit in the picker greying out a time
 * nobody could ever book.
 */

import { HOURS } from './_hours.mjs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const minutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** How far ahead the shop will take a request. */
export const HORIZON_DAYS = 120;

/**
 * Validates a requested slot. Dates are compared in whole days with a day of
 * slack either side, because the shop, the visitor and the server can each be
 * on a different side of midnight and none of that is worth a rejection.
 *
 * Returns null when the slot is fine, or a short reason when it isn't.
 */
export function slotProblem(date, time, now = new Date()) {
  if (typeof date !== 'string' || !DATE_RE.test(date)) return 'invalid date';
  if (typeof time !== 'string' || !TIME_RE.test(time)) return 'invalid time';

  const day = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(day.getTime())) return 'invalid date';

  const today = new Date(`${now.toISOString().slice(0, 10)}T12:00:00Z`);
  const daysOut = Math.round((day - today) / 86400000);
  if (daysOut < -1) return 'date is in the past';
  if (daysOut > HORIZON_DAYS) return 'date is too far ahead';

  const hours = HOURS[day.getUTCDay()];
  if (!hours || !hours.open || !hours.close) return 'the shop is closed that day';

  const at = minutes(time);
  if (at < minutes(hours.open) || at >= minutes(hours.close)) {
    return 'outside opening hours';
  }
  return null;
}

/** The caller's address, as far as the platform will tell us. */
export function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const first = typeof forwarded === 'string' ? forwarded.split(',')[0] : '';
  return (first || req.headers['x-real-ip'] || 'unknown').toString().trim().slice(0, 45);
}

/**
 * A cheap cap on how many slots one address can reserve in an hour. Without
 * it, a single script could hold every chair on the calendar; the shop would
 * see nothing but a picker full of greyed-out times.
 *
 * Fails open: if the counter can't be read, the booking still goes through.
 */
export async function overRateLimit(redis, key, { limit = 20, windowSeconds = 3600 } = {}) {
  if (!redis) return false;
  try {
    const bucket = `rl:book:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
    const count = await redis.incr(bucket);
    if (count === 1) await redis.expire(bucket, windowSeconds);
    return count > limit;
  } catch {
    return false;
  }
}

/** Ninety days is long past the appointment; nothing needs keeping after that. */
export const KEEP_SECONDS = 60 * 60 * 24 * 90;
