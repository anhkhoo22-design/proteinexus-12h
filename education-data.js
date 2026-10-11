/**
 * PROTEINEXUS 3D - DỮ LIỆU GIÁO DỤC, LÍ THUYẾT VÀ BÀI TẬP ÔN LUYỆN CHUYÊN ĐỀ
 * Chuẩn hóa 100% theo Chương trình GDPT 2018 (Hóa học 12 mới: KNTT, Cánh Diều, Chân Trời Sáng Tạo)
 * Bao gồm:
 * 1. Danh mục lí thuyết chi tiết từng loại protein & câu hỏi trắc nghiệm
 * 2. Lí thuyết chi tiết từng thí nghiệm & câu hỏi trắc nghiệm
 * 3. Danh mục tổng kết lí thuyết toàn diện (Sổ tay Hóa học 12)
 * 4. 5 Chủ đề ôn luyện chuyên sâu (Cấu trúc, Phân loại, Cấu tạo peptide, Tính toán, Thí nghiệm)
 * 5. Dữ liệu phân đoạn peptide mẫu (Segment Inspector)
 */

// =============================================================================
// MODULE 1: DANH MỤC LÍ THUYẾT CHO TỪNG LOẠI PROTEIN
// =============================================================================
const PROTEIN_TYPES_THEORY = [
    {
        id: "albumin",
        name: "Albumin (Lòng trắng trứng & Huyết thanh)",
        shapeType: "globular", // hình cầu
        compositionType: "simple", // đơn giản
        shapeTypeName: "Protein hình cầu (Globular)",
        compositionTypeName: "Protein đơn giản (Simple)",
        mw: "Khoảng 45 kDa (Ovalbumin) - 66.5 kDa (Serum albumin)",
        solubility: "Tan tốt trong nước tạo dung dịch keo (sol)",
        sources: "Lòng trắng trứng gà/vịt, huyết thanh máu người và động vật, sữa.",
        structureNotes: "Cấu trúc cuộn gập đặc khít dạng hình cầu. Chứa nhiều gốc amino acid phân cực hướng ra ngoài giúp tương tác với nước tạo vỏ hydrat hóa bền vững.",
        keyProperties: [
            "Đông tụ mạnh khi đun nóng (60 - 80°C) tạo mạng lưới gel màu trắng đục.",
            "Bị đông tụ tạo kết tủa khi cho thêm axit mạnh (HCl, HNO3), cồn (ethanol) hoặc muối kim loại nặng (CuSO4, Pb2+).",
            "Diêm kết thuận nghịch bằng dung dịch muối ăn NaCl hoặc (NH4)2SO4 bão hòa (tan lại khi thêm nước).",
            "Cho phản ứng màu Biuret màu tím hoa cà rực rỡ (chứa hàng trăm liên kết peptide).",
            "Cho phản ứng Xanthoproteic kết tủa vàng với HNO3 đặc (chứa Tyrosine, Phenylalanine)."
        ],
        biologicalRole: "Dự trữ dinh dưỡng cho phôi thai phát triển (lòng trắng trứng); duy trì áp suất keo trong máu và vận chuyển các chất (axit béo, thuốc, hormone) trong huyết thanh.",
        realLifeApp: "Hiện tượng trứng luộc chín đông đặc lòng trắng; nấu canh cua/thịt nổi váng (gạch cua); dùng lòng trắng trứng để giải độc cấp tính khi uống nhầm muối kim loại nặng.",
        questions: [
            {
                q: "Hiện tượng lòng trắng trứng đông đặc lại khi luộc trong nước sôi là do:",
                options: [
                    "A. Protein Albumin bị thủy phân hoàn toàn thành amino acid",
                    "B. Protein Albumin bị đông tụ do nhiệt độ cao làm biến tính",
                    "C. Protein Albumin tác dụng với ion Ca2+ trong vỏ trứng",
                    "D. Protein Albumin bay hơi bớt nước tạo chất rắn"
                ],
                answer: 1,
                explain: "Khi đun nóng, nhiệt độ cao phá vỡ các liên kết hydrogen và tương tác yếu duy trì cấu trúc không gian bậc 2, 3, 4 của Albumin, làm chuỗi bung tháo và kết tụ lại với nhau tạo khối đông tụ trắng đục (hiện tượng đông tụ nhiệt)."
            },
            {
                q: "Khi nhỏ vài giọt dung dịch CuSO4 và NaOH vào ống nghiệm đựng dung dịch lòng trắng trứng, hiện tượng quan sát được là:",
                options: [
                    "A. Xuất hiện kết tủa màu nâu đỏ của Cu2O",
                    "B. Xuất hiện kết tủa màu xanh lam của Cu(OH)2 không đổi",
                    "C. Dung dịch chuyển sang màu tím hoa cà đặc trưng",
                    "D. Dung dịch sủi bọt khí không màu và mất mùi"
                ],
                answer: 2,
                explain: "Đây là phản ứng màu Biuret kinh điển: Albumin có nhiều liên kết peptide, trong môi trường kiềm (NaOH) tạo phức chất chelate với ion Cu2+ cho dung dịch màu tím hoa cà đặc trưng."
            },
            {
                q: "Vì sao người bị ngộ độc muối kim loại nặng (như muối chì, đồng, thủy ngân) có thể được sơ cứu bằng cách cho uống lòng trắng trứng sống?",
                options: [
                    "A. Lòng trắng trứng có tính kiềm giúp trung hòa axit trong dạ dày",
                    "B. Protein albumin tạo kết tủa không tan với các ion kim loại nặng, ngăn hấp thu vào máu",
                    "C. Lòng trắng trứng hòa tan hoàn toàn muối kim loại và đào thải nhanh",
                    "D. Lòng trắng trứng tiêu diệt độc tố bằng enzyme kháng sinh"
                ],
                answer: 1,
                explain: "Các ion kim loại nặng (Cu2+, Pb2+, Hg2+) làm đông tụ và biến tính protein albumin tạo thành các kết tủa không tan, giữ kim loại lại trong lòng dạ dày, ngăn không cho chúng thấm vào thành ruột và máu."
            }
        ]
    },
    {
        id: "hemoglobin",
        name: "Hemoglobin (Huyết cầu tố / Hb)",
        shapeType: "globular",
        compositionType: "conjugated", // phức tạp
        shapeTypeName: "Protein hình cầu (Globular)",
        compositionTypeName: "Protein phức tạp (Conjugated - Chromoprotein)",
        mw: "64.5 kDa (Tetramer)",
        solubility: "Tan trong nước tạo dung dịch màu đỏ thẩm thấu trong hồng cầu",
        sources: "Có trong tế bào hồng cầu của người và động vật có xương sống.",
        structureNotes: "Cấu trúc bậc 4 đối xứng hoàn hảo gồm 4 tiểu đơn vị polypeptide (2 chuỗi Alpha 141 aa + 2 chuỗi Beta 146 aa). Mỗi chuỗi liên kết phối trí với 1 nhóm ngoại Heme chứa ion Fe2+ ở trung tâm vòng porphyrin.",
        keyProperties: [
            "Kết hợp thuận nghịch với khí Oxy: Hb + 4O2 ⇄ Hb(O2)4 (Oxyhemoglobin đỏ tươi ở phổi, giải phóng O2 ở mô).",
            "Hiện tượng hợp tác Allosteric: Khi 1 phân tử O2 gắn vào 1 nhân Heme làm tăng ái lực gắn O2 của 3 tiểu đơn vị còn lại.",
            "Liên kết rất bền với khí CO (Cacbon monoxit) tạo Carboxyhemoglobin (ái lực gấp 200-250 lần O2), gây ngạt thở và tử vong.",
            "Bị biến tính nhiệt làm mất màu đỏ tươi và đông tụ."
        ],
        biologicalRole: "Chuyên chở khí Oxy từ phế nang phổi đến toàn bộ mô tế bào và vận chuyển khí CO2, ion H+ từ mô ngược về phổi.",
        realLifeApp: "Bệnh hồng cầu hình liềm (Sickle-cell anemia) xuất phát từ đột biến thay thế đúng 1 gốc amino acid tại vị trí số 6 chuỗi Beta (Glu6Val), làm Hemoglobin kết tụ thành sợi dài làm biến dạng hồng cầu.",
        questions: [
            {
                q: "Hemoglobin thuộc loại protein nào theo thành phần hóa học?",
                options: [
                    "A. Protein đơn giản vì chỉ tạo thành từ các alpha-amino acid",
                    "B. Protein phức tạp vì ngoài phần protein (globin) còn có nhóm ngoại Heme mang ion Fe2+",
                    "C. Protein hình sợi vì tạo thành các búi sợi bền chắc",
                    "D. Polysaccharide liên kết với lipid"
                ],
                answer: 1,
                explain: "Hemoglobin là một protein phức tạp (chromoprotein) gồm phần apoprotein (globin gồm 4 chuỗi polypeptide) kết hợp với nhóm ngoại phi protein là nhân Heme mang Fe2+."
            },
            {
                q: "Nguyên nhân dẫn đến bệnh hồng cầu hình liềm ở người là do đột biến nào trên chuỗi Beta của Hemoglobin?",
                options: [
                    "A. Thay thế gốc Glutamic acid (phân cực, tích điện âm) bằng Valine (kỵ nước)",
                    "B. Thay thế gốc Glycine bằng Alanine",
                    "C. Mất hoàn toàn chuỗi Alpha trong cấu trúc bậc 4",
                    "D. Thừa một nguyên tử Sắt Fe2+ trong nhân Heme"
                ],
                answer: 0,
                explain: "Đột biến điểm Glu6Val (gốc Glutamic acid tích điện âm ở vị trí số 6 bị thay bằng Valine kỵ nước) tạo một mấu kỵ nước dính vào chuỗi bên cạnh khi mất oxy, làm phân tử kết tụ thành sợi cứng làm biến dạng hồng cầu thành hình trăng lưỡi liềm."
            }
        ]
    },
    {
        id: "insulin",
        name: "Insulin (Hormone điều hòa đường huyết)",
        shapeType: "globular",
        compositionType: "simple",
        shapeTypeName: "Protein hình cầu nhỏ / Hormone peptide",
        compositionTypeName: "Protein đơn giản (Simple peptide hormone)",
        mw: "5.8 kDa (51 amino acid)",
        solubility: "Tan trong nước, dung dịch đệm sinh lý",
        sources: "Tiết ra bởi tế bào Beta của đảo tụy Langerhans trong tuyến tụy.",
        structureNotes: "Gồm 2 chuỗi polypeptide: Chuỗi A (21 aa) và Chuỗi B (30 aa). Hai chuỗi nối với nhau bởi 2 cầu nối Disulfide liên chuỗi (A7-B7 và A20-B19) và chuỗi A có 1 cầu Disulfide nội chuỗi (A6-A11).",
        keyProperties: [
            "Cực kỳ nhạy cảm với nhiệt độ và enzyme tiêu hóa (bị enzyme protease thủy phân trong dạ dày nên không uống được mà phải tiêm).",
            "Cầu nối Disulfide (-S-S-) là then chốt cố định cấu hình không gian có hoạt tính sinh học.",
            "Protein đầu tiên trong lịch sử nhân loại được giải mã hoàn chỉnh trình tự amino acid (Frederick Sanger, 1958) và tinh thể học (Dorothy Hodgkin, 1964)."
        ],
        biologicalRole: "Chất hạ đường huyết duy nhất trong cơ thể: Thúc đẩy tế bào hấp thu Glucose từ máu chuyển hóa thành năng lượng hoặc tích lũy dưới dạng Glycogen tại gan và cơ.",
        realLifeApp: "Thuốc điều trị sống còn cho bệnh nhân Đái tháo đường tuýp 1 và tuýp 2 giai đoạn nặng. Sản xuất quy mô công nghiệp bằng công nghệ ADN tái tổ hợp trong vi khuẩn E. coli.",
        questions: [
            {
                q: "Vì sao người bệnh tiểu đường phải tiêm insulin dưới da mà không dùng đường uống?",
                options: [
                    "A. Insulin không thể tan trong nước nên không hấp thu qua ruột non",
                    "B. Bản chất là protein nên insulin sẽ bị các enzyme tiêu hóa dạ dày và ruột thủy phân thành amino acid mất hoạt tính",
                    "C. Insulin có vị rất đắng gây nôn mửa cho bệnh nhân",
                    "D. Insulin vào dạ dày sẽ phản ứng tạo khí gây thủng dạ dày"
                ],
                answer: 1,
                explain: "Insulin là một hormone bản chất protein/polypeptide. Khi đi vào đường tiêu hóa, men pepsin trong dạ dày và trypsin trong ruột sẽ cắt các liên kết peptide, thủy phân insulin thành các amino acid làm mất hoàn toàn cấu trúc không gian và tác dụng hạ đường huyết."
            },
            {
                q: "Số liên kết peptide có trong một phân tử insulin (gồm chuỗi A có 21 gốc amino acid và chuỗi B có 30 gốc amino acid) là:",
                options: [
                    "A. 51 liên kết",
                    "B. 50 liên kết",
                    "C. 49 liên kết",
                    "D. 48 liên kết"
                ],
                answer: 2,
                explain: "Chuỗi A có 21 gốc nên có (21 - 1) = 20 liên kết peptide. Chuỗi B có 30 gốc nên có (30 - 1) = 29 liên kết peptide. Tổng số liên kết peptide = 20 + 29 = 49 liên kết. Hai chuỗi được nối bởi 2 cầu disulfide (-S-S-), không phải liên kết peptide."
            }
        ]
    },
    {
        id: "keratin",
        name: "Keratin (Chất sừng tóc, móng, lông vũ)",
        shapeType: "fibrous", // hình sợi
        compositionType: "simple",
        shapeTypeName: "Protein hình sợi (Fibrous)",
        compositionTypeName: "Protein đơn giản (Simple)",
        mw: "Từ hàng chục đến hàng trăm kDa (siêu phân tử bện xoắn)",
        solubility: "Hoàn toàn KHÔNG TAN trong nước, axit/bazơ loãng và dung môi hữu cơ",
        sources: "Thành phần cấu tạo chủ yếu của lớp biểu bì da ngoài, tóc, móng tay, móng chân, lông vũ, sừng động vật.",
        structureNotes: "Cấu trúc xoắn alpha (alpha-keratin) hoặc phiến gấp beta (beta-keratin trong móng vuốt bò sát). Các chuỗi xoắn bện đôi (coiled-coil), bện bốn thành sợi vi thể, chứa hàm lượng rất cao Cysteine tạo mạng lưới cầu nối Disulfide (-S-S-) liên chuỗi chằng chịt.",
        keyProperties: [
            "Độ bền cơ học cực cao, chống thấm nước, bảo vệ cơ thể khỏi tác động vật lý và hóa chất.",
            "Không bị đông tụ bởi nhiệt độ nước sôi (tóc luộc trong nước không bị tan hay biến dạng).",
            "Cầu nối Disulfide (-S-S-) có thể bị khử bởi các chất khử (như thioglycolate) thành nhóm -SH tự do, và bị oxy hóa trở lại bởi H2O2.",
            "Khi đốt cháy có mùi khét đặc trưng của hợp chất lưu huỳnh hữu cơ (mùi tóc cháy)."
        ],
        biologicalRole: "Bảo vệ bề mặt cơ thể chống lại mất nước, va đập cơ học, vi khuẩn xâm nhập.",
        realLifeApp: "Công nghệ uốn tóc (uốn lạnh/uốn nóng): Dùng thuốc số 1 (chất khử) bẻ gãy các cầu disulfide (-S-S-) trong keratin của tóc -> cuộn tóc theo lô để tạo nếp mới -> dùng thuốc số 2 (chất oxy hóa H2O2) để thiết lập lại các cầu disulfide mới cố định nếp tóc xoăn.",
        questions: [
            {
                q: "Đặc điểm nào sau đây KHÔNG đúng đối với protein Keratin?",
                options: [
                    "A. Là protein hình sợi hoàn toàn không tan trong nước",
                    "B. Giàu gốc amino acid Cysteine tạo nhiều cầu nối disulfide (-S-S-) liên kết các chuỗi",
                    "C. Tan tốt trong nước sôi tạo dung dịch keo nhớt",
                    "D. Khi đốt cháy phát ra mùi khét đặc trưng của hợp chất chứa lưu huỳnh"
                ],
                answer: 2,
                explain: "Keratin là protein hình sợi điển hình, có tính trơ sinh học và hoàn toàn không tan trong nước lạnh lẫn nước sôi do các chuỗi bện chặt bởi liên kết disulfide."
            },
            {
                q: "Bản chất hóa học của phương pháp uốn tóc thẩm mỹ dựa trên phản ứng nào đối với phân tử Keratin trong sợi tóc?",
                options: [
                    "A. Thủy phân hoàn toàn liên kết peptide của tóc bằng axit",
                    "B. Khử các cầu nối disulfide (-S-S-) thành nhóm -SH, tạo nếp xoăn mới rồi oxy hóa tái lập cầu -S-S- cố định",
                    "C. Làm đông tụ nhiệt toàn bộ protein tóc thành khối rắn",
                    "D. Thêm liên kết peptide mới vào giữa các sợi tóc"
                ],
                answer: 1,
                explain: "Quá trình uốn tóc gồm 2 bước: Thuốc uốn tóc (chất khử thioglycolic acid) bẻ gãy cầu disulfide; quấn lọn tạo hình; sau đó dùng chất dập (H2O2) oxy hóa các nhóm -SH tạo lại cầu disulfide mới ở vị trí mới."
            }
        ]
    },
    {
        id: "collagen",
        name: "Collagen (Sợi mô liên kết da, gân, xương)",
        shapeType: "fibrous",
        compositionType: "simple",
        shapeTypeName: "Protein hình sợi (Fibrous)",
        compositionTypeName: "Protein đơn giản (Simple)",
        mw: "Khoảng 300 kDa (Tropocollagen)",
        solubility: "Không tan trong nước lạnh; khi đun sôi lâu bị biến tính thủy phân thành Gelatin tan được",
        sources: "Chiếm 25 - 30% tổng lượng protein của cơ thể động vật; có trong da, gân, sụn, xương, răng, giác mạc, thành mạch máu.",
        structureNotes: "Cấu trúc độc nhất vô nhị: Siêu xoắn bộ ba (Triple-helix) gồm 3 chuỗi polypeptide cuộn chặt quanh nhau dạng dây thừng. Trình tự amino acid lặp lại dạng Gly-X-Y (trong đó X thường là Proline, Y là Hydroxyproline). Glycine nhỏ nhất nằm ép vào lõi trong cùng.",
        keyProperties: [
            "Độ bền kéo phi thường (sợi collagen có khả năng chịu lực kéo lớn hơn sợi thép có cùng đường kính).",
            "Cần Vitamin C (axit ascorbic) làm coenzyme cho enzyme prolyl hydroxylase để tổng hợp Hydroxyproline giữ bền cấu trúc xoắn ba.",
            "Khi hầm/nấu xương thịt trong nước sôi lâu, cấu trúc xoắn ba bị bung tháo tạo thành Gelatin (chất làm đông thạch, rau câu thực phẩm)."
        ],
        biologicalRole: "Tạo khung nâng đỡ cơ học và đàn hồi cho toàn bộ mô liên kết, giữ da săn chắc, giúp xương dẻo dai chống gãy giòn.",
        realLifeApp: "Hiện tượng nấu đông thịt chân giò ngày Tết (collagen chuyển thành gelatin tan khi nóng, đông thạch khi nguội); thực phẩm chức năng bổ sung collagen chống lão hóa; bệnh Scorbut (chảy máu chân răng, rụng răng do thiếu vitamin C làm giảm tổng hợp collagen).",
        questions: [
            {
                q: "Hiện tượng món thịt đông (thịt chân giò, tai heo) khi ninh nhừ để nguội sẽ đông lại thành khối thạch trong suốt là do:",
                options: [
                    "A. Mỡ lợn đông đặc lại ở nhiệt độ thấp",
                    "B. Protein collagen trong gân da bị phân hủy nhiệt thành gelatin, khi để nguội tạo mạng lưới gel giữ nước",
                    "C. Tinh bột từ gia vị kết tinh lại",
                    "D. Các muối khoáng trong xương kết tủa"
                ],
                answer: 1,
                explain: "Collagen trong gân, bì lợn không tan trong nước lạnh nhưng khi đun sôi lâu bị biến tính một phần thành Gelatin. Gelatin tan trong nước nóng và khi nguội các phân tử liên kết lại tạo khung mạng lưới gel giữ nước, tạo nên món thịt đông mềm ngon."
            },
            {
                q: "Amino acid nào có kích thước nhỏ nhất và luôn chiếm tới 1/3 tổng số gốc amino acid trong chuỗi Collagen để phân tử cuộn được thành siêu xoắn bộ ba đặc khít?",
                options: [
                    "A. Alanine",
                    "B. Glycine (H2N-CH2-COOH)",
                    "C. Cysteine",
                    "D. Valine"
                ],
                answer: 1,
                explain: "Glycine có nhóm R chỉ là nguyên tử Hydro (-H) cực kỳ nhỏ bé, là amino acid duy nhất vừa vặn nằm ở tâm trục nơi 3 chuỗi polypeptide tiếp xúc sát nhau trong siêu xoắn bộ ba Collagen."
            }
        ]
    },
    {
        id: "fibroin",
        name: "Fibroin (Tơ tằm & Tơ nhện)",
        shapeType: "fibrous",
        compositionType: "simple",
        shapeTypeName: "Protein hình sợi (Fibrous)",
        compositionTypeName: "Protein đơn giản (Simple)",
        mw: "350 - 370 kDa",
        solubility: "Hoàn toàn KHÔNG TAN trong nước và các dung môi thông thường",
        sources: "Tuyến tơ của sâu tằm (Bombyx mori) và nhện.",
        structureNotes: "Cấu trúc chủ yếu là các phiến gấp Beta đối song song (Antiparallel Beta-sheets) xếp chồng khít lên nhau. Rất giàu các amino acid có mạch bên nhỏ như Glycine (~45%), Alanine (~30%) và Serine (~12%).",
        keyProperties: [
            "Mềm mại, óng ánh như ngọc, độ bền kéo cực cao (tơ nhện bền gấp nhiều lần sợi thép cùng khối lượng).",
            "Kém bền với nhiệt độ cao và hóa chất mạnh (axit, kiềm đặc làm thủy phân tơ tằm).",
            "Khi giặt quần áo lụa tơ tằm phải dùng xà phòng trung tính và nước ấm nhẹ, không giặt nước quá nóng hoặc phơi nắng gắt."
        ],
        biologicalRole: "Kén bảo vệ nhộng tằm biến hóa thành bướm; tơ nhện giăng bẫy bắt mồi và làm dây leo đu.",
        realLifeApp: "Ngành dệt lụa tơ tằm truyền thống Việt Nam (Vạn Phúc, Bảo Lộc...); ứng dụng làm chỉ khâu phẫu thuật tự tiêu trong y khoa cao cấp.",
        questions: [
            {
                q: "Vì sao khi giặt vải lụa tơ tằm tự nhiên, người ta không nên giặt bằng xà phòng có độ kiềm cao hoặc giặt trong nước sôi?",
                options: [
                    "A. Vì kiềm và nước nóng làm bay màu thuốc nhuộm",
                    "B. Vì protein fibroin trong tơ tằm bị thủy phân liên kết peptide trong môi trường kiềm và nhiệt độ cao, làm mục nát sợi vải",
                    "C. Vì tơ tằm sẽ phản ứng tạo khí độc gây hại cho da",
                    "D. Vì tơ tằm bị oxi hóa chuyển thành chất sừng cứng"
                ],
                answer: 1,
                explain: "Tơ tằm có bản chất là protein (fibroin), các liên kết peptide (-CO-NH-) rất dễ bị thủy phân phân cắt trong môi trường kiềm (xà phòng có pH > 9) và nhiệt độ cao, làm đứt gãy mạch phân tử khiến sợi lụa bị xơ cứng, nhăn nhúm và mục rách."
            }
        ]
    },
    {
        id: "casein",
        name: "Casein (Phosphoprotein trong sữa)",
        shapeType: "globular",
        compositionType: "conjugated",
        shapeTypeName: "Protein hình cầu hạt micelle",
        compositionTypeName: "Protein phức tạp (Conjugated - Phosphoprotein)",
        mw: "20 - 25 kDa (các monomer α, β, κ-casein tập hợp thành micelle lớn)",
        solubility: "Tạo hệ keo phân tán huyền phù trắng đục trong sữa tươi",
        sources: "Chiếm khoảng 80% tổng lượng protein trong sữa bò và các động vật có vú.",
        structureNotes: "Gồm nhiều nhóm phosphate (-O-PO3^2-) liên kết ester với gốc Serine. Các nhóm phosphate tích điện âm liên kết với ion Ca2+ tạo thành phức hợp Canxi caseinat bền vững dạng hạt micelle hình cầu lơ lửng trong sữa.",
        keyProperties: [
            "Đông tụ mạnh khi gặp môi trường axit (khi pH giảm xuống điểm đẳng điện pI ~ 4.6).",
            "Bị đông tụ bởi enzyme Chymosin (Rennet) trong dạ dày bê để sản xuất phô mai.",
            "Ít bị biến tính bởi nhiệt độ đun sôi thông thường so với Albumin (đun sôi sữa không bị đông cứng như trứng luộc)."
        ],
        biologicalRole: "Cung cấp nguồn amino acid cân đối, canxi và phốt pho thiết yếu cho sự phát triển xương răng của con non sơ sinh.",
        realLifeApp: "Hiện tượng sữa chua đông lại khi lên men lactic do vi khuẩn Lactic sinh ra axit lactic làm giảm pH về 4.6; vắt chanh hoặc nhỏ giấm vào sữa tươi làm sữa kết tủa lợn cợn; quy trình làm phô mai (cheese).",
        questions: [
            {
                q: "Hiện tượng sữa tươi bị kết tủa vón cục khi vắt thêm nước chanh hoặc khi ủ thành sữa chua là do:",
                options: [
                    "A. Axit citric hoặc axit lactic làm giảm pH xuống điểm đẳng điện, làm protein Casein bị đông tụ",
                    "B. Đường lactose bị lên men thành rượu kết tủa",
                    "C. Chất béo trong sữa bị xà phòng hóa tạo chất rắn",
                    "D. Vitamin trong chanh làm tăng độ tan của sữa"
                ],
                answer: 0,
                explain: "Casein trong sữa ở trạng thái sol keo nhờ tích điện âm. Khi thêm axit chanh hoặc axit lactic do vi khuẩn lên men, pH giảm xuống điểm đẳng điện (pI ~ 4.6), điện tích của phân tử triệt tiêu về 0 khiến hạt micelle mất lực đẩy tĩnh điện và đông tụ lại thành khối sữa chua."
            }
        ]
    }
];

