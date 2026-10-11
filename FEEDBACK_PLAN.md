# KẾ HOẠCH TỔNG HỢP & QUẢN LÝ YÊU CẦU DỰ ÁN PROTEINEXUS-12H
**Mã tài liệu:** `FEEDBACK_PLAN.md`  
**Cập nhật lần cuối:** 2026-10-10 23:55 (Giờ địa phương)  
**Tình trạng:** CHỜ DUYỆT TỪ NGƯỜI DÙNG (Awaiting User Approval - Không tự ý sửa code trước khi được phê duyệt)

---

## 1. BÁO CÁO RÀ SOÁT NGỮ CẢNH HỘI THOẠI & ĐỐI CHIẾU MÃ NGUỒN

### 1.1. Các phần ngữ cảnh đã rà soát và đối chiếu thành công
1. **Toàn bộ 4 lượt hội thoại từ đầu phiên làm việc đến hiện tại (Trích xuất từ `transcript.jsonl` và `transcript_full.jsonl`):**
   - **Lượt 1 (Step 0):** Yêu cầu triển khai link online, kiểm tra GitHub & Render deployment.
   - **Lượt 2 (Step 17):** Yêu cầu khóa chặn đăng nhập/đăng ký khi vào web, sửa banner PC giống điện thoại, sửa lỗi lệch giao diện khi click nút; yêu cầu tích hợp phiếu điền khuyết, bảng xếp hạng học sinh, bám sát tờ lí thuyết 3 trang của Thầy Thắng (THPT Chuyên Hùng Vương - Tổ Hóa Học - Trang 14-16), làm phần enzyme, ứng dụng và các phản ứng đặc trưng ($H_2O_2$ catalase, lên men rượu/giấm, thủy phân đường).
   - **Lượt 3 (Step 562):** Phản hồi về việc ấn vào mục học tập vẫn bị lệch giao diện và bảng đăng nhập không được có tùy chọn tắt, phải bắt buộc đăng nhập/đăng ký hoặc chọn khách mới được dùng tiếp.
   - **Lượt 4 (Step 856 - Hiện tại):** Góp ý chi tiết về giao diện PC 100% zoom, thuật ngữ khoa học IUPAC/GDPT 2018 (peptide, amino acid, liên kết hydrogen, không viết tắt), xóa hẳn lời dẫn thuyết minh, sửa lỗi câu hỏi điền khuyết (thiếu keratin, thiếu hemoglobin, lỗi rớt dấu chấm câu), đổi điền khuyết bài 6 thành dạng ngang, thêm tương tác cho thí nghiệm tính tan, sửa lỗi mất ảnh danh mục protein, chỉnh sửa thông tin thẻ protein và modal trích dẫn, xóa 3 trường sở thích vì quyền riêng tư.
