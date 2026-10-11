/**
 * PROTEINEXUS - 3D Molecular Graphics Engine
 * Sử dụng 3Dmol.js (University of Pittsburgh) - Chuẩn đồ họa sinh học phân tử quốc tế
 * Kết xuất 100% tọa độ nguyên tử thực tế từ wwPDB / RCSB PDB
 */

class ProteinViewer3D {
    constructor(containerId, isHero = false) {
        this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        this.isHero = isHero;
        this.viewer = null;
        this.currentPdbId = "4HHB";
        this.currentProtein = null;
        this.currentStyle = "cartoon";
        this.currentColor = "chain";
        this.isSpinning = true;
        this.spinSpeed = 0.35; // Tốc độ xoay mượt mà, chống lag GPU trên mọi máy
        this.companion2DMode = 'backbone';
        this.surfaceObj = null;
        this.surfaceOpacity = 0.7;
        this.currentPdbData = null;
        this.activeLabels = [];
        this.activeHighlightResi = null;

        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.container.style.position = 'relative';

        const MolLib = window.$3Dmol || window['3Dmol'];
        if (MolLib && typeof MolLib.createViewer === 'function') {
            try {
                this.viewer = MolLib.createViewer(this.container, {
                    defaultcolors: MolLib.rasmolElementColors,
                    backgroundColor: 0x050811
                });
            } catch (err) {
                console.error("Lỗi khi khởi tạo 3Dmol viewer:", err);
            }
            this.guardHiddenRendering();
        }

        if (!this.isHero) {
            this.setupEventListeners();
        }
        this.setupResizeObserver();
    }

    setupResizeObserver() {
        const ro = new ResizeObserver(() => {
            this.resize();
        });
        ro.observe(this.container);
    }

    isVisible() {
        return !!(this.container && this.container.clientWidth > 0 && this.container.clientHeight > 0);
    }

    resize() {
        // Bỏ qua khi tab đang ẩn (kích thước 0) để tránh lỗi WebGL framebuffer zero size
        if (this.viewer && this.isVisible()) {
            this.viewer.resize();
            this.viewer.render();
        }
    }

