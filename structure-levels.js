/**
 * PROTEINEXUS - 4 BẬC CẤU TRÚC PROTEIN (HIERARCHICAL STRUCTURE EXPLORER)
 * Tích hợp đầy đủ:
 * 1. Zoom cấu trúc chi tiết protein bậc cao (Bậc 3: Cầu S-S, Lõi kỵ nước, Cầu muối; Bậc 4: Tiếp diện tiểu đơn vị, Heme Fe2+, Hốc Allosteric)
 * 2. Hình ảnh mạch 1 phần trực quan tương tác (2D Partial Peptide Chain Diagram)
 * 3. Soi phân đoạn peptide (Segment Inspector: Dipeptide, Tripeptide, Tetrapeptide, Pentapeptide, Polypeptide)
 * 4. Dữ liệu tinh thể học chính thống wwPDB (1CRN, 4HHB, 1MBO, linear_peptide)
 */

class StructureLevelsManager {
    constructor() {
        this.currentLevel = 1;
        this.container = document.getElementById('levelSandboxContainer');
        this.viewer = null;
        this.secondaryType = "alpha";
        this.level1Mode = "linear";
        this.activeLabels = [];
        this.selectedSegment = null;

        this.init();
    }

    init() {
        this.container = document.getElementById('levelSandboxContainer');
        if (!this.container) return;

        this.setupStepNavigation();
        this.renderLevelContent(1);

        const ro = new ResizeObserver(() => this.resize());
        ro.observe(this.container);
    }

    isVisible() {
        return !!(this.container && this.container.clientWidth > 0 && this.container.clientHeight > 0);
    }

    resize() {
        if (this.viewer && this.isVisible()) {
            this.viewer.resize();
            this.viewer.render();
        }
    }

    pause() {
        if (this.viewer) {
            try { this.viewer.spin(false); } catch (e) {}
        }
    }

    resume() {
        if (!this.viewer || !this.isVisible()) return;
        this.viewer.resize();
        if (this.needsFit) {
            this.viewer.zoomTo();
            this.viewer.zoom(0.85);
            this.needsFit = false;
        }
        this.viewer.render();
        try { this.viewer.spin("y", 0.4); } catch (e) {}
    }

    guardHiddenRendering() {
        const v = this.viewer;
        if (!v || v.__guarded) return;
        v.__guarded = true;
        const origSpin = v.spin.bind(v);
        const origRender = v.render.bind(v);
        v.spin = (...a) => {
            if (a[0] === false || this.isVisible()) return origSpin(...a);
            this.needsFit = true;
        };
        v.render = (...a) => {
            if (this.isVisible()) return origRender(...a);
            this.needsFit = true;
        };
    }

    setupStepNavigation() {
        const stepCards = document.querySelectorAll('.step-card');
        stepCards.forEach(card => {
            card.addEventListener('click', () => {
                const level = parseInt(card.dataset.level);
                this.selectLevel(level);
            });
        });
    }

    selectLevel(level) {
        this.currentLevel = level;
        document.querySelectorAll('.step-card').forEach(c => {
            c.classList.toggle('active', parseInt(c.dataset.level) === level);
        });

        if (window.app) window.app.playSound('click');
        this.renderLevelContent(level);
    }

    initViewer() {
        this.container = document.getElementById('levelSandboxContainer');
        if (!this.container) return null;

        this.container.innerHTML = '';
        this.container.style.position = 'relative';

        const MolLib = window.$3Dmol || window['3Dmol'];
        if (MolLib && typeof MolLib.createViewer === 'function') {
            this.viewer = MolLib.createViewer(this.container, {
                defaultcolors: MolLib.rasmolElementColors,
                backgroundColor: 0x03060d
            });
            this.guardHiddenRendering();
            this.attachFloatingHud();
            return this.viewer;
        }
        return null;
    }

    attachFloatingHud() {
        if (!this.container) return;
        const hud = document.createElement('div');
        hud.id = 'structureFloatingHud';
        hud.className = 'structure-floating-hud';
        hud.style.display = 'none';
        this.container.appendChild(hud);
    }