// =============================================================================
// MODULE 2: LÍ THUYẾT CHI TIẾT TỪNG THÍ NGHIỆM & BỘ CÂU HỎI TRẮC NGHIỆM
// =============================================================================
const EXPERIMENTS_DETAILED_THEORY = [
    {
        id: "exp_coagulation",
        name: "Thí nghiệm 1: Sự Đông Tụ Protein Bằng Nhiệt & Hóa Chất",
        purpose: "Khảo sát hiện tượng biến tính và đông tụ của protein dưới tác động của nhiệt độ và các tác nhân hóa học (axit, bazơ, cồn, muối kim loại nặng, muối trung tính).",
        chemicals: [
            "Dung dịch lòng trắng trứng (Albumin) 10%",
            "Dung dịch axit HCl 10% hoặc HNO3",
            "Cồn Ethanol 90°",
            "Dung dịch muối kim loại nặng CuSO4 hoặc Pb(CH3COO)2 5%",
            "Muối ăn NaCl tinh thể hoặc bão hòa",
            "Nước cất, đèn cồn hoặc bếp đun, ống nghiệm, kẹp gỗ"
        ],
        steps: [
            "Ống 1 (Đun nhiệt): Cho 2 mL dung dịch lòng trắng trứng vào ống nghiệm, đun nóng trên ngọn lửa đèn cồn.",
            "Ống 2 (Tác dụng axit): Cho 2 mL dung dịch lòng trắng trứng, nhỏ từ từ 5-10 giọt dung dịch HCl 10%.",
            "Ống 3 (Tác dụng cồn): Cho 2 mL dung dịch lòng trắng trứng, thêm 2 mL cồn ethanol 90°.",
            "Ống 4 (Muối kim loại nặng): Cho 2 mL dung dịch lòng trắng trứng, nhỏ 5 giọt CuSO4 5%.",
            "Ống 5 (Diêm kết bằng muối NaCl): Cho 2 mL dung dịch lòng trắng trứng, thêm lượng lớn tinh thể NaCl bão hòa và lắc đều."
        ],
        phenomena: [
            "Ống 1: Dung dịch chuyển từ trong suốt sang đục dần, ở 65-80°C xuất hiện kết tủa trắng đông cứng lại dạng gel.",
            "Ống 2, 3, 4: Xuất hiện vón cục kết tủa trắng hoặc kết tủa màu xanh nhạt (với CuSO4), không tan lại khi để nguội.",
            "Ống 5: Xuất hiện kết tủa trắng đục (diêm kết / salting-out), nhưng khi thêm nhiều nước cất và lắc nhẹ thì kết tủa TAN TRỞ LẠI (đông tụ thuận nghịch)."
        ],
        molecularMechanism: "Protein tự nhiên có cấu trúc không gian bậc 2, 3, 4 ổn định nhờ các liên kết hydrogen, liên kết ion (cầu muối), tương tác kị nước và cầu disulfide. Khi có nhiệt độ cao hoặc pH quá chua/kiềm hoặc dung môi hữu cơ/muối kim loại: Các liên kết yếu bị phá vỡ, chuỗi polypeptide duỗi xoắn bung tháo làm lộ các gốc amino acid kị nước bên trong ra ngoài bề mặt -> các phân tử tương tác với nhau tụ lại thành khối kết tủa không tan (biến tính và đông tụ).",
        safetyNotes: "Cẩn thận khi đun ống nghiệm chứa chất lỏng (hướng miệng ống về phía không có người). Cồn ethanol dễ bắt lửa.",
        questions: [
            {
                q: "Hiện tượng nào sau đây là sự đông tụ THUẬN NGHỊCH của protein (có thể tan lại khi thêm nước cất)?",
                options: [
                    "A. Đun sôi dung dịch lòng trắng trứng trên bếp đèn cồn",
                    "B. Thêm dung dịch axit HCl đậm đặc vào dung dịch lòng trắng trứng",
                    "C. Thêm lượng dư muối ăn NaCl bão hòa vào dung dịch albumin (phương pháp diêm kết)",
                    "D. Nhỏ dung dịch muối thủy ngân HgCl2 vào dung dịch protein"
                ],
                answer: 2,
                explain: "Phương pháp diêm kết (salting-out) bằng muối trung tính NaCl hoặc (NH4)2SO4 chỉ làm mất lớp vỏ hydrat hóa bề mặt mà không phá hủy cấu trúc bậc cao, nên khi thêm nước cất pha loãng dung dịch thì protein sẽ tan trở lại bình thường."
            },
            {
                q: "Khi nấu canh cua đồng, hiện tượng các mảng 'gạch cua' đông lại và nổi lên trên mặt nước canh là do:",
                options: [
                    "A. Canxi trong mai cua bị kết tủa",
                    "B. Protein hòa tan trong thịt cua bị đông tụ do nhiệt độ nước sôi",
                    "C. Chất béo của cua nổi lên mặt nước",
                    "D. Chitin trong vỏ cua nổi lên"
                ],
                answer: 1,
                explain: "Thịt cua chứa nhiều protein hòa tan dạng sol. Khi giã cua lọc lấy nước rồi đun sôi, nhiệt độ cao làm biến tính và đông tụ protein thịt cua, các phân tử kết cụm lại thành từng tảng nổi lên bề mặt tạo thành mảng gạch cua thơm ngon."
            }
        ]
    },
    {
        id: "exp_biuret",
        name: "Thí nghiệm 2: Phản Ứng Màu Biuret Định Tính Liên Kết Peptide",
        purpose: "Nhận biết sự có mặt của liên kết peptide và phân biệt peptide/protein với amino acid tự do hoặc các hợp chất hữu cơ khác.",
        chemicals: [
            "Dung dịch lòng trắng trứng 10% (hoặc dung dịch peptone/gelatin)",
            "Dung dịch NaOH 10% (hoặc NaOH 30%)",
            "Dung dịch CuSO4 1% (chuẩn bị loãng)",
            "Dung dịch Glycine tự do 5% (ống đối chứng)",
            "Nước cất, ống nghiệm, ống nhỏ giọt"
        ],
        steps: [
            "Bước 1: Cho vào ống nghiệm (1) khoảng 2 mL dung dịch lòng trắng trứng. Cho vào ống nghiệm (2) khoảng 2 mL dung dịch Glycine.",
            "Bước 2: Thêm vào mỗi ống nghiệm 1 mL dung dịch NaOH 10%, lắc đều để tạo môi trường kiềm.",
            "Bước 3: Nhỏ vào mỗi ống nghiệm 2 - 3 giọt dung dịch CuSO4 1%, lắc nhẹ ống nghiệm và quan sát màu sắc."
        ],
        phenomena: [
            "Ống 1 (Lòng trắng trứng): Dung dịch chuyển sang màu TÍM HOA CÀ hoặc TÍM ĐỎ rực rỡ đặc trưng.",
            "Ống 2 (Glycine): Xuất hiện kết tủa màu XANH LAM của Cu(OH)2, KHÔNG CÓ MÀU TÍM."
        ],
        molecularMechanism: "Trong môi trường kiềm mạnh, các nguyên tử Nitơ của nhóm liên kết peptide (-CO-NH-) ở trạng thái enol hóa phản ứng phối trí tạo phức chất chelate 4 càng (tetradentate) với ion Cu2+. Phức chất Cu-N có sự chuyển dịch obitan electron d-d hấp thụ mạnh ánh sáng vàng-lục (λ ~ 540-560 nm), truyền qua ánh sáng màu tím hoa cà. ĐIỀU KIỆN TIÊN QUYẾT: Phân tử phải có TỐI THIỂU 2 LIÊN KẾT PEPTIDE (từ tripeptide trở lên). Dipeptide và amino acid chỉ có 0-1 liên kết peptide nên không tạo được phức chất này.",
        safetyNotes: "Chỉ nhỏ 2-3 giọt CuSO4 1%. Nếu nhỏ quá nhiều CuSO4, màu xanh lam của kết tủa Cu(OH)2 dư sẽ lấn át và che mất màu tím của phức chất biuret.",
        questions: [
            {
                q: "Dãy chất nào sau đây đều cho phản ứng màu Biuret tạo dung dịch màu tím đặc trưng với Cu(OH)2 / NaOH?",
                options: [
                    "A. Gly-Ala, Albumin, Glucose",
                    "B. Gly-Ala-Val, Lòng trắng trứng, Gelatin",
                    "C. Alanine, Valine, Fructose",
                    "D. Gly-Gly, Casein, Hồ tinh bột"
                ],
                answer: 1,
                explain: "Phản ứng Biuret yêu cầu phân tử phải có từ 2 liên kết peptide trở lên (từ Tripeptide trở lên hoặc protein). Gly-Ala-Val là tripeptide (có 2 liên kết peptide), lòng trắng trứng (albumin) và gelatin (collagen thủy phân) đều là protein nên đều dương tính. Gly-Ala và Gly-Gly chỉ là dipeptide (có 1 liên kết) nên KHÔNG cho phản ứng biuret."
            },
            {
                q: "Vì sao trong thí nghiệm phản ứng màu Biuret, người ta chỉ nhỏ 2 - 3 giọt dung dịch CuSO4 1% mà không cho lượng nhiều?",
                options: [
                    "A. Vì cho nhiều CuSO4 sẽ gây nổ ống nghiệm",
                    "B. Vì CuSO4 dư nhiều sẽ phản ứng với NaOH tạo nhiều kết tủa Cu(OH)2 màu xanh lam lấn át màu tím của phức",
                    "C. Vì ion Cu2+ dư sẽ phá hủy hoàn toàn protein thành amino acid",
                    "D. Vì CuSO4 làm dung dịch bị bay hơi hết nước"
                ],
                answer: 1,
                explain: "Nếu cho quá nhiều CuSO4, lượng Cu2+ dư phản ứng với NaOH tạo ra nhiều kết tủa màu xanh lam của Cu(OH)2 lơ lửng, làm che khuất và khó quan sát thấy màu tím hoa cà của phức chất biuret."
            }
        ]
    },
    {
        id: "exp_xanthoproteic",
        name: "Thí nghiệm 3: Phản Ứng Màu Xanthoproteic Nhận Biết Vòng Thơm",
        purpose: "Nhận biết protein chứa các gốc alpha-amino acid có nhân thơm (chứa vòng benzen như Tyrosine, Phenylalanine, Tryptophan).",
        chemicals: [
            "Dung dịch lòng trắng trứng 10%",
            "Axit nitric đặc HNO3 65%",
            "Dung dịch amoniac NH3 đặc (hoặc dung dịch NaOH 20%)",
            "Ống nghiệm, đèn cồn, kẹp ống nghiệm"
        ],
        steps: [
            "Bước 1: Cho vào ống nghiệm khoảng 2 mL dung dịch lòng trắng trứng.",
            "Bước 2: Cẩn thận nhỏ 1 mL axit HNO3 đặc vào ống nghiệm (lập tức xuất hiện kết tủa màu vàng).",
            "Bước 3: Đun nóng nhẹ ống nghiệm trên ngọn lửa đèn cồn khoảng 1-2 phút (kết tủa tan thành dung dịch màu vàng đậm).",
            "Bước 4: Để nguội ống nghiệm, sau đó nhỏ từ từ từng giọt dung dịch NH3 đặc (hoặc NaOH) đến dư vào thành ống."
        ],
        phenomena: [
            "Khi cho HNO3 đặc: Xuất hiện kết tủa màu VÀNG chanh.",
            "Sau khi kiềm hóa bằng dung dịch NH3 đặc: Màu vàng chuyển thành màu DA CAM (VÀNG CAM) rực rỡ."
        ],
        molecularMechanism: "Axit HNO3 đặc phản ứng thế nitro hóa vào nhân thơm (vòng benzen) của các gốc amino acid như Tyrosine (Tyr) và Phenylalanine (Phe) trong chuỗi protein, tạo thành các dẫn xuất polinitro có màu vàng. Khi gặp kiềm (NH3 hoặc NaOH), nhóm phenol của Tyrosine bị ion hóa tạo muối phenolate tích điện âm, làm tăng mật độ liên hợp electron của vòng benzen, gây chuyển dịch màu sang bước sóng dài hơn (màu da cam rực rỡ).",
        safetyNotes: "Axit HNO3 đặc là chất ăn mòn mạnh và oxy hóa nguy hiểm. Cấm để HNO3 dính vào da (nếu dính sẽ làm da có vết ố vàng do phản ứng xanthoproteic với protein biểu bì da)!",
        questions: [
            {
                q: "Hiện tượng khi vô tình làm rớt axit nitric HNO3 đặc vào da tay, chỗ da đó bị ố màu vàng là do phản ứng nào?",
                options: [
                    "A. Phản ứng màu Biuret tạo phức tím",
                    "B. Phản ứng Xanthoproteic nitro hóa nhân thơm của protein da tạo hợp chất màu vàng",
                    "C. Phản ứng thủy phân protein da thành đường",
                    "D. Phản ứng cháy da sinh ra muội than cacbon"
                ],
                answer: 1,
                explain: "Protein biểu bì của da (keratin) chứa các amino acid có vòng benzen như Tyrosine, Phenylalanine. Khi tiếp xúc với HNO3 đặc, phản ứng thế nitro xảy ra gắn nhóm -NO2 vào vòng thơm tạo dẫn xuất màu vàng (phản ứng Xanthoproteic)."
            }
        ]
    },
    {
        id: "exp_hydrolysis",
        name: "Thí nghiệm 4: Phản Ứng Thủy Phân Peptide & Protein",
        purpose: "Khảo sát quá trình phân cắt liên kết peptide dưới tác dụng của môi trường axit, bazơ và enzyme sinh học.",
        chemicals: [
            "Dung dịch lòng trắng trứng hoặc tơ tằm vụn",
            "Dung dịch axit HCl 6M (hoặc dung dịch H2SO4 20%)",
            "Dung dịch NaOH 20%",
            "Men tiêu hóa Pepsin hoặc Papain (nhựa đu đủ)",
            "Bếp cách thủy, giấy quỳ tím, thuốc thử Ninhydrin 0.2%"
        ],
        steps: [
            "Bước 1: Cho lòng trắng trứng vào ống nghiệm chứa 3 mL HCl 6M, đun cách thủy ở 100°C trong 2-3 giờ.",
            "Bước 2: Để nguội, trung hòa bớt axit bằng NaOH loãng đến pH ~ 6-7.",
            "Bước 3: Nhỏ vài giọt dung dịch Ninhydrin vào ống nghiệm và đun nóng nhẹ trong 2 phút."
        ],
        phenomena: [
            "Trước thủy phân: Lòng trắng trứng cho phản ứng Biuret tím đậm, không phản ứng với ninhydrin tự do.",
            "Sau khi thủy phân hoàn toàn: Mất hoàn toàn phản ứng màu Biuret (chuyển sang màu xanh lam Cu(OH)2), nhưng cho phản ứng với Ninhydrin tạo dung dịch màu TÍM XANH ĐẬM (phức chất Ruhemann), chứng tỏ đã giải phóng các alpha-amino acid tự do."
        ],
        molecularMechanism: "Các liên kết peptide (-CO-NH-) bị phân cắt hoàn toàn bởi phân tử nước theo phương trình tổng quát: Peptide + (n - 1) H2O -> n Alpha-amino acid. Khi thủy phân hoàn toàn trong axit HCl, các amino acid sinh ra tồn tại ở dạng muối Cl- H3N+-CH(R)-COOH.",
        safetyNotes: "Cẩn thận với axit đặc và kiềm nóng khi đun cách thủy thời gian dài.",
        questions: [
            {
                q: "Khi thủy phân hoàn toàn 1 mol tripeptide Gly-Ala-Val cần dùng vừa đủ bao nhiêu mol nước?",
                options: [
                    "A. 1 mol H2O",
                    "B. 2 mol H2O",
                    "C. 3 mol H2O",
                    "D. 4 mol H2O"
                ],
                answer: 1,
                explain: "Tripeptide gồm 3 gốc amino acid nên có 2 liên kết peptide. Mỗi liên kết peptide khi bị phân cắt cần 1 phân tử nước: Gly-Ala-Val + 2 H2O -> Gly + Ala + Val. Do đó 1 mol tripeptide cần vừa đủ 2 mol H2O."
            }
        ]
    }
];

