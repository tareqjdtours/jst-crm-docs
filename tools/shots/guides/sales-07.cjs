// Sales 07 · Repeat a file as a series (ADR 0022, 9 Nov 2026). File 14 (Example Group C, 5 Dec) copied to
// 12, 19 and 26 Dec 2026 with "Repeat every 7 days until", prices carried. NOSAVE=1 stops before creating;
// FROM=4 shoots only the result.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/07/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  if (process.env.FROM !== '4') {
    await L.openFile(p, 'Example Group C');
    const btn = p.getByRole('button', { name: 'Series', exact: true });
    await btn.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '01-series-button.png', [
      { box: await L.box(btn), text: 'On the file, click Series', side: 'above', gap: 60, shift: 60, maxw: 200 },
    ]);
    await btn.click(); await p.waitForTimeout(1500);
    const d = p.locator('[role=dialog]').last();
    const every = d.getByLabel(/Repeat every/);
    const until = d.getByLabel(/^Until/);
    const fill = d.getByRole('button', { name: 'Fill the list', exact: true });
    await every.fill('7');
    await until.fill('2026-12-26');
    await fill.click(); await p.waitForTimeout(500);
    const carry = d.getByRole('switch').first();
    if ((await carry.getAttribute('aria-checked')) !== 'true') await carry.click();
    await p.waitForTimeout(400);
    const dates = d.locator('input[type=date]').filter({ hasNot: until }).filter({ hasNotText: 'x' });
    const addDate = d.getByRole('button', { name: /Add date/ });
    await addDate.evaluate((e) => e.scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
    await p.evaluate(() => { const s = document.querySelector('[role=dialog] .overflow-y-auto, [role=dialog] [data-scroll]'); if (s) s.scrollBy(0, -80); });
    const list = d.getByRole('button', { name: /Remove|Delete/ });
    console.log('date rows:', await list.count());
    await L.shot(p, OUT + '02-dates.png', [
      { box: await L.box(every, fill), text: 'Fill the list: every 7 days until the last date', side: 'above', gap: 50, shift: 260, maxw: 240, n: 1 },
      { box: await L.box(list.first(), list.last()), text: 'Change or remove any date', side: 'below', gap: 30, shift: 260, maxw: 200, n: 2 },
      { box: await L.box(addDate), text: 'Add one more date', side: 'below', gap: 40, shift: -60, maxw: 160, n: 3 },
      { box: await L.box(carry), text: 'On: copy the prices too', side: 'below', gap: 40, shift: 140, maxw: 180, n: 4 },
    ]);
    const tbl = d.getByText('Files that will be created', { exact: true });
    await tbl.evaluate((e) => e.scrollIntoView({ block: 'start' })); await p.waitForTimeout(400);
    const create = d.getByRole('button', { name: /^Create \d+ files?$/ });
    await L.shot(p, OUT + '03-preview.png', [
      { box: await L.box(d.locator('table').last()), text: 'Check every copy: its name and dates', side: 'below', gap: 40, shift: -200, maxw: 240, n: 5 },
      { box: await L.box(create), text: 'Click Create', side: 'above', gap: 40, shift: -40, maxw: 160, n: 6 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await create.click(); await p.waitForTimeout(2500);
  }
  await L.nav(p, 'Reservations');
  await p.waitForTimeout(1200);
  const badge = p.getByText(/^Series · \d+$/).first();
  console.log('badge:', await badge.count());
  const head = badge.locator('xpath=ancestor::li[1]');
  await head.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  const toggle = head.locator('button').first();
  await toggle.click(); await p.waitForTimeout(800);
  const members = p.getByText(/^\d+ of \d+$/);
  console.log('members:', await members.count());
  await L.shot(p, OUT + '04-copies.png', [
    { box: await L.box(toggle), text: 'Open or fold the series', side: 'left', gap: 30, maxw: 120, n: 9 },
    { box: await L.box(badge), text: 'The original, with how many files are in its series', side: 'above', gap: 50, shift: 200, maxw: 220, n: 7 },
    { box: await L.box(members.first(), members.last()), text: 'The copies sit under it: each a file of its own', side: 'right', gap: 60, maxw: 220, n: 8 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
