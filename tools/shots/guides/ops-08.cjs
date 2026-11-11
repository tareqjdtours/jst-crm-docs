// Operations 08 · Cancel or reinstate a file. File 17 (Example Group C — weekly, 26 Dec 2026) is cancelled
// with a reason, then reinstated. NOSAVE=1 stops before cancelling; FROM=3 starts at the cancelled file, FROM=4 at the reinstate.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/08/';
require('fs').mkdirSync(OUT, { recursive: true });
const open17 = async (p) => {
  await L.nav(p, 'Reservations');
  await p.getByRole('button', { name: /^All \(/ }).click(); await p.waitForTimeout(500);
  await p.locator('li').filter({ hasText: '26 Dec 2026' }).filter({ hasText: 'Example Group C' }).first().click();
  await p.waitForTimeout(1500);
  console.log('opened:', await p.getByText(/^File \d+$/).first().innerText());
};
(async () => {
  const { browser, page: p } = await L.open();
  await open17(p);
  const FROM = Number(process.env.FROM || 1);
  if (FROM < 3) {
    const panel = p.getByText(/^What.s stopping this|^What you can do with this file/).first();
    // the panel starts folded (11 Nov 2026): open it
    if (!(await p.getByText(/Nothing in the way/).count())) { await panel.click(); await p.waitForTimeout(600); }
    await L.scrollIn(p, panel, 200);
    await L.shot(p, OUT + '01-stopping.png', [
      { box: await L.box(panel), text: 'What you may do with this file, and what stops the rest', side: 'above', gap: 40, shift: 200, maxw: 240, n: 1 },
      { box: await L.box(p.getByText(/Nothing in the way/).first()), text: 'Cancel is allowed: upcoming and not invoiced', side: 'below', gap: 30, shift: -60, maxw: 220, n: 2 },
      { box: await L.box(p.getByRole('button', { name: 'Cancel', exact: true }).first()), text: 'The Cancel button', side: 'right', gap: 300, maxw: 160, n: 3 },
    ]);
    await p.getByRole('button', { name: 'Cancel', exact: true }).first().click(); await p.waitForTimeout(900);
    const d = p.locator('[role=dialog], [role=alertdialog]').last();
    await d.locator('input, textarea').first().fill('The agent cancelled the 26 December departure.');
    await L.shot(p, OUT + '02-reason.png', [
      { box: await L.box(d.locator('input, textarea').first()), text: 'Say why, in a few words. It is kept on the file', side: 'above', gap: 60, maxw: 220, n: 1 },
      { box: await L.box(d.getByRole('button', { name: /Yes, cancel/ })), text: 'Yes, cancel this file', side: 'below', gap: 60, maxw: 180, n: 2 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: /Yes, cancel/ }).click(); await p.waitForTimeout(1800);
  }
  await p.locator('main').evaluate((e) => e.scrollTo(0, 0)); await p.waitForTimeout(300);
  const reinstate = p.getByRole('button', { name: 'Reinstate', exact: true });
  if (FROM <= 3) {
    // warnings start folded (11 Nov 2026): open them so the reason shows
    const warn = p.getByText(/^\d+ warnings? on this file$/).first();
    if (await warn.count()) { await warn.click(); await p.waitForTimeout(600); }
    console.log('reason line:', await p.getByText(/agent cancelled the 26 December/).first().innerText().catch(() => 'none'));
    await L.shot(p, OUT + '03-cancelled.png', [
      { box: await L.box(p.getByText('Cancelled', { exact: true }).first()), text: 'The file is cancelled', side: 'right', gap: 360, maxw: 180, n: 1 },
      { box: await L.box(p.getByText(/agent cancelled the 26 December/).first()), text: 'With the reason you gave', side: 'below', gap: 40, shift: 200, maxw: 180, n: 2 },
      { box: await L.box(reinstate), text: 'Reinstate brings it back', side: 'right', gap: 250, maxw: 180, n: 3 },
    ]);
  }
  await reinstate.click(); await p.waitForTimeout(900);
  const c = p.locator('[role=dialog], [role=alertdialog]');
  if (await c.count()) {
    const d = c.last();
    console.log('reinstate dialog buttons:', (await d.getByRole('button').allInnerTexts()).join(' | '));
    await L.shot(p, OUT + '04-reinstate-confirm.png', [
      { box: await L.box(d.getByRole('button').last()), text: 'Confirm', side: 'below', gap: 60, maxw: 160 },
    ]);
    await d.getByRole('button').last().click(); await p.waitForTimeout(1800);
  } else { await p.waitForTimeout(1200); }
  await p.locator('main').evaluate((e) => e.scrollTo(0, 0)); await p.waitForTimeout(300);
  await L.shot(p, OUT + '04-reinstated.png', [
    { box: await L.box(p.getByText('Upcoming', { exact: true }).first()), text: 'Back to Upcoming, with everything on it as it was', side: 'right', gap: 360, maxw: 220 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
