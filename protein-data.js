/**
 * PROTEINEXUS - Database & Biochemistry Knowledge Base
 * Dữ liệu chính thống trích xuất từ:
 * - Worldwide Protein Data Bank (wwPDB - https://www.wwpdb.org)
 * - Research Collaboratory for Structural Bioinformatics (RCSB PDB - https://www.rcsb.org)
 * - Protein Data Bank in Europe (PDBe - https://www.ebi.ac.uk/pdbe)
 * - Universal Protein Resource (UniProtKB - https://www.uniprot.org)
 */

const PROTEIN_DATABASE = [
    {
        id: "hemoglobin",
        name: "Hemoglobin (Huyết cầu tố người)",
        vietnameseName: "Hemoglobin (Huyết cầu tố)",
        pdbId: "4HHB",
        uniprotId: "P69905 (HBA) / P68871 (HBB)",
        category: "transport",
        structureLevel: 4,
        molecularWeight: "64.5 kDa",
        residueCount: 574,
        chains: "4 (2 Alpha + 2 Beta)",
        organism: "Homo sapiens (Người)",
        organismScientific: "Homo sapiens (NCBI TaxID: 9606)",
        experimentalMethod: "X-ray Crystallography (Nhiễu xạ tia X)",
        resolution: "1.74 Å",
        depositionDate: "07-03-1984",
        citation: {
            authors: "Fermi, G., Perutz, M.F., Shaanan, B., Fourme, R.",
            title: "The crystal structure of human deoxyhaemoglobin at 1.74 Å resolution",
            journal: "Journal of Molecular Biology",
            year: 1984,
            volume: "175(2)",
            pages: "159-174",
            doi: "10.1016/0022-2836(84)90472-8",
            pubmedId: "6726807"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/4HHB",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/4hhb",
            uniprot: "https://www.uniprot.org/uniprotkb/P69905"
        },
        functionDescription: "Vận chuyển khí Oxy (O2) từ phế nang phổi đến mô tế bào và vận chuyển CO2, H+ ngược lại phổi. Cấu trúc Bậc 4 đối xứng chứa 4 nhân Heme mang ion Fe2+ liên kết thuận nghịch với O2.",
        diseaseOrApplication: "Đột biến điểm tại vị trí số 6 chuỗi Beta (Glu6Val) làm chuỗi Hemoglobin biến tính thành sợi kết tụ, làm hồng cầu biến dạng thành hình liềm (Bệnh hồng cầu hình liềm).",
        highlightFeatures: ["Cấu trúc Bậc 4 kinh điển", "4 nhóm Heme chứa Fe2+", "Hiện tượng hợp tác Allosteric"],
        defaultStyle: "cartoon",
        defaultColor: "chain",
        sequenceSnippet: "VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR"
    },
    {
        id: "insulin",
        name: "Insulin (Hormone điều hòa glucose)",
        vietnameseName: "Insulin",
        pdbId: "4INS",
        uniprotId: "P01308 (INS)",
        category: "hormone",
        structureLevel: 3,
        molecularWeight: "5.8 kDa",
        residueCount: 51,
        chains: "2 (Chuỗi A: 21 aa, Chuỗi B: 30 aa)",
        organism: "Sus scrofa (Lợn) / Homo sapiens",
        organismScientific: "Sus scrofa (NCBI TaxID: 9823)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "1.50 Å",
        depositionDate: "27-04-1988",
        citation: {
            authors: "Baker, E.N., Blundell, T.L., Cutfield, J.F., Dodson, G.G., Hodgkin, D.C., et al.",
            title: "The structure of 2Zn pig insulin crystals at 1.5 Å resolution",
            journal: "Philosophical Transactions of the Royal Society B",
            year: 1988,
            volume: "319",
            pages: "369-456",
            doi: "10.1098/rstb.1988.0058",
            pubmedId: "2905485"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/4INS",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/4ins",
            uniprot: "https://www.uniprot.org/uniprotkb/P01308"
        },
        functionDescription: "Hormone peptide do tế bào Beta đảo tụy Langerhans tiết ra. Đóng vai trò chìa khóa mở kênh GLUT4 cho tế bào hấp thu glucose, kích hoạt tổng hợp glycogen và lipid.",
        diseaseOrApplication: "Thiếu hụt hoặc kháng insulin là nguyên nhân gây Bệnh Đái tháo đường (Diabetes Mellitus). Là protein đầu tiên trong lịch sử nhân loại được giải mã trình tự amino acid (Frederick Sanger, Nobel 1958) và tinh thể học (Dorothy Hodgkin, Nobel 1964).",
        highlightFeatures: ["3 cầu nối Disulfide (-S-S-)", "Cấu trúc hormone peptide", "Hai giải thưởng Nobel Lịch sử"],
        defaultStyle: "cartoon",
        defaultColor: "ss",
        sequenceSnippet: "A: GIVEQCCTSICSLYQLENYCN | B: FVNQHLCGSHLVEALYLVCGERGFFYTPKT"
    },
    {
        id: "gfp",
        name: "Green Fluorescent Protein (GFP)",
        vietnameseName: "Protein Huỳnh Quang Xanh",
        pdbId: "1EMA",
        uniprotId: "P42212 (GFP)",
        category: "optical",
        structureLevel: 3,
        molecularWeight: "26.9 kDa",
        residueCount: 238,
        chains: "1",
        organism: "Aequorea victoria (Sứa phát quang)",
        organismScientific: "Aequorea victoria (NCBI TaxID: 6100)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "1.90 Å",
        depositionDate: "03-09-1996",
        citation: {
            authors: "Ormo, M., Cubitt, A.B., Kallio, K., Gross, L.A., Tsien, R.Y., Remington, S.J.",
            title: "Crystal structure of the Aequorea victoria green fluorescent protein",
            journal: "Science",
            year: 1996,
            volume: "273(5280)",
            pages: "1392-1395",
            doi: "10.1126/science.273.5280.1392",
            pubmedId: "8781230"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1EMA",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1ema",
            uniprot: "https://www.uniprot.org/uniprotkb/P42212"
        },
        functionDescription: "Protein phát quang sinh học gồm thùng 11 phiến gấp Beta bảo vệ nhóm mang màu chromophore tự xúc tác được hình thành từ bộ ba Ser65-Tyr66-Gly67, phát xạ huỳnh quang 509 nm rực rỡ.",
        diseaseOrApplication: "Công cụ đánh dấu phân tử (Molecular Tag) số 1 trong sinh học phân tử hiện đại để theo dõi biểu hiện gen và chuyển động protein trong tế bào sống. Giải Nobel Hóa học 2008 (Shimomura, Chalfie, Tsien).",
        highlightFeatures: ["Thùng Beta 11 phiến (Beta-barrel)", "Chromophore Ser65-Tyr66-Gly67", "Giải Nobel Hóa học 2008"],
        defaultStyle: "cartoon",
        defaultColor: "spectrum",
        sequenceSnippet: "MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK"
    },
    {
        id: "collagen",
        name: "Collagen Triple Helix Model",
        vietnameseName: "Collagen (Sợi mô liên kết)",
        pdbId: "1CAG",
        uniprotId: "P02452 (COL1A1)",
        category: "structural",
        structureLevel: 4,
        molecularWeight: "300 kDa (Tropocollagen)",
        residueCount: 1050,
        chains: "3 (Triple Helix)",
        organism: "Homo sapiens / Bos taurus",
        organismScientific: "Synthetic peptide model of human collagen",
        experimentalMethod: "X-ray Crystallography",
        resolution: "1.85 Å",
        depositionDate: "13-09-1994",
        citation: {
            authors: "Bella, J., Eaton, M., Brodsky, B., Berman, H.M.",
            title: "Crystal and molecular structure of a collagen-like peptide at 1.9 Å resolution",
            journal: "Science",
            year: 1994,
            volume: "266(5182)",
            pages: "75-81",
            doi: "10.1126/science.7695699",
            pubmedId: "7695699"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1CAG",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1cag",
            uniprot: "https://www.uniprot.org/uniprotkb/P02452"
        },
        functionDescription: "Protein dạng sợi chiếm hơn 25-30% tổng lượng protein cơ thể, tạo nên khung nền ngoại bào chịu lực cho da, xương, gân, giác mạc. Cấu tạo từ bộ ba siêu xoắn độc nhất vô nhị (Gly-X-Y).",
        diseaseOrApplication: "Thiếu Vitamin C ức chế quá trình hydroxyl hóa Proline gây bệnh Scorbut. Đột biến gen collagen gây bệnh xương thủy tinh (Osteogenesis imperfecta) và hội chứng Ehlers-Danlos.",
        highlightFeatures: ["Siêu xoắn bộ ba (Triple-helix)", "Lặp lại Gly-Pro-Hyp", "Độ bền kéo vượt trội hơn thép"],
        defaultStyle: "cartoon",
        defaultColor: "chain",
        sequenceSnippet: "PPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPGPPG"
    },
    {
        id: "lysozyme",
        name: "Lysozyme (Hen Egg-White)",
        vietnameseName: "Lysozyme (Enzyme diệt khuẩn)",
        pdbId: "1AKI",
        uniprotId: "P00698 (LYSC_CHICK)",
        category: "enzyme",
        structureLevel: 3,
        molecularWeight: "14.3 kDa",
        residueCount: 129,
        chains: "1",
        organism: "Gallus gallus (Gà / Lòng trắng trứng)",
        organismScientific: "Gallus gallus (NCBI TaxID: 9031)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "1.50 Å",
        depositionDate: "03-03-1993",
        citation: {
            authors: "Artymiuk, P.J., Blake, C.C.F., Rice, D.W., Wilson, K.S.",
            title: "The atomic coordinates of hen egg-white lysozyme at 1.5 Å resolution",
            journal: "Acta Crystallographica Section B",
            year: 1982,
            volume: "38",
            pages: "778-783",
            doi: "10.1107/S056774088200405X",
            pubmedId: "7126487"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1AKI",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1aki",
            uniprot: "https://www.uniprot.org/uniprotkb/P00698"
        },
        functionDescription: "Enzyme thủy phân liên kết beta-1,4-glycosidic giữa axit N-acetylmuramic (NAM) và N-acetylglucosamine (NAG) trong thành tế bào peptidoglycan vi khuẩn, làm vỡ tế bào vi khuẩn.",
        diseaseOrApplication: "Phát hiện bởi Alexander Fleming (1922). Là enzyme đầu tiên trong lịch sử nhân loại được xác định cấu trúc không gian 3D chi tiết (David Phillips, 1965).",
        highlightFeatures: ["4 cầu nối Disulfide (-S-S-)", "Rãnh hoạt động xúc tác đặc hiệu", "Mô hình enzyme kinh điển của thế giới"],
        defaultStyle: "cartoon",
        defaultColor: "polarity",
        sequenceSnippet: "KVFGRCELAAAMKRHGLDNYRGYSLGNWVCAAKFESNFNTQATNRNTDGSTDYGILQINSRWWCNDGRTPGSRNLCNIPCSALLSSDITASVNCAKKIVSDGNGMNAWVAWRNRCKGTDVQAWIRGCRL"
    },
    {
        id: "myoglobin",
        name: "Myoglobin (Cơ bắp)",
        vietnameseName: "Myoglobin (Dự trữ oxy mô cơ)",
        pdbId: "1MBO",
        uniprotId: "P02185 (MYG_PHYCA)",
        category: "transport",
        structureLevel: 3,
        molecularWeight: "17.1 kDa",
        residueCount: 153,
        chains: "1",
        organism: "Physeter catodon (Cá voi nhà táng)",
        organismScientific: "Physeter catodon (NCBI TaxID: 9755)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "1.40 Å",
        depositionDate: "15-04-1980",
        citation: {
            authors: "Phillips, S.E.",
            title: "Structure and refinement of oxymyoglobin at 1.6 Å resolution",
            journal: "Journal of Molecular Biology",
            year: 1980,
            volume: "142(4)",
            pages: "531-554",
            doi: "10.1016/0022-2836(80)90262-4",
            pubmedId: "7452668"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1MBO",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1mbo",
            uniprot: "https://www.uniprot.org/uniprotkb/P02185"
        },
        functionDescription: "Protein hình cầu đơn chuỗi dự trữ oxy trong tế bào cơ vân và cơ tim. Giúp động vật lặn sâu duy trì oxy trong thời gian dài. Ái lực O2 cao hơn Hemoglobin.",
        diseaseOrApplication: "Protein đầu tiên trong lịch sử nhân loại được xác định cấu trúc 3D bằng nhiễu xạ tia X (John Kendrew, Giải Nobel Hóa học 1962).",
        highlightFeatures: ["8 đoạn xoắn Alpha kinh điển", "1 nhóm Heme chứa Fe2+", "Giải Nobel Hóa học 1962"],
        defaultStyle: "cartoon",
        defaultColor: "ss",
        sequenceSnippet: "VLSEGEWQLVLHVWAKVEADVAGHGQDILIRLFKSHPETLEKFDRFKHLKTEAEMKASEDLKKHGVTVLTALGAILKKKGHHEAELKPLAQSHATKHKIPIKYLEFISEAIIHVLHSRHPGDFGADAQGAMNKALELFRKDIAAKYKELGYQG"
    },
    {
        id: "igg",
        name: "Immunoglobulin G (Kháng thể IgG)",
        vietnameseName: "Kháng thể IgG",
        pdbId: "1IGT",
        uniprotId: "P01868 (IGHG2A)",
        category: "immune",
        structureLevel: 4,
        molecularWeight: "150 kDa",
        residueCount: 1300,
        chains: "4 (2 chuỗi nặng Heavy + 2 chuỗi nhẹ Light)",
        organism: "Mus musculus (Chuột)",
        organismScientific: "Mus musculus (NCBI TaxID: 10090)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "2.80 Å",
        depositionDate: "14-07-1997",
        citation: {
            authors: "Harris, L.J., Larson, S.B., Hasel, K.W., McPherson, A.",
            title: "Refined structure of an intact IgG2a monoclonal antibody at 2.8 Å resolution",
            journal: "Biochemistry",
            year: 1997,
            volume: "36(6)",
            pages: "1581-1597",
            doi: "10.1021/bi962514+",
            pubmedId: "9063869"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1IGT",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1igt",
            uniprot: "https://www.uniprot.org/uniprotkb/P01868"
        },
        functionDescription: "Kháng thể dịch thể phong phú nhất trong máu động vật có vú (75-80%). Cấu trúc hình chữ Y gồm 2 vùng Fab gắn kháng nguyên đặc hiệu và 1 vùng cán Fc kích hoạt bổ thể và đại thực bào.",
        diseaseOrApplication: "Nền tảng của liệu pháp kháng thể đơn dòng (Monoclonal Antibody) trong điều trị ung thư, bệnh tự miễn và xét nghiệm chẩn đoán ELISA/Rapid Test.",
        highlightFeatures: ["Hình chữ Y kinh điển", "16 cầu nối Disulfide", "Miễn dịch dịch thể dịch thuật"],
        defaultStyle: "cartoon",
        defaultColor: "chain",
        sequenceSnippet: "EVQLQQSGAELVKPGASVKLSCTASGFNIKDTYMHWVKQRPEQGLEWIGRIDPANGNTKYDPKFQGKATITADTSSNTAYLQLSSLTSEDTAVYYCARVYYGSSYDYAMDYWGQGTSVTVSS"
    },
    {
        id: "catalase",
        name: "Catalase (Bovine Liver)",
        vietnameseName: "Catalase (Enzyme khử độc H2O2)",
        pdbId: "1DGB",
        uniprotId: "P00432 (CATA_BOVIN)",
        category: "enzyme",
        structureLevel: 4,
        molecularWeight: "240 kDa (Tetramer)",
        residueCount: 2000,
        chains: "4 (Đồng nhất)",
        organism: "Bos taurus (Bò)",
        organismScientific: "Bos taurus (NCBI TaxID: 9913)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "2.00 Å",
        depositionDate: "03-01-2000",
        citation: {
            authors: "Ko, T.P., Day, J., McPherson, A.",
            title: "Structure of bovine liver catalase at 2.0 Å resolution",
            journal: "Acta Crystallographica Section D",
            year: 2000,
            volume: "56(6)",
            pages: "679-688",
            doi: "10.1107/s0907444900003507",
            pubmedId: "10818344"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1DGB",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1dgb",
            uniprot: "https://www.uniprot.org/uniprotkb/P00432"
        },
        functionDescription: "Enzyme phân giải hydrogen peroxide (H2O2) độc hại thành nước và khí oxy với hằng số xúc tác kỷ lục (hàng triệu phân tử mỗi giây trên một phân tử enzyme).",
        diseaseOrApplication: "Bảo vệ tế bào khỏi stress oxy hóa và các gốc tự do ROS gây lão hóa và ung thư. Thí nghiệm nhỏ H2O2 vào mô gan sống làm bùng bọt khí oxy là bài thực hành sinh học kinh điển.",
        highlightFeatures: ["Tốc độ xúc tác hàng triệu phân tử/giây", "4 nhóm Heme chứa Fe3+", "Bảo vệ ty thể và màng tế bào"],
        defaultStyle: "cartoon",
        defaultColor: "chain",
        sequenceSnippet: "MNNEETATVVPETDTPVIVDRLHQYVNNVADHLGKKWNLKVTPAETAEALKEAGLKPEEVYQTVAKKGVTVFDRNIPGFDVLKDEFRK"
    },
    {
        id: "crambin",
        name: "Crambin (Chuẩn tinh thể phân giải siêu cao)",
        vietnameseName: "Crambin",
        pdbId: "1CRN",
        uniprotId: "P01542 (CRAB_CRAAB)",
        category: "structural",
        structureLevel: 3,
        molecularWeight: "4.7 kDa",
        residueCount: 46,
        chains: "1",
        organism: "Crambe abyssinica (Cải Crambe)",
        organismScientific: "Crambe abyssinica (NCBI TaxID: 3721)",
        experimentalMethod: "X-ray Crystallography",
        resolution: "0.54 Å (Siêu phân giải nguyên tử)",
        depositionDate: "30-04-1981",
        citation: {
            authors: "Teeter, M.M.",
            title: "Water structure of a hydrophobic protein at atomic resolution: pentagon rings of water molecules in crystals of crambin",
            journal: "Proceedings of the National Academy of Sciences USA",
            year: 1984,
            volume: "81(19)",
            pages: "6014-6018",
            doi: "10.1073/pnas.81.19.6014",
            pubmedId: "6592601"
        },
        officialDatabaseUrls: {
            rcsb: "https://www.rcsb.org/structure/1CRN",
            pdbe: "https://www.ebi.ac.uk/pdbe/entry/pdb/1crn",
            uniprot: "https://www.uniprot.org/uniprotkb/P01542"
        },
        functionDescription: "Protein hạt nhỏ bé, không tan trong nước tinh khiết nhưng tan trong ethanol. Nhờ mạng tinh thể hoàn hảo không khuyết tật, nó có cấu trúc tinh thể nguyên tử phân giải siêu cao bậc nhất thế giới (0.54 Å).",
        diseaseOrApplication: "Mô hình 'Tiêu chuẩn Vàng' (Gold Standard Benchmark) trong tinh thể học tia X và nghiên cứu động lực học phân tử (Molecular Dynamics) trên toàn cầu.",
        highlightFeatures: ["Độ phân giải siêu cao 0.54 Å", "3 cầu nối Disulfide cố định", "Tiêu chuẩn kiểm thử thuật toán sinh học"],
        defaultStyle: "cartoon",
        defaultColor: "spectrum",
        sequenceSnippet: "TTCCPSIVARSNFNVCRLPGTPEAICATYTGCIIIPGATCPGDYAN"
    }
];

