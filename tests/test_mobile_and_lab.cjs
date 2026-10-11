'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright-core');

const data = fs.mkdtempSync(path.join(os.tmpdir(), 'proteinexus-test-lab-'));
process.env.DATA_DIR = data;
const { server, db } = require('../backend.cjs');
let browser;

async function main() {
    await new Promise(r => server.listen(0, '127.0.0.1', r));
    const url = 'http://127.0.0.1:' + server.address().port;
    const executable = process.env.BROWSER_PATH || [
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    ].find(p => fs.existsSync(p));

    browser = await chromium.launch({
        executablePath: executable,
        headless: true,
        args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
    });

    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.app && window.virtualLab);
    await page.evaluate(() => window.heroViewer?.pause());

    if (await page.locator('#quickGuestBtn').isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.locator('#quickGuestBtn').click();
    }

    // TEST 1: TAB 2 - 3D STUDIO ON MOBILE (390px)
    console.log('Testing 3D Studio on mobile (390px)...');
    await page.evaluate(() => window.app.switchTab('studio3d'));
    await page.waitForFunction(() => window.viewer3D);

    // Kiểm tra nút [📐 2D Cấu Tạo] và [🧬 Studio 2D/3D] hiển thị trong màn hình
    const btn2D = page.locator('#btnOpenChem2DModal');
    assert(await btn2D.isVisible(), 'btnOpenChem2DModal must be visible');
    const b2dBox = await btn2D.boundingBox();
    assert(b2dBox.x >= 0 && b2dBox.x + b2dBox.width <= 390, 'btnOpenChem2DModal must fit within mobile screen width 390px');

    const btnJump = page.locator('#btnJumpCompanion');
    assert(await btnJump.isVisible(), 'btnJumpCompanion must be visible');
    const jumpBox = await btnJump.boundingBox();
    assert(jumpBox.x >= 0 && jumpBox.x + jumpBox.width <= 390, 'btnJumpCompanion must fit within mobile screen width 390px');

    // Banner nhảy nhanh đến studio 2D trên mobile
    const jumpBanner = page.locator('.mobile-jump-studio-banner');
    assert(await jumpBanner.isVisible(), 'mobile-jump-studio-banner must be visible on mobile');

    // Nhấp nút nhảy đến Companion 2D
    await page.evaluate(() => window.viewer3D.jumpToCompanion2D());
    await page.waitForTimeout(400);

    // Kiểm tra #companion2DContainer đã kết xuất
    const compContainer = page.locator('#companion2DContainer');
    assert(await compContainer.isVisible(), 'companion2DContainer must be visible');
    const compText = await compContainer.innerText();
    assert(compText.includes('STUDIO HÌNH HỌC 2D'), 'Companion card must have Studio 2D heading');
    assert(compText.includes('Cấu trúc 2D'), 'Must display 2D structure section');
    console.log('PASS: 3D Studio mobile layout & Companion 2D integration');

    // TEST 2: TAB 4 - PHÒNG THÍ NGHIỆM ẢO (VIRTUAL LAB)
    console.log('Testing Virtual Lab Coagulation on mobile...');
    await page.evaluate(() => window.app.switchTab('virtuallab'));
    await page.waitForFunction(() => window.app.activeTab === 'virtuallab');

    // Kiểm tra trạng thái ban đầu: 25°C, 0% đông tụ
    const tempVal = (await page.locator('#tempDisplayVal').textContent()).trim();
    assert.equal(tempVal, '25°C');
    const coagVal = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagVal, '0%');
    const tubeCoag = (await page.locator('#tubeCurrentCoagBadge').textContent()).trim();
    assert.equal(tubeCoag, '0%');

    // Thử kéo thanh trượt (slider) lên 60°C -> % đông tụ phải lập tức tăng!
    console.log('Testing slider movement -> dynamic % coagulation...');
    await page.evaluate(() => {
        window.virtualLab.setTemperature(60);
    });
    const coagVal60 = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.notEqual(coagVal60, '0%', 'Coagulation % must not stay at 0% when temperature is 60°C');
    assert.equal(coagVal60, '25%');

    // Thử kéo slider lên 85°C
    await page.evaluate(() => {
        window.virtualLab.setTemperature(85);
    });
    const coagVal85 = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagVal85, '85%');

    // Thử kéo slider lên 100°C
    await page.evaluate(() => {
        window.virtualLab.setTemperature(100);
    });
    const coagVal100 = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagVal100, '100%');

    // Kéo ngược về 25°C -> % đông tụ phải lập tức giảm về 0%
    await page.evaluate(() => {
        window.virtualLab.setTemperature(25);
    });
    const coagValBack = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagValBack, '0%');
    console.log('PASS: Temperature slider changes % coagulation in real time');

    // TEST 3: TOGGLE HÓA CHẤT (BẬT / TẮT THUẬN TIỆN)
    console.log('Testing chemical reagent toggling (on/off)...');
    const btnHCl = page.locator('#bottle_hcl');
    await btnHCl.click({ force: true });
    await page.waitForTimeout(100);
    assert(await btnHCl.evaluate(el => el.classList.contains('active')), 'HCl button should be active');
    const coagWithHCl = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagWithHCl, '45%', 'HCl alone at 25°C should add 45%');

    // Khi có HCl, kéo thanh trượt lên 60°C -> % vẫn phải tăng thêm (45 + 25 = 70%)
    await page.evaluate(() => {
        window.virtualLab.setTemperature(60);
    });
    const coagHCl60 = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagHCl60, '70%', 'HCl + 60°C should yield 70%');

    // Nhấp HCl LẦN NỮA ĐỂ TẮT (GỠ BỎ)
    await btnHCl.click({ force: true });
    await page.waitForTimeout(100);
    assert(!(await btnHCl.evaluate(el => el.classList.contains('active'))), 'HCl button should now be inactive');
    const coagAfterHClOff = (await page.locator('#coagPercentVal').textContent()).trim();
    assert.equal(coagAfterHClOff, '25%', 'After removing HCl, % should drop back to 25% (pure 60°C value)');
    console.log('PASS: Chemical reagents can be toggled on/off seamlessly');

    // TEST 4: PRESET BUTTONS SYNCHRONIZATION
    console.log('Testing preset buttons synchronization...');
    await page.evaluate(() => {
        window.virtualLab.setTemperaturePreset(85);
    });
    const preset85 = page.locator('.coag-preset-btn[data-temp="85"]');
    assert(await preset85.evaluate(el => el.classList.contains('active-preset')), '85°C preset button must have active-preset class');
    console.log('PASS: Preset buttons synchronized with temperature');

    assert.deepEqual(errors, []);
    console.log('ALL TESTS PASSED: Mobile 3D Studio & Virtual Lab coagulation verified 100%!');
}

main().catch(e => {
    console.error(e);
    process.exitCode = 1;
}).finally(async () => {
    await browser?.close();
    await new Promise(r => server.close(r));
    db.close();
    const resolved = fs.realpathSync(data);
    if (!resolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith('proteinexus-test-lab-')) {
        throw Error('Unexpected test directory');
    }
    fs.rmSync(resolved, { recursive: true, force: true });
});
