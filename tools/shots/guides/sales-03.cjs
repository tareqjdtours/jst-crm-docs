// Sales 03 · Add a hotel to a file. Example Hotel Amman on file 14 (Example Group C), 5–9 Dec, 2 DBL, BB,
// requested, cost 480 JOD. NOSAVE=1 stops before Save.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/03/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.openFile(p, 'Example Group C');
  await L.fileTab(p, 'Hotels');
  const add = p.getByRole('button', { name: /Add hotel/ });
  await add.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '01-hotels-tab.png', [
    { box: await L.box(p.getByRole('tab', { name: /^Hotels/ }).first()), text: 'Open the Hotels tab', side: 'right', gap: 300, maxw: 200 },
    { box: await L.box(add), text: 'Click Add hotel', side: 'right', gap: 80, maxw: 200 },
  ]);
  if (process.env.FROM !== '4') {
    await add.click(); await p.waitForTimeout(1000);
    const d = p.locator('[role=dialog]').last();
    await L.pick(p, d, 'Hotel Name', 'Example Hotel Amman');
    await field(d, 'Check In').fill('2026-12-05');
    await field(d, 'Check Out').fill('2026-12-09');
    await field(d, 'Pax').fill('4');
    await L.pick(p, d, 'Meal', 'BB');
    await L.pick(p, d, 'Room Type', 'Standard room');
    await field(d, 'DBL').fill('2');
    await L.pick(p, d, 'Status', 'RQ — REQUESTED');
    await p.waitForTimeout(300);
    const combo = (n) => d.getByRole('combobox', { name: n });
    await L.shot(p, OUT + '02-stay.png', [
      { box: await L.box(combo('Hotel Name')), text: 'The hotel', side: 'left', gap: 60, maxw: 200 },
      { box: await L.box(field(d, 'Check In'), field(d, 'Check Out')), text: 'Check-in and check-out', side: 'above', gap: 14, shift: 120, maxw: 240 },
      { box: await L.box(field(d, 'Pax'), combo('Room Type')), text: 'People, meal plan and room type', side: 'left', gap: 60, shift: 30, maxw: 200 },
      { box: await L.box(field(d, 'SGL'), field(d, 'TRP'), field(d, 'TWN')), text: 'How many rooms of each kind', side: 'left', gap: 60, shift: 40, maxw: 200 },
      { box: await L.box(combo('Status')), text: 'RQ while you wait for the hotel', side: 'left', gap: 60, shift: 50, maxw: 200 },
    ]);
    const cost = field(d, 'Cost');
    await cost.fill('480');
    await p.waitForTimeout(500);
    await cost.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '03-price.png', [
      { box: await L.box(cost), text: 'What the hotel charges, for the whole stay', side: 'left', gap: 60, maxw: 200 },
      { box: await L.box(field(d, 'Selling')), text: 'Selling fills in from the file’s profit %', side: 'left', gap: 60, shift: 30, maxw: 200 },
      { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 200 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  }
  const row = p.locator('tr', { hasText: 'Example Hotel Amman' }).first();
  await row.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '04-saved.png', [
    { box: await L.box(row), text: 'The stay is on the file. Click the row to change it', side: 'below', gap: 60, shift: 200, maxw: 240 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