    showFloatingHud(title, tag, desc, color = '#00f2fe') {
        const hud = document.getElementById('structureFloatingHud');
        if (!hud) return;
        hud.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:${color}; font-weight:bold; text-transform:uppercase;">${tag}</span>
                <button onclick="window.structureMgr.hideFloatingHud()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1rem; line-height:1;">&times;</button>
            </div>
            <div style="font-family:var(--font-heading); font-size:1rem; color:#fff; font-weight:700; margin-bottom:4px;">${title}</div>
            <div style="font-size:0.85rem; color:#cbd5e1; line-height:1.5;">${desc}</div>
        `;
        hud.style.display = 'block';
        hud.style.borderColor = color;
    }

    hideFloatingHud() {
        const hud = document.getElementById('structureFloatingHud');
        if (hud) hud.style.display = 'none';
    }

    renderLevelContent(level) {
        const titleEl = document.getElementById('levelBigTitle');
        const badgeEl = document.getElementById('levelBadgeText');
        const descEl = document.getElementById('levelDescParagraph');
        const featuresEl = document.getElementById('levelFeaturesContainer');
        const controlsEl = document.getElementById('sandboxControls');

        if (!titleEl || !descEl || !featuresEl) return;
        this.hideFloatingHud();

        switch (level) {
            case 1:
                badgeEl.textContent = "CẤU TRÚC BẬC I (PRIMARY STRUCTURE - TRÌNH TỰ TUYẾN TÍNH CHƯA CUỘN GẬP)";
                titleEl.textContent = "Bậc I: Trình Tự Tuyến Tính Amino Acid (Chuỗi Polypeptide Mạch Thẳng)";
                descEl.innerHTML = `Cấu trúc Bậc I là <strong>trình tự sắp xếp tuyến tính</strong> của các gốc α-amino acid trong chuỗi polypeptide, được nối với nhau bằng <strong>liên kết peptide (-CO-NH-)</strong> cộng hóa trị cực kỳ bền vững.<br>Ở bậc này, <strong>chuỗi polypeptide HOÀN TOÀN DUỖI THẲNG, CHƯA HỀ CUỘN GẬP KHÔNG GIAN</strong>! Chuỗi trải dài từ <strong>Đầu N (Amino-terminus: H₃N⁺—)</strong> đến <strong>Đầu C (Carboxyl-terminus: —COO⁻)</strong>.`;
                
                featuresEl.innerHTML = `
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.75rem; margin-top:0.5rem;">
                        <div class="feature-box-item" style="border-left:3px solid var(--neon-cyan);">
                            <div>
                                <strong style="color:var(--neon-cyan);">🔗 Liên Kết Peptide (-CO-NH-):</strong><br>
                                Là liên kết cộng hóa trị bền vững nối các gốc α-amino acid theo một trình tự xác định. Mang đặc tính một phần của liên kết đôi (phẳng, độ dài 1.32 Å).
                            </div>
                        </div>
                        <div class="feature-box-item" style="border-left:3px solid #38bdf8;">
                            <div>
                                <strong style="color:#38bdf8;">🧭 Định Hướng Chuỗi (Đầu N → Đầu C):</strong><br>
                                Chuỗi polypeptide luôn có tính phân cực định hướng từ đầu amino tự do (H₃N⁺—) đến đầu carboxylate tự do (—COO⁻). Trình tự này quyết định toàn bộ cấu trúc bậc cao.
                            </div>
                        </div>
                    </div>
                `;

                controlsEl.innerHTML = `
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
                            <button class="mini-control-btn ${this.level1Mode === 'linear' ? 'active' : ''}" onclick="window.structureMgr.switchLevel1Mode('linear')">
                                🔬 Chuỗi Mạch Thẳng Tuyến Tính (Chuẩn Bậc 1)
                            </button>
                            <button class="mini-control-btn ${this.level1Mode === 'folded' ? 'active' : ''}" onclick="window.structureMgr.switchLevel1Mode('folded')">
                                🔄 So sánh: Khi chuỗi này cuộn gập thành Bậc 3 (Crambin)
                            </button>
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1; background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(0,242,254,0.25);">
                            <span style="color: var(--neon-cyan); font-weight: bold;">TRÌNH TỰ BẬC 1: </span>
                            <span style="color: #38bdf8;">[Đầu N: H3N+]</span> &rarr; MET1 &rarr; ALA2 &rarr; SER3 &rarr; GLU4 &rarr; LYS5 &rarr; LEU6 &rarr; HIS7 &rarr; VAL8 &rarr; <span style="color: #f43f5e;">[-COO- :Đầu C]</span>
                        </div>
                    </div>
                `;

                this.renderLevel1_3D();
                break;

            case 2:
                badgeEl.textContent = "CẤU TRÚC BẬC II (SECONDARY STRUCTURE - Linus Pauling 1951)";
                titleEl.textContent = "Bậc II: Xoắn Alpha (α-helix) & Phiến Gấp Beta (β-sheet)";
                descEl.innerHTML = `Là <strong>cấu hình không gian cục bộ tuần hoàn</strong> của mạch chính polypeptide, được giữ vững chủ yếu bởi các <strong>liên kết hydrogen</strong> giữa nhóm carbonyl (C=O) của liên kết peptide này với nhóm amino (N-H) của liên kết peptide khác.<br>Phát hiện bởi Linus Pauling và Robert Corey (Giải Nobel Hóa học 1954).`;

                featuresEl.innerHTML = `
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.75rem; margin-top:0.5rem;">
                        <div class="feature-box-item" style="border-left:3px solid #38bdf8;">
                            <div>
                                <strong style="color:#38bdf8;">🌀 Xoắn Alpha (Alpha-helix):</strong><br>
                                Chuỗi xoắn ốc theo chiều kim đồng hồ, 3.6 gốc amino acid mỗi vòng (bước xoắn 0.54 nm). Mỗi nhóm C=O tạo liên kết hydrogen với nhóm N-H của gốc thứ 4 tiếp theo (vị trí i + 4).
                            </div>
                        </div>
                        <div class="feature-box-item" style="border-left:3px solid #facc15;">
                            <div>
                                <strong style="color:#facc15;">📐 Phiến gấp Beta (Beta-sheet):</strong><br>
                                Các đoạn chuỗi nằm kề nhau theo dạng phẳng gấp nếp gợn sóng (ziczac), định hướng song song hoặc đối song song. Khoảng cách gốc là 0.35 nm.
                            </div>
                        </div>
                    </div>
                `;

                controlsEl.innerHTML = `
                    <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                        <button class="mini-control-btn ${this.secondaryType === 'alpha' ? 'active' : ''}" onclick="window.structureMgr.switchSecondary('alpha')">Xoắn Alpha 3D (Helix)</button>
                        <button class="mini-control-btn ${this.secondaryType === 'beta' ? 'active' : ''}" onclick="window.structureMgr.switchSecondary('beta')">Phiến Gấp Beta 3D (Sheet)</button>
                        <button class="mini-control-btn" style="color:var(--neon-emerald);" onclick="window.structureMgr.zoomSecondaryHbonds()">🔍 Zoom Liên Kết Hydrogen (H-bonds)</button>
                    </div>
                `;

                this.renderLevel2_3D();
                break;

            case 3:
                badgeEl.textContent = "CẤU TRÚC BẬC III (TERTIARY STRUCTURE - wwPDB 1CRN CRAMBIN)";
                titleEl.textContent = "Bậc III: Cấu Trúc Cuộn Gập 3D Hoàn Chỉnh (Crambin 0.54 Å)";
                descEl.innerHTML = `Là <strong>cấu trúc cuộn gập không gian 3 chiều đặc thù</strong> của toàn bộ một chuỗi polypeptide đơn, tạo thành dạng hình cầu (globular) hoặc sợi dài (fibrous).<br>Mô hình dưới đây kết xuất trực tiếp từ <strong>tinh thể học wwPDB 1CRN</strong> (Crambin, Teeter et al.) với độ phân giải nguyên tử siêu cao 0.54 Å, bảo tồn nguyên vẹn 3 cầu nối Disulfide (-S-S-) màu vàng.`;

                featuresEl.innerHTML = `
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:0.75rem; margin-top:0.5rem;">
                        <div class="feature-box-item" style="border-left:3px solid #facc15;">
                            <div>
                                <strong style="color:#facc15;">🟡 Cầu Disulfide (—S—S—):</strong><br>
                                Liên kết cộng hóa trị giữa hai gốc Cysteine, cực kỳ bền vững, giữ chặt các nếp cuộn không gian.
                            </div>
                        </div>
                        <div class="feature-box-item" style="border-left:3px solid #38bdf8;">
                            <div>
                                <strong style="color:#38bdf8;">💧 Lõi Kỵ Nước (Hydrophobic Core):</strong><br>
                                Các gốc không phân cực (Val, Leu, Phe...) bị đẩy vào trong lõi, tránh tiếp xúc với nước.
                            </div>
                        </div>
                        <div class="feature-box-item" style="border-left:3px solid #f43f5e;">
                            <div>
                                <strong style="color:#f43f5e;">⚡ Cầu Muối Ion &amp; H-bonds:</strong><br>
                                Tương tác tĩnh điện giữa các gốc mang điện tích trái dấu (-COO⁻ và -NH₃⁺) và liên kết hydrogen mạch bên.
                            </div>
                        </div>
                    </div>
                `;

                controlsEl.innerHTML = `
                    <div style="width:100%; display:flex; flex-direction:column; gap:0.6rem;">
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;" id="level3StyleButtonsGroup">
                            <span style="font-family:var(--font-heading); font-size:0.8rem; color:var(--neon-cyan);">Kiểu Dáng:</span>
                            <button class="mini-control-btn active" onclick="window.structureMgr.setStyle3('cartoon')">Dải Cartoon Ruy Băng</button>
                            <button class="mini-control-btn" onclick="window.structureMgr.setStyle3('stick')">Khung Que Nguyên Tử</button>
                            <button class="mini-control-btn" onclick="window.structureMgr.setStyle3('sphere')">Cầu CPK (Van der Waals)</button>
                        </div>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.5rem;">
                            <span style="font-family:var(--font-heading); font-size:0.8rem; color:var(--neon-amber);">🔍 ZOOM CHI TIẾT BẬC 3:</span>
                            <button class="mini-control-btn" style="color:#fde047; border-color:#eab308;" onclick="window.structureMgr.zoomDisulfide()">
                                🟡 Zoom Cầu Disulfide (-S-S-)
                            </button>
                            <button class="mini-control-btn" style="color:#38bdf8; border-color:#0284c7;" onclick="window.structureMgr.zoomHydrophobicCore()">
                                💧 Zoom Lõi Kỵ Nước (Core)
                            </button>
                            <button class="mini-control-btn" style="color:#f43f5e; border-color:#e11d48;" onclick="window.structureMgr.zoomSaltBridge()">
                                ⚡ Zoom Cầu Muối Ion
                            </button>
                            <button class="mini-control-btn" onclick="window.structureMgr.resetLevel3View()">
                                🔄 Toàn Cảnh Bậc 3
                            </button>
                        </div>
                    </div>
                `;

                this.renderLevel3_3D();
                break;

            case 4:
                badgeEl.textContent = "CẤU TRÚC BẬC IV (QUATERNARY STRUCTURE - wwPDB 4HHB HEMOGLOBIN)";
                titleEl.textContent = "Bậc IV: Phức Hợp 4 Tiểu Đơn Vị (Hemoglobin Người 1.74 Å)";
                descEl.innerHTML = `Được cấu tạo từ <strong>4 chuỗi polypeptide</strong> (2α + 2β) phối hợp nhịp nhàng, mỗi chuỗi liên kết với 1 nhóm Heme mang ion Fe²⁺ màu đỏ phát quang.<br>Mô hình kết xuất 100% tọa độ thực từ <strong>wwPDB: 4HHB</strong> (Fermi et al., 1984), chứng minh hiện tượng hợp tác Allosteric kinh điển.`;

                featuresEl.innerHTML = `
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:0.75rem; margin-top:0.5rem;">
                        <div class="feature-box-item" style="border-left:3px solid var(--neon-cyan);">
                            <div>
                                <strong style="color:var(--neon-cyan);">🧬 Phức Hợp 4 Tiểu Đơn Vị (Tetramer):</strong><br>
                                Hemoglobin gồm 2 chuỗi α (141 gốc) và 2 chuỗi β (146 gốc) liên kết với nhau bằng các tương tác phi cộng hóa trị.
                            </div>
                        </div>
                        <div class="feature-box-item" style="border-left:3px solid #f43f5e;">
                            <div>
                                <strong style="color:#f43f5e;">🩸 4 Nhóm Heme Chứa Fe²⁺:</strong><br>
                                Mỗi chuỗi polypeptide liên kết với 1 nhóm Heme mang ion Fe²⁺ ở trung tâm, có khả năng gắn thuận nghịch với phân tử oxy (O₂).
                            </div>
                        </div>
                    </div>
                `;

                controlsEl.innerHTML = `
                    <div style="width:100%; display:flex; flex-direction:column; gap:0.6rem;">
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;" id="level4StyleButtonsGroup">
                            <span style="font-family:var(--font-heading); font-size:0.8rem; color:var(--neon-cyan);">Phối Màu:</span>
                            <button class="mini-control-btn active" onclick="window.structureMgr.setStyle4('chain')">Tô Màu Theo 4 Chuỗi</button>
                            <button class="mini-control-btn" onclick="window.structureMgr.setStyle4('ss')">Tô Màu Cấu Trúc Bậc 2</button>
                        </div>
                        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.5rem;">
                            <span style="font-family:var(--font-heading); font-size:0.8rem; color:var(--neon-magenta);">🔍 ZOOM CHI TIẾT BẬC 4:</span>
                            <button class="mini-control-btn" style="color:#ef4444; border-color:#dc2626;" onclick="window.structureMgr.zoomHemeDetailed()">
                                🩸 Zoom Nhân Heme &amp; Fe2+ Phối Trí
                            </button>
                            <button class="mini-control-btn" style="color:#a855f7; border-color:#7c3aed;" onclick="window.structureMgr.zoomSubunitInterface()">
                                🔗 Zoom Tiếp Diện Chuỗi Alpha-Beta
                            </button>
                            <button class="mini-control-btn" style="color:#10b981; border-color:#059669;" onclick="window.structureMgr.zoomAllostericSite()">
                                🎯 Zoom Hốc Điều Hòa Allosteric
                            </button>
                            <button class="mini-control-btn" onclick="window.structureMgr.resetLevel4View()">
                                🔄 Toàn Cảnh Bậc 4
                            </button>
                        </div>
                    </div>
                `;

                this.renderLevel4_3D();
                break;
        }
    }

    // =========================================================================
    // SVG MẠCH 1 PHẦN TRỰC QUAN (INTERACTIVE 2D PARTIAL PEPTIDE CHAIN)
    // =========================================================================
    generatePartialChainSvg() {
        return `
            <svg viewBox="0 0 880 200" class="partial-chain-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradPeptideBond" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#a855f7" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.2"/>
                    </linearGradient>
                </defs>

                <!-- Đường nối mạch xương sống (Backbone Guide Line) -->
                <line x1="80" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.15)" stroke-width="4" stroke-dasharray="4 4" />

