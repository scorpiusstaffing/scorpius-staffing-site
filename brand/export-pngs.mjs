/**
 * Scorpius Staffing PNG exports
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const exportsList = [
  { src: 'scorpius-staffing-stacked-on-white.svg', out: 'png/scorpius-staffing-stacked-400.png', width: 400 },
  { src: 'scorpius-staffing-stacked-on-white.svg', out: 'png/scorpius-staffing-stacked-1080.png', width: 1080 },
  { src: 'scorpius-staffing-stacked-on-navy.svg',  out: 'png/scorpius-staffing-stacked-navy-1080.png', width: 1080 },
  { src: 'scorpius-staffing-stacked.svg',          out: 'png/scorpius-staffing-stacked-transparent-1080.png', width: 1080 },
  { src: 'scorpius-staffing-wordmark.svg',          out: 'png/scorpius-staffing-wordmark-2000.png', width: 2000 },
  { src: 'scorpius-staffing-wordmark-on-white.svg', out: 'png/scorpius-staffing-wordmark-on-white-2000.png', width: 2000 },
  { src: 'scorpius-staffing-wordmark-on-navy.svg',  out: 'png/scorpius-staffing-wordmark-on-navy-2000.png', width: 2000 },
  { src: 'scorpius-staffing-wordmark-light.svg',    out: 'png/scorpius-staffing-wordmark-light-2000.png', width: 2000 },
  { src: 'scorpius-staffing-favicon.svg',           out: 'png/favicon-32.png', width: 32 },
  { src: 'scorpius-staffing-favicon.svg',           out: 'png/favicon-180.png', width: 180 },
];

// OG composition — wordmark on navy 1200x630
function buildOgSvg() {
  const wordmark = fs.readFileSync(path.join(__dirname, 'scorpius-staffing-wordmark.svg'), 'utf8');
  const m = wordmark.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  const [, vb, inner] = m;
  const [, , vw, vh] = vb.split(' ').map(Number);
  // Replace navy fills with cream (since OG bg will be navy)
  const lightInner = inner
    .replace(/fill="#1B2D45"/g, 'fill="#F0F2F7"')
    .replace(/fill="#0F1B30"/g, 'fill="#F0F2F7"');

  const targetW = 900;
  const scale = targetW / vw;
  const scaledH = vh * scale;
  const offsetX = (1200 - targetW) / 2;
  const offsetY = (630 - scaledH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0F1B30"/>
  <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">${lightInner}</g>
  <text x="80" y="565" font-family="Inter, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#F0F2F7" opacity="0.55" letter-spacing="3">INTERNATIONAL REC2REC · SEVEN MARKETS</text>
</svg>`;
}

fs.mkdirSync(path.join(__dirname, 'png'), { recursive: true });

for (const e of exportsList) {
  const svg = fs.readFileSync(path.join(__dirname, e.src));
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: e.width }, background: 'rgba(0,0,0,0)' });
  fs.writeFileSync(path.join(__dirname, e.out), resvg.render().asPng());
  console.log(`✓ ${e.out}  ${e.width}px`);
}

{
  const og = buildOgSvg();
  fs.writeFileSync(path.join(__dirname, 'scorpius-staffing-og.svg'), og);
  const resvg = new Resvg(og, { fitTo: { mode: 'original' } });
  fs.writeFileSync(path.join(__dirname, 'png/scorpius-staffing-og-1200x630.png'), resvg.render().asPng());
  console.log('✓ png/scorpius-staffing-og-1200x630.png');
}

console.log('\nDone.');
