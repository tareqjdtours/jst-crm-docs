// Admin 01 · Add a user. Example Ops Staff (example.ops@example.com), operations permissions ticked by tab.
// The temporary password the server returns once is blurred in the picture. NOSAVE=1 stops before Add employee.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/admin/img/01/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input').first();
const users = async (p) => {
  await p.getByRole('button', { name: 'System Control', exact: true }).first().click(); await p.waitForTimeout(1000);
  await p.locator('main').getByText('Users Permissions', { exact: true }).first().click(); await p.waitForTimeout(1500);
};
(async () => {
  const { browser, page: p } = await L.open();
  await p.getByRole('button', { name: 'System Control', exact: true }).first().click(); await p.waitForTimeout(1000);
  const tile = p.locator('main').getByText('Users Permissions', { exact: true }).first();
  await L.shot(p, OUT + '01-system-control.png', [
    { box: await L.box(p.getByRole('button', { name: 'System Control', exact: true }).first()), text: 'Open System Control', side: 'above', gap: 50, shift: 60, maxw: 180, n: 1 },
    { box: await L.box(tile), text: 'Click Users Permissions', side: 'right', gap: 80, maxw: 200, n: 2 },
  ]);
  await tile.click(); await p.waitForTimeout(1500);
  const m = p.locator('main');
  await L.shot(p, OUT + '02-users.png', [
    { box: await L.box(m.getByRole('button', { name: 'New', exact: true })), text: 'Click New to add someone', side: 'right', gap: 80, maxw: 200, n: 1 },
    { box: await L.box(m.getByText('Permissions', { exact: true }), m.getByText('Last sign-in', { exact: true })), text: 'How many of the 49 permissions each person has, and when they last signed in', side: 'below', gap: 140, shift: 100, maxw: 260, n: 2 },
  ], { x: 0, y: 0, width: 1440, height: 600 });
  await m.getByRole('button', { name: 'New', exact: true }).click(); await p.waitForTimeout(1000);
  const d = p.locator('[role=dialog]').last();
  await field(d, 'Email').fill('example.ops@example.com');
  await field(d, 'Name').fill('Example Ops Staff');
  await field(d, 'Job title').fill('Operations');
  await L.shot(p, OUT + '03-who.png', [
    { box: await L.box(field(d, 'Email'), field(d, 'Job title')), text: 'Their work e-mail (they sign in with it), name and job title', side: 'left', gap: 40, maxw: 200, n: 1 },
    { box: await L.box(d.getByRole('combobox').first()), text: 'Or copy the permissions of someone who does the same job', side: 'below', gap: 110, shift: -60, maxw: 220, n: 2 },
    { box: await L.box(d.getByRole('tab', { name: /^Reservations/ }), d.getByRole('tab', { name: /^Other/ })), text: 'One tab per area of the system', side: 'below', gap: 40, shift: 0, maxw: 200, n: 3 },
  ]);
  // Reservations: list and file in full; Reports: all
  const cardOf = (title) => d.getByText(title, { exact: true }).first().locator('xpath=ancestor::*[.//button[normalize-space()="All" or normalize-space()="None"]][1]');
  const allOn = async (title) => { await cardOf(title).getByRole('button', { name: 'All', exact: true }).first().click(); await p.waitForTimeout(250); };
  await allOn('Reservations list');
  await allOn('Reservation file');
  await L.scrollIn(p, d.getByText('Reservations list', { exact: true }), 260);
  await L.shot(p, OUT + '04-ticks.png', [
    { box: await L.box(d.getByText('Reservations list', { exact: true })), text: 'One card per screen', side: 'left', gap: 40, maxw: 160, n: 1 },
    { box: await L.box(d.getByText('Open the list, search and open a file', { exact: true }).first()), text: 'Each line is one thing they may do. Tick it to allow it', side: 'right', gap: 80, maxw: 220, n: 2 },
    { box: await L.box(cardOf('Reservations list').getByRole('button', { name: /^(All|None)$/ }).first()), text: 'All ticks the whole card; None clears it', side: 'left', gap: 90, maxw: 200, n: 3 },
  ]);
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Add employee', exact: true }).click(); await p.waitForTimeout(1800);
  const s = p.locator('[role=dialog]').last();
  console.log('AFTER ADD:', (await s.innerText()).replace(/\n+/g, ' | ').replace(/[A-Za-z0-9!@#$%^&*_\-]{10,}/g, '[hidden]').slice(0, 600));
  await s.locator('code, kbd, input[readonly], [class*="mono"]').evaluateAll((els) => els.forEach((e) => { e.style.filter = 'blur(7px)'; }));
  await p.screenshot({ path: OUT + 'raw-password.png' });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
