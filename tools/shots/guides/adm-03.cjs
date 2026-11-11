// Admin 03 · Reset a password, switch someone off. Test user Example Ops Staff only — never the admin.
// The new temporary password is replaced with dots in the page before any picture is taken. FROM=2 skips the reset.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/admin/img/03/';
const FROM = +(process.env.FROM || 1);
const openUser = async (p) => {
  await p.locator('main').locator('tr').filter({ hasText: 'Example Ops Staff' }).first().click(); await p.waitForTimeout(1000);
  return p.locator('[role=dialog]').last();
};
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: 'System Control', exact: true }).first().click(); await p.waitForTimeout(1000);
  await p.locator('main').getByText('Users Permissions', { exact: true }).first().click(); await p.waitForTimeout(1500);
  let d = await openUser(p);
  if (FROM < 2) {
    await L.shot(p, OUT + '01-reset.png', [
      { box: await L.box(d.getByRole('button', { name: 'Reset password', exact: true })), text: 'Open the person and click Reset password', side: 'right', gap: 70, maxw: 220, n: 1 },
    ], { x: 0, y: 0, width: 1440, height: 520 });
    await d.getByRole('button', { name: 'Reset password', exact: true }).click(); await p.waitForTimeout(700);
    const c = p.locator('[role=alertdialog]').filter({ hasText: 'Reset their password?' }).last();
    await L.shot(p, OUT + '02-confirm.png', [
      { box: await L.box(c.getByRole('button', { name: 'Reset password', exact: true })), text: 'Confirm. Every session they have open ends', side: 'below', gap: 50, shift: -80, maxw: 220, n: 1 },
    ]);
    await c.getByRole('button', { name: 'Reset password', exact: true }).click();
    const code = p.locator('[role=dialog] code').first();
    await code.waitFor({ timeout: 10000 });
    await code.evaluate((e) => { e.textContent = '••••••••••••'; });
    await p.waitForTimeout(300);
    const s = p.locator('[role=dialog]').filter({ has: p.locator('code') }).last();
    await L.shot(p, OUT + '03-issued.png', [
      { box: await L.box(s.getByRole('button', { name: /^Copy/ })), text: 'Copy it and give it to them. They choose their own at sign-in', side: 'below', gap: 60, shift: -120, maxw: 240, n: 1 },
    ], { x: 0, y: 0, width: 1440, height: 420 });
    await s.getByRole('button', { name: 'Done', exact: true }).click(); await p.waitForTimeout(1000);
    if (await p.locator('[role=dialog]').count()) await p.keyboard.press('Escape');
    await p.waitForTimeout(500);
    d = await openUser(p);
  }
  const sw = d.getByRole('switch').first();
  await sw.click(); await p.waitForTimeout(400);
  await L.shot(p, OUT + '04-switch-off.png', [
    { box: await L.box(sw, d.getByText('Inactive — cannot sign in')), text: 'Turn the switch off', side: 'below', gap: 50, shift: 40, maxw: 180, n: 1 },
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Then Save', side: 'below', gap: 60, shift: -60, maxw: 140, n: 2 },
  ], { x: 0, y: 0, width: 1440, height: 620 });
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1500);
  const m = p.locator('main');
  await m.getByPlaceholder(/Search name/).fill('Example'); await p.waitForTimeout(500);
  await m.getByRole('switch').first().click(); await p.waitForTimeout(800);
  const row = m.locator('tr').filter({ hasText: 'Example Ops Staff' }).first();
  console.log('row:', (await row.innerText()).replace(/\s+/g, ' '));
  await L.shot(p, OUT + '05-inactive.png', [
    { box: await L.box(m.getByRole('switch').first()), text: 'Switched-off people are hidden. Turn on Show inactive to see them', side: 'above', gap: 30, shift: 220, maxw: 260, n: 1 },
    { box: await L.box(row.locator('td').nth(4)), text: 'Inactive: they cannot sign in', side: 'below', gap: 70, shift: -140, maxw: 200, n: 2 },
  ], { x: 0, y: 0, width: 1440, height: 620 });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
