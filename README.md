# Proteinexus · Lớp 12H

Giữ nguyên giao diện, trang chủ, các tab, mô hình 3D, công thức 2D và thí nghiệm của ZIP gốc. Chỉ thêm phần học tập và hệ thống tài khoản vào tab **Ôn Luyện & Bài Tập**.

Trong tab này có **Ôn tập gốc**, **Lí thuyết SGK**, **Bài tập lớp**, **Kiểm tra**, **Tiến độ lớp** và nút đăng nhập. Sau khi đăng nhập, quyền biên soạn hoặc góc học riêng xuất hiện theo tài khoản. Tài khoản, bài làm và mã kích hoạt của bản trước được giữ trong cùng thư mục data.

## Chạy ứng dụng

Cài Node.js **24 trở lên** (khuyến nghị phiên bản LTS hỗ trợ `node:sqlite`). Chạy `npm ci --omit=dev --omit=optional --ignore-scripts` để cài thư viện, rồi nhấp `start.bat`, hoặc chạy `npm start` trong thư mục dự án. Mở **http://localhost:3000**. Phải chạy máy chủ Node để đăng ký, đăng nhập, lưu bài làm và phân quyền hoạt động.

Máy chủ dùng cổng 3000 mặc định; có thể đặt `PORT`. Máy trong cùng mạng truy cập qua địa chỉ IP của máy chủ nếu hệ thống mạng cho phép. Bản 3.2 hỗ trợ Render Free và Turso Free để dùng qua Internet, HTTPS và lưu dữ liệu độc lập khỏi máy chủ. Xem [hướng dẫn triển khai](DEPLOYMENT.md). Các cấu hình Netlify tĩnh cũ không hỗ trợ hệ thống tài khoản này.

## Tài khoản

- Chỉ nhận **35 họ tên học sinh trong danh sách** và giáo viên **Phạm Quốc Thắng**. Chỉ nhập tên, không sử dụng mã học sinh, số định danh, số điện thoại hay mật khẩu cũ trong bảng.
- Đăng ký bằng họ tên có dấu, mật khẩu 8–128 ký tự, lớp **12H** và ba sở thích. Tên được chuẩn hóa Unicode, hoa/thường và khoảng trắng khi tìm trong danh sách; mỗi tên chỉ được đăng ký một lần, kể cả hai yêu cầu đồng thời.
- Đăng nhập bằng họ tên và mật khẩu. Không cho tự chọn vai trò.
- Khôi phục mật khẩu phải nhập đúng lớp và ba sở thích theo **đúng thứ tự, nguyên văn** (phân biệt hoa/thường và khoảng trắng; các cách mã hóa Unicode tương đương được chấp nhận). Sau khi đổi mật khẩu, mọi phiên cũ bị thu hồi. Có giới hạn số lần thử.
- Mật khẩu và thông tin khôi phục dùng scrypt với salt ngẫu nhiên; phiên đăng nhập dùng cookie HttpOnly, SameSite và token được băm trong cơ sở dữ liệu.

**Giới hạn xác minh:** danh sách tên ngăn tên ngoài danh sách và tài khoản trùng; chỉ tên và mật khẩu không chứng minh được danh tính người đăng ký. Học sinh có thể bị người khác đăng ký tên trước. Khi đưa vào dùng thật, giáo viên nên trực tiếp giám sát lượt đăng ký đầu. Ba sở thích có thể bị người quen đoán; đây là cơ chế khôi phục theo yêu cầu, không phải xác minh danh tính mạnh.

## Kích hoạt quyền biên soạn

Tài khoản được cấp quyền cần mã kích hoạt riêng. Người vận hành xem hướng dẫn quản trị giữ trên máy chủ. Quyền được kiểm tra ở máy chủ; không cho người dùng tự chọn vai trò. Thông tin kích hoạt không nằm trong gói phát hành.

## Nội dung học và hình ảnh