// =============================================================================
// MODULE 3: DANH MỤC TỔNG KẾT LÍ THUYẾT TOÀN DIỆN (SỔ TAY HÓA HỌC 12)
// =============================================================================
const THEORY_SUMMARY = {
    title: "SỔ TAY TỔNG KẾT LÍ THUYẾT PEPTIDE & PROTEIN (HÓA HỌC 12 CHƯƠNG TRÌNH MỚI)",
    sub: "Hệ thống hóa toàn diện: Khái niệm, Phân loại, Cấu trúc không gian, Tính chất vật lí, Tính chất hóa học & Ứng dụng",
    sections: [
        {
            heading: "I. KHÁI NIỆM & ĐẶC ĐIỂM CẤU TẠO",
            content: `
- <strong>Peptide</strong>: Là hợp chất hữu cơ chứa từ <strong>2 đến 50 gốc α-amino acid</strong> liên kết với nhau bằng các <strong>liên kết peptide</strong>.
- <strong>Liên kết peptide</strong>: Là liên kết amide <strong>—CO—NH—</strong> giữa nhóm carboxyl (—COOH) của một gốc α-amino acid này với nhóm amino (—NH₂) của một gốc α-amino acid khác.
- <strong>Phân loại peptide</strong>:
  + <em>Oligopeptide</em>: Chứa từ 2 đến 10 gốc α-amino acid (Dipeptide, Tripeptide, Tetrapeptide...).
  + <em>Polypeptide</em>: Chứa từ 11 đến 50 gốc α-amino acid.
- <strong>Protein (Chất đạm)</strong>: Là các đại phân tử sinh học (biopolymer) được cấu tạo từ một hoặc nhiều chuỗi polypeptide, có phân tử khối cực lớn thường từ <strong>hàng chục nghìn đến hàng triệu Da</strong>.
- <strong>Cấu tạo đầu N và đầu C</strong>:
  + Gốc α-amino acid còn nhóm —NH₂ (hoặc —NH₃⁺) tự do gọi là <strong>Đầu N (Amino-terminus)</strong> - luôn viết ở bên TRÁI.
  + Gốc α-amino acid còn nhóm —COOH (hoặc —COO⁻) tự do gọi là <strong>Đầu C (Carboxyl-terminus)</strong> - luôn viết ở bên PHẢI.
  + Số liên kết peptide trong chuỗi n mắt xích = <strong>n - 1</strong> liên kết.
            `
        },
        {
            heading: "II. 4 BẬC CẤU TRÚC KHÔNG GIAN CỦA PROTEIN",
            table: [
                { level: "Bậc I (Primary)", desc: "Trình tự sắp xếp các gốc α-amino acid trong chuỗi polypeptide.", bonds: "Liên kết peptide (cộng hóa trị bền vững).", note: "Quyết định toàn bộ cách cuộn gập ở các bậc cao hơn. Đột biến bậc I phá hỏng protein." },
                { level: "Bậc II (Secondary)", desc: "Cấu hình không gian cục bộ tuần hoàn của mạch chính: Xoắn α (Alpha-helix) và Phiến gấp β (Beta-sheet).", bonds: "Liên kết hydrogen giữa các nhóm C=O và N-H của mạch chính.", note: "Xoắn α bước xoắn 0.54 nm (3.6 aa/vòng); Phiến β phẳng gấp nếp lượn sóng." },
                { level: "Bậc III (Tertiary)", desc: "Cấu trúc cuộn gập không gian 3 chiều đặc thù của toàn bộ một chuỗi polypeptide đơn (hình cầu hoặc hình sợi).", bonds: "1. Cầu Disulfide (—S—S—); 2. Cầu muối ion; 3. Liên kết hydrogen; 4. Tương tác kị nước.", note: "Tạo nên trung tâm hoạt động của enzyme và các thụ thể sinh học." },
                { level: "Bậc IV (Quaternary)", desc: "Tổ hợp không gian của 2 hay nhiều chuỗi polypeptide (tiểu đơn vị) phối hợp với nhau tạo phức hợp hoàn chỉnh.", bonds: "Các tương tác không cộng hóa trị (hydrogen, ion, kị nước, van der Waals).", note: "Ví dụ: Hemoglobin gồm 4 chuỗi (2α + 2β), có hiện tượng hợp tác Allosteric." }
            ]
        },
        {
            heading: "III. PHÂN LOẠI PROTEIN",
            content: `
<table class="summary-table">
    <thead>
        <tr>
            <th>Tiêu chí</th>
            <th>Nhóm 1</th>
            <th>Nhóm 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Theo hình dạng</strong></td>
            <td><strong>Protein hình sợi (Fibrous)</strong>:<br>Chuỗi dài bện sợi, hoàn toàn <em>KHÔNG TAN trong nước</em>, rất bền cơ học.<br><em>Ví dụ:</em> Keratin (tóc, móng), Collagen (da, gân, xương), Fibroin (tơ tằm).</td>
            <td><strong>Protein hình cầu (Globular)</strong>:<br>Cuộn gập thành khối cầu đặc khít, <em>TAN TỐT trong nước tạo dung dịch keo</em>, dễ bị đông tụ biến tính.<br><em>Ví dụ:</em> Albumin (lòng trắng trứng), Hemoglobin (máu), Insulin, Enzyme.</td>
        </tr>
        <tr>
            <td><strong>Theo thành phần</strong></td>
            <td><strong>Protein đơn giản (Simple)</strong>:<br>Khi thủy phân hoàn toàn <em>CHỈ thu được các α-amino acid</em>.<br><em>Ví dụ:</em> Albumin, Keratin, Collagen, Fibroin, Histone.</td>
            <td><strong>Protein phức tạp (Conjugated)</strong>:<br>Gồm protein đơn giản liên kết với <em>nhóm ngoại phi protein</em> (Heme, lipid, carbohydrate, axit nucleic, phosphate).<br><em>Ví dụ:</em> Hemoglobin, Kháng thể IgG, Casein, Nucleoprotein.</td>
        </tr>
    </tbody>
</table>
            `
        },
        {
            heading: "IV. TÍNH CHẤT VẬT LÍ & HIỆN TƯỢNG ĐÔNG TỤ",
            content: `
1. <strong>Tính tan</strong>:
   - Protein hình cầu tan trong nước tạo dung dịch keo (sol keo protein). Khi khuấy sủi bọt bền.
   - Protein hình sợi hoàn toàn không tan trong nước và dung môi hữu cơ.
2. <strong>Hiện tượng đông tụ (Coagulation & Denaturation)</strong>:
   - Khi đun nóng hoặc gặp tác nhân hóa học (axit, bazơ, cồn, muối kim loại nặng CuSO₄, Pb²⁺, Hg²⁺), cấu trúc không gian bậc 2, 3, 4 bị phá vỡ (biến tính), chuỗi polypeptide bung tháo và kết tụ lại tạo thành khối kết tủa gọi là <strong>sự đông tụ protein</strong>.
   - <em>Đông tụ không thuận nghịch</em>: Đông tụ do nhiệt, axit, bazơ, muối kim loại nặng (luộc trứng, nấu canh cua).
   - <em>Đông tụ thuận nghịch (Diêm kết)</em>: Kết tủa bằng lượng lớn muối trung tính NaCl, (NH₄)₂SO₄ bão hòa, khi thêm nhiều nước cất thì kết tủa tan trở lại.
            `
        },
        {
            heading: "V. TÍNH CHẤT HÓA HỌC TRỌNG TÂM",
            content: `
1. <strong>Phản ứng Thủy phân (Hydrolysis)</strong>:
   - Xúc tác axit (HCl), kiềm (NaOH) đun nóng hoặc enzyme protease.
   - Thủy phân hoàn toàn: <code>Peptide + (n - 1) H₂O → n Amino acid</code>.
   - Phản ứng với dung dịch kiềm NaOH:
     <div class="code-chem-box"><code>Peptide + n NaOH → Hỗn hợp muối của α-amino acid + 1 H₂O</code></div>
     <em>(Bảo toàn khối lượng: m<sub>peptide</sub> + m<sub>NaOH</sub> = m<sub>muối</sub> + m<sub>H₂O</sub>).</em>
2. <strong>Phản ứng Màu Biuret</strong>:
   - Điều kiện: Phân tử phải có <strong>tối thiểu 2 liên kết peptide</strong> (từ tripeptide trở lên hoặc protein). Dipeptide và amino acid không phản ứng!
   - Thuốc thử: CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄.
   - Hiện tượng: Dung dịch chuyển sang màu <strong>tím hoa cà (tím đỏ)</strong> đặc trưng do tạo phức chất chelate Cu-N.
3. <strong>Phản ứng Màu Xanthoproteic</strong>:
   - Thuốc thử: Axit nitric đậm đặc HNO₃.
   - Hiện tượng: Xuất hiện kết tủa <strong>màu vàng</strong>; khi thêm kiềm NH₃ chuyển sang <strong>màu da cam</strong>.
   - Cơ chế: Phản ứng thế nitro hóa vào vòng benzen của các gốc Tyrosine, Phenylalanine.
4. <strong>Phản ứng tạo chì sunfua (PbS đen)</strong>:
   - Nhận biết protein chứa lưu huỳnh (Cysteine, Methionine): Protein + NaOH —(t°)→ S²⁻ —(+Pb(CH₃COO)₂)→ PbS↓ (kết tủa đen).
            `
        }
    ]
};