2. **Toàn bộ 15 hình ảnh đính kèm trong thư mục `.user_uploaded`:**
   - `media_1791635597236.png`: Ảnh thanh menu Header và các tab điều hướng.
   - `media_1791635820317.png`: Bản scan Trang 14/16 (Khái niệm protein, chuỗi polypeptide, phân loại đơn giản/phức tạp, sợi/cầu, tính tan).
   - `media_1791635832672.png`: Bản scan Trang 15/16 (Thủy phân, đông tụ do nhiệt, acid, base, muối kim loại nặng $Pb^{2+}, Hg^{2+}$, ví dụ canh cua, giải độc chì).
   - `media_1791635846062.png`: Bản scan Trang 15-16/16 (Bảng 4 bậc cấu trúc và các liên kết peptide, hydrogen, kị nước, tĩnh điện, disulfide).
   - `media_1791635858510.png`: Bản scan Trang 16/16 (Biến tính phá vỡ bậc 2, 3, 4 giữ bậc 1; $pI$ casein; phản ứng Biuret, $HNO_3$ đặc; vai trò sinh học).
   - `media_1791642630199.png`: Ảnh chụp lỗi giao diện bị lệch trái (logo PROTEINEXUS bị cắt) và nút Đăng nhập hiển thị trơ trọi khi chưa khóa modal.
   - `media_1791647086735.png`: Tin nhắn học sinh (Uyên My) phàn nàn web ở zoom 100% bị to/tràn, phải thu nhỏ về 90% mới xem được full.
   - `media_1791647275790.png`: Ảnh lỗi dấu chấm câu `.` bị rớt xuống dòng riêng sau dropdown `phá vỡ`.
   - `media_1791647316586.png`: Ảnh câu điền khuyết bị viết tắt `ko tan` và thiếu chữ `keratin` ở vị trí tóc, móng.
   - `media_1791647507105.png`: Ảnh khối banner "LỜI DẪN THUYẾT MINH (BẠN ĐỌC KHI THUYẾT TRÌNH TRƯỚC LỚP)" mà người dùng yêu cầu xóa bỏ.
   - `media_1791647801995.png`: Ảnh khối "THỰC HIỆN THÍ NGHIỆM TRÊN WEB" chỉ có hình ống nghiệm tĩnh "MÔ PHỎNG ẢO" chưa có tương tác thực tế.
   - `media_1791647872950.png`: Ảnh cấu trúc câu điền khuyết bị ngắt dọc thành nhiều dòng, có dấu phẩy đầu dòng `, mỗi chuỗi...`.
   - `media_1791647930104.png`: Ảnh câu điền khuyết thiếu chữ `hemoglobin` trong cụm `ở máu, albumin ở lòng trắng trứng`.
   - `media_1791648389277.png`: Ảnh thiết kế mẫu Bài 6 dạng hàng ngang liền mạch: `- Lát khoai tây sống chứa enzyme [Catalase] xúc tác: 2H2O2 -> 2H2O + [O2] ↑ (sủi bọt khí mãnh liệt).`
   - `media_1791649874449.png`: Ảnh mẫu thiết kế góc phải header (xếp tầng hoặc co gọn nút Siêu Mượt và Tài Khoản để menu thông thoáng).

### 1.2. Những phần ngữ cảnh không còn truy cập được (hoặc đã bị tóm tắt)
- Các lượt hội thoại trung gian giữa Step 17 và Step 562 đã được tóm tắt (compacted) trong bản lưu của hệ thống. Tuy nhiên, toàn bộ mã nguồn thực tế và tệp log lịch sử đều còn nguyên vẹn 100%, không bị mất bất kỳ yêu cầu kĩ thuật hay tài liệu nào.

---

## 2. BẢNG TỔNG HỢP DANH MỤC TASK VÀ TRẠNG THÁI HIỆN TẠI

Phân loại trạng thái:
- `COMPLETED_VERIFIED`: Đã hoàn thành, đã kiểm tra thực tế và vượt qua toàn bộ test tự động.
- `PARTIALLY_COMPLETED`: Đã triển khai một phần nhưng cần nâng cấp theo phản hồi mới.
- `PENDING`: Yêu cầu mới nhận trong lượt này, chưa thực hiện.
- `BUGGY_REGRESSION`: Phát hiện lỗi hiển thị hoặc lỗi trải nghiệm người dùng cần khắc phục.
- `NEEDS_CONFIRMATION`: Yêu cầu có yếu tố kỹ thuật cần người dùng xác nhận giải pháp.

---

### NHÓM 1: HỆ THỐNG XÁC THỰC, KHÓA GIAO DIỆN & BẢO MẬT (AUTH GATE & PRIVACY)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **AUTH-01** | Bắt buộc bảng đăng nhập/đăng ký hiển thị ngay khi mở web; người dùng không thể đóng bằng phím ESC, click ngoài hay nút `×`. | `COMPLETED_VERIFIED` | Đã cấu hình trong `study-addon.js` & `study-addon.css`: Ẩn nút `closeAuth`, chặn sự kiện `cancel`, tự động mở lại nếu bị đóng ngầm. |
| **AUTH-02** | Cung cấp 3 lựa chọn đăng nhập để vào web: Đăng nhập tài khoản, Đăng ký mới, hoặc nút bấm 1-click "Vào học nhanh với vai trò Khách". | `COMPLETED_VERIFIED` | Đã hoàn thành nút `#quickGuestBtn` màu neon, tự động sinh tài khoản khách ngẫu nhiên và lưu session cookie ngay lập tức. |
| **AUTH-03** | Khắc phục vấn đề sau khi đăng xuất thì giao diện phải khóa lại ngay lập tức. | `COMPLETED_VERIFIED` | Đã tích hợp gọi `showAuth('login')` ngay khi người dùng bấm nút "Thoát". |
| **AUTH-04** | **Xóa 3 trường hỏi sở thích (`hobby1`, `hobby2`, `hobby3`) trong form Đăng ký / Khôi phục mật khẩu để bảo vệ quyền riêng tư.** | `NEEDS_CONFIRMATION` | **Chưa thực hiện.** Cần xử lý cẩn thận vì bộ test tự động `tests/ui.cjs` có lệnh điền vào 3 ô này. (Xem chi tiết ở Mục 3). |

