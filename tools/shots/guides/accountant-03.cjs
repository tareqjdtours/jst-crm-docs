// Accountant 03 · Invoice an agent. Uses file "Example Group A" (Example Travel Ltd, selling 750 JOD).
// Part B (no proforma) is shown and cancelled; part A converts a proforma for real.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/03/';
require('fs').mkdirSync(OUT, { recursive: true });
const dlg = (p) => p.locator('[role=dialog]').last();
const RAW = process.env.RAW;
(async () => {
  const { browser, page: p } = await L.open();
  const FROM = Number(process.env.FROM || 1);
  if (FROM <= 1) {
    await L.nav(p, 'Inbox');
    await p.getByRole('tab', { name: /To invoice/ }).click(); await p.waitForTimeout(900);
    const others = p.locator('tr').filter({ hasNotText: 'Example Group' }).filter({ has: p.locator('td') });
    await L.blur(others);
    const row = p.locator('tr', { hasText: 'Example Group A' });
    await L.shot(p, OUT + '01-to-invoice.png', [
      { box: await L.box(p.getByRole('tab', { name: /To invoice/ })), text: 'Inbox → To invoice: files not invoiced yet', side: 'above', gap: 30, shift: 230, maxw: 280 },
      { box: await L.box(row.locator('td').nth(1)), text: 'The file and its agent', side: 'below', gap: 40, maxw: 200 },
      { box: await L.box(row.getByRole('button', { name: 'Issue invoice' })), text: 'Click Issue invoice', side: 'below', gap: 40, shift: -60, maxw: 180 },
    ]);
    await row.getByRole('button', { name: 'Issue invoice' }).click(); await p.waitForTimeout(1200);
    const d = dlg(p);
    await L.shot(p, OUT + '02-issue-preview.png', [
      { box: await L.box(d.locator('table').first()), text: 'One line per service, at the selling price', side: 'left', gap: 30, maxw: 190 },
      { box: await L.box(d.getByText(/^Total ·/).locator('xpath=ancestor::tr')), text: 'Total, and the date it is due', side: 'left', gap: 30, shift: 90, maxw: 190 },
      { box: await L.box(d.getByRole('button', { name: 'Create bill in Accounting' })), text: 'Click to raise it as a bill', side: 'above', gap: 80, shift: -150, maxw: 200 },
    ], { x: 0, y: 0, width: 1440, height: 900 });
    await d.getByRole('button', { name: 'Create bill in Accounting' }).click(); await p.waitForTimeout(1200);
    const b = dlg(p);
    const amount = b.locator('input[type=number]').last();
    await amount.fill('750');
    await b.locator('input[placeholder="invoice or bill no."]').fill('INV-26-0412');
    await p.waitForTimeout(400);
    await L.shot(p, OUT + '03-bill.png', [
      { box: await L.box(b.getByRole('button', { name: 'We bill them' })), text: '“We bill them” is already chosen', side: 'left', gap: 40, shift: 40, maxw: 190 },
      { box: await L.box(b.getByText('Example Travel Ltd').first(), b.getByText(/^12 · Example Group A/).first()), text: 'The agent and the file are filled in', side: 'left', gap: 40, shift: 60, maxw: 190 },
      { box: await L.box(b.getByText('Total in JOD').locator('..')), text: 'What the file sells for: your amount to bill', side: 'left', gap: 40, maxw: 190 },
      { box: await L.box(amount), text: 'Type that amount', side: 'left', gap: 40, maxw: 190 },
      { box: await L.box(b.getByRole('button', { name: 'Post the bill' })), text: 'Click Post the bill', side: 'above', gap: 70, shift: -120, maxw: 190 },
    ]);
    if (process.env.NOPOST) { await browser.close(); return; }
    await b.getByRole('button', { name: 'Post the bill' }).click(); await p.waitForTimeout(1500);
    await p.screenshot({ path: OUT + 'raw-after-bill.png' });
  }
  if (FROM <= 4) {
    await L.nav(p, 'Vouchers');
    await p.getByRole('tab', { name: /Proforma/ }).first().click(); await p.waitForTimeout(1000);
    const row = p.locator('tr', { hasText: 'Example Group B' }).first();
    await L.shot(p, OUT + '04-proforma-list.png', [
      { box: await L.box(p.getByRole('tab', { name: /Proforma/ }).first()), text: 'Vouchers → Proforma Invoice tab', side: 'below', gap: 150, shift: -40, maxw: 220 },
      { box: await L.box(row), text: 'The proforma Sales saved. Click it to open', side: 'below', gap: 40, shift: 150, maxw: 240 },
    ]);
    if (process.env.ONLY === '4') { await browser.close(); return; }
    await row.click(); await p.waitForTimeout(1000);
    await L.shot(p, OUT + '05-proforma-open.png', [
      { box: await L.box(p.getByRole('button', { name: 'PDF', exact: true })), text: 'PDF: see what the agent will get', side: 'above', gap: 160, shift: -200, maxw: 200 },
      { box: await L.box(p.getByRole('button', { name: 'Edit', exact: true })), text: 'Edit: change a line first if needed', side: 'above', gap: 90, shift: -120, maxw: 210 },
      { box: await L.box(p.getByRole('button', { name: 'Convert to invoice', exact: true })), text: 'Convert to invoice', side: 'above', gap: 160, shift: 20, maxw: 180 },
    ], { x: 288, y: 0, width: 1152, height: 900 });
    if (process.env.NOCONVERT) { await browser.close(); return; }
    await p.getByRole('button', { name: 'Convert to invoice', exact: true }).click(); await p.waitForTimeout(1500);
    await p.screenshot({ path: OUT + 'raw-convert.png' });
    const d2 = p.locator('[role=dialog]').last();
    if (await d2.count()) console.log('AFTER CONVERT:', (await d2.innerText()).replace(/\n+/g, ' | ').slice(0, 500));
  }
  if (FROM <= 6) {
    // after converting: the new invoice sits in the INVOICE tab, posted
    await L.nav(p, 'Vouchers');
    await p.getByRole('tab', { name: /^INVOICE/ }).first().click(); await p.waitForTimeout(1000);
    const others = p.locator('tr').filter({ hasNotText: /Example Group/ }).filter({ has: p.locator('td') });
    await L.blur(others);
    const row = p.locator('tr', { hasText: 'Example Group B' }).first();
    await L.shot(p, OUT + '06-invoice-made.png', [
      { box: await L.box(p.getByRole('tab', { name: /^INVOICE/ }).first()), text: 'The new invoice is in the INVOICE tab', side: 'below', gap: 150, shift: -60, maxw: 220 },
      { box: await L.box(row), text: 'Same file, same amount, now posted', side: 'below', gap: 40, shift: 150, maxw: 240 },
    ]);
  }
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
