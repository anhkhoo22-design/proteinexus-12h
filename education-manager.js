/**
 * PROTEINEXUS - EDUCATION & STUDY MANAGER
 * Quản lý:
 * 1. Tab Ôn Luyện & Bài Tập (5 chủ đề, trắc nghiệm 4 phương án, trắc nghiệm đúng/sai, bài tập tính toán từng bước)
 * 2. Tab Sổ Tay Lí Thuyết (Lí thuyết từng loại protein + câu hỏi, Lí thuyết từng thí nghiệm + câu hỏi, Sổ tay tổng kết Hóa 12)
 * 3. Máy tính Phân tử khối Peptide & Thủy phân tương tác
 */

class EducationManager {
    constructor() {
        this.currentStudyTopicIndex = 0;
        this.currentTheorySubtab = 'presentation12h'; // 'presentation12h' | 'proteins' | 'experiments' | 'summary' | 'interactive' | 'coagchart' | 'examranking'
        this.selectedProteinTheoryId = 'albumin';
        this.selectedExperimentTheoryId = 'exp_coagulation';
        
        // Trạng thái điểm số
        this.quizScores = {};

        // Trạng thái thuyết trình & điền khuyết 12H
        this.currentPresentationLessonIndex = 0;
        this.presentationBlanksState = {};
        this.presentationQuizState = {};
        this.selectedExperimentReagent = {};

        // Trạng thái kiểm tra tổng hợp 12H
        this.exam12hState = {
            started: false,
            finished: false,
            score: 0,
            correctCount: 0,
            answers: {},
            timeLeft: 900,
            timer: null,
            student: { name: '', class: '12H', school: 'THPT Chuyên Hùng Vương' }
        };
        
        this.init();
    }

    init() {
        this.setupStudyTopicsNav();
        this.renderCurrentStudyTopic();
        this.setupTheorySummarySubtabs();
        this.renderPresentation12H();
        this.renderExamRanking12H();
        this.renderProteinTheoryList();
        this.renderExperimentTheoryList();
        this.renderTheorySummaryCheatSheet();
        this.renderPresentationInteractiveQuestions();
        this.initCoagulationDynamicChart();
    }

    /* =========================================================================
       1. TAB ÔN LUYỆN CHUYÊN ĐỀ & BÀI TẬP (STUDY QUIZ)
       ========================================================================= */
    setupStudyTopicsNav() {
        const navContainer = document.getElementById('studyTopicsNav');
        if (!navContainer || !window.STUDY_TOPICS_DATA) return;

        navContainer.innerHTML = '';
        window.STUDY_TOPICS_DATA.forEach((topic, idx) => {
            const btn = document.createElement('button');
            btn.className = `study-topic-btn ${idx === this.currentStudyTopicIndex ? 'active' : ''}`;
            btn.innerHTML = `
                <span class="topic-btn-icon">${topic.icon}</span>
                <span class="topic-btn-text">${topic.name}</span>
                <span class="topic-btn-badge">${topic.badge}</span>
            `;
            btn.addEventListener('click', () => {
                this.selectStudyTopic(idx);
            });
            navContainer.appendChild(btn);
        });
    }

    selectStudyTopic(idx) {
        this.currentStudyTopicIndex = idx;
        document.querySelectorAll('.study-topic-btn').forEach((b, i) => {
            b.classList.toggle('active', i === idx);
        });

        if (window.app) window.app.playSound('click');
        this.renderCurrentStudyTopic();
    }

    renderCurrentStudyTopic() {
        const container = document.getElementById('studyTopicContentArea');
        if (!container || !window.STUDY_TOPICS_DATA) return;

        const topic = window.STUDY_TOPICS_DATA[this.currentStudyTopicIndex];
        if (!topic) return;

        let html = `
            <div class="topic-hero-card">
                <div class="th-badge">${topic.badge}</div>
                <h2 class="th-title">${topic.icon} ${topic.name}</h2>
                <div class="th-quick-formula">
                    <strong>⚡ Bí kíp ghi nhớ nhanh:</strong> ${topic.quickFormula}
                </div>

                <div class="th-summary-box">
                    <div style="font-family:var(--font-heading); color:var(--neon-cyan); margin-bottom:6px; font-size:0.95rem;">
                        📌 KIẾN THỨC TRỌNG TÂM CẦN NẮM VỮNG:
                    </div>
                    <ul class="th-points-list">
                        ${topic.summaryPoints.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>


            </div>
        `;

        // Nếu là Chủ đề 4: Tính toán -> Chèn thêm Máy tính Peptide & Walkthrough từng bước
        if (topic.id === 'topic_calculations') {
            html += this.renderPeptideCalculatorSection();
            if (topic.stepByStepWalkthrough) {
                html += `
                    <div class="calc-walkthrough-card">
                        <div class="cwt-title">🧮 Hướng Dẫn Giải Chi Tiết Từng Bước (Step-by-step Walkthrough)</div>
                        <div class="cwt-prob">${topic.stepByStepWalkthrough.problem}</div>
                        <div class="cwt-steps-list">
                            ${topic.stepByStepWalkthrough.steps.map(s => `
                                <div class="cwt-step-item">
                                    <div class="cwt-snum">${s.stepNum}: ${s.title}</div>
                                    <div class="cwt-sdesc">${s.desc}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }

        // BỘ CÂU HỎI TRẮC NGHIỆM 4 PHƯƠNG ÁN
        html += `
            <div class="quiz-section-wrapper">
                <div class="quiz-section-header">
                    <div>
                        <h3 class="qsh-title">📝 Phần 1: Trắc Nghiệm Nhiều Phương Án Lựa Chọn</h3>
                        <p class="qsh-sub">Chọn 1 phương án đúng nhất. Nhận phản hồi và lời giải chi tiết tức thì.</p>
                    </div>
                    <div class="qsh-score-badge" id="topicMcqScoreBadge">
                        Đang làm: 0 / ${topic.questions.length} câu
                    </div>
                </div>

                <div class="mcq-list">
                    ${topic.questions.map((q, qIdx) => `
                        <div class="mcq-card" id="mcq-card-${topic.id}-${qIdx}">
                            <div class="mcq-question">
                                <span class="mcq-qnum">Câu ${qIdx + 1}:</span> ${q.q}
                            </div>
                            <div class="mcq-options-grid">
                                ${q.options.map((opt, optIdx) => `
                                    <button class="mcq-opt-btn" onclick="window.educationMgr.answerMcq('${topic.id}', ${qIdx}, ${optIdx}, ${q.answer})">
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                            <div class="mcq-explain-box" id="mcq-exp-${topic.id}-${qIdx}" style="display:none;"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // BỘ CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI (ĐỊNH DẠNG MỚI BỘ GD&ĐT)
        if (topic.trueFalseGroup) {
            const tfg = topic.trueFalseGroup;
            html += `
                <div class="quiz-section-wrapper" style="margin-top:1.5rem;">
                    <div class="quiz-section-header">
                        <div>
                            <h3 class="qsh-title" style="color:var(--neon-emerald);">⚖️ Phần 2: Trắc Nghiệm Đúng / Sai (Định Dạng Đề Thi Mới)</h3>
                            <p class="qsh-sub">${tfg.instruction}</p>
                        </div>
                    </div>

                    <div class="tf-group-card">
                        ${tfg.items.map((it, itIdx) => `
                            <div class="tf-item-row" id="tf-row-${topic.id}-${itIdx}">
                                <div class="tf-item-text">${it.text}</div>
                                <div class="tf-btn-group">
                                    <button class="tf-choice-btn" onclick="window.educationMgr.answerTrueFalse('${topic.id}', ${itIdx}, true, ${it.isTrue})">Đúng</button>
                                    <button class="tf-choice-btn" onclick="window.educationMgr.answerTrueFalse('${topic.id}', ${itIdx}, false, ${it.isTrue})">Sai</button>
                                </div>
                                <div class="tf-explain-box" id="tf-exp-${topic.id}-${itIdx}" style="display:none;"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // Xử lý trả lời câu hỏi trắc nghiệm
    answerMcq(topicId, qIdx, selectedOpt, correctOpt) {
        const card = document.getElementById(`mcq-card-${topicId}-${qIdx}`);
        const expBox = document.getElementById(`mcq-exp-${topicId}-${qIdx}`);
        if (!card || !expBox) return;

        const topic = window.STUDY_TOPICS_DATA.find(t => t.id === topicId);
        if (!topic || !topic.questions[qIdx]) return;
        const qData = topic.questions[qIdx];

        const buttons = card.querySelectorAll('.mcq-opt-btn');
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctOpt) {
                btn.classList.add('correct');
            } else if (idx === selectedOpt && selectedOpt !== correctOpt) {
                btn.classList.add('wrong');
            }
        });

        const isCorrect = selectedOpt === correctOpt;
        expBox.style.display = 'block';
        expBox.className = `mcq-explain-box ${isCorrect ? 'exp-correct' : 'exp-wrong'}`;
        expBox.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">
                ${isCorrect ? '🎉 CHÍNH XÁC!' : '❌ CHƯA ĐÚNG! Đáp án đúng là ' + qData.options[correctOpt].slice(0, 2)}
            </div>
            <div>${qData.explain}</div>
        `;

        if (window.app) {
            window.app.playSound(isCorrect ? 'success' : 'wrong');
        }
    }

    // Xử lý câu hỏi Đúng / Sai
    answerTrueFalse(topicId, itIdx, userChoice, correctChoice) {
        const row = document.getElementById(`tf-row-${topicId}-${itIdx}`);
        const expBox = document.getElementById(`tf-exp-${topicId}-${itIdx}`);
        if (!row || !expBox) return;

        const topic = window.STUDY_TOPICS_DATA.find(t => t.id === topicId);
        if (!topic || !topic.trueFalseGroup || !topic.trueFalseGroup.items[itIdx]) return;
        const item = topic.trueFalseGroup.items[itIdx];

        const buttons = row.querySelectorAll('.tf-choice-btn');
        buttons.forEach(b => b.disabled = true);

        const isCorrect = userChoice === correctChoice;
        if (userChoice === true) {
            buttons[0].classList.add(isCorrect ? 'correct' : 'wrong');
        } else {
            buttons[1].classList.add(isCorrect ? 'correct' : 'wrong');
        }

        expBox.style.display = 'block';
        expBox.className = `tf-explain-box ${isCorrect ? 'exp-correct' : 'exp-wrong'}`;
        expBox.innerHTML = `
            <strong>${isCorrect ? '✅ Bạn đã trả lời đúng!' : '⚠️ Chưa chính xác! Mệnh đề này là ' + (correctChoice ? 'ĐÚNG' : 'SAI')}</strong>: ${item.explain}
        `;

        if (window.app) window.app.playSound(isCorrect ? 'success' : 'wrong');
    }

    // Máy tính phân tử khối Peptide & Thủy phân tương tác
    renderPeptideCalculatorSection() {
        return `
            <div class="peptide-calc-box">
                <div class="pcb-header">
                    <span>⚡ MÁY TÍNH PHÂN TỬ KHỐI &amp; THỦY PHÂN PEPTIDE NHANH</span>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">Nhập chuỗi amino acid viết tắt</span>
                </div>
                <div class="pcb-body">
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.75rem;">
                        <input type="text" id="calcPeptideInput" class="cyber-input" style="flex:1; min-width:200px;" value="Gly-Ala-Val" placeholder="VD: Gly-Ala-Val hoặc Ala-Ala-Gly-Val">
                        <button class="btn-cyber-primary" onclick="window.educationMgr.calculatePeptide()">Tính Toán Ngay</button>
                    </div>
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.75rem;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); align-self:center;">Mẫu nhanh:</span>
                        <button class="mini-control-btn" onclick="document.getElementById('calcPeptideInput').value='Gly-Ala'; window.educationMgr.calculatePeptide();">Dipeptide (Gly-Ala)</button>
                        <button class="mini-control-btn" onclick="document.getElementById('calcPeptideInput').value='Gly-Ala-Val'; window.educationMgr.calculatePeptide();">Tripeptide (Gly-Ala-Val)</button>
                        <button class="mini-control-btn" onclick="document.getElementById('calcPeptideInput').value='Ala-Gly-Val-Leu'; window.educationMgr.calculatePeptide();">Tetrapeptide (4 gốc)</button>
                    </div>
                    <div id="calcPeptideResultArea" class="pcb-result" style="display:none;"></div>
                </div>
            </div>
        `;
    }

    calculatePeptide() {
        const input = document.getElementById('calcPeptideInput');
        const resArea = document.getElementById('calcPeptideResultArea');
        if (!input || !resArea) return;

        const str = input.value.trim().toUpperCase();
        const parts = str.split(/[-,\s]+/).filter(Boolean);
        if (parts.length === 0) return;

        const mwMap = {
            'GLY': 75, 'ALA': 89, 'VAL': 117, 'LEU': 131, 'ILE': 131,
            'PRO': 115, 'PHE': 165, 'TYR': 181, 'TRP': 204, 'SER': 105,
            'THR': 119, 'CYS': 121, 'MET': 149, 'ASN': 132, 'GLN': 146,
            'ASP': 133, 'GLU': 147, 'LYS': 146, 'ARG': 174, 'HIS': 155
        };

        let totalMwAa = 0;
        let unknown = [];
        parts.forEach(p => {
            if (mwMap[p]) {
                totalMwAa += mwMap[p];
            } else {
                unknown.push(p);
            }
        });

        if (unknown.length > 0) {
            resArea.style.display = 'block';
            resArea.innerHTML = `<span style="color:#ef4444;">Không nhận diện được amino acid: ${unknown.join(', ')}. Hãy dùng ký hiệu 3 chữ cái chuẩn (Gly, Ala, Val...)</span>`;
            return;
        }

        const n = parts.length;
        const bonds = n - 1;
        const peptideMw = totalMwAa - (bonds * 18);
        const isBiuret = bonds >= 2;

        resArea.style.display = 'block';
        resArea.innerHTML = `
            <div style="font-family:var(--font-heading); color:var(--neon-cyan); font-size:1.1rem; margin-bottom:6px;">
                KẾT QUẢ PHÂN TÍCH CHUỖI [${parts.join(' - ')}]:
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.5rem; font-size:0.9rem;">
                <div>• Số mắt xích (n): <strong>${n}</strong></div>
                <div>• Số liên kết peptide: <strong>${bonds}</strong></div>
                <div>• Phân tử khối (M): <strong style="color:var(--neon-emerald); font-size:1.1rem;">${peptideMw} g/mol</strong></div>
                <div>• Phản ứng Biuret: <strong style="color:${isBiuret ? 'var(--neon-purple)' : 'var(--neon-magenta)'}">${isBiuret ? 'DƯƠNG TÍNH (Màu tím)' : 'ÂM TÍNH (Không màu tím)'}</strong></div>
            </div>
            <div style="margin-top:8px; font-size:0.85rem; color:#cbd5e1; border-top:1px solid rgba(255,255,255,0.08); padding-top:6px;">
                💡 <em>Công thức thủy phân hoàn toàn:</em> 1 mol peptide + <strong>${bonds} mol H2O</strong> &rarr; ${parts.map(p => `1 mol ${p}`).join(' + ')}.<br>
                💡 <em>Phản ứng với NaOH:</em> 1 mol peptide + <strong>${n} mol NaOH</strong> &rarr; Hỗn hợp muối + <strong>1 mol H2O</strong>.
            </div>
        `;

        if (window.app) window.app.playSound('beep');
    }

    /* =========================================================================
       2. TAB SỔ TAY LÍ THUYẾT (THEORY SUMMARY)
       ========================================================================= */
    setupTheorySummarySubtabs() {
        const subtabBtns = document.querySelectorAll('.theory-subtab-btn');
        subtabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTheorySubtab(btn.dataset.subtab);
            });
        });
    }

    switchTheorySubtab(subtabId) {
        this.currentTheorySubtab = subtabId;
        document.querySelectorAll('.theory-subtab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.subtab === subtabId);
        });

        document.querySelectorAll('.theory-subview').forEach(v => {
            v.classList.toggle('active', v.id === `theoryView-${subtabId}`);
        });

        if (subtabId === 'interactive') {
            this.renderPresentationInteractiveQuestions();
        } else if (subtabId === 'coagchart') {
            this.initCoagulationDynamicChart();
        } else if (subtabId === 'presentation12h') {
            this.renderPresentation12H();
        } else if (subtabId === 'examranking') {
            this.renderExamRanking12H();
        } else if (subtabId === 'proteins') {
            this.renderProteinTheoryList();
        }

        if (window.app) window.app.playSound('click');
    }