---

### NHÓM 2: GIAO DIỆN PC, CHỐNG LỆCH TRANG & CO GIÃN 100% ZOOM (PC LAYOUT & RESPONSIVE)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **LAYOUT-01** | Triệt tiêu hoàn toàn lỗi lệch giao diện sang trái (mất logo PROTEINEXUS) khi bấm tab "Ôn Luyện & Bài Tập" hoặc các button khác. | `COMPLETED_VERIFIED` | Đã gỡ bỏ lệnh `b.scrollIntoView({ inline: 'center' })` và khóa cứng `window.scrollTo({ left: 0 })`, `overflow-x: hidden !important`. Đã push GitHub commit `dad03d8`. |
| **LAYOUT-02** | **Tối ưu màn hình máy tính hiển thị chuẩn ở tỉ lệ 100% Zoom (không bắt người dùng phải thu nhỏ 90% mới nhìn full).** | `PENDING` | Dựa trên phản hồi học sinh (ảnh `media_1791647086735.png`): Cần giảm bớt padding/margin quá cỡ của các container, tối ưu layout grid để hiển thị trọn vẹn ở 100% zoom trên độ phân giải laptop 1366x768 & 1920x1080. |
| **LAYOUT-03** | **Bố trí lại góc phải Header (Nút "Siêu Mượt" & Badge Khách/Thoát) gọn gàng theo ảnh `media_1791649874449.png`.** | `PENDING` | Chuyển sang dạng xếp gọn (stacked hoặc co khoảng cách) để nhường không gian cho 7 tab điều hướng ở giữa, tránh menu bị chật chội. |
| **LAYOUT-04** | **Sửa lỗi rớt dòng chữ "Luyện tập & Đột phá điểm số Hóa 12" trong phần Bản đồ học tập trang chủ.** | `PENDING` | Đoạn text `.lmh-desc` bị rớt cụm "Luyện tập..." xuống một dòng riêng; cần căn chỉnh CSS/whitespace để hiển thị trên 1 dòng hoặc xuống dòng tự nhiên, đẹp mắt. |
| **LAYOUT-05** | **Khắc phục tình trạng chữ bị mờ và tràn viền trên màn hình máy tính.** | `PENDING` | Rà soát các text có hiệu ứng glow/shadow quá dày gây mờ chữ, tăng độ sắc nét tương phản và kiểm tra `word-break: break-word`, `overflow: hidden` chống tràn viền. |

---

### NHÓM 3: CHUẨN HÓA THUẬT NGỮ KHOA HỌC GDPT 2018 (NOMENCLATURE & STANDARDIZATION)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **TERM-01** | **Thay toàn bộ từ "peptit" thành "peptide".** | `PENDING` | Hiện tại trong `viewer3d.js`, `education-manager.js`, `app.js`, `index.html` còn tồn tại các từ "peptit", "dipeptit", "tripeptit", "polypeptit". Cần chuẩn hóa toàn bộ thành danh pháp quốc tế: `peptide`, `dipeptide`, `tripeptide`, `polypeptide`. |
| **TERM-02** | **Thay toàn bộ cụm "lk hydro" / "liên kết hydro" thành "liên kết hydrogen".** | `PENDING` | Chuẩn hóa theo chương trình GDPT 2018: không viết tắt "lk", dùng chuẩn "liên kết hydrogen". |
| **TERM-03** | **Thay toàn bộ "axit amin" / "amino axit" thành "amino acid".** | `PENDING` | Chuẩn hóa thành `amino acid` trên toàn bộ các tab và câu hỏi bài tập. |
| **TERM-04** | **Nghiêm cấm viết tắt trong toàn bộ nội dung bài giảng và đáp án.** | `PENDING` | Sửa các từ viết tắt: `ko tan` -> `không tan`, `lk` -> `liên kết`, `KT vàng` -> `kết tủa vàng`, `KL nặng` -> `kim loại nặng`. |
| **TERM-05** | **Đổi cách diễn đạt phản ứng Biuret: Thay vì ghi "Dương tính màu tím" thì ghi rõ "Có tham gia phản ứng màu Biuret".** | `PENDING` | Áp dụng ở các thẻ phân đoạn cấu trúc, modal chi tiết và kết luận thí nghiệm: "Có tham gia phản ứng màu Biuret" (hoặc "Không tham gia phản ứng màu Biuret"). |

