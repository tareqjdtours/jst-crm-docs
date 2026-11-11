// Operations 04 · Who is free. Drivers & Guides for 1–10 Dec 2026: Example Driver Omar on 5 Dec,
// Example Guide Sami on 6 Dec, Example Guide Lina with nothing booked. Read-only.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/04/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Drivers & Guides');
  const m = p.locator('main');
  const from = m.locator('label', { hasText: /^From/ }).locator('input');
  const to = m.locator('label', { hasText: /^To/ }).locator('input');
  await from.fill('2026-12-01'); await to.fill('2026-12-10'); await p.waitForTimeout(1000);
  await L.scrollIn(p, m.getByText('Everyone'), 160);
  const clip = { x: 0, y: 0, width: 1440, height: 700 };
  await L.shot(p, OUT + '01-board.png', [
    { box: await L.box(from, to), text: 'The days to look at', side: 'above', gap: 30, shift: -260, maxw: 180, n: 1 },
    { box: await L.box(m.getByRole('button', { name: 'Everyone' }), m.getByRole('button', { name: /^Guides \(/ })), text: 'Everyone, or only drivers or guides', side: 'below', gap: 80, shift: -100, maxw: 200, n: 2 },
    { box: await L.box(m.getByText('Dec 2026'), m.getByText('Free, nothing booked ahead')), text: 'One column per day. Each block is a job on that day', side: 'right', gap: 30, shift: 40, maxw: 200, n: 3 },
    { box: await L.box(m.getByText('Nothing booked', { exact: true }).first()), text: 'Nothing booked: free for the whole window', side: 'left', gap: 30, maxw: 170, n: 4 },
    { box: await L.box(m.getByRole('button', { name: 'Roster' })), text: 'Roster: the same as a list', side: 'below', gap: 60, maxw: 180, n: 5 },
  ], clip);
  await m.getByRole('button', { name: 'Roster' }).click(); await p.waitForTimeout(800);
  await L.scrollIn(p, m.getByText('Drivers on the road today'), 120);
  await L.shot(p, OUT + '02-roster.png', [
    { box: await L.box(m.getByText('Drivers on the road today'), m.getByText('Double-booked')), text: 'Today in numbers. Double-booked should always be 0', side: 'below', gap: 60, shift: 200, maxw: 220, n: 1 },
    { box: await L.box(m.getByText('Free from', { exact: true })), text: 'The first day each person is free', side: 'above', gap: 30, shift: -80, maxw: 180, n: 2 },
    { box: await L.box(m.getByText('Next', { exact: true })), text: 'Their next job, with the group', side: 'above', gap: 30, shift: 40, maxw: 180, n: 3 },
  ], clip);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