    // Tạm dừng xoay + vẽ khi tab bị ẩn để không làm treo trình duyệt
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
        if (this.isSpinning) {
            try { this.viewer.spin("y", 0.5 * this.spinSpeed); } catch (e) {}
        }
    }

    // Chặn spin/render khi container đang ẩn (kích thước 0) → tránh lỗi WebGL và treo trình duyệt
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

    setupEventListeners() {
        // Kiểu dáng hiển thị
        const styleSelect = document.getElementById('viewerStyleSelect');
        if (styleSelect) {
            styleSelect.addEventListener('change', (e) => {
                this.currentStyle = e.target.value;
                this.applyRepresentation();
                if (window.app) window.app.playSound('click');
            });
        }

        // Bảng màu
        const colorSelect = document.getElementById('viewerColorSelect');
        if (colorSelect) {
            colorSelect.addEventListener('change', (e) => {
                this.currentColor = e.target.value;
                this.applyRepresentation();
                if (window.app) window.app.playSound('click');
            });
        }

        // Tốc độ xoay
        const spinSpeedSlider = document.getElementById('spinSpeedSlider');
        if (spinSpeedSlider) {
            spinSpeedSlider.addEventListener('input', (e) => {
                this.spinSpeed = parseFloat(e.target.value);
                const valDisplay = document.getElementById('spinSpeedVal');
                if (valDisplay) valDisplay.textContent = this.spinSpeed.toFixed(1) + 'x';
                if (this.viewer && this.isSpinning) {
                    this.viewer.spin("y", 0.5 * this.spinSpeed);
                }
            });
        }

        // Nút xoay
        const toggleSpinBtn = document.getElementById('btnToggleSpin');
        if (toggleSpinBtn) {
            toggleSpinBtn.addEventListener('click', () => {
                this.toggleSpin();
            });
        }

        // Nút đặt lại camera
        const resetCamBtn = document.getElementById('btnResetCamera');
        if (resetCamBtn) {
            resetCamBtn.addEventListener('click', () => {
                this.resetCamera();
            });
        }

        // Chụp ảnh snapshot
        const snapshotBtn = document.getElementById('btnSnapshot3D');
        if (snapshotBtn) {
            snapshotBtn.addEventListener('click', () => {
                this.takeSnapshot();
            });
        }

        // Toàn màn hình
        const fullscreenBtn = document.getElementById('btnFullscreen3D');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Tải mã PDB tùy biến
        const customPdbBtn = document.getElementById('btnLoadCustomPdb');
        const customPdbInput = document.getElementById('customPdbInput');
        if (customPdbBtn && customPdbInput) {
            customPdbBtn.addEventListener('click', () => {
                const code = customPdbInput.value.trim().toUpperCase();
                if (code.length >= 4) {
                    this.loadPdb(code);
                } else {
                    if (window.app) window.app.showToast("Vui lòng nhập mã PDB hợp lệ (4 ký tự)", "warning");
                }
            });
            customPdbInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') customPdbBtn.click();
            });
        }

        // Nạp tệp PDB từ máy
        const fileInput = document.getElementById('pdbFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        this.renderPdbData(evt.target.result, file.name.replace('.pdb', ''));
                    };
                    reader.readAsText(file);
                }
            });
        }

        // Nút mở Bản Đồ Hình Học 2D Tường Minh
        const btnOpenChem2D = document.getElementById('btnOpenChem2DModal');
        if (btnOpenChem2D) {
            btnOpenChem2D.addEventListener('click', () => {
                this.openFullChem2DModal();
            });
        }
    }

    async loadProteinById(id) {
        const protein = PROTEIN_DATABASE.find(p => p.id === id);
        if (!protein) return;

        this.currentProtein = protein;
        this.currentPdbId = protein.pdbId;

        if (this.isHero) {
            const hTitle = document.getElementById('heroProteinTitle');
            const hDesc = document.getElementById('heroProteinDesc');
            if (hTitle) hTitle.textContent = `${protein.name} - ${protein.pdbId}`;
            if (hDesc) hDesc.textContent = protein.functionDescription || "";
        } else {
            this.updateHud(protein);
            this.updateSequenceRibbon(protein);
        }

        await this.loadPdb(protein.pdbId, protein);
    }

    async loadPdb(pdbId, proteinInfo = null) {
        if (!this.isHero) {
            this.showLoading(true, `Đang nạp cấu trúc 3D chuẩn từ wwPDB: [${pdbId}]...`);
            if (window.app) window.app.playSound('scan');
        }

        const urls = [
            `pdb/${pdbId}.pdb`,
            `/api/pdb/${pdbId}`,
            `https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`,
            `https://www.ebi.ac.uk/pdbe/entry-files/download/pdb${pdbId.toLowerCase()}.ent`
        ];

        let pdbText = null;

        for (const u of urls) {
            try {
                const res = await fetch(u);
                if (res.ok) {
                    const text = await res.text();
                    if (text && text.includes('ATOM')) {
                        pdbText = text;
                        break;
                    }
                }
            } catch (e) {
                // Tiếp tục thử URL khác
            }
        }

        if (pdbText && pdbText.includes('ATOM')) {
            this.renderPdbData(pdbText, pdbId, proteinInfo);
            if (!this.isHero) {
                this.showLoading(false);
                if (window.app) window.app.showToast(`Đã nạp 100% cấu trúc 3D chuẩn [${pdbId}] từ wwPDB!`, "success");
            }
        } else {
            if (!this.isHero) {
                this.showLoading(false);
                if (window.app) window.app.showToast(`Không thể tải dữ liệu PDB ${pdbId}.`, "warning");
            }
        }
    }

    renderPdbData(pdbString, label = "Protein", proteinInfo = null) {
        if (!this.viewer) {
            console.error("3Dmol viewer chưa được khởi tạo!");
            return;
        }

        this.currentPdbData = pdbString;
        this.surfaceObj = null;
        this.activeLabels = [];
        this.activeHighlightResi = null;

        // Trích xuất danh sách gốc amino acid và mạch chính xác từ tọa độ PDB
        this.pdbResidues = [];
        try {
            const lines = pdbString.split('\n');
            const seen = new Set();
            for (const line of lines) {
                if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
                    const resn = line.substring(17, 20).trim();
                    const chain = line.substring(21, 22).trim() || 'A';
                    const resi = parseInt(line.substring(22, 26).trim(), 10);
                    const key = `${chain}_${resi}`;
                    if (!seen.has(key) && !isNaN(resi)) {
                        seen.add(key);
                        this.pdbResidues.push({ chain, resi, resn });
                    }
                }
            }
        } catch (e) {
            console.warn("Lỗi khi trích xuất PDB residues:", e);
        }

        try {
            this.viewer.clear();
            this.viewer.addModel(pdbString, "pdb");
            this.applyRepresentation();

            // KÍCH HOẠT NHẤP CHUỘT TRỰC TIẾP TRÊN MÔ HÌNH 3D (CHỌN ĐOẠN/GỐC)
            if (typeof this.viewer.setClickable === 'function') {
                this.viewer.setClickable({}, true, (atom) => {
                    this.handleDirect3DClick(atom);
                });
            }
            
            // Căn chỉnh camera vừa vặn và lùi 15% biên an toàn để không bị cắt xén khi xoay 3D
            this.viewer.zoomTo();
            this.viewer.zoom(0.85);

            if (this.isSpinning) {
                this.viewer.spin("y", 0.5 * this.spinSpeed);
            }

            this.viewer.render();

            if (!this.isHero) {
                if (!proteinInfo) {
                    const titleEl = document.getElementById('hudViewerTitle');
                    const metaEl = document.getElementById('hudViewerMeta');
                    if (titleEl) titleEl.textContent = `PDB: ${label}`;
                    if (metaEl) metaEl.textContent = `Tọa độ wwPDB Quốc Tế`;
                }
                this.updateCompanion2DCard(proteinInfo || { id: this.currentPdbId, name: label });
            }
        } catch (err) {
            console.error("Lỗi khi kết xuất 3Dmol:", err);
        }
    }

    applyRepresentation() {
        if (!this.viewer) return;

        // Xóa an toàn tuyệt đối mọi bề mặt phân tử cũ (dùng removeAllSurfaces chính chủ 3Dmol)
        try {
            if (typeof this.viewer.removeAllSurfaces === 'function') {
                this.viewer.removeAllSurfaces();
            }
        } catch (e) {
            console.warn("Lỗi khi xóa surface:", e);
        }
        this.surfaceObj = null;

        const colorCfg = this.getColorConfig();

        switch (this.currentStyle) {
            case "cartoon":
                // Dải Ruy Băng thứ cấp chuẩn (Helices lò xo & Phiến Beta mũi tên)
                this.viewer.setStyle({}, { cartoon: { ...colorCfg, opacity: 1.0 } });
                break;

            case "trace":
                // Dạng sợi uốn lượn liên tục theo xương sống C-Alpha (Backbone Trace / Fiber)
                this.viewer.setStyle({}, {
                    cartoon: { style: 'trace', thickness: 0.5, ...colorCfg, opacity: 1.0 }
                });
                break;

            case "tube":
                // Dạng ống tròn 3D mịn màng (Smooth Tube)
                this.viewer.setStyle({}, {
                    cartoon: { style: 'oval', thickness: 0.38, ...colorCfg, opacity: 1.0 }
                });
                break;

            case "stick":
                // Khung que liên kết nguyên tử
                this.viewer.setStyle({}, {
                    stick: { radius: 0.28, ...colorCfg }
                });
                break;

            case "ball_and_stick":
                // Cầu nguyên tử & que liên kết
                this.viewer.setStyle({}, {
                    stick: { radius: 0.2, ...colorCfg },
                    sphere: { scale: 0.35, ...colorCfg }
                });
                break;

            case "spacefill":
                // Bán kính Van der Waals CPK đầy đặn
                this.viewer.setStyle({}, {
                    sphere: { ...colorCfg }
                });
                break;

            case "surface":
                // Bề mặt phân tử (Molecular Surface)
                this.viewer.setStyle({}, { cartoon: { opacity: 0.35, ...colorCfg } });
                const MolLib = window.$3Dmol || window['3Dmol'];
                if (MolLib && typeof this.viewer.addSurface === 'function') {
                    try {
                        this.surfaceObj = this.viewer.addSurface(MolLib.SurfaceType.VDW, {
                            opacity: this.surfaceOpacity,
                            ...colorCfg
                        }, {}, {}, () => {
                            if (this.viewer) this.viewer.render();
                        });
                    } catch (err) {
                        console.warn("Không thể tạo surface:", err);
                    }
                }
                break;

            default:
                this.viewer.setStyle({}, { cartoon: { ...colorCfg, opacity: 1.0 } });
        }

        // Sử dụng addStyle để giữ nguyên toàn bộ các chuỗi protein mà không làm biến mất phần nào
        // Làm nổi bật nhóm HEME (nhân mang Fe trong Hemoglobin/Myoglobin/Catalase)
        this.viewer.addStyle({ resn: 'HEM' }, {
            stick: { radius: 0.35, colorscheme: 'Jmol' },
            sphere: { scale: 0.55, color: '#dc2626' }
        });

        // Làm nổi bật ion Sắt Fe
        this.viewer.addStyle({ elem: 'FE' }, {
            sphere: { scale: 0.85, color: '#ef4444' }
        });

        // Nếu đang chọn 1 gốc amino acid cụ thể, phủ thêm hiệu ứng phát sáng vàng
        if (this.activeHighlightResi) {
            this.viewer.addStyle({ resi: this.activeHighlightResi }, {
                stick: { color: '#facc15', radius: 0.45 },
                sphere: { color: '#facc15', scale: 0.75 }
            });
        }

        this.viewer.render();
    }

    getColorConfig() {
        switch (this.currentColor) {
            case "chain":
                return {
                    colorscheme: {
                        prop: 'chain',
                        map: {
                            'A': '#00f2fe',
                            'B': '#a855f7',
                            'C': '#10b981',
                            'D': '#f59e0b',
                            'E': '#f43f5e',
                            'F': '#38bdf8'
                        }
                    }
                };

            case "ss":
                // Cấu trúc bậc 2 chuẩn Jmol: Helix hồng/magenta, Sheet vàng, Loop cyan/slate
                return {
                    colorscheme: {
                        prop: 'ss',
                        map: {
                            'h': '#ec4899', // Alpha helix
                            's': '#f59e0b', // Beta sheet
                            'c': '#00f2fe'  // Random coil
                        }
                    }
                };

            case "spectrum":
                return { color: 'spectrum' };

            case "polarity":
                return {
                    colorscheme: {
                        prop: 'resn',
                        map: {
                            'ALA': '#f59e0b', 'VAL': '#f59e0b', 'LEU': '#f59e0b', 'ILE': '#f59e0b', 'PHE': '#f59e0b', 'MET': '#f59e0b',
                            'ARG': '#38bdf8', 'LYS': '#38bdf8', 'HIS': '#38bdf8',
                            'ASP': '#f43f5e', 'GLU': '#f43f5e',
                            'SER': '#10b981', 'THR': '#10b981', 'ASN': '#10b981', 'GLN': '#10b981',
                            'CYS': '#eab308', 'PRO': '#c084fc', 'GLY': '#ffffff'
                        }
                    }
                };

            case "element":
                return { colorscheme: 'Jmol' };

            default:
                return { colorscheme: 'chain' };
        }
    }

    toggleSpin() {
        this.isSpinning = !this.isSpinning;
        const btn = document.getElementById('btnToggleSpin');
        if (btn) btn.classList.toggle('active', this.isSpinning);

        if (this.viewer) {
            if (this.isSpinning) {
                this.viewer.spin("y", 0.5 * this.spinSpeed);
            } else {
                this.viewer.spin(false);
            }
        }
        if (window.app) window.app.playSound('click');
    }

    resetCamera() {
        if (this.viewer) {
            // Xóa điểm chọn amino acid nếu có
            this.activeHighlightResi = null;
            if (this.activeLabels && this.activeLabels.length > 0) {
                this.activeLabels.forEach(lbl => this.viewer.removeLabel(lbl));
                this.activeLabels = [];
            }
            document.querySelectorAll('.residue-tag').forEach(t => t.classList.remove('selected'));

            this.applyRepresentation();
            this.viewer.zoomTo();
            this.viewer.zoom(0.85); // Biên an toàn 15%
            this.viewer.render();
        }
        if (window.app) {
            window.app.playSound('click');
            window.app.showToast("Đã khôi phục toàn cảnh 3D mặc định", "info");
        }
    }

    takeSnapshot() {
        if (!this.viewer) return;

        let dataUrl = null;
        if (typeof this.viewer.pngURI === 'function') {
            dataUrl = this.viewer.pngURI();
        } else {
            const canvas = this.container.querySelector('canvas');
            if (canvas) dataUrl = canvas.toDataURL('image/png');
        }

        if (dataUrl) {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `proteinexus-${this.currentPdbId}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            if (window.app) {
                window.app.playSound('success');
                window.app.showToast(`Đã lưu ảnh chụp 3D phân tử [${this.currentPdbId}] chuẩn HD!`, "success");
            }
        }
    }

    toggleFullscreen() {
        const card = document.querySelector('.studio-viewport-card');
        if (!card) return;

        const isFull = card.classList.toggle('viewport-fullscreen');

        let exitBtn = document.getElementById('btnExitViewerFullscreen');
        if (isFull) {
            if (!exitBtn) {
                exitBtn = document.createElement('button');
                exitBtn.id = 'btnExitViewerFullscreen';
                exitBtn.className = 'btn-exit-fullscreen-floating';
                exitBtn.innerHTML = '✕ Thoát Toàn Màn Hình (ESC)';
                exitBtn.addEventListener('click', () => this.exitFullscreen());
                document.body.appendChild(exitBtn);
            }
            if (card.requestFullscreen) {
                card.requestFullscreen().catch(() => {});
            }
            if (window.app) window.app.showToast("Đã bật chế độ Toàn Màn Hình. Nhấn ESC hoặc nút đỏ để thoát!", "info");
        } else {
            this.exitFullscreen();
        }

        setTimeout(() => {
            this.resize();
            if (this.viewer) this.viewer.render();
        }, 80);

        if (window.app) window.app.playSound('click');
    }

    exitFullscreen() {
        const card = document.querySelector('.studio-viewport-card');
        if (card) card.classList.remove('viewport-fullscreen');
        const exitBtn = document.getElementById('btnExitViewerFullscreen');
        if (exitBtn) exitBtn.remove();
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        setTimeout(() => {
            this.resize();
            if (this.viewer) this.viewer.render();
        }, 80);
    }

    toggleDuoFullscreen() {
        const card = document.querySelector('.companion-2d-card');
        if (!card) return;

        const isFull = card.classList.toggle('duo-fullscreen');
        let exitBtn = document.getElementById('btnExitDuoFullscreen');
        if (isFull) {
            if (!exitBtn) {
                exitBtn = document.createElement('button');
                exitBtn.id = 'btnExitDuoFullscreen';
                exitBtn.className = 'btn-exit-fullscreen-floating';
                exitBtn.innerHTML = '✕ Thoát Toàn Màn Hình (ESC)';
                exitBtn.addEventListener('click', () => this.exitDuoFullscreen());
                document.body.appendChild(exitBtn);
            }
            if (window.app) window.app.showToast("Đã mở rộng Studio 2D & 3D Toàn Màn Hình. Nhấn ESC hoặc nút đỏ để thoát!", "info");
        } else {
            this.exitDuoFullscreen();
        }

        window.dispatchEvent(new Event('resize'));
        if (window.app) window.app.playSound('click');
    }

    exitDuoFullscreen() {
        const card = document.querySelector('.companion-2d-card');
        if (card) card.classList.remove('duo-fullscreen');
        const exitBtn = document.getElementById('btnExitDuoFullscreen');
        if (exitBtn) exitBtn.remove();
        window.dispatchEvent(new Event('resize'));
    }

    showLoading(show, text = "") {
        const overlay = document.getElementById('molLoadingOverlay');
        const textEl = document.getElementById('molLoadingText');
        if (overlay) overlay.style.display = show ? 'flex' : 'none';
        if (textEl && text) textEl.textContent = text;
    }

    updateHud(protein) {
        const titleEl = document.getElementById('hudViewerTitle');
        const metaEl = document.getElementById('hudViewerMeta');
        if (titleEl) titleEl.textContent = `${protein.name} (${protein.pdbId})`;
        if (metaEl) metaEl.textContent = `Bậc ${protein.structureLevel} | ${protein.molecularWeight} | Độ phân giải: ${protein.resolution || '1.74 Å'} | Nguồn: wwPDB`;
    }

    updateSequenceRibbon(protein) {
        if (this.isHero) return;

        const track = document.getElementById('sequenceTrack');
        if (!track) return;
        track.innerHTML = '';

        // Nút đặt lại toàn cảnh trên thanh sequence
        const resetBtn = document.createElement('div');
        resetBtn.className = 'residue-tag';
        resetBtn.style.background = 'rgba(0, 242, 254, 0.15)';
        resetBtn.style.borderColor = 'var(--neon-cyan)';
        resetBtn.style.color = 'var(--neon-cyan)';
        resetBtn.style.fontWeight = 'bold';
        resetBtn.textContent = '🔄 TOÀN CẢNH';
        resetBtn.title = 'Khôi phục góc nhìn toàn cảnh toàn bộ protein';
        resetBtn.addEventListener('click', () => {
            this.resetCamera();
        });
        track.appendChild(resetBtn);

        // Nút Chuỗi Mẫu Gly-His-Gly (Chuẩn Tham Chiếu Image 2)
        const ghgBtn = document.createElement('div');
        ghgBtn.className = 'residue-tag';
        ghgBtn.style.background = 'rgba(245, 158, 11, 0.25)';
        ghgBtn.style.borderColor = '#f59e0b';
        ghgBtn.style.color = '#fbbf24';
        ghgBtn.style.fontWeight = 'bold';
        ghgBtn.textContent = '✨ CHUỖI MẪU: Gly - His - Gly';
        ghgBtn.title = 'Soi chuỗi mẫu tham chiếu ChemDraw: Gly - His - Gly với vòng dị vòng Imidazole';
        ghgBtn.addEventListener('click', () => {
            this.inspectPresetGlyHisGly();
        });
        track.appendChild(ghgBtn);

        // Nút Soi Đoạn Dipeptide (2 gốc đầu)
        const diBtn = document.createElement('div');
        diBtn.className = 'residue-tag';
        diBtn.style.background = 'rgba(168, 85, 247, 0.2)';
        diBtn.style.borderColor = 'var(--neon-purple)';
        diBtn.style.color = '#c084fc';
        diBtn.textContent = '🔬 ĐOẠN 2 GỐC (Dipeptide)';
        diBtn.title = 'Soi phân đoạn 2 gốc: Dipeptide (1 liên kết peptide, Biuret âm tính)';
        diBtn.addEventListener('click', () => {
            this.inspectSegmentRange(1, 2, "Dipeptide");
        });
        track.appendChild(diBtn);

        // Nút Soi Đoạn Tripeptide (3 gốc đầu)
        const triBtn = document.createElement('div');
        triBtn.className = 'residue-tag';
        triBtn.style.background = 'rgba(250, 204, 21, 0.2)';
        triBtn.style.borderColor = '#facc15';
        triBtn.style.color = '#fde047';
        triBtn.textContent = '🔬 ĐOẠN 3 GỐC (Tripeptide)';
        triBtn.title = 'Soi phân đoạn 3 gốc: Tripeptide (2 liên kết peptide, Biuret dương tính tím)';
        triBtn.addEventListener('click', () => {
            this.inspectSegmentRange(1, 3, "Tripeptide");
        });
        track.appendChild(triBtn);

        // Nút Soi Đoạn Tetrapeptide (4 gốc đầu)
        const tetraBtn = document.createElement('div');
        tetraBtn.className = 'residue-tag';
        tetraBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        tetraBtn.style.borderColor = 'var(--neon-emerald)';
        tetraBtn.style.color = '#34d399';
        tetraBtn.textContent = '🔬 ĐOẠN 4 GỐC (Tetrapeptide)';
        tetraBtn.title = 'Soi phân đoạn 4 gốc: Tetrapeptide (3 liên kết peptide, Biuret dương tính mạnh)';
        tetraBtn.addEventListener('click', () => {
            this.inspectSegmentRange(1, 4, "Tetrapeptide");
        });
        track.appendChild(tetraBtn);

        const seq = protein.sequenceSnippet || "VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR";
        const residues = seq.replace(/[^A-Za-z]/g, '').slice(0, 80).split('');

        residues.forEach((char, index) => {
            const aaInfo = AMINO_ACID_TABLE.find(a => a.code1 === char) || {
                code3: char,
                type: 'nonpolar',
                name: char,
                polarity: 'Amino acid'
            };

            const resNum = index + 1;
            const tag = document.createElement('div');
            tag.className = `residue-tag res-${aaInfo.type}`;
            tag.id = `res-tag-${resNum}`;
            tag.textContent = `${aaInfo.code3}${resNum}`;
            tag.title = `${aaInfo.name || char} (Vị trí ${resNum}) - ${aaInfo.polarity}. Nhấp để soi và gắn nhãn 3D!`;

            // Tương tác trực tiếp: Phát sáng, dẫn tới vùng 3D và đồng bộ Studio công thức cấu tạo 2D + 3D
            tag.addEventListener('click', () => {
                document.querySelectorAll('.residue-tag').forEach(t => t.classList.remove('selected'));
                tag.classList.add('selected');

                if (this.viewer) {
                    if (this.activeLabels && this.activeLabels.length > 0) {
                        this.activeLabels.forEach(lbl => this.viewer.removeLabel(lbl));
                        this.activeLabels = [];
                    }

                    this.activeHighlightResi = resNum;
                    this.applyRepresentation();

                    try {
                        const lbl = this.viewer.addLabel(`${aaInfo.code3}${resNum}: ${aaInfo.name || char}`, {
                            position: { resi: resNum },
                            backgroundColor: 0x030712,
                            backgroundOpacity: 0.9,
                            fontColor: 0x00f2fe,
                            borderColor: 0x00f2fe,
                            borderWidth: 1.5,
                            fontSize: 12
                        });
                        if (lbl) this.activeLabels.push(lbl);
                    } catch (e) {
                        console.warn("Không thể thêm label 3D:", e);
                    }

                    this.viewer.center({ resi: resNum }, 500);
                    this.viewer.zoom(1.35, 500);
                    this.viewer.render();
                }

                // Đồng bộ cập nhật bảng Studio 2D & 3D đồng hành cho vị trí này!
                const windowResis = [Math.max(1, resNum - 1), resNum, resNum + 1];
                const resCodes = windowResis.map(r => {
                    const found = this.pdbResidues?.find(pr => pr.resi === r);
                    return found ? found.resn : (r === resNum ? aaInfo.code3 : 'ALA');
                });
                this.activeCompanionResidues = resCodes;
                this.companion2DMode = 'custom';
                this.updateCompanion2DCard();

                if (window.app) {
                    window.app.playSound('beep');
                    window.app.showToast(`Đang soi gốc [${aaInfo.code3}${resNum} - ${aaInfo.name}]: Đã dẫn tới vùng 3D và mô tả công thức cấu tạo!`, "info");
                }
            });

            track.appendChild(tag);
        });
    }

    inspectPresetGlyHisGly() {
        this.companion2DMode = 'gly_his_gly';
        this.activeCompanionResidues = ['GLY', 'HIS', 'GLY'];
        this.updateCompanion2DCard();

        const c = document.getElementById('companion2DContainer');
        if (c) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (window.app) {
            window.app.playSound('beep');
            window.app.showToast("Đang hiển thị Chuỗi Mẫu: Gly - His - Gly (Cấu trúc 2D Skeletal & Mô hình 3D Ball-and-Stick)!", "info");
        }
    }

    jumpToCompanion2D() {
        const c = document.getElementById('companion2DContainer');
        if (c) {
            c.scrollIntoView({ behavior: 'smooth', block: 'start' });
            c.classList.add('highlight-pulse');
            setTimeout(() => c.classList.remove('highlight-pulse'), 2000);
            if (window.app) {
                window.app.playSound('beep');
                window.app.showToast("Đang mở Studio Hình Học 2D & Mô Hình 3D Đồng Hành SGK!", "info");
            }
        }
    }

    getStandardResidues(chain = null) {
        const standardAAs = new Set(['ALA','ARG','ASN','ASP','CYS','GLN','GLU','GLY','HIS','ILE','LEU','LYS','MET','PHE','PRO','SER','THR','TRP','TYR','VAL','SEC','PYL']);
        let list = (this.pdbResidues || []).filter(r => standardAAs.has((r.resn || '').toUpperCase()));
        if (chain) {
            list = list.filter(r => r.chain === chain);
        } else if (list.length > 0) {
            const firstChain = list[0].chain || 'A';
            list = list.filter(r => r.chain === firstChain);
        }
        return list;
    }

    inspectSegmentRange(startResi, endResi, peptideType = 'Dipeptide') {
        if (!this.viewer) return;

        let count = 2;
        if (typeof endResi === 'number' && typeof startResi === 'number' && endResi >= startResi) {
            count = endResi - startResi + 1;
        } else if (typeof endResi === 'number') {
            count = endResi;
        } else if (peptideType === 'Dipeptide') {
            count = 2;
        } else if (peptideType === 'Tripeptide') {
            count = 3;
        } else if (peptideType === 'Tetrapeptide') {
            count = 4;
        }

        const bondsCount = count - 1;
        const isBiuret = bondsCount >= 2;

        // Lấy danh sách gốc amino acid THỰC TẾ đang có trong chuỗi protein (tránh lỗi resi không tồn tại gây trắng hình)
        const stdList = this.getStandardResidues();
        let targetResidues = [];
        if (stdList && stdList.length >= count) {
            targetResidues = stdList.slice(0, count);
        } else if (stdList && stdList.length > 0) {
            targetResidues = stdList;
        } else {
            targetResidues = [
                { chain: 'A', resi: 1, resn: 'GLY' },
                { chain: 'A', resi: 2, resn: 'ALA' },
                { chain: 'A', resi: 3, resn: 'VAL' },
                { chain: 'A', resi: 4, resn: 'LEU' }
            ].slice(0, count);
        }

        const targetChain = targetResidues[0]?.chain || 'A';
        const resiList = targetResidues.map(r => r.resi);
        const residueCodes = targetResidues.map(r => r.resn);

        // 1. DẪN TỚI VÙNG 3D VÀ LÀM NỔI BẬT RỰC RỠ (TUYỆT ĐỐI KHÔNG LÀM TRẮNG CANVAS HAY TREO WEBGL)
        // Giữ nguyên cấu trúc Cartoon (Dải ruy băng) của toàn bộ phân tử, làm mờ nhẹ (opacity: 0.35)
        this.viewer.setStyle({}, {
            cartoon: { ...this.getColorConfig(), opacity: 0.35 }
        });

        // Làm NỔI BẬT RỰC RỠ đoạn được chọn bằng Ball-and-Stick vàng kim phát sáng
        this.viewer.addStyle({ chain: targetChain, resi: resiList }, {
            stick: { radius: 0.45, color: '#facc15' },
            sphere: { scale: 0.65, color: '#facc15' },
            cartoon: { color: '#facc15', opacity: 1.0 }
        });

        // Giữ nguyên các nhóm ngoại Heme và ion kim loại nếu có
        this.viewer.addStyle({ resn: 'HEM' }, {
            stick: { radius: 0.35, colorscheme: 'Jmol' },
            sphere: { scale: 0.55, color: '#dc2626' }
        });
        this.viewer.addStyle({ elem: 'FE' }, {
            sphere: { scale: 0.85, color: '#ef4444' }
        });

        // Xóa nhãn 3D cũ và gán nhãn 3D mới vào đúng gốc
        if (this.activeLabels && this.activeLabels.length > 0) {
            this.activeLabels.forEach(lbl => this.viewer.removeLabel(lbl));
            this.activeLabels = [];
        }

        const firstR = targetResidues[0];
        const lastR = targetResidues[targetResidues.length - 1];
        try {
            const lbl = this.viewer.addLabel(`ĐOẠN ${peptideType.toUpperCase()}: ${firstR.resn}${firstR.resi} - ${lastR.resn}${lastR.resi} (${count} gốc, ${bondsCount} LK)`, {
                position: { chain: targetChain, resi: firstR.resi },
                backgroundColor: 0x030712,
                backgroundOpacity: 0.9,
                fontColor: 0xfacc15,
                borderColor: 0xeab308,
                borderWidth: 1.5,
                fontSize: 12
            });
            if (lbl) this.activeLabels.push(lbl);
        } catch (e) {}

        // Center và zoom an toàn vào đúng các gốc tồn tại thực tế
        try {
            this.viewer.center({ chain: targetChain, resi: resiList }, 500);
            this.viewer.zoom(1.3, 500);
            this.viewer.render();
        } catch (err) {
            console.warn("Lỗi khi zoom tới segment 3D:", err);
        }

        // 2. MÔ TẢ BẰNG CÔNG THỨC CẤU TẠO ĐỒNG HÀNH BÊN DƯỚI
        this.activeCompanionResidues = residueCodes;
        this.companion2DMode = peptideType === 'Dipeptide' ? 'dipeptide' : peptideType === 'Tripeptide' ? 'tripeptide' : 'tetrapeptide';
        this.updateCompanion2DCard();

        // 3. HIỂN THỊ MODAL ĐỒNG HÀNH TO RÕ RÀNG (CHUẨN 2 CỘT SONG SONG, 100% SẠCH MÃ LATEX)
        const modal = document.getElementById('globalModalBackdrop');
        const container = document.getElementById('modalContentContainer');
        if (modal && container) {
            const seqName = residueCodes.map(r => (r.charAt(0).toUpperCase() + r.slice(1).toLowerCase())).join(' - ');

            container.innerHTML = `
                <div style="font-family:var(--font-heading); font-size:1.35rem; color:var(--neon-cyan); margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                    <span>🔬 Phân Tích Đoạn Chuỗi: ${peptideType} (${count} gốc: ${seqName})</span>
                    <button class="mini-control-btn" style="color:var(--neon-cyan); border-color:var(--neon-cyan); font-size:0.8rem;" onclick="window.toggleModalFullscreen()">
                        ⛶ Phóng To / Thu Nhỏ
                    </button>
                </div>
                <div style="display:flex; flex-direction:column; gap:1rem;">
                    <!-- BỐ CỤC 2 CỘT SONG SONG CHUẨN IMAGE 2 TRONG MODAL -->
                    <div id="modalDuoStudioSlot"></div>

                    <div style="background:rgba(15, 23, 42, 0.7); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
                        <div style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; margin-bottom:4px;">CẤU TẠO ĐƠN GIẢN THU GỌN:</div>
                        <div style="font-family:var(--font-mono); font-size:1rem; color:var(--neon-amber); word-break:break-all; background:#020617; padding:8px 12px; border-radius:6px;">
                            ${count === 2 ? 'H₂N-CH(R₁)-CO-NH-CH(R₂)-COOH' : count === 3 ? 'H₂N-CH(R₁)-CO-NH-CH(R₂)-CO-NH-CH(R₃)-COOH' : 'H₂N-CH(R₁)-[CO-NH-CH(R)]ₙ-COOH'}
                        </div>
                        <div style="font-size:0.85rem; color:#cbd5e1; margin-top:6px; line-height:1.5;">
                            • <strong>Đầu N:</strong> Gốc amino acid đầu tiên mang nhóm —NH₂ (hoặc —NH₃⁺) tự do ở bên trái.<br>
                            • <strong>Đầu C:</strong> Gốc amino acid cuối cùng mang nhóm —COOH (hoặc —COO⁻) tự do ở bên phải.<br>
                            • <strong>Khung xương sống:</strong> Chuỗi tuần hoàn —N—Cα—C(=O)—N—Cα—C(=O)— phẳng không quay tự do.
                        </div>
                    </div>

                    <div style="background:rgba(0,0,0,0.5); padding:1rem; border-radius:10px; border:1px solid ${isBiuret ? 'rgba(168,85,247,0.4)' : 'rgba(244,63,94,0.4)'};">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase;">PHẢN ỨNG MÀU BIURET VỚI Cu(OH)₂ / NaOH:</span>
                            <span style="font-family:var(--font-mono); font-weight:bold; color:${isBiuret ? 'var(--neon-purple)' : 'var(--neon-magenta)'};">
                                ${isBiuret ? '✅ DƯƠNG TÍNH (Màu tím hoa cà)' : '❌ ÂM TÍNH (Không phản ứng)'}
                            </span>
                        </div>
                        <p style="font-size:0.85rem; color:#cbd5e1; margin-top:6px; line-height:1.5;">
                            ${isBiuret 
                                ? `Phân đoạn này có ${bondsCount} liên kết peptide (≥ 2 liên kết). Đủ điều kiện để ion Cu²⁺ trong môi trường kiềm phối trí với các nguyên tử Nitơ của liên kết peptide tạo phức chất chelate màu <strong>tím hoa cà đặc trưng</strong>!` 
                                : `Phân đoạn này chỉ có 1 liên kết peptide (Dipeptide). <strong>Không đủ điều kiện tối thiểu (cần ≥ 2 liên kết peptide)</strong> để tạo phức chất chelate biuret. Chỉ xuất hiện kết tủa màu xanh lam của Cu(OH)₂ không đổi!`}
                        </p>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
                        <button class="btn-cyber-primary" style="background:#ef4444; border-color:#dc2626;" onclick="document.getElementById('globalModalBackdrop').classList.remove('active');">✕ Thoát / Đóng Cửa Sổ (ESC)</button>
                    </div>
                </div>
            `;
            modal.classList.add('active');

            if (window.chemical2DEngine) {
                window.chemical2DEngine.renderPeptideDuoStudio('modalDuoStudioSlot', residueCodes);
            }
        }

        if (window.app) {
            window.app.playSound('beep');
            window.app.showToast(`Đã làm nổi bật trên 3D và mô tả phân đoạn ${peptideType} (${count} gốc)!`, "info");
        }
    }

    // =========================================================================
    // TƯƠNG TÁC NHẤP CHUỘT TRỰC TIẾP TRÊN MÔ HÌNH 3D (DIRECT 3D CLICK INSPECTOR)
    // =========================================================================

    /**
     * Lấy danh sách các gốc amino acid kế cận trên cùng một chuỗi từ tọa độ PDB thực tế
     */
    getSurroundingResidues(chain = 'A', centerResi = 1, count = 2) {
        if (!this.pdbResidues || this.pdbResidues.length === 0) {
            // Trường hợp dự phòng nếu chưa nạp pdbResidues
            const fallback = [];
            for (let i = 0; i < count; i++) {
                fallback.push({ chain, resi: centerResi + i, resn: i % 2 === 0 ? 'ALA' : 'GLY' });
            }
            return fallback;
        }

        const chainItems = this.pdbResidues.filter(r => r.chain === chain);
        if (chainItems.length === 0) {
            return this.pdbResidues.slice(0, count);
        }

        let idx = chainItems.findIndex(r => r.resi === centerResi);
        if (idx === -1) idx = 0;

        if (count === 1) {
            return [chainItems[idx]];
        }

        // Chọn cửa sổ `count` gốc bắt đầu từ idx, nếu gần cuối chuỗi thì lùi lại
        let startIdx = idx;
        if (startIdx + count > chainItems.length) {
            startIdx = Math.max(0, chainItems.length - count);
        }

        return chainItems.slice(startIdx, startIdx + count);
    }

    /**
     * Xử lý sự kiện nhấp chuột trực tiếp lên nguyên tử hoặc đoạn 3D
     * @param {Object} atom Đối tượng nguyên tử từ 3Dmol: chain, resi, resn, atom, elem
     * @param {string} segmentMode 'single' | 'dipeptide' | 'tripeptide' | 'tetrapeptide' | 'poly'
     */
    handleDirect3DClick(atom) {
        if (!atom || !this.viewer) return;

        this.lastClickedAtom = atom;
        const chain = atom.chain || 'A';
        const resi = atom.resi || 1;
        const resn = (atom.resn || 'ALA').toUpperCase();
        const atomName = atom.atom || 'CA';

        // Xóa nhãn 3D cũ và gắn nhãn mới
        if (this.activeLabels && this.activeLabels.length > 0) {
            this.activeLabels.forEach(lbl => this.viewer.removeLabel(lbl));
            this.activeLabels = [];
        }

        try {
            const labelText = `[Chuỗi ${chain}] ${resn} #${resi} (${atomName})`;
            const lbl = this.viewer.addLabel(labelText, {
                position: { resi: resi, chain: chain },
                backgroundColor: 0x020617,
                backgroundOpacity: 0.9,
                fontColor: 0x00f2fe,
                borderColor: 0x00f2fe,
                borderWidth: 1.5,
                fontSize: 12
            });
            if (lbl) this.activeLabels.push(lbl);
        } catch (e) {
            console.warn("Không thể thêm label 3D:", e);
        }

        this.viewer.render();

        if (window.app) {
            window.app.playSound('beep');
            window.app.showToast(`[Chuỗi ${chain}] Gốc ${resn} #${resi} (${atomName})`, 'info');
        }
    }

    /**
     * Kết xuất bảng HUD phân tích trực tiếp khi ấn vào 3D
     */
    renderDirect3DClickHud(atom, segmentMode, surrounding) {
        const hud = document.getElementById('direct3DClickHud');
        if (!hud) return;

        const chain = atom.chain || 'A';
        const resi = atom.resi || 1;
        const resn = (atom.resn || 'ALA').toUpperCase();
        const atomName = atom.atom || 'CA';
        const elem = atom.elem || 'C';

        const k = surrounding.length;
        const bondsCount = k - 1;
        const isBiuret = bondsCount >= 2;
        const resCodes = surrounding.map(r => r.resn);

        // Tên tiếng Việt và thông tin amino acid
        const aaInfoTable = window.chemical2DEngine ? window.chemical2DEngine.aminoAcidRChains : {};
        const firstAaInfo = aaInfoTable[resn] || { name: resn, rHtml: '—R', type: 'Amino acid', mw: 100 };

        // Tên các amino acid cấu thành đoạn
        const aaNamesList = surrounding.map(r => {
            const info = aaInfoTable[r.resn] || { name: r.resn };
            return `<strong>${info.name}</strong> (${r.resn})`;
        }).join(' — ');

        // Diễn giải nguyên tử đang ấn
        let atomDesc = "Nguyên tử khung xương sống";
        if (atomName === 'CA') atomDesc = "Carbon Alpha (Cα) - Trung tâm liên kết 4 nhóm";
        else if (atomName === 'N') atomDesc = "Nitơ amin (N-H) - Phối tử tạo phức Biuret";
        else if (atomName === 'C') atomDesc = "Carbon carbonyl (C=O) - Thuộc liên kết peptide";
        else if (atomName === 'O') atomDesc = "Oxy carbonyl - Tạo liên kết hydrogen duy trì bậc 2";
        else if (atomName.startsWith('CB') || atomName.startsWith('CG') || atomName.startsWith('CD')) atomDesc = "Nguyên tử thuộc mạch bên R";

        // Tên nguyên tố hóa học
        const elemNames = { 'C': 'Carbon (C)', 'N': 'Nitơ (N)', 'O': 'Oxy (O)', 'H': 'Hydro (H)', 'S': 'Lưu huỳnh (S)', 'FE': 'Sắt (Fe)' };
        const elemName = elemNames[elem.toUpperCase()] || elem;

        // Sinh SVG 2D công thức cấu tạo tương ứng
        let svg2dHtml = '';
        if (window.chemical2DEngine) {
            if (k === 1) {
                svg2dHtml = window.chemical2DEngine.generateSingleResidueSvg(resn, atomName);
            } else {
                svg2dHtml = window.chemical2DEngine.generatePeptideSegmentSvg(resCodes, 0);
            }
        }

        // Tên chuỗi và vai trò
        const proteinName = this.currentProtein ? this.currentProtein.name : "Protein";
        let chainRoleDesc = `Chuỗi Polypeptide ${chain}`;
        if (proteinName.includes('Hemoglobin')) {
            chainRoleDesc = chain === 'A' || chain === 'C' ? `Chuỗi Alpha (141 gốc) - Chain ${chain}` : `Chuỗi Beta (146 gốc) - Chain ${chain}`;
        } else if (proteinName.includes('Insulin')) {
            chainRoleDesc = chain === 'A' ? `Chuỗi A (21 gốc, có 1 cầu S-S nội chuỗi) - Chain A` : `Chuỗi B (30 gốc) - Chain B`;
        }

        hud.innerHTML = `
            <div class="d3h-card">
                <!-- Thanh Header của HUD -->
                <div class="d3h-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="d3h-pulse-dot"></span>
                        <span class="d3h-title">THÔNG TIN TƯƠNG TÁC 3D TRỰC TIẾP (CHUẨN HÓA HỌC 12)</span>
                    </div>
                    <button class="d3h-close-btn" onclick="window.viewer3D.closeDirect3DClickHud()" title="Đóng bảng phân tích">&times;</button>
                </div>

                <!-- Thanh chuyển chế độ phân đoạn: 1 gốc, 2 gốc, 3 gốc, 4 gốc -->
                <div class="d3h-modes-bar">
                    <span style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:600;">Xem phân đoạn:</span>
                    <button class="d3h-mode-btn ${segmentMode === 'single' ? 'active' : ''}" onclick="window.viewer3D.handleDirect3DClick(window.viewer3D.lastClickedAtom, 'single')">
                        1 Gốc: Đơn phân
                    </button>
                    <button class="d3h-mode-btn ${segmentMode === 'dipeptide' ? 'active' : ''}" onclick="window.viewer3D.handleDirect3DClick(window.viewer3D.lastClickedAtom, 'dipeptide')">
                        Dipeptide (2 Gốc)
                    </button>
                    <button class="d3h-mode-btn ${segmentMode === 'tripeptide' ? 'active' : ''}" onclick="window.viewer3D.handleDirect3DClick(window.viewer3D.lastClickedAtom, 'tripeptide')">
                        Tripeptide (3 Gốc)
                    </button>
                    <button class="d3h-mode-btn ${segmentMode === 'tetrapeptide' ? 'active' : ''}" onclick="window.viewer3D.handleDirect3DClick(window.viewer3D.lastClickedAtom, 'tetrapeptide')">
                        Tetrapeptide (4 Gốc)
                    </button>
                </div>

                <!-- LƯỚI NỘI DUNG 4 MỤC QUAN TRỌNG -->
                <div class="d3h-content-grid">
                    <!-- MỤC 1: ĐÓ LÀ MẠCH NÀO? -->
                    <div class="d3h-info-box">
                        <div class="d3h-box-label">📍 1. ĐÓ LÀ MẠCH NÀO? (CHAIN &amp; VỊ TRÍ)</div>
                        <div class="d3h-box-value" style="color:var(--neon-cyan);">
                            ${chainRoleDesc}
                        </div>
                        <div style="font-size:0.85rem; color:#cbd5e1; margin-top:4px; line-height:1.4;">
                            • Vị trí gốc trong chuỗi: <strong>Gốc thứ #${resi}</strong> (tính theo chiều từ <strong>Đầu N</strong> đến <strong>Đầu C</strong>).<br>
                            • Thuộc phân tử: <strong>${proteinName}</strong> (PDB: ${this.currentPdbId || '3D'}).
                        </div>
                    </div>

                    <!-- MỤC 2: GỒM NHỮNG GÌ? -->
                    <div class="d3h-info-box">
                        <div class="d3h-box-label">🧪 2. GỒM NHỮNG GÌ? (THÀNH PHẦN HÓA HỌC)</div>
                        <div class="d3h-box-value" style="color:#fff; font-size:0.95rem;">
                            ${aaNamesList}
                        </div>
                        <div style="font-size:0.85rem; color:#cbd5e1; margin-top:4px; line-height:1.4;">
                            • Mạch bên R gốc vừa ấn: <strong style="color:var(--neon-amber);">${firstAaInfo.rHtml}</strong> (${firstAaInfo.type})<br>
                            • Nguyên tử vừa ấn: <strong style="color:#00f2fe;">${atomName}</strong> (${elemName}) — <em>${atomDesc}</em>.<br>
                            • Thành phần nguyên tố: <strong>C, H, O, N${resn === 'CYS' || resn === 'MET' ? ', S' : ''}</strong>.
                        </div>
                    </div>

                    <!-- MỤC 3: DẠNG PEPTIDE GÌ? -->
                    <div class="d3h-info-box" style="grid-column: 1 / -1; background:rgba(15, 23, 42, 0.7); border-color:${isBiuret ? 'rgba(168,85,247,0.4)' : 'rgba(244,63,94,0.4)'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                            <div class="d3h-box-label">🧬 3. DẠNG PEPTIDE GÌ? (TRỌNG TÂM SGK HÓA HỌC 12)</div>
                            <span style="font-family:var(--font-mono); font-size:0.82rem; font-weight:bold; color:${isBiuret ? 'var(--neon-purple)' : 'var(--neon-magenta)'};">
                                ${k === 1 ? 'Đơn Phân Amino Acid' : k === 2 ? 'Dipeptide (1 Liên Kết Peptide)' : k === 3 ? 'Tripeptide (2 Liên Kết Peptide)' : 'Tetrapeptide (3 Liên Kết Peptide)'}
                            </span>
                        </div>
                        <div style="font-size:0.88rem; color:#cbd5e1; margin-top:6px; line-height:1.5;">
                            ${k === 1 
                                ? `• <strong>Đơn phân α-amino acid:</strong> Là đơn vị cấu trúc cơ bản tạo nên chuỗi peptide và protein. Chứa 1 nhóm amino (−NH₂) và 1 nhóm carboxyl (−COOH) gắn vào carbon alpha.`
                                : `• <strong>Số liên kết peptide (-CO-NH-):</strong> ${bondsCount} liên kết.<br>
                                   • <strong>Phản ứng màu Biuret với Cu(OH)₂ / NaOH (Điểm bẫy thi THPT):</strong> ${isBiuret 
                                        ? `<strong style="color:var(--neon-purple);">✅ DƯƠNG TÍNH (Có tham gia phản ứng màu Biuret - Màu tím hoa cà đặc trưng)</strong>. Đoạn này có ${bondsCount} liên kết peptide (≥ 2 liên kết). Đủ điều kiện để ion Cu²⁺ tạo phức chất chelate với các nguyên tử Nitơ của liên kết peptide!`
                                        : `<strong style="color:var(--neon-magenta);">❌ ÂM TÍNH (Không tham gia phản ứng màu Biuret)</strong>. Dipeptide chỉ có 1 liên kết peptide, không đủ số phối tử để tạo phức chelate. Khi cho vào dung dịch Cu(OH)₂ chỉ thấy kết tủa xanh lam không đổi màu!`
                                   }<br>
                                   • <strong>Thủy phân:</strong> Cần <strong>${bondsCount} phân tử H₂O</strong> để thủy phân hoàn toàn thành các α-amino acid.`
                            }
                        </div>
                    </div>

                    <!-- MỤC 4: HÌNH HỌC 2D CÔNG THỨC CẤU TẠO TƯỜNG MINH -->
                    <div class="d3h-info-box" style="grid-column: 1 / -1; background:rgba(2, 6, 23, 0.9); border-color:rgba(0, 242, 254, 0.4);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <div class="d3h-box-label">📐 4. HÌNH HỌC 2D CÔNG THỨC CẤU TẠO (C, H, O, N, S &amp; LIÊN KẾT)</div>
                            <button class="mini-control-btn" style="color:var(--neon-cyan); font-size:0.75rem;" onclick="window.viewer3D.openFullChem2DModal('segment', ['${resCodes.join("','")}'])">
                                🔍 Phóng to toàn màn hình
                            </button>
                        </div>
                        <div style="overflow-x:auto; padding:4px 0;">
                            ${svg2dHtml}
                        </div>
                    </div>
                </div>

                <!-- THANH HÀNH ĐỘNG HỌC TẬP (VÒNG LẶP HỌC → HIỂU → LUYỆN) -->
                <div class="d3h-footer-actions">
                    <button class="btn-cyber-primary" style="padding:0.45rem 0.9rem; font-size:0.82rem;" onclick="window.app.switchTab('theorysummary')">
                        📚 Học Lí Thuyết Peptide &amp; Protein
                    </button>
                    <button class="btn-cyber-primary" style="padding:0.45rem 0.9rem; font-size:0.82rem; background:rgba(168,85,247,0.25); border-color:#a855f7;" onclick="window.app.switchTab('studyquiz')">
                        📝 Luyện Bài Tập Về Đoạn Này
                    </button>
                    <button class="mini-control-btn" style="color:#94a3b8; font-size:0.82rem;" onclick="window.viewer3D.closeDirect3DClickHud()">
                        Đóng (X)
                    </button>
                </div>
            </div>
        `;

        hud.style.display = 'block';
    }

    /**
     * Đóng bảng HUD phân tích 3D trực tiếp
     */
    closeDirect3DClickHud() {
        const hud = document.getElementById('direct3DClickHud');
        if (hud) hud.style.display = 'none';

        if (this.viewer) {
            if (this.activeLabels && this.activeLabels.length > 0) {
                this.activeLabels.forEach(lbl => this.viewer.removeLabel(lbl));
                this.activeLabels = [];
            }
            this.applyRepresentation();
            this.viewer.render();
        }
    }

    /**
     * Mở Bản Đồ Hình Học 2D Tường Minh Toàn Cầu
     */
    openFullChem2DModal(tab = 'segment', residues = null) {
        const modal = document.getElementById('globalModalBackdrop');
        const container = document.getElementById('modalContentContainer');
        if (modal && container && window.chemical2DEngine) {
            const list = residues || (this.lastClickedAtom ? [this.lastClickedAtom.resn || 'ALA', 'GLY', 'VAL'] : ['GLY', 'ALA', 'VAL']);
            container.innerHTML = window.chemical2DEngine.renderFullChem2DModalContent(tab, list);
            modal.classList.add('active');
            if (window.app) {
                window.app.playSound('beep');
                window.app.showToast("Đã mở Bản Đồ Hình Học 2D & Công Thức Cấu Tạo Tường Minh!", "info");
            }
        }
    }

    /**
     * Chế độ "Giải thích cấu trúc này" trực tiếp trên không gian 3D
     */
    explainStructureOverlay() {
        if (!this.viewer) return;

        // Bổ sung các nhãn giải thích cấu trúc không gian chính
        if (this.activeLabels && this.activeLabels.length > 0) {
            this.activeLabels.forEach(lbl => this.viewer.removeLabel(lbl));
            this.activeLabels = [];
        }

        try {
            const lbl1 = this.viewer.addLabel("Đầu N (Amino-terminus: H3N+)", {
                position: { resi: 1 },
                backgroundColor: 0x0284c7,
                backgroundOpacity: 0.9,
                fontColor: 0xffffff,
                borderColor: 0x38bdf8,
                fontSize: 12
            });
            const lbl2 = this.viewer.addLabel("Vùng Xoắn Alpha (Alpha-helix)", {
                position: { resi: 35 },
                backgroundColor: 0x831843,
                backgroundOpacity: 0.9,
                fontColor: 0xfbcfe8,
                borderColor: 0xec4899,
                fontSize: 12
            });
            const lbl3 = this.viewer.addLabel("Nhóm Heme Fe2+ (Nếu có)", {
                position: { resn: 'HEM' },
                backgroundColor: 0x7f1d1d,
                backgroundOpacity: 0.9,
                fontColor: 0xfecaca,
                borderColor: 0xef4444,
                fontSize: 12
            });

            if (lbl1) this.activeLabels.push(lbl1);
            if (lbl2) this.activeLabels.push(lbl2);
            if (lbl3) this.activeLabels.push(lbl3);
            this.viewer.render();

            if (window.app) {
                window.app.playSound('scan');
                window.app.showToast("💡 Đã kích hoạt Chế độ Giải Thích Cấu Trúc 3D Trực Quan!", "info");
            }
        } catch (e) {
            console.warn("Lỗi khi thêm nhãn giải thích:", e);
        }
    }

    // =========================================================================
    // CẬP NHẬT BẢNG CÔNG THỨC 2D ĐỒNG HÀNH (2D CHEMICAL COMPANION)
    // =========================================================================
    // =========================================================================
    // CẬP NHẬT BẢNG STUDIO 2D & 3D ĐỒNG HÀNH (PEPTIDE DUO STUDIO - CHUẨN IMAGE 2)
    // =========================================================================
    updateCompanion2DCard(proteinInfo = null) {
        const container = document.getElementById('companion2DContainer');
        if (!container || !window.chemical2DEngine) return;

        const p = proteinInfo || this.currentProtein || { id: this.currentPdbId, name: this.currentPdbId };
        const pId = (p.id || p.pdbId || this.currentPdbId || '').toLowerCase();
        const mode = this.companion2DMode || 'gly_his_gly';

        const isWhite = window.chemical2DEngine.isWhiteBg;

        const hasHeme = pId.includes('4hhb') || pId.includes('hemoglobin') || pId.includes('1mbo') || pId.includes('myoglobin');
        const hasDisulfide = pId.includes('crambin') || pId.includes('1crn') || pId.includes('insulin') || pId.includes('4ins') || pId.includes('lysozyme');

        let modeLabel = "Chuỗi Mẫu: Gly - His - Gly (Skeletal 2D & Ball-and-Stick 3D)";
        if (mode === 'dipeptide') modeLabel = "Phân Đoạn Dipeptide (2 gốc, 1 liên kết peptide)";
        else if (mode === 'tripeptide') modeLabel = "Phân Đoạn Tripeptide (3 gốc, 2 liên kết peptide)";
        else if (mode === 'tetrapeptide') modeLabel = "Phân Đoạn Tetrapeptide (4 gốc, 3 liên kết peptide)";
        else if (mode === 'backbone') modeLabel = "Khung Peptide (-CO-NH-) Tuyến Tính";
        else if (mode === 'prosthetic') modeLabel = "Nhân Heme Fe²⁺ & 4 Chuỗi Hemoglobin";
        else if (mode === 'disulfide') modeLabel = "Cầu Nối Disulfide (-S-S-) & 4 Lực Bậc 3";
        else if (mode === 'biuret') modeLabel = "Cơ Chế Phức Chất Chelate Biuret";
        else if (mode === 'hydrolysis') modeLabel = "Phản Ứng Thủy Phân Peptide & Cắt Mạch";
        else if (mode === 'custom') modeLabel = "Phân Đoạn Đang Soi Theo Vị Trí Chỉ Định";

        container.innerHTML = `
            <div class="companion-2d-card">
                <div class="companion-2d-header">
                    <div>
                        <div class="c2d-badge">📐 STUDIO HÌNH HỌC 2D & MÔ HÌNH 3D ĐỒNG HÀNH • CHUẨN SGK HÓA 12</div>
                        <h3 class="c2d-title">Cấu Trúc Hóa Học: ${p.name || this.currentPdbId}</h3>
                        <p class="c2d-sub">Chế độ đang xem: <strong style="color:var(--neon-cyan);">${modeLabel}</strong></p>
                    </div>
                    <div class="c2d-actions">
                        <button class="mini-control-btn ${mode === 'gly_his_gly' ? 'active' : ''}" style="color:var(--neon-amber); border-color:#f59e0b;" onclick="window.viewer3D.switchCompanion2DMode('gly_his_gly')">
                            ✨ Chuỗi Mẫu (Gly-His-Gly)
                        </button>
                        <button class="mini-control-btn ${mode === 'dipeptide' ? 'active' : ''}" onclick="window.viewer3D.switchCompanion2DMode('dipeptide')">
                            🔬 Đoạn 2 Gốc (Dipeptide)
                        </button>
                        <button class="mini-control-btn ${mode === 'tripeptide' ? 'active' : ''}" onclick="window.viewer3D.switchCompanion2DMode('tripeptide')">
                            🔬 Đoạn 3 Gốc (Tripeptide)
                        </button>
                        <button class="mini-control-btn ${mode === 'tetrapeptide' ? 'active' : ''}" onclick="window.viewer3D.switchCompanion2DMode('tetrapeptide')">
                            🔬 Đoạn 4 Gốc (Tetrapeptide)
                        </button>
                        <button class="mini-control-btn ${mode === 'backbone' ? 'active' : ''}" onclick="window.viewer3D.switchCompanion2DMode('backbone')">
                            Khung Peptide
                        </button>
                        ${hasHeme ? `
                            <button class="mini-control-btn ${mode === 'prosthetic' ? 'active' : ''}" style="color:#f87171; border-color:#ef4444;" onclick="window.viewer3D.switchCompanion2DMode('prosthetic')">
                                Nhân Heme (Fe²⁺)
                            </button>
                        ` : ''}
                        ${hasDisulfide ? `
                            <button class="mini-control-btn ${mode === 'disulfide' ? 'active' : ''}" style="color:#fde047; border-color:#eab308;" onclick="window.viewer3D.switchCompanion2DMode('disulfide')">
                                Cầu Disulfide (-S-S-)
                            </button>
                        ` : ''}
                        <button class="mini-control-btn ${mode === 'biuret' ? 'active' : ''}" onclick="window.viewer3D.switchCompanion2DMode('biuret')">
                            Phức Biuret
                        </button>
                        <button class="mini-control-btn ${mode === 'hydrolysis' ? 'active' : ''}" onclick="window.viewer3D.switchCompanion2DMode('hydrolysis')">
                            Thủy Phân
                        </button>
                        <button class="btn-cyber-primary" style="padding:0.45rem 0.9rem; font-size:0.8rem;" onclick="window.viewer3D.openFullChem2DModal('segment')">
                            Mở Bản Đồ 2D Đầy Đủ
                        </button>
                        <button class="mini-control-btn" style="color:var(--neon-cyan); border-color:var(--neon-cyan); font-weight:700;" onclick="window.viewer3D.toggleDuoFullscreen()" title="Xem toàn màn hình Studio 2D & 3D">
                            ⛶ Toàn Màn Hình
                        </button>
                    </div>
                </div>

                <!-- KHU VỰC KẾT XUẤT STUDIO DUO HOẶC SƠ ĐỒ CHUYÊN BIỆT -->
                <div id="companionDuoSlot" style="width:100%;"></div>
            </div>
        `;

        const duoSlot = document.getElementById('companionDuoSlot');
        if (!duoSlot) return;

        if (mode === 'prosthetic' && hasHeme) {
            duoSlot.innerHTML = `
                <div class="companion-2d-viewport" style="background:#fff; border-radius:10px; padding:8px; box-shadow:0 4px 20px rgba(0,0,0,0.2); overflow-x:auto;">
                    ${window.chemical2DEngine.generateLevel4SubunitsSvg(isWhite)}
                </div>
            `;
        } else if (mode === 'disulfide' && hasDisulfide) {
            const svgDisulfide = pId.includes('insulin') 
                ? window.chemical2DEngine.generateInsulin2DSvg(isWhite)
                : window.chemical2DEngine.generateLevel3InteractionsSvg(isWhite);
            duoSlot.innerHTML = `
                <div class="companion-2d-viewport" style="background:#fff; border-radius:10px; padding:8px; box-shadow:0 4px 20px rgba(0,0,0,0.2); overflow-x:auto;">
                    ${svgDisulfide}
                </div>
            `;
        } else if (mode === 'biuret') {
            duoSlot.innerHTML = `
                <div class="companion-2d-viewport" style="background:#fff; border-radius:10px; padding:8px; box-shadow:0 4px 20px rgba(0,0,0,0.2); overflow-x:auto;">
                    ${window.chemical2DEngine.generateBiuretComplexSvg(isWhite)}
                </div>
            `;
        } else if (mode === 'hydrolysis') {
            duoSlot.innerHTML = `
                <div class="companion-2d-viewport" style="background:#fff; border-radius:10px; padding:8px; box-shadow:0 4px 20px rgba(0,0,0,0.2); overflow-x:auto;">
                    ${window.chemical2DEngine.generateHydrolysisReactionSvg(isWhite)}
                </div>
            `;
        } else {
            // HIỂN THỊ PEPTIDE DUO STUDIO (2D SKELETAL + 3D BALL-AND-STICK) CHUẨN IMAGE 2!
            let residues = ['GLY', 'HIS', 'GLY'];
            if (mode === 'dipeptide') {
                residues = ['VAL', 'LEU'];
            } else if (mode === 'tripeptide') {
                residues = ['VAL', 'LEU', 'SER'];
            } else if (mode === 'tetrapeptide') {
                residues = ['VAL', 'LEU', 'SER', 'PRO'];
            } else if (mode === 'backbone') {
                residues = ['GLY', 'ALA', 'VAL'];
            } else if (mode === 'custom' && this.activeCompanionResidues) {
                residues = this.activeCompanionResidues;
            }

            window.chemical2DEngine.renderPeptideDuoStudio('companionDuoSlot', residues);
        }
    }

    switchCompanion2DMode(mode) {
        this.companion2DMode = mode;
        this.updateCompanion2DCard();
        if (window.app) window.app.playSound('click');
    }
}