---

### NHÓM 4: LỌC BỎ LỜI DẪN THUYẾT MINH & SỬA LỖI ĐIỀN KHUYẾT (CONTENT & FILL-IN-THE-BLANK)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **CONT-01** | **Xóa bỏ hoàn toàn khối banner "LỜI DẪN THUYẾT MINH (BẠN ĐỌC KHI THUYẾT TRÌNH TRƯỚC LỚP)" trên web.** | `PENDING` | Theo phản hồi trực tiếp (ảnh `media_1791647507105.png`): Đây là điều cấm kị trên giao diện người dùng web, cần gỡ bỏ triệt để. |
| **CONT-02** | **Đổi tên tiểu mục `🎤 Thuyết Trình & Điền Khuyết (Đề Thầy Phát)` thành tên khoa học, trang trọng hơn.** | `NEEDS_CONFIRMATION` | Đổi sang tên phù hợp cho ứng dụng học tập, ví dụ: `📖 Chuyên Đề Trọng Tâm & Điền Khuyết` hoặc `🔬 Lí Thuyết Cốt Lõi & Tương Tác 12H`. |
| **CONT-03** | **Sửa lỗi câu điền khuyết Protein hình sợi: Thêm lại chữ `keratin` ở vị trí tóc, móng.** | `BUGGY_REGRESSION` | Trong code hiện tại, ô điền khuyết đã đè mất chữ `keratin`, dẫn đến câu bị sai ngữ nghĩa: `Protein hình sợi ([ko tan] ở tóc, móng...)`. Phải sửa thành: `Protein hình sợi (keratin ở tóc, móng; collagen ở da, sụn) không tan trong nước...` (đối chiếu scan Trang 14). |
| **CONT-04** | **Sửa lỗi câu điền khuyết Protein hình cầu: Thêm lại chữ `hemoglobin` ở vị trí máu.** | `BUGGY_REGRESSION` | Sửa lại đúng cấu trúc chuẩn SGK: `protein hình cầu (hemoglobin ở máu, albumin ở lòng trắng trứng) tan được trong nước tạo dung dịch keo` (đối chiếu scan Trang 14). |
| **CONT-05** | **Sửa lỗi dấu chấm câu `.` bị rớt xuống dòng riêng dưới ô chọn dropdown (ảnh `media_1791647275790.png`).** | `BUGGY_REGRESSION` | Chuyển dropdown select thành phần tử inline (`display: inline-flex; vertical-align: middle;`) để dấu chấm câu gắn liền mạch vào cuối câu, không bị ngắt dòng đơn độc. |
| **CONT-06** | **Chuyển phiếu điền khuyết Bài 6 (Enzyme & phản ứng $H_2O_2$) và các câu tương tự từ dạng dọc sang dạng hàng ngang (ảnh `media_1791648389277.png`).** | `PENDING` | Hiển thị trọn vẹn trên cùng một dòng ngang liền mạch: `- Lát khoai tây sống chứa enzyme [Catalase ▼] xúc tác: 2H2O2 -> 2H2O + [O2 ▼] ↑ (sủi bọt khí mãnh liệt).` |
| **CONT-07** | **Xóa dấu phẩy `,` thừa ở đầu dòng đầu tiên trong phiếu điền khuyết (ảnh `media_1791647872950.png`).** | `BUGGY_REGRESSION` | Dòng đầu tiên hiện đang bị hiển thị lỗi `, mỗi chuỗi gồm các đơn vị...` do cắt chuỗi template chưa chuẩn. |

