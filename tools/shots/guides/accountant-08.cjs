// Accountant 08 · Statement of account for an agent (Example Travel Ltd). Reads only; changes nothing.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/08/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: /^Reports$/ }).nth(1).click(); await p.waitForTimeout(800);
  const item = p.getByRole('button', { name: 'Statement of Account' });
  await L.blur(p.locator('main'));
  await L.shot(p, OUT + '01-menu.png', [
    { box: await L.box(p.getByRole('button', { name: /^Reports$/ }).nth(1), item), text: 'Accounting → Reports → Statement of Account', side: 'right', gap: 60, maxw: 240 },
  ]);
  await p.locator('main').evaluate((e) => { e.style.filter = ''; });
  await item.click(); await p.waitForTimeout(1200);
  await L.pick(p, p.locator('body'), 'Account No / Name', 'Example Travel Ltd');
  await p.waitForTimeout(1200);
  const tile = (re) => p.getByText(re).first().locator('..');
  await L.shot(p, OUT + '02-statement.png', [
    { box: await L.box(p.getByRole('combobox', { name: 'Account No / Name' })), text: 'Choose the account', side: 'left', gap: 40, maxw: 200 },
    { box: await L.box(p.getByLabel('From Date'), p.getByLabel('To Date')), text: 'The dates to show', side: 'above', gap: 40, maxw: 200 },
    { box: await L.box(tile(/^Previous balance$/i), tile(/^Closing balance$/i)), text: 'Before + debits − credits = what they owe now', side: 'right', gap: 40, maxw: 240 },
    { box: await L.box(p.getByRole('button', { name: 'Print', exact: true }), p.getByRole('button', { name: 'Excel', exact: true })), text: 'Print it, e-mail it or open it in Excel', side: 'above', gap: 30, maxw: 260 },
  ]);
  const rows = p.locator('tbody tr');
  const paid = rows.filter({ hasText: /^\s*Paid/ }).first();
  const open = rows.filter({ hasText: /^\s*Open/ }).first();
  await paid.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(500);
  await L.shot(p, OUT + '03-lines.png', [
    { box: await L.box(paid.locator('td').first()), text: 'Paid: a receipt settled this invoice', side: 'left', gap: 40, maxw: 200 },
    { box: await L.box(open.locator('td').first()), text: 'Open: still owed', side: 'left', gap: 40, shift: 30, maxw: 200 },
    { box: await L.box(rows.filter({ hasText: 'RECEIPT' }).first().locator('td').first()), text: 'The receipt that paid it', side: 'left', gap: 40, shift: 30, maxw: 200 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
