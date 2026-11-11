// Sales 06 · Create a proforma for the agent. File 14 (Example Group C), from the Invoices tab.
// NOSAVE=1 stops before Save proforma; FROM=3 shoots only the saved proforma.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/06/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.openFile(p, 'Example Group C');
  await L.fileTab(p, 'Invoices');
  const btn = p.getByRole('button', { name: 'Create Proforma' }).first();
  if (process.env.FROM !== '3') {
    await btn.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '01-invoices-tab.png', [
      { box: await L.box(p.getByRole('tab', { name: /^Invoices/ }).first()), text: 'Open the Invoices tab', side: 'left', gap: 60, maxw: 200 },
      { box: await L.box(btn), text: 'Click Create Proforma', side: 'below', gap: 70, shift: 60, maxw: 220 },
    ]);
    await btn.click(); await p.waitForTimeout(1500);
    const d = p.locator('[role=dialog]').last();
    await L.shot(p, OUT + '02-proforma.png', [
      { box: await L.box(d.getByRole('combobox', { name: 'Currency' })), text: 'The currency the agent pays in', side: 'below', gap: 40, shift: -80, maxw: 200 },
      { box: await L.box(d.locator('label', { hasText: /^Credit card fee/ }).locator('input')), text: 'Paying by card? Type the fee %; it adds a line', side: 'below', gap: 40, shift: -40, maxw: 220 },
      { box: await L.box(d.locator('table').first()), text: 'One line per service, at its selling price, and the due date', side: 'below', gap: 300, shift: -300, maxw: 240 },
      { box: await L.box(d.getByRole('button', { name: 'Save proforma' })), text: 'Click Save proforma', side: 'left', gap: 110, maxw: 200 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: 'Save proforma' }).click(); await p.waitForTimeout(2000);
  }
  const row = p.locator('tr', { hasText: /PF-\d\d-\d+/ }).last();
  await row.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '03-saved.png', [
    { box: await L.box(row.locator('td').first()), text: 'The proforma has its number', side: 'left', gap: 30, shift: -60, maxw: 200 },
    { box: await L.box(row.locator('td').last()), text: 'Waiting for the accountant to turn it into the invoice', side: 'right', gap: 90, maxw: 240 },
  ]);
  await row.click(); await p.waitForTimeout(1500);
  const d = p.locator('[role=dialog]').last();
  await L.shot(p, OUT + '04-open.png', [
    { box: await L.box(d.getByRole('button', { name: 'PDF', exact: true })), text: 'PDF: the proforma to send to the agent', side: 'left', gap: 180, maxw: 220 },
    { box: await L.box(d.getByRole('button', { name: 'Edit', exact: true })), text: 'Edit: change a line before the accountant converts it', side: 'above', gap: 60, maxw: 240 },
  ], { x: 288, y: 0, width: 1152, height: 900 });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
