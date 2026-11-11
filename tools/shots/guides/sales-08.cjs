// Sales 08 · Find a file. Quick search in Reservations, the Advanced Search drawer, then opening the file.
// Read-only: nothing is saved.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/08/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Reservations'); await p.waitForTimeout(1000);
  const q = p.getByPlaceholder(/Search file no/);
  await q.fill('Rossi'); await p.waitForTimeout(800);
  await L.shot(p, OUT + '01-search.png', [
    { box: await L.box(q), text: 'Type part of the file number, group, client, agent or ref', side: 'below', gap: 300, shift: 60, maxw: 260, n: 1 },
    { box: await L.box(p.getByText(/^Files = \d+/)), text: 'How many files match', side: 'below', gap: 120, shift: -60, maxw: 180, n: 4 },
    { box: await L.box(p.getByRole('button', { name: /^Live \(/ }), p.getByRole('button', { name: /^All \(/ })), text: 'Live, cancelled or all files', side: 'below', gap: 30, shift: -140, maxw: 200, n: 2 },
    { box: await L.box(p.getByRole('combobox').first()), text: 'Only the files of one owner', side: 'below', gap: 130, shift: 40, maxw: 200, n: 3 },
  ], { x: 0, y: 0, width: 1440, height: 700 });
  await q.fill(''); await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'A. Search' }).click(); await p.waitForTimeout(1200);
  const d = p.locator('[role=dialog]').last();
  await field(d, 'Agent Ref').fill('EH-2026-118'); await p.waitForTimeout(800);
  await L.shot(p, OUT + '02-advanced.png', [
    { box: await L.box(field(d, 'File No'), field(d, 'Agent Ref'), field(d, 'User Name')), text: 'Fill any of these. The list narrows as you type', side: 'left', gap: 40, maxw: 200 },
    { box: await L.box(field(d, 'Arrival from'), field(d, 'Arrival to')), text: 'Or look for arrivals between two dates', side: 'left', gap: 40, maxw: 200 },
    { box: await L.box(d.getByText('Include cancelled files')), text: 'Turn on to see cancelled files too', side: 'right', gap: 60, maxw: 200 },
    { box: await L.box(d.locator('table').last()), text: 'Click a file to open it', side: 'left', gap: 40, maxw: 200 },
  ]);
  await d.getByRole('button', { name: 'Close', exact: true }).last().click(); await p.waitForTimeout(800);
  await p.getByText('Example Group C', { exact: true }).first().click(); await p.waitForTimeout(1500);
  await L.shot(p, OUT + '03-open.png', [
    { box: await L.box(p.getByRole('heading', { name: 'Example Group C' }).first(), p.getByText(/^File 14 ·/)), text: 'The file opens: group name, number, agent and dates', side: 'right', gap: 60, shift: 20, maxw: 240 },
    { box: await L.box(p.getByText('Reservations', { exact: true }).nth(2)), text: 'Back to the list', side: 'right', gap: 60, shift: -20, maxw: 180 },
    { box: await L.box(p.getByRole('tab', { name: /^General/ }), p.getByRole('tab', { name: /^Entrance/ })), text: 'Each tab is one kind of service. The number is how many lines it has', side: 'above', gap: 80, shift: 200, maxw: 260 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
