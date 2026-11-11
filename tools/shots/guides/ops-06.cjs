// Operations 06 · Run down reports. Reports → Operations: the airport run down for 5 Dec 2026, then the
// To assign list for December. Read-only.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/06/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: /^Reports/ }).first().click(); await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Operations', exact: true }).first().click(); await p.waitForTimeout(1500);
  const m = p.locator('main');
  const from = m.locator('label', { hasText: /^From date/ }).locator('input');
  const to = m.locator('label', { hasText: /^To date/ }).locator('input');
  await from.fill('2026-12-05'); await to.fill('2026-12-05');
  await L.pick(p, m, 'Report view', 'Airport rundown');
  await p.waitForTimeout(500);
  const gen = m.getByRole('button', { name: /Generate report/ });
  await L.shot(p, OUT + '01-form.png', [
    { box: await L.box(m.getByRole('combobox', { name: 'Report type' })), text: 'Which report: by groups, hotels, transport, guides… or To assign', side: 'right', gap: 300, maxw: 240, n: 1 },
    { box: await L.box(from, to), text: 'The days it covers', side: 'below', gap: 140, shift: -80, maxw: 180, n: 2 },
    { box: await L.box(m.getByRole('combobox', { name: 'Report view' })), text: 'The layout: groups, airport, groups in town…', side: 'below', gap: 70, shift: -60, maxw: 200, n: 3 },
    { box: await L.box(m.getByText('Hide agent names')), text: 'Hide agent names on a sheet for a supplier', side: 'above', gap: 50, shift: -40, maxw: 200, n: 4 },
    { box: await L.box(gen), text: 'Click Generate report', side: 'left', gap: 160, maxw: 180, n: 5 },
  ]);
  await gen.click(); await p.waitForTimeout(1500);
  await L.shot(p, OUT + '02-airport.png', [
    { box: await L.box(p.getByRole('button', { name: 'Print', exact: true }).last()), text: 'Print it, or save it as a PDF from the print window', side: 'left', gap: 60, maxw: 220 },
  ]);
  await p.getByRole('button', { name: 'Close', exact: true }).last().click(); await p.waitForTimeout(800);
  await L.pick(p, m, 'Report type', 'To assign');
  await from.fill('2026-12-01'); await to.fill('2026-12-31');
  await gen.click(); await p.waitForTimeout(1500);
  await L.shot(p, OUT + '03-to-assign.png', [
    { box: await L.box(p.getByText(/waiting on operations/)), text: 'Every transport and guide still without a company, by day', side: 'below', gap: 300, shift: -300, maxw: 240, n: 1 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
