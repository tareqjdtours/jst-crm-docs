// Screenshot helpers for the user guides: sign in to the CRM's local test copy,
// then draw red boxes, numbered labels and arrows on the page before each screenshot.
// Needs the CRM front end's node_modules (Playwright) and Google Chrome.
const { createRequire } = require('module');
const req = createRequire('/Users/abuenzo/Work/jst-crm-frontend/package.json');
exports.chromium = req('playwright').chromium;

exports.UI = process.env.CRM_UI || 'http://localhost:5182';

exports.box = async (...locs) => {
  const bs = [];
  for (const l of locs) { const b = await l.boundingBox(); if (!b) throw new Error('no box for a locator'); bs.push(b); }
  const x = Math.min(...bs.map(b => b.x)), y = Math.min(...bs.map(b => b.y));
  const r = Math.max(...bs.map(b => b.x + b.width)), btm = Math.max(...bs.map(b => b.y + b.height));
  return { x, y, width: r - x, height: btm - y };
};

// items: [{ box, text, side: 'above'|'below'|'left'|'right', gap, shift, maxw }]
exports.annotate = async (page, items) => {
  await page.evaluate((items) => {
    const RED = '#e11d48', ns = 'http://www.w3.org/2000/svg';
    const root = document.createElement('div');
    root.id = '__ann';
    root.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;font-family:-apple-system,Helvetica,Arial,sans-serif';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;inset:0;overflow:visible';
    svg.innerHTML = `<defs><marker id="ah" markerUnits="userSpaceOnUse" markerWidth="16" markerHeight="16" refX="12" refY="8" orient="auto"><path d="M0,1 L14,8 L0,15 z" fill="${RED}"/></marker></defs>`;
    // boxes under the arrows, arrows under the labels, so a label is never hidden by a box
    const boxes = document.createElement('div'), labels = document.createElement('div');
    root.append(boxes, svg, labels); document.body.appendChild(root);
    items.forEach((it, i) => {
      const pad = 6, b = it.box;
      const hl = document.createElement('div');
      hl.style.cssText = `position:absolute;left:${b.x - pad}px;top:${b.y - pad}px;width:${b.width + 2 * pad}px;height:${b.height + 2 * pad}px;border:3px solid ${RED};border-radius:10px;background:rgba(225,29,72,.08);box-shadow:0 0 0 3px rgba(255,255,255,.7)`;
      boxes.appendChild(hl);
      if (!it.text) return;
      const bub = document.createElement('div');
      bub.innerHTML = `<span style="display:inline-flex;width:22px;height:22px;border-radius:50%;background:#fff;color:${RED};font-weight:800;font-size:13px;align-items:center;justify-content:center;margin-right:8px;flex:none">${it.n ?? i + 1}</span><span>${it.text}</span>`;
      bub.style.cssText = `position:absolute;display:flex;align-items:center;background:${RED};color:#fff;font-weight:700;font-size:14px;line-height:1.25;padding:8px 12px;border-radius:10px;max-width:${it.maxw || 250}px;box-shadow:0 4px 14px rgba(0,0,0,.28)`;
      labels.appendChild(bub);
      const w = bub.offsetWidth, h = bub.offsetHeight, gap = it.gap ?? 70, sh = it.shift ?? 0;
      const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      let bx, by, ax, ay, tx, ty;
      if (it.side === 'above') { bx = cx - w / 2 + sh; by = b.y - pad - gap - h; ax = bx + w / 2; ay = by + h; tx = Math.min(Math.max(ax, b.x), b.x + b.width); ty = b.y - pad; }
      else if (it.side === 'below') { bx = cx - w / 2 + sh; by = b.y + b.height + pad + gap; ax = bx + w / 2; ay = by; tx = Math.min(Math.max(ax, b.x), b.x + b.width); ty = b.y + b.height + pad; }
      else if (it.side === 'left') { bx = b.x - pad - gap - w; by = cy - h / 2 + sh; ax = bx + w; ay = by + h / 2; tx = b.x - pad; ty = Math.min(Math.max(ay, b.y), b.y + b.height); }
      else { bx = b.x + b.width + pad + gap; by = cy - h / 2 + sh; ax = bx; ay = by + h / 2; tx = b.x + b.width + pad; ty = Math.min(Math.max(ay, b.y), b.y + b.height); }
      bub.style.left = bx + 'px'; bub.style.top = by + 'px';
      const path = document.createElementNS(ns, 'path');
      const mx = (ax + tx) / 2, my = (ay + ty) / 2, horiz = it.side === 'left' || it.side === 'right';
      path.setAttribute('d', horiz ? `M${ax},${ay} C${mx},${ay} ${mx},${ty} ${tx},${ty}` : `M${ax},${ay} C${ax},${my} ${tx},${my} ${tx},${ty}`);
      path.setAttribute('fill', 'none'); path.setAttribute('stroke', RED); path.setAttribute('stroke-width', '3.5');
      path.setAttribute('stroke-linecap', 'round'); path.setAttribute('marker-end', 'url(#ah)');
      svg.appendChild(path);
    });
  }, items);
};
exports.clear = (page) => page.evaluate(() => document.getElementById('__ann')?.remove());

