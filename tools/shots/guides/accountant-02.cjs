// Accountant 02 · Approve a supplier invoice. Uses file "Example Group A" (transport line, Example Coaches, 120 JOD).
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/02/';
require('fs').mkdirSync(OUT, { recursive: true });
const dlg = (p) => p.locator('[role=dialog]').last();
(async () => {
  const { browser, page: p } = await L.open();
  const FROM = Number(process.env.FROM || 1);
  if (FROM <= 2) {
  await L.nav(p, 'Reservations');
  await p.getByText('Example Group A').first().click(); await p.waitForTimeout(1500);
  await p.getByRole('tab', { name: /Finance/ }).first().click(); await p.waitForTimeout(900);
  const ir = p.getByRole('button', { name: 'Invoice Received', exact: true });
  await L.scrollTo(p, ir, 300);
  await L.shot(p, OUT + '01-finance-tab.png', [
    { box: await L.box(p.getByRole('tab', { name: /Finance/ }).first()), text: 'On the file, open the Finance tab', side: 'below', gap: 120, shift: -170, maxw: 220 },
    { box: await L.box(ir), text: 'Click Invoice Received when the supplier’s invoice arrives', side: 'below', gap: 50, maxw: 260 },
  ]);
  await ir.click(); await p.waitForTimeout(1000);
  const d = dlg(p), ins = d.locator('input');
  await ins.first().fill('C-2001');
  await L.shot(p, OUT + '02-invoice-received.png', [
    { box: await L.box(ins.first()), text: 'Their invoice number, as printed', side: 'left', gap: 40, maxw: 190 },
    { box: await L.box(ins.nth(2)), text: 'Check the amount matches their invoice', side: 'left', gap: 40, shift: 40, maxw: 190 },
    { box: await L.box(d.getByText('WILL POST')), text: 'What it will post in the accounts', side: 'left', gap: 40, shift: 30, maxw: 190 },
    { box: await L.box(d.getByRole('button', { name: 'Send for approval' })), text: 'Send it to accounting', side: 'above', gap: 80, shift: -120, maxw: 200 },
  ], { x: 288, y: 0, width: 1152, height: 900 });
  if (process.env.NOSEND) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Send for approval' }).click(); await p.waitForTimeout(1200);
  }
  await p.reload(); await p.waitForTimeout(2000);
  await L.nav(p, 'Inbox');
  const row = p.locator('tr', { hasText: 'C-2001' });
  if (FROM <= 3) await L.shot(p, OUT + '03-to-approve.png', [
    { box: await L.box(p.getByRole('tab', { name: /To approve/ })), text: 'Inbox → To approve', side: 'below', gap: 160, shift: -40, maxw: 200 },
    { box: await L.box(row.getByText(/C-2001/).first()), text: 'What came in, and for which file', side: 'below', gap: 90, maxw: 220 },
    { box: await L.box(row.getByRole('button', { name: 'Approve', exact: true })), text: 'Correct? Click Approve', side: 'below', gap: 70, shift: -60, maxw: 190 },
    { box: await L.box(row.getByRole('button', { name: 'Send back', exact: true })), text: 'Wrong? Send back with a note', side: 'below', gap: 160, shift: -110, maxw: 190 },
  ]);
  if (FROM <= 3) {
  await row.getByRole('button', { name: 'Approve', exact: true }).click(); await p.waitForTimeout(1200);
  }
  await p.getByRole('tab', { name: /To pay/ }).click(); await p.waitForTimeout(900);
  const prow = p.locator('tr', { hasText: 'C-2001' });
  await L.shot(p, OUT + '04-to-pay.png', [
    { box: await L.box(p.getByRole('tab', { name: /To pay/ })), text: 'Approved invoices wait in To pay', side: 'above', gap: 30, shift: 160, maxw: 260 },
    { box: await L.box(prow), text: 'Now posted, and due on the supplier’s terms', side: 'below', gap: 60, shift: 200, maxw: 250 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