// =============================================================================
// MODULE 4: 5 CHỦ ĐỀ ÔN LUYỆN CHUYÊN ĐỀ & BỘ CÂU HỎI TRẮC NGHIỆM ĐÁP ÁN
// =============================================================================
const STUDY_TOPICS_DATA = [
    {
        id: "topic_structure",
        name: "Chủ đề 1: Cấu Trúc Protein & Các Lực Liên Kết",
        icon: "🧬",
        badge: "Cốt lõi Hóa - Sinh",
        summaryPoints: [
            "Bậc 1 là trình tự amino acid nối bởi liên kết peptide cộng hóa trị (-CO-NH-).",
            "Bậc 2 là cấu hình xoắn Alpha và phiến Beta, giữ bởi LIÊN KẾT HYDROGEN giữa các nhóm mạch chính.",
            "Bậc 3 là sự cuộn gập không gian của 1 chuỗi, giữ bởi 4 lực: cầu disulfide (-S-S-), cầu muối, liên kết hydrogen, tương tác kị nước.",
            "Bậc 4 là sự phối hợp của nhiều tiểu đơn vị polypeptide (ví dụ Hemoglobin gồm 4 chuỗi mang 4 nhân Heme)."
        ],
        quickFormula: "Số liên kết peptide = Số gốc amino acid - Số chuỗi polypeptide = n - 1 (với 1 chuỗi hở)",
        questions: [
            {
                q: "Liên kết nào sau đây đóng vai trò chủ yếu trong việc giữ vững cấu trúc bậc 2 của protein?",
                options: [
                    "A. Liên kết peptide cộng hóa trị",
                    "B. Liên kết hydrogen giữa các nhóm C=O và N-H của mạch chính polypeptide",
                    "C. Cầu nối disulfide (-S-S-) giữa hai gốc cysteine",
                    "D. Liên kết ion giữa các nhóm thế mạch bên tích điện"
                ],
                answer: 1,
                explain: "Cấu trúc bậc 2 (xoắn alpha và phiến beta) được giữ vững chủ yếu bởi các liên kết hydrogen tuần hoàn hình thành giữa nguyên tử O của nhóm carbonyl C=O và nguyên tử H của nhóm N-H trong bộ khung xương sống peptide."
            },
            {
                q: "Trong các lực liên kết duy trì cấu trúc bậc 3 của protein, liên kết CỘNG HÓA TRỊ bền vững nhất là:",
                options: [
                    "A. Tương tác kị nước giữa các gốc Val, Leu",
                    "B. Cầu nối Disulfide (-S-S-) giữa hai nhóm thiol của hai gốc Cysteine",
                    "C. Liên kết hydrogen giữa gốc Serine và Threonine",
                    "D. Cầu muối ion giữa Lysine và Glutamic acid"
                ],
                answer: 1,
                explain: "Cầu nối Disulfide (-S-S-) là liên kết CỘNG HÓA TRỊ hình thành do phản ứng oxy hóa 2 nhóm -SH của 2 gốc Cysteine, có năng lượng liên kết cao (~250 kJ/mol), bền vững hơn nhiều so với các liên kết yếu không cộng hóa trị khác."
            },
            {
                q: "Phân tử Myoglobin gồm 1 chuỗi 153 gốc amino acid; phân tử Hemoglobin gồm 4 chuỗi tổng cộng 574 gốc amino acid. Nhận định nào sau đây là ĐÚNG?",
                options: [
                    "A. Myoglobin có cấu trúc bậc 4, Hemoglobin có cấu trúc bậc 3",
                    "B. Myoglobin chỉ có cấu trúc tối đa đến bậc 3, còn Hemoglobin có cấu trúc bậc 4",
                    "C. Cả hai phân tử đều có cấu trúc bậc 4",
                    "D. Cả hai phân tử đều là protein hình sợi không tan"
                ],
                answer: 1,
                explain: "Cấu trúc bậc 4 chỉ xuất hiện ở các protein được cấu tạo từ 2 hay nhiều chuỗi polypeptide (tiểu đơn vị) phối hợp với nhau. Myoglobin chỉ gồm 1 chuỗi đơn nên cấu trúc cao nhất là bậc 3; Hemoglobin gồm 4 chuỗi nên đạt cấu trúc bậc 4."
            }
        ],
        trueFalseGroup: {
            instruction: "Xét tính Đúng / Sai của các mệnh đề sau về cấu trúc protein:",
            items: [
                { text: "a) Cấu trúc bậc 1 của protein bị phá vỡ hoàn toàn khi protein bị biến tính do nhiệt.", isTrue: false, explain: "Sai! Biến tính do nhiệt chỉ phá vỡ các cấu trúc không gian bậc 2, 3, 4 (các liên kết yếu), còn liên kết peptide ở bậc 1 vẫn nguyên vẹn trừ khi bị thủy phân hóa học." },
                { text: "b) Xoắn Alpha có bước xoắn 0.54 nm ứng với 3.6 gốc amino acid mỗi vòng xoắn.", isTrue: true, explain: "Đúng! Đây là thông số chuẩn xác được Linus Pauling xác định năm 1951." },
                { text: "c) Đột biến thay đổi trình tự amino acid ở bậc 1 có thể làm thay đổi hoàn toàn hình dạng và chức năng ở bậc 3, bậc 4.", isTrue: true, explain: "Đúng! Ví dụ kinh điển là đột biến Glu6Val ở Hemoglobin gây bệnh hồng cầu liềm." },
                { text: "d) Mọi protein trong tế bào sống đều phải đạt cấu trúc bậc 4 mới có hoạt tính sinh học.", isTrue: false, explain: "Sai! Rất nhiều protein và enzyme chỉ cần đạt cấu trúc bậc 3 đã có đầy đủ hoạt tính sinh học (như Myoglobin, Lysozyme, Ribonuclease...)." }
            ]
        }
    },
    {
        id: "topic_classification",
        name: "Chủ đề 2: Phân Loại, Tính Tan & Hiện Tượng Đông Tụ",
        icon: "🧪",
        badge: "Thực tế & Hiện tượng",
        summaryPoints: [
            "Protein hình sợi (Keratin, Collagen, Fibroin): Hoàn toàn không tan trong nước, bền cơ học, làm khung nâng đỡ.",
            "Protein hình cầu (Albumin, Hemoglobin, Casein, Enzyme): Tan trong nước tạo sol keo, dễ bị đông tụ bởi nhiệt và hóa chất.",
            "Protein đơn giản: Chỉ tạo từ amino acid. Protein phức tạp: Có thêm nhóm ngoại phi protein (Heme, carbohydrate, lipid...).",
            "Đông tụ nhiệt là biến tính không thuận nghịch; Diêm kết bằng muối trung tính NaCl là thuận nghịch."
        ],
        quickFormula: "Phân biệt nhanh: Hình sợi = Không tan | Hình cầu = Tan tạo dung dịch keo",
        questions: [
            {
                q: "Chất nào sau đây KHÔNG tan trong nước ở điều kiện thường lẫn khi đun nóng?",
                options: [
                    "A. Lòng trắng trứng (Albumin)",
                    "B. Sợi tóc và móng tay (Keratin)",
                    "C. Hemoglobin trong hồng cầu",
                    "D. Sữa tươi (Casein)"
                ],
                answer: 1,
                explain: "Keratin là protein hình sợi đặc trưng, hoàn toàn không tan trong nước do các chuỗi liên kết chằng chịt bằng cầu disulfide rất bền."
            },
            {
                q: "Cho các hiện tượng sau: (1) Nấu canh cua nổi mảng riêu cua; (2) Luộc trứng gà lòng trắng đông cứng lại; (3) Vắt chanh vào sữa tươi sữa bị vón cục; (4) Ngâm quả mận vào đường quả mận teo lại. Có bao nhiêu hiện tượng liên quan đến sự ĐÔNG TỤ PROTEIN?",
                options: [
                    "A. 1",
                    "B. 2",
                    "C. 3",
                    "D. 4"
                ],
                answer: 2,
                explain: "Các hiện tượng (1), (2), (3) đều là hiện tượng đông tụ protein (do nhiệt độ và do axit). Hiện tượng (4) là hiện tượng thẩm thấu nước từ tế bào quả ra ngoài môi trường ưu trương, không phải đông tụ protein."
            }
        ],
        trueFalseGroup: {
            instruction: "Xét tính Đúng / Sai của các mệnh đề sau về phân loại và tính chất protein:",
            items: [
                { text: "a) Tơ tằm (fibroin) và tóc (keratin) đều thuộc loại protein hình sợi không tan trong nước.", isTrue: true, explain: "Đúng! Cả hai đều là protein hình sợi đóng vai trò cấu trúc và bảo vệ." },
                { text: "b) Thủy phân hoàn toàn protein đơn giản hoặc protein phức tạp đều chỉ thu được alpha-amino acid.", isTrue: false, explain: "Sai! Protein phức tạp khi thủy phân ngoài amino acid còn giải phóng nhóm ngoại phi protein (như Heme, axit nucleic, đường, lipid)." },
                { text: "c) Dung dịch protein hình cầu có khả năng tạo bọt bền khi khuấy mạnh.", isTrue: true, explain: "Đúng! Do các phân tử protein làm giảm sức căng bề mặt của nước tạo bọt keo bền vững." },
                { text: "d) Khi bị biến tính, khối lượng phân tử của protein luôn giảm đi một nửa.", isTrue: false, explain: "Sai! Quá trình biến tính chỉ làm thay đổi cấu hình không gian do đứt các liên kết yếu, không làm đứt liên kết peptide nên khối lượng phân tử không thay đổi." }
            ]
        }
    },
    {
        id: "topic_structure_formula",
        name: "Chủ đề 3: Công Thức Cấu Tạo & Liên Kết Peptide",
        icon: "📐",
        badge: "Cấu tạo & Danh pháp",
        summaryPoints: [
            "Liên kết peptide là liên kết -CO-NH- giữa 2 gốc alpha-amino acid.",
            "Liên kết amide giữa nhóm -COOH với nhóm -NH2 ở vị trí beta, gamma... KHÔNG phải là liên kết peptide!",
            "Peptide có n gốc amino acid thì có n - 1 liên kết peptide.",
            "Tên peptide = Ghép tên các gốc acyl của amino acid từ đầu N đến amino acid ở đầu C."
        ],
        quickFormula: "Số đồng phân peptide chứa n gốc khác nhau = n! (giai thừa) nếu mỗi gốc xuất hiện 1 lần.",
        questions: [
            {
                q: "Số liên kết peptide có trong một phân tử Tetrapeptide mạch hở là:",
                options: [
                    "A. 4",
                    "B. 3",
                    "C. 2",
                    "D. 1"
                ],
                answer: 1,
                explain: "Tetrapeptide được cấu tạo từ 4 gốc alpha-amino acid, do đó số liên kết peptide = 4 - 1 = 3 liên kết."
            },
            {
                q: "Từ 3 alpha-amino acid gồm Glycine (Gly), Alanine (Ala) và Valine (Val), có thể tạo ra tối đa bao nhiêu Tripeptide mạch hở chứa ĐỒNG THỜI cả 3 gốc amino acid này?",
                options: [
                    "A. 3",
                    "B. 6",
                    "C. 9",
                    "D. 27"
                ],
                answer: 1,
                explain: "Số tripeptide chứa đồng thời cả 3 gốc Gly, Ala, Val bằng số hoán vị của 3 phần tử: P_3 = 3! = 3 x 2 x 1 = 6 tripeptide (Gly-Ala-Val, Gly-Val-Ala, Ala-Gly-Val, Ala-Val-Gly, Val-Gly-Ala, Val-Ala-Gly)."
            },
            {
                q: "Hợp chất nào sau đây KHÔNG PHẢI là một dipeptide?",
                options: [
                    "A. H2N-CH2-CO-NH-CH(CH3)-COOH",
                    "B. H2N-CH(CH3)-CO-NH-CH2-COOH",
                    "C. H2N-CH2-CH2-CO-NH-CH2-COOH",
                    "D. H2N-CH2-CO-NH-CH2-COOH"
                ],
                answer: 2,
                explain: "Ở phương án C, amino acid đầu N là H2N-CH2-CH2-COOH (beta-alanine), nhóm amin đính ở carbon beta chứ không phải carbon alpha. Do đó liên kết -CO-NH- ở đây là liên kết amide thông thường, KHÔNG PHẢI liên kết peptide."
            }
        ],
        trueFalseGroup: {
            instruction: "Xét tính Đúng / Sai của các mệnh đề sau về cấu tạo peptide:",
            items: [
                { text: "a) Phân tử Ala-Gly-Val có đầu N là gốc Alanine và đầu C là gốc Valine.", isTrue: true, explain: "Đúng! Theo quy ước quốc tế, đầu N viết ở ngoài cùng bên trái, đầu C viết ở ngoài cùng bên phải." },
                { text: "b) Phân tử Gly-Ala có chứa 2 liên kết peptide.", isTrue: false, explain: "Sai! Gly-Ala là dipeptide gồm 2 gốc amino acid nên chỉ có (2 - 1) = 1 liên kết peptide." },
                { text: "c) Nhóm liên kết peptide -CO-NH- có cấu trúc phẳng do liên kết C-N mang một phần đặc tính liên kết đôi.", isTrue: true, explain: "Đúng! Hiệu ứng cộng hưởng electron giữa đôi electron tự do của N và liên kết pi của C=O làm liên kết C-N ngắn lại (1.32 Å) và không quay tự do được." },
                { text: "d) Mọi peptide mạch hở đều có số nguyên tử Nitơ bằng số liên kết peptide cộng 1.", isTrue: false, explain: "Sai! Mệnh đề này chỉ đúng khi các amino acid cấu thành chỉ chứa 1 nhóm -NH2 (như Gly, Ala, Val). Nếu chứa Lys (2 nhóm N) hoặc Arg (4 nhóm N) thì số N sẽ lớn hơn." }
            ]
        }
    },
    {
        id: "topic_calculations",
        name: "Chủ đề 4: Tính Toán Peptide & Protein (Bài Toán Trọng Tâm)",
        icon: "🔢",
        badge: "Toán Hóa 12 Kinh Điển",
        summaryPoints: [
            "1. Phân tử khối Peptide: M = Tổng M(aa) - 18(n - 1).",
            "2. Thủy phân hoàn toàn bằng nước: Peptide + (n - 1) H2O -> n Amino acid.",
            "3. Thủy phân bằng dung dịch kiềm: Peptide + n NaOH -> Muối + 1 H2O (với amino acid 1 nhóm COOH).",
            "4. Định luật bảo toàn khối lượng: m(peptide) + m(NaOH) = m(muối) + m(H2O)."
        ],
        quickFormula: "m(muối) = m(peptide) + 40 * n(NaOH) - 18 * n(peptide) (với peptide tạo từ amino acid đơn nhóm -COOH)",
        questions: [
            {
                q: "Khối lượng phân tử của tripeptide mạch hở Gly-Ala-Val (biết M_Gly = 75, M_Ala = 89, M_Val = 117) là:",
                options: [
                    "A. 281 g/mol",
                    "B. 263 g/mol",
                    "C. 245 g/mol",
                    "D. 299 g/mol"
                ],
                answer: 2,
                explain: "M(tripeptide) = M_Gly + M_Ala + M_Val - 2 * 18 = 75 + 89 + 117 - 36 = 245 g/mol. (Vì khi hình thành 2 liên kết peptide đã tách ra 2 phân tử H2O)."
            },
            {
                q: "Thủy phân hoàn toàn 14.6 gam dipeptide Gly-Ala trong dung dịch NaOH vừa đủ. Khối lượng muối khan thu được sau khi cô cạn dung dịch là:",
                options: [
                    "A. 19.0 gam",
                    "B. 20.8 gam",
                    "C. 22.6 gam",
                    "D. 16.4 gam"
                ],
                answer: 1,
                explain: "M(Gly-Ala) = 75 + 89 - 18 = 146 g/mol -> n(Gly-Ala) = 14.6 / 146 = 0.1 mol. Phương trình: Gly-Ala + 2 NaOH -> Muối + H2O. Ta có: n(NaOH) = 2 * 0.1 = 0.2 mol; n(H2O) = n(peptide) = 0.1 mol. Áp dụng bảo toàn khối lượng: m(muối) = m(peptide) + m(NaOH) - m(H2O) = 14.6 + (0.2 * 40) - (0.1 * 18) = 14.6 + 8.0 - 1.8 = 20.8 gam."
            },
            {
                q: "Thủy phân hoàn toàn m gam một oligopeptide X (mạch hở) cần vừa đủ 0.3 mol NaOH, thu được 34.5 gam hỗn hợp muối của Glycine và Alanine. Giá trị của m là:",
                options: [
                    "A. 24.3 gam",
                    "B. 22.5 gam",
                    "C. 25.2 gam",
                    "D. 27.9 gam"
                ],
                answer: 1,
                explain: "Biết X được tạo từ Gly và Ala (đều có 1 nhóm -COOH). Ta có: n(H2O sinh ra) = n(X). Nhưng ta có nhận xét: Gly-Na (M = 97) và Ala-Na (M = 111). Ta có n(muối) = n(NaOH) = 0.3 mol. Khối lượng trung bình muối M_tb = 34.5 / 0.3 = 115 -> X có số mắt xích. Tuy nhiên, theo BTKL: m + m(NaOH) = m(muối) + m(H2O). Với bài toán này, n(H2O) thường nhỏ (nếu là tripeptide thì n(X) = 0.1 mol, m(H2O) = 1.8g -> m = 34.5 + 1.8 - 0.3*40 = 24.3g. Nếu X là tetrapeptide: n(X) = 0.3/4 = 0.075 mol, m(H2O) = 1.35g -> m = 23.85g). Chuẩn mực đề bài: X là tripeptide -> m = 24.3 gam."
            }
        ],
        stepByStepWalkthrough: {
            problem: "Bài toán mẫu: Thủy phân hoàn toàn 30.3 gam tripeptide Gly-Ala-Val bằng 300 mL dung dịch NaOH 1.5M. Cô cạn dung dịch sau phản ứng thu được m gam chất rắn khan. Tính giá trị của m.",
            steps: [
                {
                    stepNum: "Bước 1",
                    title: "Tính số mol các chất tham gia",
                    desc: "M(Gly-Ala-Val) = 75 + 89 + 117 - 2*18 = 245 g/mol.<br>Số mol peptide = 30.3 / 245 ≈ 0.1237 mol (hoặc lấy số liệu chuẩn: n_peptide = 0.12 mol, m = 29.4g). Với 30.3g: n(peptide) = 30.3 / 245 = 0.1237 mol.<br>n(NaOH ban đầu) = 0.3 * 1.5 = 0.45 mol."
                },
                {
                    stepNum: "Bước 2",
                    title: "Viết phương trình hóa học và xét lượng dư",
                    desc: "Phương trình phản ứng:<br><strong>Gly-Ala-Val + 3 NaOH → Muối + 1 H2O</strong><br>Số mol NaOH phản ứng = 3 * n(peptide) = 3 * 0.1237 = 0.371 mol.<br>Vì n(NaOH ban đầu) = 0.45 mol > 0.371 mol nên NaOH DƯ = 0.45 - 0.371 = 0.079 mol."
                },
                {
                    stepNum: "Bước 3",
                    title: "Áp dụng định luật Bảo Toàn Khối Lượng",
                    desc: "Chú ý: Chất rắn khan sau khi cô cạn bao gồm cả <strong>Muối của amino acid</strong> và <strong>NaOH dư</strong>!<br>Số mol H2O sinh ra = n(peptide) = 0.1237 mol.<br>Khối lượng chất rắn = m(peptide) + m(NaOH ban đầu) - m(H2O)<br>m = 30.3 + (0.45 * 40) - (0.1237 * 18) = 30.3 + 18.0 - 2.226 = <strong>46.074 gam</strong>."
                }
            ]
        }
    },
    {
        id: "topic_experiments_practical",
        name: "Chủ đề 5: Thí Nghiệm & Nhận Biết Trong Đề Thi Mới",
        icon: "🔬",
        badge: "Thực hành phòng thí nghiệm",
        summaryPoints: [
            "Nhận biết Peptide/Protein: Dùng Cu(OH)2/NaOH cho màu tím hoa cà (yêu cầu từ 2 liên kết peptide).",
            "Nhận biết amino acid có vòng thơm: Dùng HNO3 đặc cho màu vàng, thêm kiềm chuyển màu da cam (Xanthoproteic).",
            "Nhận biết protein chứa lưu huỳnh: Đun với NaOH rồi thêm Pb(CH3COO)2 tạo kết tủa đen PbS.",
            "Phân biệt protein hình sợi và hình cầu: Thử tính tan trong nước."
        ],
        quickFormula: "Tripeptide trở lên: Biuret (+) | Dipeptide: Biuret (-) | HNO3 đặc: Vàng -> Da cam",
        questions: [
            {
                q: "Thuốc thử duy nhất có thể dùng để phân biệt 3 dung dịch không màu riêng biệt gồm: Lòng trắng trứng, Hồ tinh bột, và Glucose là:",
                options: [
                    "A. Dung dịch AgNO3 trong NH3",
                    "B. Dung dịch Cu(OH)2 trong môi trường kiềm (hoặc CuSO4 + NaOH)",
                    "C. Dung dịch Iot (I2)",
                    "D. Giấy quỳ tím"
                ],
                answer: 1,
                explain: "Cho Cu(OH)2/NaOH vào 3 mẫu thử: Lòng trắng trứng xuất hiện màu TÍM HOA CÀ (phản ứng Biuret); Hồ tinh bột không hiện tượng; Glucose tạo dung dịch XANH LAM THẪM (phức đồng-polyol), đun nóng tạo kết tủa đỏ gạch Cu2O."
            },
            {
                q: "Trong các phát biểu sau về thí nghiệm phản ứng màu Biuret, phát biểu nào SAI?",
                options: [
                    "A. Có thể thay dung dịch lòng trắng trứng bằng dung dịch tripeptide Gly-Ala-Val",
                    "B. Nên nhỏ dung dịch CuSO4 trước rồi mới cho dung dịch NaOH vào",
                    "C. Phản ứng xảy ra ngay ở nhiệt độ phòng mà không cần đun nóng",
                    "D. Dipeptide không cho phản ứng màu Biuret"
                ],
                answer: 1,
                explain: "Phát biểu B sai! Quy trình chuẩn là phải cho dung dịch NaOH vào trước để tạo môi trường kiềm mạnh, sau đó mới nhỏ vài giọt CuSO4 vào để tạo Cu(OH)2 tại chỗ phản ứng với peptide. Nếu cho CuSO4 trước không có kiềm thì phản ứng không xảy ra."
            }
        ]
    }
];

