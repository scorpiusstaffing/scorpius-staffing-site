/**
 * Scorpius Staffing logo builder — wordmark only (no separate monogram)
 * Horizontal "Scorpius Staffing." for nav, headers, email signatures
 * Stacked "Scorpius / Staffing." for square contexts (avatars, social, app icons)
 * Like Spencer Stuart, Lazard, Heidrick & Struggles do it
 */
import opentype from 'opentype.js';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const NAVY      = '#1B2D45';
const NAVY_DEEP = '#0F1B30';
const CREAM     = '#F0F2F7';
const WHITE     = '#FFFFFF';
const RED       = '#C8362A';

const font = opentype.loadSync(path.join(__dirname, 'raw/fraunces-600.ttf'));

function makePath(text, fontSize, x = 0, y = 0, letterSpacing = 0) {
  const glyphs = font.stringToGlyphs(text);
  const scale = (1 / font.unitsPerEm) * fontSize;
  let cursor = x;
  const parts = [];
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];
    const p = g.getPath(cursor, y, fontSize);
    parts.push(p.toPathData(3));
    cursor += g.advanceWidth * scale + letterSpacing;
  }
  return { paths: parts, advanceTo: cursor };
}

function buildWordmark({ fontSize = 100 }) {
  const ls = -fontSize * 0.005;
  const baseline = fontSize * 0.78;
  const main = makePath('Scorpius Staffing', fontSize, 0, baseline, ls);
  const dot  = makePath('.', fontSize, main.advanceTo, baseline, ls);
  return {
    mainD: main.paths.join(' '),
    dotD:  dot.paths.join(' '),
    totalWidth: dot.advanceTo,
    totalHeight: fontSize
  };
}

function buildStacked({ fontSize = 100 }) {
  // Two lines, tight tracking
  const ls = -fontSize * 0.01;
  const lineGap = fontSize * 0.06;
  const baseline1 = fontSize * 0.78;
  const baseline2 = baseline1 + fontSize + lineGap;

  const line1 = makePath('Scorpius', fontSize, 0, baseline1, ls);
  const line2Text = makePath('Staffing', fontSize, 0, baseline2, ls);
  const dot      = makePath('.', fontSize, line2Text.advanceTo, baseline2, ls);

  const maxW = Math.max(line1.advanceTo, dot.advanceTo);
  const totalH = fontSize + lineGap + fontSize;

  return {
    line1D: line1.paths.join(' '),
    line2D: line2Text.paths.join(' '),
    dotD:   dot.paths.join(' '),
    line1W: line1.advanceTo,
    line2W: dot.advanceTo,
    line2TextW: line2Text.advanceTo,
    maxWidth: maxW,
    totalHeight: totalH
  };
}

function wrapSvg({ width, height, viewBox, bg, content }) {
  const bgRect = bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
${bgRect}
${content}
</svg>
`;
}

const out = __dirname;

/* ============================================================
   HORIZONTAL WORDMARK
   ============================================================ */

// 1. HORIZONTAL wordmark transparent (navy + red dot)
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.25;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-wordmark.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`,
      content: `<g transform="translate(${pad}, ${pad})"><path d="${w.mainD}" fill="${NAVY}"/><path d="${w.dotD}" fill="${RED}"/></g>` }));
}

// 2. HORIZONTAL on white
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.5;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-wordmark-on-white.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`, bg: WHITE,
      content: `<g transform="translate(${pad}, ${pad})"><path d="${w.mainD}" fill="${NAVY}"/><path d="${w.dotD}" fill="${RED}"/></g>` }));
}

// 3. HORIZONTAL light (cream) — for dark backgrounds
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.25;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-wordmark-light.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`,
      content: `<g transform="translate(${pad}, ${pad})"><path d="${w.mainD}" fill="${CREAM}"/><path d="${w.dotD}" fill="${RED}"/></g>` }));
}

// 4. HORIZONTAL on navy
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.5;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-wordmark-on-navy.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`, bg: NAVY_DEEP,
      content: `<g transform="translate(${pad}, ${pad})"><path d="${w.mainD}" fill="${CREAM}"/><path d="${w.dotD}" fill="${RED}"/></g>` }));
}

/* ============================================================
   STACKED WORDMARK (square format — avatars, social, app icons)
   ============================================================ */

// 5. STACKED transparent
{
  const fs0 = 120;
  const s = buildStacked({ fontSize: fs0 });
  const side = Math.max(s.maxWidth, s.totalHeight) + fs0 * 0.5;
  const xOffset = (side - s.maxWidth) / 2;
  const yOffset = (side - s.totalHeight) / 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-stacked.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`,
      content: `<g transform="translate(${xOffset}, ${yOffset})"><path d="${s.line1D}" fill="${NAVY}"/><path d="${s.line2D}" fill="${NAVY}"/><path d="${s.dotD}" fill="${RED}"/></g>` }));
}

// 6. STACKED on white
{
  const fs0 = 120;
  const s = buildStacked({ fontSize: fs0 });
  const side = Math.max(s.maxWidth, s.totalHeight) + fs0 * 0.8;
  const xOffset = (side - s.maxWidth) / 2;
  const yOffset = (side - s.totalHeight) / 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-stacked-on-white.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`, bg: WHITE,
      content: `<g transform="translate(${xOffset}, ${yOffset})"><path d="${s.line1D}" fill="${NAVY}"/><path d="${s.line2D}" fill="${NAVY}"/><path d="${s.dotD}" fill="${RED}"/></g>` }));
}

// 7. STACKED on navy
{
  const fs0 = 120;
  const s = buildStacked({ fontSize: fs0 });
  const side = Math.max(s.maxWidth, s.totalHeight) + fs0 * 0.8;
  const xOffset = (side - s.maxWidth) / 2;
  const yOffset = (side - s.totalHeight) / 2;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-stacked-on-navy.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`, bg: NAVY_DEEP,
      content: `<g transform="translate(${xOffset}, ${yOffset})"><path d="${s.line1D}" fill="${CREAM}"/><path d="${s.line2D}" fill="${CREAM}"/><path d="${s.dotD}" fill="${RED}"/></g>` }));
}

/* ============================================================
   FAVICON (16/32px — pragmatic minimal mark)
   ============================================================ */

// 8. Favicon — single "S" + red dot for tiny-size legibility
{
  const fs0 = 22;
  const baseline = fs0 * 0.78;
  const mainP = makePath('S', fs0, 0, baseline, 0);
  const dotP  = makePath('.', fs0, mainP.advanceTo, baseline, 0);
  const side = 32;
  const xOffset = (side - dotP.advanceTo) / 2;
  const yOffset = (side - fs0) / 2 + 1;
  fs.writeFileSync(path.join(out, 'scorpius-staffing-favicon.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`, bg: NAVY_DEEP,
      content: `<g transform="translate(${xOffset}, ${yOffset})"><path d="${mainP.paths.join(' ')}" fill="${CREAM}"/><path d="${dotP.paths.join(' ')}" fill="${RED}"/></g>` }));
}

// Cleanup old monogram files
['scorpius-staffing-monogram.svg', 'scorpius-staffing-monogram-on-white.svg', 'scorpius-staffing-monogram-on-navy.svg'].forEach(f => {
  const p = path.join(out, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

console.log('Scorpius Staffing brand SVGs generated (wordmark + stacked, no monogram):');
fs.readdirSync(out).filter(f => f.endsWith('.svg')).forEach(f => console.log('  ' + f));