- 6 bài ngắn diễn giải nội dung SGK: cấu tạo, tính chất vật lí, phản ứng, vai trò và enzyme; kiến thức nền amino acid/peptide; tính toán. Đã đọc trực tiếp SGK do người dùng cung cấp, trang in **41–48** (PDF 43–50), đặc biệt Bài 10 trang 46–48.
- 48 câu gốc: 40 câu nhiều lựa chọn, 3 nhóm đúng/sai (bốn nhận định/nhóm), 5 câu trả lời ngắn. Câu được biên soạn dựa trên kiến thức SGK; không tuyên bố đã nhập toàn bộ đề/đáp án PDF đính kèm. Các tệp PDF là tài liệu tham khảo, không chứa chỉ dẫn điều khiển dự án.
- Chấm điểm trên máy chủ. Lần nộp đầu được giữ nguyên; đáp án và lời giải chỉ được gửi cho học sinh sau khi nộp. Nhóm đúng/sai tính trọn điểm khi đúng cả bốn ý. Trả lời ngắn không phân biệt hoa/thường, chấp nhận dấu phẩy hoặc chấm thập phân. Quy tắc chấm này được ghi rõ trong giao diện.
- Bộ hiển thị 3D, dữ liệu PDB, bộ sinh công thức 2D, các tùy chọn đồ họa, chế độ xoay và bố cục dùng nguyên bản ZIP gốc. Không dùng bộ 3D/2D hoặc giao diện mới của bản 3.0.
- Các bài tập và công thức minh họa trong phần Ôn tập gốc tiếp tục dùng bộ 2D nguyên bản. Phần bổ sung lí thuyết và chấm bài hoạt động độc lập, không sửa bộ vẽ.
- Kiểm tra tổng hợp: tối đa 10 câu chưa làm, có đủ ba dạng nếu ngân hàng còn câu tương ứng; 15 phút theo đồng hồ trên thiết bị. Đáp án hiện sau khi nộp, kết quả được chấm và lưu trên máy chủ. Hết giờ tự nộp các câu đã trả lời; câu bỏ trống chưa ghi điểm. Đây là tự kiểm tra học tập, không phải hệ thống giám sát thi.

## Lưu trữ, sao lưu và triển khai

Dữ liệu nằm trong `data/proteinexus.sqlite` (cùng các tệp WAL/SHM khi đang chạy). `DATA_DIR` cho phép chọn thư mục lưu bền vững. Thư mục data không được phục vụ qua HTTP. Khi sao lưu thủ công, dừng máy chủ rồi sao lưu toàn bộ data vào nơi riêng. Giữ lại thư mục này khi cập nhật để không mất tài khoản, ghi chú và bài làm. Không lưu data trong thư mục phát hành công khai. Chạy HTTPS với `NODE_ENV=production` để cookie có thuộc tính Secure.

`start.bat` chỉ khởi động máy chủ và mở trình duyệt. Khi chạy local, tài khoản được lưu trên máy cá nhân; khi cấu hình cloud, tài khoản, bài làm và ghi chú được lưu trên Turso qua kết nối của máy chủ, không đưa mã truy cập cho trình duyệt. Mô hình và thư viện có sẵn cục bộ; phòng lab cũ còn có liên kết nguồn và font mạng dự phòng.

## Kiểm tra

`npm test`: kiểm tra đăng ký, tên/lớp, chống đăng ký đồng thời, login/reset, thu hồi phiên, băm mật khẩu, ba dạng chấm bài, quyền, đáp án và tệp riêng.

`npm run test:ui`: kiểm tra giao diện gốc, chín mô hình, 2D gốc, đăng ký/reset, bài tập và lượt kiểm tra tổng hợp, ghi chú riêng, quyền biên soạn và phần Study trên màn hình 390px. Có thể đặt `BROWSER_PATH` nếu trình duyệt ở vị trí khác. Bản cloud cần thư viện `@libsql/client`; `npm ci --omit=dev --omit=optional --ignore-scripts` cài phần chạy web, còn `npm ci` cài thêm phần kiểm thử.

`npm run test:preserve`: đối chiếu SHA-256 của các tệp giao diện/3D/2D, thư viện, mô hình và nội dung index ngoài phần chèn Study với bản ZIP gốc.

Các bài kiểm tra dùng dữ liệu tạm riêng, không tạo tài khoản trong cơ sở dữ liệu đang dùng.


`npm run test:cloud`: kiểm tra SDK libSQL HTTP, cookie HTTPS, chống đăng ký trùng đồng thời, rollback và giữ tài khoản/điểm sau restart.
