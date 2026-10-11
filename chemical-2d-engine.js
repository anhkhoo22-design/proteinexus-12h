/**
 * PROTEINEXUS 3D - CHEMICAL 2D STRUCTURE ENGINE (BẢNG HÌNH HỌC 2D CHUẨN SGK HÓA 12)
 * Động cơ kết xuất hình học 2D công thức cấu tạo hóa học chuẩn mực:
 * - Hỗ trợ chế độ nền giấy trắng SGK (#ffffff) dịu mắt, độ tương phản cao, chuẩn học sinh cấp 3
 * - Hiển thị tường minh nguyên tố C, H, O, N, S, Fe và các liên kết đơn (-), đôi (=), phối trí (->)
 * - Khung nổi bật liên kết peptide (-CO-NH-)
 * - Cung cấp bộ sơ đồ 2D cho toàn bộ Bậc 1, Bậc 2 (Xoắn α & Phiến β), Bậc 3 (4 lực liên kết), Bậc 4 (Hemoglobin & Nhân Heme)
 * - Cơ chế phản ứng đông tụ (biến tính), thủy phân peptide và tạo phức màu Biuret [Cu(Peptide)₂]²⁻
 * - 100% font chữ tiếng Việt chuẩn xác ('Be Vietnam Pro'), không bao giờ bị lỗi font!
 */

class Chemical2DEngine {
    constructor() {
        // Chế độ hiển thị: true = Nền trắng giấy SGK (#ffffff), false = Cyber dark mode
        this.isWhiteBg = true;

        // Bảng tra cứu 20 amino acid chuẩn SGK Hóa 12
        this.aminoAcidRChains = {
            'GLY': { name: 'Glycine', formula: 'H', rHtml: '—H', mw: 75, type: 'Đặc biệt (Nhỏ nhất, không bất đối)', desc: 'R là nguyên tử H' },
            'ALA': { name: 'Alanine', formula: 'CH3', rHtml: '—CH₃', mw: 89, type: 'No, không phân cực', desc: 'R là nhóm methyl —CH₃' },
            'VAL': { name: 'Valine', formula: 'CH(CH3)2', rHtml: '—CH(CH₃)₂', mw: 117, type: 'Mạch nhánh, kỵ nước', desc: 'R là nhóm isopropyl' },
            'LEU': { name: 'Leucine', formula: 'CH2-CH(CH3)2', rHtml: '—CH₂—CH(CH₃)₂', mw: 131, type: 'Mạch nhánh, kỵ nước', desc: 'R là nhóm isobutyl' },
            'ILE': { name: 'Isoleucine', formula: 'CH(CH3)CH2CH3', rHtml: '—CH(CH₃)CH₂CH₃', mw: 131, type: 'Mạch nhánh, kỵ nước', desc: 'R là nhóm sec-butyl' },
            'SER': { name: 'Serine', formula: 'CH2OH', rHtml: '—CH₂—OH', mw: 105, type: 'Phân cực, chứa nhóm -OH', desc: 'R chứa nhóm hydroxyl —OH' },
            'THR': { name: 'Threonine', formula: 'CH(OH)CH3', rHtml: '—CH(OH)CH₃', mw: 119, type: 'Phân cực, chứa nhóm -OH', desc: 'R chứa nhóm hydroxyl —OH' },
            'CYS': { name: 'Cysteine', formula: 'CH2SH', rHtml: '—CH₂—SH', mw: 121, type: 'Chứa lưu huỳnh (-SH)', desc: 'Tạo cầu nối disulfide —S—S—' },
            'MET': { name: 'Methionine', formula: 'CH2CH2SCH3', rHtml: '—CH₂CH₂—S—CH₃', mw: 149, type: 'Chứa lưu huỳnh thioether', desc: 'Amino acid mở đầu dịch mã' },
            'ASP': { name: 'Aspartic acid', formula: 'CH2COOH', rHtml: '—CH₂—COOH', mw: 133, type: 'Axit (tích điện âm -COO-)', desc: 'R chứa thêm 1 nhóm —COOH' },
            'GLU': { name: 'Glutamic acid', formula: 'CH2CH2COOH', rHtml: '—(CH₂)₂—COOH', mw: 147, type: 'Axit (tích điện âm -COO-)', desc: 'R chứa thêm 1 nhóm —COOH' },
            'ASN': { name: 'Asparagine', formula: 'CH2CONH2', rHtml: '—CH₂—CONH₂', mw: 132, type: 'Phân cực mang nhóm amide', desc: 'R mang nhóm —CONH₂' },
            'GLN': { name: 'Glutamine', formula: 'CH2CH2CONH2', rHtml: '—(CH₂)₂—CONH₂', mw: 146, type: 'Phân cực mang nhóm amide', desc: 'R mang nhóm —CONH₂' },
            'LYS': { name: 'Lysine', formula: '(CH2)4NH2', rHtml: '—(CH₂)₄—NH₂', mw: 146, type: 'Bazơ (tích điện dương -NH3+)', desc: 'R chứa thêm 1 nhóm —NH₂' },
            'ARG': { name: 'Arginine', formula: '(CH2)3NHC(=NH)NH2', rHtml: '—(CH₂)₃—NH—C(=NH)NH₂', mw: 174, type: 'Bazơ mạnh (Guanidine)', desc: 'R mang nhóm guanidinium' },
            'HIS': { name: 'Histidine', formula: 'CH2-C3H3N2', rHtml: '—CH₂—(vòng imidazole)', mw: 155, type: 'Bazơ thơm imidazole', desc: 'Nhóm imidazole phối trí ion kim loại Fe2+' },
            'PHE': { name: 'Phenylalanine', formula: 'CH2-C6H5', rHtml: '—CH₂—C₆H₅', mw: 165, type: 'Nhân thơm (vòng benzen)', desc: 'Phản ứng Xanthoproteic (+)' },
            'TYR': { name: 'Tyrosine', formula: 'CH2-C6H4OH', rHtml: '—CH₂—C₆H₄—OH', mw: 181, type: 'Nhân thơm mang nhóm -OH phenol', desc: 'Phản ứng Xanthoproteic (+)' },
            'TRP': { name: 'Tryptophan', formula: 'CH2-C8H6N', rHtml: '—CH₂—(vòng indole)', mw: 204, type: 'Nhân thơm indole lớn', desc: 'Phản ứng Xanthoproteic (+)' },
            'PRO': { name: 'Proline', formula: 'C3H6 (vòng imino)', rHtml: 'Vòng khép kín imino', mw: 115, type: 'Imino axit đặc biệt', desc: 'Làm bẻ cong gãy khúc xoắn alpha' }
        };
    }

    // Toggle màu nền toàn cục (Nền giấy trắng SGK ⇄ Cyber Biotech)
    setWhiteBgMode(isWhite) {
        this.isWhiteBg = !!isWhite;
    }

    /* =========================================================================
       1. CẤU TRÚC BẬC 1: XƯƠNG SỐNG CHUỖI MẠCH THẲNG TUYẾN TÍNH
       ========================================================================= */
    generateLevel1BackboneSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const strokeColor = isWhiteBg ? '#1e293b' : '#94a3b8';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBg = isWhiteBg ? '#f8fafc' : 'rgba(255,255,255,0.03)';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';
        const peptideBoxBg = isWhiteBg ? '#eff6ff' : 'rgba(168,85,247,0.15)';
        const peptideBoxBorder = isWhiteBg ? '#3b82f6' : '#a855f7';
        const peptideTitleColor = isWhiteBg ? '#1d4ed8' : '#c084fc';

