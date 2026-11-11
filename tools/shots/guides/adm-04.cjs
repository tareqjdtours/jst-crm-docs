// Admin 04 · Database backup. Takes one named before-year-end in the test copy. NOSAVE=1 stops before Back up now.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/admin/img/04/';
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: 'System Control', exact: true }).first().click(); await p.waitForTimeout(1000);
  const tile = p.locator('main').getByText('Database Backup', { exact: true }).first();
  await L.scrollIn(p, tile, 300);
  await L.shot(p, OUT + '01-tile.png', [
    { box: await L.box(tile), text: 'In System Control, click Database Backup', side: 'above', gap: 24, shift: 230, maxw: 240, n: 1 },
  ]);
  await tile.click(); await p.waitForTimeout(2000);
  const m = p.locator('main');
  console.log('page:', (await m.innerText()).replace(/\s+/g, ' ').slice(0, 700));
  const name = m.getByPlaceholder('e.g. before-year-end');
  await name.fill('before-year-end');
  const btn = m.getByRole('button', { name: 'Back up now', exact: true });
  await L.shot(p, OUT + '02-name.png', [
    { box: await L.box(name), text: 'Give it a name you will recognise. The time is added for you', side: 'below', gap: 130, shift: 120, maxw: 240, n: 1 },
    { box: await L.box(btn), text: 'Click Back up now', side: 'right', gap: 80, maxw: 160, n: 2 },
  ], { x: 0, y: 0, width: 1440, height: 640 });
  if (process.env.NOSAVE) { await browser.close(); return; }
  await btn.click();
  await m.getByRole('button', { name: 'Back up now', exact: true }).waitFor({ timeout: 120000 });
  await p.waitForTimeout(1500);
  const row = m.locator('tr').filter({ hasText: 'before-year-end' }).first();
  console.log('row:', (await row.innerText()).replace(/\s+/g, ' '));
  await L.scrollIn(p, m.getByText('Backups on the server', { exact: true }), 200);
  await L.shot(p, OUT + '03-list.png', [
    { box: await L.box(row.locator('td').first()), text: 'The new backup, newest first, with its size', side: 'below', gap: 60, shift: 80, maxw: 220, n: 1 },
    { box: await L.box(row.getByRole('button', { name: 'Download' })), text: 'Download keeps a copy off the server too', side: 'below', gap: 60, shift: -80, maxw: 200, n: 2 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