---

### NHÓM 5: NÂNG CẤP THÍ NGHIỆM ẢO TƯƠNG TÁC (INTERACTIVE EXPERIMENT SIMULATION)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **LAB-01** | Bổ sung thí nghiệm ảo đông tụ protein và phản ứng màu Biuret ở Tab 4 ("Thí Nghiệm Ảo"). | `COMPLETED_VERIFIED` | Đã có sẵn trong `virtual-lab.js` với mô phỏng quang phổ và đổi màu ống nghiệm. |
| **LAB-02** | **Xây dựng tương tác trực tiếp cho thí nghiệm Khảo sát tính tan (Sợi tóc Keratin vs Lòng trắng trứng Albumin) trong phần Lí thuyết chuyên đề (ảnh `media_1791647801995.png`).** | `PENDING` | Người dùng phản hồi: "thí nghiệm nhưng k có thí nghiệm nào hết v??". Cần bổ sung các nút tương tác: "Thả sợi tóc vào cốc 1", "Nhỏ lòng trắng trứng vào cốc 2", nút "Khuấy nhẹ" và hiệu ứng diễn hoạt (sợi tóc không tan chìm/nổi, lòng trắng trứng khuấy tan tạo dung dịch keo). |

---

### NHÓM 6: TINH CHỈNH THẺ PROTEIN & SỔ TAY LÍ THUYẾT (PROTEIN CATALOG & MODAL)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **CAT-01** | **Khắc phục lỗi "Sổ tay lý thuyết, danh mục protein, ấn vào mất ảnh nè".** | `BUGGY_REGRESSION` | Kiểm tra lại hàm `openProteinTheoryDetailModal` và `renderProteinTheoryList`: đảm bảo sơ đồ cấu tạo 2D SVG và ảnh minh họa được render đầy đủ, không bị ghi đè rỗng hoặc mất dữ liệu khi mở modal. |
| **CAT-02** | **Đổi chữ "Dẫn chứng" trên thẻ protein thành chữ "Đọc thêm".** | `PENDING` | Sửa nút `.btn-card-detail` trong `app.js` từ "Dẫn Chứng" thành "Đọc thêm". |
| **CAT-03** | **Xóa dòng "Phương pháp: X-ray / Cryo-EM" trên các thẻ protein.** | `PENDING` | Gỡ bỏ dòng thông số phương pháp thực nghiệm khỏi thẻ hiển thị trong Kho Protein theo đúng yêu cầu người dùng. |
| **CAT-04** | **Đảo thứ tự trong modal chi tiết protein: Đưa "Vai Trò Sinh Học" và "Ý Nghĩa Lâm Sàng" lên đầu tiên; chuyển "Trích Dẫn Khoa Học" xuống dưới cùng.** | `PENDING` | Cấu trúc lại thứ tự các khối trong `openProteinDetailModal` (`app.js`) để người học ưu tiên nắm bắt kiến thức sinh học trước, tài liệu tham khảo khoa học chuyển xuống cuối. |
| **CAT-05** | **Tăng kích thước font chữ của tab "Ôn Luyện & Bài Tập" và "Sổ Tay Lí Thuyết" cho to rõ ngang tầm tab "Kho Protein" để tiện trình chiếu.** | `PENDING` | Tinh chỉnh CSS kích thước chữ, tiêu đề, nội dung câu hỏi và bảng biểu trong 2 tab này để lớp học nhìn từ xa trên máy chiếu vẫn đọc rõ ràng. |

---

### NHÓM 7: BẢN ĐỒ HỌC TẬP, ĐỀ THI 12 CÂU & BẢNG XẾP HẠNG (LEARNING MAP & EXAM LEADERBOARD)

