// Operations 02 · Assign transport. File 14's airport transfer on 5 Dec, raised by Sales without a company:
// Example Coaches, a minivan, driver Example Driver Omar, confirmed EC-7781, cost 35 JOD.
// NOSAVE=1 stops before Save; FROM=4 shoots only the saved line and the dashboard.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/02/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
const dash = async (p) => {
  await L.nav(p, 'Operations Dashboard');
  await p.locator('main input[type=date]').first().fill('2026-12-05'); await p.waitForTimeout(1200);
};
(async () => {
  const { browser, page: p } = await L.open();
  const row = () => p.locator('tr', { hasText: 'Queen Alia' }).first();
  if (process.env.FROM !== '4') {
    await dash(p);
    await L.shot(p, OUT + '01-dashboard.png', [
      { box: await L.box(p.getByText('Needs action today'), p.getByText('needs Transport company')), text: 'Click the transfer waiting for a company', side: 'below', gap: 230, shift: 200, maxw: 240 },
    ]);
    await p.getByText('needs Transport company').click(); await p.waitForTimeout(1500);
    await L.fileTab(p, 'Trans.');
    await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '02-trans-tab.png', [
      { box: await L.box(p.getByRole('tab', { name: /^Trans\./ }).first()), text: 'The file opens. Go to the Trans. tab', side: 'above', gap: 30, maxw: 220, n: 1 },
      { box: await L.box(row()), text: 'Click the request', side: 'below', gap: 60, shift: 200, maxw: 200, n: 2 },
    ]);
    await row().locator('td').nth(1).click(); await p.waitForTimeout(1200);
    const d = p.locator('[role=dialog]').last();
    await L.scrollIn(p, field(d, 'Pick Up'), 160);
    await L.shot(p, OUT + '03-request.png', [
      { box: await L.box(field(d, 'From Date'), field(d, 'What is needed')), text: 'What Sales asked for: read it first', side: 'left', gap: 40, maxw: 200 },
    ]);
    await L.pick(p, d, 'Trans. Co. Name', 'Example Coaches');
    await L.pick(p, d, 'Type of Vehicle', 'Minivan 8 seater');
    await d.getByPlaceholder("or type a new driver's name").fill('Example Driver Omar');
    await field(d, 'Mobile').fill('+962 79 111 2233');
    await L.pick(p, d, 'Status', 'OK — CONFIRMED');
    await field(d, 'Conf. No.').fill('EC-7781');
    await p.waitForTimeout(300);
    await L.scrollIn(p, d.getByText(/^operations$/i), 120);
    await L.shot(p, OUT + '04-assign.png', [
      { box: await L.box(d.getByRole('combobox', { name: 'Trans. Co. Name' })), text: 'The transport company', side: 'below', gap: 150, shift: -60, maxw: 180, n: 1 },
      { box: await L.box(d.getByRole('combobox', { name: 'Type of Vehicle' })), text: 'The vehicle', side: 'below', gap: 150, maxw: 160, n: 2 },
      { box: await L.box(d.getByRole('combobox', { name: 'Driver Name' }), d.getByPlaceholder("or type a new driver's name")), text: 'Pick a known driver, or type a new name', side: 'below', gap: 80, shift: 40, maxw: 200, n: 3 },
      { box: await L.box(field(d, 'Mobile')), text: "The driver's mobile", side: 'left', gap: 40, maxw: 160, n: 4 },
      { box: await L.box(d.getByRole('combobox', { name: 'Status' }), field(d, 'Conf. No.')), text: 'Confirmed, with the company’s reference', side: 'below', gap: 60, shift: 120, maxw: 220, n: 5 },
    ]);
    const cost = field(d, 'Cost');
    await cost.fill('35'); await p.waitForTimeout(500);
    await L.scrollIn(p, cost, 300);
    await L.shot(p, OUT + '05-price.png', [
      { box: await L.box(cost), text: 'What the company charges', side: 'left', gap: 40, maxw: 180, n: 1 },
      { box: await L.box(field(d, 'Selling')), text: 'Selling fills in from the file’s profit %', side: 'left', gap: 40, maxw: 180, n: 2 },
      { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 180, n: 3 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  } else {
    await L.openFile(p, 'Example Group C');
    await L.fileTab(p, 'Trans.');
  }
  await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '06-saved.png', [
    { box: await L.box(row()), text: 'Assigned: company, vehicle and driver are on the line', side: 'below', gap: 60, shift: 200, maxw: 260 },
  ]);
  await dash(p);
  await L.scrollIn(p, p.getByText('Drivers', { exact: true }), 110);
  await L.shot(p, OUT + '07-dashboard-after.png', [
    { box: await L.box(p.getByText('Drivers', { exact: true }).first(), p.getByText(/Minivan 8 seater · 4 pax/).first()), text: 'The driver is on the day’s board, with the group', side: 'left', gap: 30, maxw: 160 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
