/**
 * Checks the booking endpoint's slot rules against the shop's real hours.
 *
 *   node tools/slot-test.mjs
 */
import { slotProblem } from '../api/_slot.mjs';
import { HOURS } from '../api/_hours.mjs';

const now = new Date('2026-09-24T09:00:00Z');
const day = (offset) => {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};

const open = HOURS[new Date(`${day(3)}T12:00:00Z`).getUTCDay()];
const cases = [
  ['a normal slot', day(3), open.open, null],
  ['last hour before closing', day(3), '22:30', null],
  ['at closing time', day(3), open.close, 'outside opening hours'],
  ['before opening', day(3), '06:00', 'outside opening hours'],
  ['last week', day(-7), '12:00', 'date is in the past'],
  ['yesterday (slack for time zones)', day(-1), '12:00', null],
  ['next year', day(400), '12:00', 'date is too far ahead'],
  ['nonsense date', 'soon', '12:00', 'invalid date'],
  ['nonsense time', day(3), '25:99', 'invalid time'],
  ['injection attempt', day(3), '12:00; DROP', 'invalid time'],
];

let failed = 0;
for (const [name, date, time, expected] of cases) {
  const got = slotProblem(date, time, now);
  const ok = got === expected;
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} — ${got ?? 'allowed'}`);
}
console.log(`\n${cases.length - failed}/${cases.length} slot rules behave`);
process.exit(failed ? 1 : 0);