// 20 Amino Acid chuẩn trong Sinh học phân tử
const AMINO_ACID_TABLE = [
    { code3: "ALA", code1: "A", name: "Alanine", type: "nonpolar", pI: 6.00, mw: 89.09, polarity: "Kỵ nước (Hydrophobic)", codons: ["GCU", "GCC", "GCA", "GCG"], desc: "Không phân cực, mạch bên methyl đơn giản, rất ưa thích cấu trúc xoắn alpha." },
    { code3: "ARG", code1: "R", name: "Arginine", type: "positive", pI: 10.76, mw: 174.20, polarity: "Tích điện dương (Bazơ)", codons: ["CGU", "CGC", "CGA", "CGG", "AGA", "AGG"], desc: "Chứa nhóm guanidinium luôn tích điện dương ở pH sinh lý, tạo cầu muối ion vững chắc." },
    { code3: "ASN", code1: "N", name: "Asparagine", type: "polar", pI: 5.41, mw: 132.12, polarity: "Phân cực không tích điện", codons: ["AAU", "AAC"], desc: "Nhóm amide ở mạch bên, vị trí N-glycosyl hóa gắn chuỗi đường vào protein." },
    { code3: "ASP", code1: "D", name: "Aspartic Acid", type: "negative", pI: 2.77, mw: 133.10, polarity: "Tích điện âm (Axit)", codons: ["GAU", "GAC"], desc: "Chứa nhóm carboxylate (-COO-) tích điện âm, thường nằm ở vị trí trung tâm hoạt động enzyme." },
    { code3: "CYS", code1: "C", name: "Cysteine", type: "special", pI: 5.07, mw: 121.16, polarity: "Đặc biệt (Tạo cầu S-S)", codons: ["UGU", "UGC"], desc: "Chứa nhóm thiol (-SH) tự do, 2 gốc Cysteine tạo cầu nối Disulfide (-S-S-) cố định cấu trúc bậc 3 và 4." },
    { code3: "GLN", code1: "Q", name: "Glutamine", type: "polar", pI: 5.65, mw: 146.15, polarity: "Phân cực không tích điện", codons: ["CAA", "CAG"], desc: "Mạch bên dài mang nhóm amide, chất vận chuyển nhóm amin an toàn trong máu." },
    { code3: "GLU", code1: "E", name: "Glutamic Acid", type: "negative", pI: 3.22, mw: 147.13, polarity: "Tích điện âm (Axit)", codons: ["GAA", "GAG"], desc: "Nhóm carboxylate tích điện âm, chất dẫn truyền thần kinh quan trọng trong não bộ." },
    { code3: "GLY", code1: "G", name: "Glycine", type: "special", pI: 5.97, mw: 75.07, polarity: "Đặc biệt (Nhỏ nhất, linh hoạt)", codons: ["GGU", "GGC", "GGA", "GGG"], desc: "Amino acid nhỏ nhất (nhóm R chỉ là -H), duy nhất không có đồng phân quang học, linh hoạt cực cao." },
    { code3: "HIS", code1: "H", name: "Histidine", type: "positive", pI: 7.59, mw: 155.16, polarity: "Tích điện dương yếu (Bazơ)", codons: ["CAU", "CAC"], desc: "Nhóm imidazole có pKa ~ 6.0 gần sát pH tế bào, là chất cho/nhận proton lý tưởng trong xúc tác enzym." },
    { code3: "ILE", code1: "I", name: "Isoleucine", type: "nonpolar", pI: 6.02, mw: 131.18, polarity: "Kỵ nước (Hydrophobic)", codons: ["AUU", "AUC", "AUA"], desc: "Amino acid thiết yếu chuỗi nhánh (BCAA), kỵ nước mạnh, đóng gói vào lõi phân tử protein." },
    { code3: "LEU", code1: "L", name: "Leucine", type: "nonpolar", pI: 5.98, mw: 131.18, polarity: "Kỵ nước (Hydrophobic)", codons: ["UUA", "UUG", "CUU", "CUC", "CUA", "CUG"], desc: "Amino acid thiết yếu phổ biến nhất trong protein, kích thích trực tiếp con đường tổng hợp cơ bắp mTOR." },
    { code3: "LYS", code1: "K", name: "Lysine", type: "positive", pI: 9.74, mw: 146.19, polarity: "Tích điện dương (Bazơ)", codons: ["AAA", "AAG"], desc: "Nhóm amino (-NH3+) ở cuối chuỗi butyl, dễ bị biến đổi sau dịch mã như acetyl hóa, ubiquitin hóa." },
    { code3: "MET", code1: "M", name: "Methionine", type: "nonpolar", pI: 5.74, mw: 149.21, polarity: "Kỵ nước (Chứa lưu huỳnh)", codons: ["AUG"], desc: "Amino acid mở đầu cho quá trình dịch mã tổng hợp protein ở sinh vật nhân thực (AUG codon)." },
    { code3: "PHE", code1: "F", name: "Phenylalanine", type: "nonpolar", pI: 5.48, mw: 165.19, polarity: "Kỵ nước thơm (Aromatic)", codons: ["UUU", "UUC"], desc: "Nhóm phenyl thơm cồng kềnh, tạo tương tác xếp chồng pi-pi (pi-stacking) bên trong lõi protein." },
    { code3: "PRO", code1: "P", name: "Proline", type: "special", pI: 6.30, mw: 115.13, polarity: "Đặc biệt (Cấu trúc vòng Imino)", codons: ["CCU", "CCC", "CCA", "CCG"], desc: "Amino acid vòng duy nhất tạo khúc uốn cố định, làm bẻ gãy xoắn alpha (alpha-helix breaker)." },
    { code3: "SER", code1: "S", name: "Serine", type: "polar", pI: 5.68, mw: 105.09, polarity: "Phân cực không tích điện", codons: ["UCU", "UCC", "UCA", "UCG", "AGU", "AGC"], desc: "Chứa nhóm hydroxyl (-OH), mục tiêu chính của các enzyme phosphoryl hóa (Kinase) truyền tín hiệu." },
    { code3: "THR", code1: "T", name: "Threonine", type: "polar", pI: 5.60, mw: 119.12, polarity: "Phân cực không tích điện", codons: ["ACU", "ACC", "ACA", "ACG"], desc: "Chứa nhóm hydroxyl và carbon bất đối thứ hai, tham gia phosphoryl hóa và O-glycosyl hóa." },
    { code3: "TRP", code1: "W", name: "Tryptophan", type: "nonpolar", pI: 5.89, mw: 204.23, polarity: "Kỵ nước thơm lớn nhất", codons: ["UGG"], desc: "Nhóm indole thơm lớn nhất, hấp thụ mạnh tia tử ngoại UV ở bước sóng 280 nm (dùng định lượng protein)." },
    { code3: "TYR", code1: "Y", name: "Tyrosine", type: "polar", pI: 5.66, mw: 181.19, polarity: "Phân cực thơm (Phenol)", codons: ["UAU", "UAC"], desc: "Nhóm phenol có thể bị phosphoryl hóa bởi Tyrosine Kinase trong thụ thể tăng trưởng tế bào." },
    { code3: "VAL", code1: "V", name: "Valine", type: "nonpolar", pI: 5.96, mw: 117.15, polarity: "Kỵ nước (Hydrophobic)", codons: ["GUU", "GUC", "GUA", "GUG"], desc: "Amino acid chuỗi nhánh (BCAA), kỵ nước, đột biến thay thế Glu bằng Val gây bệnh hồng cầu liềm." }
];

