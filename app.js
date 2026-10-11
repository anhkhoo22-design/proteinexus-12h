/**
 * PROTEINEXUS 3D - Main Application Controller
 * Quản lý định tuyến tab, âm thanh Web Audio API, Hero 3D Viewer,
 * lọc tìm kiếm thư viện, modal trích dẫn chính thống wwPDB và tương tác
 */

class ProteinexusApp {
    constructor() {
        this.activeTab = 'library';
        this.audioEnabled = true;
        this.audioCtx = null;
        this.currentFilterCategory = 'all';
        this.currentFilterLevel = 'all';
        this.searchQuery = '';

        this.init();
    }

    init() {
        this.initAudio();
        this.setupTabs();
        this.renderProteinGrid();
        this.renderAminoAcidGrid();
        this.setupSearchAndFilters();
        this.setupTelemetry();
        this.setupModal();

        // 1. Khởi tạo Hero 3D Viewer trực tiếp trên Trang chủ (tab library đang hiển thị sẵn)
        const heroContainer = document.getElementById('hero3DContainer');
        if (heroContainer) {
            window.heroViewer = new ProteinViewer3D(heroContainer, true);
            setTimeout(() => {
                if (window.heroViewer) window.heroViewer.loadProteinById('hemoglobin');
            }, 100);
        }

        // 2 & 3: Không Gian 3D và 4 Bậc Cấu Trúc được khởi tạo chuẩn khi chuyển tab (lazy init)
        // tránh lỗi WebGL Attachment zero size và tối ưu hiệu năng trang web!

        // 4. Khởi tạo Phòng Thí Nghiệm Ảo
        window.virtualLab = new VirtualLabManager();

        // 5. Khởi tạo Mô-đun Giáo Dục, Ôn Luyện & Sổ Tay Lí Thuyết
        if (typeof EducationManager === 'function') {
            window.educationMgr = new EducationManager();
        }
    }

