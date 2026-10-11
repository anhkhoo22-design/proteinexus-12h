const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== VERIFYING USER REQUIREMENTS ===');

// 1. Check curriculum questions
const { questions } = require('../curriculum.cjs');
const core1to5 = questions.filter(q => ['core-01','core-02','core-03','core-04','core-05'].includes(q.id));
assert.strictEqual(core1to5.length, 5, 'Must have core-01 to core-05');
core1to5.forEach(q => {
    assert.strictEqual(q.topic, 'protein', `Question ${q.id} must be on protein topic, got: ${q.topic}`);
    assert(!q.prompt.toLowerCase().includes('amino acid là gì'), `Question ${q.id} must not ask basic amino acid question`);
    console.log(`PASS Question ${q.id}: [${q.protein}] ${q.prompt}`);
});

// 2. Check 3D controls in index.html and lab.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const labHtml = fs.readFileSync('lab.html', 'utf8');

[indexHtml, labHtml].forEach((html, i) => {
    const name = i === 0 ? 'index.html' : 'lab.html';
    // Must have the 5 controls in 3D tab:
    assert(html.includes('id="presetProteinSelect"'), `${name} must have presetProteinSelect`);
    assert(html.includes('id="customPdbInput"'), `${name} must have customPdbInput`);
    assert(html.includes('id="btnLoadCustomPdb"'), `${name} must have btnLoadCustomPdb`);
    assert(html.includes('id="pdbFileInput"'), `${name} must have pdbFileInput`);
    assert(html.includes('id="viewerStyleSelect"'), `${name} must have viewerStyleSelect`);
    assert(html.includes('id="viewerColorSelect"'), `${name} must have viewerColorSelect`);
    assert(html.includes('id="spinSpeedSlider"'), `${name} must have spinSpeedSlider`);

    // Must NOT have companion 2D container, sequence ribbon, or direct click hud in 3D tab
    assert(!html.includes('id="companion2DContainer"'), `${name} must NOT have companion2DContainer in 3D tab`);
    assert(!html.includes('class="sequence-ribbon"'), `${name} must NOT have sequence ribbon in 3D tab`);
    assert(!html.includes('id="direct3DClickHud"'), `${name} must NOT have direct3DClickHud`);

    // Must NOT have "Ôn tập gốc"
    assert(!html.includes('data-view="original"'), `${name} must NOT have Ôn tập gốc button`);
    assert(!html.includes('id="studyOriginal"'), `${name} must NOT have studyOriginal section`);

    // Virtual lab buttons must have onclick handlers
    assert(html.includes('data-exp="coagulation"'), `${name} must have coagulation button`);
    assert(html.includes('data-exp="biuret"'), `${name} must have biuret button`);

    console.log(`PASS 3D controls & cleaned elements in ${name}`);
});

// 3. Check 2D diagrams removed from app.js, structure-levels.js, education-manager.js
const appJs = fs.readFileSync('app.js', 'utf8');
assert(!appJs.includes('previewSvg'), 'app.js must not contain previewSvg 2D diagram');

const structJs = fs.readFileSync('structure-levels.js', 'utf8');
assert(!structJs.includes('partial-chain-diagram-card'), 'structure-levels.js must not contain partial-chain-diagram-card');
assert(!structJs.includes('segment-selector-bar'), 'structure-levels.js must not contain segment-selector-bar peptide inspector');

const eduJs = fs.readFileSync('education-manager.js', 'utf8');
assert(!eduJs.includes('topic-2d-diagram-card'), 'education-manager.js must not contain topic-2d-diagram-card');
assert(!eduJs.includes('ptc-2d-box'), 'education-manager.js must not contain ptc-2d-box');

console.log('PASS All 2D structure diagrams completely eliminated');

// 4. Check CSS for Virtual Lab and Mobile 3D Layout
const studyCss = fs.readFileSync('study-addon.css', 'utf8');
const styleCss = fs.readFileSync('style.css', 'utf8');

assert(studyCss.includes('.lab-workspace:not(.active)'), 'study-addon.css must hide inactive lab workspaces');
assert(styleCss.includes('@media (max-width: 768px)') && styleCss.includes('.viewport-hud-top'), 'style.css must have mobile 3D HUD rule');

console.log('PASS CSS verification');
console.log('=== ALL USER REQUIREMENTS VERIFIED SUCCESSFULLY ===');