                <!-- 1. ĐẦU N (AMINO-TERMINUS: H3N+) -->
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('n_terminus')">
                    <rect x="20" y="70" width="85" height="60" rx="8" fill="rgba(14, 165, 233, 0.25)" stroke="#38bdf8" stroke-width="2"/>
                    <text x="62" y="105" fill="#38bdf8" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold" text-anchor="middle">H₃N⁺-</text>
                    <text x="62" y="122" fill="#94a3b8" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">Đầu N</text>
                </g>

                <!-- Liên kết C-Calpha -->
                <line x1="105" y1="100" x2="150" y2="100" stroke="#64748b" stroke-width="3"/>

                <!-- GỐC 1: C_alpha (1) & Mạch bên R1 -->
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('calpha')">
                    <circle cx="170" cy="100" r="18" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2"/>
                    <text x="170" y="105" fill="#10b981" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">Cα₁</text>
                </g>
                <!-- Mạch bên R1 (hướng lên trên) -->
                <line x1="170" y1="82" x2="170" y2="45" stroke="#f59e0b" stroke-width="3"/>
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('r_group')">
                    <rect x="135" y="15" width="70" height="32" rx="6" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2"/>
                    <text x="170" y="36" fill="#fcd34d" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">R₁ (Ala)</text>
                </g>

                <!-- LIÊN KẾT PEPTIDE SỐ 1 (-CO-NH-) KHUNG VIỀN NỔI BẬT -->
                <g class="pcd-group pcd-highlight-bond" onclick="window.structureMgr.showPcdPartInfo('peptide_bond')">
                    <rect x="220" y="55" width="135" height="90" rx="10" fill="url(#gradPeptideBond)" stroke="#00f2fe" stroke-width="2.5"/>
                    <text x="287" y="75" fill="#00f2fe" font-family="Be Vietnam Pro, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">LIÊN KẾT PEPTIDE #1</text>
                    <text x="250" y="106" fill="#fff" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold">C=O</text>
                    <line x1="285" y1="100" x2="305" y2="100" stroke="#00f2fe" stroke-width="3"/>
                    <text x="310" y="106" fill="#fff" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold">NH</text>
                    <text x="287" y="132" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle">1.32 Å (phẳng)</text>
                </g>

                <!-- GỐC 2: C_alpha (2) & Mạch bên R2 (hướng xuống dưới) -->
                <line x1="355" y1="100" x2="390" y2="100" stroke="#64748b" stroke-width="3"/>
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('calpha')">
                    <circle cx="410" cy="100" r="18" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2"/>
                    <text x="410" y="105" fill="#10b981" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">Cα₂</text>
                </g>
                <!-- Mạch bên R2 hướng xuống dưới -->
                <line x1="410" y1="118" x2="410" y2="155" stroke="#f59e0b" stroke-width="3"/>
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('r_group')">
                    <rect x="375" y="155" width="70" height="32" rx="6" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2"/>
                    <text x="410" y="176" fill="#fcd34d" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">R₂ (Gly)</text>
                </g>

