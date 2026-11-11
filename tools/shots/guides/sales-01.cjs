// Sales 01 · Add a new agent. Creates the account "Example Holidays Ltd" (Agents, FIT agents).
// NOSAVE=1 stops before Save.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/01/';
require('fs').mkdirSync(OUT, { recursive: true });
// the saved agent in the Agents list
const after = async (browser, p) => {
  await L.nav(p, 'Accounts');
  await p.getByRole('tab', { name: /^Agents/ }).first().click(); await p.waitForTimeout(800);
  const row = p.getByText('Example Holidays Ltd').first().locator('xpath=ancestor::*[self::tr or @role="row" or contains(@class,"rounded")][1]');
  await L.shot(p, OUT + '04-saved.png', [
    { box: await L.box(row), text: 'The new agent is in the Agents tab, with its own number', side: 'below', gap: 60, shift: 200, maxw: 260 },
  ]);
  await browser.close();
};
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label) }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Accounts');
  if (process.env.FROM === '4') return after(browser, p);
  const btn = p.getByRole('button', { name: 'New', exact: true }).first();
  await L.shot(p, OUT + '01-accounts.png', [
    { box: await L.box(btn), text: 'Accounts → New', side: 'below', gap: 60, shift: 60, maxw: 200 },
  ]);
  await btn.click(); await p.waitForTimeout(1000);
  const d = p.locator('[role=dialog]').last();
  await field(d, 'Account Name').fill('Example Holidays Ltd');
  await L.pick(p, d, 'Main Account', 'Agents');
  await L.pick(p, d, 'Group', 'AG — Agents');
  await field(d, 'Tel').fill('+39 06 0000 0000');
  await field(d, 'Email').fill('reservations@example.com');
  await field(d, 'Contact').fill('Booking desk');
  await field(d, 'Country').fill('Italy');
  await field(d, 'City').fill('Rome');
  await field(d, 'Credit Limit').fill('5000');
  await field(d, 'Payment Due Days').fill('30');
  await p.waitForTimeout(400);
  const combo = (n) => d.getByRole('combobox', { name: n });
  await L.shot(p, OUT + '02-name.png', [
    { box: await L.box(field(d, 'Account Name')), text: 'The agent’s company name', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(combo('Main Account')), text: 'Main Account: Agents', side: 'below', gap: 30, shift: -30, maxw: 200 },
    { box: await L.box(combo('Group')), text: 'Group: AG — Agents', side: 'left', gap: 60, shift: 20, maxw: 200 },
    { box: await L.box(field(d, 'Tel'), field(d, 'Email')), text: 'Phone and the e-mail for bookings', side: 'below', gap: 40, shift: 200, maxw: 220 },
  ]);
  const due = field(d, 'Payment Due Days');
  await due.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '03-terms.png', [
    { box: await L.box(field(d, 'Credit Limit')), text: 'The most they may owe at one time', side: 'above', gap: 40, shift: -60, maxw: 220 },
    { box: await L.box(due), text: 'How many days they have to pay an invoice', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 200 },
  ]);
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  await after(browser, p);
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