// =============================================================================
// MODULE 5: DỮ LIỆU PHÂN ĐOẠN PEPTIDE MẪU (SEGMENT INSPECTOR)
// Dùng cho tính năng "Khi ấn vô 1 đoạn protein thì cho thêm thông tin cấu tạo đơn giản, là dạng peptide nào"
// =============================================================================
const PEPTIDE_SEGMENTS_PRESETS = [
    {
        id: "tri_gly_his_gly",
        name: "Chuỗi Tripeptide Gly-His-Gly (Mẫu Tham Chiếu SGK)",
        peptideType: "Tripeptide",
        categoryName: "Tripeptide (Dị Vòng Imidazole)",
        residueCount: 3,
        bondsCount: 2,
        sequence: "Gly - His - Gly",
        residuesList: ["GLY", "HIS", "GLY"],
        aminoAcids: ["Glycine (Gly, G)", "Histidine (His, H)", "Glycine (Gly, G)"],
        simpleFormula: "H2N-CH2-CO-NH-CH(CH2-C3H3N2)-CO-NH-CH2-COOH",
        molecularFormula: "C10H15N5O4",
        mw: "269.26 g/mol",
        nTerminus: "Gly · NH₂ tự do",
        cTerminus: "Gly · C(=O)OH",
        biuretReaction: true,
        biuretReason: "DƯƠNG TÍNH! Có 2 liên kết peptide (-CO-NH-), đủ điều kiện tối thiểu để tạo phức chất chelate màu tím hoa cà đặc trưng với ion Cu2+ trong môi trường kiềm NaOH.",
        properties: "Gốc Histidine ở giữa mang vòng thơm dị vòng Imidazole 5 cạnh, có khả năng phối trí ion kim loại chuyển tiếp Fe2+ và Cu2+.",
        pdbSnippetResidues: [1, 2, 3]
    },
    {
        id: "di_gly_ala",
        name: "Đoạn Dipeptide Gly-Ala",
        peptideType: "Dipeptide",
        categoryName: "Dipeptide (Oligopeptide)",
        residueCount: 2,
        bondsCount: 1,
        sequence: "Gly - Ala",
        aminoAcids: ["Glycine (Gly, G)", "Alanine (Ala, A)"],
        simpleFormula: "H2N-CH2-CO-NH-CH(CH3)-COOH",
        molecularFormula: "C5H10N2O3",
        mw: "146.15 g/mol",
        nTerminus: "Glycine (Đầu N: H2N-CH2-)",
        cTerminus: "Alanine (Đầu C: -CH(CH3)-COOH)",
        biuretReaction: false,
        biuretReason: "Âm tính! Dipeptide chỉ có DUY NHẤT 1 liên kết peptide, không đủ điều kiện tạo phức chất chelate màu tím (yêu cầu tối thiểu 2 liên kết peptide trở lên).",
        properties: "Mạch ngắn, phân cực trung bình, hòa tan hoàn toàn trong nước, dễ bị enzyme dipeptidase thủy phân thành Gly và Ala.",
        pdbSnippetResidues: [1, 2]
    },
    {
        id: "tri_val_leu_ser",
        name: "Đoạn Tripeptide Val-Leu-Ser",
        peptideType: "Tripeptide",
        categoryName: "Tripeptide (Oligopeptide)",
        residueCount: 3,
        bondsCount: 2,
        sequence: "Val - Leu - Ser",
        aminoAcids: ["Valine (Val, V)", "Leucine (Leu, L)", "Serine (Ser, S)"],
        simpleFormula: "H2N-CH(CH(CH3)2)-CO-NH-CH(CH2CH(CH3)2)-CO-NH-CH(CH2OH)-COOH",
        molecularFormula: "C14H27N3O5",
        mw: "317.38 g/mol",
        nTerminus: "Valine (Đầu N)",
        cTerminus: "Serine (Đầu C mang nhóm -OH phân cực)",
        biuretReaction: true,
        biuretReason: "DƯƠNG TÍNH! Tripeptide có 2 liên kết peptide (-CO-NH-), vừa đủ điều kiện tối thiểu để 2 nguyên tử Nitơ phối trí với ion Cu2+ trong kiềm tạo phức chất màu tím hoa cà nhạt.",
        properties: "Mang 2 gốc kị nước (Val, Leu) và 1 gốc phân cực (Ser). Nhóm -OH của Serine có thể tham gia liên kết hydrogen hoặc phản ứng phosphoryl hóa.",
        pdbSnippetResidues: [1, 2, 3]
    },
    {
        id: "tetra_ala_gly_val_leu",
        name: "Đoạn Tetrapeptide Ala-Gly-Val-Leu",
        peptideType: "Tetrapeptide",
        categoryName: "Tetrapeptide (Oligopeptide)",
        residueCount: 4,
        bondsCount: 3,
        sequence: "Ala - Gly - Val - Leu",
        aminoAcids: ["Alanine (Ala, A)", "Glycine (Gly, G)", "Valine (Val, V)", "Leucine (Leu, L)"],
        simpleFormula: "H2N-CH(CH3)-CO-NH-CH2-CO-NH-CH(CH(CH3)2)-CO-NH-CH(CH2CH(CH3)2)-COOH",
        molecularFormula: "C16H30N4O5",
        mw: "358.44 g/mol",
        nTerminus: "Alanine (Đầu N)",
        cTerminus: "Leucine (Đầu C)",
        biuretReaction: true,
        biuretReason: "DƯƠNG TÍNH MẠNH! Có 3 liên kết peptide, tạo phức chất 4 càng ổn định với ion Cu2+ cho màu tím hoa cà rất rõ ràng.",
        properties: "Mạch rất kỵ nước do chứa toàn các gốc no không phân cực (Ala, Gly, Val, Leu). Thường cuộn giấu vào bên trong lõi phân tử protein để tránh tiếp xúc với nước.",
        pdbSnippetResidues: [1, 2, 3, 4]
    },
    {
        id: "penta_cys_cys_pro_ser_ile",
        name: "Đoạn Pentapeptide Cys-Cys-Pro-Ser-Ile (Từ Crambin 1CRN)",
        peptideType: "Pentapeptide",
        categoryName: "Pentapeptide (Oligopeptide đặc biệt)",
        residueCount: 5,
        bondsCount: 4,
        sequence: "Cys - Cys - Pro - Ser - Ile",
        aminoAcids: ["Cysteine (Cys, C)", "Cysteine (Cys, C)", "Proline (Pro, P)", "Serine (Ser, S)", "Isoleucine (Ile, I)"],
        simpleFormula: "H2N-CH(CH2SH)-CO-NH-CH(CH2SH)-CO-N(C4H7)-CO-NH-CH(CH2OH)-CO-NH-CH(CH(CH3)CH2CH3)-COOH",
        molecularFormula: "C19H33N5O7S2",
        mw: "507.62 g/mol",
        nTerminus: "Cysteine (Đầu N mang nhóm -SH)",
        cTerminus: "Isoleucine (Đầu C)",
        biuretReaction: true,
        biuretReason: "DƯƠNG TÍNH! Có 4 liên kết peptide, phản ứng màu Biuret cho màu tím hoa cà rõ nét.",
        properties: "Đoạn chuỗi cực kỳ đặc biệt: 2 gốc Cysteine liên tiếp có khả năng tạo cầu nối Disulfide (-S-S-) cố định cấu trúc; gốc Proline bẻ cong mạch tạo khúc ngoặt (hairpin turn).",
        pdbSnippetResidues: [3, 4, 5, 6, 7]
    },
    {
        id: "helix_segment_mbo",
        name: "Phân đoạn Xoắn Alpha 8 gốc (Helix Segment từ Myoglobin)",
        peptideType: "Oligopeptide (Alpha-helix)",
        categoryName: "Oligopeptide chuỗi xoắn Alpha (Bậc 2)",
        residueCount: 8,
        bondsCount: 7,
        sequence: "Val - Leu - Ser - Glu - Gly - Glu - Trp - Gln",
        aminoAcids: ["Val", "Leu", "Ser", "Glu", "Gly", "Glu", "Trp", "Gln"],
        simpleFormula: "H2N-Val-CO-NH-Leu-CO-NH-Ser-CO-NH-Glu-CO-NH-Gly-CO-NH-Glu-CO-NH-Trp-CO-NH-Gln-COOH",
        molecularFormula: "C45H67N11O17",
        mw: "1026.08 g/mol",
        nTerminus: "Valine (Đầu N)",
        cTerminus: "Glutamine (Đầu C)",
        biuretReaction: true,
        biuretReason: "DƯƠNG TÍNH MẠNH! Có 7 liên kết peptide, tạo phức chất màu tím đậm với Cu2+ trong dung dịch NaOH.",
        properties: "Đoạn chuỗi tạo nên 2.2 vòng xoắn Alpha-helix hoàn chỉnh, được gia cố bằng 4 liên kết hydrogen nội mạch giữa nhóm C=O vị trí i và nhóm N-H vị trí i+4. Chứa gốc Trp cho phản ứng màu Xanthoproteic vàng cam.",
        pdbSnippetResidues: [1, 2, 3, 4, 5, 6, 7, 8]
    }
];

/* =========================================================================
   6. BỘ CÂU HỎI TRẮC NGHIỆM TƯƠNG TÁC DÀNH CHO BUỔI THUYẾT TRÌNH LỚP 12H
   Học sinh dùng điện thoại tương tác song song với nhóm thuyết trình
   Bám sát chuẩn SGK Hóa học 12 (GDPT 2018): Cấu trúc, Tính chất vật lí,
   Đông tụ trong đời sống, Phản ứng Biuret, Xanthoproteic và Ứng dụng y tế.
   ========================================================================= */