| Task ID | Nội dung chi tiết | Trạng thái | Ghi chú & Đối chiếu mã nguồn |
| :--- | :--- | :---: | :--- |
| **EXAM-01** | Xây dựng đề thi tổng hợp 12 câu bám sát 100% đề thi của Thầy Thắng phát, có đồng hồ đếm ngược và chấm điểm tự động. | `COMPLETED_VERIFIED` | Đã tích hợp trong `education-data.js` & `education-manager.js`, lưu kết quả vào CSDL SQLite/libSQL. |
| **EXAM-02** | Bảng xếp hạng thi đua học sinh có thông tin Họ tên, Lớp, Số câu đúng, Điểm số, tự động cập nhật thời gian thực. | `COMPLETED_VERIFIED` | Đã hoàn thành bảng vàng xếp hạng Top điểm thi trong cả giao diện Sổ tay lí thuyết và Tab Học tập. |
| **EXAM-03** | Chức năng Phân loại lớp và Quản lý học sinh dành cho Giáo viên / Admin (Thầy Thắng & Khoa). | `COMPLETED_VERIFIED` | Đã hoàn thành API `admin/members`, duyệt chuyển lớp và phân quyền kiểm tra. |

---

## 3. CÁC CÂU HỎI & VẤN ĐỀ CẦN NGƯỜI DÙNG XÁC NHẬN

Trước khi tiến hành sửa mã nguồn, tôi cần bạn xác nhận 3 chi tiết sau để đảm bảo vừa đúng 100% ý bạn, vừa không làm hỏng bộ kiểm thử tự động của hệ thống:

1. **Về việc xóa 3 ô sở thích trong form Đăng ký (Task `AUTH-04`):**
   - *Vấn đề kỹ thuật:* Bộ test tự động của hệ sinh thái (`tests/ui.cjs`) có các câu lệnh Playwright tìm `input[name="hobby1"], input[name="hobby2"], input[name="hobby3"]` để điền dữ liệu mẫu kiểm thử. Nếu xóa bỏ hoàn toàn thẻ input khỏi mã HTML, bộ test tự động sẽ bị ngắt quãng và báo lỗi.
   - *Giải pháp đề xuất:* Tôi sẽ **ẩn hoàn toàn 3 trường này khỏi mắt người dùng** (`display: none !important`), đồng thời form đăng ký của học sinh bình thường chỉ hiển thị duy nhất trường Họ tên, Mật khẩu và Mã PIN khôi phục. Đối với hệ thống, giá trị sở thích sẽ tự động lấy mặc định theo mã PIN. Bạn có đồng ý với giải pháp ẩn triệt để này không?
2. **Về tên gọi mới cho mục `🎤 Thuyết Trình & Điền Khuyết (Đề Thầy Phát)` (Task `CONT-02`):**
   - Bạn yêu cầu đổi tên mục này để web nhìn chuyên nghiệp và không bị "lỏ".
   - *Đề xuất 1 (Khuyên dùng):* `📖 Chuyên Đề Cốt Lõi & Điền Khuyết 12H`
   - *Đề xuất 2:* `🔬 Lí Thuyết Trọng Tâm & Tương Tác 12H`
   - *Đề xuất 3:* `🎯 Bài Học Tương Tác & Điền Khuyết`  
   *Bạn chọn tên nào trong các tên trên (hoặc bạn có tên riêng nào khác muốn đặt)?*
3. **Về cách bố trí góc phải Header (Task `LAYOUT-03` theo ảnh `media_1791649874449.png`):**
   - Trong ảnh bạn gửi có 2 phương án:
     - Phương án A: Xếp 2 hàng (Nút `⚡ ⚡ Siêu Mượt` ở tầng trên, thông tin `Khách 1313 [Khách] Thoát` ở tầng dưới).
     - Phương án B: Để chung 1 hàng nhưng thu nhỏ kích thước viền và font chữ (compact inline).
   - *Đề xuất:* Áp dụng phương án A (xếp 2 tầng gọn gàng) ở màn hình máy tính có độ phân giải vừa phải/laptop để menu 7 tab ở giữa luôn rộng rãi nhất. Bạn có đồng ý không?

---
*(Kế hoạch đã được lưu vĩnh viễn vào tệp `FEEDBACK_PLAN.md` tại thư mục gốc. Tôi đã DỪNG LẠI và chờ bạn duyệt kế hoạch trước khi bắt đầu sửa code).*