    // Danh mục lí thuyết từng loại protein
    renderProteinTheoryList() {
        const container = document.getElementById('proteinTheoryGrid');
        if (!container || !window.PROTEIN_TYPES_THEORY) return;

        container.innerHTML = '';
        window.PROTEIN_TYPES_THEORY.forEach(p => {
            const card = document.createElement('div');
            card.className = 'protein-theory-card';
            card.innerHTML = `
                <div class="ptc-header">
                    <div>
                        <div class="ptc-badge ${p.shapeType}">${p.shapeTypeName}</div>
                        <h3 class="ptc-name">${p.name}</h3>
                        <div class="ptc-comp">${p.compositionTypeName} | ${p.mw}</div>
                    </div>
                </div>

                <div class="ptc-body">
                    <div class="ptc-info-row">
                        <span class="ptc-lbl">Độ tan:</span>
                        <span class="ptc-val">${p.solubility}</span>
                    </div>
                    <div class="ptc-info-row">
                        <span class="ptc-lbl">Nguồn gốc:</span>
                        <span class="ptc-val">${p.sources}</span>
                    </div>
                    <div class="ptc-desc">${p.structureNotes}</div>

                    <div style="margin-top:8px;">
                        <span style="font-family:var(--font-heading); font-size:0.8rem; color:var(--neon-cyan);">Tính chất then chốt:</span>
                        <ul style="padding-left:1.2rem; font-size:0.85rem; color:#cbd5e1; margin-top:4px;">
                            ${p.keyProperties.slice(0, 3).map(k => `<li>${k}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="ptc-footer">
                    <button class="btn-cyber-primary" style="padding:0.45rem 0.9rem; font-size:0.85rem;" onclick="window.educationMgr.openProteinTheoryDetailModal('${p.id}')">
                        📖 Xem Chi Tiết &amp; Làm Câu Hỏi (${p.questions ? p.questions.length : 0} câu)
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    openProteinTheoryDetailModal(proteinId) {
        const p = (window.PROTEIN_TYPES_THEORY || []).find(item => item.id === proteinId);
        if (!p) return;

        const modal = document.getElementById('globalModalBackdrop');
        const container = document.getElementById('modalContentContainer');
        if (!modal || !container) return;

        container.innerHTML = `
            <div style="font-family:var(--font-heading); font-size:1.5rem; color:#fff; display:flex; align-items:center; gap:10px; margin-bottom:0.75rem;">
                <span>🔬 ${p.name}</span>
                <span class="ptc-badge ${p.shapeType}">${p.shapeTypeName}</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem; max-height:75vh; overflow-y:auto; padding-right:8px;">

                <div style="background:rgba(0,0,0,0.5); padding:1rem; border-radius:10px; border:1px solid rgba(0,242,254,0.3);">
                    <div style="color:var(--neon-cyan); font-family:var(--font-heading); margin-bottom:4px;">1. ĐẶC ĐIỂM CẤU TRÚC &amp; ĐỘ TAN:</div>
                    <p style="font-size:0.9rem; color:#cbd5e1; line-height:1.6;">${p.structureNotes}</p>
                    <div style="margin-top:6px; font-size:0.85rem; color:#94a3b8;">
                        • <strong>Phân loại:</strong> ${p.compositionTypeName} | <strong>Khối lượng:</strong> ${p.mw}<br>
                        • <strong>Độ tan:</strong> ${p.solubility}<br>
                        • <strong>Nơi tìm thấy:</strong> ${p.sources}
                    </div>
                </div>

                <div style="background:rgba(15,23,42,0.7); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
                    <div style="color:var(--neon-amber); font-family:var(--font-heading); margin-bottom:4px;">2. TÍNH CHẤT LÝ HÓA ĐẶC TRƯNG:</div>
                    <ul style="padding-left:1.2rem; font-size:0.9rem; color:#cbd5e1; line-height:1.6;">
                        ${p.keyProperties.map(prop => `<li>${prop}</li>`).join('')}
                    </ul>
                </div>

                <div style="background:rgba(0,0,0,0.5); padding:1rem; border-radius:10px; border:1px solid rgba(16,185,129,0.3);">
                    <div style="color:var(--neon-emerald); font-family:var(--font-heading); margin-bottom:4px;">3. VAI TRÒ SINH HỌC &amp; ỨNG DỤNG ĐỜI SỐNG:</div>
                    <p style="font-size:0.9rem; color:#cbd5e1; line-height:1.6;">
                        • <strong>Vai trò sinh học:</strong> ${p.biologicalRole}<br>
                        • <strong>Ứng dụng thực tế:</strong> ${p.realLifeApp}
                    </p>
                </div>

                <!-- BỘ CÂU HỎI CỦNG CỐ RIÊNG CHO LOẠI PROTEIN NÀY -->
                <div style="border-top:1px solid rgba(255,255,255,0.15); padding-top:1rem;">
                    <div style="font-family:var(--font-heading); font-size:1.1rem; color:var(--neon-cyan); margin-bottom:0.75rem;">
                        📝 BỘ CÂU HỎI TRẮC NGHIỆM CỦNG CỐ: ${p.name.toUpperCase()}
                    </div>
                    <div class="mcq-list">
                        ${p.questions.map((q, qIdx) => `
                            <div class="mcq-card" id="pmcq-${p.id}-${qIdx}">
                                <div class="mcq-question">
                                    <span class="mcq-qnum">Câu ${qIdx + 1}:</span> ${q.q}
                                </div>
                                <div class="mcq-options-grid">
                                    ${q.options.map((opt, optIdx) => `
                                        <button class="mcq-opt-btn" onclick="window.educationMgr.answerProteinMcq('${p.id}', ${qIdx}, ${optIdx}, ${q.answer})">
                                            ${opt}
                                        </button>
                                    `).join('')}
                                </div>
                                <div class="mcq-explain-box" id="pmcq-exp-${p.id}-${qIdx}" style="display:none;"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        if (window.app) window.app.playSound('click');
    }

    answerProteinMcq(proteinId, qIdx, selectedOpt, correctOpt) {
        const card = document.getElementById(`pmcq-${proteinId}-${qIdx}`);
        const expBox = document.getElementById(`pmcq-exp-${proteinId}-${qIdx}`);
        if (!card || !expBox) return;

        const p = (window.PROTEIN_TYPES_THEORY || []).find(item => item.id === proteinId);
        if (!p || !p.questions[qIdx]) return;
        const qData = p.questions[qIdx];

        const buttons = card.querySelectorAll('.mcq-opt-btn');
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctOpt) {
                btn.classList.add('correct');
            } else if (idx === selectedOpt && selectedOpt !== correctOpt) {
                btn.classList.add('wrong');
            }
        });

        const isCorrect = selectedOpt === correctOpt;
        expBox.style.display = 'block';
        expBox.className = `mcq-explain-box ${isCorrect ? 'exp-correct' : 'exp-wrong'}`;
        expBox.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">
                ${isCorrect ? '🎉 CHÍNH XÁC!' : '❌ CHƯA ĐÚNG! Đáp án đúng là ' + qData.options[correctOpt].slice(0, 2)}
            </div>
            <div>${qData.explain}</div>
        `;

        if (window.app) window.app.playSound(isCorrect ? 'success' : 'wrong');
    }

    // Danh mục lí thuyết từng thí nghiệm
    renderExperimentTheoryList() {
        const container = document.getElementById('experimentsTheoryArea');
        if (!container || !window.EXPERIMENTS_DETAILED_THEORY) return;

        container.innerHTML = '';
        window.EXPERIMENTS_DETAILED_THEORY.forEach((exp, idx) => {
            const card = document.createElement('div');
            card.className = 'exp-theory-card';
            card.innerHTML = `
                <div class="etc-header">
                    <span class="etc-badge">THÍ NGHIỆM CHUẨN GDPT 2018</span>
                    <h3 class="etc-title">${exp.name}</h3>
                    <p class="etc-sub"><strong>Mục đích:</strong> ${exp.purpose}</p>
                </div>

                <div class="etc-body">
                    <div class="etc-section">
                        <span class="etc-sec-title">🧪 Hóa chất &amp; Dụng cụ:</span>
                        <ul class="etc-list">
                            ${exp.chemicals.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="etc-section">
                        <span class="etc-sec-title">📋 Các bước tiến hành:</span>
                        <ol class="etc-list" style="padding-left:1.2rem;">
                            ${exp.steps.map(s => `<li>${s}</li>`).join('')}
                        </ol>
                    </div>

                    <div class="etc-section" style="background:rgba(0,242,254,0.06); padding:0.75rem; border-radius:8px; border:1px solid rgba(0,242,254,0.2);">
                        <span class="etc-sec-title" style="color:var(--neon-cyan);">👁️ Hiện tượng quan sát được:</span>
                        <ul class="etc-list">
                            ${exp.phenomena.map(ph => `<li>${ph}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="etc-section" style="background:rgba(168,85,247,0.06); padding:0.75rem; border-radius:8px; border:1px solid rgba(168,85,247,0.2);">
                        <span class="etc-sec-title" style="color:var(--neon-purple);">🔬 Bản chất &amp; Cơ chế phân tử:</span>
                        <p style="font-size:0.85rem; color:#cbd5e1; line-height:1.5;">${exp.molecularMechanism}</p>
                    </div>



                    <!-- BỘ CÂU HỎI THỰC HÀNH CỦA THÍ NGHIỆM NÀY -->
                    <div style="margin-top:1rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.75rem;">
                        <span style="font-family:var(--font-heading); color:var(--neon-emerald); font-size:0.95rem; display:block; margin-bottom:8px;">
                            📝 CÂU HỎI KIỂM TRA THỰC HÀNH THÍ NGHIỆM NÀY:
                        </span>
                        <div class="mcq-list">
                            ${exp.questions.map((q, qIdx) => `
                                <div class="mcq-card" id="emcq-${exp.id}-${qIdx}">
                                    <div class="mcq-question">
                                        <span class="mcq-qnum">Câu ${qIdx + 1}:</span> ${q.q}
                                    </div>
                                    <div class="mcq-options-grid">
                                        ${q.options.map((opt, optIdx) => `
                                            <button class="mcq-opt-btn" onclick="window.educationMgr.answerExpMcq('${exp.id}', ${qIdx}, ${optIdx}, ${q.answer})">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                    <div class="mcq-explain-box" id="emcq-exp-${exp.id}-${qIdx}" style="display:none;"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    answerExpMcq(expId, qIdx, selectedOpt, correctOpt) {
        const card = document.getElementById(`emcq-${expId}-${qIdx}`);
        const expBox = document.getElementById(`emcq-exp-${expId}-${qIdx}`);
        if (!card || !expBox) return;

        const exp = (window.EXPERIMENTS_DETAILED_THEORY || []).find(item => item.id === expId);
        if (!exp || !exp.questions[qIdx]) return;
        const qData = exp.questions[qIdx];

        const buttons = card.querySelectorAll('.mcq-opt-btn');
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctOpt) {
                btn.classList.add('correct');
            } else if (idx === selectedOpt && selectedOpt !== correctOpt) {
                btn.classList.add('wrong');
            }
        });

        const isCorrect = selectedOpt === correctOpt;
        expBox.style.display = 'block';
        expBox.className = `mcq-explain-box ${isCorrect ? 'exp-correct' : 'exp-wrong'}`;
        expBox.innerHTML = `
            <div style="font-weight:bold; margin-bottom:4px;">
                ${isCorrect ? '🎉 CHÍNH XÁC!' : '❌ CHƯA ĐÚNG! Đáp án đúng là ' + qData.options[correctOpt].slice(0, 2)}
            </div>
            <div>${qData.explain}</div>
        `;

        if (window.app) window.app.playSound(isCorrect ? 'success' : 'wrong');
    }

    // Sổ tay tổng kết lí thuyết Hóa 12
    renderTheorySummaryCheatSheet() {
        const container = document.getElementById('theorySummaryContainer');
        if (!container || !window.THEORY_SUMMARY) return;

        const ts = window.THEORY_SUMMARY;
        let html = `
            <div class="summary-doc-card">
                <div class="sdc-top-banner">
                    <h2 class="sdc-h2">${ts.title}</h2>
                    <p class="sdc-sub">${ts.sub}</p>
                </div>
        `;

        ts.sections.forEach(sec => {
            html += `
                <div class="summary-section-block">
                    <h3 class="ssb-heading">${sec.heading}</h3>
            `;
            if (sec.content) {
                html += `<div class="ssb-content">${sec.content}</div>`;
            }

            if (sec.table) {
                html += `
                    <div style="overflow-x:auto;">
                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th>Bậc cấu trúc</th>
                                    <th>Mô tả hình thái</th>
                                    <th>Liên kết duy trì</th>
                                    <th>Ghi chú thi cử</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sec.table.map(r => `
                                    <tr>
                                        <td><strong>${r.level}</strong></td>
                                        <td>${r.desc}</td>
                                        <td><span style="color:var(--neon-cyan);">${r.bonds}</span></td>
                                        <td><small style="color:#cbd5e1;">${r.note}</small></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
            html += `</div>`;
        });

        html += `
                <div style="display:flex; justify-content:center; gap:0.75rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.1);">
                    <button class="btn-cyber-primary" onclick="window.print();">🖨️ In / Tải Sổ Tay PDF</button>
                    <button class="mini-control-btn" onclick="window.educationMgr.switchTheorySubtab('proteins');">🔍 Tra Cứu Từng Loại Protein</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /* =========================================================================
       2. LỘ TRÌNH TỰ HỌC: BẮT ĐẦU TỪ SỐ 0 (8 BƯỚC NHANH DÀNH CHO NGƯỜI MỚI)
       ========================================================================= */
    startBeginnerPath(stepIndex = 0) {
        const steps = [
            {
                num: 1,
                title: "α-Amino Acid Là Gì?",
                icon: "🧬",
                summary: "Amino acid là hợp chất hữu cơ tạp chức chứa đồng thời nhóm amino (-NH₂) và nhóm carboxyl (-COOH).",
                details: `
                    • Công thức chung của α-amino acid: <strong>H₂N–CH(R)–COOH</strong>.<br>
                    • Nhóm <strong>-NH₂</strong> luôn đính vào nguyên tử <strong>Carbon alpha (Cα)</strong> kế bên nhóm -COOH.<br>
                    • Cơ thể sống cấu tạo từ <strong>20 loại α-amino acid tiêu chuẩn</strong>.<br>
                    • <em>Tính chất lưỡng tính:</em> Vừa tác dụng với axit vừa tác dụng với bazơ tạo ion lưỡng cực H₃N⁺–CH(R)–COO⁻.
                `,
                keyTakeaway: "⭐ Điểm cốt lõi: α-amino acid là những 'viên gạch' đơn vị để xây dựng nên peptide và protein."
            },
            {
                num: 2,
                title: "Liên Kết Peptide Hình Thành Thế Nào?",
                icon: "🔗",
                summary: "Liên kết peptide là liên kết -CO-NH- giữa nhóm α-COOH của amino acid này với nhóm α-NH₂ của amino acid khác.",
                details: `
                    • <strong>Cơ chế tách nước:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;H₂N–CH(R₁)–<strong>COOH</strong> + <strong>H</strong>₂N–CH(R₂)–COOH &rarr; H₂N–CH(R₁)–<strong>CO–NH</strong>–CH(R₂)–COOH + <strong>H₂O</strong><br>
                    • Liên kết C—N có độ dài <strong>1.32 Å</strong> phẳng, cứng nhắc, không tự do quay quanh trục.<br>
                    • <em>Lưu ý:</em> Nhóm -CO-NH- giữa nhóm carboxyl và amino <strong>ở vị trí khác α</strong> chỉ gọi là liên kết amide, không phải liên kết peptide!
                `,
                keyTakeaway: "⭐ Cứ 2 amino acid ngưng tụ lại thì tạo ra 1 liên kết peptide và giải phóng 1 phân tử H₂O."
            },
            {
                num: 3,
                title: "Peptide & Quy Tắc Đầu N, Đầu C",
                icon: "🧪",
                summary: "Peptide là hợp chất chứa từ 2 đến 50 gốc α-amino acid liên kết với nhau bằng liên kết peptide.",
                details: `
                    • <strong>Dipeptide:</strong> Gồm 2 gốc amino acid &rarr; có <strong>1 liên kết peptide</strong>.<br>
                    • <strong>Tripeptide:</strong> Gồm 3 gốc amino acid &rarr; có <strong>2 liên kết peptide</strong>.<br>
                    • <strong>Quy ước viết mạch:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• <strong>Đầu N (bên trái):</strong> Gốc amino acid còn nhóm -NH₂ tự do.<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• <strong>Đầu C (bên phải):</strong> Gốc amino acid còn nhóm -COOH tự do.<br>
                    • Ví dụ: <strong>Gly–Ala</strong> khác hoàn toàn với <strong>Ala–Gly</strong> (hai chất đồng phân của nhau)!
                `,
                keyTakeaway: "⭐ Số liên kết peptide trong một mạch hở luôn bằng: Số gốc amino acid - 1."
            },
            {
                num: 4,
                title: "Polypeptide & Phân Tử Protein",
                icon: "🧱",
                summary: "Protein là những hợp chất cao phân tử (polypeptide) phức tạp có phân tử khối từ vài vạn đến vài triệu đvC.",
                details: `
                    • <strong>Polypeptide:</strong> Chuỗi chứa từ 11 đến 50 gốc amino acid.<br>
                    • <strong>Protein:</strong> Chuỗi polypeptide có trên 50 gốc amino acid và cuộn gập thành <em>cấu trúc không gian xác định</em>.<br>
                    • <strong>Phân loại protein:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• <em>Protein đơn giản:</em> Chỉ gồm các gốc α-amino acid (ví dụ: Albumin trứng, Fibroin tơ tằm).<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• <em>Protein phức tạp:</em> Gồm protein đơn giản gắn thêm nhóm phi protein (ví dụ: Hemoglobin gắn thêm nhóm Heme Fe²⁺).
                `,
                keyTakeaway: "⭐ Mọi protein đều là polypeptide, nhưng polypeptide phải cuộn gập không gian thì mới có hoạt tính sinh học của protein."
            },
            {
                num: 5,
                title: "4 Bậc Cấu Trúc Không Gian",
                icon: "🔬",
                summary: "Protein có 4 bậc cấu trúc không gian sắp xếp từ tuyến tính đến khối cầu phức hợp.",
                details: `
                    • <strong>Bậc 1:</strong> Trình tự sắp xếp tuyến tính các gốc amino acid liên kết bằng <em>liên kết peptide cộng hóa trị</em>.<br>
                    • <strong>Bậc 2:</strong> Chuỗi cuộn xoắn <strong>Alpha (α-helix)</strong> hoặc gấp nếp <strong>Beta (β-sheet)</strong> nhờ <em>liên kết hydrogen</em> giữa >C=O và H-N<.<br>
                    • <strong>Bậc 3:</strong> Cuộn gập 3D hoàn chỉnh thành khối cầu nhờ <em>cầu disulfide (-S-S-), tương tác kị nước, lực tĩnh điện và liên kết hydrogen</em>.<br>
                    • <strong>Bậc 4:</strong> Phức hợp gồm từ 2 chuỗi polypeptide (tiểu đơn vị) trở lên liên kết với nhau (ví dụ: Hemoglobin gồm 4 chuỗi).
                `,
                keyTakeaway: "⭐ Khi đun nóng hoặc cho axit, các liên kết yếu bậc 2, 3, 4 bị phá vỡ làm protein biến tính và mất hoạt tính sinh học."
            },
            {
                num: 6,
                title: "Tính Chất Hóa Học Trọng Tâm",
                icon: "⚗️",
                summary: "Hai phản ứng hóa học quan trọng nhất của peptide và protein trong SGK Hóa 12.",
                details: `
                    • <strong>1. Phản ứng thủy phân (Cần n - 1 phân tử H₂O):</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;Peptide + (n - 1) H₂O &rarr; n α-amino acid (xúc tác axit H⁺, kiềm OH⁻ hoặc enzyme protease).<br>
                    • <strong>2. Phản ứng màu Biuret với Cu(OH)₂ / NaOH:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• Peptide (từ tripeptide trở lên) và protein tác dụng với Cu(OH)₂ trong môi trường kiềm tạo phức chất màu <strong>tím hoa cà</strong>.<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• <strong style="color:var(--neon-magenta);">⚠️ CẢNH BÁO THI: Dipeptide KHÔNG THAM GIA phản ứng màu Biuret!</strong> Vì chỉ có 1 liên kết peptide, không đủ phối tử để tạo phức.
                `,
                keyTakeaway: "⭐ Ghi nhớ: Dipeptide: Biuret (-); Tripeptide trở lên & protein: Biuret (+) màu tím."
            },
            {
                num: 7,
                title: "Hiện Tượng Đông Tụ Protein",
                icon: "🍳",
                summary: "Dưới tác động của nhiệt độ, axit, kiềm, cồn hoặc muối kim loại nặng, protein bị đông tụ và tách ra khỏi dung dịch.",
                details: `
                    • <strong>Bản chất:</strong> Nhiệt độ hoặc hóa chất phá vỡ các liên kết hydrogen, cầu muối bậc 2 và bậc 3 khiến các chuỗi mở xoắn, lộ lõi kỵ nước ra ngoài và kết dính lại với nhau thành kết tủa.<br>
                    • <strong>Ví dụ thực tiễn quen thuộc:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• Luộc trứng: Lòng trắng trứng lỏng (albumin) đông cứng lại.<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• Nấu canh cua: Thịt cua đông tụ nổi thành từng mảng riêu cua.<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;• Vắt chanh vào sữa tươi: Axit citric làm đông tụ protein casein trong sữa.
                `,
                keyTakeaway: "⭐ Đông tụ là hiện tượng biến tính protein không thuận nghịch ứng dụng rộng rãi trong ẩm thực và đời sống."
            },
            {
                num: 8,
                title: "Chúc Mừng! Bạn Đã Nắm Vững Nền Tảng",
                icon: "🎓",
                summary: "Bạn đã hoàn thành 7 bước nền tảng và đã sẵn sàng khám phá thế giới 3D và luyện đề Hóa 12!",
                details: `
                    Bạn đã hiểu rõ:<br>
                    ✓ Amino acid và cách hình thành liên kết peptide.<br>
                    ✓ Phân biệt Dipeptide (1 liên kết peptide, Biuret âm tính) và Tripeptide (2 liên kết peptide, Biuret tím).<br>
                    ✓ Bản chất 4 bậc cấu trúc protein.<br>
                    ✓ Hiện tượng đông tụ và phản ứng thủy phân.<br><br>
                    <em>Bước tiếp theo:</em> Hãy nhấp vào các nút bên dưới để xem mô hình 3D thực tế hoặc làm thử bài tập trắc nghiệm!
                `,
                keyTakeaway: "🚀 Bây giờ hãy vận dụng kiến thức này vào Mô hình 3D và Ngân hàng bài tập!"
            }
        ];

        const step = steps[stepIndex];
        const modal = document.getElementById('globalModalBackdrop');
        const container = document.getElementById('modalContentContainer');
        if (!modal || !container) return;

        container.innerHTML = `
            <div class="beginner-modal-card">
                <!-- Stepper Progress Header -->
                <div class="bmc-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.6rem;">${step.icon}</span>
                        <div>
                            <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--neon-cyan); text-transform:uppercase;">
                                BẮT ĐẦU TỪ SỐ 0 • BƯỚC ${step.num} / ${steps.length}
                            </div>
                            <div style="font-family:var(--font-heading); font-size:1.25rem; color:#fff; font-weight:700;">
                                ${step.title}
                            </div>
                        </div>
                    </div>
                    <span class="bmc-step-badge">${step.num}/${steps.length}</span>
                </div>

                <!-- Stepper Dots -->
                <div class="bmc-dots-row">
                    ${steps.map((s, idx) => `
                        <div class="bmc-dot ${idx === stepIndex ? 'active' : idx < stepIndex ? 'done' : ''}" 
                             onclick="window.educationMgr.startBeginnerPath(${idx})"
                             title="Bước ${s.num}: ${s.title}"></div>
                    `).join('')}
                </div>

                <!-- Content Area -->
                <div class="bmc-body">
                    <div class="bmc-summary-callout">
                        ${step.summary}
                    </div>
                    <div class="bmc-details-box">
                        ${step.details}
                    </div>
                    <div class="bmc-takeaway">
                        ${step.keyTakeaway}
                    </div>
                </div>

                <!-- Footer Navigation Buttons -->
                <div class="bmc-footer">
                    <div>
                        ${stepIndex > 0 ? `
                            <button class="mini-control-btn" onclick="window.educationMgr.startBeginnerPath(${stepIndex - 1})">
                                &larr; Bước trước
                            </button>
                        ` : ''}
                    </div>
                    <div style="display:flex; gap:8px;">
                        ${stepIndex < steps.length - 1 ? `
                            <button class="btn-cyber-primary" onclick="window.educationMgr.startBeginnerPath(${stepIndex + 1})">
                                Tiếp tục: Bước ${stepIndex + 2} &rarr;
                            </button>
                        ` : `
                            <button class="btn-cyber-primary" onclick="document.getElementById('globalModalBackdrop').classList.remove('active'); window.app.switchTab('studio3d');">
                                🧬 Khám Phá 3D Ngay
                            </button>
                            <button class="btn-cyber-primary" style="background:rgba(16,185,129,0.25); border-color:#10b981;" onclick="document.getElementById('globalModalBackdrop').classList.remove('active'); window.app.switchTab('studyquiz');">
                                📝 Luyện Bài Tập Hóa 12
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        if (window.app) window.app.playSound('click');
        this.updateLearningProgress();
    }

    /* =========================================================================
       3. BỘ KIT CẤP TỐC: ÔN PROTEIN TRONG 15 PHÚT
       ========================================================================= */
    startQuick15MinReview() {
        const modal = document.getElementById('globalModalBackdrop');
        const container = document.getElementById('modalContentContainer');
        if (!modal || !container) return;

        container.innerHTML = `
            <div class="review15-modal-card">
                <div class="r15-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:1.8rem;">⚡</span>
                        <div>
                            <div style="font-family:var(--font-heading); font-size:1.3rem; color:var(--neon-amber); font-weight:700;">
                                BỘ KIT ÔN TẬP PROTEIN TRONG 15 PHÚT (CẤP TỐC THI THPT)
                            </div>
                            <div style="font-size:0.85rem; color:#94a3b8;">
                                Tóm tắt toàn bộ công thức tính toán, 4 điểm bẫy kinh điển và 5 câu hỏi phản xạ Đúng/Sai
                            </div>
                        </div>
                    </div>
                </div>

                <div class="r15-grid">
                    <!-- CỘT 1: 5 CÔNG THỨC VÀNG -->
                    <div class="r15-box">
                        <div class="r15-box-title" style="color:var(--neon-cyan);">🧮 5 CÔNG THỨC VÀNG TÍNH TOÁN PEPTIDE</div>
                        <ul class="r15-list">
                            <li><strong>1. Số liên kết peptide:</strong> Số LK = <span class="formula-badge">n − 1</span> (với <em>n</em> là số gốc α-amino acid).</li>
                            <li><strong>2. Phân tử khối peptide:</strong> <span class="formula-badge">M<sub>peptide</sub> = &Sigma; M<sub>AA</sub> − (n − 1) &times; 18</span></li>
                            <li><strong>3. Thủy phân hoàn toàn bằng nước:</strong><br>Peptide + (n − 1) H₂O <span style="color:var(--neon-cyan);">&rarr;</span> n α-amino acid <em>(xúc tác H⁺ / OH⁻, t°)</em></li>
                            <li><strong>4. Tác dụng với NaOH:</strong><br>Peptide + n NaOH <span style="color:var(--neon-cyan);">&rarr;</span> Hỗn hợp muối + 1 H₂O <em>(với amino acid có 1 nhóm −COOH)</em></li>
                            <li><strong>5. Tác dụng với HCl:</strong><br>Peptide + (n − 1) H₂O + n HCl <span style="color:var(--neon-cyan);">&rarr;</span> Muối amoni clorua</li>
                        </ul>
                    </div>

                    <!-- CỘT 2: 4 ĐIỂM BẪY THƯỜNG GẶP -->
                    <div class="r15-box">
                        <div class="r15-box-title" style="color:var(--neon-magenta);">⚠️ 4 ĐIỂM BẪY ĐỀ THI HAY GÀI BẪY</div>
                        <ul class="r15-list">
                            <li><strong style="color:var(--neon-magenta);">BẪY 1:</strong> <strong>Dipeptide KHÔNG THAM GIA phản ứng màu Biuret!</strong> Phản ứng màu Biuret chỉ xảy ra từ tripeptide trở lên và protein (cần ≥ 2 liên kết peptide).</li>
                            <li><strong style="color:var(--neon-magenta);">BẪY 2:</strong> <strong>Glycine không có đồng phân quang học</strong> vì nguyên tử C<sub>α</sub> liên kết với 2 nguyên tử H giống nhau (không có carbon bất đối C*).</li>
                            <li><strong style="color:var(--neon-magenta);">BẪY 3:</strong> <strong>Protein hình sợi KHÔNG tan trong nước</strong> (tóc, móng, sừng, cơ), còn protein hình cầu (lòng trắng trứng, hemoglobin) tan tạo dung dịch keo.</li>
                            <li><strong style="color:var(--neon-magenta);">BẪY 4:</strong> Liên kết giữa nhóm −COOH và −NH₂ ở vị trí β hay γ chỉ là <strong>liên kết amide</strong>, KHÔNG được gọi là liên kết peptide!</li>
                        </ul>
                    </div>
                </div>

                <!-- 5 CÂU HỎI PHẢN XẠ NHANH ĐÚNG/SAI -->
                <div class="r15-flash-quiz">
                    <div style="font-family:var(--font-heading); font-size:1rem; color:#fff; margin-bottom:8px;">
                        🎯 5 CÂU PHẢN XẠ NHANH TRƯỚC GIỜ VÀO PHÒNG THI (BẤM ĐỂ KIỂM TRA):
                    </div>
                    <div class="r15-quiz-item" onclick="this.classList.toggle('revealed')">
                        <div class="r15-q-text">1. Cho lòng trắng trứng tác dụng với Cu(OH)₂ trong NaOH xuất hiện màu tím hoa cà.</div>
                        <div class="r15-ans-badge">👉 ĐÚNG (Protein có phản ứng màu Biuret)</div>
                    </div>
                    <div class="r15-quiz-item" onclick="this.classList.toggle('revealed')">
                        <div class="r15-q-text">2. Phân tử Gly–Ala có phản ứng màu Biuret cho màu tím đặc trưng.</div>
                        <div class="r15-ans-badge">👉 SAI (Gly-Ala là dipeptide chỉ có 1 liên kết peptide &rarr; ÂM TÍNH)</div>
                    </div>
                    <div class="r15-quiz-item" onclick="this.classList.toggle('revealed')">
                        <div class="r15-q-text">3. Khi luộc trứng gà, protein albumin bị đông tụ do nhiệt độ cao.</div>
                        <div class="r15-ans-badge">👉 ĐÚNG (Hiện tượng đông tụ protein bởi nhiệt)</div>
                    </div>
                    <div class="r15-quiz-item" onclick="this.classList.toggle('revealed')">
                        <div class="r15-q-text">4. Thủy phân hoàn toàn 1 mol tripeptide Gly–Ala–Val cần đúng 3 mol H₂O.</div>
                        <div class="r15-ans-badge">👉 SAI (Tripeptide có 2 liên kết peptide &rarr; chỉ cần 2 mol H₂O)</div>
                    </div>
                    <div class="r15-quiz-item" onclick="this.classList.toggle('revealed')">
                        <div class="r15-q-text">5. Cấu trúc bậc 2 của protein được duy trì chủ yếu nhờ liên kết hydrogen.</div>
                        <div class="r15-ans-badge">👉 ĐÚNG (Liên kết hydrogen giữa C=O và H-N tạo xoắn alpha & phiến beta)</div>
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:1.25rem;">
                    <button class="mini-control-btn" onclick="document.getElementById('globalModalBackdrop').classList.remove('active');">Đóng</button>
                    <button class="btn-cyber-primary" onclick="document.getElementById('globalModalBackdrop').classList.remove('active'); window.educationMgr.startRandomQuiz();">
                        🎲 Làm Bài Kiểm Tra Nhanh 10 Câu
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        if (window.app) window.app.playSound('beep');
    }

    /* =========================================================================
       4. CHẾ ĐỘ KIỂM TRA NHANH 10 CÂU (RANDOM QUIZ & DIAGNOSIS)
       ========================================================================= */
    startRandomQuiz() {
        const allQuestions = [];
        // Tập hợp câu hỏi từ 5 chủ đề ôn luyện
        if (window.STUDY_TOPICS_DATA) {
            window.STUDY_TOPICS_DATA.forEach(topic => {
                if (topic.mcqPractice) {
                    topic.mcqPractice.forEach(q => {
                        allQuestions.push({ ...q, topicName: topic.name, topicId: topic.id });
                    });
                }
            });
        }

        // Trộn ngẫu nhiên và lấy 10 câu
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
        this.randomQuizQuestions = shuffled;
        this.randomQuizAnswers = {};

        const modal = document.getElementById('globalModalBackdrop');
        const container = document.getElementById('modalContentContainer');
        if (!modal || !container) return;

        container.innerHTML = `
            <div class="random-quiz-card">
                <div class="rq-header">
                    <div>
                        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--neon-cyan);">KIỂM TRA ĐÁNH GIÁ NĂNG LỰC • ĐỀ NGẪU NHIÊN</div>
                        <div style="font-family:var(--font-heading); font-size:1.25rem; color:#fff; font-weight:700;">
                            🎲 BÀI KIỂM TRA NHANH 10 CÂU PROTEIN &amp; PEPTIDE
                        </div>
                    </div>
                    <div id="rqTimerBadge" style="font-family:var(--font-mono); color:var(--neon-amber); font-weight:bold; font-size:1rem;">10:00</div>
                </div>

                <div class="rq-questions-container" id="rqQuestionsList">
                    ${shuffled.map((q, idx) => `
                        <div class="rq-item" id="rqItem-${idx}">
                            <div class="rq-item-topic">[${q.topicName}]</div>
                            <div class="rq-item-stem"><strong>Câu ${idx + 1}:</strong> ${q.stem}</div>
                            <div class="rq-opts-grid">
                                ${q.options.map((opt, oIdx) => `
                                    <button class="rq-opt-btn" id="rqBtn-${idx}-${oIdx}" onclick="window.educationMgr.selectRandomQuizAnswer(${idx}, ${oIdx})">
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="rq-footer">
                    <span id="rqAnsweredCount" style="font-size:0.85rem; color:#94a3b8;">Đã trả lời: 0 / 10 câu</span>
                    <button class="btn-cyber-primary" id="btnSubmitRandomQuiz" onclick="window.educationMgr.submitRandomQuiz()">
                        Nộp Bài &amp; Xem Phân Tích Điểm
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        if (window.app) window.app.playSound('scan');
    }

    selectRandomQuizAnswer(qIdx, oIdx) {
        this.randomQuizAnswers[qIdx] = oIdx;

        // Cập nhật UI nút đã chọn
        const container = document.getElementById(`rqItem-${qIdx}`);
        if (container) {
            container.querySelectorAll('.rq-opt-btn').forEach((btn, idx) => {
                btn.classList.toggle('selected', idx === oIdx);
            });
        }

        const count = Object.keys(this.randomQuizAnswers).length;
        const countEl = document.getElementById('rqAnsweredCount');
        if (countEl) countEl.textContent = `Đã trả lời: ${count} / 10 câu`;

        if (window.app) window.app.playSound('click');
    }

    submitRandomQuiz() {
        const questions = this.randomQuizQuestions || [];
        let score = 0;
        const strengths = new Set();
        const weaknesses = new Set();

        questions.forEach((q, idx) => {
            const userAns = this.randomQuizAnswers[idx];
            if (userAns === q.correct) {
                score++;
                strengths.add(q.topicName);
            } else {
                weaknesses.add(q.topicName);
            }
        });

        // Xóa các điểm mạnh nếu chủ đề đó cũng có câu sai
        weaknesses.forEach(w => strengths.delete(w));

        const container = document.getElementById('modalContentContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="quiz-result-report">
                <div style="text-align:center; margin-bottom:1.25rem;">
                    <div style="font-size:3rem; margin-bottom:4px;">${score >= 8 ? '🏆' : score >= 5 ? '🎯' : '💪'}</div>
                    <div style="font-family:var(--font-heading); font-size:1.4rem; color:#fff; font-weight:700;">
                        KẾT QUẢ KIỂM TRA PROTEIN: ${score} / 10 ĐIỂM
                    </div>
                    <div style="font-size:0.9rem; color:#94a3b8; margin-top:4px;">
                        ${score >= 8 ? 'Xuất sắc! Bạn đã nắm rất vững kiến thức Hóa học 12 về Protein.' : score >= 5 ? 'Khá tốt! Bạn đã nắm được các khái niệm cơ bản nhưng cần củng cố thêm phần tính toán và bẫy đề thi.' : 'Cần cố gắng thêm! Hãy xem lại phần lí thuyết cơ bản và các điểm bẫy trước khi luyện đề.'}
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
                    <!-- ĐIỂM MẠNH -->
                    <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:1rem;">
                        <div style="color:var(--neon-emerald); font-weight:bold; font-size:0.9rem; margin-bottom:6px;">
                            ✓ THẾ MẠNH CỦA BẠN:
                        </div>
                        <ul style="padding-left:1.2rem; font-size:0.85rem; color:#cbd5e1; margin:0;">
                            ${strengths.size > 0 ? Array.from(strengths).map(s => `<li>${s}</li>`).join('') : '<li>Hãy tiếp tục luyện tập để xây dựng thế mạnh!</li>'}
                        </ul>
                    </div>

                    <!-- PHẦN CẦN ÔN LẠI -->
                    <div style="background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); border-radius:10px; padding:1rem;">
                        <div style="color:var(--neon-magenta); font-weight:bold; font-size:0.9rem; margin-bottom:6px;">
                            ⚠ CẦN ÔN TẬP THÊM:
                        </div>
                        <ul style="padding-left:1.2rem; font-size:0.85rem; color:#cbd5e1; margin:0;">
                            ${weaknesses.size > 0 ? Array.from(weaknesses).map(w => `<li>${w}</li>`).join('') : '<li>Không có! Bạn đã làm đúng toàn bộ các dạng bài!</li>'}
                        </ul>
                    </div>
                </div>

                <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
                    <button class="btn-cyber-primary" onclick="window.educationMgr.startRandomQuiz()">
                        🔄 Làm Lại Đề Khác
                    </button>
                    <button class="btn-cyber-primary" style="background:rgba(0,242,254,0.25); border-color:#00f2fe;" onclick="document.getElementById('globalModalBackdrop').classList.remove('active'); window.app.switchTab('studyquiz');">
                        📚 Ôn Luyện Chuyên Đề
                    </button>
                    <button class="mini-control-btn" onclick="document.getElementById('globalModalBackdrop').classList.remove('active');">
                        Đóng
                    </button>
                </div>
            </div>
        `;

        if (window.app) window.app.playSound(score >= 5 ? 'success' : 'wrong');
        this.updateLearningProgress(score);
    }

    /* =========================================================================
       5. QUẢN LÝ TIẾN ĐỘ HỌC TẬP (LOCALSTORAGE PROGRESS TRACKER)
       ========================================================================= */
    updateLearningProgress(newQuizScore = null) {
        let prog = { quizzesAnswered: 4, modelsViewed: 2, labsCompleted: 1 };
        try {
            const raw = localStorage.getItem('proteinexus_progress');
            if (raw) prog = JSON.parse(raw);
        } catch (e) {}

        if (newQuizScore !== null) {
            prog.quizzesAnswered = Math.min(40, (prog.quizzesAnswered || 0) + 10);
        }

        const totalPoints = (prog.quizzesAnswered || 4) * 1.5 + (prog.modelsViewed || 2) * 3 + (prog.labsCompleted || 1) * 7.5;
        const percent = Math.min(100, Math.round(totalPoints));

        try {
            localStorage.setItem('proteinexus_progress', JSON.stringify(prog));
        } catch (e) {}

        const percentEl = document.getElementById('learningProgressPercent');
        const fillEl = document.getElementById('learningProgressFill');
        const statQ = document.getElementById('lpStatQuizzes');
        const statM = document.getElementById('lpStatModels');
        const statL = document.getElementById('lpStatLabs');

        if (percentEl) percentEl.textContent = `${percent}% Hoàn Thành`;
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (statQ) statQ.textContent = `✓ Câu hỏi đã luyện: ${prog.quizzesAnswered || 4}/40`;
        if (statM) statM.textContent = `✓ Mô hình 3D đã khám phá: ${prog.modelsViewed || 2}/10`;
        if (statL) statL.textContent = `✓ Thí nghiệm ảo đã thực hành: ${prog.labsCompleted || 1}/4`;
    }

    /* =========================================================================
       6. TRẮC NGHIỆM TƯƠNG TÁC THUYẾT TRÌNH LỚP 12H (MOBILE & PC)
       ========================================================================= */
    renderPresentationInteractiveQuestions() {
        const container = document.getElementById('presentationInteractiveContainer');
        if (!container || !window.PRESENTATION_INTERACTIVE_QUESTIONS) return;

        if (!this.presentationState) {
            this.presentationState = {
                userAnswers: {},
                score: 0,
                correctCount: 0
            };
        }

        const questions = window.PRESENTATION_INTERACTIVE_QUESTIONS;
        const total = questions.length;
        const state = this.presentationState;

        let answeredCount = Object.keys(state.userAnswers).length;
        let correctCount = 0;
        questions.forEach(q => {
            if (state.userAnswers[q.id] === q.answer) correctCount++;
        });
        state.correctCount = correctCount;
        state.score = correctCount * 10;

        let html = `
            <div class="presentation-quiz-wrapper">
                <div class="pquiz-header-card">
                    <div class="pquiz-header-info">
                        <div class="pquiz-badge">📱 TƯƠNG TÁC TRỰC TIẾP · CHUẨN SGK HÓA HỌC 12</div>
                        <h2 class="pquiz-title">🎯 Trắc Nghiệm Tương Tác Thuyết Trình Protein 12</h2>
                        <p class="pquiz-desc">Học sinh dùng điện thoại chọn nhanh đáp án – Nhóm thuyết trình phân tích lời giải chi tiết giúp ghi nhớ lí thuyết ngay tại lớp!</p>
                    </div>
                    <div class="pquiz-stats-group">
                        <div class="pquiz-stat-pill">
                            <span class="pquiz-stat-label">Tiến độ:</span>
                            <span class="pquiz-stat-val" id="pqProgressText">${answeredCount}/${total} câu</span>
                        </div>
                        <div class="pquiz-stat-pill highlight">
                            <span class="pquiz-stat-label">Điểm số:</span>
                            <span class="pquiz-stat-val" id="pqScoreText">${state.score} / ${total * 10}</span>
                        </div>
                        <button class="pquiz-btn-reset" onclick="window.educationMgr.resetPresentationQuestions()" title="Làm lại tất cả câu hỏi">
                            🔄 Làm lại
                        </button>
                    </div>
                </div>

                ${answeredCount === total ? `
                    <div class="pquiz-complete-card">
                        <div class="pqc-icon">🏆</div>
                        <div>
                            <h3 class="pqc-title">XUẤT SẮC! BẠN ĐÃ HOÀN THÀNH TOÀN BỘ CÂU HỎI TƯƠNG TÁC</h3>
                            <p class="pqc-sub">Bạn đạt được <strong>${state.score} / ${total * 10} điểm</strong> (${correctCount}/${total} câu đúng). Kiến thức trọng tâm Protein Hóa 12 của bạn đã được củng cố vững chắc!</p>
                        </div>
                    </div>
                ` : ''}

                <div class="pquiz-cards-list">
        `;

        questions.forEach((q, idx) => {
            const userAns = state.userAnswers[q.id];
            const isAnswered = userAns !== undefined;
            const isCorrect = userAns === q.answer;

            let cardStatusClass = '';
            if (isAnswered) {
                cardStatusClass = isCorrect ? 'answered-correct' : 'answered-incorrect';
            }

            html += `
                <div class="pquiz-card ${cardStatusClass}" id="pqCard-${q.id}">
                    <div class="pq-card-top">
                        <div class="pq-badge-row">
                            <span class="pq-type-badge">${q.badge}</span>
                            <span class="pq-topic-tag">${q.topic}</span>
                        </div>
                        <span class="pq-num-pill">Câu ${idx + 1} / ${total}</span>
                    </div>

                    <div class="pq-prompt">
                        ${q.q}
                    </div>

                    <div class="pq-options-grid">
            `;

            q.options.forEach((optText, optIdx) => {
                let optStateClass = '';
                let markIcon = '';
                if (isAnswered) {
                    if (optIdx === q.answer) {
                        optStateClass = 'opt-correct';
                        markIcon = ' ✓';
                    } else if (optIdx === userAns) {
                        optStateClass = 'opt-wrong';
                        markIcon = ' ✗';
                    } else {
                        optStateClass = 'opt-dimmed';
                    }
                }

                html += `
                    <button class="pq-opt-btn ${optStateClass}" 
                            ${isAnswered ? 'disabled' : ''} 
                            onclick="window.educationMgr.answerPresentationQuestion('${q.id}', ${optIdx})">
                        <span class="pq-opt-letter">${['A', 'B', 'C', 'D'][optIdx]}</span>
                        <span class="pq-opt-text">${optText}${markIcon}</span>
                    </button>
                `;
            });

            html += `
                    </div>
            `;

            if (isAnswered) {
                html += `
                    <div class="pq-feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
                        <div class="fb-header">
                            <span class="fb-icon">${isCorrect ? '✅' : '❌'}</span>
                            <strong>${isCorrect ? 'CHÍNH XÁC!' : 'CHƯA ĐÚNG! Đáp án đúng là ' + ['A', 'B', 'C', 'D'][q.answer]}</strong>
                        </div>
                        <div class="fb-explanation">
                            <strong>💡 Lời giải chi tiết dành cho buổi thuyết trình:</strong>
                            <p>${q.explain}</p>
                        </div>
                    </div>
                `;
            }

            html += `
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    answerPresentationQuestion(questionId, selectedIndex) {
        if (!this.presentationState) this.presentationState = { userAnswers: {}, score: 0, correctCount: 0 };
        if (this.presentationState.userAnswers[questionId] !== undefined) return;

        this.presentationState.userAnswers[questionId] = selectedIndex;

        const q = (window.PRESENTATION_INTERACTIVE_QUESTIONS || []).find(item => item.id === questionId);
        const isCorrect = q && q.answer === selectedIndex;

        if (window.app) {
            window.app.playSound(isCorrect ? 'success' : 'warning');
        }

        this.renderPresentationInteractiveQuestions();
    }

    resetPresentationQuestions() {
        this.presentationState = { userAnswers: {}, score: 0, correctCount: 0 };
        if (window.app) window.app.playSound('click');
        this.renderPresentationInteractiveQuestions();
    }

    /* =========================================================================
       7. ĐỒ THỊ ĐỘNG SỰ ĐÔNG TỤ PROTEIN THEO THỜI GIAN & CHẤT SỬ DỤNG
       Mô phỏng động học biến tính & đông tụ protein chuẩn SGK Hóa 12
       ========================================================================= */
    initCoagulationDynamicChart() {
        const container = document.getElementById('coagulationDynamicChartContainer');
        if (!container) return;

        if (!this.coagChartState) {
            this.coagChartState = {
                currentReagent: 'temp', // 'temp', 'acid', 'alcohol', 'metal', 'salting', 'compare'
                targetTemp: 80, // °C (30 to 100)
                acidConc: 10, // % (1 to 20)
                alcoholDegree: 70, // ° (30 to 96)
                metalDrops: 5, // drops (1 to 10)
                saltGrams: 10, // g (2 to 25)
                isRunning: false,
                simTime: 0, // 0 to 30s
                maxTime: 30,
                speedMultiplier: 1,
                timerId: null,
                isShaking: false,
                isHeating: false,
                isDiluted: false
            };
        }

        this.renderCoagulationChartLayout(container);
        this.updateCoagulationCurve();
    }

    renderCoagulationChartLayout(container) {
        const state = this.coagChartState;
        container.innerHTML = `
            <div class="coag-dyn-container">
                <div class="coag-dyn-header">
                    <div>
                        <div class="coag-badge">📈 ĐỒ THỊ ĐỘNG HỌC THỜI GIAN THỰC · SGK HÓA 12</div>
                        <h2 class="coag-title">Diễn Biến Sự Đông Tụ Protein Theo Thời Gian &amp; Tác Nhân</h2>
                        <p class="coag-desc">Quan sát trực tiếp sự thay đổi mức độ đục (đông tụ) của lòng trắng trứng khi đun nóng hoặc thêm axit, cồn, muối kim loại và muối ăn. Có thể tùy chỉnh nồng độ, nhiệt độ và thực hiện thao tác ống nghiệm trực tiếp.</p>
                    </div>
                </div>

                <!-- Thanh chọn tác nhân (Chất sử dụng) -->
                <div class="coag-reagents-bar">
                    <button class="coag-reagent-btn ${state.currentReagent === 'temp' ? 'active' : ''}" 
                            onclick="window.educationMgr.setCoagulationReagent('temp')">
                        🔥 1. Nhiệt Độ (Đun Nóng)
                    </button>
                    <button class="coag-reagent-btn ${state.currentReagent === 'acid' ? 'active' : ''}" 
                            onclick="window.educationMgr.setCoagulationReagent('acid')">
                        🍋 2. Axit Mạnh (HCl / HNO₃)
                    </button>
                    <button class="coag-reagent-btn ${state.currentReagent === 'alcohol' ? 'active' : ''}" 
                            onclick="window.educationMgr.setCoagulationReagent('alcohol')">
                        🍷 3. Cồn Ethanol 70°
                    </button>
                    <button class="coag-reagent-btn ${state.currentReagent === 'metal' ? 'active' : ''}" 
                            onclick="window.educationMgr.setCoagulationReagent('metal')">
                        🧪 4. Muối Kim Loại (CuSO₄)
                    </button>
                    <button class="coag-reagent-btn ${state.currentReagent === 'salting' ? 'active' : ''}" 
                            onclick="window.educationMgr.setCoagulationReagent('salting')">
                        🧂 5. Muối NaCl (Diêm Kết)
                    </button>
                    <button class="coag-reagent-btn highlight ${state.currentReagent === 'compare' ? 'active' : ''}" 
                            onclick="window.educationMgr.setCoagulationReagent('compare')">
                        📊 6. So Sánh Đa Tác Nhân
                    </button>
                </div>

                <!-- Bố cục chính: Đồ thị SVG bên trái, Ống nghiệm & Chỉ số bên phải -->
                <div class="coag-main-grid">
                    <!-- Khung Đồ Thị SVG Động -->
                    <div class="coag-chart-card">
                        <div class="coag-chart-topbar">
                            <div class="coag-live-readouts">
                                <span class="readout-item">
                                    Thời gian: <strong id="coagDynTimeText">0.0s</strong>
                                </span>
                                <span class="readout-item highlight-cyan">
                                    Mức độ đông tụ: <strong id="coagDynPctText">0%</strong>
                                </span>
                                <span class="readout-item highlight-amber" id="coagDynConditionText">
                                    Nhiệt độ hiện tại: 25°C (Đích: ${state.targetTemp}°C)
                                </span>
                            </div>
                            <div class="coag-ctrl-buttons">
                                <button class="btn-coag-ctrl primary" id="btnCoagPlay" onclick="window.educationMgr.toggleCoagulationSimulation()">
                                    ${state.isRunning ? '⏸ Tạm dừng' : '▶ Chạy mô phỏng động'}
                                </button>
                                <button class="btn-coag-ctrl" onclick="window.educationMgr.resetCoagulationSimulation()">
                                    🔄 Đặt lại
                                </button>
                                <select class="coag-speed-select" onchange="window.educationMgr.setCoagulationSpeed(this.value)">
                                    <option value="1">Tốc độ 1x</option>
                                    <option value="2">Tốc độ 2x</option>
                                    <option value="4">Tốc độ 4x</option>
                                </select>
                            </div>
                        </div>

                        <!-- 1. Slider điều chỉnh Nhiệt độ -->
                        <div class="coag-slider-row" id="coagTempSliderRow" style="${state.currentReagent === 'temp' ? '' : 'display:none;'}">
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                                <label for="coagTempSlider">Nhiệt độ đun nóng mong muốn:</label>
                                <span class="coag-slider-val" id="coagTempSliderVal">${state.targetTemp}°C</span>
                            </div>
                            <input type="range" id="coagTempSlider" min="30" max="100" step="5" value="${state.targetTemp}" 
                                   oninput="window.educationMgr.setCoagulationTemperature(this.value)">
                            <div class="coag-chips-wrap">
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationTemperature(37)">🌡️ 37°C Thân nhiệt</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationTemperature(65)">🔥 65°C Bắt đầu đông tụ</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationTemperature(80)">🍲 80°C Canh cua</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationTemperature(100)">⚡ 100°C Luộc chín</button>
                            </div>
                        </div>

                        <!-- 2. Slider điều chỉnh Axit -->
                        <div class="coag-slider-row" id="coagAcidSliderRow" style="${state.currentReagent === 'acid' ? '' : 'display:none;'}">
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                                <label for="coagAcidSlider">Nồng độ dung dịch Axit HCl / HNO₃:</label>
                                <span class="coag-slider-val" id="coagAcidSliderVal">${state.acidConc}%</span>
                            </div>
                            <input type="range" id="coagAcidSlider" min="1" max="20" step="1" value="${state.acidConc}" 
                                   oninput="window.educationMgr.setCoagulationAcid(this.value)">
                            <div class="coag-chips-wrap">
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationAcid(3)">🍋 3% Axit nhẹ (Giấm ăn)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationAcid(10)">🧪 10% HCl chuẩn (SGK)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationAcid(20)">💥 20% Axit đặc (pH &lt; 1)</button>
                            </div>
                        </div>

                        <!-- 3. Slider điều chỉnh Cồn -->
                        <div class="coag-slider-row" id="coagAlcoholSliderRow" style="${state.currentReagent === 'alcohol' ? '' : 'display:none;'}">
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                                <label for="coagAlcoholSlider">Độ cồn Ethanol:</label>
                                <span class="coag-slider-val" id="coagAlcoholSliderVal">${state.alcoholDegree}°</span>
                            </div>
                            <input type="range" id="coagAlcoholSlider" min="30" max="96" step="2" value="${state.alcoholDegree}" 
                                   oninput="window.educationMgr.setCoagulationAlcohol(this.value)">
                            <div class="coag-chips-wrap">
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationAlcohol(40)">🍷 Cồn 40° (Rượu vang)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationAlcohol(70)">🏥 Cồn 70° (Sát khuẩn tối ưu)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationAlcohol(96)">🔥 Cồn 96° (Tuyệt đối)</button>
                            </div>
                        </div>

                        <!-- 4. Slider điều chỉnh Muối kim loại nặng -->
                        <div class="coag-slider-row" id="coagMetalSliderRow" style="${state.currentReagent === 'metal' ? '' : 'display:none;'}">
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                                <label for="coagMetalSlider">Số giọt muối kim loại nặng CuSO₄ (hoặc Pb²⁺):</label>
                                <span class="coag-slider-val" id="coagMetalSliderVal">${state.metalDrops} giọt</span>
                            </div>
                            <input type="range" id="coagMetalSlider" min="1" max="10" step="1" value="${state.metalDrops}" 
                                   oninput="window.educationMgr.setCoagulationMetal(this.value)">
                            <div class="coag-chips-wrap">
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationMetal(2)">🧪 2 giọt (Vẩn đục nhẹ)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationMetal(5)">💙 5 giọt (Đông tụ xanh lam)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationMetal(10)">⚠️ 10 giọt (Kết tủa vón cục)</button>
                            </div>
                        </div>

                        <!-- 5. Slider điều chỉnh Muối NaCl -->
                        <div class="coag-slider-row" id="coagSaltingSliderRow" style="${state.currentReagent === 'salting' ? '' : 'display:none;'}">
                            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                                <label for="coagSaltingSlider">Khối lượng muối ăn NaCl (Diêm kết):</label>
                                <span class="coag-slider-val" id="coagSaltingSliderVal">${state.saltGrams}g</span>
                            </div>
                            <input type="range" id="coagSaltingSlider" min="2" max="25" step="1" value="${state.saltGrams}" 
                                   oninput="window.educationMgr.setCoagulationSalt(this.value)">
                            <div class="coag-chips-wrap">
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationSalt(5)">🧂 5g NaCl (Diêm kết nhẹ)</button>
                                <button class="btn-coag-chip" onclick="window.educationMgr.setCoagulationSalt(15)">🧂 15g NaCl (Bão hòa)</button>
                                <button class="btn-coag-chip highlight-water" onclick="window.educationMgr.diluteSaltingWithWater()">💧 Thêm nước cất: Tan lại (Thuận nghịch)</button>
                            </div>
                        </div>

                        <!-- Đồ thị SVG thời gian thực -->
                        <div class="coag-svg-wrapper">
                            <svg id="coagMainSvg" viewBox="0 0 650 320" class="coag-chart-svg" role="img" aria-label="Biểu đồ sự đông tụ protein theo thời gian">
                                <defs>
                                    <linearGradient id="coagGradCyan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.38"/>
                                        <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.0"/>
                                    </linearGradient>
                                    <linearGradient id="coagGradAmber" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.38"/>
                                        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0"/>
                                    </linearGradient>
                                </defs>
                                <g class="coag-grid-lines" id="coagGridGroup"></g>
                                <!-- Đường lý thuyết tham chiếu toàn bộ 0-30s (Nét đứt mờ - KHÔNG BAO GIỜ BỊ RỖNG!) -->
                                <path id="coagRefPath" fill="none" stroke="rgba(0, 242, 254, 0.4)" stroke-width="2" stroke-dasharray="6,4" d=""/>
                                <!-- Area fill -->
                                <path id="coagAreaPath" fill="url(#coagGradCyan)" d=""/>
                                <!-- Các đường so sánh (nếu compare mode) -->
                                <path id="coagCurveCompare1" class="coag-cmp-line cmp-heat" fill="none" stroke="#00f2fe" stroke-width="2.5" d=""/>
                                <path id="coagCurveCompare2" class="coag-cmp-line cmp-acid" fill="none" stroke="#f59e0b" stroke-width="2.5" d=""/>
                                <path id="coagCurveCompare3" class="coag-cmp-line cmp-alcohol" fill="none" stroke="#c084fc" stroke-width="2.5" d=""/>
                                <path id="coagCurveCompare4" class="coag-cmp-line cmp-metal" fill="none" stroke="#10b981" stroke-width="2.5" d=""/>
                                <path id="coagCurveCompare5" class="coag-cmp-line cmp-salting" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4,3" d=""/>
                                <!-- Đường chính chuyển động -->
                                <path id="coagMainPath" fill="none" stroke="#00f2fe" stroke-width="3.5" d=""/>
                                <!-- Điểm phát sáng chạy dọc theo đường cong -->
                                <circle id="coagTracerDot" r="6.5" fill="#00f2fe" stroke="#ffffff" stroke-width="2.5" cx="55" cy="275"/>
                                <text id="coagTracerLabel" x="55" y="260" fill="#00f2fe" font-size="12" font-weight="bold" font-family="JetBrains Mono, monospace">0%</text>
                            </svg>
                        </div>

                        <!-- Chú thích đường cong khi so sánh -->
                        <div class="coag-legend-row" id="coagLegendRow" style="${state.currentReagent === 'compare' ? 'display:flex;' : 'display:none;'}">
                            <span class="legend-item" style="color:#00f2fe;">— Nhiệt độ 80°C</span>
                            <span class="legend-item" style="color:#f59e0b;">— Axit HCl 10%</span>
                            <span class="legend-item" style="color:#c084fc;">— Cồn Ethanol 70°</span>
                            <span class="legend-item" style="color:#10b981;">— Muối CuSO₄</span>
                            <span class="legend-item" style="color:#38bdf8;">┄ Muối NaCl (Thuận nghịch)</span>
                        </div>
                    </div>

                    <!-- Ống Nghiệm Ảo & Cơ Chế Phân Tử -->
                    <div class="coag-tube-card">
                        <h3 class="tube-card-title">🧪 Ống Nghiệm Ảo &amp; Thao Tác Thực Nghiệm</h3>

                        <div class="virtual-tube-wrapper" id="virtualTubeWrapper">
                            <svg viewBox="0 0 140 280" class="virtual-tube-svg" id="tubeMainSvg">
                                <defs>
                                    <radialGradient id="flameInnerGrad" cx="50%" cy="80%" r="60%">
                                        <stop offset="0%" stop-color="#ffffff"/>
                                        <stop offset="35%" stop-color="#fef08a"/>
                                        <stop offset="70%" stop-color="#f97316"/>
                                        <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
                                    </radialGradient>
                                    <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="3" result="blur"/>
                                        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                    </filter>
                                </defs>

                                <!-- 1. Ống nhỏ giọt (Pipette) phía trên miệng ống -->
                                <g id="dropperGroup" transform="translate(0, -6)" style="opacity: 0.95;">
                                    <path d="M 68 8 L 72 8 L 72 32 L 70 38 L 68 32 Z" fill="#94a3b8" stroke="#38bdf8" stroke-width="1.2"/>
                                    <rect x="66" y="2" width="8" height="7" rx="3" fill="#f43f5e"/>
                                    <!-- Giọt dung dịch đang rơi -->
                                    <circle id="animatedDroplet" cx="70" cy="42" r="3" fill="#00f2fe" opacity="0"/>
                                </g>

                                <!-- 2. Thân ống nghiệm thủy tinh -->
                                <rect x="45" y="40" width="50" height="155" rx="0" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>
                                <path d="M 45 195 A 25 25 0 0 0 95 195 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>
                                <rect x="40" y="36" width="60" height="6" rx="3" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>

                                <!-- 3. Chất lỏng bên trong ống nghiệm -->
                                <path id="tubeLiquidPath" d="M 46 95 L 94 95 L 94 195 A 24 24 0 0 1 46 195 Z" fill="rgba(240, 248, 255, 0.18)" style="transition: fill 0.3s ease;"/>
                                <ellipse id="tubeMeniscus" cx="70" cy="95" rx="24" ry="3" fill="rgba(255,255,255,0.35)"/>

                                <!-- 4. Màng đông tụ / váng keo trên mặt -->
                                <rect id="tubeCoagGel" x="46" y="95" width="48" height="0" rx="3" fill="rgba(248, 250, 252, 0.92)" stroke="#cbd5e1" stroke-width="1" style="transition: height 0.3s ease, opacity 0.3s ease;"/>

                                <!-- 5. Các hạt bông lơ lửng -->
                                <circle id="tubeParticle1" cx="58" cy="130" r="4" fill="#ffffff" opacity="0"/>
                                <circle id="tubeParticle2" cx="80" cy="148" r="5" fill="#ffffff" opacity="0"/>
                                <circle id="tubeParticle3" cx="66" cy="168" r="4.5" fill="#ffffff" opacity="0"/>
                                <circle id="tubeParticle4" cx="75" cy="184" r="3.5" fill="#ffffff" opacity="0"/>
                                <circle id="tubeParticle5" cx="54" cy="155" r="3" fill="#ffffff" opacity="0"/>

                                <!-- Đường phản chiếu thủy tinh -->
                                <path d="M 48 50 L 48 185 A 22 22 0 0 0 58 202" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>

                                <!-- 6. Đèn cồn đun nóng bên dưới đáy ống nghiệm -->
                                <g id="burnerGroup" transform="translate(0, 195)" style="opacity: 0.95;">
                                    <rect x="52" y="44" width="36" height="24" rx="4" fill="rgba(30, 58, 138, 0.7)" stroke="#38bdf8" stroke-width="1.5"/>
                                    <rect x="62" y="38" width="16" height="6" fill="#64748b" stroke="#94a3b8" stroke-width="1"/>
                                    <line x1="70" y1="38" x2="70" y2="32" stroke="#e2e8f0" stroke-width="3"/>
                                    <g id="burnerFlame" class="coag-flame" style="${state.currentReagent === 'temp' ? '' : 'display: none;'}">
                                        <path d="M 70 10 C 60 20, 62 32, 70 32 C 78 32, 80 20, 70 10 Z" fill="url(#flameInnerGrad)" filter="url(#flameGlow)"/>
                                        <path d="M 70 16 C 65 22, 66 30, 70 30 C 74 30, 75 22, 70 16 Z" fill="#ffffff"/>
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <!-- Các nút tương tác ống nghiệm ảo -->
                        <div class="coag-tube-actions">
                            <button class="btn-tube-action" onclick="window.educationMgr.triggerTubeAction('drop')">
                                💧 Nhỏ giọt hóa chất
                            </button>
                            <button class="btn-tube-action" onclick="window.educationMgr.triggerTubeAction('shake')">
                                🌀 Lắc ống nghiệm
                            </button>
                            <button class="btn-tube-action" id="btnTubeHeat" onclick="window.educationMgr.triggerTubeAction('heat')">
                                ${state.isHeating ? '❄️ Tắt đèn cồn' : '🔥 Bật đèn cồn'}
                            </button>
                        </div>

                        <div class="tube-status-box">
                            <div class="status-badge" id="tubePhaseBadge">Giai đoạn 1: Dung dịch keo tự nhiên</div>
                            <p class="tube-desc-text" id="tubeMechanismText">
                                Protein đang ở trạng thái cuộn gập bậc 3/4 ổn định. Vỏ hydrat hóa bao quanh giúp phân tử phân tán đều trong nước, dung dịch trong suốt.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Thẻ giải thích chi tiết cơ chế hóa học dành cho thuyết trình -->
                <div class="coag-chem-card">
                    <div class="chem-card-header">
                        <span class="chem-icon">💡</span>
                        <strong>Cơ Chế Phân Tử &amp; Điểm Cốt Lõi Cần Nhớ (Chuẩn SGK Hóa 12):</strong>
                    </div>
                    <div class="chem-card-body" id="coagChemicalDetails">
                        <!-- Nội dung giải thích chi tiết sẽ cập nhật theo tác nhân được chọn -->
                    </div>
                </div>
            </div>
        `;

        this.renderCoagulationGridLines();
    }

    renderCoagulationGridLines() {
        const gridGroup = document.getElementById('coagGridGroup');
        if (!gridGroup) return;

        const left = 55;
        const right = 625;
        const top = 30;
        const bottom = 275;
        const width = right - left;
        const height = bottom - top;

        let linesHtml = '';
        // Trục Y (0%, 25%, 50%, 75%, 100%)
        [0, 25, 50, 75, 100].forEach(val => {
            const y = bottom - (val / 100) * height;
            linesHtml += `
                <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
                <text x="${left - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" font-family="JetBrains Mono, monospace" text-anchor="end">${val}%</text>
            `;
        });

        // Trục X (0s, 5s, 10s, 15s, 20s, 25s, 30s)
        [0, 5, 10, 15, 20, 25, 30].forEach(sec => {
            const x = left + (sec / 30) * width;
            linesHtml += `
                <line x1="${x}" y1="${top}" x2="${x}" y2="${bottom}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
                <text x="${x}" y="${bottom + 20}" fill="#94a3b8" font-size="11" font-family="JetBrains Mono, monospace" text-anchor="middle">${sec}s</text>
            `;
        });

        // Tiêu đề trục
        linesHtml += `
            <text x="${left}" y="${top - 12}" fill="#00f2fe" font-size="12" font-weight="bold" font-family="Be Vietnam Pro, sans-serif">% Đông tụ</text>
            <text x="${right}" y="${bottom + 36}" fill="#94a3b8" font-size="12" font-family="Be Vietnam Pro, sans-serif" text-anchor="end">Thời gian phản ứng (giây) →</text>
        `;

        gridGroup.innerHTML = linesHtml;
    }

    setCoagulationReagent(reagentKey) {
        if (!this.coagChartState) return;
        this.coagChartState.currentReagent = reagentKey;
        this.resetCoagulationSimulation();

        // Cập nhật trạng thái active cho nút chọn tác nhân
        document.querySelectorAll('.coag-reagent-btn').forEach(btn => {
            const isMatch = (reagentKey === 'temp' && btn.textContent.includes('Nhiệt')) ||
                            (reagentKey === 'acid' && btn.textContent.includes('Axit')) ||
                            (reagentKey === 'alcohol' && btn.textContent.includes('Cồn')) ||
                            (reagentKey === 'metal' && btn.textContent.includes('Kim Loại')) ||
                            (reagentKey === 'salting' && btn.textContent.includes('NaCl')) ||
                            (reagentKey === 'compare' && btn.textContent.includes('So Sánh'));
            btn.classList.toggle('active', isMatch);
        });

        // Ẩn/hiện chính xác thanh trượt của từng tác nhân
        const tempRow = document.getElementById('coagTempSliderRow');
        const acidRow = document.getElementById('coagAcidSliderRow');
        const alcRow = document.getElementById('coagAlcoholSliderRow');
        const metalRow = document.getElementById('coagMetalSliderRow');
        const saltRow = document.getElementById('coagSaltingSliderRow');
        const legendRow = document.getElementById('coagLegendRow');

        if (tempRow) tempRow.style.display = reagentKey === 'temp' ? 'flex' : 'none';
        if (acidRow) acidRow.style.display = reagentKey === 'acid' ? 'flex' : 'none';
        if (alcRow) alcRow.style.display = reagentKey === 'alcohol' ? 'flex' : 'none';
        if (metalRow) metalRow.style.display = reagentKey === 'metal' ? 'flex' : 'none';
        if (saltRow) saltRow.style.display = reagentKey === 'salting' ? 'flex' : 'none';
        if (legendRow) legendRow.style.display = reagentKey === 'compare' ? 'flex' : 'none';

        // Cập nhật đèn cồn
        const flame = document.getElementById('burnerFlame');
        if (flame) {
            flame.style.display = (reagentKey === 'temp' && this.coagChartState.isHeating) ? 'block' : 'none';
        }

        this.updateCoagulationCurve();
        if (window.app) window.app.playSound('click');
    }

    setCoagulationTemperature(tempVal) {
        if (!this.coagChartState) return;
        this.coagChartState.targetTemp = parseInt(tempVal, 10);
        const valEl = document.getElementById('coagTempSliderVal');
        if (valEl) valEl.textContent = `${this.coagChartState.targetTemp}°C`;
        const slider = document.getElementById('coagTempSlider');
        if (slider) slider.value = this.coagChartState.targetTemp;

        const condEl = document.getElementById('coagDynConditionText');
        if (condEl) condEl.textContent = `Nhiệt độ hiện tại: 25°C (Đích: ${this.coagChartState.targetTemp}°C)`;

        this.updateCoagulationCurve();
    }

    setCoagulationAcid(val) {
        if (!this.coagChartState) return;
        this.coagChartState.acidConc = parseFloat(val);
        const valEl = document.getElementById('coagAcidSliderVal');
        if (valEl) valEl.textContent = `${this.coagChartState.acidConc}%`;
        const slider = document.getElementById('coagAcidSlider');
        if (slider) slider.value = this.coagChartState.acidConc;

        const condEl = document.getElementById('coagDynConditionText');
        if (condEl) {
            const estPH = Math.max(0.5, 2 - this.coagChartState.acidConc * 0.08).toFixed(1);
            condEl.textContent = `Axit HCl / HNO₃ ${this.coagChartState.acidConc}% (pH ≈ ${estPH})`;
        }

        this.updateCoagulationCurve();
    }

    setCoagulationAlcohol(val) {
        if (!this.coagChartState) return;
        this.coagChartState.alcoholDegree = parseInt(val, 10);
        const valEl = document.getElementById('coagAlcoholSliderVal');
        if (valEl) valEl.textContent = `${this.coagChartState.alcoholDegree}°`;
        const slider = document.getElementById('coagAlcoholSlider');
        if (slider) slider.value = this.coagChartState.alcoholDegree;

        const condEl = document.getElementById('coagDynConditionText');
        if (condEl) condEl.textContent = `Cồn Ethanol ${this.coagChartState.alcoholDegree}° (Khử nước hydrat)`;

        this.updateCoagulationCurve();
    }

    setCoagulationMetal(val) {
        if (!this.coagChartState) return;
        this.coagChartState.metalDrops = parseInt(val, 10);
        const valEl = document.getElementById('coagMetalSliderVal');
        if (valEl) valEl.textContent = `${this.coagChartState.metalDrops} giọt`;
        const slider = document.getElementById('coagMetalSlider');
        if (slider) slider.value = this.coagChartState.metalDrops;

        const condEl = document.getElementById('coagDynConditionText');
        if (condEl) condEl.textContent = `Muối CuSO₄ (${this.coagChartState.metalDrops} giọt - Tạo muối proteinate)`;

        this.updateCoagulationCurve();
    }

    setCoagulationSalt(val) {
        if (!this.coagChartState) return;
        this.coagChartState.saltGrams = parseInt(val, 10);
        this.coagChartState.isDiluted = false;
        const valEl = document.getElementById('coagSaltingSliderVal');
        if (valEl) valEl.textContent = `${this.coagChartState.saltGrams}g`;
        const slider = document.getElementById('coagSaltingSlider');
        if (slider) slider.value = this.coagChartState.saltGrams;

        const condEl = document.getElementById('coagDynConditionText');
        if (condEl) condEl.textContent = `Muối NaCl bão hòa (${this.coagChartState.saltGrams}g - Diêm kết)`;

        this.updateCoagulationCurve();
    }

    diluteSaltingWithWater() {
        if (!this.coagChartState) return;
        this.coagChartState.isDiluted = true;
        this.triggerTubeAction('drop');

        const condEl = document.getElementById('coagDynConditionText');
        if (condEl) condEl.textContent = '💧 Đã pha loãng bằng nước cất: Protein tan hoàn toàn (Thuận nghịch)';

        const badge = document.getElementById('tubePhaseBadge');
        if (badge) badge.textContent = 'Hiện tượng đặc biệt: Tan lại khi pha loãng (Reversible)';

        const desc = document.getElementById('tubeMechanismText');
        if (desc) desc.textContent = 'Khác với nhiệt độ và axit, sự đông tụ bằng muối ăn (Diêm kết) là quá trình thuận nghịch. Khi thêm nước cất, nồng độ muối giảm, lớp vỏ hydrat hóa được tái lập giúp phân tử protein hòa tan trở lại hoàn toàn.';

        this.updateCoagulationCurve();
        if (window.app) window.app.playSound('success');
    }

    triggerTubeAction(actionType) {
        const state = this.coagChartState;
        if (!state) return;

        if (actionType === 'shake') {
            const wrapper = document.getElementById('virtualTubeWrapper');
            if (wrapper) {
                wrapper.classList.remove('tube-shake');
                void wrapper.offsetWidth;
                wrapper.classList.add('tube-shake');
                setTimeout(() => wrapper.classList.remove('tube-shake'), 750);
            }
            if (window.app) window.app.playSound('click');
        } else if (actionType === 'drop') {
            const droplet = document.getElementById('animatedDroplet');
            if (droplet) {
                droplet.classList.remove('droplet-falling');
                void droplet.offsetWidth;
                droplet.classList.add('droplet-falling');
                setTimeout(() => droplet.classList.remove('droplet-falling'), 550);
            }
            if (window.app) window.app.playSound('click');
        } else if (actionType === 'heat') {
            state.isHeating = !state.isHeating;
            const btnHeat = document.getElementById('btnTubeHeat');
            if (btnHeat) btnHeat.textContent = state.isHeating ? '❄️ Tắt đèn cồn' : '🔥 Bật đèn cồn';
            const flame = document.getElementById('burnerFlame');
            if (flame) flame.style.display = state.isHeating ? 'block' : 'none';
            if (state.isHeating && !state.isRunning) {
                this.startCoagulationSimulation();
            }
            if (window.app) window.app.playSound('click');
        }
    }

    setCoagulationSpeed(spdVal) {
        if (!this.coagChartState) return;
        this.coagChartState.speedMultiplier = parseFloat(spdVal) || 1;
    }

    toggleCoagulationSimulation() {
        if (!this.coagChartState) return;
        if (this.coagChartState.isRunning) {
            this.pauseCoagulationSimulation();
        } else {
            this.startCoagulationSimulation();
        }
    }

    startCoagulationSimulation() {
        if (!this.coagChartState) return;
        this.coagChartState.isRunning = true;
        const btnPlay = document.getElementById('btnCoagPlay');
        if (btnPlay) btnPlay.textContent = '⏸ Tạm dừng';

        const stepTime = 50; // ms
        if (this.coagChartState.timerId) clearInterval(this.coagChartState.timerId);

        this.coagChartState.timerId = setInterval(() => {
            if (!this.coagChartState.isRunning) return;
            const deltaSec = (stepTime / 1000) * (this.coagChartState.speedMultiplier || 1);
            this.coagChartState.simTime += deltaSec;

            if (this.coagChartState.simTime >= this.coagChartState.maxTime) {
                this.coagChartState.simTime = this.coagChartState.maxTime;
                this.pauseCoagulationSimulation();
            }

            this.updateCoagulationCurve();
        }, stepTime);
    }

    pauseCoagulationSimulation() {
        if (!this.coagChartState) return;
        this.coagChartState.isRunning = false;
        if (this.coagChartState.timerId) {
            clearInterval(this.coagChartState.timerId);
            this.coagChartState.timerId = null;
        }
        const btnPlay = document.getElementById('btnCoagPlay');
        if (btnPlay) btnPlay.textContent = '▶ Tiếp tục chạy';
    }

    resetCoagulationSimulation() {
        if (!this.coagChartState) return;
        this.pauseCoagulationSimulation();
        this.coagChartState.simTime = 0;
        this.coagChartState.isDiluted = false;
        const btnPlay = document.getElementById('btnCoagPlay');
        if (btnPlay) btnPlay.textContent = '▶ Chạy mô phỏng động';
        this.updateCoagulationCurve();
    }

    calculateTurbidityAtTime(t, reagent, options = {}) {
        if (t <= 0) return 0;
        const state = this.coagChartState;
        switch (reagent) {
            case 'temp': {
                const targetTemp = options.targetTemp ?? state?.targetTemp ?? 80;
                const effTemp = 25 + (targetTemp - 25) * (1 - Math.exp(-t / 6.5));
                const maxPct = targetTemp < 50 ? 5 : (targetTemp < 60 ? 30 : Math.min(100, 30 + (targetTemp - 60) * 1.75));
                const pct = maxPct / (1 + Math.exp(-(effTemp - 62) / 4.0));
                return Math.max(0, Math.min(100, pct));
            }
            case 'acid': {
                const acidConc = options.acidConc ?? state?.acidConc ?? 10;
                const maxPct = Math.min(98, 25 + acidConc * 3.8);
                const rate = 2.0 + (20 - acidConc) * 0.15;
                const pct = maxPct * (1 - Math.exp(-t / rate));
                return Math.max(0, Math.min(98, pct));
            }
            case 'alcohol': {
                const degree = options.alcoholDegree ?? state?.alcoholDegree ?? 70;
                const maxPct = degree < 50 ? 40 : (degree <= 75 ? (50 + (degree - 50) * 1.5) : (88 - (degree - 75) * 0.3));
                const pct = maxPct * (1 - Math.exp(-t / 4.2));
                return Math.max(0, Math.min(90, pct));
            }
            case 'metal': {
                const drops = options.metalDrops ?? state?.metalDrops ?? 5;
                const maxPct = Math.min(98, drops * 10);
                const pct = maxPct * (1 - Math.exp(-t / 2.2));
                return Math.max(0, Math.min(98, pct));
            }
            case 'salting': {
                if (state?.isDiluted) return 0;
                const grams = options.saltGrams ?? state?.saltGrams ?? 10;
                const maxPct = Math.min(78, grams * 3.6);
                const pct = maxPct * (1 - Math.exp(-t / 3.5));
                return Math.max(0, Math.min(78, pct));
            }
            default:
                return 0;
        }
    }

    updateCoagulationCurve() {
        const state = this.coagChartState;
        if (!state) return;

        const left = 55;
        const right = 625;
        const top = 30;
        const bottom = 275;
        const width = right - left;
        const height = bottom - top;

        const refPath = document.getElementById('coagRefPath');
        const mainPath = document.getElementById('coagMainPath');
        const areaPath = document.getElementById('coagAreaPath');
        const tracerDot = document.getElementById('coagTracerDot');
        const tracerLabel = document.getElementById('coagTracerLabel');
        const timeText = document.getElementById('coagDynTimeText');
        const pctText = document.getElementById('coagDynPctText');
        const condText = document.getElementById('coagDynConditionText');

        if (!mainPath) return;

        const curT = state.simTime;
        const currentPct = this.calculateTurbidityAtTime(curT, state.currentReagent === 'compare' ? 'temp' : state.currentReagent);

        if (timeText) timeText.textContent = `${curT.toFixed(1)}s`;
        if (pctText) pctText.textContent = `${Math.round(currentPct)}%`;

        if (condText) {
            if (state.currentReagent === 'temp') {
                const effT = 25 + (state.targetTemp - 25) * (1 - Math.exp(-curT / 6.5));
                condText.textContent = `Nhiệt độ hiện tại: ${Math.round(effT)}°C (Đích: ${state.targetTemp}°C)`;
            } else if (state.currentReagent === 'acid') {
                const estPH = Math.max(0.5, 2 - state.acidConc * 0.08).toFixed(1);
                condText.textContent = `Axit HCl / HNO₃ ${state.acidConc}% (pH ≈ ${estPH})`;
            } else if (state.currentReagent === 'alcohol') {
                condText.textContent = `Cồn Ethanol ${state.alcoholDegree}° (Khử nước hydrat)`;
            } else if (state.currentReagent === 'metal') {
                condText.textContent = `CuSO₄ 5% (${state.metalDrops} giọt - Tạo muối kim loại nặng)`;
            } else if (state.currentReagent === 'salting') {
                condText.textContent = state.isDiluted ? '💧 Đã pha loãng: Protein tan lại (Thuận nghịch)' : `NaCl bão hòa ${state.saltGrams}g (Đông tụ thuận nghịch)`;
            } else if (state.currentReagent === 'compare') {
                condText.textContent = 'So sánh 5 tác nhân đồng thời';
            }
        }

        const steps = 60;

        // 1. VẼ ĐƯỜNG LÝ THUYẾT THAM CHIẾU TOÀN BỘ 0s - 30s (KHÔNG BAO GIỜ BỊ TRỐNG HOẶC LỖI!)
        if (refPath && state.currentReagent !== 'compare') {
            const refPoints = [];
            for (let i = 0; i <= steps; i++) {
                const t = (i / steps) * 30;
                const pct = this.calculateTurbidityAtTime(t, state.currentReagent);
                const x = left + (t / 30) * width;
                const y = bottom - (pct / 100) * height;
                refPoints.push([x, y]);
            }
            const refDStr = refPoints.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
            refPath.setAttribute('d', refDStr);
            refPath.style.display = 'block';
        } else if (refPath) {
            refPath.style.display = 'none';
        }

        // 2. VẼ PATH CHÍNH THỰC TẾ ĐANG CHẠY TỪ t=0 ĐẾN t=curT
        let points = [];
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * curT;
            const pct = this.calculateTurbidityAtTime(t, state.currentReagent === 'compare' ? 'temp' : state.currentReagent);
            const x = left + (t / 30) * width;
            const y = bottom - (pct / 100) * height;
            points.push([x, y]);
        }

        if (points.length > 0) {
            const dStr = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
            mainPath.setAttribute('d', dStr);

            // Area fill
            const lastP = points[points.length - 1];
            const areaStr = dStr + ` L ${lastP[0].toFixed(1)},${bottom} L ${left},${bottom} Z`;
            if (areaPath) areaPath.setAttribute('d', areaStr);

            // Tracer dot
            if (tracerDot) {
                tracerDot.setAttribute('cx', lastP[0].toFixed(1));
                tracerDot.setAttribute('cy', lastP[1].toFixed(1));
            }
            if (tracerLabel) {
                tracerLabel.setAttribute('x', Math.min(right - 35, lastP[0] + 8));
                tracerLabel.setAttribute('y', Math.max(top + 16, lastP[1] - 8));
                tracerLabel.textContent = `${Math.round(currentPct)}%`;
            }
        }

        // 3. VẼ CÁC ĐƯỜNG SO SÁNH NẾU Ở CHẾ ĐỘ COMPARE
        const isCmp = state.currentReagent === 'compare';
        ['temp', 'acid', 'alcohol', 'metal', 'salting'].forEach((regKey, idx) => {
            const cmpLine = document.getElementById(`coagCurveCompare${idx + 1}`);
            if (!cmpLine) return;
            if (!isCmp) {
                cmpLine.setAttribute('d', '');
                return;
            }
            const cmpPts = [];
            for (let i = 0; i <= steps; i++) {
                const t = (i / steps) * (curT > 0 ? curT : 30);
                const pct = this.calculateTurbidityAtTime(t, regKey);
                const x = left + (t / 30) * width;
                const y = bottom - (pct / 100) * height;
                cmpPts.push([x, y]);
            }
            cmpLine.setAttribute('d', cmpPts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '));
        });

        // 4. CẬP NHẬT ỐNG NGHIỆM ẢO VÀ MÔ TẢ CƠ CHẾ
        this.updateVirtualTubeAndNotes(currentPct, state.currentReagent);
    }

    updateVirtualTubeAndNotes(pct, reagent) {
        const liquid = document.getElementById('tubeLiquidPath');
        const gel = document.getElementById('tubeCoagGel');
        const p1 = document.getElementById('tubeParticle1');
        const p2 = document.getElementById('tubeParticle2');
        const p3 = document.getElementById('tubeParticle3');
        const p4 = document.getElementById('tubeParticle4');
        const p5 = document.getElementById('tubeParticle5');
        const badge = document.getElementById('tubePhaseBadge');
        const desc = document.getElementById('tubeMechanismText');
        const chemDetails = document.getElementById('coagChemicalDetails');
        const flame = document.getElementById('burnerFlame');

        if (!liquid) return;

        // Cập nhật ngọn lửa đèn cồn
        if (flame) {
            flame.style.display = (reagent === 'temp' && (this.coagChartState?.isHeating || this.coagChartState?.isRunning)) ? 'block' : 'none';
        }

        // Màu sắc và độ đục của dung dịch theo hóa chất
        const alpha = Math.min(0.95, 0.15 + (pct / 100) * 0.8);
        if (reagent === 'metal') {
            liquid.setAttribute('fill', `rgba(14, 165, 233, ${Math.min(0.85, 0.25 + (pct / 100) * 0.6)})`);
        } else if (reagent === 'salting' && this.coagChartState?.isDiluted) {
            liquid.setAttribute('fill', 'rgba(240, 248, 255, 0.15)');
        } else {
            liquid.setAttribute('fill', `rgba(240, 248, 255, ${alpha.toFixed(2)})`);
        }

        // Độ dày lớp gel đông tụ trên mặt ống nghiệm
        const gelHeight = (pct / 100) * 45; // max 45px
        if (gel) {
            gel.setAttribute('height', gelHeight.toFixed(1));
            gel.setAttribute('opacity', (pct / 100).toFixed(2));
            if (reagent === 'metal') {
                gel.setAttribute('fill', 'rgba(186, 230, 253, 0.95)');
                gel.setAttribute('stroke', '#38bdf8');
            } else {
                gel.setAttribute('fill', 'rgba(248, 250, 252, 0.92)');
                gel.setAttribute('stroke', '#cbd5e1');
            }
        }

        // Độ mờ các hạt lơ lửng vón cục
        const partOpacity = (pct / 100).toFixed(2);
        [p1, p2, p3, p4, p5].forEach(p => {
            if (p) p.setAttribute('opacity', partOpacity);
        });

        // Mô tả giai đoạn và cơ chế phân tử
        let phaseText = '';
        let phaseDesc = '';
        if (this.coagChartState?.isDiluted && reagent === 'salting') {
            phaseText = 'Giai đoạn hồi biến: Protein tan lại (Reversible Dissolution)';
            phaseDesc = 'Sau khi thêm nước cất pha loãng dung dịch muối ăn, các phân tử protein thu nhận lại lớp vỏ hydrat hóa bao quanh, tan hoàn toàn trở về trạng thái dung dịch ban đầu!';
        } else if (pct < 15) {
            phaseText = 'Giai đoạn 1: Dung dịch keo tự nhiên (Native)';
            phaseDesc = 'Protein dạng hình cầu cuộn gập hoàn chỉnh. Lớp vỏ hydrat hóa (các phân tử H₂O liên kết với amino acid ưa nước) bền vững, dung dịch hoàn toàn trong suốt.';
        } else if (pct < 65) {
            phaseText = 'Giai đoạn 2: Biến tính mở xoắn (Denaturation)';
            phaseDesc = 'Nhiệt độ hoặc tác nhân phá vỡ các liên kết hydrogen, liên kết ion giữa các chuỗi. Cấu trúc không gian bậc cao duỗi xoắn, bộc lộ các gốc kị nước (-CH₃, -C₆H₅) ra ngoài.';
        } else {
            phaseText = 'Giai đoạn 3: Đông tụ vón cục (Aggregation & Gelation)';
            phaseDesc = 'Các gốc kỵ nước lộ ra tương tác chặt chẽ với nhau, kéo các chuỗi polypeptide liên kết thành mạng lưới không gian 3D dày đặc giữ nước bên trong tạo thành khối gel đông tụ trắng đục!';
        }

        if (badge) badge.textContent = phaseText;
        if (desc) desc.textContent = phaseDesc;

        // Cập nhật nội dung lí thuyết tương ứng
        if (chemDetails) {
            let chemHtml = '';
            switch (reagent) {
                case 'temp':
                    chemHtml = `
                        <p><strong>🔥 Bản chất đông tụ nhiệt:</strong> Khi đun nóng (đặc biệt từ 60°C – 80°C), động năng phân tử tăng làm đứt gãy liên kết hydrogen và tương tác yếu giữ cấu trúc bậc 2, bậc 3, bậc 4. Hiện tượng này là <em>không thuận nghịch</em> (trứng luộc chín để nguội không thể hóa lỏng lại).</p>
                        <p><strong>🍳 Ứng dụng thực tế:</strong> Nấu canh cua gạch cua nổi lên, luộc trứng, tráng trứng, làm đậu phụ, thanh trùng sữa bò bằng nhiệt độ cao.</p>
                    `;
                    break;
                case 'acid':
                    chemHtml = `
                        <p><strong>🍋 Bản chất đông tụ axit:</strong> Axit mạnh (HCl, HNO₃) cung cấp nhiều H⁺, làm proton hóa các nhóm carboxylate (-COO⁻ + H⁺ → -COOH). Phân tử mất điện tích âm, các cầu muối (liên kết ion) bị phá hủy hoàn toàn làm protein biến tính và kết tủa.</p>
                        <p><strong>🍳 Ứng dụng thực tế:</strong> Vắt chanh vào sữa bò sữa sẽ đông tụ tạo kết tủa lợn cợn (làm phô mai ricotta); dịch vị dạ dày chứa HCl pH ≈ 1.5 – 2 giúp đông tụ và tiêu hóa protein thức ăn.</p>
                    `;
                    break;
                case 'alcohol':
                    chemHtml = `
                        <p><strong>🍷 Bản chất đông tụ bằng cồn:</strong> Cồn ethanol có tính háo nước mạnh và hằng số điện môi thấp, làm mất lớp vỏ hydrat hóa bảo vệ quanh phân tử protein. Các chuỗi va chạm và kết tụ lại với nhau.</p>
                        <p><strong>🏥 Ứng dụng y tế:</strong> Cồn 70° sát khuẩn tốt nhất vì làm đông tụ protein vi khuẩn từ từ, đủ thời gian thẩm thấu sâu vào tế bào; cồn 90° đông tụ quá nhanh tạo màng cứng che chở vi khuẩn bên trong.</p>
                    `;
                    break;
                case 'metal':
                    chemHtml = `
                        <p><strong>🧪 Bản chất đông tụ muối kim loại nặng:</strong> Ion Cu²⁺, Pb²⁺, Hg²⁺ phản ứng với nhóm -SH, -COOH, -NH₂ tạo thành muối proteinate kim loại không tan, phá vỡ hoàn toàn cấu trúc bậc 3.</p>
                        <p><strong>⚠️ Cảnh báo độc học:</strong> Muối kim loại nặng gây ngộ độc nặng vì làm tê liệt enzyme và protein cơ thể. Khi bị ngộ độc chì hoặc thủy ngân, dân gian thường cho uống lòng trắng trứng sống để protein kết tủa với kim loại trong dạ dày rồi rửa ruột.</p>
                    `;
                    break;
                case 'salting':
                    chemHtml = `
                        <p><strong>🧂 Bản chất phương pháp Diêm kết (Salting-Out):</strong> Muối ăn NaCl hoặc (NH₄)₂SO₄ nồng độ cao cạnh tranh liên kết nước với protein, làm giảm độ tan và gây kết tủa. <em>Điểm đặc biệt: Đây là sự đông tụ THUẬN NGHỊCH!</em> Khi thêm nước cất pha loãng dung dịch, protein lại tan hoàn toàn như ban đầu.</p>
                        <p><strong>🔬 Ứng dụng khoa học:</strong> Dùng trong công nghệ sinh học và sinh hóa để tinh chế, tách chiết và thu nhận protein tinh khiết mà không làm mất hoạt tính sinh học.</p>
                    `;
                    break;
                default:
                    chemHtml = `
                        <p><strong>📊 So sánh tổng hợp 5 tác nhân:</strong> Nhiệt độ và muối kim loại nặng cho mức độ đông tụ cao nhất (> 95%). Axit và cồn gây đông tụ nhanh trong 5-10 giây đầu. Muối ăn NaCl gây đông tụ thuận nghịch bảo toàn cấu trúc khi pha loãng.</p>
                    `;
                    break;
            }
            chemDetails.innerHTML = chemHtml;
        }
    }

    /* =========================================================================
       8. CHẾ ĐỘ THUYẾT TRÌNH BÀI HỌC & ĐIỀN KHUYẾT THEO SÁT ĐỀ THẦY PHÁT (TRANG 14-16)
       ========================================================================= */
    renderPresentation12H() {
        const container = document.getElementById('presentation12hContainer');
        if (!container || !window.PRESENTATION_12H_DATA) return;

        const lessons = window.PRESENTATION_12H_DATA;
        if (!lessons.length) return;

        if (this.currentPresentationLessonIndex < 0 || this.currentPresentationLessonIndex >= lessons.length) {
            this.currentPresentationLessonIndex = 0;
        }

        const lesson = lessons[this.currentPresentationLessonIndex];
        const lessonId = lesson.id;
        const totalScorePct = this.calcPresentationScore();

        if (!this.presentationBlanksState[lessonId]) {
            this.presentationBlanksState[lessonId] = {};
        }
        if (!this.selectedExperimentReagent[lessonId] && lesson.experiment && lesson.experiment.reagentOptions.length) {
            this.selectedExperimentReagent[lessonId] = lesson.experiment.reagentOptions[0].id;
        }

        // Tạo nội dung điền khuyết tương tác từ text
        const fillData = lesson.fillInBlanks;
        let renderedBlanksHtml = fillData.text;

        fillData.blanks.forEach(b => {
            const currentVal = this.presentationBlanksState[lessonId][b.id] || '';
            const isCorrect = currentVal === b.answer;
            const isFilled = Boolean(currentVal);
            const statusClass = isFilled ? (isCorrect ? 'blank-correct' : 'blank-wrong') : '';

            let selectHtml = `<span class="blank-wrap ${statusClass}"><select class="blank-select ${statusClass}" onchange="window.educationMgr.onBlankChange('${lessonId}', '${b.id}', this.value)"><option value="">-- Điền khuyết --</option>${b.options.map(opt => `<option value="${this.escapeHtml(opt)}" ${currentVal === opt ? 'selected' : ''}>${this.escapeHtml(opt)}</option>`).join('')}</select>${isFilled ? (isCorrect ? '<span class="blank-badge-check" title="Chính xác!">✓</span>' : `<span class="blank-badge-wrong" title="Gợi ý: ${this.escapeHtml(b.hint || '')}">✗</span>`) : ''}</span>`;
            renderedBlanksHtml = renderedBlanksHtml.split(`[[${b.id}]]`).join(selectHtml);
        });

        renderedBlanksHtml = renderedBlanksHtml.replace(/\n/g, '<br>');

        const exp = lesson.experiment;
        const selectedReagent = this.selectedExperimentReagent[lessonId] || (exp.reagentOptions[0] ? exp.reagentOptions[0].id : '');
        const simResult = exp.simulationResult[selectedReagent] || { text: 'Chọn hóa chất/điều kiện để tiến hành thí nghiệm.', observation: '' };

        const labVisualHtml = this.generateExperimentVisual(lessonId, selectedReagent);
        const quizList = lesson.quiz || [];
        const quizState = this.presentationQuizState[lessonId] || {};

        container.innerHTML = `
            <div class="presentation-12h-wrapper">
                <!-- TOP HEADER THUYẾT TRÌNH -->
                <div class="p12h-top-banner">
                    <div class="p12h-banner-left">
                        <span class="p12h-tag">CHUYÊN ĐỀ HÓA 12 · THPT CHUYÊN HÙNG VƯƠNG (TRANG 14–16/16)</span>
                        <h2 class="p12h-main-title">🎯 Bài Học Tương Tác &amp; Điền Khuyết</h2>
                        <p class="p12h-subtitle">Bám sát 100% tài liệu học tập của Thầy Thắng: Phiếu điền khuyết trực tiếp • Thí nghiệm trực quan • Hoạt động củng cố tương tác tức thì.</p>
                    </div>
                    <div class="p12h-banner-score">
                        <div class="p12h-score-badge">
                            <span class="p12h-score-num">${totalScorePct}%</span>
                            <span class="p12h-score-lbl">ĐỘ HIỂU BÀI CỦA NHÓM</span>
                        </div>
                        <div class="p12h-score-bar-bg">
                            <div class="p12h-score-bar-fill" style="width: ${totalScorePct}%"></div>
                        </div>
                        <div class="p12h-score-note">💡 Độ hiểu bài tỉ lệ thuận với điểm của nhóm mình!</div>
                    </div>
                </div>

                <!-- THANH CHỌN 6 BÀI HỌC CHUẨN ĐỀ THẦY -->
                <div class="p12h-nav-bar">
                    ${lessons.map((ls, idx) => `
                        <button class="p12h-nav-btn ${idx === this.currentPresentationLessonIndex ? 'active' : ''}" onclick="window.educationMgr.selectPresentationLesson(${idx})">
                            <span class="p12h-nav-icon">${ls.icon}</span>
                            <span class="p12h-nav-text">${this.escapeHtml(ls.title)}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- KHUNG BÀI HỌC CHI TIẾT -->
                <div class="p12h-lesson-card">
                    <!-- TIÊU ĐỀ BÀI ĐANG CHỌN -->
                    <div class="p12h-lesson-header">
                        <div>
                            <span class="p12h-lesson-badge">${this.escapeHtml(lesson.badge)}</span>
                            <h3 class="p12h-lesson-title">${lesson.icon} ${this.escapeHtml(lesson.title)}</h3>
                            <div class="p12h-lesson-sub">${this.escapeHtml(lesson.subTitle)}</div>
                        </div>
                    </div>

                    <!-- MỤC 1: PHIẾU BÀI HỌC ĐIỀN KHUYẾT (MÔ PHỎNG TỜ ĐỀ THẦY PHÁT) -->
                    <div class="p12h-blanks-box">
                        <div class="p12h-blanks-header">
                            <div>
                                <h4 class="p12h-box-heading">✍️ PHIẾU BÀI HỌC ĐIỀN KHUYẾT TƯƠNG TÁC</h4>
                                <p class="p12h-box-sub">Tờ phiếu bài tập THPT Chuyên Hùng Vương · Trang 14-16. Click chọn các ô trống bên dưới để hoàn thành kiến thức:</p>
                            </div>
                            <div class="p12h-blanks-tools">
                                <button class="btn-p12h-tool fill-all" onclick="window.educationMgr.fillSampleBlanks('${lessonId}')" title="Hiện toàn bộ đáp án mẫu">
                                    ⚡ Điền Mẫu Đáp Án
                                </button>
                                <button class="btn-p12h-tool reset" onclick="window.educationMgr.resetBlankAnswers('${lessonId}')" title="Xóa làm lại">
                                    🔄 Làm Lại
                                </button>
                            </div>
                        </div>

                        <div class="blanks-content-paper">
                            ${renderedBlanksHtml}
                        </div>
                    </div>

                    <!-- MỤC 2: THÍ NGHIỆM MÔ PHỎNG TRỰC QUAN -->
                    <div class="p12h-experiment-box">
                        <div class="p12h-box-heading-wrap">
                            <h4 class="p12h-box-heading">🧪 THÍ NGHIỆM MÔ PHỎNG &amp; TƯƠNG TÁC HÓA HỌC</h4>
                            <p class="p12h-box-sub">${this.escapeHtml(exp.title)}: ${this.escapeHtml(exp.description)}</p>
                        </div>

                        <!-- Các nút chọn điều kiện / hóa chất -->
                        <div class="p12h-exp-reagents-nav">
                            ${exp.reagentOptions.map(r => `
                                <button class="p12h-reagent-btn ${r.id === selectedReagent ? 'active' : ''}" onclick="window.educationMgr.selectExpReagent('${lessonId}', '${r.id}')">
                                    <span class="p12h-reagent-icon">${r.icon}</span>
                                    <span class="p12h-reagent-name">${this.escapeHtml(r.name)}</span>
                                </button>
                            `).join('')}
                        </div>

                        <!-- Khung thí nghiệm ảo -->
                        <div class="p12h-exp-workbench">
                            <div class="p12h-exp-visual-col">
                                ${labVisualHtml}
                            </div>
                            <div class="p12h-exp-info-col">
                                <div class="p12h-exp-obs-box">
                                    <span class="p12h-obs-tag">👁️ HIỆN TƯỢNG QUAN SÁT ĐƯỢC:</span>
                                    <p class="p12h-obs-text">${this.escapeHtml(simResult.text)}</p>
                                    <div class="p12h-obs-detail"><strong>Nhận xét:</strong> ${this.escapeHtml(simResult.observation)}</div>
                                </div>

                                <!-- KHUNG TỰ SUY RA LÍ THUYẾT -->
                                <div class="p12h-exp-deduction-box">
                                    <span class="p12h-deduction-tag">🧠 HƯỚNG DẪN CÁC BẠN TỰ RÚT RA KẾT LUẬN LÍ THUYẾT:</span>
                                    <p class="p12h-deduction-text">${this.escapeHtml(exp.deduction)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- MỤC 4: HOẠT ĐỘNG TƯƠNG TÁC CỦNG CỐ KIẾN THỨC BÀI HỌC (MINI-QUIZ) -->
                    <div class="p12h-quiz-box">
                        <div class="p12h-box-heading-wrap">
                            <h4 class="p12h-box-heading">🎯 HOẠT ĐỘNG CỦNG CỐ TƯƠNG TÁC NGAY SAU PHẦN THUYẾT TRÌNH</h4>
                            <p class="p12h-box-sub">Thuyết trình xong phần nào tương tác phần đó luôn để cả lớp nắm vững bài học:</p>
                        </div>

                        <div class="p12h-quiz-grid">
                            ${quizList.map((qItem, qIdx) => {
                                const userAns = quizState[qIdx];
                                const isAnswered = userAns !== undefined;
                                const isRight = userAns === qItem.answer;

                                return `
                                    <div class="p12h-quiz-item ${isAnswered ? (isRight ? 'quiz-correct' : 'quiz-wrong') : ''}">
                                        <div class="p12h-quiz-q-num">CÂU HỎI NHANH 0${qIdx + 1}:</div>
                                        <div class="p12h-quiz-question">${this.escapeHtml(qItem.q)}</div>
                                        <div class="p12h-quiz-opts">
                                            ${qItem.options.map((opt, optIdx) => {
                                                const isSelected = userAns === optIdx;
                                                const isTarget = qItem.answer === optIdx;
                                                let optClass = '';
                                                if (isAnswered) {
                                                    if (isTarget) optClass = 'opt-target-correct';
                                                    else if (isSelected) optClass = 'opt-user-wrong';
                                                }

                                                return `
                                                    <button class="p12h-quiz-opt-btn ${isSelected ? 'selected' : ''} ${optClass}" onclick="window.educationMgr.answerPresentationQuiz('${lessonId}', ${qIdx}, ${optIdx})">
                                                        ${this.escapeHtml(opt)}
                                                    </button>
                                                `;
                                            }).join('')}
                                        </div>

                                        ${isAnswered ? `
                                            <div class="p12h-quiz-feedback ${isRight ? 'fb-right' : 'fb-wrong'}">
                                                <strong>${isRight ? '🎉 CHÍNH XÁC!' : '⚠️ CHƯA ĐÚNG!'}</strong> ${this.escapeHtml(qItem.explain)}
                                            </div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>

                        <!-- NÚT ĐIỀU HƯỚNG BÀI TIẾP THEO -->
                        <div class="p12h-lesson-footer">
                            ${this.currentPresentationLessonIndex < lessons.length - 1 ? `
                                <button class="btn-p12h-next" onclick="window.educationMgr.selectPresentationLesson(${this.currentPresentationLessonIndex + 1})">
                                    Tiếp Tục Sang Bài 0${this.currentPresentationLessonIndex + 2}: ${this.escapeHtml(lessons[this.currentPresentationLessonIndex + 1].title)} →
                                </button>
                            ` : `
                                <button class="btn-p12h-finish" onclick="window.educationMgr.switchTheorySubtab('examranking')">
                                    🏆 Chuyển Sang Phần Kiểm Tra Tổng Hợp &amp; Xếp Hạng 12H →
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    selectPresentationLesson(idx) {
        this.currentPresentationLessonIndex = idx;
        this.renderPresentation12H();
        if (window.app) window.app.playSound('click');
    }

    onBlankChange(lessonId, blankId, val) {
        if (!this.presentationBlanksState[lessonId]) {
            this.presentationBlanksState[lessonId] = {};
        }
        this.presentationBlanksState[lessonId][blankId] = val;

        const lesson = window.PRESENTATION_12H_DATA.find(l => l.id === lessonId);
        if (lesson) {
            const blankObj = lesson.fillInBlanks.blanks.find(b => b.id === blankId);
            if (blankObj && val) {
                if (val === blankObj.answer) {
                    if (window.app) window.app.playSound('success');
                } else {
                    if (window.app) window.app.playSound('beep');
                }
            }
        }

        this.renderPresentation12H();
    }

    fillSampleBlanks(lessonId) {
        const lesson = window.PRESENTATION_12H_DATA.find(l => l.id === lessonId);
        if (!lesson) return;

        if (!this.presentationBlanksState[lessonId]) {
            this.presentationBlanksState[lessonId] = {};
        }

        lesson.fillInBlanks.blanks.forEach(b => {
            this.presentationBlanksState[lessonId][b.id] = b.answer;
        });

        if (window.app) window.app.playSound('success');
        this.renderPresentation12H();
    }

    resetBlankAnswers(lessonId) {
        this.presentationBlanksState[lessonId] = {};
        if (window.app) window.app.playSound('click');
        this.renderPresentation12H();
    }

    selectExpReagent(lessonId, reagentId) {
        this.selectedExperimentReagent[lessonId] = reagentId;
        if (window.app) window.app.playSound('click');
        this.renderPresentation12H();
    }

    answerPresentationQuiz(lessonId, qIdx, optIdx) {
        if (!this.presentationQuizState[lessonId]) {
            this.presentationQuizState[lessonId] = {};
        }
        this.presentationQuizState[lessonId][qIdx] = optIdx;

        const lesson = window.PRESENTATION_12H_DATA.find(l => l.id === lessonId);
        if (lesson && lesson.quiz && lesson.quiz[qIdx]) {
            if (optIdx === lesson.quiz[qIdx].answer) {
                if (window.app) window.app.playSound('success');
            } else {
                if (window.app) window.app.playSound('beep');
            }
        }

        this.renderPresentation12H();
    }

    calcPresentationScore() {
        if (!window.PRESENTATION_12H_DATA) return 0;
        let totalItems = 0;
        let correctItems = 0;

        window.PRESENTATION_12H_DATA.forEach(lesson => {
            const lId = lesson.id;
            const blanks = lesson.fillInBlanks.blanks || [];
            const bState = this.presentationBlanksState[lId] || {};

            blanks.forEach(b => {
                totalItems++;
                if (bState[b.id] === b.answer) correctItems++;
            });

            const quizzes = lesson.quiz || [];
            const qState = this.presentationQuizState[lId] || {};
            quizzes.forEach((q, idx) => {
                totalItems++;
                if (qState[idx] === q.answer) correctItems++;
            });
        });

        if (totalItems === 0) return 0;
        return Math.round((correctItems / totalItems) * 100);
    }

    copySpeakerNotes(lessonId) {
        const lesson = window.PRESENTATION_12H_DATA.find(l => l.id === lessonId);
        if (!lesson) return;
        navigator.clipboard.writeText(lesson.speakerNotes).then(() => {
            alert('✓ Đã sao chép Lời Dẫn Thuyết Minh vào Clipboard!');
        }).catch(() => {
            const el = document.getElementById(`speakerNotesText-${lessonId}`);
            if (el) {
                const range = document.createRange();
                range.selectNodeContents(el);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });
    }

    speakSpeakerNotes(lessonId) {
        const lesson = window.PRESENTATION_12H_DATA.find(l => l.id === lessonId);
        if (!lesson || !window.speechSynthesis) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            return;
        }

        const utter = new SpeechSynthesisUtterance(lesson.speakerNotes);
        utter.lang = 'vi-VN';
        utter.rate = 0.95;
        window.speechSynthesis.speak(utter);
    }

    generateExperimentVisual(lessonId, reagentId) {
        let contentSvg = '';

        if (lessonId === 'bai1_khainiem') {
            if (reagentId === 'hair') {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <!-- Cốc thủy tinh -->
                        <rect x="50" y="40" width="140" height="170" rx="12" fill="rgba(255,255,255,0.05)" stroke="#38bdf8" stroke-width="3"/>
                        <!-- Lớp nước trong suốt -->
                        <rect x="53" y="90" width="134" height="117" rx="8" fill="rgba(56,189,248,0.18)"/>
                        <!-- Các sợi tóc keratin chìm/nổi, hoàn toàn không tan -->
                        <path d="M70,180 Q100,165 130,185 T170,180" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                        <path d="M65,192 Q95,178 125,195 T172,190" stroke="#451a03" stroke-width="3" fill="none" stroke-linecap="round"/>
                        <path d="M80,165 Q115,150 145,170" stroke="#78350f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                        <ellipse cx="120" cy="188" rx="20" ry="4" fill="rgba(69,26,3,0.3)"/>
                        <!-- Nhãn trạng thái -->
                        <rect x="42" y="10" width="156" height="24" rx="12" fill="#0284c7" opacity="0.95"/>
                        <text x="120" y="26" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">KERATIN: KHÔNG TAN</text>
                        <text x="120" y="240" font-size="11" fill="#38bdf8" font-weight="bold" text-anchor="middle">Nước trong suốt • Tách 2 pha riêng biệt</text>
                    </svg>
                `;
            } else {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <defs>
                            <linearGradient id="tyndallBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
                                <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.35"/>
                                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.1"/>
                            </linearGradient>
                        </defs>
                        <!-- Cốc thủy tinh -->
                        <rect x="50" y="40" width="140" height="170" rx="12" fill="rgba(255,255,255,0.05)" stroke="#00f2fe" stroke-width="3"/>
                        <!-- Dung dịch keo albumin mờ đục nhẹ -->
                        <rect x="53" y="90" width="134" height="117" rx="8" fill="rgba(56,189,248,0.32)"/>
                        <!-- Vệt sáng tán xạ Tyndall xuyên qua sol keo -->
                        <polygon points="53,120 187,100 187,170 53,150" fill="url(#tyndallBeam)"/>
                        <!-- Các hạt keo protein hình cầu lơ lửng dao động -->
                        <g class="sim-colloids">
                            <circle cx="85" cy="125" r="5" fill="#e0f2fe" opacity="0.85"><animate attributeName="cy" values="125;120;125" dur="2s" repeatCount="indefinite"/></circle>
                            <circle cx="120" cy="140" r="6" fill="#e0f2fe" opacity="0.95"><animate attributeName="cy" values="140;135;140" dur="2.5s" repeatCount="indefinite"/></circle>
                            <circle cx="155" cy="130" r="5" fill="#e0f2fe" opacity="0.85"><animate attributeName="cy" values="130;126;130" dur="2.2s" repeatCount="indefinite"/></circle>
                            <circle cx="100" cy="165" r="6" fill="#bae6fd" opacity="0.85"><animate attributeName="cy" values="165;160;165" dur="2.8s" repeatCount="indefinite"/></circle>
                            <circle cx="140" cy="168" r="5" fill="#bae6fd" opacity="0.85"><animate attributeName="cy" values="168;164;168" dur="2.1s" repeatCount="indefinite"/></circle>
                        </g>
                        <!-- Nhãn trạng thái -->
                        <rect x="36" y="10" width="168" height="24" rx="12" fill="#0d9488" opacity="0.95"/>
                        <text x="120" y="26" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">ALBUMIN: TAN TẠO SOL KEO</text>
                        <text x="120" y="240" font-size="11" fill="#2dd4bf" font-weight="bold" text-anchor="middle">Tán xạ Tyndall • Dung dịch keo đồng nhất</text>
                    </svg>
                `;
            }
        } else if (lessonId === 'bai2_hoahoc') {
            if (reagentId === 'crab_soup') {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <!-- Nồi nước canh cua -->
                        <rect x="40" y="80" width="160" height="130" rx="15" fill="rgba(249,115,22,0.15)" stroke="#fb923c" stroke-width="3"/>
                        <!-- Lớp nước dùng trong suốt -->
                        <rect x="42" y="130" width="156" height="78" rx="8" fill="rgba(251,146,60,0.3)"/>
                        <!-- Mảng gạch cua đông tụ nổi thành từng mảng lớn trên mặt nước -->
                        <ellipse cx="120" cy="120" rx="65" ry="18" fill="#ea580c" stroke="#f97316" stroke-width="2"/>
                        <circle cx="85" cy="118" r="8" fill="#c2410c"/>
                        <circle cx="140" cy="122" r="10" fill="#9a3412"/>
                        <text x="120" y="124" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">MÀNG CUA ĐÔNG TỤ</text>
                        <!-- Ngọn lửa đun nóng -->
                        <path d="M80,225 Q90,210 100,225 Q110,210 120,225 Q130,210 140,225 Q150,210 160,225" stroke="#ef4444" stroke-width="4" fill="none"/>
                        <text x="120" y="248" font-size="11" fill="#f87171" font-weight="bold" text-anchor="middle">🔥 Nhiệt độ cao làm biến tính đông tụ</text>
                    </svg>
                `;
            } else {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <!-- Cốc sữa -->
                        <rect x="60" y="50" width="120" height="160" rx="12" fill="rgba(255,255,255,0.08)" stroke="#38bdf8" stroke-width="3"/>
                        <!-- Sữa kết tủa bao vây ion Pb2+, Hg2+ -->
                        <rect x="63" y="100" width="114" height="106" rx="8" fill="rgba(255,255,255,0.5)"/>
                        <circle cx="100" cy="150" r="15" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
                        <text x="100" y="154" font-size="9" fill="#0f172a" font-weight="bold" text-anchor="middle">Pb²⁺ bị giữ</text>
                        <circle cx="140" cy="170" r="14" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
                        <text x="140" y="174" font-size="9" fill="#0f172a" font-weight="bold" text-anchor="middle">Hg²⁺ tủa</text>
                        <text x="120" y="85" font-size="11" fill="#38bdf8" font-weight="bold" text-anchor="middle">PROTEIN + KIM LOẠI NẶNG</text>
                        <text x="120" y="235" font-size="11" fill="#10b981" font-weight="bold" text-anchor="middle">🛡️ Bảo vệ niêm mạc dạ dày</text>
                    </svg>
                `;
            }
        } else if (lessonId === 'bai3_baccautruc') {
            if (reagentId === 'ph6') {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <rect x="60" y="50" width="120" height="160" rx="12" fill="rgba(255,255,255,0.06)" stroke="#38bdf8" stroke-width="3"/>
                        <rect x="63" y="90" width="114" height="116" rx="8" fill="rgba(56,189,248,0.2)"/>
                        <!-- Hạt casein phân tán đều, tích điện âm đẩy nhau -->
                        <circle cx="90" cy="120" r="10" fill="#38bdf8" opacity="0.7"/><text x="90" y="123" font-size="8" fill="#fff" text-anchor="middle">(-)</text>
                        <circle cx="145" cy="130" r="10" fill="#38bdf8" opacity="0.7"/><text x="145" y="133" font-size="8" fill="#fff" text-anchor="middle">(-)</text>
                        <circle cx="110" cy="165" r="10" fill="#38bdf8" opacity="0.7"/><text x="110" y="168" font-size="8" fill="#fff" text-anchor="middle">(-)</text>
                        <rect x="50" y="12" width="140" height="24" rx="12" fill="#0284c7" opacity="0.95"/>
                        <text x="120" y="28" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">pH = 6.6: TÍCH ĐIỆN ÂM</text>
                        <text x="120" y="238" font-size="11" fill="#38bdf8" font-weight="bold" text-anchor="middle">Lực đẩy tĩnh điện • Tan phân tán đều</text>
                    </svg>
                `;
            } else {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <rect x="60" y="50" width="120" height="160" rx="12" fill="rgba(255,255,255,0.06)" stroke="#facc15" stroke-width="3"/>
                        <!-- Khối sữa chua đông đặc mịn -->
                        <rect x="63" y="90" width="114" height="116" rx="8" fill="rgba(254,240,138,0.6)"/>
                        <ellipse cx="120" cy="135" rx="45" ry="25" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
                        <text x="120" y="139" font-size="11" fill="#854d0e" font-weight="bold" text-anchor="middle">ĐÔNG TỤ CASEIN</text>
                        <rect x="40" y="12" width="160" height="24" rx="12" fill="#ca8a04" opacity="0.95"/>
                        <text x="120" y="28" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">pH = 4.6 (pI): ĐIỆN TÍCH = 0</text>
                        <text x="120" y="238" font-size="11" fill="#eab308" font-weight="bold" text-anchor="middle">Độ tan cực tiểu • Đông tụ tạo sữa chua</text>
                    </svg>
                `;
            }
        } else if (lessonId === 'bai4_phanungmau') {
            if (reagentId === 'biuret_test') {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#c084fc" stroke-width="4"/>
                        <path d="M72,110 L72,200 A48,48 0 0,0 168,200 L168,110 Z" fill="rgba(168,85,247,0.7)"/>
                        <text x="120" y="155" font-size="13" fill="#ffffff" font-weight="bold" text-anchor="middle">TÍM BIURET</text>
                        <text x="120" y="175" font-size="10" fill="#e9d5ff" text-anchor="middle">Phức Cu²⁺ đa peptide (≥ 2 LK)</text>
                        <rect x="55" y="6" width="130" height="22" rx="11" fill="#7e22ce" opacity="0.95"/>
                        <text x="120" y="21" font-size="10" fill="#fff" font-weight="bold" text-anchor="middle">Cu(OH)₂ / MÔI TRƯỜNG KIỀM</text>
                    </svg>
                `;
            } else {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#facc15" stroke-width="4"/>
                        <path d="M72,120 L72,200 A48,48 0 0,0 168,200 L168,120 Z" fill="rgba(234,179,8,0.85)"/>
                        <circle cx="105" cy="170" r="12" fill="#ca8a04"/>
                        <circle cx="135" cy="185" r="14" fill="#a16207"/>
                        <text x="120" y="150" font-size="13" fill="#ffffff" font-weight="bold" text-anchor="middle">KẾT TỦA VÀNG</text>
                        <text x="120" y="170" font-size="9" fill="#fef08a" text-anchor="middle">Nitro hóa vòng Benzen</text>
                        <rect x="60" y="6" width="120" height="22" rx="11" fill="#a16207" opacity="0.95"/>
                        <text x="120" y="21" font-size="10" fill="#fff" font-weight="bold" text-anchor="middle">HNO₃ ĐẶC NÓNG</text>
                    </svg>
                `;
            }
        } else if (lessonId === 'bai5_enzyme_app') {
            if (reagentId === 'starch_amylase') {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#38bdf8" stroke-width="4"/>
                        <path d="M72,130 L72,200 A48,48 0 0,0 168,200 L168,130 Z" fill="rgba(56,189,248,0.3)"/>
                        <text x="120" y="160" font-size="12" fill="#38bdf8" font-weight="bold" text-anchor="middle">THỦY PHÂN XONG</text>
                        <text x="120" y="180" font-size="9" fill="#bae6fd" text-anchor="middle">Hồ tinh bột → Maltose/Glucose</text>
                        <rect x="45" y="10" width="150" height="24" rx="12" fill="#0284c7" opacity="0.95"/>
                        <text x="120" y="26" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">TINH BỘT + AMYLASE</text>
                        <text x="120" y="240" font-size="11" fill="#38bdf8" font-weight="bold" text-anchor="middle">Nhỏ I₂: KHÔNG còn màu xanh tím</text>
                    </svg>
                `;
            } else {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#c084fc" stroke-width="4"/>
                        <path d="M72,120 L72,200 A48,48 0 0,0 168,200 L168,120 Z" fill="rgba(168,85,247,0.4)"/>
                        <text x="120" y="155" font-size="12" fill="#c084fc" font-weight="bold" text-anchor="middle">KHÔNG PHẢN ỨNG</text>
                        <text x="120" y="175" font-size="9" fill="#e9d5ff" text-anchor="middle">Amylase không phân giải protein</text>
                        <rect x="45" y="10" width="150" height="24" rx="12" fill="#7e22ce" opacity="0.95"/>
                        <text x="120" y="26" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">ALBUMIN + AMYLASE</text>
                        <text x="120" y="240" font-size="11" fill="#c084fc" font-weight="bold" text-anchor="middle">Đặc hiệu cao: Ổ khóa - Chìa khóa</text>
                    </svg>
                `;
            }
        } else if (lessonId === 'bai6_phanung_dongian') {
            if (reagentId === 'raw_potato') {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <defs>
                            <linearGradient id="foamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
                                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6"/>
                            </linearGradient>
                        </defs>
                        <!-- Ống nghiệm -->
                        <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#00f2fe" stroke-width="4"/>
                        <!-- Dung dịch H2O2 -->
                        <path d="M72,130 L72,200 A48,48 0 0,0 168,200 L168,130 Z" fill="rgba(56,189,248,0.3)"/>
                        <!-- Lát khoai tây sống -->
                        <ellipse cx="120" cy="210" rx="32" ry="16" fill="#ca8a04" stroke="#eab308" stroke-width="2"/>
                        <text x="120" y="214" font-size="11" fill="#fff" font-weight="bold" text-anchor="middle">Catalase sống</text>
                        <!-- Bọt khí sủi cuồn cuộn O2 -->
                        <g class="sim-bubbles">
                            <circle cx="100" cy="180" r="7" fill="url(#foamGrad)"><animate attributeName="cy" values="180;40" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite"/></circle>
                            <circle cx="135" cy="190" r="9" fill="url(#foamGrad)"><animate attributeName="cy" values="190;30" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite"/></circle>
                            <circle cx="115" cy="150" r="11" fill="url(#foamGrad)"><animate attributeName="cy" values="150;20" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle>
                            <circle cx="85" cy="160" r="6" fill="url(#foamGrad)"><animate attributeName="cy" values="160;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.3s" repeatCount="indefinite"/></circle>
                            <circle cx="145" cy="170" r="8" fill="url(#foamGrad)"><animate attributeName="cy" values="170;25" dur="1.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.1s" repeatCount="indefinite"/></circle>
                        </g>
                        <!-- Nhãn bọt khí O2 -->
                        <rect x="75" y="10" width="90" height="24" rx="12" fill="#0284c7" opacity="0.9"/>
                        <text x="120" y="26" font-size="12" fill="#fff" font-weight="bold" text-anchor="middle">SỦI BỌT O2 ↑↑</text>
                    </svg>
                `;
            } else {
                contentSvg = `
                    <svg viewBox="0 0 240 260" class="sim-svg">
                        <!-- Ống nghiệm -->
                        <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#94a3b8" stroke-width="4"/>
                        <!-- Dung dịch H2O2 yên lặng -->
                        <path d="M72,130 L72,200 A48,48 0 0,0 168,200 L168,130 Z" fill="rgba(56,189,248,0.2)"/>
                        <!-- Lát khoai luộc chín -->
                        <ellipse cx="120" cy="210" rx="32" ry="16" fill="#78350f" stroke="#a16207" stroke-width="2"/>
                        <text x="120" y="214" font-size="10" fill="#fef08a" font-weight="bold" text-anchor="middle">Luộc chín (Biến tính)</text>
                        <!-- Nhãn yên lặng -->
                        <rect x="65" y="10" width="110" height="24" rx="12" fill="#334155" opacity="0.9"/>
                        <text x="120" y="26" font-size="12" fill="#94a3b8" font-weight="bold" text-anchor="middle">KHÔNG SỦI BỌT</text>
                    </svg>
                `;
            }
        } else {
            // Mặc định: mô phỏng chung
            contentSvg = `
                <svg viewBox="0 0 240 260" class="sim-svg">
                    <path d="M70,20 L70,200 A50,50 0 0,0 170,200 L170,20" fill="rgba(255,255,255,0.06)" stroke="#00f2fe" stroke-width="4"/>
                    <path d="M72,120 L72,200 A48,48 0 0,0 168,200 L168,120 Z" fill="rgba(0,242,254,0.3)"/>
                    <text x="120" y="165" font-size="12" fill="#fff" font-weight="bold" text-anchor="middle">MÔ PHỎNG ẢO</text>
                    <text x="120" y="185" font-size="10" fill="#a5f3fc" text-anchor="middle">Trạng thái phản ứng</text>
                </svg>
            `;
        }

        return `
            <div class="lab-simulation-visual">
                ${contentSvg}
            </div>
        `;
    }

    /* =========================================================================
       9. KIỂM TRA TỔNG HỢP KIẾN THỨC 12 CÂU CHUẨN ĐỀ THẦY & BẢNG VÀNG XẾP HẠNG
       ========================================================================= */
    renderExamRanking12H() {
        const container = document.getElementById('examRankingContainer');
        if (!container || !window.EXAM_12H_DATA) return;

        const questions = window.EXAM_12H_DATA;
        const state = this.exam12hState;
        const leaderboard = this.getExam12HLeaderboard();

        // 1. Trạng thái Chưa bắt đầu thi
        if (!state.started && !state.finished) {
            container.innerHTML = `
                <div class="exam-12h-wrapper">
                    <div class="exam-12h-hero">
                        <span class="p12h-tag">CHUYÊN ĐỀ HÓA 12 · THPT CHUYÊN HÙNG VƯƠNG (TRANG 14–16/16)</span>
                        <h2 class="exam-12h-title">🏆 Kiểm Tra Tổng Hợp Kiến Thức &amp; Bảng Vàng Xếp Hạng</h2>
                        <p class="exam-12h-desc">Bộ đề 12 câu trắc nghiệm bao quát toàn bộ tài liệu lí thuyết của thầy phát: Khái niệm, Phân loại, 4 bậc cấu trúc, Biến tính, Đông tụ, Phản ứng màu, Enzyme và các phản ứng đặc trưng!</p>
                    </div>

                    <div class="exam-start-card">
                        <h3 class="exam-card-title">📝 ĐIỀN THÔNG TIN THÍ SINH THAM GIA XẾP HẠNG</h3>
                        <div class="exam-form-grid">
                            <label class="exam-field">
                                <span class="exam-lbl">Họ và tên học sinh (*):</span>
                                <input type="text" id="examCandidateName" class="exam-input" placeholder="Ví dụ: Nguyễn Văn An" value="${this.escapeHtml(state.student.name || '')}">
                            </label>
                            <label class="exam-field">
                                <span class="exam-lbl">Lớp:</span>
                                <input type="text" id="examCandidateClass" class="exam-input" placeholder="12H" value="${this.escapeHtml(state.student.class || '12H')}">
                            </label>
                            <label class="exam-field">
                                <span class="exam-lbl">Trường:</span>
                                <input type="text" id="examCandidateSchool" class="exam-input" placeholder="THPT Chuyên Hùng Vương" value="${this.escapeHtml(state.student.school || 'THPT Chuyên Hùng Vương')}">
                            </label>
                        </div>

                        <div class="exam-meta-box">
                            <div class="meta-item">📊 <strong>Số lượng:</strong> 12 câu trắc nghiệm 4 phương án</div>
                            <div class="meta-item">⏱️ <strong>Thời gian làm bài:</strong> 15 phút (900 giây)</div>
                            <div class="meta-item">🎯 <strong>Thang điểm:</strong> 10.0 điểm</div>
                            <div class="meta-item">🥇 <strong>Xếp hạng:</strong> Tự động tính điểm & vinh danh trên Bảng Vàng</div>
                        </div>

                        <button class="btn-start-exam" onclick="window.educationMgr.startExam12H()">
                            🚀 BẮT ĐẦU LÀM BÀI THI NGAY
                        </button>
                    </div>

                    <!-- BẢNG VÀNG XẾP HẠNG HIỆN TẠI -->
                    <div class="exam-leaderboard-box">
                        <div class="elb-header">
                            <div>
                                <h3 class="elb-title">🥇 BẢNG VÀNG XẾP HẠNG THÍ SINH XUẤT SẮC (TOP HỌC SINH 12H)</h3>
                                <p class="elb-desc">Vinh danh các bạn học sinh có điểm số cao nhất và tốc độ làm bài nhanh nhất:</p>
                            </div>
                        </div>

                        ${leaderboard.length === 0 ? `
                            <div class="elb-empty-state" style="text-align: center; padding: 36px 16px; background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px dashed rgba(56, 189, 248, 0.25); margin-top: 12px;">
                                <div style="font-size: 36px; margin-bottom: 8px;">🎯</div>
                                <div style="font-weight: 700; color: #f1f5f9; font-size: 1.05rem; margin-bottom: 4px;">Chưa có lượt nộp bài nào trên hệ thống</div>
                                <div style="font-size: 0.88rem; color: #94a3b8;">Bảng xếp hạng lưu trữ kết quả thực tế của học sinh sau khi làm bài. Hãy hoàn thành 12 câu hỏi để trở thành Thủ khoa đầu tiên ghi danh trên Bảng Vàng!</div>
                            </div>
                        ` : `
                        <div class="elb-table-wrap">
                            <table class="elb-table">
                                <thead>
                                    <tr>
                                        <th>Hạng</th>
                                        <th>Họ và Tên</th>
                                        <th>Lớp</th>
                                        <th>Trường</th>
                                        <th>Số Câu Đúng</th>
                                        <th>Điểm Số</th>
                                        <th>Thời Gian</th>
                                        <th>Danh Hiệu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${leaderboard.map((item, idx) => {
                                        let medal = `#${idx + 1}`;
                                        if (idx === 0) medal = '🥇 Hạng 1';
                                        else if (idx === 1) medal = '🥈 Hạng 2';
                                        else if (idx === 2) medal = '🥉 Hạng 3';

                                        return `
                                            <tr class="${idx < 3 ? 'top-row' : ''}">
                                                <td><span class="rank-badge rank-${idx + 1}">${medal}</span></td>
                                                <td><strong>${this.escapeHtml(item.name)}</strong></td>
                                                <td><span class="class-tag">${this.escapeHtml(item.class)}</span></td>
                                                <td>${this.escapeHtml(item.school)}</td>
                                                <td><strong>${item.correctCount}/12</strong></td>
                                                <td><span class="score-highlight">${item.score.toFixed(1)} đ</span></td>
                                                <td>${item.timeUsedStr}</td>
                                                <td><span class="badge-title">${this.escapeHtml(item.title)}</span></td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                        `}
                    </div>
                </div>
            `;
            return;
        }

        // 2. Trạng thái Đang làm bài thi
        if (state.started && !state.finished) {
            const minutes = Math.floor(state.timeLeft / 60);
            const seconds = state.timeLeft % 60;
            const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            container.innerHTML = `
                <div class="exam-12h-wrapper">
                    <!-- THANH ĐIỀU KHIỂN & ĐỒNG HỒ NỔI TRÊN CÙNG -->
                    <div class="exam-sticky-topbar">
                        <div class="exam-topbar-info">
                            <span class="cand-name">👤 Thí sinh: <strong>${this.escapeHtml(state.student.name)}</strong> (${this.escapeHtml(state.student.class)})</span>
                            <span class="cand-prog">Đã trả lời: <strong>${Object.keys(state.answers).length} / 12</strong> câu</span>
                        </div>
                        <div class="exam-topbar-timer ${state.timeLeft < 180 ? 'timer-urgent' : ''}">
                            ⏱️ CÒN LẠI: <strong id="examLiveClock">${timeStr}</strong>
                        </div>
                    </div>

                    <!-- DANH SÁCH 12 CÂU HỎI -->
                    <div class="exam-questions-list">
                        ${questions.map((q, idx) => {
                            const chosenOpt = state.answers[q.id];

                            return `
                                <div class="exam-question-card ${chosenOpt !== undefined ? 'answered' : ''}">
                                    <div class="eqc-header">
                                        <span class="eqc-num">CÂU ${idx + 1} / 12:</span>
                                        <span class="eqc-badge">${chosenOpt !== undefined ? '✓ Đã chọn' : 'Chưa làm'}</span>
                                    </div>
                                    <div class="eqc-prompt">${this.escapeHtml(q.q)}</div>
                                    <div class="eqc-options">
                                        ${q.options.map((opt, optIdx) => `
                                            <button class="eqc-opt-btn ${chosenOpt === optIdx ? 'selected' : ''}" onclick="window.educationMgr.onExamAnswerSelected('${q.id}', ${optIdx})">
                                                ${this.escapeHtml(opt)}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="exam-submit-bar">
                        <button class="btn-submit-exam" onclick="window.educationMgr.submitExam12H()">
                            📝 HOÀN THÀNH &amp; NỘP BÀI THI NGAY
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // 3. Trạng thái Đã nộp bài và xem kết quả + Bảng vàng
        if (state.finished) {
            container.innerHTML = `
                <div class="exam-12h-wrapper">
                    <!-- KHUNG KẾT QUẢ THI -->
                    <div class="exam-result-banner">
                        <span class="p12h-tag">KẾT QUẢ KIỂM TRA CHUYÊN ĐỀ HÓA 12</span>
                        <h2 class="exam-result-score">${state.score.toFixed(1)} / 10.0 ĐIỂM</h2>
                        <div class="exam-result-sub">
                            Thí sinh: <strong>${this.escapeHtml(state.student.name)}</strong> · Lớp: <strong>${this.escapeHtml(state.student.class)}</strong> · Đúng: <strong>${state.correctCount}/12 câu</strong>
                        </div>
                        <div class="exam-result-actions">
                            <button class="btn-exam-retake" onclick="window.educationMgr.resetExam12H()">
                                🔄 Làm Lại Bài Thi Để Nâng Cao Điểm Số
                            </button>
                        </div>
                    </div>

                    <!-- CHI TIẾT BÀI LÀM CÓ LỜI GIẢI CỦA THẦY -->
                    <div class="exam-review-box">
                        <h3 class="elb-title">📋 CHI TIẾT ĐÁP ÁN &amp; LỜI GIẢI CHUẨN TỪ TỜ ĐỀ CỦA THẦY PHÁT:</h3>
                        <div class="exam-questions-list">
                            ${questions.map((q, idx) => {
                                const userOpt = state.answers[q.id];
                                const isCorrect = userOpt === q.answer;

                                return `
                                    <div class="exam-question-card ${isCorrect ? 'rev-correct' : 'rev-wrong'}">
                                        <div class="eqc-header">
                                            <span class="eqc-num">CÂU ${idx + 1}: ${isCorrect ? '🎉 ĐÚNG' : '⚠️ SAI'}</span>
                                        </div>
                                        <div class="eqc-prompt">${this.escapeHtml(q.q)}</div>
                                        <div class="eqc-options">
                                            ${q.options.map((opt, optIdx) => {
                                                const isTarget = q.answer === optIdx;
                                                const isChosen = userOpt === optIdx;
                                                let optClass = '';
                                                if (isTarget) optClass = 'opt-target-correct';
                                                else if (isChosen) optClass = 'opt-user-wrong';

                                                return `
                                                    <div class="eqc-opt-review ${optClass}">
                                                        ${this.escapeHtml(opt)} ${isTarget ? ' (Đáp án đúng)' : (isChosen ? ' (Bạn chọn)' : '')}
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                        <div class="eqc-explain-box">
                                            <strong>💡 Giải thích chi tiết:</strong> ${this.escapeHtml(q.explain)}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- BẢNG VÀNG CẬP NHẬT -->
                    <div class="exam-leaderboard-box">
                        <h3 class="elb-title">🥇 BẢNG VÀNG XẾP HẠNG HỌC SINH SAU KHI NỘP BÀI:</h3>
                        ${leaderboard.length === 0 ? `
                            <div class="elb-empty-state" style="text-align: center; padding: 36px 16px; background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px dashed rgba(56, 189, 248, 0.25); margin-top: 12px;">
                                <div style="font-size: 36px; margin-bottom: 8px;">🎯</div>
                                <div style="font-weight: 700; color: #f1f5f9; font-size: 1.05rem; margin-bottom: 4px;">Chưa có lượt nộp bài nào trên hệ thống</div>
                            </div>
                        ` : `
                        <div class="elb-table-wrap">
                            <table class="elb-table">
                                <thead>
                                    <tr>
                                        <th>Hạng</th>
                                        <th>Họ và Tên</th>
                                        <th>Lớp</th>
                                        <th>Trường</th>
                                        <th>Số Câu Đúng</th>
                                        <th>Điểm Số</th>
                                        <th>Thời Gian</th>
                                        <th>Danh Hiệu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${leaderboard.map((item, idx) => `
                                        <tr class="${item.name === state.student.name ? 'current-user-row' : ''}">
                                            <td><span class="rank-badge rank-${idx + 1}">#${idx + 1}</span></td>
                                            <td><strong>${this.escapeHtml(item.name)}</strong> ${item.name === state.student.name ? '⭐ (Bạn)' : ''}</td>
                                            <td><span class="class-tag">${this.escapeHtml(item.class)}</span></td>
                                            <td>${this.escapeHtml(item.school)}</td>
                                            <td><strong>${item.correctCount}/12</strong></td>
                                            <td><span class="score-highlight">${item.score.toFixed(1)} đ</span></td>
                                            <td>${item.timeUsedStr}</td>
                                            <td><span class="badge-title">${this.escapeHtml(item.title)}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        `}
                    </div>
                </div>
            `;
        }
    }

    startExam12H() {
        const nameInput = document.getElementById('examCandidateName');
        const classInput = document.getElementById('examCandidateClass');
        const schoolInput = document.getElementById('examCandidateSchool');

        const name = (nameInput ? nameInput.value : '').trim();
        const cls = (classInput ? classInput.value : '12H').trim() || '12H';
        const sch = (schoolInput ? schoolInput.value : 'THPT Chuyên Hùng Vương').trim() || 'THPT Chuyên Hùng Vương';

        if (!name) {
            alert('Vui lòng nhập Họ và tên học sinh để tham gia xếp hạng thi đua!');
            if (nameInput) nameInput.focus();
            return;
        }

        this.exam12hState = {
            started: true,
            finished: false,
            score: 0,
            correctCount: 0,
            answers: {},
            timeLeft: 900,
            timer: null,
            student: { name, class: cls, school: sch }
        };

        // Bắt đầu đếm ngược
        this.exam12hState.timer = setInterval(() => {
            this.exam12hState.timeLeft--;
            const clockEl = document.getElementById('examLiveClock');
            if (clockEl) {
                const minutes = Math.floor(this.exam12hState.timeLeft / 60);
                const seconds = this.exam12hState.timeLeft % 60;
                clockEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }

            if (this.exam12hState.timeLeft <= 0) {
                clearInterval(this.exam12hState.timer);
                alert('Đã hết 15 phút thời gian làm bài! Hệ thống tự động thu bài và chấm điểm.');
                this.submitExam12H();
            }
        }, 1000);

        if (window.app) window.app.playSound('click');
        this.renderExamRanking12H();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onExamAnswerSelected(qId, optIdx) {
        this.exam12hState.answers[qId] = optIdx;
        if (window.app) window.app.playSound('click');
        this.renderExamRanking12H();
    }

    submitExam12H() {
        if (this.exam12hState.timer) {
            clearInterval(this.exam12hState.timer);
        }

        const questions = window.EXAM_12H_DATA;
        let correct = 0;

        questions.forEach(q => {
            if (this.exam12hState.answers[q.id] === q.answer) {
                correct++;
            }
        });

        const score = (correct / questions.length) * 10;
        const timeUsedSeconds = 900 - this.exam12hState.timeLeft;
        const timeMin = Math.floor(timeUsedSeconds / 60);
        const timeSec = timeUsedSeconds % 60;
        const timeUsedStr = `${timeMin}p ${String(timeSec).padStart(2, '0')}s`;

        let title = 'Học viên Chuyên Cần';
        if (score >= 9.5) title = 'Thần Đồng Hóa Học 12H';
        else if (score >= 8.0) title = 'Học Sinh Xuất Sắc';
        else if (score >= 6.5) title = 'Nắm Vững Lí Thuyết';

        this.exam12hState.finished = true;
        this.exam12hState.score = score;
        this.exam12hState.correctCount = correct;

        // Lưu vào leaderboard
        const resultItem = {
            name: this.exam12hState.student.name,
            class: this.exam12hState.student.class,
            school: this.exam12hState.student.school,
            score: score,
            correctCount: correct,
            timeUsedSeconds: timeUsedSeconds,
            timeUsedStr: timeUsedStr,
            title: title,
            timestamp: Date.now()
        };

        this.saveExam12HResult(resultItem);

        if (score >= 8.0) {
            if (window.app) window.app.playSound('success');
        } else {
            if (window.app) window.app.playSound('beep');
        }

        this.renderExamRanking12H();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    resetExam12H() {
        if (this.exam12hState.timer) {
            clearInterval(this.exam12hState.timer);
        }

        this.exam12hState = {
            started: false,
            finished: false,
            score: 0,
            correctCount: 0,
            answers: {},
            timeLeft: 900,
            timer: null,
            student: { ...this.exam12hState.student }
        };

        if (window.app) window.app.playSound('click');
        this.renderExamRanking12H();
    }

    getExam12HLeaderboard() {
        let stored = [];
        try {
            stored = JSON.parse(localStorage.getItem('px_exam12h_leaderboard') || '[]');
            if (!Array.isArray(stored)) stored = [];
        } catch {
            stored = [];
        }

        // Sắp xếp theo điểm giảm dần, sau đó theo thời gian làm tăng dần (dữ liệu thật của học sinh)
        const list = [...stored];
        list.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.timeUsedSeconds - b.timeUsedSeconds;
        });

        return list.slice(0, 20);
    }

    saveExam12HResult(result) {
        try {
            let list = JSON.parse(localStorage.getItem('px_exam12h_leaderboard') || '[]');
            if (!Array.isArray(list)) list = [];
            list.unshift(result);
            localStorage.setItem('px_exam12h_leaderboard', JSON.stringify(list.slice(0, 50)));

            // Gửi dữ liệu nộp bài thi lên máy chủ nếu backend khả dụng
            fetch('/api/exams/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result)
            }).catch(() => {});
        } catch (e) {
            console.error('Cannot save exam leaderboard', e);
        }
    }

    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Khởi tạo global instance
window.EducationManager = EducationManager;

