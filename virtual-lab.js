/**
 * PROTEINEXUS - PHÒNG THÍ NGHIỆM GIẢ LẬP (VIRTUAL MOLECULAR LAB)
 * 1. Thí nghiệm Đông tụ Protein: Nhiệt độ, Axit, Cồn, Muối kim loại, Diêm kết
 * 2. Thí nghiệm Phản ứng màu Biuret & Quang phổ kế: Tự động chạy và từng bước chi tiết
 */

class VirtualLabManager {
    constructor() {
        this.currentExperiment = 'coagulation';

        // Trạng thái Thí nghiệm 1: Đông tụ
        this.coagState = {
            sample: 'albumin',
            temperature: 25,
            isHeating: false,
            turbidity: 0,
            addedAgents: new Set(),
            heatInterval: null
        };

        // Trạng thái Thí nghiệm 2: Biuret
        this.biuretState = {
            selectedSampleId: 'egg_white',
            hasSample: true,
            hasNaOH: false,
            hasCuSO4: false,
            isShaken: false,
            measured: false,
            color: 'rgba(200, 230, 255, 0.3)',
            absorbance: 0.00
        };

        this.init();
    }

    init() {
        this.setupSubtabNavigation();
        this.setupCoagulationControls();
        this.setupBiuretControls();
        this.initMolecularLens();
        this.updateCoagulationDisplay();
        this.updateBiuretDisplay();
        this.switchExperiment(this.currentExperiment || 'coagulation');
    }

