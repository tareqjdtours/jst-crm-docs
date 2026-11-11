// Sales 05 · Ask a hotel to confirm, and record its answer. Example Hotel Amman on file 14.
// Marks the request sent, then records the hotel's confirmation H-55871. FROM=5 starts at the answer.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/05/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.openFile(p, 'Example Group C');
  await L.fileTab(p, 'Hotels');
  const row = () => p.locator('tr', { hasText: 'Example Hotel Amman' }).first();
  const FROM = Number(process.env.FROM || 1);
  if (FROM <= 1) {
    await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '01-email-button.png', [
      { box: await L.box(row().locator('td').nth(1)), text: 'The hotel stay to confirm', side: 'below', gap: 120, maxw: 200 },
      { box: await L.box(row().getByRole('button', { name: 'Email' })), text: 'Click Email', side: 'right', gap: 120, maxw: 180 },
    ]);
    await row().getByRole('button', { name: 'Email' }).click(); await p.waitForTimeout(1500);
    const d = p.locator('[role=dialog]').last();
    const to = d.locator('label', { hasText: /^To/ }).locator('input').first();
    await L.shot(p, OUT + '02-message.png', [
      { box: await L.box(to), text: 'The hotel’s address, from its account', side: 'left', gap: 60, maxw: 200 },
      { box: await L.box(d.locator('label', { hasText: /^Subject/ }).locator('input'), d.locator('textarea').first()), text: 'Subject and message are written for you. Change them if you like', side: 'left', gap: 60, shift: 40, maxw: 200 },
      { box: await L.box(d.getByText(/^Attached/).first()), text: 'The PDF that goes with it', side: 'left', gap: 60, maxw: 200 },
    ]);
    await L.shot(p, OUT + '03-buttons.png', [
      { box: await L.box(d.getByText('Download PDF', { exact: true })), text: 'Save the PDF', side: 'above', gap: 170, shift: -60, maxw: 180, n: 1 },
      { box: await L.box(d.getByText('Open in mail app', { exact: true })), text: 'Open your mail, attach the PDF, send', side: 'above', gap: 60, shift: -40, maxw: 220, n: 2 },
      { box: await L.box(d.getByRole('button', { name: 'Mark as sent' })), text: 'Back here: Mark as sent', side: 'above', gap: 60, shift: -200, maxw: 200, n: 3 },
    ]);
    await d.getByRole('button', { name: 'Mark as sent' }).click(); await p.waitForTimeout(1500);
    const c = p.locator('[role=dialog]').last().getByRole('button', { name: 'Close', exact: true }).last();
    if (await c.count()) { await c.click(); await p.waitForTimeout(800); }
  }
  if (FROM <= 4) {
    await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '04-sent.png', [
      { box: await L.box(row().locator('td').nth(9)), text: 'The file remembers the request went, and when', side: 'below', gap: 120, maxw: 240 },
    ]);
  }
  // the hotel replies with its confirmation number
  if (FROM <= 5) {
  await row().locator('td').nth(1).click(); await p.waitForTimeout(1200);
  const d = p.locator('[role=dialog]').last();
  await L.pick(p, d, 'Status', 'OK — CONFIRMED');
  await field(d, 'Conf. No.').fill('H-55871');
  await p.waitForTimeout(300);
  await field(d, 'Conf. No.').evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
  await L.shot(p, OUT + '05-confirm.png', [
    { box: await L.box(d.getByRole('combobox', { name: 'Status' })), text: 'Status: OK — CONFIRMED', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(field(d, 'Conf. No.')), text: 'The hotel’s confirmation number. Confirmed cannot be saved without it', side: 'below', gap: 60, maxw: 260 },
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 200 },
  ]);
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  }
  await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '06-confirmed.png', [
    { box: await L.box(row().locator('td').nth(8)), text: 'Confirmed, with the hotel’s number', side: 'left', gap: 330, shift: 60, maxw: 220 },
    { box: await L.box(p.getByText(/Drop the hotel’s confirmation email/).first()), text: 'Drop the hotel’s e-mail (as PDF) here to keep it with the booking', side: 'below', gap: 70, shift: 300, maxw: 300 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
