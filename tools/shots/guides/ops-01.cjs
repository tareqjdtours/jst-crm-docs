// Operations 01 · The day's dashboard. 5 Dec 2026, the day file 14 (Example Group C) arrives, before
// its airport transfer has a company. Read-only.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/01/';
require('fs').mkdirSync(OUT, { recursive: true });
const top = (p, loc) => loc.evaluate((e) => e.scrollIntoView({ block: 'start' })).then(() => p.waitForTimeout(400));
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Operations Dashboard');
  const date = p.locator('main input[type=date]').first();
  await date.fill('2026-12-05'); await p.waitForTimeout(1200);
  await L.shot(p, OUT + '01-top.png', [
    { box: await L.box(p.getByRole('button', { name: 'Yesterday' }), p.getByRole('button', { name: 'Tomorrow' })), text: 'Pick the day, or type any date in the box below', side: 'right', gap: 220, maxw: 240, n: 1 },
    { box: await L.box(p.getByText('Arrivals', { exact: true }).first(), p.getByText(/to assign · no driver/).first()), text: 'The day in numbers', side: 'left', gap: 30, maxw: 160, n: 2 },
    { box: await L.box(p.getByText('Needs action today'), p.getByText('needs Transport company')), text: 'Do these first. Click a row to open its file', side: 'below', gap: 230, shift: 200, maxw: 240, n: 3 },
  ]);
  await L.scrollIn(p, p.getByText('Drivers', { exact: true }), 110);
  await L.shot(p, OUT + '02-lists.png', [
    { box: await L.box(p.getByText('Drivers', { exact: true }).first(), p.getByText('No guide jobs on this day.')), text: 'Who drives and who guides today, with which group', side: 'left', gap: 30, maxw: 160, n: 1 },
    { box: await L.box(p.getByText('Arrivals', { exact: true }).last(), p.getByText('No departures.')), text: 'Flights in and out, with times and people', side: 'left', gap: 30, maxw: 160, n: 2 },
    { box: await L.box(p.getByText('Hotel check-ins and check-outs'), p.getByText('ref H-55871')), text: 'Who checks in or out of which hotel', side: 'left', gap: 30, maxw: 160, n: 3 },
  ]);
  await top(p, p.getByText(/^Hotels not confirmed/));
  await L.shot(p, OUT + '03-chase.png', [
    { box: await L.box(p.getByText(/^Hotels not confirmed/)), text: 'Stays in the next week with no hotel number yet', side: 'left', gap: 30, maxw: 160, n: 1 },
    { box: await L.box(p.getByText(/^Reminders due/)), text: 'Reminders due or overdue (guide 7)', side: 'below', gap: 40, shift: -200, maxw: 200, n: 2 },
    { box: await L.box(p.getByText(/^Coming up · to assign/)), text: 'Transport and guides still without a company, in the days ahead', side: 'left', gap: 30, maxw: 160, n: 3 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
