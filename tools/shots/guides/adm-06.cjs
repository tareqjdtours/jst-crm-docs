// Admin 06 · Read the change log (decision 0024, 10 Nov 2026): the tile, the filters, one record's edits.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/admin/img/06/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: 'System Control', exact: true }).first().click(); await p.waitForTimeout(1000);
  const m = p.locator('main');
  const tile = m.getByText('Change log', { exact: true }).first();
  await L.scrollIn(p, tile, 300);
  await L.shot(p, OUT + '01-tile.png', [
    { box: await L.box(tile), text: 'Under Logs, click Change log', side: 'above', gap: 40, shift: 260, maxw: 200, n: 1 },
  ]);
  await tile.click(); await p.waitForTimeout(2000);
  await p.evaluate(() => window.scrollTo(0, 0));
  const from = m.getByText('From', { exact: true }).first();
  const search = m.getByPlaceholder(/File number, words/);
  const clear = m.getByRole('button', { name: 'Clear', exact: true }).first();
  await L.shot(p, OUT + '02-list.png', [
    { box: await L.box(from, clear), text: 'Narrow it down: dates, who, which kind of record, words', side: 'below', gap: 40, shift: 200, maxw: 260, n: 2 },
    { box: await L.box(m.locator('tbody tr').first()), text: 'Newest first: when, who, on which record, what they did', side: 'below', gap: 120, shift: 300, maxw: 260, n: 3 },
  ], { x: 0, y: 0, width: 1440, height: 760 });
  // one reservation's history: type its number in the search box
  await search.fill('JV-25-0001'); await p.waitForTimeout(1800);
  console.log('rows:', await m.locator('tbody tr').count());
  await L.shot(p, OUT + '03-record.png', [
    { box: await L.box(search), text: 'Type a voucher or file number, a name or words', side: 'left', gap: 380, shift: 60, maxw: 220, n: 4 },
    { box: await L.box(m.locator('tbody tr').first().locator('td').last()), text: 'Details: what was changed', side: 'below', gap: 230, shift: -100, maxw: 220, n: 5 },
  ], { x: 0, y: 0, width: 1440, height: 760 });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