        return `
            <svg viewBox="0 0 920 280" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <!-- Khung viền và tiêu đề chuẩn SGK -->
                <rect x="2" y="2" width="916" height="276" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>
                
                <!-- Thanh chú thích nguyên tố -->
                <g transform="translate(25, 26)">
                    <text x="0" y="0" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="600">KÝ HIỆU NGUYÊN TỐ:</text>
                    <circle cx="120" cy="-4" r="7" fill="${isWhiteBg ? '#0f172a' : '#f1f5f9'}"/>
                    <text x="132" y="0" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold">C (Carbon)</text>
                    <circle cx="215" cy="-4" r="7" fill="#2563eb"/>
                    <text x="227" y="0" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold">N (Nitơ)</text>
                    <circle cx="295" cy="-4" r="7" fill="#dc2626"/>
                    <text x="307" y="0" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold">O (Oxy)</text>
                    <circle cx="375" cy="-4" r="7" fill="${subTextColor}"/>
                    <text x="387" y="0" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold">H (Hydro)</text>
                    <circle cx="455" cy="-4" r="7" fill="#d97706"/>
                    <text x="467" y="0" fill="#d97706" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold">R (Mạch bên)</text>
                </g>

                <!-- 1. ĐẦU N (AMINO-TERMINAL) -->
                <g transform="translate(30, 140)">
                    <rect x="0" y="-36" width="95" height="72" rx="8" fill="${isWhiteBg ? '#e0f2fe' : 'rgba(14,165,233,0.2)'}" stroke="#0284c7" stroke-width="2"/>
                    <text x="47" y="2" fill="#0284c7" font-family="JetBrains Mono, monospace" font-size="17" font-weight="bold" text-anchor="middle">H₂N—</text>
                    <text x="47" y="22" fill="#0369a1" font-family="Be Vietnam Pro, sans-serif" font-size="10" font-weight="600" text-anchor="middle">ĐẦU N (Tự do)</text>
                </g>
                <line x1="125" y1="140" x2="160" y2="140" stroke="${strokeColor}" stroke-width="3"/>

                <!-- GỐC 1: Glycine (R1 = H) -->
                <!-- Calpha 1 -->
                <circle cx="185" cy="140" r="22" fill="${isWhiteBg ? '#dcfce7' : 'rgba(16,185,129,0.25)'}" stroke="#16a34a" stroke-width="2.5"/>
                <text x="185" y="146" fill="#15803d" font-family="JetBrains Mono, monospace" font-size="15" font-weight="bold" text-anchor="middle">Cα₁</text>
                <!-- H dưới -->
                <line x1="185" y1="162" x2="185" y2="186" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="185" cy="196" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                <text x="185" y="200" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>
                <!-- R1 = H trên -->
                <line x1="185" y1="118" x2="185" y2="94" stroke="#d97706" stroke-width="2"/>
                <rect x="155" y="60" width="60" height="34" rx="6" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1.5"/>
                <text x="185" y="78" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">—H</text>
                <text x="185" y="90" fill="#92400e" font-family="Be Vietnam Pro, sans-serif" font-size="8" text-anchor="middle">R₁ (Gly)</text>

                <!-- Liên kết Calpha1 - C1 -->
                <line x1="207" y1="140" x2="240" y2="140" stroke="${strokeColor}" stroke-width="3"/>

                <!-- KHUNG NỔI BẬT LIÊN KẾT PEPTIDE 1 (-CO-NH-) -->
                <rect x="230" y="70" width="135" height="140" rx="10" fill="${peptideBoxBg}" stroke="${peptideBoxBorder}" stroke-width="2" stroke-dasharray="5 3"/>
                <text x="297" y="60" fill="${peptideTitleColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">LIÊN KẾT PEPTIDE #1</text>
                
                <!-- C1(=O) -->
                <circle cx="255" cy="140" r="15" fill="${isWhiteBg ? '#f8fafc' : 'rgba(255,255,255,0.1)'}" stroke="${strokeColor}" stroke-width="2"/>
                <text x="255" y="145" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">C</text>
                <line x1="258" y1="126" x2="272" y2="100" stroke="#dc2626" stroke-width="2.5"/>
                <line x1="252" y1="124" x2="266" y2="98" stroke="#dc2626" stroke-width="2.5"/>
                <circle cx="274" cy="90" r="13" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="2"/>
                <text x="274" y="95" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">O</text>

                <!-- LIÊN KẾT PEPTIDE C-N (1.32 A) -->
                <line x1="270" y1="140" x2="310" y2="140" stroke="${isWhiteBg ? '#2563eb' : '#00f2fe'}" stroke-width="4.5"/>
                <text x="290" y="156" fill="${peptideTitleColor}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">1.32 Å</text>

                <!-- N1(-H) -->
                <circle cx="325" cy="140" r="15" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                <text x="325" y="145" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">N</text>
                <line x1="325" y1="155" x2="325" y2="178" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="325" cy="188" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                <text x="325" y="192" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>

                <!-- Nối sang Calpha 2 -->
                <line x1="340" y1="140" x2="380" y2="140" stroke="${strokeColor}" stroke-width="3"/>

                <!-- GỐC 2: Alanine (R2 = CH3) -->
                <circle cx="405" cy="140" r="22" fill="${isWhiteBg ? '#dcfce7' : 'rgba(16,185,129,0.25)'}" stroke="#16a34a" stroke-width="2.5"/>
                <text x="405" y="146" fill="#15803d" font-family="JetBrains Mono, monospace" font-size="15" font-weight="bold" text-anchor="middle">Cα₂</text>
                <line x1="405" y1="162" x2="405" y2="186" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="405" cy="196" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                <text x="405" y="200" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>
                <line x1="405" y1="118" x2="405" y2="94" stroke="#d97706" stroke-width="2"/>
                <rect x="365" y="60" width="80" height="34" rx="6" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1.5"/>
                <text x="405" y="78" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">—CH₃</text>
                <text x="405" y="90" fill="#92400e" font-family="Be Vietnam Pro, sans-serif" font-size="8" text-anchor="middle">R₂ (Ala)</text>

                <!-- Nối sang C2 -->
                <line x1="427" y1="140" x2="460" y2="140" stroke="${strokeColor}" stroke-width="3"/>

                <!-- KHUNG NỔI BẬT LIÊN KẾT PEPTIDE 2 (-CO-NH-) -->
                <rect x="450" y="70" width="135" height="140" rx="10" fill="${peptideBoxBg}" stroke="${peptideBoxBorder}" stroke-width="2" stroke-dasharray="5 3"/>
                <text x="517" y="60" fill="${peptideTitleColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">LIÊN KẾT PEPTIDE #2</text>
                
                <!-- C2(=O) -->
                <circle cx="475" cy="140" r="15" fill="${isWhiteBg ? '#f8fafc' : 'rgba(255,255,255,0.1)'}" stroke="${strokeColor}" stroke-width="2"/>
                <text x="475" y="145" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">C</text>
                <line x1="478" y1="126" x2="492" y2="100" stroke="#dc2626" stroke-width="2.5"/>
                <line x1="472" y1="124" x2="486" y2="98" stroke="#dc2626" stroke-width="2.5"/>
                <circle cx="494" cy="90" r="13" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="2"/>
                <text x="494" y="95" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">O</text>

                <!-- LIÊN KẾT PEPTIDE C-N -->
                <line x1="490" y1="140" x2="530" y2="140" stroke="${isWhiteBg ? '#2563eb' : '#00f2fe'}" stroke-width="4.5"/>
                <text x="510" y="156" fill="${peptideTitleColor}" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">1.32 Å</text>

                <!-- N2(-H) -->
                <circle cx="545" cy="140" r="15" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                <text x="545" y="145" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">N</text>
                <line x1="545" y1="155" x2="545" y2="178" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="545" cy="188" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                <text x="545" y="192" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>

                <!-- Nối sang Calpha 3 -->
                <line x1="560" y1="140" x2="600" y2="140" stroke="${strokeColor}" stroke-width="3"/>

                <!-- GỐC 3: Valine (R3 = CH(CH3)2) -->
                <circle cx="625" cy="140" r="22" fill="${isWhiteBg ? '#dcfce7' : 'rgba(16,185,129,0.25)'}" stroke="#16a34a" stroke-width="2.5"/>
                <text x="625" y="146" fill="#15803d" font-family="JetBrains Mono, monospace" font-size="15" font-weight="bold" text-anchor="middle">Cα₃</text>
                <line x1="625" y1="162" x2="625" y2="186" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="625" cy="196" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                <text x="625" y="200" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>
                <line x1="625" y1="118" x2="625" y2="94" stroke="#d97706" stroke-width="2"/>
                <rect x="575" y="60" width="100" height="34" rx="6" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1.5"/>
                <text x="625" y="78" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">—CH(CH₃)₂</text>
                <text x="625" y="90" fill="#92400e" font-family="Be Vietnam Pro, sans-serif" font-size="8" text-anchor="middle">R₃ (Val)</text>

                <!-- Nối sang C carbonyl cuối -->
                <line x1="647" y1="140" x2="685" y2="140" stroke="${strokeColor}" stroke-width="3"/>
                <circle cx="700" cy="140" r="15" fill="${isWhiteBg ? '#f8fafc' : 'rgba(255,255,255,0.1)'}" stroke="${strokeColor}" stroke-width="2"/>
                <text x="700" y="145" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">C</text>
                <line x1="703" y1="126" x2="717" y2="100" stroke="#dc2626" stroke-width="2.5"/>
                <line x1="697" y1="124" x2="711" y2="98" stroke="#dc2626" stroke-width="2.5"/>
                <circle cx="719" cy="90" r="13" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="2"/>
                <text x="719" y="95" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">O</text>

                <!-- Nối sang ĐẦU C (-COOH) -->
                <line x1="715" y1="140" x2="760" y2="140" stroke="${strokeColor}" stroke-width="3"/>
                <g transform="translate(760, 140)">
                    <rect x="0" y="-36" width="125" height="72" rx="8" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.2)'}" stroke="#dc2626" stroke-width="2"/>
                    <text x="62" y="2" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="17" font-weight="bold" text-anchor="middle">—COOH</text>
                    <text x="62" y="22" fill="#b91c1c" font-family="Be Vietnam Pro, sans-serif" font-size="10" font-weight="600" text-anchor="middle">ĐẦU C (Tự do)</text>
                </g>

                <!-- Dòng ghi chú cốt lõi dưới cùng -->
                <g transform="translate(30, 255)">
                    <text x="0" y="0" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="600">
                        💡 Chuẩn SGK Hóa 12: Chuỗi tripeptide (Gly-Ala-Val) gồm 3 gốc amino acid nối nhau bởi 2 liên kết peptide. Mạch thẳng duỗi tự nhiên, chưa hề cuộn gập.
                    </text>
                </g>
            </svg>
        `;
    }

    /* =========================================================================
       2. CẤU TRÚC BẬC 2: XOẮN ALPHA (α-HELIX) & PHIẾN GẤP BETA (β-SHEET)
       ========================================================================= */
    generateLevel2AlphaHelixSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const strokeColor = isWhiteBg ? '#1e293b' : '#94a3b8';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';
        const hbondColor = isWhiteBg ? '#059669' : '#10b981';

        return `
            <svg viewBox="0 0 920 300" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="916" height="296" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <!-- Tiêu đề sơ đồ -->
                <text x="460" y="28" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
                    CẤU TRÚC BẬC II: XOẮN ALPHA (α-HELIX) &amp; MẠNG LƯỚI LIÊN KẾT HYDROGEN NỘI CHUỖI
                </text>
                <text x="460" y="46" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" text-anchor="middle">
                    Phát hiện bởi Linus Pauling (Nobel 1954) • 3.6 gốc / vòng xoắn • Bước xoắn 0.54 nm • Liên kết hydrogen C=O(i) ···· H-N(i+4)
                </text>

                <!-- Trục xoắn trung tâm (nét chấm gạch) -->
                <line x1="80" y1="165" x2="840" y2="165" stroke="${isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.1)'}" stroke-width="2" stroke-dasharray="8 4"/>
                <text x="845" y="169" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10">Trục xoắn</text>

                <!-- Đường uốn lượn lò xo biểu diễn khung polypeptide -->
                <path d="M 90,210 Q 140,80 190,140 T 290,210 T 390,140 T 490,210 T 590,140 T 690,210 T 790,140" 
                    fill="none" stroke="${isWhiteBg ? '#3b82f6' : '#38bdf8'}" stroke-width="5" stroke-linecap="round"/>

                <!-- Vòng xoắn 1: Gốc i (Vị trí 1) C=O -->
                <g transform="translate(190, 115)">
                    <circle cx="0" cy="0" r="14" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(255,255,255,0.15)'}" stroke="${strokeColor}" stroke-width="2"/>
                    <text x="0" y="5" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">C(i)</text>
                    <line x1="0" y1="-14" x2="0" y2="-32" stroke="#dc2626" stroke-width="3"/>
                    <circle cx="0" cy="-42" r="12" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="2"/>
                    <text x="0" y="-38" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">O</text>
                </g>

                <!-- Gốc i+4 (Vị trí 5) N-H -->
                <g transform="translate(390, 115)">
                    <circle cx="0" cy="0" r="14" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                    <text x="0" y="5" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">N(i+4)</text>
                    <line x1="0" y1="-14" x2="0" y2="-32" stroke="${strokeColor}" stroke-width="2.5"/>
                    <circle cx="0" cy="-42" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                    <text x="0" y="-38" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>
                </g>

                <!-- LIÊN KẾT HYDROGEN 1: Song song với trục xoắn -->
                <line x1="190" y1="73" x2="390" y2="73" stroke="${hbondColor}" stroke-width="3" stroke-dasharray="6 4"/>
                <rect x="250" y="58" width="80" height="24" rx="4" fill="${isWhiteBg ? '#dcfce7' : 'rgba(16,185,129,0.3)'}" stroke="${hbondColor}" stroke-width="1"/>
                <text x="290" y="74" fill="${isWhiteBg ? '#15803d' : '#34d399'}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H-Bond 2.8Å</text>

                <!-- Vòng xoắn 2: Gốc j C=O -->
                <g transform="translate(390, 215)">
                    <circle cx="0" cy="0" r="14" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(255,255,255,0.15)'}" stroke="${strokeColor}" stroke-width="2"/>
                    <text x="0" y="5" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">C(j)</text>
                    <line x1="0" y1="14" x2="0" y2="30" stroke="#dc2626" stroke-width="3"/>
                    <circle cx="0" cy="40" r="12" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="2"/>
                    <text x="0" y="44" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">O</text>
                </g>

                <!-- Gốc j+4 N-H -->
                <g transform="translate(590, 215)">
                    <circle cx="0" cy="0" r="14" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                    <text x="0" y="5" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">N(j+4)</text>
                    <line x1="0" y1="14" x2="0" y2="30" stroke="${strokeColor}" stroke-width="2.5"/>
                    <circle cx="0" cy="40" r="11" fill="${isWhiteBg ? '#f1f5f9' : 'rgba(148,163,184,0.2)'}" stroke="${strokeColor}" stroke-width="1.5"/>
                    <text x="0" y="44" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H</text>
                </g>

                <!-- LIÊN KẾT HYDROGEN 2: Phía dưới -->
                <line x1="390" y1="255" x2="590" y2="255" stroke="${hbondColor}" stroke-width="3" stroke-dasharray="6 4"/>
                <rect x="450" y="243" width="80" height="24" rx="4" fill="${isWhiteBg ? '#dcfce7' : 'rgba(16,185,129,0.3)'}" stroke="${hbondColor}" stroke-width="1"/>
                <text x="490" y="259" fill="${isWhiteBg ? '#15803d' : '#34d399'}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H-Bond 2.8Å</text>

                <!-- Các mạch bên R chìa ra ngoài mặt trụ -->
                <g transform="translate(290, 225)">
                    <line x1="0" y1="0" x2="0" y2="35" stroke="#d97706" stroke-width="2.5"/>
                    <rect x="-35" y="35" width="70" height="24" rx="5" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1.5"/>
                    <text x="0" y="51" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">Gốc R</text>
                </g>
                <g transform="translate(490, 125)">
                    <line x1="0" y1="0" x2="0" y2="-35" stroke="#d97706" stroke-width="2.5"/>
                    <rect x="-35" y="-59" width="70" height="24" rx="5" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1.5"/>
                    <text x="0" y="-43" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">Gốc R</text>
                </g>

                <!-- Thước đo bước xoắn 0.54 nm -->
                <line x1="190" y1="280" x2="390" y2="280" stroke="${subTextColor}" stroke-width="1.5"/>
                <line x1="190" y1="275" x2="190" y2="285" stroke="${subTextColor}" stroke-width="1.5"/>
                <line x1="390" y1="275" x2="390" y2="285" stroke="${subTextColor}" stroke-width="1.5"/>
                <text x="290" y="293" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">Bước xoắn p = 0.54 nm (3.6 gốc amino acid)</text>
            </svg>
        `;
    }

    generateLevel2BetaSheetSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const strokeColor = isWhiteBg ? '#1e293b' : '#94a3b8';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';
        const hbondColor = isWhiteBg ? '#059669' : '#10b981';

        return `
            <svg viewBox="0 0 920 310" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="916" height="306" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <!-- Tiêu đề sơ đồ -->
                <text x="460" y="28" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
                    CẤU TRÚC BẬC II: PHIẾN GẤP BETA (β-PLEATED SHEET) &amp; LIÊN KẾT HYDROGEN LIÊN CHUỖI
                </text>
                <text x="460" y="46" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" text-anchor="middle">
                    Hai đoạn chuỗi chạy đối song (Antiparallel) hoặc song song • Khung ziczac gợn sóng • Gốc R so le trên / dưới
                </text>

                <!-- DẢI 1 (CHUỖI TRÊN - Hướng từ N -> C) -->
                <path d="M 80,105 L 170,80 L 260,105 L 350,80 L 440,105 L 530,80 L 620,105 L 710,80 L 800,105" 
                    fill="none" stroke="${isWhiteBg ? '#f59e0b' : '#facc15'}" stroke-width="4.5" stroke-linejoin="round"/>
                <text x="50" y="110" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Đầu N</text>
                <text x="815" y="110" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Đầu C</text>

                <!-- DẢI 2 (CHUỖI DƯỚI - Hướng từ C -> N : ĐỐI SONG SONG ANTIPARALLEL) -->
                <path d="M 80,215 L 170,240 L 260,215 L 350,240 L 440,215 L 530,240 L 620,215 L 710,240 L 800,215" 
                    fill="none" stroke="${isWhiteBg ? '#f59e0b' : '#facc15'}" stroke-width="4.5" stroke-linejoin="round"/>
                <text x="50" y="220" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Đầu C</text>
                <text x="815" y="220" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">Đầu N</text>

                <!-- CÁC LIÊN KẾT HYDROGEN NỐI 2 DẢI NHƯ BẬC THANG -->
                <!-- Cặp 1 -->
                <g transform="translate(170, 0)">
                    <circle cx="0" cy="80" r="10" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="1.5"/>
                    <text x="0" y="84" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">O</text>
                    
                    <line x1="0" y1="92" x2="0" y2="228" stroke="${hbondColor}" stroke-width="2.5" stroke-dasharray="5 3"/>
                    <text x="14" y="160" fill="${hbondColor}" font-family="JetBrains Mono, monospace" font-size="9">H-bond</text>

                    <circle cx="0" cy="240" r="10" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                    <text x="0" y="244" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">H</text>
                </g>

                <!-- Cặp 2 -->
                <g transform="translate(350, 0)">
                    <circle cx="0" cy="80" r="10" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                    <text x="0" y="84" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">H</text>
                    
                    <line x1="0" y1="92" x2="0" y2="228" stroke="${hbondColor}" stroke-width="2.5" stroke-dasharray="5 3"/>
                    <text x="14" y="160" fill="${hbondColor}" font-family="JetBrains Mono, monospace" font-size="9">H-bond</text>

                    <circle cx="0" cy="240" r="10" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="1.5"/>
                    <text x="0" y="244" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">O</text>
                </g>

                <!-- Cặp 3 -->
                <g transform="translate(530, 0)">
                    <circle cx="0" cy="80" r="10" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="1.5"/>
                    <text x="0" y="84" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">O</text>
                    
                    <line x1="0" y1="92" x2="0" y2="228" stroke="${hbondColor}" stroke-width="2.5" stroke-dasharray="5 3"/>
                    <text x="14" y="160" fill="${hbondColor}" font-family="JetBrains Mono, monospace" font-size="9">H-bond</text>

                    <circle cx="0" cy="240" r="10" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                    <text x="0" y="244" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">H</text>
                </g>

                <!-- Cặp 4 -->
                <g transform="translate(710, 0)">
                    <circle cx="0" cy="80" r="10" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                    <text x="0" y="84" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">H</text>
                    
                    <line x1="0" y1="92" x2="0" y2="228" stroke="${hbondColor}" stroke-width="2.5" stroke-dasharray="5 3"/>
                    <text x="14" y="160" fill="${hbondColor}" font-family="JetBrains Mono, monospace" font-size="9">H-bond</text>

                    <circle cx="0" cy="240" r="10" fill="${isWhiteBg ? '#fee2e2' : 'rgba(244,63,94,0.3)'}" stroke="#dc2626" stroke-width="1.5"/>
                    <text x="0" y="244" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">O</text>
                </g>

                <!-- Các gốc R luân phiên nhô lên trên và chĩa xuống dưới -->
                <g transform="translate(260, 105)">
                    <line x1="0" y1="0" x2="0" y2="-30" stroke="#d97706" stroke-width="2"/>
                    <rect x="-24" y="-48" width="48" height="20" rx="4" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1"/>
                    <text x="0" y="-34" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">R (lên)</text>
                </g>
                <g transform="translate(440, 105)">
                    <line x1="0" y1="0" x2="0" y2="30" stroke="#d97706" stroke-width="2"/>
                    <rect x="-24" y="28" width="48" height="20" rx="4" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.25)'}" stroke="#d97706" stroke-width="1"/>
                    <text x="0" y="42" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">R (xuống)</text>
                </g>

                <g transform="translate(30, 285)">
                    <text x="0" y="0" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11">
                        💡 <strong>Đặc điểm nhận diện:</strong> Khoảng cách giữa 2 gốc kế tiếp dọc dải là <strong>0.35 nm</strong> (duỗi dài hơn xoắn α 0.15 nm). Tơ tằm (Fibroin) chứa 80% phiến gấp β xếp lớp rất bền.
                    </text>
                </g>
            </svg>
        `;
    }

    /* =========================================================================
       3. CẤU TRÚC BẬC 3: 4 LỰC TƯƠNG TÁC QUY ĐỊNH CẤU HÌNH CUỘN GẬP 3D
       ========================================================================= */
    generateLevel3InteractionsSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const cardBg = isWhiteBg ? '#f8fafc' : 'rgba(15,23,42,0.6)';
        const cardBorder = isWhiteBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)';

        return `
            <svg viewBox="0 0 920 380" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="916" height="376" rx="10" fill="none" stroke="${cardBorder}" stroke-width="1.5"/>

                <text x="460" y="28" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">
                    CẤU TRÚC BẬC III: 4 LỰC TƯƠNG TÁC CỐT LÕI DUY TRÌ KHỐI CUỘN GẬP 3D HOÀN CHỈNH
                </text>
                <text x="460" y="46" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" text-anchor="middle">
                    Bao gồm 1 liên kết cộng hóa trị bền vững (Cầu Disulfide) và 3 tương tác phi cộng hóa trị giữa các nhóm mạch bên R
                </text>

                <!-- KHỐI 1: CẦU NỐI DISULFIDE (-S-S-) (BỀN NHẤT ~250 kJ/mol) -->
                <g transform="translate(25, 65)">
                    <rect width="420" height="135" rx="8" fill="${cardBg}" stroke="${isWhiteBg ? '#f59e0b' : 'rgba(245,158,11,0.4)'}" stroke-width="1.5"/>
                    <rect x="12" y="10" width="22" height="22" rx="4" fill="#f59e0b"/>
                    <text x="23" y="26" fill="#fff" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">1</text>
                    <text x="42" y="26" fill="${isWhiteBg ? '#b45309' : '#fde047'}" font-family="Be Vietnam Pro, sans-serif" font-size="12" font-weight="bold">
                        CẦU NỐI DISULFIDE (—S—S—) (CỘNG HÓA TRỊ)
                    </text>

                    <!-- Vẽ liên kết Cys-CH2-S-S-CH2-Cys -->
                    <g transform="translate(30, 65)">
                        <text x="0" y="5" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11">Chuỗi A: Cys₁—CH₂—</text>
                        <circle cx="155" cy="0" r="14" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.3)'}" stroke="#f59e0b" stroke-width="2"/>
                        <text x="155" y="5" fill="#d97706" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">S</text>

                        <!-- Liên kết cộng hóa trị S-S (2.05 A) -->
                        <line x1="169" y1="0" x2="201" y2="0" stroke="#f59e0b" stroke-width="4"/>
                        <text x="185" y="-9" fill="#d97706" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle">2.05 Å</text>

                        <circle cx="215" cy="0" r="14" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.3)'}" stroke="#f59e0b" stroke-width="2"/>
                        <text x="215" y="5" fill="#d97706" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">S</text>
                        <text x="235" y="5" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11">—CH₂—Cys₂ : Chuỗi B</text>
                    </g>
                    <text x="20" y="118" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                        • Nối 2 gốc Cysteine. Bền nhất trong 4 lực. Bị phá hủy bởi chất khử (uốn/duỗi tóc).
                    </text>
                </g>

                <!-- KHỐI 2: CẦU MUỐI ION (-COO- ···· +H3N-) -->
                <g transform="translate(475, 65)">
                    <rect width="420" height="135" rx="8" fill="${cardBg}" stroke="${isWhiteBg ? '#ec4899' : 'rgba(236,72,153,0.4)'}" stroke-width="1.5"/>
                    <rect x="12" y="10" width="22" height="22" rx="4" fill="#ec4899"/>
                    <text x="23" y="26" fill="#fff" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">2</text>
                    <text x="42" y="26" fill="${isWhiteBg ? '#be185d' : '#f472b6'}" font-family="Be Vietnam Pro, sans-serif" font-size="12" font-weight="bold">
                        CẦU MUỐI (LIÊN KẾT ION TĨNH ĐIỆN)
                    </text>

                    <!-- Vẽ Asp/Glu (-COO-) hút Lys/Arg (+NH3-) -->
                    <g transform="translate(30, 65)">
                        <text x="0" y="5" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11">Asp/Glu: —COO⁻</text>
                        
                        <!-- Lực hút Coulomb nét đứt -->
                        <line x1="130" y1="0" x2="210" y2="0" stroke="#ec4899" stroke-width="3" stroke-dasharray="5 3"/>
                        <circle cx="170" cy="0" r="12" fill="${isWhiteBg ? '#fdf2f8' : 'rgba(236,72,153,0.2)'}" stroke="#ec4899" stroke-width="1"/>
                        <text x="170" y="4" fill="#ec4899" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">±</text>

                        <text x="220" y="5" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11">⁺H₃N— : Lys/Arg</text>
                    </g>
                    <text x="20" y="118" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                        • Tương tác tĩnh điện giữa gốc axit (-COO⁻) và gốc bazơ (-NH₃⁺). Rất nhạy cảm với pH!
                    </text>
                </g>

                <!-- KHỐI 3: LIÊN KẾT HYDROGEN MẠCH BÊN (-OH ···· O=C-) -->
                <g transform="translate(25, 220)">
                    <rect width="420" height="135" rx="8" fill="${cardBg}" stroke="${isWhiteBg ? '#10b981' : 'rgba(16,185,129,0.4)'}" stroke-width="1.5"/>
                    <rect x="12" y="10" width="22" height="22" rx="4" fill="#10b981"/>
                    <text x="23" y="26" fill="#fff" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">3</text>
                    <text x="42" y="26" fill="${isWhiteBg ? '#047857' : '#34d399'}" font-family="Be Vietnam Pro, sans-serif" font-size="12" font-weight="bold">
                        LIÊN KẾT HYDROGEN MẠCH BÊN R
                    </text>

                    <!-- Vẽ Ser/Thr/Tyr -OH ···· O=C- Gln/Asn -->
                    <g transform="translate(30, 65)">
                        <text x="0" y="5" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11">Ser/Tyr: —O—H</text>
                        <text x="105" y="-5" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="9">δ⁺</text>

                        <line x1="120" y1="0" x2="200" y2="0" stroke="#10b981" stroke-width="3" stroke-dasharray="5 3"/>
                        <text x="160" y="-7" fill="#10b981" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="middle">H-bond</text>

                        <text x="195" y="-5" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="9">δ⁻</text>
                        <text x="210" y="5" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="11">O=C— : Gln/Asn</text>
                    </g>
                    <text x="20" y="118" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                        • Giữa các nhóm phân cực mạch bên (—OH, —CONH₂). Bị bẻ gãy khi đun nóng.
                    </text>
                </g>

                <!-- KHỐI 4: TƯƠNG TÁC KỴ NƯỚC (HYDROPHOBIC CLUSTERING) -->
                <g transform="translate(475, 220)">
                    <rect width="420" height="135" rx="8" fill="${cardBg}" stroke="${isWhiteBg ? '#0284c7' : 'rgba(2,132,199,0.4)'}" stroke-width="1.5"/>
                    <rect x="12" y="10" width="22" height="22" rx="4" fill="#0284c7"/>
                    <text x="23" y="26" fill="#fff" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">4</text>
                    <text x="42" y="26" fill="${isWhiteBg ? '#0369a1' : '#38bdf8'}" font-family="Be Vietnam Pro, sans-serif" font-size="12" font-weight="bold">
                        TƯƠNG TÁC KỴ NƯỚC (LÕI NỘI PHÂN TỬ)
                    </text>

                    <!-- Vẽ các gốc Val, Leu, Ile, Phe cụm vào lõi -->
                    <g transform="translate(30, 60)">
                        <circle cx="100" cy="5" r="26" fill="${isWhiteBg ? '#e0f2fe' : 'rgba(2,132,199,0.2)'}" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4 2"/>
                        <text x="100" y="3" fill="#0284c7" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">Lõi Kỵ Nước</text>
                        <text x="100" y="15" fill="#0369a1" font-family="JetBrains Mono, monospace" font-size="8" text-anchor="middle">Val, Leu, Phe</text>

                        <!-- Phân tử nước bên ngoài đẩy vào -->
                        <text x="160" y="-8" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10">&larr; H₂O đẩy vào trong</text>
                        <text x="160" y="18" fill="${subTextColor}" font-family="JetBrains Mono, monospace" font-size="10">&larr; Tránh tiếp xúc nước</text>
                    </g>
                    <text x="20" y="118" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                        • Động lực chính giúp protein hình cầu tự cuộn lại thành khối đặc khít trong nước.
                    </text>
                </g>
            </svg>
        `;
    }

    /* =========================================================================
       4. CẤU TRÚC BẬC 4: PHỨC HỢP HEMOGLOBIN (2α + 2β) & NHÂN HEME (Fe²⁺)
       ========================================================================= */
    generateLevel4SubunitsSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';

        return `
            <svg viewBox="0 0 920 340" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="916" height="336" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <text x="460" y="26" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
                    CẤU TRÚC BẬC IV: PHỨC HỢP TETRAMER HEMOGLOBIN (2 Chuỗi α + 2 Chuỗi β) &amp; 4 NHÂN HEME (Fe²⁺)
                </text>
                <text x="460" y="44" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" text-anchor="middle">
                    Protein phức tạp (Chromoprotein) • Trọng lượng 64.5 kDa • Hiện tượng hợp tác Allosteric (T-state ⇄ R-state)
                </text>

                <!-- KHỐI TRÁI: SƠ ĐỒ 4 TIỂU ĐƠN VỊ PHỐI HỢP -->
                <g transform="translate(60, 65)">
                    <rect width="360" height="235" rx="10" fill="${isWhiteBg ? '#f8fafc' : 'rgba(15,23,42,0.6)'}" stroke="${boxBorder}" stroke-width="1"/>
                    <text x="180" y="24" fill="${textColor}" font-family="Be Vietnam Pro, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">
                        PHỨC HỢP 4 CHUỖI POLYPEPTIDE
                    </text>

                    <!-- Tiểu đơn vị Alpha 1 (Tây Bắc) -->
                    <circle cx="110" cy="90" r="50" fill="${isWhiteBg ? '#dbeafe' : 'rgba(56,189,248,0.25)'}" stroke="#0284c7" stroke-width="2.5"/>
                    <text x="110" y="85" fill="#0369a1" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">Chuỗi α₁</text>
                    <text x="110" y="100" fill="#0284c7" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">(141 aa)</text>
                    <!-- Nhân Heme 1 -->
                    <circle cx="135" cy="70" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
                    <text x="135" y="74" fill="#fff" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">Fe²⁺</text>

                    <!-- Tiểu đơn vị Beta 1 (Đông Bắc) -->
                    <circle cx="240" cy="90" r="50" fill="${isWhiteBg ? '#fce7f3' : 'rgba(244,63,94,0.25)'}" stroke="#db2777" stroke-width="2.5"/>
                    <text x="240" y="85" fill="#be185d" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">Chuỗi β₁</text>
                    <text x="240" y="100" fill="#db2777" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">(146 aa)</text>
                    <!-- Nhân Heme 2 -->
                    <circle cx="215" cy="70" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
                    <text x="215" y="74" fill="#fff" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">Fe²⁺</text>

                    <!-- Tiểu đơn vị Beta 2 (Tây Nam) -->
                    <circle cx="110" cy="175" r="50" fill="${isWhiteBg ? '#fce7f3' : 'rgba(244,63,94,0.25)'}" stroke="#db2777" stroke-width="2.5"/>
                    <text x="110" y="170" fill="#be185d" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">Chuỗi β₂</text>
                    <text x="110" y="185" fill="#db2777" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">(146 aa)</text>
                    <!-- Nhân Heme 3 -->
                    <circle cx="135" cy="190" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
                    <text x="135" y="194" fill="#fff" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">Fe²⁺</text>

                    <!-- Tiểu đơn vị Alpha 2 (Đông Nam) -->
                    <circle cx="240" cy="175" r="50" fill="${isWhiteBg ? '#dbeafe' : 'rgba(56,189,248,0.25)'}" stroke="#0284c7" stroke-width="2.5"/>
                    <text x="240" y="170" fill="#0369a1" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">Chuỗi α₂</text>
                    <text x="240" y="185" fill="#0284c7" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">(141 aa)</text>
                    <!-- Nhân Heme 4 -->
                    <circle cx="215" cy="190" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
                    <text x="215" y="194" fill="#fff" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">Fe²⁺</text>

                    <!-- Trọng tâm tiếp xúc giữa các chuỗi -->
                    <circle cx="175" cy="132" r="8" fill="#eab308"/>
                </g>

                <!-- KHỐI PHẢI: CÔNG THỨC HÓA HỌC 2D CHI TIẾT NHÂN HEME (Fe²⁺ PHỐI TRÍ) -->
                <g transform="translate(460, 65)">
                    <rect width="400" height="235" rx="10" fill="${isWhiteBg ? '#fef2f2' : 'rgba(239,68,68,0.1)'}" stroke="${isWhiteBg ? '#fca5a5' : 'rgba(239,68,68,0.3)'}" stroke-width="1.5"/>
                    <text x="200" y="24" fill="#b91c1c" font-family="Be Vietnam Pro, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">
                        CẤU TẠO HÓA HỌC 2D NHÂN HEME (Fe²⁺ + VÒNG PORPHYRIN)
                    </text>

                    <!-- Tâm ion Fe2+ -->
                    <g transform="translate(200, 125)">
                        <circle cx="0" cy="0" r="24" fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
                        <text x="0" y="5" fill="#fff" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">Fe²⁺</text>

                        <!-- 4 liên kết phối trí với 4 nguyên tử Nitơ của vòng pyrrole -->
                        <!-- N Bắc -->
                        <line x1="0" y1="-24" x2="0" y2="-55" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                        <circle cx="0" cy="-62" r="11" fill="${isWhiteBg ? '#dbeafe' : 'rgba(37,99,235,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                        <text x="0" y="-58" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">N₁</text>

                        <!-- N Nam -->
                        <line x1="0" y1="24" x2="0" y2="55" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                        <circle cx="0" cy="62" r="11" fill="${isWhiteBg ? '#dbeafe' : 'rgba(37,99,235,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                        <text x="0" y="66" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">N₃</text>

                        <!-- N Tây -->
                        <line x1="-24" y1="0" x2="-55" y2="0" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                        <circle cx="-62" cy="0" r="11" fill="${isWhiteBg ? '#dbeafe' : 'rgba(37,99,235,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                        <text x="-62" y="4" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">N₄</text>

                        <!-- N Đông -->
                        <line x1="24" y1="0" x2="55" y2="0" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                        <circle cx="62" cy="0" r="11" fill="${isWhiteBg ? '#dbeafe' : 'rgba(37,99,235,0.3)'}" stroke="#2563eb" stroke-width="1.5"/>
                        <text x="62" y="4" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">N₂</text>

                        <!-- Liên kết thứ 5: Phối trí với gốc Histidine F8 (Globin) -->
                        <line x1="-16" y1="-16" x2="-65" y2="-55" stroke="#9333ea" stroke-width="2"/>
                        <rect x="-140" y="-72" width="75" height="26" rx="4" fill="${isWhiteBg ? '#f3e8ff' : 'rgba(147,51,234,0.3)'}" stroke="#9333ea" stroke-width="1"/>
                        <text x="-102" y="-55" fill="#7e22ce" font-family="Be Vietnam Pro, sans-serif" font-size="9" font-weight="bold" text-anchor="middle">His F8 (Globin)</text>

                        <!-- Liên kết thứ 6: Kết hợp THUẬN NGHỊCH với phân tử OXY (O2) -->
                        <line x1="16" y1="-16" x2="65" y2="-55" stroke="#dc2626" stroke-width="2.5"/>
                        <rect x="65" y="-72" width="85" height="26" rx="4" fill="${isWhiteBg ? '#fee2e2' : 'rgba(220,38,38,0.3)'}" stroke="#dc2626" stroke-width="1.5"/>
                        <text x="107" y="-55" fill="#b91c1c" font-family="JetBrains Mono, monospace" font-size="11" font-weight="bold" text-anchor="middle">⇄ O=O (Khí O₂)</text>
                    </g>

                    <text x="20" y="215" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                        • 1 phân tử Hb ngậm tối đa <strong>4 phân tử O₂</strong>. Khí CO cạnh tranh ái lực gấp 250 lần gây ngộ độc.
                    </text>
                </g>

                <text x="60" y="322" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                    💡 <strong>Bệnh học phân tử:</strong> Đột biến thay đúng 1 amino acid ở chuỗi β (Glu6 &rarr; Val6 kỵ nước) sinh bệnh <strong>Hồng cầu hình liềm</strong>!
                </text>
            </svg>
        `;
    }

    /* =========================================================================
       5. PHỨC CHẤT BIURET 2D (Cu-N CHELATE) - CHUẨN SGK HÓA 12
       ========================================================================= */
    generateBiuretComplexSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';

        return `
            <svg viewBox="0 0 540 320" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="536" height="316" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <text x="270" y="28" fill="${isWhiteBg ? '#7e22ce' : '#c084fc'}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
                    CƠ CHẾ PHỨC CHẤT CHELATE BIURET [Cu(Peptide)₂]²⁻ (MÀU TÍM HOA CÀ)
                </text>
                <text x="270" y="46" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5" text-anchor="middle">
                    Peptide (từ Tripeptide trở lên) + Cu(OH)₂ / kiềm NaOH &rarr; Phức tím chelate 4 càng
                </text>

                <!-- Ion Đồng trung tâm Cu2+ -->
                <circle cx="270" cy="155" r="28" fill="${isWhiteBg ? '#f3e8ff' : 'rgba(168,85,247,0.35)'}" stroke="#9333ea" stroke-width="2.5"/>
                <text x="270" y="161" fill="${isWhiteBg ? '#7e22ce' : '#fff'}" font-family="JetBrains Mono, monospace" font-size="16" font-weight="bold" text-anchor="middle">Cu²⁺</text>

                <!-- 4 Nguyên tử Nitơ phối trí (4 liên kết phối trí chelate 4 càng) -->
                <!-- N1 (Tây Bắc) -->
                <line x1="248" y1="135" x2="190" y2="105" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                <circle cx="180" cy="100" r="16" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                <text x="180" y="105" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">N₁</text>

                <!-- N2 (Đông Bắc) -->
                <line x1="292" y1="135" x2="350" y2="105" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                <circle cx="360" cy="100" r="16" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                <text x="360" y="105" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">N₂</text>

                <!-- N3 (Tây Nam) -->
                <line x1="248" y1="175" x2="190" y2="205" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                <circle cx="180" cy="210" r="16" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                <text x="180" y="215" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">N₃</text>

                <!-- N4 (Đông Nam) -->
                <line x1="292" y1="175" x2="350" y2="205" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="4 2"/>
                <circle cx="360" cy="210" r="16" fill="${isWhiteBg ? '#dbeafe' : 'rgba(0,242,254,0.25)'}" stroke="#2563eb" stroke-width="2"/>
                <text x="360" y="215" fill="#1d4ed8" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">N₄</text>

                <!-- Mạch peptide nối N1 và N3 (Chuỗi A) -->
                <path d="M 170,100 L 110,100 L 90,155 L 110,210 L 170,210" fill="none" stroke="${subTextColor}" stroke-width="3"/>
                <rect x="40" y="142" width="90" height="26" rx="4" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.2)'}" stroke="#d97706" stroke-width="1"/>
                <text x="85" y="159" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">Mạch Peptide A</text>

                <!-- Mạch peptide nối N2 và N4 (Chuỗi B) -->
                <path d="M 370,100 L 430,100 L 450,155 L 430,210 L 370,210" fill="none" stroke="${subTextColor}" stroke-width="3"/>
                <rect x="410" y="142" width="90" height="26" rx="4" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.2)'}" stroke="#d97706" stroke-width="1"/>
                <text x="455" y="159" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">Mạch Peptide B</text>

                <!-- Điện tích phức chất [2-] -->
                <text x="320" y="115" fill="#9333ea" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold">²⁻</text>

                <!-- Chú thích điều kiện SGK Hóa 12 -->
                <g transform="translate(20, 275)">
                    <rect width="500" height="34" rx="6" fill="${isWhiteBg ? '#fef2f2' : 'rgba(239,68,68,0.15)'}" stroke="#ef4444" stroke-width="1"/>
                    <text x="250" y="21" fill="#dc2626" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">
                        ⚠️ ĐIỀU KIỆN: Phải có &ge; 2 liên kết peptide (từ Tripeptide trở lên). Dipeptide KHÔNG THAM GIA phản ứng này!
                    </text>
                </g>
            </svg>
        `;
    }

    /* =========================================================================
       6. PHẢN ỨNG THỦY PHÂN PEPTIDE (CẮT LIÊN KẾT BỞI H2O)
       ========================================================================= */
    generateHydrolysisReactionSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const textColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';

        return `
            <svg viewBox="0 0 880 240" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="876" height="236" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <text x="440" y="26" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
                    PHẢN ỨNG THỦY PHÂN HOÀN TOÀN PEPTIDE &amp; PROTEIN (CẮT LIÊN KẾT BẰNG PHÂN TỬ H₂O)
                </text>
                <text x="440" y="44" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5" text-anchor="middle">
                    Xúc tác: Axit (H⁺), Kiềm (OH⁻) hoặc Enzyme (pepsin, trypsin) • 1 mol liên kết peptide cần 1 mol H₂O
                </text>

                <!-- Vế trái: Dipeptide Gly-Ala + H2O -->
                <g transform="translate(30, 110)">
                    <rect x="0" y="-35" width="280" height="70" rx="8" fill="${isWhiteBg ? '#f8fafc' : 'rgba(255,255,255,0.05)'}" stroke="${boxBorder}" stroke-width="1.5"/>
                    <text x="140" y="-12" fill="${textColor}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">
                        H₂N—CH₂—<tspan fill="#dc2626">CO</tspan>—<tspan fill="#2563eb">NH</tspan>—CH(CH₃)—COOH
                    </text>
                    <text x="140" y="16" fill="#b45309" font-family="Be Vietnam Pro, sans-serif" font-size="10" text-anchor="middle">
                        Dipeptide (Gly-Ala) [1 LK Peptide]
                    </text>
                </g>

                <text x="330" y="115" fill="#2563eb" font-family="JetBrains Mono, monospace" font-size="20" font-weight="bold">+</text>

                <!-- Phân tử Nước H-OH -->
                <g transform="translate(365, 110)">
                    <rect x="0" y="-35" width="100" height="70" rx="8" fill="${isWhiteBg ? '#e0f2fe' : 'rgba(2,132,199,0.2)'}" stroke="#0284c7" stroke-width="1.5"/>
                    <text x="50" y="-10" fill="#0284c7" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" text-anchor="middle">
                        <tspan fill="#2563eb">H</tspan>—<tspan fill="#dc2626">OH</tspan>
                    </text>
                    <text x="50" y="16" fill="#0369a1" font-family="Be Vietnam Pro, sans-serif" font-size="10" text-anchor="middle">
                        1 mol Nước
                    </text>
                </g>

                <!-- Mũi tên phản ứng xúc tác H+/to -->
                <g transform="translate(485, 110)">
                    <line x1="0" y1="0" x2="65" y2="0" stroke="${subTextColor}" stroke-width="2.5"/>
                    <polygon points="65,0 55,-5 55,5" fill="${subTextColor}"/>
                    <text x="32" y="-10" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="10" font-weight="bold" text-anchor="middle">H⁺, t°</text>
                    <text x="32" y="16" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="9" text-anchor="middle">(enzyme)</text>
                </g>

                <!-- Vế phải: 2 Amino Acid tách rời (Glycine + Alanine) -->
                <g transform="translate(575, 110)">
                    <rect x="0" y="-35" width="270" height="70" rx="8" fill="${isWhiteBg ? '#dcfce7' : 'rgba(16,185,129,0.2)'}" stroke="#16a34a" stroke-width="1.5"/>
                    <text x="135" y="-12" fill="#15803d" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" text-anchor="middle">
                        H₂N—CH₂—<tspan fill="#dc2626">COOH</tspan>  +  H₂N—CH(CH₃)—<tspan fill="#dc2626">COOH</tspan>
                    </text>
                    <text x="135" y="16" fill="#166534" font-family="Be Vietnam Pro, sans-serif" font-size="10" text-anchor="middle">
                        1 mol Glycine  +  1 mol Alanine
                    </text>
                </g>

                <!-- Công thức tổng quát chân trang -->
                <g transform="translate(30, 205)">
                    <text x="0" y="0" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11">
                        ⚡ Công thức SGK: Polypeptide n mắt xích + (n − 1) H₂O → n α-amino acid. Phân tử khối: M = Σ M(aa) − 18(n − 1).
                    </text>
                </g>
            </svg>
        `;
    }

    /* =========================================================================
       7. CẤU TRÚC 2D ĐỒNG HÀNH CHO CÁC MÔ HÌNH PROTEIN CỤ THỂ (TAB 2 COMPANION)
       ========================================================================= */
    generateProteinCompanionSvg(proteinId = 'hemoglobin', mode = 'backbone', isWhiteBg = this.isWhiteBg) {
        switch (proteinId.toLowerCase()) {
            case 'hemoglobin':
                return mode === 'prosthetic' ? this.generateLevel4SubunitsSvg(isWhiteBg) : this.generateLevel1BackboneSvg(isWhiteBg);
            case 'crambin':
                return mode === 'forces' ? this.generateLevel3InteractionsSvg(isWhiteBg) : this.generatePeptideSegmentSvg(['THR','THR','CYS','CYS','PRO','SER'], 2, isWhiteBg);
            case 'insulin':
                return this.generateInsulin2DSvg(isWhiteBg);
            case 'collagen':
                return this.generateCollagen2DSvg(isWhiteBg);
            default:
                return this.generateLevel1BackboneSvg(isWhiteBg);
        }
    }

    // Sơ đồ 2D Insulin: 2 chuỗi A & B nối bởi 3 cầu Disulfide
    generateInsulin2DSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';

        return `
            <svg viewBox="0 0 880 230" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="876" height="226" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <text x="440" y="25" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
                    CÔNG THỨC CẤU TẠO 2D HORMONE INSULIN (4INS): 2 CHUỖI NỐI NHAU BẰNG 3 CẦU DISULFIDE (—S—S—)
                </text>

                <!-- Chuỗi A (21 amino acid) -->
                <g transform="translate(60, 60)">
                    <rect width="760" height="38" rx="8" fill="${isWhiteBg ? '#e0f2fe' : 'rgba(56,189,248,0.2)'}" stroke="#0284c7" stroke-width="2"/>
                    <text x="15" y="24" fill="#0284c7" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">CHUỖI A (21 gốc): Đầu N: Gly1</text>
                    <text x="745" y="24" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="end">Asn21: Đầu C</text>

                    <!-- Cầu nội chuỗi A6 - A11 -->
                    <path d="M 230,8 Q 280,-18 330,8" fill="none" stroke="#f59e0b" stroke-width="3"/>
                    <circle cx="230" cy="8" r="5" fill="#f59e0b"/>
                    <circle cx="330" cy="8" r="5" fill="#f59e0b"/>
                    <text x="280" y="-12" fill="#d97706" font-family="JetBrains Mono, monospace" font-size="9" font-weight="bold" text-anchor="middle">Cầu nội chuỗi Cys6—S—S—Cys11</text>
                </g>

                <!-- 2 Cầu liên chuỗi A7 - B7 và A20 - B19 -->
                <!-- Cầu 1: A7 - B7 -->
                <line x1="320" y1="98" x2="320" y2="148" stroke="#f59e0b" stroke-width="3.5"/>
                <rect x="275" y="115" width="90" height="18" rx="3" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.3)'}" stroke="#f59e0b" stroke-width="1"/>
                <text x="320" y="128" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="bold" text-anchor="middle">CysA7—S—S—CysB7</text>

                <!-- Cầu 2: A20 - B19 -->
                <line x1="680" y1="98" x2="680" y2="148" stroke="#f59e0b" stroke-width="3.5"/>
                <rect x="630" y="115" width="100" height="18" rx="3" fill="${isWhiteBg ? '#fef3c7' : 'rgba(245,158,11,0.3)'}" stroke="#f59e0b" stroke-width="1"/>
                <text x="680" y="128" fill="#b45309" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="bold" text-anchor="middle">CysA20—S—S—CysB19</text>

                <!-- Chuỗi B (30 amino acid) -->
                <g transform="translate(60, 150)">
                    <rect width="760" height="38" rx="8" fill="${isWhiteBg ? '#fce7f3' : 'rgba(244,63,94,0.2)'}" stroke="#db2777" stroke-width="2"/>
                    <text x="15" y="24" fill="#db2777" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">CHUỖI B (30 gốc): Đầu N: Phe1</text>
                    <text x="745" y="24" fill="#dc2626" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="end">Ala30: Đầu C</text>
                </g>

                <text x="60" y="212" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10.5">
                    💡 Frederick Sanger giải trình tự Insulin năm 1953 (Nobel 1958) chứng minh protein có cấu trúc hóa học xác định!
                </text>
            </svg>
        `;
    }

    // Sơ đồ 2D Collagen xoắn ba Tropocollagen
    generateCollagen2DSvg(isWhiteBg = this.isWhiteBg) {
        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const subTextColor = isWhiteBg ? '#64748b' : '#94a3b8';
        const boxBorder = isWhiteBg ? '#cbd5e1' : 'rgba(0,242,254,0.2)';

        return `
            <svg viewBox="0 0 880 200" class="chem2d-svg" xmlns="http://www.w3.org/2000/svg" style="background:${bg}; border-radius:12px; width:100%; height:auto;">
                <rect x="2" y="2" width="876" height="196" rx="10" fill="none" stroke="${boxBorder}" stroke-width="1.5"/>

                <text x="440" y="25" fill="${isWhiteBg ? '#1e293b' : '#00f2fe'}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">
                    CÔNG THỨC CẤU TẠO 2D COLLAGEN (1CAG): XOẮN BA TROPOCOLLAGEN &amp; MÔ TÍP LẶP LẠI [Gly—Pro—Hyp]ₙ
                </text>

                <!-- 3 Sợi xoắn bện vào nhau -->
                <g transform="translate(60, 60)">
                    <path d="M 0,30 Q 150,-10 300,30 T 600,30 T 760,30" fill="none" stroke="#3b82f6" stroke-width="4"/>
                    <path d="M 0,30 Q 150,70 300,30 T 600,30 T 760,30" fill="none" stroke="#10b981" stroke-width="4"/>
                    <path d="M 0,30 Q 150,30 300,30 T 600,30 T 760,30" fill="none" stroke="#f59e0b" stroke-width="4"/>
                </g>

                <g transform="translate(180, 130)">
                    <rect width="520" height="42" rx="6" fill="${isWhiteBg ? '#f8fafc' : 'rgba(255,255,255,0.05)'}" stroke="${boxBorder}" stroke-width="1"/>
                    <text x="260" y="18" fill="${isWhiteBg ? '#0f172a' : '#fff'}" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold" text-anchor="middle">
                        MÔ TÍP ĐẶC TRƯNG: —[Glycine — Proline — Hydroxyproline]ₙ—
                    </text>
                    <text x="260" y="34" fill="${subTextColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10" text-anchor="middle">
                        Glycine nhỏ nhất (R = H) nằm ở lõi trung tâm giúp 3 chuỗi ép sát chặt chẽ, tạo độ bền kéo tương đương dây cáp thép.
                    </text>
                </g>
            </svg>
        `;
    }

    /* =========================================================================
       8. HÀM WRAPPER: ĐÓNG GÓI SVG VÀO THẺ CARD GIÁO DỤC CHUẨN SGK (NỀN TRẮNG SẠCH)
       ========================================================================= */
    wrapInTextbookCard(svgHtml, title, subtitle, badges = ['Chuẩn SGK Hóa 12', 'Hình Học 2D Tường Minh']) {
        return `
            <div class="chem2d-textbook-card">
                <div class="chem2d-tb-header">
                    <div>
                        <div class="chem2d-tb-badges">
                            ${badges.map(b => `<span class="chem2d-tb-badge">${b}</span>`).join('')}
                        </div>
                        <h3 class="chem2d-tb-title">${title}</h3>
                        ${subtitle ? `<p class="chem2d-tb-sub">${subtitle}</p>` : ''}
                    </div>
                    <div class="chem2d-tb-actions">
                        <button class="mini-control-btn" style="color:var(--neon-cyan); border-color:rgba(0,242,254,0.3);" onclick="window.chemical2DEngine.toggleThemeAndRerender(this)">
                            🎨 Đổi Nền SGK / Tối
                        </button>
                    </div>
                </div>

                <div class="chem2d-tb-viewport">
                    ${svgHtml}
                </div>
            </div>
        `;
    }

    // Toggle màu nền và tự render lại
    toggleThemeAndRerender(btnEl) {
        this.isWhiteBg = !this.isWhiteBg;
        if (window.app) {
            window.app.playSound('click');
            window.app.showToast(`Đã chuyển sang chế độ nền: ${this.isWhiteBg ? 'Giấy trắng SGK (#ffffff)' : 'Cyber Biotech tối'}!`, 'info');
        }
        // Gọi update lại view hiện tại nếu có
        if (window.structureMgr && document.getElementById('tab-structure')?.classList.contains('active')) {
            window.structureMgr.renderLevelContent(window.structureMgr.currentLevel);
        }
        if (window.viewer3D && typeof window.viewer3D.updateCompanion2DCard === 'function') {
            window.viewer3D.updateCompanion2DCard();
        }
    }

    /* =========================================================================
       9. MODAL PHÂN TÍCH HÌNH HỌC 2D TOÀN DIỆN
       ========================================================================= */
    renderFullChem2DModalContent(activeTab = 'segment', selectedResidues = ['ALA', 'GLY', 'VAL']) {
        const segSvg = this.generateLevel1BackboneSvg(this.isWhiteBg);
        const biuretSvg = this.generateBiuretComplexSvg(this.isWhiteBg);
        const forcesSvg = this.generateLevel3InteractionsSvg(this.isWhiteBg);

        const aaKeys = Object.keys(this.aminoAcidRChains);
        const aaCardsHtml = aaKeys.map(k => {
            const item = this.aminoAcidRChains[k];
            return `
                <div class="chem2d-aa-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-family:var(--font-mono); font-weight:bold; color:var(--neon-cyan);">${k}</span>
                        <span style="font-size:0.75rem; color:var(--neon-amber);">${item.mw} g/mol</span>
                    </div>
                    <div style="font-size:0.9rem; font-weight:700; color:#fff; margin-top:2px;">${item.name}</div>
                    <div style="font-family:var(--font-mono); font-size:0.85rem; color:#fde047; background:rgba(0,0,0,0.5); padding:3px 6px; border-radius:4px; margin:4px 0;">
                        Gốc R: ${item.rHtml}
                    </div>
                    <div style="font-size:0.75rem; color:#94a3b8;">${item.type}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="chem2d-modal-container">
                <div class="chem2d-modal-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:1.6rem;">📐</span>
                        <div>
                            <div style="font-family:var(--font-heading); font-size:1.3rem; color:var(--neon-cyan); font-weight:700;">
                                BẢN ĐỒ HÌNH HỌC 2D &amp; CÔNG THỨC CẤU TẠO HÓA HỌC TƯỜNG MINH
                            </div>
                            <div style="font-size:0.85rem; color:#94a3b8;">
                                Chuẩn hóa 100% theo Chương trình SGK Hóa học 12 (KNTT, Cánh Diều, Chân Trời Sáng Tạo) • Nền trắng dễ nhìn
                            </div>
                        </div>
                    </div>
                    <button class="mini-control-btn" style="color:var(--neon-cyan);" onclick="window.chemical2DEngine.toggleThemeAndRerender(this)">
                        🎨 Đổi Màu Nền (SGK / Tối)
                    </button>
                </div>

                <!-- Subtabs điều hướng trong Modal -->
                <div class="chem2d-tabs-nav">
                    <button class="chem2d-tab-btn ${activeTab === 'segment' ? 'active' : ''}" onclick="window.chemical2DEngine.switchModalTab('segment')">
                        1. Khung Xương Sống &amp; Liên Kết Peptide (-CO-NH-)
                    </button>
                    <button class="chem2d-tab-btn ${activeTab === 'biuret' ? 'active' : ''}" onclick="window.chemical2DEngine.switchModalTab('biuret')">
                        2. Cơ Chế Phức Chất Biuret [Cu(Peptide)₂]²⁻
                    </button>
                    <button class="chem2d-tab-btn ${activeTab === 'forces' ? 'active' : ''}" onclick="window.chemical2DEngine.switchModalTab('forces')">
                        3. 4 Lực Duy Trì Cấu Trúc Bậc 2 &amp; Bậc 3
                    </button>
                    <button class="chem2d-tab-btn ${activeTab === 'aminoacids' ? 'active' : ''}" onclick="window.chemical2DEngine.switchModalTab('aminoacids')">
                        4. Bảng 20 Amino Acid Chuẩn SGK Hóa 12
                    </button>
                </div>

                <!-- TAB 1: Đoạn chuỗi peptide & Liên kết peptide -->
                <div class="chem2d-tab-panel" id="chem2dPanel-segment" style="display:${activeTab === 'segment' ? 'block' : 'none'};">
                    <div class="chem2d-svg-canvas-card">
                        ${segSvg}
                    </div>

                    <div style="margin-top:1rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
                        <div style="background:rgba(0,0,0,0.5); padding:0.9rem; border-radius:8px; border:1px solid rgba(0,242,254,0.25);">
                            <div style="color:var(--neon-cyan); font-weight:bold; font-size:0.9rem; margin-bottom:4px;">Quy Tắc Đầu N &amp; Đầu C (SGK Hóa 12):</div>
                            <div style="font-size:0.85rem; color:#cbd5e1; line-height:1.5;">
                                • <strong>Đầu N:</strong> Amino acid đầu tiên còn nhóm —NH₂ (hoặc —NH₃⁺) tự do, luôn viết ở bên trái.<br>
                                • <strong>Đầu C:</strong> Amino acid cuối cùng còn nhóm —COOH (hoặc —COO⁻) tự do, luôn viết ở bên phải.
                            </div>
                        </div>

                        <div style="background:rgba(0,0,0,0.5); padding:0.9rem; border-radius:8px; border:1px solid rgba(168,85,247,0.25);">
                            <div style="color:var(--neon-purple); font-weight:bold; font-size:0.9rem; margin-bottom:4px;">Đặc Điểm Liên Kết Peptide (-CO-NH-):</div>
                            <div style="font-size:0.85rem; color:#cbd5e1; line-height:1.5;">
                                • Độ dài liên kết C—N là <strong>1.32 Å</strong> (ngắn hơn liên kết đơn C—N thông thường 1.47 Å).<br>
                                • Mang tính chất liên kết đôi một phần do cộng hưởng electron pi, cấu hình <strong>phẳng cứng nhắc</strong> không quay tự do.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: Phức chất Biuret -->
                <div class="chem2d-tab-panel" id="chem2dPanel-biuret" style="display:${activeTab === 'biuret' ? 'block' : 'none'};">
                    <div class="chem2d-svg-canvas-card">
                        ${biuretSvg}
                    </div>
                </div>

                <!-- TAB 3: Lực duy trì bậc 2 & bậc 3 -->
                <div class="chem2d-tab-panel" id="chem2dPanel-forces" style="display:${activeTab === 'forces' ? 'block' : 'none'};">
                    <div class="chem2d-svg-canvas-card">
                        ${forcesSvg}
                    </div>
                </div>

                <!-- TAB 4: Bảng 20 amino acid -->
                <div class="chem2d-tab-panel" id="chem2dPanel-aminoacids" style="display:${activeTab === 'aminoacids' ? 'block' : 'none'};">
                    <div class="chem2d-aa-grid">
                        ${aaCardsHtml}
                    </div>
                </div>

                <div style="margin-top:1.25rem; display:flex; justify-content:flex-end;">
                    <button class="btn-cyber-primary" onclick="document.getElementById('globalModalBackdrop').classList.remove('active');">
                        Đóng Bản Đồ 2D
                    </button>
                </div>
            </div>
        `;
    }

    switchModalTab(tabName) {
        document.querySelectorAll('.chem2d-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.chem2d-tab-panel').forEach(p => p.style.display = 'none');
        
        const targetPanel = document.getElementById(`chem2dPanel-${tabName}`);
        if (targetPanel) targetPanel.style.display = 'block';

        const activeBtn = Array.from(document.querySelectorAll('.chem2d-tab-btn')).find(b => b.textContent.includes(
            tabName === 'segment' ? '1.' : tabName === 'biuret' ? '2.' : tabName === 'forces' ? '3.' : '4.'
        ));
        if (activeBtn) activeBtn.classList.add('active');

        if (window.app) window.app.playSound('click');
    }

    /* =========================================================================
       TÍNH TOÁN CÔNG THỨC PHÂN TỬ VÀ KHỐI LƯỢNG PEPTIDE (CHUẨN SGK HÓA 12)
       ========================================================================= */
    calculatePeptideInfo(residues = ['GLY', 'HIS', 'GLY']) {
        const aaAtomData = {
            'GLY': { name: 'Glycine', c: 2, h: 5, n: 1, o: 2, s: 0, mw: 75.07 },
            'ALA': { name: 'Alanine', c: 3, h: 7, n: 1, o: 2, s: 0, mw: 89.09 },
            'VAL': { name: 'Valine', c: 5, h: 11, n: 1, o: 2, s: 0, mw: 117.15 },
            'LEU': { name: 'Leucine', c: 6, h: 13, n: 1, o: 2, s: 0, mw: 131.17 },
            'ILE': { name: 'Isoleucine', c: 6, h: 13, n: 1, o: 2, s: 0, mw: 131.17 },
            'SER': { name: 'Serine', c: 3, h: 7, n: 1, o: 3, s: 0, mw: 105.09 },
            'THR': { name: 'Threonine', c: 4, h: 9, n: 1, o: 3, s: 0, mw: 119.12 },
            'CYS': { name: 'Cysteine', c: 3, h: 7, n: 1, o: 2, s: 1, mw: 121.16 },
            'MET': { name: 'Methionine', c: 5, h: 11, n: 1, o: 2, s: 1, mw: 149.21 },
            'ASP': { name: 'Aspartic acid', c: 4, h: 7, n: 1, o: 4, s: 0, mw: 133.10 },
            'GLU': { name: 'Glutamic acid', c: 5, h: 9, n: 1, o: 4, s: 0, mw: 147.13 },
            'ASN': { name: 'Asparagine', c: 4, h: 8, n: 2, o: 3, s: 0, mw: 132.12 },
            'GLN': { name: 'Glutamine', c: 5, h: 10, n: 2, o: 3, s: 0, mw: 146.15 },
            'LYS': { name: 'Lysine', c: 6, h: 14, n: 2, o: 2, s: 0, mw: 146.19 },
            'ARG': { name: 'Arginine', c: 6, h: 14, n: 4, o: 2, s: 0, mw: 174.20 },
            'HIS': { name: 'Histidine', c: 6, h: 9, n: 3, o: 2, s: 0, mw: 155.16 },
            'PHE': { name: 'Phenylalanine', c: 9, h: 11, n: 1, o: 2, s: 0, mw: 165.19 },
            'TYR': { name: 'Tyrosine', c: 9, h: 11, n: 1, o: 3, s: 0, mw: 181.19 },
            'TRP': { name: 'Tryptophan', c: 11, h: 12, n: 2, o: 2, s: 0, mw: 204.23 },
            'PRO': { name: 'Proline', c: 5, h: 9, n: 1, o: 2, s: 0, mw: 115.13 }
        };

        const validRes = (residues && residues.length > 0 ? residues : ['GLY', 'ALA']).map(r => (r || 'GLY').toUpperCase().slice(0, 3));
        const count = validRes.length;
        const bondsCount = Math.max(0, count - 1);

        let c = 0, h = 0, n = 0, o = 0, s = 0, mw = 0;
        validRes.forEach(r => {
            const data = aaAtomData[r] || aaAtomData['GLY'];
            c += data.c;
            h += data.h;
            n += data.n;
            o += data.o;
            s += data.s;
            mw += data.mw;
        });

        // Mỗi liên kết peptide hình thành tách ra 1 phân tử H2O
        h -= bondsCount * 2;
        o -= bondsCount;
        mw -= bondsCount * 18.015;

        let formula = `C${c}H${h}`;
        if (n > 0) formula += `N${n > 1 ? n : ''}`;
        if (o > 0) formula += `O${o > 1 ? o : ''}`;
        if (s > 0) formula += `S${s > 1 ? s : ''}`;

        return {
            count,
            bondsCount,
            formula,
            mw: mw.toFixed(2),
            firstRes: validRes[0],
            lastRes: validRes[validRes.length - 1],
            validRes
        };
    }

    /* =========================================================================
       BỘ KẾT XUẤT CÔNG THỨC HÓA HỌC HỮU CƠ 2D THỰC THỤ (CHEMDRAW / SKELETAL STYLE)
       TO RÕ RÀNG, CHUẨN XÁC, MÀU SẮC TRỰC QUAN CHUẨN MẪU IMAGE 2
       ========================================================================= */
    generateRealisticPeptideSvg(residues = ['GLY', 'HIS', 'GLY'], isWhiteBg = this.isWhiteBg) {
        const validRes = (residues && residues.length > 0 ? residues : ['GLY', 'HIS', 'GLY']).map(r => (r || 'GLY').toUpperCase().slice(0, 3));
        const n = validRes.length;

        const stepX = 145;
        const startX = 75;
        const totalWidth = startX + (n - 1) * stepX + 130;
        const height = 260;

        const bg = isWhiteBg ? '#ffffff' : '#070d1d';
        const strokeColor = isWhiteBg ? '#0f172a' : '#f8fafc';
        const blueColor = '#2563eb';
        const redColor = '#dc2626';
        const amberColor = '#d97706';
        const purpleColor = '#9333ea';
        const grayColor = isWhiteBg ? '#64748b' : '#94a3b8';

        const yCA = 180;
        const yCarbonyl = 140;
        const yN = 140;

        let elements = [];

        // N-terminus tự do ở đầu trái
        elements.push(`
            <text x="${startX - 48}" y="${yCA + 5}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">H₂N</text>
            <line x1="${startX - 28}" y1="${yCA}" x2="${startX}" y2="${yCA}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
        `);

        for (let i = 0; i < n; i++) {
            const resCode = validRes[i];
            const xCA = startX + i * stepX;
            const xC = xCA + 48;
            const xNextN = xC + 44;
            const xNextCA = xCA + stepX;

            // Mạch bên R hướng lên trên
            switch (resCode) {
                case 'GLY':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 26}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 34}" fill="${grayColor}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">H</text>
                    `);
                    break;

                case 'ALA':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 45}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 54}" fill="${strokeColor}" font-family="Be Vietnam Pro, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">CH₃</text>
                    `);
                    break;

                case 'HIS':
                    // Histidine: Vòng thơm dị vòng Imidazole 5 cạnh tuyệt đẹp chuẩn Image 2
                    const xRing = xCA;
                    const yCB = yCA - 45;
                    const yCG = yCB - 28;
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCB}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCB}" x2="${xRing}" y2="${yCG}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xRing}" y1="${yCG}" x2="${xRing + 32}" y2="${yCG - 10}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xRing + 3}" y1="${yCG - 6}" x2="${xRing + 29}" y2="${yCG - 14}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
                        <line x1="${xRing + 32}" y1="${yCG - 10}" x2="${xRing + 28}" y2="${yCG - 32}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xRing + 25}" y="${yCG - 40}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">NH</text>
                        <line x1="${xRing + 14}" y1="${yCG - 46}" x2="${xRing}" y2="${yCG - 58}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xRing}" y1="${yCG - 58}" x2="${xRing - 20}" y2="${yCG - 42}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xRing - 2}" y1="${yCG - 51}" x2="${xRing - 17}" y2="${yCG - 39}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
                        <text x="${xRing - 26}" y="${yCG - 32}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">N</text>
                        <line x1="${xRing - 20}" y1="${yCG - 24}" x2="${xRing}" y2="${yCG}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                    `);
                    break;

                case 'VAL':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 35}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 35}" x2="${xCA - 28}" y2="${yCA - 60}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 35}" x2="${xCA + 28}" y2="${yCA - 60}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA - 30}" y="${yCA - 68}" fill="${strokeColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">H₃C</text>
                        <text x="${xCA + 30}" y="${yCA - 68}" fill="${strokeColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">CH₃</text>
                    `);
                    break;

                case 'LEU':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 30}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 30}" x2="${xCA}" y2="${yCA - 55}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 55}" x2="${xCA - 28}" y2="${yCA - 80}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 55}" x2="${xCA + 28}" y2="${yCA - 80}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA - 30}" y="${yCA - 88}" fill="${strokeColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">H₃C</text>
                        <text x="${xCA + 30}" y="${yCA - 88}" fill="${strokeColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">CH₃</text>
                    `);
                    break;

                case 'SER':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 40}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 40}" x2="${xCA}" y2="${yCA - 68}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 76}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">OH</text>
                    `);
                    break;

                case 'CYS':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 40}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 40}" x2="${xCA}" y2="${yCA - 68}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 76}" fill="${amberColor}" font-family="Be Vietnam Pro, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">SH</text>
                    `);
                    break;

                case 'PHE':
                    const yPheB = yCA - 40;
                    const yPheRing = yPheB - 25;
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yPheB}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <polygon points="${xCA},${yPheRing + 25} ${xCA - 22},${yPheRing + 12} ${xCA - 22},${yPheRing - 12} ${xCA},${yPheRing - 25} ${xCA + 22},${yPheRing - 12} ${xCA + 22},${yPheRing + 12}" fill="none" stroke="${strokeColor}" stroke-width="2.6" stroke-linejoin="round"/>
                        <circle cx="${xCA}" cy="${yPheRing}" r="12" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>
                    `);
                    break;

                case 'TYR':
                    const yTyrB = yCA - 40;
                    const yTyrRing = yTyrB - 25;
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yTyrB}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <polygon points="${xCA},${yTyrRing + 25} ${xCA - 22},${yTyrRing + 12} ${xCA - 22},${yTyrRing - 12} ${xCA},${yTyrRing - 25} ${xCA + 22},${yTyrRing - 12} ${xCA + 22},${yTyrRing + 12}" fill="none" stroke="${strokeColor}" stroke-width="2.6" stroke-linejoin="round"/>
                        <circle cx="${xCA}" cy="${yTyrRing}" r="12" fill="none" stroke="${strokeColor}" stroke-width="1.8"/>
                        <line x1="${xCA}" y1="${yTyrRing - 25}" x2="${xCA}" y2="${yTyrRing - 38}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yTyrRing - 44}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">OH</text>
                    `);
                    break;

                case 'ASP':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 35}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 35}" x2="${xCA}" y2="${yCA - 60}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA - 3}" y1="${yCA - 60}" x2="${xCA - 18}" y2="${yCA - 75}" stroke="${redColor}" stroke-width="2.2" stroke-linecap="round"/>
                        <line x1="${xCA + 1}" y1="${yCA - 57}" x2="${xCA - 14}" y2="${yCA - 72}" stroke="${redColor}" stroke-width="2.2" stroke-linecap="round"/>
                        <text x="${xCA - 24}" y="${yCA - 80}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">O</text>
                        <line x1="${xCA}" y1="${yCA - 60}" x2="${xCA + 15}" y2="${yCA - 72}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA + 28}" y="${yCA - 75}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">OH</text>
                    `);
                    break;

                case 'GLU':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 28}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 28}" x2="${xCA}" y2="${yCA - 52}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 52}" x2="${xCA}" y2="${yCA - 72}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 80}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">COOH</text>
                    `);
                    break;

                case 'LYS':
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 25}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 25}" x2="${xCA - 10}" y2="${yCA - 45}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA - 10}" y1="${yCA - 45}" x2="${xCA}" y2="${yCA - 65}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <line x1="${xCA}" y1="${yCA - 65}" x2="${xCA}" y2="${yCA - 85}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 93}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">NH₂</text>
                    `);
                    break;

                case 'PRO':
                    elements.push(`
                        <polygon points="${xCA},${yCA} ${xCA - 18},${yCA - 22} ${xCA - 12},${yCA - 45} ${xCA + 12},${yCA - 45} ${xCA + 18},${yCA - 22}" fill="none" stroke="${strokeColor}" stroke-width="2.6" stroke-linejoin="round"/>
                        <text x="${xCA}" y="${yCA - 52}" fill="${purpleColor}" font-family="Be Vietnam Pro, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Vòng imino</text>
                    `);
                    break;

                default:
                    elements.push(`
                        <line x1="${xCA}" y1="${yCA}" x2="${xCA}" y2="${yCA - 45}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                        <text x="${xCA}" y="${yCA - 54}" fill="${strokeColor}" font-family="Be Vietnam Pro, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">R (${resCode})</text>
                    `);
            }

            // Liên kết CA sang Carbonyl C
            elements.push(`
                <line x1="${xCA}" y1="${yCA}" x2="${xC}" y2="${yCarbonyl}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
            `);

            // Carbonyl C=O (màu đỏ)
            const yO = yCarbonyl + 40;
            elements.push(`
                <line x1="${xC - 3}" y1="${yCarbonyl}" x2="${xC - 3}" y2="${yO - 10}" stroke="${redColor}" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="${xC + 3}" y1="${yCarbonyl}" x2="${xC + 3}" y2="${yO - 10}" stroke="${redColor}" stroke-width="2.2" stroke-linecap="round"/>
                <text x="${xC}" y="${yO + 6}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">O</text>
            `);

            // Liên kết peptide C-N (tô màu xanh dương chuẩn Image 2)
            if (i < n - 1) {
                elements.push(`
                    <line x1="${xC}" y1="${yCarbonyl}" x2="${xNextN - 10}" y2="${yN}" stroke="${blueColor}" stroke-width="3.2" stroke-linecap="round"/>
                    <text x="${xNextN}" y="${yN + 5}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">N</text>
                    <text x="${xNextN}" y="${yN + 24}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">H</text>
                    
                    <rect x="${xC + 10}" y="${yCarbonyl - 26}" width="48" height="18" rx="4" fill="rgba(37,99,235,0.12)" stroke="${blueColor}" stroke-width="1"/>
                    <text x="${xC + 34}" y="${yCarbonyl - 13}" fill="${blueColor}" font-family="Be Vietnam Pro, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">LK #${i + 1}</text>

                    <line x1="${xNextN + 8}" y1="${yN}" x2="${xNextCA}" y2="${yCA}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                `);
            } else {
                const xCterm = xC + 45;
                elements.push(`
                    <line x1="${xC}" y1="${yCarbonyl}" x2="${xCterm - 12}" y2="${yCarbonyl}" stroke="${strokeColor}" stroke-width="2.6" stroke-linecap="round"/>
                    <text x="${xCterm + 8}" y="${yCarbonyl + 5}" fill="${redColor}" font-family="Be Vietnam Pro, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">OH</text>
                `);
            }
        }

        return `
            <svg viewBox="0 20 ${totalWidth} 215" class="realistic-chem2d-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="background:${bg}; width:100%; height:auto; display:block;">
                ${elements.join('\n')}
            </svg>
        `;
    }

    /* =========================================================================
       BỘ SINH TỌA ĐỘ 3D PDB CHUẨN XÁC CHO MÔ HÌNH BALL-AND-STICK
       ========================================================================= */
    generatePeptidePdb(residues = ['GLY', 'HIS', 'GLY']) {
        const validRes = (residues && residues.length > 0 ? residues : ['GLY', 'HIS', 'GLY']).map(r => (r || 'GLY').toUpperCase().slice(0, 3));
        const key = validRes.join('-');

        if (key === 'GLY-HIS-GLY') {
            return `HEADER    TRIPEPTIDE GLY-HIS-GLY
ATOM      1  N   GLY A   1      -4.200   0.500   0.000  1.00 20.00           N
ATOM      2  CA  GLY A   1      -2.900   1.150   0.000  1.00 20.00           C
ATOM      3  C   GLY A   1      -1.750   0.200   0.000  1.00 20.00           C
ATOM      4  O   GLY A   1      -1.850  -1.020   0.100  1.00 20.00           O
ATOM      5  N   HIS A   2      -0.550   0.750  -0.100  1.00 20.00           N
ATOM      6  CA  HIS A   2       0.680  -0.020   0.000  1.00 20.00           C
ATOM      7  C   HIS A   2       1.920   0.850   0.050  1.00 20.00           C
ATOM      8  O   HIS A   2       1.850   2.080  -0.050  1.00 20.00           O
ATOM      9  CB  HIS A   2       0.700  -1.120  -1.060  1.00 20.00           C
ATOM     10  CG  HIS A   2       1.850  -2.070  -0.950  1.00 20.00           C
ATOM     11  ND1 HIS A   2       3.150  -1.780  -1.320  1.00 20.00           N
ATOM     12  CD2 HIS A   2       1.910  -3.350  -0.490  1.00 20.00           C
ATOM     13  CE1 HIS A   2       3.960  -2.820  -1.100  1.00 20.00           C
ATOM     14  NE2 HIS A   2       3.240  -3.800  -0.590  1.00 20.00           N
ATOM     15  N   GLY A   3       3.080   0.200   0.200  1.00 20.00           N
ATOM     16  CA  GLY A   3       4.350   0.900   0.250  1.00 20.00           C
ATOM     17  C   GLY A   3       5.550   0.000   0.200  1.00 20.00           C
ATOM     18  O   GLY A   3       5.450  -1.220   0.100  1.00 20.00           O
ATOM     19  OXT GLY A   3       6.700   0.600   0.250  1.00 20.00           O
TER
END`;
        }

        if (key === 'GLY-ALA' || key === 'VAL-LEU') {
            const r1 = validRes[0], r2 = validRes[1];
            return `HEADER    DIPEPTIDE ${key}
ATOM      1  N   ${r1} A   1      -2.600   0.500   0.000  1.00 20.00           N
ATOM      2  CA  ${r1} A   1      -1.300   1.150   0.000  1.00 20.00           C
ATOM      3  C   ${r1} A   1      -0.150   0.200   0.000  1.00 20.00           C
ATOM      4  O   ${r1} A   1      -0.250  -1.020   0.100  1.00 20.00           O
ATOM      5  CB  ${r1} A   1      -1.300   2.500   0.600  1.00 20.00           C
ATOM      6  N   ${r2} A   2       1.050   0.750  -0.100  1.00 20.00           N
ATOM      7  CA  ${r2} A   2       2.280  -0.020   0.000  1.00 20.00           C
ATOM      8  C   ${r2} A   2       3.520   0.850   0.050  1.00 20.00           C
ATOM      9  O   ${r2} A   2       3.450   2.080  -0.050  1.00 20.00           O
ATOM     10  CB  ${r2} A   2       2.300  -1.150  -1.040  1.00 20.00           C
ATOM     11  OXT ${r2} A   2       4.670   0.250   0.150  1.00 20.00           O
TER
END`;
        }

        // Tự động sinh tọa độ PDB mạch ziczac cho chuỗi bất kỳ
        let lines = [`HEADER    PEPTIDE ${key}`];
        let atomIdx = 1;
        let x = 0;

        validRes.forEach((resn, i) => {
            const resi = i + 1;
            const ySign = (i % 2 === 0) ? 1 : -1;
            
            lines.push(`ATOM  ${String(atomIdx++).padStart(5)}  N   ${resn} A${String(resi).padStart(4)}    ${(x).toFixed(3).padStart(8)}${(0.4 * ySign).toFixed(3).padStart(8)}   0.000  1.00 20.00           N`);
            lines.push(`ATOM  ${String(atomIdx++).padStart(5)}  CA  ${resn} A${String(resi).padStart(4)}    ${(x + 1.25).toFixed(3).padStart(8)}${(1.1 * ySign).toFixed(3).padStart(8)}   0.000  1.00 20.00           C`);
            if (resn !== 'GLY') {
                lines.push(`ATOM  ${String(atomIdx++).padStart(5)}  CB  ${resn} A${String(resi).padStart(4)}    ${(x + 1.25).toFixed(3).padStart(8)}${(2.5 * ySign).toFixed(3).padStart(8)}   0.600  1.00 20.00           C`);
            }
            lines.push(`ATOM  ${String(atomIdx++).padStart(5)}  C   ${resn} A${String(resi).padStart(4)}    ${(x + 2.45).toFixed(3).padStart(8)}${(0.35 * ySign).toFixed(3).padStart(8)}   0.000  1.00 20.00           C`);
            lines.push(`ATOM  ${String(atomIdx++).padStart(5)}  O   ${resn} A${String(resi).padStart(4)}    ${(x + 2.55).toFixed(3).padStart(8)}${(-0.85 * ySign).toFixed(3).padStart(8)}   0.200  1.00 20.00           O`);

            if (i === validRes.length - 1) {
                lines.push(`ATOM  ${String(atomIdx++).padStart(5)}  OXT ${resn} A${String(resi).padStart(4)}    ${(x + 3.65).toFixed(3).padStart(8)}${(0.9 * ySign).toFixed(3).padStart(8)}   0.150  1.00 20.00           O`);
            }
            x += 3.55;
        });

        lines.push('TER');
        lines.push('END');
        return lines.join('\n');
    }

    /* =========================================================================
       KHỞI TẠO VIEWER 3DMOL MINI CHẾ ĐỘ BALL-AND-STICK CHO CỘT PHẢI
       ========================================================================= */
    initDuo3DViewer(uniqueId, residues, customPdb = null) {
        const el = document.getElementById(uniqueId);
        if (!el) return;

        const MolLib = window.$3Dmol || window['3Dmol'];
        if (!MolLib) return;

        try {
            el.innerHTML = '';
            const pdbData = customPdb || this.generatePeptidePdb(residues);
            const viewer = MolLib.createViewer(el, {
                defaultcolors: MolLib.rasmolElementColors,
                backgroundColor: '#070d1d'
            });

            viewer.addModel(pdbData, 'pdb');
            viewer.setStyle({}, {
                stick: { radius: 0.16, colorscheme: 'Jmol' },
                sphere: { scale: 0.28, colorscheme: 'Jmol' }
            });
            viewer.zoomTo();
            viewer.render();

            let isSpinning = false;
            const btnReset = document.getElementById(`${uniqueId}_reset`);
            const btnSpin = document.getElementById(`${uniqueId}_spin`);
            const btnZoomIn = document.getElementById(`${uniqueId}_zoomin`);
            const btnZoomOut = document.getElementById(`${uniqueId}_zoomout`);

            if (btnReset) {
                btnReset.addEventListener('click', () => {
                    viewer.zoomTo();
                    viewer.render();
                });
            }
            if (btnSpin) {
                btnSpin.addEventListener('click', () => {
                    isSpinning = !isSpinning;
                    btnSpin.classList.toggle('active', isSpinning);
                    btnSpin.textContent = isSpinning ? '⏹ Dừng xoay' : '▷ Tự xoay';
                    viewer.spin(isSpinning ? 'y' : false, isSpinning ? 1 : 0);
                });
            }
            if (btnZoomIn) {
                btnZoomIn.addEventListener('click', () => {
                    viewer.zoom(1.2);
                    viewer.render();
                });
            }
            if (btnZoomOut) {
                btnZoomOut.addEventListener('click', () => {
                    viewer.zoom(0.83);
                    viewer.render();
                });
            }
        } catch (e) {
            console.warn("Lỗi khi khởi tạo duo 3D viewer:", e);
        }
    }

    /* =========================================================================
       RENDER TOÀN BỘ STUDIO 2 CỘT SONG SONG: 2D TRÁI + 3D PHẢI (CHUẨN IMAGE 2)
       ========================================================================= */
    renderPeptideDuoStudio(containerId, residues = ['GLY', 'HIS', 'GLY'], options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const info = this.calculatePeptideInfo(residues);
        const seqTitle = info.validRes.map(r => (r.charAt(0).toUpperCase() + r.slice(1).toLowerCase())).join(' - ');
        const isBiuret = info.bondsCount >= 2;
        const svg2D = this.generateRealisticPeptideSvg(info.validRes, true);

        const firstAaName = (this.aminoAcidRChains[info.firstRes] || {}).name || info.firstRes;
        const lastAaName = (this.aminoAcidRChains[info.lastRes] || {}).name || info.lastRes;

        const uniqueId = 'duo3D_' + Math.random().toString(36).substr(2, 9);

        container.innerHTML = `
            <div class="peptide-duo-studio" id="${uniqueId}_wrapper">
                <!-- BANNER TRẠNG THÁI KIỂM TRA HỢP LỆ -->
                <div class="peptide-valid-banner" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <div><span class="pv-icon">✅</span> Đã kiểm tra cấu trúc: <strong>${info.bondsCount} liên kết peptide</strong>, đầu N và đầu C hợp lệ.</div>
                    <button class="mini-control-btn" style="color:var(--neon-cyan); border-color:var(--neon-cyan); font-size:0.75rem;" onclick="window.chemical2DEngine.toggleStudioFullscreen('${uniqueId}_wrapper')" title="Phóng to toàn màn hình Studio 2D & 3D">
                        ⛶ Phóng To Toàn Màn Hình
                    </button>
                </div>

                <!-- KHỐI TIÊU ĐỀ & HUY HIỆU ĐẶC TÍNH (CHUẨN TUYỆT ĐỐI THEO IMAGE 2) -->
                <div class="peptide-header-block">
                    <div class="peptide-sub-label">CHUỖI ĐÃ TẠO - N &rarr; C</div>
                    <div class="peptide-title-row">
                        <h2 class="peptide-main-title">Chuỗi: ${seqTitle}</h2>
                        <div class="peptide-badge-group">
                            <span class="p-badge">${info.count} amino acid</span>
                            <span class="p-badge">${info.bondsCount} liên kết peptide</span>
                            <span class="p-badge">${info.bondsCount} H₂O tách ra</span>
                            <span class="p-badge p-badge-formula">${info.formula}</span>
                            <span class="p-badge p-badge-mw">M = ${info.mw} g/mol</span>
                        </div>
                    </div>
                    <div class="peptide-term-row">
                        <span class="term-item"><strong>N-terminus:</strong> <span class="term-val">${firstAaName} · NH₂ tự do</span></span>
                        <span class="term-divider">|</span>
                        <span class="term-item"><strong>C-terminus:</strong> <span class="term-val">${lastAaName} · C(=O)OH</span></span>
                        <span class="term-divider">|</span>
                        <span class="term-item"><strong>Phản ứng Biuret:</strong> <span style="font-weight:700; color:${isBiuret ? '#c084fc' : '#f43f5e'};">${isBiuret ? '✅ Dương tính (Màu tím)' : '❌ Âm tính (Dưới 2 LK)'}</span></span>
                    </div>
                </div>

                <!-- BỐ CỤC 2 CỘT SONG SONG: 2D TRÁI + 3D PHẢI (CHUẨN IMAGE 2) -->
                <div class="peptide-duo-grid">
                    <!-- CỘT 1: CẤU TRÚC 2D -->
                    <div class="peptide-col peptide-col-2d">
                        <div class="col-head">
                            <span class="col-title">Cấu trúc 2D</span>
                            <span class="col-meta" style="color:#2563eb; font-weight:600; font-size:0.82rem;">C(=O)-N được tô màu xanh</span>
                        </div>
                        <div class="chem2d-canvas-box">
                            ${svg2D}
                        </div>
                        <div class="col-footer-note">
                            Nhóm R được giữ đầy đủ. Với chuỗi dài, cuộn trong khung để xem toàn bộ cấu trúc.
                        </div>
                    </div>

                    <!-- CỘT 2: MÔ HÌNH 3D BALL-AND-STICK -->
                    <div class="peptide-col peptide-col-3d">
                        <div class="col-head">
                            <span class="col-title">Mô hình 3D</span>
                            <span class="col-meta-tag">Ball-and-stick</span>
                        </div>
                        <div class="chem3d-viewport-box">
                            <div id="${uniqueId}" style="width:100%; height:320px; position:relative;"></div>
                            
                            <!-- Nút điều khiển mini -->
                            <div class="duo-3d-toolbar">
                                <div class="duo-tb-left">
                                    <button class="duo-btn" id="${uniqueId}_reset" title="Đặt lại góc nhìn">🔄 Reset</button>
                                    <button class="duo-btn" id="${uniqueId}_spin" title="Bật/Tắt tự xoay">▷ Tự xoay</button>
                                </div>
                                <div class="duo-tb-right">
                                    <button class="duo-btn" id="${uniqueId}_zoomout" title="Thu nhỏ">−</button>
                                    <button class="duo-btn" id="${uniqueId}_zoomin" title="Phóng to">＋</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Bảng màu nguyên tố và hướng dẫn tương tác -->
                        <div class="duo-legend-bar">
                            <span class="leg-item"><span class="leg-dot dot-c"></span> C Carbon</span>
                            <span class="leg-item"><span class="leg-dot dot-h"></span> H Hydrogen</span>
                            <span class="leg-item"><span class="leg-dot dot-n"></span> N Nitrogen</span>
                            <span class="leg-item"><span class="leg-dot dot-o"></span> O Oxygen</span>
                            <span class="leg-item"><span class="leg-dot dot-s"></span> S Sulfur</span>
                        </div>
                        <div class="col-footer-note duo-interaction-hint">
                            Kéo để xoay · Cuộn chuột để zoom · Chụm hai ngón tay trên màn cảm ứng
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
            this.initDuo3DViewer(uniqueId, info.validRes, options.customPdb);
        }, 50);
    }

    toggleStudioFullscreen(wrapperId) {
        const el = document.getElementById(wrapperId);
        if (!el) return;

        const isFull = el.classList.toggle('studio-fullscreen');
        let exitBtn = document.getElementById('btnExitStudioFs_' + wrapperId);
        if (isFull) {
            if (!exitBtn) {
                exitBtn = document.createElement('button');
                exitBtn.id = 'btnExitStudioFs_' + wrapperId;
                exitBtn.className = 'btn-exit-fullscreen-floating';
                exitBtn.innerHTML = '✕ Thoát Toàn Màn Hình (ESC)';
                exitBtn.addEventListener('click', () => this.exitStudioFullscreen(wrapperId));
                document.body.appendChild(exitBtn);
            }
            if (window.app) window.app.showToast("Đã mở toàn màn hình Studio! Nhấn ESC hoặc nút đỏ để thoát.", "info");
        } else {
            this.exitStudioFullscreen(wrapperId);
        }
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 80);
    }

    exitStudioFullscreen(wrapperId) {
        const el = document.getElementById(wrapperId);
        if (el) el.classList.remove('studio-fullscreen');
        const exitBtn = document.getElementById('btnExitStudioFs_' + wrapperId);
        if (exitBtn) exitBtn.remove();
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 80);
    }

    // Tương thích ngược với các hàm cũ
    generatePeptideSegmentSvg(residues = ['GLY', 'ALA'], highlightIndex = 0, isWhiteBg = this.isWhiteBg) {
        return this.generateRealisticPeptideSvg(residues, isWhiteBg);
    }
    generateForces2DSvg(isWhiteBg = this.isWhiteBg) {
        return this.generateLevel3InteractionsSvg(isWhiteBg);
    }
}

// Khởi tạo global instance
if (typeof window !== 'undefined') {
    window.chemical2DEngine = new Chemical2DEngine();
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Chemical2DEngine;
}