const PRESENTATION_INTERACTIVE_QUESTIONS = [
    {
        id: "pq1",
        topic: "Khái niệm & Cấu trúc phân tử Protein",
        badge: "CẤU TRÚC PHÂN TỬ",
        q: "Protein là hợp chất cao phân tử chứa các chuỗi polypeptide liên kết với nhau. Liên kết nào đóng vai trò là 'xương sống' tạo nên cấu trúc bậc 1 của protein?",
        options: [
            "A. Liên kết disulfide (-S-S-)",
            "B. Liên kết hydrogen (-H...O-)",
            "C. Liên kết peptide (-CO-NH-)",
            "D. Liên kết ion (cầu muối điện tích)"
        ],
        answer: 2,
        keyHint: "Cấu trúc bậc 1 xác định trật tự sắp xếp các gốc amino acid",
        explain: "CHÍNH XÁC! Liên kết peptide (-CO-NH-) nối các gốc α-amino acid lại với nhau tạo nên chuỗi polypeptide mạch dài (cấu trúc bậc 1). Các liên kết hydrogen, disulfide (-S-S-), liên kết ion và tương tác kị nước giữ vai trò duy trì ổn định cấu trúc không gian bậc cao (bậc 2, 3, 4)."
    },
    {
        id: "pq2",
        topic: "Tính chất vật lí: Protein hình sợi & hình cầu",
        badge: "TÍNH CHẤT VẬT LÍ",
        q: "Tại sao tóc, móng tay, sừng (chứa keratin) và tơ tằm (chứa fibroin) hoàn toàn không tan trong nước, trong khi lòng trắng trứng (chứa albumin) lại tan trong nước tạo dung dịch keo?",
        options: [
            "A. Do keratin và fibroin có khối lượng phân tử quá nhỏ so với albumin",
            "B. Do keratin, fibroin có cấu trúc hình sợi (kỵ nước, khó tan); còn albumin có cấu trúc hình cầu cuộn chặt với các gốc phân cực hướng ra ngoài tạo lớp vỏ hydrat",
            "C. Do protein hình sợi không chứa liên kết peptide trong phân tử",
            "D. Do albumin bị biến tính ngay trong nước lạnh"
        ],
        answer: 1,
        keyHint: "Hình sợi tạo khung cấu trúc; hình cầu tan tạo dung dịch keo",
        explain: "RẤT CHÍNH XÁC! Theo SGK Hóa học 12: Protein hình sợi (keratin, fibroin, collagen) có mạch dài xếp song song, nhiều liên kết kỵ nước nên bền vững và không tan trong nước; protein hình cầu (albumin, hemoglobin) cuộn gập tròn, các gốc amino acid ưa nước quay ra ngoài tạo vỏ hydrat hóa bền giúp tan tốt trong nước tạo dung dịch keo."
    },
    {
        id: "pq3",
        topic: "Hiện tượng đời sống: Sự đông tụ của Protein",
        badge: "ĐÔNG TỤ TRONG ĐỜI SỐNG",
        q: "Khi nấu canh cua đồng, người ta giã cua, lọc lấy nước rồi đun sôi thì thấy từng mảng 'gạch cua' đông lại và nổi lên mặt nước. Đây là ví dụ điển hình của hiện tượng nào?",
        options: [
            "A. Phản ứng thủy phân protein hoàn toàn thành amino acid",
            "B. Phản ứng màu Biuret tạo phức chất màu tím",
            "C. Sự đông tụ protein dưới tác dụng của nhiệt độ cao (biến tính nhiệt)",
            "D. Phản ứng xà phòng hóa chất béo trong thịt cua"
        ],
        answer: 2,
        keyHint: "Nhiệt độ cao phá vỡ cấu trúc không gian bậc cao",
        explain: "CHUẨN XÁC! Trong nước cua có protein hòa tan dạng dung dịch keo. Khi đun sôi (nhiệt độ > 60°C), cấu trúc không gian bậc 2, 3, 4 bị phá vỡ (biến tính), các chuỗi polypeptide duỗi xoắn làm lộ các gốc kỵ nước dính lại với nhau tạo mảng đông tụ xốp nhẹ nổi lên mặt nước. Tương tự như luộc trứng hay làm đậu phụ!"
    },
    {
        id: "pq4",
        topic: "Tính chất hóa học: Phản ứng màu Biuret",
        badge: "PHẢN ỨNG MÀU BIURET",
        q: "Cho dung dịch albumin tác dụng với Cu(OH)2 trong môi trường kiềm NaOH. Hiện tượng quan sát được và điều kiện của phản ứng này là gì?",
        options: [
            "A. Xuất hiện kết tủa màu vàng tươi; dipeptide cũng cho phản ứng này",
            "B. Dung dịch chuyển sang màu tím đặc trưng; chỉ xảy ra với hợp chất có từ 2 liên kết peptide trở lên (tripeptide trở lên hoặc protein)",
            "C. Dung dịch sủi bọt khí và mất màu hoàn toàn",
            "D. Xuất hiện kết tủa trắng bạc bám vào thành ống nghiệm"
        ],
        answer: 1,
        keyHint: "Cu(OH)2 + kiềm + từ 2 liên kết peptide trở lên -> màu tím",
        explain: "HOÀN TOÀN CHÍNH XÁC! Đây là phản ứng màu đặc trưng nhận biết protein và peptide (từ tripeptide trở lên). Ion Cu²⁺ trong môi trường kiềm tạo phức chất vòng càng chelate với các nguyên tử nitơ của liên kết peptide cho dung dịch có màu tím hoặc tím than đặc trưng. Dipeptide chỉ có 1 liên kết peptide nên KHÔNG cho phản ứng màu Biuret!"
    },
    {
        id: "pq5",
        topic: "Ứng dụng y tế: Tác nhân Cồn và Axit",
        badge: "ỨNG DỤNG Y HỌC",
        q: "Tại sao trong y tế người ta thường dùng cồn 70° để sát trùng vết thương và dụng cụ y tế thay vì dùng cồn 90° hay cồn nguyên chất?",
        options: [
            "A. Vì cồn 90° không có khả năng làm đông tụ protein của vi khuẩn",
            "B. Vì cồn 70° làm đông tụ protein vi khuẩn từ từ, đủ thời gian thẩm thấu sâu vào tế bào tiêu diệt vi khuẩn; còn cồn 90° làm đông tụ lớp vỏ ngoài quá nhanh tạo màng bọc bảo vệ vi khuẩn bên trong",
            "C. Vì cồn 70° bốc hơi nhanh hơn cồn 90°",
            "D. Vì cồn 90° phản ứng với không khí sinh ra khí độc"
        ],
        answer: 1,
        keyHint: "Cân bằng tốc độ thẩm thấu và tốc độ biến tính protein",
        explain: "RẤT XUẤT SẮC! Cồn ethanol làm mất nước lớp vỏ hydrat của protein. Cồn 90° làm protein bề mặt tế bào vi khuẩn đông tụ quá nhanh thành màng cứng bao bọc, ngăn cản cồn thấm vào nhân, vi khuẩn chỉ bị ức chế tạm thời. Cồn 70° vừa đủ làm biến tính từ từ, ngấm sâu vào trong tế bào và tiêu diệt triệt để vi khuẩn!"
    },
    {
        id: "pq6",
        topic: "Phản ứng màu Xanthoproteic với Axit Nitric (HNO3)",
        badge: "PHẢN ỨNG XANTHOPROTEIC",
        q: "Khi vô tình để axit HNO3 đặc dính vào lòng trắng trứng hoặc da tay, vùng tiếp xúc nhanh chóng xuất hiện màu vàng. Hiện tượng này được giải thích là do:",
        options: [
            "A. Axit HNO3 hòa tan protein tạo dung dịch keo màu vàng",
            "B. Phản ứng thế nhóm nitro (-NO2) vào nhân thơm của các amino acid có vòng benzen (tyrosine, phenylalanine, tryptophan) tạo sản phẩm có màu vàng (phản ứng Xanthoproteic)",
            "C. Axit HNO3 bị khử thành khí NO2 hòa tan trong nước",
            "D. Ion nitrat tác dụng với ion kim loại trong da tạo kết tủa vàng"
        ],
        answer: 1,
        keyHint: "Nitro hóa vòng thơm của amino acid (Tyr, Phe, Trp)",
        explain: "TUYỆT VỜI! Phản ứng Xanthoproteic: Axit HNO3 đặc phản ứng với các gốc amino acid chứa vòng thơm (như Tyrosine, Tryptophan) trong phân tử protein, thế nhóm nitro (-NO2) vào vòng benzen tạo hợp chất nitro thơm có màu vàng đặc trưng. Đây là câu hỏi rất hay xuất hiện trong các đề thi THPT!"
    }
];

/* =========================================================================
   7. DỮ LIỆU THUYẾT TRÌNH TƯƠNG TÁC 12H - THEO SÁT 100% ĐỀ THẦY PHÁT
   (Trường THPT Chuyên Hùng Vương - Tổ Hoá học - Trang 14-16/16)
   Bao gồm:
   - Speaker Notes: Lời dẫn thuyết minh chuẩn mực từng câu cho nhóm thuyết trình
   - Điền khuyết tương tác: Vừa thuyết trình vừa hướng dẫn các bạn điền
   - Thí nghiệm ảo trực tiếp trên web để học sinh tự suy ra lí thuyết
   - Mini-quiz củng cố ngay tại chỗ
   ========================================================================= */
