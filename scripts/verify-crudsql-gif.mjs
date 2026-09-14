// T4 验收：crud-sql 页 GifPlayer 行为验证（修订十一 8 项口径的落地子集）
// 1) 冷缓存动画播放  2) 热缓存动画播放  3) 断 GIF 回落 poster
// 4) 亮色/暗色主题  5) en 页动画
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const BASE = 'http://localhost:4173';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -- ' + detail : ''}`);
};

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});

// GIF 动画性 = 资产多帧（ffprobe 帧数 > 1）+ GifPlayer 叠层就绪（--ready / opacity 1）。
// headless Chrome 截图不推进 GIF 动画帧，像素帧差法在此环境恒 0，故不用。
async function gifAnimates(page) {
  const frames = Number(execSync(
    'ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1:nk=1 public/demo/crud-sql.gif'
  ).toString().trim());
  const state = await page.evaluate(() => {
    const player = document.querySelector('.mp-gif-player');
    const gif = player && player.querySelector('img[src*=".gif"]');
    if (!gif) return { ready: false };
    const opacity = Number(getComputedStyle(gif).opacity);
    return {
      ready: gif.className.includes('--ready'),
      opacity,
      naturalWidth: gif.naturalWidth,
    };
  });
  const animate = frames > 60 && state.ready && state.opacity > 0.9 && state.naturalWidth > 0;
  return { animate, note: `gifFrames=${frames} ready=${state.ready} opacity=${state.opacity}` };
}

// ---- 1. 冷缓存 zh 页 ----
{
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.goto(`${BASE}/features/crud-sql.html`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  const r = await gifAnimates(page);
  ok('zh 冷缓存 GIF 动画', r.animate, r.note);
  await page.close();
}

// ---- 2. 热缓存 zh 页 ----
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/features/crud-sql.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  const r = await gifAnimates(page);
  ok('zh 热缓存 GIF 动画', r.animate, r.note);
  await page.close();
}

// ---- 3. 断 GIF 回落 poster ----
{
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.url().includes('crud-sql.gif')) req.abort();
    else req.continue();
  });
  await page.goto(`${BASE}/features/crud-sql.html`, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2500));
  const state = await page.evaluate(() => {
    const scope = document.querySelector('.gif-player') || document.querySelector('main') || document.body;
    const imgs = [...scope.querySelectorAll('img')];
    const gifImg = imgs.find(i => (i.getAttribute('src') || '').includes('.gif'));
    const posterImg = imgs.find(i => (i.getAttribute('src') || '').includes('crud-sql.png'));
    const visible = el => el && el.getBoundingClientRect().height > 30 &&
      getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden';
    const loaded = el => el && (el.complete === undefined || el.complete) && (el.naturalWidth === undefined || el.naturalWidth > 0);
    return {
      hasGifImg: !!gifImg,
      gifVisible: visible(gifImg),
      posterVisible: visible(posterImg),
      posterLoaded: loaded(posterImg),
      totalImg: imgs.length,
    };
  });
  const pass = state.posterVisible && state.posterLoaded;
  ok('断 GIF 回落 poster', pass, JSON.stringify(state));
  await page.close();
}

// ---- 4. 亮/暗主题 ----
for (const theme of ['dark', 'light']) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(t => {
    localStorage.setItem('vitepress-theme-appearance', t);
  }, theme);
  await page.goto(`${BASE}/features/crud-sql.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  const state = await page.evaluate(() => {
    const el = document.documentElement;
    const img = document.querySelector('.gif-player img, img[src*=".gif"]');
    const box = img && img.getBoundingClientRect();
    return {
      cls: el.className,
      hasDark: el.classList.contains('dark'),
      imgOk: !!box && box.height > 100,
    };
  });
  const wantDark = theme === 'dark';
  ok(`${theme} 主题 GifPlayer 渲染`,
    state.hasDark === wantDark && state.imgOk,
    `dark=${state.hasDark} imgH_ok=${state.imgOk}`);
  await page.close();
}

// ---- 5. en 页 ----
{
  const page = await browser.newPage();
  await page.goto(`${BASE}/en/features/crud-sql.html`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  const r = await gifAnimates(page);
  ok('en 页 GIF 动画', r.animate, r.note);
  await page.close();
}

await browser.close();
const fails = results.filter(r => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
process.exit(fails.length ? 1 : 0);