    setupSubtabNavigation() {
        const subtabs = document.querySelectorAll('.lab-subtab-btn');
        subtabs.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchExperiment(btn.dataset.exp);
            });
        });
    }

    switchExperiment(exp) {
        this.currentExperiment = exp;
        document.querySelectorAll('.lab-subtab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.exp === exp);
        });

        const coagSection = document.getElementById('coagulationWorkspace');
        const biuretSection = document.getElementById('biuretWorkspace');

        if (coagSection && biuretSection) {
            const isCoag = exp === 'coagulation';
            coagSection.classList.toggle('active', isCoag);
            biuretSection.classList.toggle('active', !isCoag);
            coagSection.style.display = isCoag ? '' : 'none';
            biuretSection.style.display = !isCoag ? '' : 'none';
        }

        if (window.app) {
            window.app.playSound('click');
            window.app.showToast(exp === 'coagulation' ? "Phòng Thí Nghiệm: ĐÔNG TỤ PROTEIN" : "Phòng Thí Nghiệm: PHẢN ỨNG MÀU BIURET", "info");
        }
    }

    /* =========================================================================
       THÍ NGHIỆM 1: ĐÔNG TỤ VÀ BIẾN TÍNH PROTEIN
       ========================================================================= */
    setupCoagulationControls() {
        const tempSlider = document.getElementById('tempSlider');
        if (tempSlider) {
            tempSlider.addEventListener('input', (e) => {
                this.setTemperature(parseInt(e.target.value));
            });
            tempSlider.addEventListener('change', (e) => {
                this.setTemperature(parseInt(e.target.value));
            });
        }

        const btnHeat = document.getElementById('btnStartHeating');
        if (btnHeat) {
            btnHeat.addEventListener('click', () => {
                this.toggleContinuousHeating();
            });
        }

        const btnReset = document.getElementById('btnResetCoag');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.resetCoagulation();
            });
        }

        const btnReversible = document.getElementById('btnTestReversibility');
        if (btnReversible) {
            btnReversible.addEventListener('click', () => {
                this.testReversibility();
            });
        }
    }

    setTemperature(temp) {
        this.coagState.temperature = temp;
        const tempDisplay = document.getElementById('tempDisplayVal');
        const tubeTempBadge = document.getElementById('tubeCurrentTempBadge');
        if (tempDisplay) tempDisplay.textContent = `${temp}°C`;
        if (tubeTempBadge) tubeTempBadge.textContent = `${temp}°C`;

        const slider = document.getElementById('tempSlider');
        if (slider && parseInt(slider.value) !== temp) slider.value = temp;

        // Đồng bộ hóa các nút preset nhiệt độ
        document.querySelectorAll('.coag-preset-btn').forEach(btn => {
            const pTemp = parseInt(btn.dataset.temp || btn.getAttribute('data-temp') || btn.textContent);
            btn.classList.toggle('active-preset', pTemp === temp);
        });

        const flame = document.getElementById('heatingElementGlow');
        if (flame) {
            if (temp > 40) flame.classList.add('active');
            else flame.classList.remove('active');
        }

        this.recalculateTurbidity();
        this.updateCoagulationDisplay();
    }

    setTemperaturePreset(temp) {
        this.setTemperature(temp);
        if (window.app) window.app.playSound('beep');
    }

    toggleContinuousHeating() {
        const btn = document.getElementById('btnStartHeating');
        const flame = document.getElementById('heatingElementGlow');

        if (this.coagState.isHeating) {
            clearInterval(this.coagState.heatInterval);
            this.coagState.isHeating = false;
            if (btn) {
                btn.textContent = "🔥 Bật Bếp Đun Nóng";
                btn.classList.remove('active');
            }
            if (flame && this.coagState.temperature <= 40) flame.classList.remove('active');
            if (window.app) window.app.playSound('click');
        } else {
            this.coagState.isHeating = true;
            if (btn) {
                btn.textContent = "⏹ Dừng Đun Nóng";
                btn.classList.add('active');
            }
            if (flame) flame.classList.add('active');
            if (window.app) window.app.playSound('scan');

            this.coagState.heatInterval = setInterval(() => {
                if (this.coagState.temperature < 100) {
                    this.setTemperature(this.coagState.temperature + 5);
                } else {
                    this.toggleContinuousHeating();
                }
            }, 250);
        }
    }

    // Hỗ trợ cả 2 hàm: addCoagAgent và toggleCoagAgent (bật/tắt thuận tiện, không kẹt 100%)
    addCoagAgent(agentId) {
        this.toggleCoagAgent(agentId);
    }

    toggleCoagAgent(agentId) {
        const isAlreadyAdded = this.coagState.addedAgents.has(agentId);

        if (isAlreadyAdded) {
            // GỠ BỎ HÓA CHẤT ĐANG CÓ TRONG ỐNG
            this.coagState.addedAgents.delete(agentId);
            this.updateReagentButtonsUI();
            this.recalculateTurbidity();
            this.updateCoagulationDisplay();

            let logMsg = "";
            switch (agentId) {
                case 'hcl':
                    logMsg = "Đã loại bỏ Axit HCl: Cân bằng điện tích phục hồi!";
                    break;
                case 'ethanol':
                    logMsg = "Đã bay hơi/loại bỏ Cồn Ethanol: Tương tác solvat hóa nước phục hồi!";
                    break;
                case 'cuso4':
                    logMsg = "Đã rửa trôi muối CuSO4 kim loại!";
                    break;
                case 'nacl':
                    logMsg = "Đã pha loãng màng muối NaCl!";
                    break;
            }

            const alertEl = document.getElementById('coagTubeStatusAlert');
            if (alertEl) {
                alertEl.textContent = `Ống nghiệm: Đã gỡ ${agentId.toUpperCase()} -> Độ vẩn đục: ${this.coagState.turbidity}%`;
                alertEl.style.color = 'var(--neon-cyan)';
            }

            this.addLabLog('coagLog', logMsg, 'info');
            if (window.app) {
                window.app.playSound('click');
                window.app.showToast(logMsg, "info");
            }
            return;
        }

        // NHỎ THÊM HÓA CHẤT VÀO ỐNG
        this.coagState.addedAgents.add(agentId);
        this.updateReagentButtonsUI();
        this.recalculateTurbidity();
        this.updateCoagulationDisplay();

        let logMsg = "";
        switch (agentId) {
            case 'hcl':
                logMsg = "Nhỏ HCl 10% (pH < 2): Điện tích phân tử bị triệt tiêu, cầu muối ion đứt gãy -> Albumin kết tủa vón cục ngay ở 25°C!";
                break;
            case 'ethanol':
                logMsg = "Thêm Cồn Ethanol 90°: Cạnh tranh lớp áo nước solvat hóa, phá vỡ tương tác kỵ nước -> Protein đông tụ!";
                break;
            case 'cuso4':
                logMsg = "Nhỏ muối CuSO4: Ion Cu2+ kim loại nặng liên kết chéo với nhóm -SH và -COO-, làm kết tủa không thuận nghịch!";
                break;
            case 'nacl':
                logMsg = "Thêm muối NaCl bão hòa: Hiện tượng Diêm kết (Salting-out). Lớp áo nước bị mất làm protein kết tủa, nhưng CÓ THỂ HOÀN NGUYÊN khi thêm nước cất!";
                break;
        }

        const alertEl = document.getElementById('coagTubeStatusAlert');
        if (alertEl) {
            alertEl.textContent = `Ống nghiệm: Đã nhỏ ${agentId.toUpperCase()} -> Độ vẩn đục: ${this.coagState.turbidity}%`;
            alertEl.style.color = agentId === 'nacl' ? 'var(--neon-emerald)' : 'var(--neon-magenta)';
        }

        this.addLabLog('coagLog', logMsg, 'warning');
        if (window.app) {
            window.app.playSound('bubble');
            window.app.showToast(logMsg, "warning");
        }

        this.animatePipette();
    }

    updateReagentButtonsUI() {
        const reagents = ['hcl', 'ethanol', 'nacl'];
        reagents.forEach(agentId => {
            const btn = document.getElementById(`bottle_${agentId}`) || 
                        Array.from(document.querySelectorAll('.bottle-btn')).find(b => (b.getAttribute('onclick') || '').includes(`'${agentId}'`));
            const isActive = this.coagState.addedAgents.has(agentId);
            if (btn) {
                btn.classList.toggle('active', isActive);
            }
            const tag = document.getElementById(`tag_${agentId}`);
            if (tag) {
                if (isActive) {
                    tag.textContent = '[✔ ĐÃ NHỎ - Chạm để gỡ]';
                    tag.style.color = 'var(--neon-cyan)';
                    tag.style.fontWeight = '700';
                } else {
                    tag.textContent = '[+ Nhỏ]';
                    tag.style.color = '#94a3b8';
                    tag.style.fontWeight = 'normal';
                }
            }
        });
    }

    recalculateTurbidity() {
        let t_temp = 0;
        const temp = this.coagState.temperature;

        // Mô hình biến tính theo nhiệt độ chuẩn SGK Hóa 12:
        // Phản ứng nhạy bén với từng bước kéo của thanh trượt
        if (temp > 85) {
            t_temp = 85 + ((temp - 85) / 15) * 15;
        } else if (temp > 75) {
            t_temp = 55 + ((temp - 75) / 10) * 30;
        } else if (temp > 55) {
            t_temp = 15 + ((temp - 55) / 20) * 40;
        } else if (temp > 30) {
            t_temp = ((temp - 30) / 25) * 15;
        } else {
            t_temp = 0;
        }

        // Hóa chất làm tăng độ đông tụ cơ bản
        let t_chem = 0;
        if (this.coagState.addedAgents.has('hcl')) t_chem += 45;
        if (this.coagState.addedAgents.has('ethanol')) t_chem += 35;
        if (this.coagState.addedAgents.has('nacl')) t_chem += 25;

        // Tổng độ vẩn đục: thanh trượt nhiệt độ luôn luôn tác động làm thay đổi %
        const total = t_temp + t_chem;
        this.coagState.turbidity = Math.min(100, Math.round(total));
    }

    updateCoagulationDisplay() {
        const cloud = document.getElementById('coagCloud');
        const bubbles = document.getElementById('coagBubbles');
        const turbStatus = document.getElementById('coagTurbidityStatus');
        const btnReversible = document.getElementById('btnTestReversibility');
        const coagPercentVal = document.getElementById('coagPercentVal');
        const tubeCurrentCoagBadge = document.getElementById('tubeCurrentCoagBadge');
        const coagProgressBar = document.getElementById('coagProgressBar');

        const turb = this.coagState.turbidity;
        if (cloud) cloud.style.opacity = (turb / 100).toFixed(2);

        // Hiển thị % đông tụ động đồng thời ở tất cả các vị trí
        if (coagPercentVal) {
            coagPercentVal.textContent = `${turb}%`;
            if (turb === 0) coagPercentVal.style.color = "var(--neon-emerald)";
            else if (turb < 40) coagPercentVal.style.color = "var(--neon-cyan)";
            else if (turb < 80) coagPercentVal.style.color = "var(--neon-amber)";
            else coagPercentVal.style.color = "var(--neon-magenta)";
        }

        if (tubeCurrentCoagBadge) {
            tubeCurrentCoagBadge.textContent = `${turb}%`;
            if (turb === 0) tubeCurrentCoagBadge.style.color = "var(--neon-emerald)";
            else if (turb < 40) tubeCurrentCoagBadge.style.color = "var(--neon-cyan)";
            else if (turb < 80) tubeCurrentCoagBadge.style.color = "var(--neon-amber)";
            else tubeCurrentCoagBadge.style.color = "var(--neon-magenta)";
        }

        if (coagProgressBar) {
            coagProgressBar.style.width = `${turb}%`;
        }

        // Bọt khí sủi tăm khi nhiệt độ > 60°C
        if (bubbles) {
            bubbles.innerHTML = '';
            if (this.coagState.temperature >= 60) {
                const count = Math.min(10, Math.floor((this.coagState.temperature - 50) / 5));
                for (let i = 0; i < count; i++) {
                    const b = document.createElement('div');
                    b.className = 'bubble';
                    b.style.left = `${15 + Math.random() * 70}%`;
                    b.style.width = `${4 + Math.random() * 6}px`;
                    b.style.height = b.style.width;
                    b.style.animationDelay = `${Math.random()}s`;
                    bubbles.appendChild(b);
                }
            }
        }

        // Đổi trạng thái hiển thị chi tiết
        if (turbStatus) {
            if (turb === 0) {
                turbStatus.textContent = "Dung dịch trong suốt (0%) - Albumin tự nhiên nguyên vẹn";
                turbStatus.style.color = "var(--neon-emerald)";
            } else if (turb < 40) {
                turbStatus.textContent = `Bắt đầu vẩn đục (${turb}%) - Các liên kết hydrogen bắt đầu đứt`;
                turbStatus.style.color = "var(--neon-cyan)";
            } else if (turb < 80) {
                turbStatus.textContent = `Vón cục từng mảng (${turb}%) - Chuỗi polypeptide đang bung tháo`;
                turbStatus.style.color = "var(--neon-amber)";
            } else {
                turbStatus.textContent = `ĐÔNG TỤ HOÀN TOÀN (${turb}%) - Mạng gel trắng đục không tan`;
                turbStatus.style.color = "var(--neon-magenta)";
            }
        }

        // Cập nhật trạng thái nút hoàn nguyên
        if (btnReversible) {
            const hasNaCl = this.coagState.addedAgents.has('nacl');
            const hasIrreversible = this.coagState.addedAgents.has('hcl') || this.coagState.temperature >= 55;

            if (hasNaCl && !hasIrreversible) {
                btnReversible.classList.add('active');
                btnReversible.innerHTML = '💧 Hoàn Nguyên (Thêm nước cất)';
                btnReversible.style.borderColor = 'var(--neon-emerald)';
                btnReversible.style.color = 'var(--neon-emerald)';
                btnReversible.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.4)';
            } else {
                btnReversible.classList.remove('active');
                btnReversible.innerHTML = '💧 Thử Hoàn Nguyên (+ Nước cất)';
                btnReversible.style.borderColor = '';
                btnReversible.style.color = '';
                btnReversible.style.boxShadow = '';
            }
        }
    }

    testReversibility() {
        if (this.coagState.turbidity === 0) {
            if (window.app) window.app.showToast("Dung dịch đang trong suốt, chưa kết tủa!", "info");
            return;
        }

        // Nếu chỉ dùng NaCl (Diêm kết / Salting-out) và nhiệt độ phòng (< 55°C)
        if (this.coagState.addedAgents.has('nacl') && 
            !this.coagState.addedAgents.has('hcl') && 
            this.coagState.temperature < 55) {

            this.coagState.addedAgents.delete('nacl');
            this.updateReagentButtonsUI();
            this.recalculateTurbidity();
            this.updateCoagulationDisplay();

            const alertEl = document.getElementById('coagTubeStatusAlert');
            if (alertEl) {
                alertEl.textContent = "✅ HOÀN NGUYÊN THÀNH CÔNG: Protein đã tan trong suốt trở lại (Thuận nghịch)!";
                alertEl.style.color = "var(--neon-emerald)";
            }

            this.addLabLog('coagLog', "THÀNH CÔNG: Thêm nước cất đã hòa tan lại mảng kết tủa muối NaCl! Hiện tượng Diêm kết (Salting-out) là THUẬN NGHỊCH.", "success");
            if (window.app) {
                window.app.playSound('success');
                window.app.showToast("Protein đã tan trở lại hoàn toàn! Diêm kết là phản ứng THUẬN NGHỊCH.", "success");
            }
        } else {
            const tube = document.getElementById('coagTestTube');
            if (tube) {
                tube.classList.add('shake-anim');
                setTimeout(() => tube.classList.remove('shake-anim'), 600);
            }

            const alertEl = document.getElementById('coagTubeStatusAlert');
            if (alertEl) {
                alertEl.textContent = "❌ KHÔNG THỂ HOÀN NGUYÊN: Biến tính do Nhiệt/Axit/Kim loại nặng là Bất thuận nghịch!";
                alertEl.style.color = "var(--neon-magenta)";
            }
            this.addLabLog('coagLog', "BẤT THUẬN NGHỊCH: Thêm nước cất KHÔNG THỂ hòa tan mảng đông tụ do Nhiệt độ / Axit / Kim loại nặng. Cấu trúc không gian bậc cao đã bị phá hủy vĩnh viễn!", "warning");
            if (window.app) {
                window.app.playSound('beep');
                window.app.showToast("Không thể hoàn nguyên! Biến tính do Nhiệt/Axit là Bất thuận nghịch.", "warning");
            }
        }
    }

    resetCoagulation() {
        if (this.coagState.heatInterval) clearInterval(this.coagState.heatInterval);
        this.coagState.isHeating = false;
        this.coagState.temperature = 25;
        this.coagState.turbidity = 0;
        this.coagState.addedAgents.clear();

        this.updateReagentButtonsUI();
        this.setTemperature(25);

        const btn = document.getElementById('btnStartHeating');
        if (btn) {
            btn.textContent = "🔥 Bật Bếp Đun Nóng";
            btn.classList.remove('active');
        }

        const alertEl = document.getElementById('coagTubeStatusAlert');
        if (alertEl) {
            alertEl.textContent = "Trạng thái: Albumin nguyên vẹn (25°C, trong suốt)";
            alertEl.style.color = "var(--neon-emerald)";
        }

        this.updateCoagulationDisplay();
        this.addLabLog('coagLog', "Đã thay ống nghiệm mới: Albumin lòng trắng trứng nguyên vẹn (25°C, trong suốt).", "info");
        if (window.app) {
            window.app.playSound('click');
            window.app.showToast("Đã thay ống nghiệm Albumin mới!", "info");
        }
    }

    /* =========================================================================
       THÍ NGHIỆM 2: PHẢN ỨNG MÀU BIURET & ĐO QUANG PHỔ KẾ
       ========================================================================= */
    setupBiuretControls() {
        const sampleSelect = document.getElementById('biuretSampleSelect');
        if (sampleSelect) {
            sampleSelect.addEventListener('change', (e) => {
                this.selectBiuretSample(e.target.value);
            });
        }

        const btnAuto = document.getElementById('btnAutoRunBiuret');
        if (btnAuto) {
            btnAuto.addEventListener('click', () => {
                this.autoRunBiuretExperiment();
            });
        }

        const btnNaOH = document.getElementById('btnAddNaOH');
        if (btnNaOH) {
            btnNaOH.addEventListener('click', () => {
                this.addBiuretReagent('naoh');
            });
        }

        const btnCuSO4 = document.getElementById('btnAddCuSO4');
        if (btnCuSO4) {
            btnCuSO4.addEventListener('click', () => {
                this.addBiuretReagent('cuso4');
            });
        }

        const btnShake = document.getElementById('btnShakeTube');
        if (btnShake) {
            btnShake.addEventListener('click', () => {
                this.shakeBiuretTube();
            });
        }

        const btnMeasure = document.getElementById('btnMeasureSpectro');
        if (btnMeasure) {
            btnMeasure.addEventListener('click', () => {
                this.measureSpectrophotometer();
            });
        }

        const btnMeasureDirect = document.getElementById('btnMeasureSpectroDirect');
        if (btnMeasureDirect) {
            btnMeasureDirect.addEventListener('click', () => {
                this.measureSpectrophotometer();
            });
        }

        const btnResetBiuret = document.getElementById('btnResetBiuret');
        if (btnResetBiuret) {
            btnResetBiuret.addEventListener('click', () => {
                this.resetBiuret();
            });
        }
    }

    selectBiuretSample(sampleId) {
        this.resetBiuret();
        this.biuretState.selectedSampleId = sampleId;
        const sample = LAB_EXPERIMENTS.biuret.samples.find(s => s.id === sampleId) || LAB_EXPERIMENTS.biuret.samples[0];

        const alertEl = document.getElementById('biuretTubeStatusAlert');
        if (alertEl) {
            alertEl.textContent = `Mẫu: ${sample.name} (${sample.peptideBonds} peptide)`;
            alertEl.style.color = "var(--neon-cyan)";
        }

        this.addLabLog('biuretLog', `Đã lấy mẫu: ${sample.name}. Số liên kết peptide: ${sample.peptideBonds}`, "info");
        if (window.app) {
            window.app.playSound('click');
            window.app.showToast(`Đã lấy mẫu: ${sample.name}`, "info");
        }
    }

    /**
     * TỰ ĐỘNG CHẠY TRỌN GÓI THÍ NGHIỆM BIURET (1-Click Complete Run)
     */
    async autoRunBiuretExperiment() {
        this.resetBiuret();
        const sample = LAB_EXPERIMENTS.biuret.samples.find(s => s.id === this.biuretState.selectedSampleId) || LAB_EXPERIMENTS.biuret.samples[0];

        this.addLabLog('biuretLog', `[BẮT ĐẦU QUY TRÌNH CHUẨN] Khảo sát mẫu: ${sample.name}`, 'info');
        if (window.app) window.app.playSound('scan');

        // Bước 1: Thêm NaOH 10%
        await new Promise(r => setTimeout(r, 350));
        this.addBiuretReagent('naoh');

        // Bước 2: Thêm CuSO4 1%
        await new Promise(r => setTimeout(r, 700));
        this.addBiuretReagent('cuso4');

        // Bước 3: Lắc ống nghiệm
        await new Promise(r => setTimeout(r, 700));
        this.shakeBiuretTube();

        // Bước 4: Đo quang phổ kế
        await new Promise(r => setTimeout(r, 800));
        this.measureSpectrophotometer();
    }

    addBiuretReagent(reagent) {
        if (reagent === 'naoh') {
            this.biuretState.hasNaOH = true;
            const btn = document.getElementById('btnAddNaOH');
            if (btn) btn.classList.add('active');

            const alertEl = document.getElementById('biuretTubeStatusAlert');
            if (alertEl) {
                alertEl.textContent = "Trạng thái: Đã kiềm hóa môi trường bằng NaOH 10%";
                alertEl.style.color = "var(--neon-cyan)";
            }

            this.addLabLog('biuretLog', "Thêm 1.0 mL NaOH 10%: Tạo môi trường kiềm mạnh làm deproton hóa các nguyên tử Nitơ của liên kết peptide.", "info");
            if (window.app) {
                window.app.playSound('bubble');
                window.app.showToast("Đã thêm 1.0 mL NaOH 10% (Kiềm hóa)", "success");
            }
            this.animatePipette();
        } else if (reagent === 'cuso4') {
            // Tự động bổ sung NaOH nếu chưa thêm để không bao giờ bị nghẽn
            if (!this.biuretState.hasNaOH) {
                this.biuretState.hasNaOH = true;
                const bNaOH = document.getElementById('btnAddNaOH');
                if (bNaOH) bNaOH.classList.add('active');
            }

            this.biuretState.hasCuSO4 = true;
            const btn = document.getElementById('btnAddCuSO4');
            if (btn) btn.classList.add('active');

            // Dung dịch chuyển màu xanh lam của ion Cu2+ trước khi lắc
            const fluid = document.getElementById('biuretFluid');
            if (fluid) {
                fluid.style.backgroundColor = 'rgba(56, 189, 248, 0.7)';
                fluid.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.4)';
            }

            const alertEl = document.getElementById('biuretTubeStatusAlert');
            if (alertEl) {
                alertEl.textContent = "Trạng thái: Đã nhỏ CuSO4 1% (Xanh Cu2+). Hãy nhấn Lắc ống nghiệm!";
                alertEl.style.color = "var(--neon-cyan)";
            }

            this.addLabLog('biuretLog', "Nhỏ 3 giọt CuSO4 1%: Cung cấp ion Cu2+. Hãy nhấn '4. Lắc Đều Ống Nghiệm' để tạo phức!", "warning");
            if (window.app) {
                window.app.playSound('bubble');
                window.app.showToast("Đã nhỏ CuSO4. Hãy bấm Lắc ống nghiệm!", "info");
            }
            this.animatePipette();
        }
    }

    shakeBiuretTube() {
        // Tự động bổ sung nếu chưa thêm hóa chất
        this.biuretState.hasNaOH = true;
        this.biuretState.hasCuSO4 = true;
        this.biuretState.isShaken = true;

        document.querySelectorAll('#btnAddNaOH, #btnAddCuSO4, #btnShakeTube').forEach(b => b.classList.add('active'));

        const tube = document.getElementById('biuretTestTube');
        if (tube) {
            tube.style.transform = "rotate(12deg) translateX(8px)";
            setTimeout(() => { tube.style.transform = "rotate(-12deg) translateX(-8px)"; }, 100);
            setTimeout(() => { tube.style.transform = "rotate(10deg) translateX(6px)"; }, 200);
            setTimeout(() => { tube.style.transform = "rotate(-8deg) translateX(-4px)"; }, 300);
            setTimeout(() => { tube.style.transform = "rotate(0deg) translateX(0)"; }, 400);
        }

        const sample = LAB_EXPERIMENTS.biuret.samples.find(s => s.id === this.biuretState.selectedSampleId) || LAB_EXPERIMENTS.biuret.samples[0];

        const fluid = document.getElementById('biuretFluid');
        if (fluid) {
            fluid.style.backgroundColor = sample.color;
            if (sample.result === 'positive') {
                fluid.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.8), inset 0 0 15px rgba(168, 85, 247, 0.6)';
            } else {
                fluid.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.4)';
            }
        }

        const alertEl = document.getElementById('biuretTubeStatusAlert');
        if (alertEl) {
            if (sample.result === 'positive') {
                alertEl.textContent = `🟣 DƯƠNG TÍNH (+): Có tham gia phản ứng màu Biuret (${sample.peptideBonds} liên kết peptide)`;
                alertEl.style.color = "var(--neon-purple)";
            } else {
                alertEl.textContent = `🔵 ÂM TÍNH (-): Không tham gia phản ứng màu Biuret, giữ màu xanh lam Cu(OH)₂`;
                alertEl.style.color = "var(--neon-cyan)";
            }
        }

        this.addLabLog('biuretLog', `KẾT QUẢ PHẢN ỨNG MÀU: ${sample.note}`, sample.result === 'positive' ? 'success' : 'warning');
        
        if (window.app) {
            window.app.playSound(sample.result === 'positive' ? 'success' : 'beep');
            window.app.showToast(`Phản ứng: ${sample.result === 'positive' ? 'DƯƠNG TÍNH (+) HÓA TÍM RỰC RỠ' : 'ÂM TÍNH (-) GIỮ MÀU XANH'}`, sample.result === 'positive' ? 'success' : 'warning');
        }
    }

    measureSpectrophotometer() {
        // Tự động chuẩn bị ống mẫu nếu chưa lắc hoặc chưa thêm hóa chất
        if (!this.biuretState.isShaken) {
            this.shakeBiuretTube();
        }

        const sample = LAB_EXPERIMENTS.biuret.samples.find(s => s.id === this.biuretState.selectedSampleId) || LAB_EXPERIMENTS.biuret.samples[0];
        const absValEl = document.getElementById('spectroAbsValue');
        const curveEl = document.getElementById('spectroCurveSvg');

        // Hiệu ứng số chạy đếm lên trên màn hình LED (Digital Counter Animation)
        if (absValEl) {
            let current = 0.0;
            const target = sample.absorbance;
            const step = Math.max(0.01, target / 15);
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                absValEl.textContent = current.toFixed(3);
            }, 30);
        }

        // Vẽ biểu đồ quang phổ hấp thụ thực tế
        if (curveEl) {
            const h = sample.absorbance * 70;
            curveEl.innerHTML = `
                <polyline fill="none" stroke="#10b981" stroke-width="2.5" 
                    points="0,85 40,82 80,75 120,${Math.max(10, 85 - h)} 160,78 200,85" />
                <circle cx="120" cy="${Math.max(10, 85 - h)}" r="4.5" fill="#00f2fe" />
                <text x="120" y="${Math.max(16, 73 - h)}" fill="#00f2fe" font-size="10" text-anchor="middle" font-family="'JetBrains Mono'" font-weight="bold">
                    λ=540nm (A=${sample.absorbance.toFixed(3)})
                </text>
            `;
        }

        const alertEl = document.getElementById('biuretTubeStatusAlert');
        if (alertEl) {
            alertEl.textContent = `📊 ĐÃ ĐO QUANG PHỔ: λ=540nm | Độ hấp thụ A540 = ${sample.absorbance.toFixed(3)}`;
            alertEl.style.color = "var(--neon-emerald)";
        }

        this.addLabLog('biuretLog', `[ĐO QUANG PHỔ] Bước sóng λ = 540 nm | Độ hấp thụ quang A540 = ${sample.absorbance.toFixed(3)}. Nồng độ liên kết peptide: ${sample.absorbance > 0.4 ? 'CỰC KỲ CAO (Protein đậm đặc)' : 'KHÔNG CÓ HOẶC RẤT THẤP'}.`, 'success');

        if (window.app) {
            window.app.playSound('success');
            window.app.showToast(`Quang phổ kế: λ=540nm | A=${sample.absorbance.toFixed(3)}`, "success");
        }
    }

    resetBiuret() {
        this.biuretState.hasNaOH = false;
        this.biuretState.hasCuSO4 = false;
        this.biuretState.isShaken = false;

        const fluid = document.getElementById('biuretFluid');
        if (fluid) {
            fluid.style.backgroundColor = 'rgba(200, 230, 255, 0.25)';
            fluid.style.boxShadow = '';
        }

        const absValEl = document.getElementById('spectroAbsValue');
        if (absValEl) absValEl.textContent = "0.000";

        const curveEl = document.getElementById('spectroCurveSvg');
        if (curveEl) curveEl.innerHTML = '<polyline fill="none" stroke="#64748b" stroke-width="2" points="0,85 100,85 200,85" />';

        const alertEl = document.getElementById('biuretTubeStatusAlert');
        if (alertEl) {
            alertEl.textContent = "Trạng thái: Ống nghiệm mẫu thử mới";
            alertEl.style.color = "var(--neon-cyan)";
        }

        document.querySelectorAll('#btnAddNaOH, #btnAddCuSO4, #btnShakeTube').forEach(b => b.classList.remove('active'));

        if (window.app) window.app.playSound('click');
    }

    animatePipette(callback) {
        const pipette = document.querySelector('.pipette-tool');
        if (!pipette) {
            if (callback) callback();
            return;
        }

        pipette.classList.add('dripping');
        setTimeout(() => {
            pipette.classList.remove('dripping');
            if (callback) callback();
        }, 600);
    }

    addLabLog(boxId, message, type = 'info') {
        const logBox = document.getElementById(boxId);
        if (!logBox) return;

        const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `[${time}] ${message}`;

        logBox.appendChild(entry);
        logBox.scrollTop = logBox.scrollHeight;
    }

    initMolecularLens() {
        const canvas = document.getElementById('molecularLensCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth || 300;
        canvas.height = 150;

        const molecules = [];
        for (let i = 0; i < 15; i++) {
            molecules.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                radius: 10 + Math.random() * 5
            });
        }

        let time = 0;
        const renderLens = () => {
            ctx.fillStyle = '#020408';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.03;
            const isDenatured = this.coagState.turbidity > 30;
            const factor = this.coagState.turbidity / 100;

            molecules.forEach((m, idx) => {
                m.x += m.vx * (1 - factor * 0.7);
                m.y += m.vy * (1 - factor * 0.7);

                if (m.x < 15 || m.x > canvas.width - 15) m.vx *= -1;
                if (m.y < 15 || m.y > canvas.height - 15) m.vy *= -1;

                if (isDenatured) {
                    m.x += ((canvas.width / 2) - m.x) * 0.005 * factor;
                    m.y += ((canvas.height / 2) - m.y) * 0.005 * factor;
                }

                ctx.save();
                ctx.translate(m.x, m.y);

                if (!isDenatured) {
                    ctx.beginPath();
                    ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
                    ctx.fill();
                    ctx.strokeStyle = '#00f2fe';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    for (let a = 0; a < Math.PI * 2; a += 0.4) {
                        const r = m.radius * (1 + factor * 0.8) + Math.sin(a * 4 + time + idx) * 6;
                        const px = Math.cos(a) * r;
                        const py = Math.sin(a) * r;
                        if (a === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
                    ctx.fill();
                    ctx.strokeStyle = '#f43f5e';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                ctx.restore();
            });

            requestAnimationFrame(renderLens);
        };

        renderLens();
    }

    updateBiuretDisplay() {
        // Init state
    }
}