                <!-- LIÊN KẾT PEPTIDE SỐ 2 (-CO-NH-) KHUNG VIỀN NỔI BẬT -->
                <line x1="428" y1="100" x2="460" y2="100" stroke="#64748b" stroke-width="3"/>
                <g class="pcd-group pcd-highlight-bond" onclick="window.structureMgr.showPcdPartInfo('peptide_bond')">
                    <rect x="460" y="55" width="135" height="90" rx="10" fill="url(#gradPeptideBond)" stroke="#00f2fe" stroke-width="2.5"/>
                    <text x="527" y="75" fill="#00f2fe" font-family="Be Vietnam Pro, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">LIÊN KẾT PEPTIDE #2</text>
                    <text x="490" y="106" fill="#fff" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold">C=O</text>
                    <line x1="525" y1="100" x2="545" y2="100" stroke="#00f2fe" stroke-width="3"/>
                    <text x="550" y="106" fill="#fff" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold">NH</text>
                    <text x="527" y="132" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle">1.32 Å (phẳng)</text>
                </g>

                <!-- GỐC 3: C_alpha (3) & Mạch bên R3 (hướng lên trên) -->
                <line x1="595" y1="100" x2="630" y2="100" stroke="#64748b" stroke-width="3"/>
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('calpha')">
                    <circle cx="650" cy="100" r="18" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2"/>
                    <text x="650" y="105" fill="#10b981" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">Cα₃</text>
                </g>
                <line x1="650" y1="82" x2="650" y2="45" stroke="#f59e0b" stroke-width="3"/>
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('r_group')">
                    <rect x="615" y="15" width="70" height="32" rx="6" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2"/>
                    <text x="650" y="36" fill="#fcd34d" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">R₃ (Val)</text>
                </g>

                <!-- LIÊN KẾT ĐẾN ĐẦU C -->
                <line x1="668" y1="100" x2="710" y2="100" stroke="#64748b" stroke-width="3"/>