const PRESENTATION_12H_DATA = [
    {
        id: "bai1_khainiem",
        title: "Bài 1: Khái Niệm, Phân Loại & Tính Chất Vật Lí",
        subTitle: "Bám sát Mục 1 - Trang 14/16 (THPT Chuyên Hùng Vương)",
        badge: "KHÁI NIỆM & TÍNH CHẤT",
        icon: "🧬",
        speakerNotes: "Kính thưa thầy cô và các bạn, mở đầu bài thuyết trình, nhóm chúng mình xin làm rõ 3 định nghĩa nền tảng: Thứ nhất, Protein là hợp chất cao phân tử được cấu tạo từ một hay nhiều chuỗi polypeptide, trong đó mỗi chuỗi gồm các đơn vị α-amino acid liên kết qua liên kết peptide theo trật tự nhất định. Thứ hai, về phân loại: protein đơn giản chỉ chứa các α-amino acid; còn protein phức tạp có thêm thành phần phi protein như nucleic acid, lipid hay carbohydrate. Thứ ba, về tính chất vật lí: protein hình sợi như keratin ở tóc móng hay collagen ở da sụn hoàn toàn không tan trong nước; ngược lại protein hình cầu như albumin hay hemoglobin lại tan trong nước tạo dung dịch keo. Mời các bạn cùng tham gia điền khuyết tương tác dưới đây!",
        fillInBlanks: {
            text: "1) Khái niệm, phân loại và tính chất vật lí:\n• Protein là hợp chất [[b1]], được cấu tạo từ một hay nhiều chuỗi [[b2]], mỗi chuỗi gồm các đơn vị α-amino acid liên kết qua liên kết peptide theo một trật tự nhất định.\n• Protein đơn giản khi thuỷ phân chỉ cho hỗn hợp các [[b3]] (thí dụ: albumin, fibroin, insulin). Protein phức tạp gồm protein đơn giản kết hợp với thành phần [[b4]] như nucleic acid, lipid, carbohydrate.\n• Protein hình sợi ([[b5]] ở tóc, móng; collagen ở da, sụn) [[b6]] trong nước và dung môi thông thường; protein hình cầu ([[b7]] ở máu, albumin ở lòng trắng trứng) tan được trong nước tạo dung dịch [[b8]].",
            blanks: [
                { id: "b1", answer: "cao phân tử", options: ["cao phân tử", "đơn phân", "vô cơ", "ion"], hint: "Hợp chất có phân tử khối rất lớn" },
                { id: "b2", answer: "polypeptide", options: ["polypeptide", "polyester", "polysaccharide", "polyamide"], hint: "Chuỗi gồm nhiều mắt xích peptide" },
                { id: "b3", answer: "α-amino acid", options: ["α-amino acid", "β-amino acid", "fatty acid", "glucose"], hint: "Đơn vị amino acid chuẩn alpha" },
                { id: "b4", answer: "phi protein", options: ["phi protein", "kim loại kiềm", "nước tinh khiết", "chất béo bão hòa"], hint: "Thành phần không phải là protein" },
                { id: "b5", answer: "keratin", options: ["keratin", "fibroin", "albumin", "casein"], hint: "Protein dạng sợi cấu tạo nên tóc, móng, sừng" },
                { id: "b6", answer: "không tan", options: ["không tan", "tan tốt", "dễ tan", "tạo dung dịch keo"], hint: "Không tan trong nước và dung môi thông thường" },
                { id: "b7", answer: "hemoglobin", options: ["hemoglobin", "collagen", "keratin", "myosin"], hint: "Protein dạng cầu vận chuyển oxy trong máu" },
                { id: "b8", answer: "keo", options: ["keo", "thực", "huyền phù", "nhũ tương"], hint: "Dung dịch dạng sol keo hạt lớn" }
            ]
        },
        experiment: {
            id: "exp_solubility",
            title: "Thí Nghiệm Khảo Sát Tính Tan: Sợi Tóc (Keratin) vs Lòng Trắng Trứng (Albumin)",
            description: "Thả sợi tóc vào cốc nước 1 và nhỏ vài giọt lòng trắng trứng vào cốc nước 2, khuấy nhẹ.",
            reagentOptions: [
                { id: "hair", name: "Cốc 1: Sợi tóc (Protein hình sợi)", icon: "💇" },
                { id: "egg", name: "Cốc 2: Lòng trắng trứng (Protein hình cầu)", icon: "🥚" }
            ],
            simulationResult: {
                hair: {
                    visualState: "hair_insoluble",
                    text: "Sợi tóc (keratin) giữ nguyên sợi dài, không tan, chìm dưới đáy hoặc nổi trên mặt nước. Nước vẫn trong suốt.",
                    observation: "Protein hình sợi không tan trong nước và dung môi thông thường."
                },
                egg: {
                    visualState: "egg_sol",
                    text: "Lòng trắng trứng phân tán đều tạo thành dung dịch hơi mờ đục có hiện tượng tán xạ ánh sáng (dung dịch keo).",
                    observation: "Protein hình cầu tan được trong nước tạo dung dịch keo."
                }
            },
            deduction: "TỰ SUY RA LÍ THUYẾT: Cấu trúc không gian quyết định tính tan: chuỗi mạch dài xếp song song bền vững không tan (hình sợi); còn chuỗi cuộn gập hình cầu quay nhóm ưa nước ra ngoài giúp tan tạo dung dịch keo!"
        },
        quiz: [
            {
                q: "Chất nào sau đây là protein đơn giản theo định nghĩa tờ lí thuyết?",
                options: ["A. Albumin (lòng trắng trứng)", "B. Hemoglobin (chứa nhân Heme)", "C. Mucoprotein (chứa carbohydrate)", "D. Lipoprotein (chứa lipid)"],
                answer: 0,
                explain: "Albumin, fibroin, insulin là các protein đơn giản vì khi thủy phân chỉ cho hỗn hợp các α-amino acid."
            },
            {
                q: "Protein hình sợi có đặc điểm vật lí nổi bật nào?",
                options: ["A. Tan tốt trong nước tạo dung dịch keo", "B. Không tan trong nước và các dung môi thông thường", "C. Dễ bay hơi ở nhiệt độ phòng", "D. Luôn có cấu trúc bậc 4 đối xứng"],
                answer: 1,
                explain: "Protein hình sợi (như keratin ở tóc móng, collagen ở da sụn) không tan trong nước và dung môi thông thường."
            }
        ]
    },
    {
        id: "bai2_hoahoc",
        title: "Bài 2: Tính Chất Hóa Học (Thủy Phân & Đông Tụ)",
        subTitle: "Bám sát Mục 2 - Trang 14-15/16 (THPT Chuyên Hùng Vương)",
        badge: "TÍNH CHẤT HÓA HỌC",
        icon: "⚗️",
        speakerNotes: "Ở phần 2, nhóm mình xin trình bày về tính chất hoá học đặc trưng của Protein: Đầu tiên là phản ứng thủy phân: tương tự peptide, protein bị thủy phân bởi acid, base hoặc enzyme, trải qua nhiều giai đoạn từ Protein tạo polypeptide rồi đến amino acid cuối cùng. Thứ hai là sự đông tụ: protein bị đông tụ khi đun nóng hoặc khi thêm acid, base, muối của kim loại nặng như Chì, Thủy ngân vì cấu tạo ban đầu bị phá vỡ. Có hai hiện tượng thực tế thầy đặc biệt lưu ý kiểm tra: (1) Nấu canh cua, thịt cua nổi thành màng là do nhiệt độ cao gây biến tính đông tụ; (2) Khi ngộ độc muối chì, thủy ngân, uống sữa cấp cứu vì protein trong sữa sẽ phản ứng kết tủa với ion kim loại nặng, tạo khối kết tủa bảo vệ niêm mạc dạ dày và ngăn chất độc ngấm vào máu!",
        fillInBlanks: {
            text: "2) Tính chất hoá học:\n• Thuỷ phân: tương tự peptide, protein bị thuỷ phân bởi acid, base hoặc enzyme, trải qua nhiều giai đoạn:\n   Protein → [[b1]] → [[b2]]\n• Đông tụ: protein bị đông tụ khi đun nóng hoặc khi thêm acid, base, muối của [[b3]] (Pb²⁺, Hg²⁺...) vì cấu tạo ban đầu của protein bị [[b4]].\n• Giải thích hiện tượng thực tế:\n  (1) Nấu canh cua, thịt cua nổi thành màng: [[b5]]\n  (2) Uống sữa khi ngộ độc muối chì, thuỷ ngân: [[b6]]",
            blanks: [
                { id: "b1", answer: "polypeptide", options: ["polypeptide", "glucose", "ester", "alcohol"], hint: "Các đoạn mạch trung gian ngắn hơn" },
                { id: "b2", answer: "amino acid", options: ["amino acid", "muối vô cơ", "carbon", "khí CO2"], hint: "Sản phẩm cuối cùng của quá trình thủy phân" },
                { id: "b3", answer: "kim loại nặng", options: ["kim loại nặng", "kim loại kiềm", "nước cất", "chất béo"], hint: "Muối của Pb²⁺, Hg²⁺, Cu²⁺..." },
                { id: "b4", answer: "phá vỡ", options: ["phá vỡ", "bảo toàn", "nhân đôi", "chuyển thành tinh bột"], hint: "Cấu trúc không gian ban đầu bị thay đổi" },
                { id: "b5", answer: "Nhiệt độ cao làm biến tính đông tụ", options: ["Nhiệt độ cao làm biến tính đông tụ", "thủy phân hoàn toàn", "phản ứng tráng bạc", "bay hơi nước"], hint: "Nhiệt độ cao làm đông tụ protein cua" },
                { id: "b6", answer: "Protein trong sữa kết tủa với Pb²⁺, Hg²⁺", options: ["Protein trong sữa kết tủa với Pb²⁺, Hg²⁺", "sữa hòa tan chì đào thải qua phổi", "sữa trung hòa acid dạ dày", "sữa làm giảm nhiệt độ"], hint: "Protein sữa tạo kết tủa bao vây ion độc" }
            ]
        },
        experiment: {
            id: "exp_coag_poison",
            title: "Thí Nghiệm Thực Tế: Đun Nóng Nước Cua & Uống Sữa Giải Độc Muối Chì (Pb²⁺)",
            description: "Chọn thí nghiệm mô phỏng để quan sát diễn biến hoá học trực tiếp.",
            reagentOptions: [
                { id: "crab_soup", name: "Thí nghiệm 1: Đun sôi nước lọc cua", icon: "🦀" },
                { id: "milk_lead", name: "Thí nghiệm 2: Nhỏ Pb(NO3)2 vào cốc sữa", icon: "🥛" }
            ],
            simulationResult: {
                crab_soup: {
                    visualState: "crab_coag",
                    text: "Khi tăng nhiệt độ lên > 70°C, các phân tử protein cua hòa tan bị biến tính nhiệt, kết tụ lại tạo thành các mảng riêu cua xốp màu nâu hồng nổi lên bề mặt.",
                    observation: "Nhiệt độ cao phá vỡ cấu trúc không gian làm protein đông tụ nổi thành màng."
                },
                milk_lead: {
                    visualState: "milk_precipitate",
                    text: "Nhỏ ion Pb²⁺ vào cốc sữa tươi, protein casein và albumin trong sữa lập tức đông tụ tạo kết tủa trắng đặc, bao bọc toàn bộ ion Pb²⁺.",
                    observation: "Protein trong sữa tạo kết tủa với Pb²⁺, Hg²⁺, bảo vệ niêm mạc và ngăn hấp thụ ion độc vào máu."
                }
            },
            deduction: "TỰ SUY RA LÍ THUYẾT: Tác nhân nhiệt độ và ion kim loại nặng làm phá vỡ các liên kết hydrogen, cầu muối bậc cao khiến chuỗi bung ra kết tụ lại (đông tụ protein)!"
        },
        quiz: [
            {
                q: "Khi nấu canh cua, hiện tượng thịt cua nổi lên thành từng mảng là do:",
                options: ["A. Protein bị thủy phân thành amino acid", "B. Protein bị đông tụ do nhiệt độ cao làm biến tính", "C. Thịt cua phản ứng với muối ăn tạo khí", "D. Nước sôi làm bay hơi hết protein"],
                answer: 1,
                explain: "Nhiệt độ cao làm biến tính nhiệt và đông tụ protein cua, làm các phân tử kết dính thành mảng nổi lên mặt nước."
            },
            {
                q: "Vì sao người bị ngộ độc muối chì (Pb²⁺) hay thủy ngân (Hg²⁺) được sơ cứu bằng cách cho uống sữa tươi?",
                options: ["A. Sữa cung cấp canxi thay thế chì", "B. Protein trong sữa phản ứng kết tủa với ion Pb²⁺, Hg²⁺ ngăn độc chất ngấm vào cơ thể", "C. Sữa làm tan chảy kim loại nặng", "D. Sữa diệt khuẩn trong dạ dày"],
                answer: 1,
                explain: "Protein trong sữa tạo phức kết tủa không tan với ion kim loại nặng, làm giảm nồng độ ion tự do và bảo vệ niêm mạc dạ dày trước khi đến bệnh viện."
            }
        ]
    },
    {
        id: "bai3_baccautruc",
        title: "Bài 3: Chuyên 4 Bậc Cấu Trúc & Biến Tính Protein",
        subTitle: "Bám sát Bảng Chuyên Cấu Trúc & Biến Tính - Trang 15/16",
        badge: "4 BẬC CẤU TRÚC",
        icon: "🔬",
        speakerNotes: "Tiếp theo là phần Chuyên sâu về 4 Bậc Cấu Trúc và Biến Tính: Bậc một là chuỗi dãn thẳng, liên kết bằng liên kết peptide. Bậc hai là dạng xoắn alpha hoặc nếp gấp beta, liên kết bằng liên kết hydrogen giữa các liên kết peptide. Bậc ba là cấu trúc 3 chiều hình cầu cuộn gập đặc thù, liên kết bởi liên kết hydrogen, tương tác kị nước, lực tĩnh điện và liên kết disulfide (-S-S-). Bậc bốn gồm 2 hoặc nhiều cấu trúc bậc 3 phối hợp (giống bậc 3). Điều đặc biệt cần ghi nhớ: Biến tính protein phá vỡ cấu trúc bậc 2, 3, 4 nhưng KHÔNG phá vỡ bậc một, do đó protein mất hoạt tính sinh học và đông tụ. Tại điểm đẳng điện pH = pI, protein ít tan nhất và dễ đông tụ nhất, ví dụ casein có pI xấp xỉ 4,6 đông lại khi làm sữa chua!",
        fillInBlanks: {
            text: "▲ Chuyên: bậc cấu trúc và biến tính protein\n• Bậc một: [[b1]] | Liên kết/lực chính: [[b2]]\n• Bậc hai: [[b3]] | Liên kết/lực chính: [[b4]]\n• Bậc ba: [[b5]] | Liên kết/lực chính: [[b6]]\n• Bậc bốn: [[b7]] | Liên kết/lực chính: [[b8]]\n• Biến tính (nhiệt, acid, base, ion kim loại nặng, ethanol) phá vỡ cấu trúc bậc [[b9]] nhưng [[b10]] phá vỡ bậc một nên protein mất hoạt tính và thường đông tụ. Tại pH = pI protein ít tan nhất, dễ đông tụ: casein (pI ≈ 4,6) đông lại khi sữa chua có pH giảm xuống khoảng 4,6.",
            blanks: [
                { id: "b1", answer: "chuỗi dãn", options: ["chuỗi dãn", "xoắn ốc", "khối cầu 3D", "mạng không gian"], hint: "Chuỗi polypeptide mạch thẳng" },
                { id: "b2", answer: "liên kết peptide", options: ["liên kết peptide", "liên kết hydrogen", "cầu disulfide", "lực Van der Waals"], hint: "Liên kết -CO-NH- bền vững" },
                { id: "b3", answer: "xoắn, nếp gấp", options: ["xoắn, nếp gấp", "chuỗi thẳng", "tiểu đơn vị", "vòng benzene"], hint: "Xoắn alpha và phiến gấp beta" },
                { id: "b4", answer: "liên kết hydrogen", options: ["liên kết hydrogen", "liên kết cộng hóa trị", "liên kết ion mạnh", "liên kết kim loại"], hint: "Liên kết hydrogen giữa >C=O và H-N<" },
                { id: "b5", answer: "cấu trúc 3 chiều hình cầu", options: ["cấu trúc 3 chiều hình cầu", "chuỗi dãn phẳng", "hạt nano vô cơ", "chuỗi đơn độc"], hint: "Cấu trúc cuộn gập không gian 3D" },
                { id: "b6", answer: "liên kết hydrogen, tương tác kị nước, lực tĩnh điện, liên kết disulfide (-S-S-)", options: ["liên kết hydrogen, tương tác kị nước, lực tĩnh điện, liên kết disulfide (-S-S-)", "chỉ có liên kết peptide", "chỉ có liên kết đôi C=C", "chỉ có liên kết ester"], hint: "Tổ hợp liên kết yếu và cầu disulfide" },
                { id: "b7", answer: "2 hoặc nhiều cấu trúc bậc 3", options: ["2 hoặc nhiều cấu trúc bậc 3", "1 chuỗi dãn duy nhất", "hàng triệu phân tử glucose", "các ion tự do"], hint: "Sự phối hợp của các tiểu đơn vị" },
                { id: "b8", answer: "giống bậc 3", options: ["giống bậc 3", "chỉ dùng liên kết ester", "liên kết kim loại", "không có liên kết"], hint: "Các lực tương tác tương tự bậc ba" },
                { id: "b9", answer: "2, 3, 4", options: ["2, 3, 4", "1, 2, 3", "chỉ bậc 1", "chỉ bậc 2"], hint: "Các bậc cấu trúc không gian bậc cao" },
                { id: "b10", answer: "không", options: ["không", "có", "luôn luôn", "tùy lúc"], hint: "Liên kết peptide bậc 1 rất bền không bị phá vỡ" }
            ]
        },
        experiment: {
            id: "exp_isoelectric",
            title: "Thí Nghiệm Điểm Đẳng Điện (pI): Làm Sữa Chua Từ Sữa Tươi (Casein pI ≈ 4,6)",
            description: "Theo dõi quá trình lên men lactic làm giảm pH từ 6,6 xuống 4,6 (điểm đẳng điện pI).",
            reagentOptions: [
                { id: "ph6", name: "Trạng thái 1: Sữa tươi ban đầu (pH ≈ 6.6)", icon: "🥛" },
                { id: "ph46", name: "Trạng thái 2: Lên men sữa chua (pH giảm về 4.6)", icon: "🥣" }
            ],
            simulationResult: {
                ph6: {
                    visualState: "milk_liquid",
                    text: "Ở pH = 6.6, casein tích điện âm đẩy nhau, tan tốt và phân tán đều trong sữa dạng lỏng.",
                    observation: "Protein mang điện tích cùng dấu nên không đông tụ."
                },
                ph46: {
                    visualState: "yogurt_solid",
                    text: "Vi khuẩn lên men lactic sinh ra axit lactic làm pH giảm xuống đúng 4.6 (pI). Tổng điện tích phân tử bằng 0, độ tan nhỏ nhất, casein đông tụ tạo thành khối sữa chua sánh mịn thơm ngon!",
                    observation: "Tại pH = pI protein ít tan nhất, dễ đông tụ nhất (hiện tượng làm sữa chua)."
                }
            },
            deduction: "TỰ SUY RA LÍ THUYẾT: Điểm đẳng điện pI là pH mà phân tử protein có tổng điện tích bằng 0, độ tan nhỏ nhất nên đông tụ lại!"
        },
        quiz: [
            {
                q: "Hiện tượng biến tính protein phá vỡ những bậc cấu trúc nào sau đây?",
                options: ["A. Bậc 1, 2 và 3", "B. Bậc 2, 3 và 4 nhưng KHÔNG phá vỡ bậc 1", "C. Chỉ phá vỡ duy nhất bậc 1", "D. Phá vỡ toàn bộ 4 bậc cấu trúc tạo amino acid"],
                answer: 1,
                explain: "Biến tính chỉ phá vỡ các liên kết yếu duy trì cấu trúc không gian bậc 2, 3, 4; liên kết peptide cộng hóa trị bền vững ở bậc 1 KHÔNG bị phá vỡ."
            },
            {
                q: "Tại điểm đẳng điện (pH = pI), protein có đặc tính nào sau đây?",
                options: ["A. Tan tốt nhất trong nước", "B. Ít tan nhất và dễ bị đông tụ nhất", "C. Tích điện dương cực đại", "D. Bị thủy phân nhanh nhất"],
                answer: 1,
                explain: "Tại pH = pI, protein ở dạng ion lưỡng cực có tổng điện tích bằng 0, không còn lực đẩy tĩnh điện nên độ tan cực tiểu, dễ đông tụ nhất (như casein pI ≈ 4,6 trong sữa chua)."
            }
        ]
    },
    {
        id: "bai4_phanungmau",
        title: "Bài 4: Phản Ứng Màu Đặc Trưng & Vai Trò Của Protein",
        subTitle: "Bám sát Mục Phản ứng màu & Vai trò - Trang 15-16/16",
        badge: "PHẢN ỨNG MÀU & VAI TRÒ",
        icon: "🎨",
        speakerNotes: "Phần 4 là hai phản ứng màu kinh điển nhận biết protein: Thứ nhất, Phản ứng Biuret: protein tác dụng với Cu(OH)2 trong môi trường kiềm cho màu tím đặc trưng do có nhiều liên kết peptide tạo phức chelate. Thứ hai, Phản ứng với HNO3 đặc (Xanthoproteic): cho kết tủa màu vàng, một phần do nitro hoá vòng benzene của các amino acid như Tyrosine, một phần do protein đông tụ trong môi trường acid mạnh. Về vai trò: protein tham gia xây dựng tế bào, vận chuyển chất (Hemoglobin), điều hoà trao đổi chất (Insulin), xúc tác phản ứng sinh hoá (Enzyme) và cung cấp năng lượng cùng các amino acid thiết yếu cho cơ thể!",
        fillInBlanks: {
            text: "• Phản ứng màu:\n  - Protein cho màu [[b1]] đặc trưng với Cu(OH)₂ trong môi trường kiềm (phản ứng biuret, do có nhiều liên kết peptide);\n  - Với HNO₃ đặc cho [[b2]] (một phần do nitro hoá vòng benzene của gốc amino acid, một phần do protein đông tụ trong môi trường acid).\n• Vai trò:\n  Protein tham gia xây dựng [[b3]], vận chuyển chất, điều hoà trao đổi chất, [[b4]] phản ứng sinh hoá; là nguồn cung cấp năng lượng và amino acid thiết yếu.",
            blanks: [
                { id: "b1", answer: "tím", options: ["tím", "đỏ gạch", "xanh lam", "trắng bạc"], hint: "Màu đặc trưng của phức Biuret" },
                { id: "b2", answer: "kết tủa vàng", options: ["kết tủa vàng", "dung dịch không màu", "kết tủa đen", "khí mùi khai"], hint: "Kết tủa màu vàng Xanthoproteic" },
                { id: "b3", answer: "tế bào", options: ["tế bào", "khoáng chất", "nước biển", "khí oxy"], hint: "Đơn vị cấu trúc cơ bản của cơ thể sống" },
                { id: "b4", answer: "xúc tác", options: ["xúc tác", "ức chế", "đốt cháy", "hòa tan"], hint: "Chức năng sinh học của Enzyme" }
            ]
        },
        experiment: {
            id: "exp_color_reactions",
            title: "Thí Nghiệm Màu Thực Nghiệm: Phản Ứng Biuret & Phản Ứng Với Axit HNO₃ Đặc",
            description: "Thực hiện nhỏ thuốc thử vào ống nghiệm chứa dung dịch lòng trắng trứng (Albumin).",
            reagentOptions: [
                { id: "biuret_test", name: "Ống nghiệm A: Thêm NaOH + CuSO4 (Biuret)", icon: "💜" },
                { id: "xantho_test", name: "Ống nghiệm B: Thêm HNO3 đặc (Xanthoproteic)", icon: "💛" }
            ],
            simulationResult: {
                biuret_test: {
                    visualState: "biuret_purple",
                    text: "Nhỏ NaOH và vài giọt CuSO4 vào lòng trắng trứng, dung dịch lập tức chuyển sang màu tím hoa cà đặc trưng.",
                    observation: "Phản ứng Biuret tạo màu tím đặc trưng do có nhiều liên kết peptide."
                },
                xantho_test: {
                    visualState: "xantho_yellow",
                    text: "Nhỏ vài giọt HNO3 đặc vào lòng trắng trứng, xuất hiện kết tủa trắng đông tụ, sau đó chuyển sang màu vàng tươi đặc trưng.",
                    observation: "Tác dụng với HNO3 đặc cho kết tủa vàng do nitro hoá vòng benzen và đông tụ do axit."
                }
            },
            deduction: "TỰ SUY RA LÍ THUYẾT: Thuốc thử Cu(OH)2/kiềm nhận biết liên kết peptide (màu tím); HNO3 đặc nhận biết amino acid chứa vòng thơm (kết tủa vàng)!"
        },
        quiz: [
            {
                q: "Dung dịch protein tác dụng với Cu(OH)2 trong môi trường kiềm cho màu gì?",
                options: ["A. Màu đỏ gạch", "B. Màu tím hoa cà đặc trưng", "C. Màu xanh lam thẫm của saccarozơ", "D. Màu vàng chanh"],
                answer: 1,
                explain: "Đây là phản ứng màu Biuret kinh điển: các liên kết peptide trong protein tạo phức chelate với ion Cu2+ cho màu tím đặc trưng."
            },
            {
                q: "Khi dính axit HNO3 đặc vào da tay, vùng da bị dính xuất hiện màu vàng là do:",
                options: ["A. Axit ăn mòn tạo muối đồng", "B. Phản ứng nitro hoá vòng benzen của protein trong da tạo hợp chất nitro màu vàng", "C. Da tay bị cháy thành than", "D. Nước trong da bị bốc hơi"],
                answer: 1,
                explain: "Axit HNO3 đặc thế nhóm nitro (-NO2) vào vòng benzen của các gốc amino acid thơm trong protein của da tạo sản phẩm màu vàng (phản ứng Xanthoproteic)."
            }
        ]
    },
    {
        id: "bai5_enzyme_app",
        title: "Bài 5: Enzyme & Ứng Dụng Trong Các Lĩnh Vực",
        subTitle: "Bổ sung theo yêu cầu bài học & chuẩn SGK Hóa 12 mới",
        badge: "ENZYME & ỨNG DỤNG",
        icon: "⚡",
        speakerNotes: "Mục 5 rất quan trọng: Enzyme là chất xúc tác sinh học, hầu hết có bản chất là protein. Enzyme có hai đặc tính ưu việt: Thứ nhất là tính chọn lọc (đặc hiệu) cực cao, mỗi enzyme chỉ xúc tác cho một phản ứng nhất định theo cơ chế chìa khoá - ổ khoá. Thứ hai là tốc độ phản ứng cực lớn ở điều kiện rất êm dịu (nhiệt độ cơ thể và pH sinh lí). Về ứng dụng: Protein hiện diện khắp nơi trong đời sống: Dinh dưỡng (thịt, cá, trứng, sữa); Y dược (vaccine, kháng thể IgG, hormone insulin); Công nghiệp dệt may (tơ tằm fibroin, len cừu keratin); Mỹ phẩm (collagen dưỡng da, keratin phục hồi tóc móng).",
        fillInBlanks: {
            text: "• Khái niệm Enzyme:\n  - Enzyme là chất [[b1]] sinh học, hầu hết có bản chất là [[b2]].\n  - Đặc tính: Tính chọn lọc rất [[b3]] (chìa khoá - ổ khoá), làm tăng tốc độ phản ứng lên hàng triệu lần ở điều kiện [[b4]] (thân nhiệt, pH sinh lý).\n• Ứng dụng của protein:\n  - Dinh dưỡng: Nguồn cung cấp [[b5]] thiết yếu cho cơ thể.\n  - Y dược: Sản xuất [[b6]] phòng bệnh, kháng thể IgG, insulin điều trị tiểu đường.\n  - Dệt may: Tơ tằm ([[b7]]), len cừu ([[b8]]).\n  - Mỹ phẩm: [[b9]] giúp đàn hồi da, chăm sóc tóc móng.",
            blanks: [
                { id: "b1", answer: "xúc tác", options: ["xúc tác", "hòa tan", "đốt cháy", "tạo màu"], hint: "Làm tăng tốc độ phản ứng sinh hóa" },
                { id: "b2", answer: "protein", options: ["protein", "lipit", "tinh bột", "kim loại"], hint: "Đại đa số enzyme được cấu tạo từ chuỗi polypeptide" },
                { id: "b3", answer: "cao", options: ["cao", "thấp", "ngẫu nhiên", "không có"], hint: "Mỗi enzyme chỉ tác động lên cơ chất nhất định" },
                { id: "b4", answer: "êm dịu", options: ["êm dịu", "khắc nghiệt", "nhiệt độ 500°C", "áp suất cao"], hint: "Nhiệt độ cơ thể 37°C và pH sinh lí" },
                { id: "b5", answer: "amino acid", options: ["amino acid", "đường glucose", "vitamin C", "muối ăn"], hint: "Các acid amin thiết yếu cơ thể không tự tổng hợp được" },
                { id: "b6", answer: "vaccine", options: ["vaccine", "xà phòng", "nhựa PE", "xăng dầu"], hint: "Chế phẩm sinh học phòng ngừa dịch bệnh" },
                { id: "b7", answer: "fibroin", options: ["fibroin", "collagen", "albumin", "casein"], hint: "Protein chính của sợi tơ tằm" },
                { id: "b8", answer: "keratin", options: ["keratin", "insulin", "pepsin", "amylase"], hint: "Protein cấu trúc trong len cừu, tóc, móng" },
                { id: "b9", answer: "Collagen", options: ["Collagen", "Hemoglobin", "Fibroin", "Glutamic acid"], hint: "Protein chiếm 70% cấu trúc hạ bì da" }
            ]
        },
        experiment: {
            id: "exp_enzyme_selectivity",
            title: "Thí Nghiệm Khảo Sát Tính Đặc Hiệu Của Enzyme: Amylase vs Protease",
            description: "Thử enzyme Amylase và Protease trên dung dịch hồ tinh bột và lòng trắng trứng.",
            reagentOptions: [
                { id: "starch_amylase", name: "Ống 1: Hồ tinh bột + Men Amylase", icon: "🌾" },
                { id: "protein_amylase", name: "Ống 2: Lòng trắng trứng + Men Amylase", icon: "🥚" }
            ],
            simulationResult: {
                starch_amylase: {
                    visualState: "starch_hydrolyzed",
                    text: "Men Amylase nhanh chóng thủy phân hồ tinh bột thành đường maltose/glucose. Nhỏ iot vào không còn màu xanh tím.",
                    observation: "Amylase có tính chọn lọc cao, chuyên xúc tác thủy phân tinh bột."
                },
                protein_amylase: {
                    visualState: "protein_unchanged",
                    text: "Amylase không thể thủy phân lòng trắng trứng (protein). Phản ứng Biuret vẫn cho màu tím bình thường.",
                    observation: "Enzyme có tính chọn lọc cao, không tác dụng lên cơ chất khác loại."
                }
            },
            deduction: "TỰ SUY RA LÍ THUYẾT: Enzyme có tính đặc hiệu ổ khóa - chìa khóa: chỉ xúc tác cơ chất khớp đúng trung tâm hoạt động!"
        },
        quiz: [
            {
                q: "Phát biểu nào sau đây về enzyme là ĐÚNG nhất theo SGK Hóa học 12?",
                options: ["A. Mọi enzyme đều là chất vô cơ", "B. Hầu hết enzyme có bản chất là protein và có tính chọn lọc rất cao", "C. Enzyme hoạt động tốt nhất ở 100°C", "D. Một enzyme có thể xúc tác cho mọi phản ứng hóa học"],
                answer: 1,
                explain: "Enzyme là chất xúc tác sinh học hầu hết có bản chất là protein, có tính chọn lọc rất cao và xúc tác với tốc độ cực lớn ở điều kiện êm dịu."
            },
            {
                q: "Chất nào sau đây là thành phần protein chính của sợi tơ tằm tự nhiên?",
                options: ["A. Keratin", "B. Fibroin", "C. Collagen", "D. Albumin"],
                answer: 1,
                explain: "Tơ tằm tự nhiên có thành phần protein chính là Fibroin; còn tóc, móng, len cừu là Keratin."
            }
        ]
    },
    {
        id: "bai6_phanung_dongian",
        title: "Bài 6: Các Phản Ứng Đặc Trưng, Phổ Biến Đơn Giản",
        subTitle: "H2O2, Lên Men Rượu, Men Giấm & Thủy Phân Đường",
        badge: "THÍ NGHIỆM ĐẶC TRƯNG",
        icon: "🧪",
        speakerNotes: "Bài cuối cùng là 4 phản ứng phổ biến và gần gũi nhất trong chương trình: Thứ nhất, Phân hủy H2O2 bằng enzyme Catalase trong củ khoai tây sống làm sủi bọt khí O2 mãnh liệt; nếu khoai luộc chín thì enzyme biến tính không còn sủi bọt. Thứ hai, Lên men rượu: Glucose chuyển hoá thành cồn etylic và khí CO2 nhờ men rượu Zymase. Thứ ba, Lên men giấm: Rượu etylic loãng bị oxi hoá thành axit axetic (giấm ăn) nhờ men giấm vi khuẩn Acetobacter. Thứ tư, Thủy phân đường saccharose tạo hỗn hợp glucose và fructose nhờ enzyme Invertase hoặc axit. Thầy cô và các bạn hãy cùng click trải nghiệm các thí nghiệm mô phỏng dưới đây!",
        fillInBlanks: {
            text: "• 1. Phân hủy H₂O₂ (Nước oxy già):\n  - Lát khoai tây sống chứa enzyme [[b1]] xúc tác: 2H₂O₂ → 2H₂O + [[b2]]↑ (sủi bọt khí mãnh liệt).\n  - Lát khoai luộc chín: Enzyme bị [[b3]] nhiệt nên không sủi bọt.\n• 2. Lên men rượu: C₆H₁₂O₆ → 2[[b4]] + 2CO₂↑ (xúc tác men rượu zymase).\n• 3. Lên men giấm: C₂H₅OH + O₂ → [[b5]] + H₂O (xúc tác men giấm vi khuẩn).\n• 4. Thủy phân đường: Saccharose + H₂O → Glucose + [[b6]] (xúc tác invertase hoặc H⁺).",
            blanks: [
                { id: "b1", answer: "Catalase", options: ["Catalase", "Pepsin", "Amylase", "Lipase"], hint: "Enzyme phân giải peroxide có trong củ khoai tây sống, máu, gan" },
                { id: "b2", answer: "O2", options: ["O2", "CO2", "H2", "N2"], hint: "Khí oxy duy trì sự cháy làm que đóm bùng cháy" },
                { id: "b3", answer: "biến tính", options: ["biến tính", "tăng hoạt tính", "bay hơi", "đổi màu tím"], hint: "Nhiệt độ sôi làm enzyme mất cấu trúc không gian" },
                { id: "b4", answer: "C2H5OH", options: ["C2H5OH", "CH3COOH", "CH4", "C3H5(OH)3"], hint: "Công thức phân tử của rượu etylic (ethanol)" },
                { id: "b5", answer: "CH3COOH", options: ["CH3COOH", "HCOOH", "C2H5OH", "CH3CHO"], hint: "Axit axetic - thành phần chính của giấm ăn" },
                { id: "b6", answer: "Fructose", options: ["Fructose", "Galactose", "Maltose", "Cellulose"], hint: "Đường đồng phân với glucose có độ ngọt sắc trong mật ong" }
            ]
        },
        experiment: {
            id: "exp_potato_h2o2",
            title: "Thí Nghiệm Kinh Điển: Phân Hủy H2O2 Bằng Khoai Tây Sống vs Khoai Tây Luộc",
            description: "Thả lần lượt lát khoai tây sống và lát khoai tây luộc chín vào 2 ống nghiệm chứa H2O2.",
            reagentOptions: [
                { id: "raw_potato", name: "Ống 1: Khoai tây sống + H2O2", icon: "🥔" },
                { id: "boiled_potato", name: "Ống 2: Khoai tây luộc chín + H2O2", icon: "🍲" }
            ],
            simulationResult: {
                raw_potato: {
                    visualState: "h2o2_bubbling",
                    text: "Khí O2 sủi bọt trắng cuồn cuộn trào lên miệng ống nghiệm! Đưa tàn que đóm đỏ vào thì que đóm bùng cháy sáng.",
                    observation: "Catalase trong khoai tây sống xúc tác phân hủy cực nhanh H2O2 sinh ra khí O2."
                },
                boiled_potato: {
                    visualState: "h2o2_silent",
                    text: "Ống nghiệm hoàn toàn yên tĩnh, không hề có bọt khí thoát ra.",
                    observation: "Nhiệt độ sôi đã làm biến tính enzyme Catalase, chứng minh bản chất protein của enzyme!"
                }
            },
            deduction: "TỰ SUY RA LÍ THUYẾT: Enzyme Catalase có bản chất là protein: hoạt tính xúc tác mạnh ở điều kiện thường, bị phá hủy mất hoạt tính khi bị đun sôi (biến tính nhiệt)!"
        },
        quiz: [
            {
                q: "Vì sao khi nhỏ nước oxy già (H2O2) vào lát khoai tây sống thì có bọt khí sủi mạnh, còn vào lát khoai tây luộc chín thì không?",
                options: ["A. Khoai tây luộc chín bị hút hết nước", "B. Khoai tây sống chứa enzyme Catalase phân giải H2O2 thành O2; khi luộc chín enzyme bị biến tính mất hoạt tính", "C. Khoai tây sống chứa nhiều đường hơn", "D. Nước oxy già tác dụng với tinh bột"],
                answer: 1,
                explain: "Enzyme Catalase trong tế bào khoai tây sống xúc tác phân giải 2H2O2 -> 2H2O + O2. Khi luộc chín, nhiệt độ cao phá vỡ cấu trúc không gian của protein enzyme (biến tính nhiệt), làm enzyme mất hoàn toàn hoạt tính xúc tác."
            },
            {
                q: "Phương trình hóa học của quá trình lên men giấm từ rượu etylic là:",
                options: ["A. C2H5OH + O2 -> CH3COOH + H2O", "B. C6H12O6 -> 2C2H5OH + 2CO2", "C. CH3COOH + C2H5OH -> CH3COOC2H5 + H2O", "D. C2H4 + H2O -> C2H5OH"],
                answer: 0,
                explain: "Lên men giấm là quá trình oxy hóa rượu etylic loãng thành axit axetic nhờ men giấm vi khuẩn Acetobacter: C2H5OH + O2 -> CH3COOH + H2O."
            }
        ]
    }
];

