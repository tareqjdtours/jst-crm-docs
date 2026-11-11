// Admin 05 · Edit a Setup list. Hotel Meals gets "AI" (All Inclusive). NOSAVE=1 stops before Save.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/admin/img/05/';
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: 'Setup Menu', exact: true }).first().click(); await p.waitForTimeout(1200);
  const m = p.locator('main');
  const tile = m.getByText('Hotel Meals', { exact: true }).first();
  await L.scrollIn(p, tile, 300);
  await L.shot(p, OUT + '01-menu.png', [
    { box: await L.box(p.getByRole('button', { name: 'Setup Menu', exact: true }).first()), text: 'Open Setup Menu', side: 'above', gap: 50, shift: 60, maxw: 160, n: 1 },
    { box: await L.box(tile), text: 'Click the list to change, here Hotel Meals', side: 'right', gap: 80, maxw: 220, n: 2 },
  ]);
  await tile.click(); await p.waitForTimeout(1500);
  const newBtn = m.getByRole('button', { name: 'New', exact: true }).first();
  await L.shot(p, OUT + '02-list.png', [
    { box: await L.box(newBtn), text: 'Click New to add a row', side: 'below', gap: 24, shift: 90, maxw: 180, n: 1 },
    { box: await L.box(m.locator('table').first()), text: 'Click a row to change it', side: 'below', gap: 30, shift: 200, maxw: 180, n: 2 },
  ], { x: 0, y: 0, width: 1440, height: 760 });
  await newBtn.click(); await p.waitForTimeout(900);
  const d = p.locator('[role=dialog]').last();
  const code = d.locator('label').filter({ hasText: /^\s*Meal Code/ }).locator('input').first();
  await code.fill('AI');
  await d.getByLabel('All Inc', { exact: true }).check();
  await L.shot(p, OUT + '03-new.png', [
    { box: await L.box(code), text: 'Type the code staff will pick', side: 'below', gap: 50, shift: 60, maxw: 200, n: 1 },
    { box: await L.box(d.getByLabel('All Inc', { exact: true }), d.getByText('All Inc', { exact: true })), text: 'Tick what kind of meal plan it is', side: 'left', gap: 40, maxw: 180, n: 2 },
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Save', side: 'above', gap: 40, shift: -70, maxw: 120, n: 3 },
  ]);
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1500);
  const row = m.locator('tr').filter({ hasText: /^\s*\d+\s*AI\b/ }).first();
  console.log('row:', (await row.innerText()).replace(/\s+/g, ' '));
  await L.shot(p, OUT + '04-saved.png', [
    { box: await L.box(row), text: 'The new meal plan is on the list, and on every hotel line at once', side: 'below', gap: 50, shift: -200, maxw: 260, n: 1 },
  ], { x: 0, y: 0, width: 1440, height: 780 });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