    /* =========================================================================
       WEB AUDIO API - HIỆU ỨNG ÂM THANH SCI-FI BIOTECH TỰ TẠO
       ========================================================================= */
    initAudio() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.audioCtx = new AudioContext();
        }

        const soundBtn = document.getElementById('btnToggleSound');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                this.audioEnabled = !this.audioEnabled;
                soundBtn.classList.toggle('active', this.audioEnabled);
                soundBtn.title = this.audioEnabled ? "Tắt âm thanh" : "Bật âm thanh";
                const icon = soundBtn.querySelector('svg');
                if (icon) {
                    icon.style.opacity = this.audioEnabled ? '1' : '0.4';
                }
                this.showToast(this.audioEnabled ? "Đã bật hiệu ứng âm thanh tương tác" : "Đã tắt âm thanh", "info");
            });
        }
    }

    playSound(type = 'click') {
        if (!this.audioEnabled || !this.audioCtx) return;

        try {
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const ctx = this.audioCtx;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            switch (type) {
                case 'click':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                    break;

                case 'beep':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(650, now);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;

                case 'scan':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                    break;

                case 'bubble':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.linearRampToValueAtTime(580, now + 0.08);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;

                case 'success':
                    const freqs = [523.25, 659.25, 783.99];
                    freqs.forEach((f, i) => {
                        const noteOsc = ctx.createOscillator();
                        const noteGain = ctx.createGain();
                        noteOsc.connect(noteGain);
                        noteGain.connect(ctx.destination);
                        noteOsc.type = 'sine';
                        noteOsc.frequency.setValueAtTime(f, now + i * 0.08);
                        noteGain.gain.setValueAtTime(0.12, now + i * 0.08);
                        noteGain.gain.linearRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
                        noteOsc.start(now + i * 0.08);
                        noteOsc.stop(now + i * 0.08 + 0.2);
                    });
                    break;

                case 'wrong':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.linearRampToValueAtTime(140, now + 0.18);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
            }
        } catch (e) {
            // Ignored if browser policy blocks audio before user gesture
        }
    }

    /* =========================================================================
       CHUYỂN ĐỔI TAB GIAO DIỆN
       ========================================================================= */
    setupTabs() {
        const tabBtns = document.querySelectorAll('.nav-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key;
            const tabs = ['library', 'studio3d', 'structure', 'virtuallab', 'studyquiz', 'theorysummary', 'aminoacids'];
            const idx = parseInt(key) - 1;
            if (idx >= 0 && idx < tabs.length) {
                this.switchTab(tabs[idx]);
            }
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;

        document.querySelectorAll('.nav-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        document.querySelectorAll('.tab-content').forEach(view => {
            view.classList.toggle('active', view.id === `tab-${tabId}`);
        });

        this.playSound('click');

        // Tạm dừng mọi viewer 3D đang ẩn, chỉ bật lại viewer của tab đang xem
        [window.heroViewer, window.viewer3D, window.structureMgr].forEach(v => {
            if (v && typeof v.pause === 'function') v.pause();
        });

        setTimeout(() => {
            let active = null;
            if (tabId === 'studio3d') {
                if (!window.viewer3D) {
                    const studioContainer = document.getElementById('molViewerContainer');
                    if (studioContainer) {
                        window.viewer3D = new ProteinViewer3D(studioContainer);
                        window.viewer3D.loadProteinById('hemoglobin');
                    }
                }
                active = window.viewer3D;
            } else if (tabId === 'library') {
                active = window.heroViewer;
            } else if (tabId === 'structure') {
                if (!window.structureMgr) {
                    window.structureMgr = new StructureLevelsManager();
                }
                active = window.structureMgr;
            }
            if (active && typeof active.resume === 'function') active.resume();
        }, 60);
    }

    /* =========================================================================
       KHO THƯ VIỆN PROTEIN (MODULE 1)
       ========================================================================= */
    setupSearchAndFilters() {
        const searchInput = document.getElementById('librarySearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderProteinGrid();
            });
        }

        const filterBtns = document.querySelectorAll('.category-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilterCategory = btn.dataset.category;
                this.renderProteinGrid();
                this.playSound('click');
            });
        });

        const levelSelect = document.getElementById('levelFilterSelect');
        if (levelSelect) {
            levelSelect.addEventListener('change', (e) => {
                this.currentFilterLevel = e.target.value;
                this.renderProteinGrid();
                this.playSound('click');
            });
        }
    }

    renderProteinGrid() {
        const grid = document.getElementById('proteinCardGrid');
        if (!grid) return;

        grid.innerHTML = '';

        const filtered = PROTEIN_DATABASE.filter(p => {
            const matchSearch = !this.searchQuery || 
                p.name.toLowerCase().includes(this.searchQuery) ||
                p.vietnameseName.toLowerCase().includes(this.searchQuery) ||
                p.pdbId.toLowerCase().includes(this.searchQuery) ||
                p.functionDescription.toLowerCase().includes(this.searchQuery) ||
                p.organism.toLowerCase().includes(this.searchQuery);

            const matchCategory = this.currentFilterCategory === 'all' || p.category === this.currentFilterCategory;
            const matchLevel = this.currentFilterLevel === 'all' || p.structureLevel.toString() === this.currentFilterLevel;

            return matchSearch && matchCategory && matchLevel;
        });

        const countBadge = document.getElementById('libraryCountBadge');
        if (countBadge) countBadge.textContent = `${filtered.length} / ${PROTEIN_DATABASE.length}`;

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: 14px; border: 1px dashed var(--border-subtle);">
                    <p style="color: var(--text-secondary); font-size: 1.1rem;">Không tìm thấy protein phù hợp với từ khóa "${this.searchQuery}".</p>
                    <button class="btn-cyber-primary" style="margin: 1rem auto 0;" onclick="window.app.clearSearch()">Đặt lại bộ lọc</button>
                </div>
            `;
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'protein-card';

            const levelNames = { 1: "Bậc I", 2: "Bậc II", 3: "Bậc III", 4: "Bậc IV" };

            card.innerHTML = `
                <div>
                    <div class="card-top">
                        <span class="card-pdb-badge">
                            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                            ${p.pdbId} (wwPDB)
                        </span>
                        <span class="card-level-badge level-${p.structureLevel}">
                            ${levelNames[p.structureLevel]}
                        </span>
                    </div>
                    <h3 class="card-title">${p.vietnameseName}</h3>
                    <div class="card-organism">${p.organism}</div>
                    <p class="card-desc">${p.functionDescription}</p>
                </div>

                <div>
                    <div class="card-meta-list">
                        <div class="card-meta-item">
                            Khối lượng:
                            <strong>${p.molecularWeight}</strong>
                        </div>
                        <div class="card-meta-item">
                            Độ phân giải:
                            <strong>${p.resolution || '1.74 Å'}</strong>
                        </div>
                        <div class="card-meta-item">
                            Số chuỗi:
                            <strong>${p.chains}</strong>
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn-card-view3d" onclick="window.app.viewProtein3D('${p.id}')">
                            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            Xem 3D Ngay
                        </button>
                        <button class="btn-card-detail" onclick="window.app.openProteinDetailModal('${p.id}')">
                            Đọc thêm
                        </button>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    clearSearch() {
        const input = document.getElementById('librarySearchInput');
        if (input) input.value = '';
        this.searchQuery = '';
        this.currentFilterCategory = 'all';
        this.currentFilterLevel = 'all';
        document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
        this.renderProteinGrid();
    }

    viewProtein3D(proteinId) {
        const p = PROTEIN_DATABASE.find(item => item.id === proteinId);
        if (p) {
            // Cập nhật Hero 3D nếu người dùng đang ở trang chủ
            if (window.heroViewer) {
                window.heroViewer.loadProteinById(proteinId);
                const titleEl = document.getElementById('heroProteinTitle');
                const descEl = document.getElementById('heroProteinDesc');
                if (titleEl) titleEl.textContent = `${p.vietnameseName} - ${p.pdbId}`;
                if (descEl) descEl.textContent = `${p.functionDescription} (Độ phân giải: ${p.resolution}, wwPDB: ${p.pdbId}).`;
            }
        }

        // Chuyển sang 3D Studio
        this.switchTab('studio3d');
        if (window.viewer3D) {
            window.viewer3D.loadProteinById(proteinId);
        }
        const presetSelect = document.getElementById('presetProteinSelect');
        if (presetSelect) presetSelect.value = proteinId;

        this.showToast(`Đang hiển thị mô hình 3D nguyên tử của [${p ? p.pdbId : proteinId}]`, "info");
    }

    /* =========================================================================
       MODAL TRÍCH DẪN NGUỒN CHÍNH THỐNG (wwPDB, RCSB, UniProt)
       ========================================================================= */
    openProteinDetailModal(proteinId) {
        const p = PROTEIN_DATABASE.find(item => item.id === proteinId);
        if (!p) return;

        const modalBody = document.getElementById('modalContentContainer');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;">
                        <span class="card-pdb-badge" style="font-size: 0.9rem;">Mã wwPDB: ${p.pdbId}</span>
                        <span class="card-level-badge level-${p.structureLevel}">Cấu trúc Bậc ${p.structureLevel}</span>
                    </div>
                    <h2 style="font-family: var(--font-heading); color: #fff; font-size: 1.5rem;">${p.name}</h2>
                    <span style="font-style: italic; color: var(--text-secondary); font-size: 0.9rem;">${p.organismScientific || p.organism}</span>
                </div>
            </div>

            <!-- Chức năng & Đột biến (Ưu tiên hiển thị trước cho học sinh) -->
            <div style="margin-bottom: 1.25rem;">
                <h4 style="color: var(--neon-cyan); font-size: 1rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 6px;">
                    🧬 Vai Trò Sinh Học:
                </h4>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6; background: rgba(0, 242, 254, 0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--neon-cyan); margin: 0;">${p.functionDescription}</p>
            </div>

            <div style="margin-bottom: 1.25rem;">
                <h4 style="color: var(--neon-magenta); font-size: 1rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 6px;">
                    🩺 Ý Nghĩa Lâm Sàng &amp; Đột Biến Bệnh Lý:
                </h4>
                <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6; background: rgba(255, 0, 127, 0.05); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--neon-magenta); margin: 0;">${p.diseaseOrApplication}</p>
            </div>

            <!-- Bảng thông số đo đạc tinh thể -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.25rem; background: rgba(7, 12, 24, 0.6); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Độ phân giải (Resolution):</span>
                    <p style="font-family: var(--font-mono); color: var(--neon-emerald); font-weight: 700; font-size: 1.1rem; margin: 4px 0 0 0;">${p.resolution}</p>
                </div>
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Số chuỗi Polypeptide:</span>
                    <p style="font-family: var(--font-mono); color: #fff; font-weight: 700; margin: 4px 0 0 0;">${p.chains}</p>
                </div>
            </div>

            <!-- Trích dẫn công trình khoa học gốc (Đặt ở cuối bảng) -->
            <div class="citation-box" style="margin-bottom: 1.25rem;">
                <div class="citation-header">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    TRÍCH DẪN KHOA HỌC CHÍNH THỨC (PRIMARY CITATION):
                </div>
                <div class="citation-text">
                    <strong>Tác giả:</strong> ${p.citation.authors}<br>
                    <strong>Tên bài báo:</strong> "${p.citation.title}"<br>
                    <strong>Tạp chí:</strong> <em>${p.citation.journal}</em> (${p.citation.year}), Tập ${p.citation.volume}, Trang ${p.citation.pages}.
                </div>
                <div class="citation-badges">
                    <a href="https://doi.org/${p.citation.doi}" target="_blank" rel="noopener noreferrer" class="citation-badge" style="color: var(--neon-cyan); border-color: var(--neon-cyan);">
                        DOI: ${p.citation.doi} &nearr;
                    </a>
                    ${p.citation.pubmedId ? `
                    <a href="https://pubmed.ncbi.nlm.nih.gov/${p.citation.pubmedId}" target="_blank" rel="noopener noreferrer" class="citation-badge">
                        PubMed PMID: ${p.citation.pubmedId} &nearr;
                    </a>` : ''}
                    <a href="${p.officialDatabaseUrls.rcsb}" target="_blank" rel="noopener noreferrer" class="citation-badge" style="color: #38bdf8;">
                        RCSB PDB ${p.pdbId} &nearr;
                    </a>
                    <a href="${p.officialDatabaseUrls.uniprot}" target="_blank" rel="noopener noreferrer" class="citation-badge" style="color: #a855f7;">
                        UniProtKB ${p.uniprotId} &nearr;
                    </a>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
                <button class="btn-cyber-primary" onclick="window.app.toggleModal(false); window.app.viewProtein3D('${p.id}');">
                    Khởi Chạy 3D Studio
                </button>
            </div>
        `;

        this.toggleModal(true);
    }

    /* =========================================================================
       BẢNG 20 AMINO ACID MATRIX (MODULE 5)
       ========================================================================= */
    renderAminoAcidGrid() {
        const grid = document.getElementById('aminoAcidGrid');
        if (!grid) return;

        grid.innerHTML = '';

        const typeLabels = {
            'nonpolar': 'Kỵ nước',
            'polar': 'Phân cực',
            'positive': 'Bazơ (+)',
            'negative': 'Axit (-)',
            'special': 'Đặc biệt'
        };

        AMINO_ACID_TABLE.forEach(aa => {
            const card = document.createElement('div');
            card.className = 'aa-card';
            card.innerHTML = `
                <div class="aa-top">
                    <div class="aa-code-box">
                        <span class="aa-code3">${aa.code3}</span>
                        <span class="aa-code1">${aa.code1}</span>
                    </div>
                    <span class="aa-type-pill type-${aa.type}">${typeLabels[aa.type]}</span>
                </div>
                <h4 style="font-size: 1.05rem; color: #fff; margin-bottom: 0.3rem;">${aa.name}</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.8rem;">${aa.desc}</p>
                <div style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 6px; display: flex; justify-content: space-between;">
                    <span>pI: <strong style="color: var(--neon-cyan);">${aa.pI}</strong></span>
                    <span>KLPT: <strong style="color: #fff;">${aa.mw} Da</strong></span>
                </div>
            `;

            card.addEventListener('click', () => {
                this.openAminoAcidModal(aa);
                this.playSound('click');
            });

            grid.appendChild(card);
        });
    }

    openAminoAcidModal(aa) {
        const modalBody = document.getElementById('modalContentContainer');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">
                <div style="width: 55px; height: 55px; background: rgba(0, 242, 254, 0.15); border: 2px solid var(--neon-cyan); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1.4rem; color: #fff; font-weight: 800;">
                    ${aa.code3}
                </div>
                <div>
                    <h2 style="font-family: var(--font-heading); color: #fff; font-size: 1.5rem;">${aa.name} (${aa.code1})</h2>
                    <span class="aa-type-pill type-${aa.type}" style="display: inline-block; margin-top: 4px;">${aa.polarity}</span>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; background: rgba(7, 12, 24, 0.6); padding: 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Điểm đẳng điện (pI):</span>
                    <p style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--neon-cyan); font-weight: 700;">${aa.pI}</p>
                </div>
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-secondary);">Khối lượng phân tử:</span>
                    <p style="font-family: var(--font-mono); font-size: 1.1rem; color: #fff; font-weight: 700;">${aa.mw} g/mol</p>
                </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
                <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;">Bộ Ba Mã Hóa (Codons trên mRNA):</h4>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${aa.codons.map(c => `<span style="font-family: var(--font-mono); font-size: 0.85rem; padding: 4px 10px; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 6px; color: var(--neon-cyan);">${c}</span>`).join('')}
                </div>
            </div>

            <div>
                <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 0.5rem;">Vai Trò Sinh Học & Cấu Trúc:</h4>
                <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">${aa.desc}</p>
            </div>
        `;

        this.toggleModal(true);
    }

    openGlobalSourcesModal() {
        const modalBody = document.getElementById('modalContentContainer');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                    <span style="background: rgba(16, 185, 129, 0.2); border: 1px solid var(--neon-emerald); color: var(--neon-emerald); font-family: var(--font-mono); font-size: 0.8rem; padding: 3px 8px; border-radius: 4px; font-weight: 700;">
                        100% NGUỒN CHÍNH THỐNG
                    </span>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Xác thực khoa học quốc tế</span>
                </div>
                <h2 style="font-family: var(--font-heading); color: #fff; font-size: 1.6rem; margin-bottom: 0.4rem;">
                    🏛️ Nguồn Dữ Liệu & Bản Quyền Khoa Học
                </h2>
                <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
                    Mọi mô hình 3D và thông tin hóa sinh trên <strong>PROTEINEXUS</strong> đều được trích xuất trực tiếp từ các ngân hàng dữ liệu cấu trúc sinh học hàng đầu thế giới:
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: rgba(7, 12, 24, 0.7); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 10px; padding: 1rem;">
                    <div style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--neon-cyan); margin-bottom: 0.3rem;">
                        1. wwPDB (Worldwide PDB)
                    </div>
                    <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.5rem;">
                        Tổ chức quốc tế duy nhất quản lý kho lưu trữ toàn cầu các cấu trúc 3D phân tử sinh học (thành lập từ 1971).
                    </p>
                    <a href="https://www.wwpdb.org" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-cyan); text-decoration: underline;">
                        wwpdb.org &rarr;
                    </a>
                </div>

                <div style="background: rgba(7, 12, 24, 0.7); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; padding: 1rem;">
                    <div style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--neon-purple); margin-bottom: 0.3rem;">
                        2. RCSB PDB (Mỹ)
                    </div>
                    <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.5rem;">
                        Cung cấp tệp tọa độ nguyên tử (.pdb) tinh thể học tia X độ phân giải cao cho từng protein.
                    </p>
                    <a href="https://www.rcsb.org" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-purple); text-decoration: underline;">
                        rcsb.org &rarr;
                    </a>
                </div>

                <div style="background: rgba(7, 12, 24, 0.7); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; padding: 1rem;">
                    <div style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--neon-emerald); margin-bottom: 0.3rem;">
                        3. PDBe (Châu Âu / EMBL-EBI)
                    </div>
                    <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.5rem;">
                        Trung tâm thông tin sinh học châu Âu đối chiếu cấu trúc không gian và chức năng hóa sinh.
                    </p>
                    <a href="https://www.ebi.ac.uk/pdbe" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-emerald); text-decoration: underline;">
                        ebi.ac.uk/pdbe &rarr;
                    </a>
                </div>

                <div style="background: rgba(7, 12, 24, 0.7); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 1rem;">
                    <div style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--neon-amber); margin-bottom: 0.3rem;">
                        4. UniProtKB (Universal Protein)
                    </div>
                    <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.5rem;">
                        Kho trình tự amino acid và chú giải chức năng sinh lý chuẩn xác của các protein.
                    </p>
                    <a href="https://www.uniprot.org" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--neon-amber); text-decoration: underline;">
                        uniprot.org &rarr;
                    </a>
                </div>
            </div>

            <div style="background: #010409; border-radius: 10px; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.08);">
                <h4 style="font-family: var(--font-heading); font-size: 1rem; color: #fff; margin-bottom: 0.75rem;">
                    Danh Mục 9 Cấu Trúc PDB Chuẩn Đang Sử Dụng:
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 220px; overflow-y: auto;">
                    ${PROTEIN_DATABASE.map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">
                            <div>
                                <strong style="color: var(--neon-cyan); font-family: var(--font-mono);">${p.pdbId}</strong>: 
                                <span style="color: #fff;">${p.name}</span>
                                <span style="color: var(--text-secondary); font-size: 0.8rem; margin-left: 6px;">(${p.resolution || '1.74 Å'}, ${p.experimentalMethod || 'X-ray'})</span>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <a href="${p.officialDatabaseUrls?.rcsb || 'https://www.rcsb.org/structure/' + p.pdbId}" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--neon-cyan); padding: 3px 8px; background: rgba(0,242,254,0.1); border-radius: 4px; border: 1px solid rgba(0,242,254,0.3);">
                                    RCSB PDB &rarr;
                                </a>
                                <button class="mini-control-btn" style="padding: 2px 8px; font-size: 0.75rem;" onclick="window.app.toggleModal(false); window.app.viewProtein3D('${p.id}');">
                                    Xem 3D
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.toggleModal(true);
    }

    setupModal() {
        const backdrop = document.getElementById('globalModalBackdrop');
        const closeBtn = document.getElementById('modalCloseBtn');
        const sourcesBtn = document.getElementById('btnShowSourcesModal');

        if (sourcesBtn) {
            sourcesBtn.addEventListener('click', () => {
                this.openGlobalSourcesModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggleModal(false);
            });
        }
        if (backdrop) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.toggleModal(false);
                }
            });
        }

        // Bắt phím ESC để thoát toàn màn hình hoặc đóng modal tức thì
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (window.viewer3D && document.querySelector('.studio-viewport-card.viewport-fullscreen')) {
                    window.viewer3D.exitFullscreen();
                    return;
                }
                if (window.viewer3D && document.querySelector('.companion-2d-card.duo-fullscreen')) {
                    window.viewer3D.exitDuoFullscreen();
                    return;
                }
                const studioFs = document.querySelector('.peptide-duo-studio.studio-fullscreen');
                if (studioFs && window.chemical2DEngine) {
                    window.chemical2DEngine.exitStudioFullscreen(studioFs.id);
                    return;
                }
                const modal = document.getElementById('globalCyberModal');
                if (modal && modal.classList.contains('modal-fullscreen')) {
                    window.toggleModalFullscreen();
                    return;
                }
                const b = document.getElementById('globalModalBackdrop');
                if (b && b.classList.contains('active')) {
                    this.toggleModal(false);
                }
            }
        });
    }

    toggleModal(open) {
        const backdrop = document.getElementById('globalModalBackdrop');
        const modal = document.getElementById('globalCyberModal');
        if (backdrop) {
            backdrop.classList.toggle('active', open);
            if (!open && modal) {
                modal.classList.remove('modal-fullscreen');
                const icon = document.getElementById('modalFsIcon');
                if (icon) {
                    icon.innerHTML = '<path d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>';
                }
            }
        }
        if (open) this.playSound('click');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    setupTelemetry() {
        const clockEl = document.getElementById('hudTelemetryTime');
        if (clockEl) {
            setInterval(() => {
                clockEl.textContent = new Date().toLocaleTimeString('vi-VN', { hour12: false });
            }, 1000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProteinexusApp();
});

window.toggleModalFullscreen = function() {
    const modal = document.getElementById('globalCyberModal');
    if (!modal) return;
    const isFull = modal.classList.toggle('modal-fullscreen');
    const icon = document.getElementById('modalFsIcon');
    if (icon) {
        if (isFull) {
            // Biểu tượng thu nhỏ (collapse)
            icon.innerHTML = '<path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M14 4h6m0 0v6m0-6l-7 7M10 4H4m0 0v6m0-6l7 7"/>';
        } else {
            // Biểu tượng phóng to (expand)
            icon.innerHTML = '<path d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>';
        }
    }
    // Cho các canvas 3D và SVG tính lại kích thước
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 80);
    if (window.app) window.app.playSound('click');
};