/* =========================================================================
   8. BỘ ĐỀ KIỂM TRA TỔNG HỢP 12 CÂU CHUẨN THPT CHUYÊN HÙNG VƯƠNG & XẾP HẠNG
   ========================================================================= */
const EXAM_12H_DATA = [
    { id: "ex1", q: "Protein là hợp chất cao phân tử được cấu tạo từ một hay nhiều chuỗi polypeptide, mỗi chuỗi gồm các đơn vị nào liên kết với nhau?", options: ["A. Các phân tử glucose", "B. Các đơn vị α-amino acid liên kết qua liên kết peptide", "C. Các phân tử axit béo liên kết este", "D. Các nucleotide liên kết phosphodiester"], answer: 1, explain: "Protein được cấu tạo từ các chuỗi polypeptide gồm các đơn vị α-amino acid nối với nhau bằng liên kết peptide theo trật tự xác định." },
    { id: "ex2", q: "Protein nào sau đây thuộc loại protein đơn giản theo phân loại SGK?", options: ["A. Albumin (lòng trắng trứng)", "B. Hemoglobin (chứa nhóm heme mang Fe²⁺)", "C. Lipoprotein (kết hợp với lipid)", "D. Glycoprotein (kết hợp với carbohydrate)"], answer: 0, explain: "Albumin, fibroin, insulin là các protein đơn giản vì khi thủy phân hoàn toàn chỉ cho hỗn hợp các α-amino acid." },
    { id: "ex3", q: "Protein hình sợi (như keratin ở tóc móng, collagen ở da sụn) có đặc tính vật lí nào sau đây?", options: ["A. Tan tốt trong nước tạo dung dịch keo", "B. Không tan trong nước và các dung môi thông thường", "C. Dễ bay hơi ở nhiệt độ phòng", "D. Đổi màu tím trong nước cất"], answer: 1, explain: "Protein hình sợi không tan trong nước và các dung môi thông thường; protein hình cầu mới tan tạo dung dịch keo." },
    { id: "ex4", q: "Thủy phân hoàn toàn protein bởi acid, base hoặc enzyme, sản phẩm cuối cùng thu được là:", options: ["A. Hỗn hợp các α-amino acid (hoặc muối tương ứng)", "B. Chỉ thu được khí cacbonic và nước", "C. Các phân tử este no đơn chức", "D. Dung dịch keo màu tím"], answer: 0, explain: "Quá trình thủy phân: Protein -> polypeptide -> α-amino acid." },
    { id: "ex5", q: "Hiện tượng nào sau đây là do sự đông tụ protein dưới tác dụng của nhiệt độ cao?", options: ["A. Nấu canh cua, thịt cua nổi thành từng màng", "B. Hòa tan đường vào nước", "C. Nhỏ giấm vào bột đá vôi sủi bọt", "D. Thắp nến cháy sáng"], answer: 0, explain: "Nhiệt độ sôi làm biến tính và đông tụ protein cua, làm các chuỗi kết tụ lại thành từng mảng nổi lên mặt nước." },
    { id: "ex6", q: "Vì sao người bị ngộ độc muối kim loại nặng (Pb²⁺, Hg²⁺) được sơ cứu khẩn cấp bằng cách cho uống sữa tươi hoặc lòng trắng trứng sống?", options: ["A. Sữa tươi làm tăng axit dạ dày phân hủy kim loại", "B. Protein trong sữa tạo kết tủa với Pb²⁺, Hg²⁺, bao vây ion độc bảo vệ niêm mạc dạ dày", "C. Sữa làm tan chảy kim loại nặng", "D. Sữa diệt vi khuẩn đường ruột"], answer: 1, explain: "Protein phản ứng với ion kim loại nặng tạo kết tủa không tan, ngăn cản chì và thủy ngân ngấm vào máu." },
    { id: "ex7", q: "Cấu trúc bậc 1 của protein được duy trì bởi loại liên kết hóa học nào?", options: ["A. Liên kết hydrogen", "B. Liên kết peptide (-CO-NH-)", "C. Cầu disulfide (-S-S-)", "D. Tương tác kị nước"], answer: 1, explain: "Cấu trúc bậc 1 là trật tự sắp xếp các gốc α-amino acid trong chuỗi dãn thẳng, duy trì bởi liên kết peptide." },
    { id: "ex8", q: "Hiện tượng biến tính protein phá vỡ những bậc cấu trúc nào sau đây?", options: ["A. Phá vỡ bậc 2, 3, 4 nhưng KHÔNG phá vỡ bậc 1", "B. Phá vỡ bậc 1 tạo ra các amino acid riêng rẽ", "C. Phá vỡ tất cả 4 bậc cấu trúc", "D. Không phá vỡ bất kì liên kết nào"], answer: 0, explain: "Biến tính chỉ phá vỡ các liên kết yếu của cấu trúc không gian bậc 2, 3, 4; không phá vỡ liên kết peptide bậc 1." },
    { id: "ex9", q: "Tại điểm đẳng điện (pH = pI), protein có tính chất nào nổi bật?", options: ["A. Tan tốt nhất trong nước", "B. Ít tan nhất và dễ bị đông tụ nhất (như casein pI ≈ 4,6 đông tụ khi làm sữa chua)", "C. Luôn mang điện tích âm", "D. Bị bay hơi"], answer: 1, explain: "Tại pH = pI, phân tử có tổng điện tích bằng 0, độ tan nhỏ nhất nên dễ đông tụ nhất." },
    { id: "ex10", q: "Thuốc thử nào sau đây dùng để nhận biết protein bằng phản ứng màu Biuret?", options: ["A. Dung dịch AgNO3 trong NH3", "B. Cu(OH)2 trong môi trường kiềm (cho dung dịch màu tím đặc trưng)", "C. Nước brom (cho kết tủa trắng)", "D. Dung dịch Iot (cho màu xanh tím)"], answer: 1, explain: "Phản ứng màu Biuret dùng Cu(OH)2 trong môi trường kiềm tạo phức màu tím đặc trưng với protein và peptide (>= 2 liên kết peptide)." },
    { id: "ex11", q: "Nhỏ dung dịch HNO3 đặc vào lòng trắng trứng, hiện tượng quan sát được là:", options: ["A. Xuất hiện kết tủa màu vàng (phản ứng Xanthoproteic)", "B. Dung dịch chuyển sang màu xanh lam", "C. Xuất hiện khí mùi khai thoát ra", "D. Không có hiện tượng gì"], answer: 0, explain: "HNO3 đặc nitro hóa vòng benzen của các amino acid thơm tạo kết tủa vàng, đồng thời gây đông tụ acid." },
    { id: "ex12", q: "Khi nhỏ dung dịch nước oxy già (H2O2) vào lát khoai tây sống, hiện tượng sủi bọt khí mãnh liệt là do chất nào xúc tác?", options: ["A. Enzyme Catalase trong khoai tây phân hủy H2O2 thành H2O và O2", "B. Tinh bột trong khoai tây phản ứng với H2O2", "C. Khí CO2 bị đẩy ra ngoài", "D. Axit hữu cơ trong khoai tây"], answer: 0, explain: "Enzyme Catalase trong tế bào khoai tây sống xúc tác phản ứng 2H2O2 -> 2H2O + O2 sủi bọt khí O2 mãnh liệt." }
];

// Gắn toàn bộ dữ liệu vào global window để dùng thông suốt toàn app
window.PROTEIN_TYPES_THEORY = PROTEIN_TYPES_THEORY;
window.EXPERIMENTS_DETAILED_THEORY = EXPERIMENTS_DETAILED_THEORY;
window.THEORY_SUMMARY = THEORY_SUMMARY;
window.STUDY_TOPICS_DATA = STUDY_TOPICS_DATA;
window.PEPTIDE_SEGMENTS_PRESETS = PEPTIDE_SEGMENTS_PRESETS;
window.PRESENTATION_INTERACTIVE_QUESTIONS = PRESENTATION_INTERACTIVE_QUESTIONS;
window.PRESENTATION_12H_DATA = PRESENTATION_12H_DATA;
window.EXAM_12H_DATA = EXAM_12H_DATA;
