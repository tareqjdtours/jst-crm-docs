// Admin 02 · Change what someone can do (decision 0023, 10 Nov 2026). Example Ops Staff loses "see every file"
// (only their own files from now on) and the right to print and export the files, then Save.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/admin/img/02/';
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: 'System Control', exact: true }).first().click(); await p.waitForTimeout(1000);
  await p.locator('main').getByText('Users Permissions', { exact: true }).first().click(); await p.waitForTimeout(1500);
  const m = p.locator('main');
  const row = m.locator('tr').filter({ hasText: 'Example Ops Staff' }).first();
  console.log('before:', (await row.innerText()).replace(/\s+/g, ' '));
  await L.shot(p, OUT + '01-open.png', [
    { box: await L.box(row), text: 'Click the person to open them', side: 'below', gap: 60, shift: -200, maxw: 220, n: 1 },
  ], { x: 0, y: 0, width: 1440, height: 600 });
  await row.click(); await p.waitForTimeout(1000);
  const d = p.locator('[role=dialog]').last();

  // Reservation files: own files only
  const owner = d.getByLabel('Reservation owner name on the files');
  // its name changes once switched off, so keep hold of the element itself
  const every = await d.getByRole('switch', { name: /Sees (every file|only their own files)/ }).elementHandle();
  await L.scrollIn(p, owner, 260);
  if ((await every.getAttribute('aria-checked')) === 'true') { await every.click(); await p.waitForTimeout(400); }
  await L.shot(p, OUT + '02-own-files.png', [
    { box: await L.box(every), text: 'Off: they see only their own files', side: 'above', gap: 50, shift: -60, maxw: 220, n: 1 },
    { box: await L.box(owner), text: 'The owner name on their files, if it is spelt differently', side: 'below', gap: 40, maxw: 260, n: 2 },
  ]);

  // Reservations tab: the print and export tick
  const tab = d.getByRole('tab', { name: /^Reservations/ });
  await tab.click(); await p.waitForTimeout(500);
  const printLine = d.getByText('Preview, print and export the list and files to Excel', { exact: true }).first();
  const printBox = printLine.locator('xpath=ancestor::*[.//input[@type="checkbox"]][1]');
  await L.scrollIn(p, printLine, 420);
  const cb = printBox.locator('input[type=checkbox]');
  if (await cb.isChecked()) { await cb.click(); await p.waitForTimeout(400); }
  await L.shot(p, OUT + '03-tick.png', [
    { box: await L.box(printBox), text: 'In the Reservations tab, untick what they may no longer do', side: 'below', gap: 30, shift: 300, maxw: 280, n: 3 },
  ]);

  await L.scrollIn(p, d.getByRole('button', { name: 'Save', exact: true }), 200);
  await L.shot(p, OUT + '04-save.png', [
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save. The change applies at once', side: 'below', gap: 50, shift: -120, maxw: 200, n: 1 },
  ], { x: 0, y: 0, width: 1440, height: 520 });
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1500);
  const row2 = m.locator('tr').filter({ hasText: 'Example Ops Staff' }).first();
  console.log('after:', (await row2.innerText()).replace(/\s+/g, ' '));
  await L.shot(p, OUT + '05-saved.png', [
    { box: await L.box(row2.locator('td').nth(3)), text: 'Their count of permissions changes', side: 'below', gap: 60, shift: -60, maxw: 200, n: 1 },
  ], { x: 0, y: 0, width: 1440, height: 600 });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
