// Operations 06 · Run down reports (the screen as of 11 Nov 2026: reports as radios, every filter in sight, the
// result below follows each choice). The airport run down for 5 Dec 2026, then To assign for December. Read-only.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/06/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open({ width: 1440, height: 1000 });
  await p.getByRole('button', { name: /^Reports/ }).first().click(); await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Operations', exact: true }).first().click(); await p.waitForTimeout(1500);
  const m = p.locator('main');
  const radio = (name) => m.getByText(name, { exact: true }).first();
  const from = m.getByLabel('From date'), to = m.getByLabel('To date');
  await radio('By Groups').click();
  await radio('Airport rundown').click();
  await from.fill('2026-12-05'); await to.fill('2026-12-05'); await p.waitForTimeout(1000);
  await radio('By Groups').evaluate((e) => e.scrollIntoView({ block: 'start' })); await p.scrollBy?.(0, 0);
  await p.evaluate(() => window.scrollBy(0, -120)); await p.waitForTimeout(400);
  await L.shot(p, OUT + '01-form.png', [
    { box: await L.box(radio('By Groups'), radio('To assign')), text: 'Which report: by groups, hotels, transport, guides… or To assign', side: 'below', gap: 50, shift: -100, maxw: 260, n: 1 },
    { box: await L.box(radio('Groups rundown'), radio('Statistical report')), text: 'For By Groups: which layout, here the airport run down', side: 'left', gap: 100, shift: 110, maxw: 220, n: 2 },
    { box: await L.box(from, to), text: 'The days it covers', side: 'below', gap: 60, shift: 120, maxw: 180, n: 3 },
  ]);
  const hide = m.getByText(/Hide agent names/).first();
  const print = m.getByRole('button', { name: 'Print', exact: true }).first();
  await hide.evaluate((e) => e.scrollIntoView({ block: 'start' })); await p.evaluate(() => window.scrollBy(0, -80)); await p.waitForTimeout(400);
  await L.shot(p, OUT + '02-airport.png', [
    { box: await L.box(hide), text: 'Hide agent names on a sheet for a supplier', side: 'right', gap: 60, maxw: 220, n: 4 },
    { box: await L.box(print), text: 'Print it, or save it as a PDF from the print window', side: 'below', gap: 40, shift: -200, maxw: 220, n: 5 },
  ]);
  await radio('To assign').click();
  await from.fill('2026-12-01'); await to.fill('2026-12-31'); await p.waitForTimeout(1200);
  const title = m.getByText('THE BIG PICTURE', { exact: false }).first();
  await title.evaluate((e) => e.scrollIntoView({ block: 'start' })); await p.waitForTimeout(400);
  console.log('to assign:', (await m.innerText()).match(/THE BIG PICTURE[\s\S]{0,300}/i)?.[0].replace(/\s+/g, ' '));
  await L.shot(p, OUT + '03-to-assign.png', [
    { box: await L.box(title), text: 'Every transport and guide still without a company, by day', side: 'right', gap: 60, maxw: 240, n: 6 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