// Kiến thức và quy chuẩn thí nghiệm
const LAB_EXPERIMENTS = {
    coagulation: {
        title: "Thí nghiệm Đông tụ Protein (Protein Denaturation & Coagulation)",
        description: "Khảo sát hiện tượng biến tính và đông tụ của protein khi chịu tác động của các yếu tố vật lý (nhiệt độ) và hóa học (axit, cồn, muối kim loại nặng).",
        reagents: [
            { id: "heat", name: "Bếp đun nhiệt độ (Heat)", unit: "°C", defaultVal: 25, min: 20, max: 100 },
            { id: "hcl", name: "Axit mạnh HCl 10%", color: "#ef4444", effect: "Biến tính do thay đổi điện tích pH < 2" },
            { id: "ethanol", name: "Cồn Ethanol 90°", color: "#38bdf8", effect: "Cạnh tranh vỏ hydrat hóa, phá vỡ tương tác kỵ nước" },
            { id: "cuso4", name: "Muối kim loại CuSO4", color: "#0ea5e9", effect: "Tạo liên kết chéo với nhóm -SH, biến tính không thuận nghịch" },
            { id: "nacl", name: "Muối bão hòa NaCl (Diêm kết)", color: "#f8fafc", effect: "Chiếm giữ nước (Salting-out), có thể hoàn nguyên khi thêm nước!" }
        ]
    },
    biuret: {
        title: "Thí nghiệm Phản ứng màu Biuret (Biuret Reaction)",
        description: "Phương pháp định tính và định lượng liên kết peptide (-CO-NH-) trong dung dịch sinh học bằng phức chất đồng kiềm.",
        principle: "Trong môi trường kiềm (NaOH), các liên kết peptide phản ứng với ion Cu2+ tạo phức chất màu tím hoặc tím hoa cà đặc trưng (chelate Cu-N). Phản ứng dương tính khi phân tử có từ 2 liên kết peptide trở lên.",
        samples: [
            { id: "egg_white", name: "Dung dịch Lòng trắng trứng (Albumin)", type: "protein", peptideBonds: "Rất nhiều (> 500)", result: "positive", color: "#7c3aed", absorbance: 0.82, note: "Phản ứng dương tính mạnh, dung dịch hóa tím hoa cà rực rỡ." },
            { id: "milk", name: "Sữa tươi nguyên chất (Casein)", type: "protein", peptideBonds: "Nhiều", result: "positive", color: "#9333ea", absorbance: 0.58, note: "Phản ứng dương tính, dung dịch chuyển sang màu tím đậm." },
            { id: "glycine", name: "Dung dịch Amino acid Glycine tự do", type: "amino_acid", peptideBonds: "0 (Không có)", result: "negative", color: "#38bdf8", absorbance: 0.05, note: "Âm tính! Glycine là amino acid tự do, không có liên kết peptide. Tạo kết tủa xanh Cu(OH)2." },
            { id: "starch", name: "Dung dịch Hồ tinh bột", type: "carbohydrate", peptideBonds: "0 (Không có)", result: "negative", color: "#0ea5e9", absorbance: 0.03, note: "Âm tính! Tinh bột là polysaccharide, không có liên kết peptide. Dung dịch có màu xanh nhạt của Cu2+." },
            { id: "distilled_water", name: "Nước cất (Mẫu đối chứng âm)", type: "control", peptideBonds: "0", result: "negative", color: "#60a5fa", absorbance: 0.01, note: "Âm tính! Nước cất không chứa hợp chất hữu cơ, dung dịch xanh lam nhạt Cu(OH)2 loãng." },
            { id: "gelatin", name: "Dung dịch Gelatin (Collagen thủy phân)", type: "peptide", peptideBonds: "Trung bình", result: "positive", color: "#a855f7", absorbance: 0.45, note: "Phản ứng dương tính, chuyển màu tím hồng đặc trưng." }
        ]
    }
};