                <!-- 2. ĐẦU C (CARBOXYL-TERMINUS: -COO-) -->
                <g class="pcd-group" onclick="window.structureMgr.showPcdPartInfo('c_terminus')">
                    <rect x="710" y="70" width="85" height="60" rx="8" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" stroke-width="2"/>
                    <text x="752" y="105" fill="#f43f5e" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold" text-anchor="middle">-COO⁻</text>
                    <text x="752" y="122" fill="#94a3b8" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">Đầu C</text>
                </g>
            </svg>
        `;
    }

    showPcdPartInfo(part) {
        const infoBox = document.getElementById('pcdInfoBox');
        if (!infoBox) return;

        let content = '';
        switch (part) {
            case 'peptide_bond':
                content = `
                    <div style="color:var(--neon-cyan); font-weight:bold; font-size:1rem; margin-bottom:4px;">
                        🔗 LIÊN KẾT PEPTIDE (-CO-NH-) CỐT LÕI HÓA HỌC:
                    </div>
                    <div>
                        • Hình thành giữa nhóm carboxyl (—COOH) của amino acid trước và nhóm amino (—NH₂) của amino acid sau, tách ra 1 phân tử nước (H₂O).<br>
                        • <strong>Đặc tính hình học:</strong> Độ dài liên kết C—N là 1.32 Å (ngắn hơn liên kết đơn C—N 1.47 Å do cộng hưởng obitan electron đôi). Vì vậy nhóm —CO—NH— có <strong>cấu trúc phẳng</strong> và <strong>không thể quay tự do</strong> quanh trục C—N.<br>
                        • <strong>Phản ứng màu Biuret:</strong> Yêu cầu tối thiểu <strong>2 liên kết peptide</strong> (từ tripeptide trở lên) để tạo phức màu tím hoa cà với Cu²⁺ trong dung dịch kiềm NaOH.
                    </div>
                `;
                break;
            case 'n_terminus':
                content = `
                    <div style="color:#38bdf8; font-weight:bold; font-size:1rem; margin-bottom:4px;">
                        🔹 ĐẦU N (AMINO-TERMINUS / N-TERMINUS):
                    </div>
                    <div>
                        • Là gốc α-amino acid ở đầu chuỗi còn nhóm amino (—NH₂ hoặc —NH₃⁺) tự do, chưa bị biến đổi.<br>
                        • Theo quy ước quốc tế chuẩn IUPAC, <strong>Đầu N luôn được viết ở ngoài cùng bên TRÁI</strong> của chuỗi peptide và là điểm xuất phát tổng hợp protein tại ribosome trong tế bào sinh học.
                    </div>
                `;
                break;
            case 'c_terminus':
                content = `
                    <div style="color:#f43f5e; font-weight:bold; font-size:1rem; margin-bottom:4px;">
                        🔻 ĐẦU C (CARBOXYL-TERMINUS / C-TERMINUS):
                    </div>
                    <div>
                        • Là gốc α-amino acid ở cuối chuỗi còn nhóm carboxyl (—COOH hoặc —COO⁻) tự do.<br>
                        • <strong>Đầu C luôn được viết ở ngoài cùng bên PHẢI</strong> của chuỗi peptide. Điểm kết thúc của quá trình dịch mã tổng hợp protein.
                    </div>
                `;
                break;
            case 'r_group':
                content = `
                    <div style="color:#fcd34d; font-weight:bold; font-size:1rem; margin-bottom:4px;">
                        🌿 NHÓM MẠCH BÊN R (SIDE CHAIN):
                    </div>
                    <div>
                        • Là phần khác biệt duy nhất giữa 20 loại α-amino acid cấu thành protein.<br>
                        • Quyết định toàn bộ tính chất lý hóa: <strong>Kỵ nước</strong> (Ala, Val, Leu...), <strong>Phân cực</strong> (Ser, Thr, Asn...), <strong>Tích điện axit</strong> (Asp, Glu mang —COO⁻), <strong>Tích điện bazơ</strong> (Lys, Arg, His mang —NH₃⁺) hoặc tạo <strong>cầu nối disulfide</strong> (Cysteine với nhóm —SH).
                    </div>
                `;
                break;
            case 'calpha':
                content = `
                    <div style="color:#10b981; font-weight:bold; font-size:1rem; margin-bottom:4px;">
                        🟢 CARBON ALPHA (Cα):
                    </div>
                    <div>
                        • Là nguyên tử Carbon trung tâm liên kết với 4 nhóm: nhóm —NH₂, nhóm —COOH, nguyên tử —H và mạch bên —R.<br>
                        • Là <strong>carbon bất đối xứng (chiral center)</strong> trong 19 amino acid (trừ Glycine có R là —H), tạo ra đồng phân quang học dãy L trong tự nhiên. Trục quay chính tạo các góc nhị diện φ (Phi) và ψ (Psi) trong giản đồ Ramachandran.
                    </div>
                `;
                break;
        }

        infoBox.innerHTML = content;
        infoBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (window.app) window.app.playSound('beep');
    }

    // =========================================================================
    // SOI PHÂN ĐOẠN PEPTIDE (PEPTIDE SEGMENT INSPECTOR)
    // =========================================================================
    inspectPresetSegment(segmentId) {
        const seg = (window.PEPTIDE_SEGMENTS_PRESETS || []).find(s => s.id === segmentId);
        if (!seg) return;

        this.selectedSegment = seg;

        // Cập nhật ngay class active cho danh sách nút phân đoạn
        document.querySelectorAll('.segment-pill-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${segmentId}'`));
        });

        // Render card chi tiết kèm Studio 2D & 3D song song
        const slot = document.getElementById('segmentDetailCardSlot');
        if (slot) {
            slot.innerHTML = `
                <div class="segment-detail-card">
                    <div class="sdc-top">
                        <div class="sdc-badge">${seg.categoryName}</div>
                        <div class="sdc-title">${seg.name}</div>
                        <div class="sdc-seq">Trình tự: <strong>${seg.sequence}</strong> | Số gốc: <strong>${seg.residueCount}</strong> | Số liên kết peptide: <strong>${seg.bondsCount}</strong></div>
                    </div>

                    <!-- BỐ CỤC 2 CỘT SONG SONG: 2D SKELETAL + 3D BALL-AND-STICK -->
                    <div id="segmentDuoStudioSlot" style="margin: 1rem 0;"></div>

                    <div class="sdc-formula-box">
                        <div class="sdc-flabel">CÔNG THỨC CẤU TẠO ĐƠN GIẢN THU GỌN:</div>
                        <div class="sdc-formula-code">${seg.simpleFormula}</div>
                        <div style="margin-top:6px; font-size:0.85rem; color:#94a3b8;">
                            CTPT: <strong style="color:#fff;">${seg.molecularFormula}</strong> | Phân tử khối: <strong style="color:var(--neon-cyan);">${seg.mw}</strong>
                        </div>
                    </div>

                    <div class="sdc-props-grid">
                        <div class="sdc-prop-item">
                            <span class="sdc-p-name">Đầu N:</span>
                            <span class="sdc-p-val" style="color:#38bdf8;">${seg.nTerminus}</span>
                        </div>
                        <div class="sdc-prop-item">
                            <span class="sdc-p-name">Đầu C:</span>
                            <span class="sdc-p-val" style="color:#f43f5e;">${seg.cTerminus}</span>
                        </div>
                        <div class="sdc-prop-item">
                            <span class="sdc-p-name">Phản ứng màu Biuret:</span>
                            <span class="sdc-p-val" style="color:${seg.biuretReaction ? 'var(--neon-purple)' : 'var(--neon-magenta)'}; font-weight:bold;">
                                ${seg.biuretReaction ? '✅ DƯƠNG TÍNH (Màu tím)' : '❌ ÂM TÍNH (Không màu tím)'}
                            </span>
                        </div>
                        <div class="sdc-prop-item" style="grid-column: 1 / -1;">
                            <span class="sdc-p-name">Giải thích Biuret:</span>
                            <span class="sdc-p-val" style="font-size:0.85rem; color:#cbd5e1;">${seg.biuretReason}</span>
                        </div>
                    </div>

                    <div class="sdc-actions">
                        <button class="btn-cyber-primary" style="padding:0.5rem 1rem; font-size:0.85rem;" onclick="window.structureMgr.zoomToSegmentIn3D()">
                            🎯 Soi &amp; Phóng To Đoạn Này Trên 3D
                        </button>
                        <button class="mini-control-btn" style="color:var(--neon-cyan);" onclick="navigator.clipboard.writeText('${seg.simpleFormula}'); window.app.showToast('Đã sao chép công thức cấu tạo!', 'success');">
                            📋 Sao chép công thức
                        </button>
                    </div>
                </div>
            `;
            slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            if (window.chemical2DEngine) {
                const residues = seg.residuesList || seg.sequence.replace(/[^A-Za-z]/g, ' ').trim().split(/\s+/).map(r => r.toUpperCase());
                window.chemical2DEngine.renderPeptideDuoStudio('segmentDuoStudioSlot', residues);
            }
        }

        // Tự động zoom trong 3D nếu viewer đang sẵn sàng
        this.zoomToSegmentIn3D();

        if (window.app) {
            window.app.playSound('beep');
            window.app.showToast(`Đang soi [${seg.name}]: Dạng ${seg.peptideType}!`, 'info');
        }
    }

    zoomToSegmentIn3D() {
        if (!this.viewer || !this.selectedSegment) return;
        const seg = this.selectedSegment;
        const residues = seg.pdbSnippetResidues || [1, 2];

        // Highlight các gốc này trên mô hình 3D
        this.viewer.setStyle({}, {
            stick: { radius: 0.15, opacity: 0.35, colorscheme: 'Jmol' },
            sphere: { scale: 0.2, opacity: 0.35 }
        });

        // Làm nổi bật đoạn peptide được chọn
        residues.forEach(r => {
            this.viewer.addStyle({ resi: r }, {
                stick: { radius: 0.42, color: '#facc15' },
                sphere: { scale: 0.65, color: '#facc15' }
            });
        });

        // Xóa label cũ
        if (this.activeLabels && this.activeLabels.length > 0) {
            this.activeLabels.forEach(l => this.viewer.removeLabel(l));
            this.activeLabels = [];
        }

        try {
            const lbl = this.viewer.addLabel(`${seg.name} (${seg.peptideType})`, {
                position: { resi: residues[0] },
                backgroundColor: 0x0f172a,
                backgroundOpacity: 0.9,
                fontColor: 0xfacc15,
                borderColor: 0xeab308,
                borderWidth: 1.5,
                fontSize: 12
            });
            if (lbl) this.activeLabels.push(lbl);
        } catch (e) {}

        this.viewer.center({ resi: residues }, 600);
        this.viewer.zoom(1.3, 600);
        this.viewer.render();

        this.showFloatingHud(
            seg.name,
            `DẠNG ${seg.peptideType.toUpperCase()} (${seg.bondsCount} LIÊN KẾT PEPTIDE)`,
            `Công thức: ${seg.simpleFormula}<br>Biuret: ${seg.biuretReaction ? 'Dương tính tím (≥ 2 liên kết)' : 'Âm tính (chỉ 1 liên kết)'}`,
            '#facc15'
        );
    }

    async getPdbText(nameOrId) {
        if (nameOrId === 'linear_peptide') {
            try {
                const res = await fetch('pdb/linear_peptide.pdb');
                if (res.ok) {
                    const txt = await res.text();
                    if (txt && txt.includes('ATOM')) return txt;
                }
            } catch(e) {}
            return `HEADER    LINEAR POLYPEPTIDE BACKBONE (PRIMARY STRUCTURE)
ATOM      1  N   MET A   1       0.000   0.400   0.000  1.00 20.00           N
ATOM      2  CA  MET A   1       1.250   1.100   0.000  1.00 20.00           C
ATOM      3  C   MET A   1       2.450   0.350   0.000  1.00 20.00           C
ATOM      4  O   MET A   1       2.550  -0.850   0.200  1.00 20.00           O
ATOM      5  CB  MET A   1       1.250   2.500   0.600  1.00 20.00           C
ATOM      6  N   ALA A   2       3.550  -0.400   0.000  1.00 20.00           N
ATOM      7  CA  ALA A   2       4.800  -1.100   0.000  1.00 20.00           C
ATOM      8  C   ALA A   2       6.000  -0.350   0.000  1.00 20.00           C
ATOM      9  O   ALA A   2       6.100   0.850   0.200  1.00 20.00           O
ATOM     10  CB  ALA A   2       4.800  -2.500  -0.600  1.00 20.00           C
ATOM     11  N   SER A   3       7.100   0.400   0.000  1.00 20.00           N
ATOM     12  CA  SER A   3       8.350   1.100   0.000  1.00 20.00           C
ATOM     13  C   SER A   3       9.550   0.350   0.000  1.00 20.00           C
ATOM     14  O   SER A   3       9.650  -0.850   0.200  1.00 20.00           O
ATOM     15  CB  SER A   3       8.350   2.500   0.600  1.00 20.00           C
ATOM     16  OG  SER A   3       8.350   3.800   0.600  1.00 20.00           O
ATOM     17  N   GLU A   4      10.650  -0.400   0.000  1.00 20.00           N
ATOM     18  CA  GLU A   4      11.900  -1.100   0.000  1.00 20.00           C
ATOM     19  C   GLU A   4      13.100  -0.350   0.000  1.00 20.00           C
ATOM     20  O   GLU A   4      13.200   0.850   0.200  1.00 20.00           O
ATOM     21  CB  GLU A   4      11.900  -2.500  -0.600  1.00 20.00           C
ATOM     22  CG  GLU A   4      12.700  -3.400  -0.600  1.00 20.00           C
ATOM     23  N   LYS A   5      14.200   0.400   0.000  1.00 20.00           N
ATOM     24  CA  LYS A   5      15.450   1.100   0.000  1.00 20.00           C
ATOM     25  C   LYS A   5      16.650   0.350   0.000  1.00 20.00           C
ATOM     26  O   LYS A   5      16.750  -0.850   0.200  1.00 20.00           O
ATOM     27  CB  LYS A   5      15.450   2.500   0.600  1.00 20.00           C
ATOM     28  CG  LYS A   5      16.250   3.400   0.600  1.00 20.00           C
ATOM     29  N   LEU A   6      17.750  -0.400   0.000  1.00 20.00           N
ATOM     30  CA  LEU A   6      19.000  -1.100   0.000  1.00 20.00           C
ATOM     31  C   LEU A   6      20.200  -0.350   0.000  1.00 20.00           C
ATOM     32  O   LEU A   6      20.300   0.850   0.200  1.00 20.00           O
ATOM     33  CB  LEU A   6      19.000  -2.500  -0.600  1.00 20.00           C
ATOM     34  CG  LEU A   6      19.800  -3.400  -0.600  1.00 20.00           C
ATOM     35  N   HIS A   7      21.300   0.400   0.000  1.00 20.00           N
ATOM     36  CA  HIS A   7      22.550   1.100   0.000  1.00 20.00           C
ATOM     37  C   HIS A   7      23.750   0.350   0.000  1.00 20.00           C
ATOM     38  O   HIS A   7      23.850  -0.850   0.200  1.00 20.00           O
ATOM     39  CB  HIS A   7      22.550   2.500   0.600  1.00 20.00           C
ATOM     40  CG  HIS A   7      23.350   3.400   0.600  1.00 20.00           C
ATOM     41  N   VAL A   8      24.850  -0.400   0.000  1.00 20.00           N
ATOM     42  CA  VAL A   8      26.100  -1.100   0.000  1.00 20.00           C
ATOM     43  C   VAL A   8      27.300  -0.350   0.000  1.00 20.00           C
ATOM     44  O   VAL A   8      27.400   0.850   0.200  1.00 20.00           O
ATOM     45  CB  VAL A   8      26.100  -2.500  -0.600  1.00 20.00           C
ATOM     46  CG  VAL A   8      26.900  -3.400  -0.600  1.00 20.00           C
ATOM     47  OXT VAL A   8      27.700  -1.200   0.000  1.00 20.00           O
END`;
        }

        const urls = [
            `pdb/${nameOrId}.pdb`,
            `/api/pdb/${nameOrId}`,
            `https://files.rcsb.org/download/${nameOrId.toUpperCase()}.pdb`,
            `https://www.ebi.ac.uk/pdbe/entry-files/download/pdb${nameOrId.toLowerCase()}.ent`
        ];

        for (const u of urls) {
            try {
                const res = await fetch(u);
                if (res.ok) {
                    const text = await res.text();
                    if (text && text.includes('ATOM')) return text;
                }
            } catch(e) {}
        }
        return null;
    }

    // =========================================================================
    // KẾT XUẤT 3D BẬC 1: XƯƠNG SỐNG PEPTIDE
    // =========================================================================
    async renderLevel1_3D() {
        const v = this.initViewer();
        if (!v) return;

        if (this.level1Mode !== 'folded') {
            const pdbText = await this.getPdbText('linear_peptide');
            if (!pdbText) return;

            v.clear();
            v.addModel(pdbText, "pdb");
            v.setStyle({}, {
                stick: { radius: 0.22, colorscheme: 'Jmol' },
                sphere: { scale: 0.36, colorscheme: 'Jmol' }
            });

            if (typeof v.setClickable === 'function') {
                v.setClickable({}, true, (atom) => this.handleDirect3DClick(atom));
            }

            try {
                v.addLabel("ĐẦU N (H3N+)", {
                    position: { resi: 1 },
                    backgroundColor: 0x0284c7,
                    backgroundOpacity: 0.9,
                    fontColor: 0xffffff,
                    borderColor: 0x38bdf8,
                    borderWidth: 1.5,
                    fontSize: 12
                });
                v.addLabel("Liên Kết Peptide (-CO-NH-)", {
                    position: { resi: 4 },
                    backgroundColor: 0x0f172a,
                    backgroundOpacity: 0.9,
                    fontColor: 0x00f2fe,
                    borderColor: 0x00f2fe,
                    borderWidth: 1,
                    fontSize: 11
                });
                v.addLabel("ĐẦU C (-COO-)", {
                    position: { resi: 8 },
                    backgroundColor: 0xe11d48,
                    backgroundOpacity: 0.9,
                    fontColor: 0xffffff,
                    borderColor: 0xf43f5e,
                    borderWidth: 1.5,
                    fontSize: 12
                });
            } catch (e) {}

            v.zoomTo();
            v.zoom(0.85);
            v.render();
            v.spin("y", 0.35);
        } else {
            const pdbText = await this.getPdbText('1CRN');
            if (!pdbText) return;

            v.clear();
            v.addModel(pdbText, "pdb");
            v.setStyle({}, {
                stick: { radius: 0.28, colorscheme: 'Jmol' },
                sphere: { scale: 0.38, colorscheme: 'Jmol' }
            });

            if (typeof v.setClickable === 'function') {
                v.setClickable({}, true, (atom) => this.handleDirect3DClick(atom));
            }

            try {
                v.addLabel("Cấu trúc BẬC 3 sau khi chuỗi Bậc 1 cuộn gập hoàn chỉnh (Crambin)", {
                    position: { resi: 20 },
                    backgroundColor: 0x450a0a,
                    backgroundOpacity: 0.9,
                    fontColor: 0xfecaca,
                    borderColor: 0xef4444,
                    borderWidth: 1,
                    fontSize: 11
                });
            } catch (e) {}

            v.zoomTo();
            v.zoom(0.85);
            v.render();
            v.spin("y", 0.4);
        }
    }

    switchLevel1Mode(mode) {
        this.level1Mode = mode;
        this.renderLevelContent(1);
        if (window.app) window.app.playSound('click');
    }

    // =========================================================================
    // KẾT XUẤT 3D BẬC 2: XOẮN ALPHA & PHIẾN GẤP BETA
    // =========================================================================
    async renderLevel2_3D() {
        const v = this.initViewer();
        if (!v) return;

        const pdbText = await this.getPdbText(this.secondaryType === 'alpha' ? '1MBO' : '1CRN');
        if (!pdbText) return;

        v.clear();
        v.addModel(pdbText, "pdb");

        if (typeof v.setClickable === 'function') {
            v.setClickable({}, true, (atom) => this.handleDirect3DClick(atom));
        }

        if (this.secondaryType === 'alpha') {
            v.setStyle({}, {
                cartoon: {
                    colorscheme: {
                        prop: 'ss',
                        map: { 'h': '#ec4899', 's': '#f59e0b', 'c': '#94a3b8' }
                    }
                }
            });
            try {
                v.addLabel("Xoắn Alpha (Alpha-helix) - Myoglobin 1MBO", {
                    position: { resi: 40 },
                    backgroundColor: 0x831843,
                    backgroundOpacity: 0.85,
                    fontColor: 0xffffff,
                    borderColor: 0xec4899,
                    borderWidth: 1,
                    fontSize: 11
                });
            } catch (e) {}
        } else {
            v.setStyle({}, {
                cartoon: {
                    colorscheme: {
                        prop: 'ss',
                        map: { 's': '#f59e0b', 'h': '#ec4899', 'c': '#94a3b8' }
                    }
                }
            });
            try {
                v.addLabel("Phiến Gấp Beta (Beta-sheet) - Crambin 1CRN", {
                    position: { resi: 20 },
                    backgroundColor: 0x78350f,
                    backgroundOpacity: 0.85,
                    fontColor: 0xffffff,
                    borderColor: 0xf59e0b,
                    borderWidth: 1,
                    fontSize: 11
                });
            } catch (e) {}
        }

        v.zoomTo();
        v.zoom(0.85);
        v.render();
        v.spin("y", 0.45);
    }

    switchSecondary(type) {
        this.secondaryType = type;
        this.renderLevelContent(2);
        if (window.app) window.app.playSound('click');
    }

    zoomSecondaryHbonds() {
        if (!this.viewer) return;
        this.viewer.setStyle({}, {
            cartoon: { opacity: 0.4, color: '#ec4899' },
            stick: { radius: 0.2, colorscheme: 'Jmol' }
        });
        this.viewer.center({ resi: [35, 36, 37, 38, 39, 40] }, 600);
        this.viewer.zoom(1.4, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Liên Kết Hydrogen Mạch Chính",
            "LỰC DUY TRÌ BẬC 2 (H-BONDS)",
            "Mỗi nhóm C=O vị trí i tạo liên kết hydrogen với nhóm N-H vị trí i+4. Khoảng cách liên kết ~2.8 - 3.0 Å tạo bước xoắn tuần hoàn 0.54 nm.",
            "#10b981"
        );
    }

    // =========================================================================
    // KẾT XUẤT 3D BẬC 3: CRAMBIN (1CRN) & CÁC LỰC LIÊN KẾT BẬC CAO
    // =========================================================================
    async renderLevel3_3D(style = 'cartoon') {
        const v = this.initViewer();
        if (!v) return;

        const pdbText = await this.getPdbText('1CRN');
        if (!pdbText) return;

        v.clear();
        v.addModel(pdbText, "pdb");

        if (typeof v.setClickable === 'function') {
            v.setClickable({}, true, (atom) => this.handleDirect3DClick(atom));
        }

        if (style === 'cartoon') {
            v.setStyle({}, { cartoon: { color: 'spectrum' } });
        } else if (style === 'stick') {
            v.setStyle({}, { stick: { radius: 0.3, colorscheme: 'Jmol' } });
        } else if (style === 'sphere') {
            v.setStyle({}, { sphere: { colorscheme: 'Jmol' } });
        }

        v.addStyle({ resn: 'CYS' }, {
            stick: { radius: 0.35, color: '#facc15' },
            sphere: { scale: 0.5, color: '#facc15' }
        });

        try {
            v.addLabel("3 Cầu Nối Disulfide (-S-S-)", {
                position: { resi: 16 },
                backgroundColor: 0x713f12,
                backgroundOpacity: 0.85,
                fontColor: 0xfde047,
                borderColor: 0xfacc15,
                borderWidth: 1,
                fontSize: 11
            });
        } catch (e) {}

        v.zoomTo();
        v.zoom(0.85);
        v.render();
        v.spin("y", 0.45);
    }

    setStyle3(style) {
        this.renderLevel3_3D(style);
        document.querySelectorAll('#level3StyleButtonsGroup .mini-control-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${style}'`));
        });
        if (window.app) window.app.playSound('click');
    }

    // Zoom Cầu Nối Disulfide (-S-S-)
    zoomDisulfide() {
        if (!this.viewer) return;
        this.viewer.setStyle({}, { cartoon: { opacity: 0.3, color: '#475569' } });
        this.viewer.addStyle({ resn: 'CYS' }, {
            stick: { radius: 0.45, color: '#facc15' },
            sphere: { scale: 0.7, color: '#eab308' }
        });
        this.viewer.center({ resi: [3, 4, 16, 26, 32, 40] }, 600);
        this.viewer.zoom(1.4, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Cầu Nối Disulfide (-S-S-)",
            "LIÊN KẾT CỘNG HÓA TRỊ BẬC 3 (~250 kJ/mol)",
            "Hình thành giữa 2 gốc Cysteine (Cys3-Cys40, Cys4-Cys32, Cys16-Cys26). Độ dài liên kết S-S là 2.05 Å. Cực kỳ bền vững, chỉ bị bẻ gãy khi có chất khử mạnh.",
            "#facc15"
        );
        if (window.app) window.app.playSound('beep');
    }

    // Zoom Lõi Kỵ Nước (Hydrophobic Core)
    zoomHydrophobicCore() {
        if (!this.viewer) return;
        this.viewer.setStyle({}, { cartoon: { opacity: 0.25, color: '#64748b' } });
        // Làm nổi bật các gốc kỵ nước: Leu, Ile, Val, Phe
        this.viewer.addStyle({ resn: ['LEU', 'ILE', 'VAL', 'PHE', 'ALA'] }, {
            sphere: { scale: 0.55, color: '#38bdf8' },
            stick: { radius: 0.3, color: '#0284c7' }
        });
        this.viewer.center({ resn: ['ILE', 'VAL', 'LEU'] }, 600);
        this.viewer.zoom(1.2, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Lõi Kỵ Nước (Hydrophobic Core)",
            "HIỆU ỨNG NHIỆT ĐỘNG CUỘN GẬP",
            "Các gốc kỵ nước (Val, Leu, Ile, Phe) cuộn giấu sâu vào lõi phân tử để tránh tiếp xúc với nước, tăng entropy dung môi và làm protein ổn định ở trạng thái cuộn gập nguyên vẹn.",
            "#38bdf8"
        );
        if (window.app) window.app.playSound('beep');
    }

    // Zoom Cầu Muối Ion (Salt Bridge)
    zoomSaltBridge() {
        if (!this.viewer) return;
        this.viewer.setStyle({}, { cartoon: { opacity: 0.3, color: '#475569' } });
        this.viewer.addStyle({ resn: ['ARG', 'LYS'] }, {
            stick: { radius: 0.4, color: '#38bdf8' },
            sphere: { scale: 0.6, color: '#0284c7' }
        });
        this.viewer.addStyle({ resn: ['ASP', 'GLU'] }, {
            stick: { radius: 0.4, color: '#f43f5e' },
            sphere: { scale: 0.6, color: '#e11d48' }
        });
        this.viewer.center({ resn: ['ARG', 'ASP', 'GLU'] }, 600);
        this.viewer.zoom(1.3, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Cầu Muối Ion (Salt Bridge)",
            "TƯƠNG TÁC TĨNH ĐIỆN BẬC 3 (~12-20 kJ/mol)",
            "Tương tác hút tĩnh điện giữa nhóm guanidinium/amino tích điện dương (-NH3+) của Arg/Lys với nhóm carboxylate tích điện âm (-COO-) của Asp/Glu.",
            "#f43f5e"
        );
        if (window.app) window.app.playSound('beep');
    }

    resetLevel3View() {
        this.hideFloatingHud();
        this.renderLevel3_3D();
        if (window.app) window.app.playSound('click');
    }

    // =========================================================================
    // KẾT XUẤT 3D BẬC 4: HEMOGLOBIN (4HHB) & ZOOM CHI TIẾT
    // =========================================================================
    async renderLevel4_3D(colorMode = 'chain') {
        const v = this.initViewer();
        if (!v) return;

        const pdbText = await this.getPdbText('4HHB');
        if (!pdbText) return;

        v.clear();
        v.addModel(pdbText, "pdb");

        if (typeof v.setClickable === 'function') {
            v.setClickable({}, true, (atom) => this.handleDirect3DClick(atom));
        }

        if (colorMode === 'chain') {
            v.setStyle({}, {
                cartoon: {
                    colorscheme: {
                        prop: 'chain',
                        map: { 'A': '#00f2fe', 'B': '#a855f7', 'C': '#38bdf8', 'D': '#ec4899' }
                    }
                }
            });
        } else {
            v.setStyle({}, {
                cartoon: {
                    colorscheme: {
                        prop: 'ss',
                        map: { 'h': '#ec4899', 's': '#f59e0b', 'c': '#00f2fe' }
                    }
                }
            });
        }

        v.addStyle({ resn: 'HEM' }, {
            stick: { radius: 0.35, colorscheme: 'Jmol' },
            sphere: { scale: 0.6, color: '#dc2626' }
        });
        v.addStyle({ elem: 'FE' }, {
            sphere: { scale: 0.9, color: '#ff0000' }
        });

        try {
            v.addLabel("4 Tiểu Đơn Vị (2 Alpha + 2 Beta) & Nhân Heme Fe2+", {
                position: { resn: 'HEM' },
                backgroundColor: 0x450a0a,
                backgroundOpacity: 0.85,
                fontColor: 0xfca5a5,
                borderColor: 0xef4444,
                borderWidth: 1,
                fontSize: 11
            });
        } catch (e) {}

        v.zoomTo();
        v.zoom(0.85);
        v.render();
        v.spin("y", 0.4);
    }

    setStyle4(mode) {
        this.renderLevel4_3D(mode);
        document.querySelectorAll('#level4StyleButtonsGroup .mini-control-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${mode}'`));
        });
        if (window.app) window.app.playSound('click');
    }

    // Zoom Cận Cảnh Nhân Heme & Ion Fe2+
    zoomHemeDetailed() {
        if (!this.viewer) return;
        this.viewer.setStyle({}, { cartoon: { opacity: 0.25 } });
        this.viewer.addStyle({ resn: 'HEM' }, {
            stick: { radius: 0.4, colorscheme: 'Jmol' },
            sphere: { scale: 0.6, color: '#dc2626' }
        });
        this.viewer.addStyle({ elem: 'FE' }, {
            sphere: { scale: 1.1, color: '#ef4444' }
        });
        // Hiển thị gốc Histidine phối trí (His87)
        this.viewer.addStyle({ resn: 'HIS' }, {
            stick: { radius: 0.3, color: '#38bdf8' }
        });

        this.viewer.center({ resn: 'HEM' }, 600);
        this.viewer.zoom(1.5, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Túi Heme Mang Ion Fe²⁺ Phối Trí",
            "TRUNG TÂM HOẠT ĐỘNG GẮN OXY (O2)",
            "Ion Fe2+ nằm ở tâm vòng Porphyrin, liên kết phối trí với 4 nguyên tử N của vòng, 1 nguyên tử N của gốc Histidine gần (Proximal His F8), và vị trí thứ 6 liên kết thuận nghịch với phân tử Oxy.",
            "#ef4444"
        );
        if (window.app) window.app.playSound('beep');
    }

    // Zoom Tiếp Diện Chuỗi Alpha-Beta (Subunit Interface)
    zoomSubunitInterface() {
        if (!this.viewer) return;
        this.viewer.setStyle({ chain: 'A' }, { cartoon: { color: '#00f2fe', opacity: 0.8 } });
        this.viewer.setStyle({ chain: 'B' }, { cartoon: { color: '#a855f7', opacity: 0.8 } });
        this.viewer.setStyle({ chain: 'C' }, { cartoon: { color: '#38bdf8', opacity: 0.2 } });
        this.viewer.setStyle({ chain: 'D' }, { cartoon: { color: '#ec4899', opacity: 0.2 } });

        this.viewer.center({ chain: 'A' }, 600);
        this.viewer.zoom(1.2, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Tiếp Diện Tiểu Đơn Vị (α₁ - β₁ Interface)",
            "LIÊN KẾT PHỨC HỢP ĐA CHUỖI BẬC 4",
            "Các chuỗi polypeptide gắn kết với nhau bằng hàng chục tương tác không cộng hóa trị (liên kết hydrogen, tương tác van der Waals). Khi gắn O2, các chuỗi trượt xoay 15° tạo hiệu ứng hợp tác Allosteric.",
            "#a855f7"
        );
        if (window.app) window.app.playSound('beep');
    }

    // Zoom Hốc Điều Hòa Allosteric (2,3-BPG site)
    zoomAllostericSite() {
        if (!this.viewer) return;
        this.viewer.setStyle({}, { cartoon: { color: 'spectrum', opacity: 0.5 } });
        this.viewer.center({ resn: ['LYS', 'HIS'] }, 600);
        this.viewer.zoom(1.1, 600);
        this.viewer.render();

        this.showFloatingHud(
            "Hốc Điều Hòa Allosteric (Central Cavity)",
            "CƠ CHẾ ĐIỀU HÒA DỊ LẬP THỂ",
            "Hốc trung tâm giữa 2 chuỗi Beta là nơi gắn phân tử 2,3-Bisphosphoglycerate (2,3-BPG). Khi 2,3-BPG gắn vào, nó làm bền trạng thái T (Tense state), giúp Hemoglobin dễ dàng giải phóng oxy cho các mô cơ thể.",
            "#10b981"
        );
        if (window.app) window.app.playSound('beep');
    }

    resetLevel4View() {
        this.hideFloatingHud();
        this.renderLevel4_3D();
        if (window.app) window.app.playSound('click');
    }

    // =========================================================================
    // XỬ LÝ NHẤP TRỰC TIẾP TRÊN 3D 4 BẬC CẤU TRÚC
    // =========================================================================
    handleDirect3DClick(atom) {
        if (!atom || !this.viewer) return;

        const chain = atom.chain || 'A';
        const resi = atom.resi || 1;
        const resn = (atom.resn || 'ALA').toUpperCase();
        const atomName = atom.atom || 'CA';
        const elem = atom.elem || 'C';

        // Làm nổi bật gốc trong 3D
        this.viewer.addStyle({ resi: resi, chain: chain }, {
            stick: { radius: 0.45, color: '#facc15' },
            sphere: { scale: 0.7, color: '#facc15' }
        });
        this.viewer.addStyle({ resi: resi, chain: chain, atom: atomName }, {
            sphere: { scale: 0.9, color: '#00f2fe' }
        });

        const aaInfoTable = window.chemical2DEngine ? window.chemical2DEngine.aminoAcidRChains : {};
        const aaInfo = aaInfoTable[resn] || { name: resn, rHtml: '—R', type: 'Amino acid', mw: 100 };

        const title = `Gốc ${resn} #${resi} (Chuỗi ${chain}) — ${aaInfo.name}`;
        const tag = `BẬC ${this.currentLevel} | NGUYÊN TỬ: ${atomName} (${elem})`;
        const desc = `
            <div style="margin-bottom:8px;">
                • Mạch bên R: <strong style="color:var(--neon-amber);">${aaInfo.rHtml}</strong> (${aaInfo.type})<br>
                • Nguyên tố: <strong>${elem}</strong> | Vị trí: <strong>${atomName}</strong><br>
                • Khung xương sống: Tuần hoàn —N—Cα—C(=O)— phẳng 1.32 Å.
            </div>
            <div style="display:flex; gap:6px; margin-top:6px;">
                <button class="mini-control-btn" style="color:#fde047; font-size:0.75rem;" onclick="window.app.switchTab('theorysummary')">
                    📚 Học Sổ Tay Hóa 12
                </button>
            </div>
        `;

        this.showFloatingHud(title, tag, desc, '#facc15');
        this.viewer.center({ resi: resi, chain: chain }, 400);
        this.viewer.render();

        if (window.app) window.app.playSound('beep');
    }
}
