// Sales 04 · Request transport. Arrival transfer for file 14 (Example Group C) on 5 Dec, airport to hotel.
// Sales fill only the request; operations choose the company. NOSAVE=1 stops before Save.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/04/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.openFile(p, 'Example Group C');
  await L.fileTab(p, 'Trans.');
  const add = p.getByRole('button', { name: /Add transport/ }).first();
  await add.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  if (process.env.FROM !== '4') {
    await L.shot(p, OUT + '01-trans-tab.png', [
      { box: await L.box(p.getByRole('tab', { name: /^Trans\./ }).first()), text: 'Open the Trans. tab', side: 'above', gap: 30, maxw: 200 },
      { box: await L.box(add), text: 'Click Add transport', side: 'right', gap: 80, maxw: 200 },
    ]);
    await add.click(); await p.waitForTimeout(1000);
    const d = p.locator('[role=dialog]').last();
    await field(d, 'From Date').fill('2026-12-05');
    await field(d, 'To Date').fill('2026-12-05');
    await field(d, 'Time').fill('14:30');
    await field(d, 'Pick Up').fill('Queen Alia Airport, flight RJ 102');
    await field(d, 'Drop Off').fill('Example Hotel Amman');
    await field(d, 'Pax').fill('4');
    await field(d, 'What is needed').fill('Arrival transfer with meet and assist. 4 people, 6 large suitcases.');
    await p.waitForTimeout(400);
    await L.shot(p, OUT + '02-request.png', [
      { box: await L.box(field(d, 'From Date'), field(d, 'Time')), text: 'The day, and the time if you know it', side: 'left', gap: 60, maxw: 200 },
      { box: await L.box(field(d, 'Pick Up'), field(d, 'Pax')), text: 'Where from, where to, how many', side: 'left', gap: 60, shift: 20, maxw: 200 },
      { box: await L.box(field(d, 'What is needed')), text: 'Say what is needed in plain words', side: 'left', gap: 60, maxw: 200 },
      { box: await L.box(d.getByText(/^operations$/i).first()), text: 'Leave this part to operations', side: 'left', gap: 60, maxw: 200 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  }
  const row = p.locator('tr', { hasText: 'Queen Alia' }).first();
  await row.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '03-saved.png', [
    { box: await L.box(row), text: 'Saved as a request. Operations see it in To assign and choose the company', side: 'below', gap: 60, shift: 200, maxw: 280 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