exports.open = async ({ width = 1440, height = 900 } = {}) => {
  const browser = await exports.chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1.5 });
  await page.goto(exports.UI);
  await page.fill('input[type=email]', process.env.CRM_EMAIL || 'admin@jordanselect.com');
  await page.fill('input[type=password]', process.env.PW);
  await page.click('button[type=submit]');
  await page.waitForTimeout(2000);
  return { browser, page };
};
exports.nav = async (page, label) => {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.getByRole('button', { name: new RegExp('^' + esc + '(\\s*new)?$', 'i') }).first().click();
  await page.waitForTimeout(1200);
};
// choose an option in the app's own dropdown (a combobox button, a filter box once the list is long)
exports.pick = async (page, scope, label, text) => {
  await scope.getByRole('combobox', { name: label }).first().click();
  await page.waitForTimeout(250);
  const f = page.getByPlaceholder('Filter…');
  if (await f.count()) await f.fill(text);
  await page.getByRole('option').filter({ hasText: text }).first().click();
  await page.waitForTimeout(350);
};
// open a reservation file from the Reservations list by its group name
exports.openFile = async (page, groupName) => {
  await exports.nav(page, 'Reservations');
  await page.getByText(groupName, { exact: true }).first().click();
  await page.waitForTimeout(1500);
};
// click a tab on the open file ("Hotels", "Trans.", …); the count after the name is ignored
exports.fileTab = async (page, name) => {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.getByRole('tab', { name: new RegExp('^' + esc) }).first().click();
  await page.waitForTimeout(900);
};
// annotate, screenshot, clear
exports.shot = async (page, path, items = [], clip) => {
  if (items.length) await exports.annotate(page, items);
  await page.screenshot({ path, ...(clip ? { clip } : {}) });
  await exports.clear(page);
  console.log('saved', path);
};
// blur rows that belong to other people's test data before a screenshot
exports.blur = async (...locs) => { for (const l of locs) await l.evaluateAll((els) => els.forEach((e) => { e.style.filter = 'blur(6px)'; })); };
exports.scrollTo = async (page, loc, offset = 260) => {
  await loc.scrollIntoViewIfNeeded();
  await loc.evaluate((e, off) => { const r = e.getBoundingClientRect(); window.scrollBy(0, r.top - off); }, offset);
  await page.waitForTimeout(400);
};
// scroll whichever box actually scrolls so `loc` sits `offset` px below the top of the window
exports.scrollIn = async (page, loc, offset = 140) => {
  await loc.first().evaluate((e, off) => {
    let n = e.parentElement;
    while (n && !(n.scrollHeight > n.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(n).overflowY))) n = n.parentElement;
    const top = e.getBoundingClientRect().top - off;
    if (n) n.scrollBy(0, top); else window.scrollBy(0, top);
  }, offset);
  await page.waitForTimeout(400);
};
