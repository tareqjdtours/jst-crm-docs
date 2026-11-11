// Operations handbook · test data. Adds two guide accounts (Example Guide Sami, Example Guide Lina)
// so the guide and roster guides have someone to pick. Run once; skips a name that already exists.
const L = require('../lib.cjs');
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Accounts');
  for (const name of ['Example Guide Sami', 'Example Guide Lina']) {
    if (await p.getByText(name, { exact: true }).count()) { console.log('exists', name); continue; }
    await p.getByRole('button', { name: 'New', exact: true }).first().click(); await p.waitForTimeout(1000);
    const d = p.locator('[role=dialog]').last();
    await field(d, 'Account Name').fill(name);
    await L.pick(p, d, 'Main Account', 'Guides');
    await L.pick(p, d, 'Group', 'GD — Guides');
    await field(d, 'Mobile').fill('+962 79 000 0000');
    await field(d, 'Daily Rate').fill('60');
    await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
    console.log('saved', name);
  }
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
