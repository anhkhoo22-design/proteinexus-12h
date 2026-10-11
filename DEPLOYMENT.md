# Đưa Proteinexus lên Internet miễn phí

Bản làm việc nằm tại D:\Projects\Proteinexus. Giao diện và các tài nguyên 3D/2D được giữ nguyên; máy chủ hỗ trợ dữ liệu Turso lưu độc lập khỏi Render.

## Dịch vụ

- GitHub: kho riêng proteinexus-12h, chứa mã nguồn, không chứa dữ liệu tài khoản hoặc mã bí mật.
- Turso: cơ sở dữ liệu libSQL proteinexus-12h, gói Free, khu vực Tokyo. Không bật Overages hoặc nâng cấp gói trả phí.
- Render: Web Service Node, gói Free, khu vực Singapore, đường dẫn HTTPS *.onrender.com.

Dịch vụ vẫn truy cập được khi máy cá nhân tắt. Render Free nghỉ sau 15 phút không có truy cập; lần mở tiếp theo có thể phải chờ khoảng một phút. Tài khoản, điểm, câu hỏi và ghi chú giữ trên Turso khi Render nghỉ hoặc triển khai lại.

## Triển khai

1. Đưa toàn bộ mã nguồn của bản phát hành lên kho GitHub riêng. Không tải data, LOCAL-ADMIN.md, .env, .tmp hoặc node_modules lên GitHub.
2. Tạo cơ sở dữ liệu libSQL trên Turso và mã đọc/ghi dành riêng cho database đó. Giữ gói miễn phí.
3. Trên Render, tạo Web Service từ kho GitHub này. Runtime Node; Build: npm ci --omit=dev --omit=optional --ignore-scripts; Start: npm start; Instance: Free; Region: Singapore.
4. Đặt NODE_ENV=production, TURSO_DATABASE_URL và TURSO_AUTH_TOKEN ở Environment. Thêm TEACHER_ACTIVATION_CODE và OWNER_ACTIVATION_CODE bằng chuỗi ngẫu nhiên riêng. Hoặc tạo Blueprint từ render.yaml để Render sinh hai mã kích hoạt.
5. Đặt Health Check Path là /api/health. Web tự tạo cấu trúc dữ liệu và thêm 48 câu hỏi còn thiếu; không ghi đè dữ liệu cũ.
6. Chỉ báo web đã trực tuyến khi Render hiển thị Live và đường dẫn HTTPS mở được từ Internet. Kiểm tra /api/health, tài nguyên 3D, đăng ký và đăng nhập trên máy khác.

Mã Turso và mã kích hoạt phải chỉ nằm trên máy chủ. Học sinh không được nhận mã Turso. Nếu đã có tài khoản tại máy chủ cũ, phải nhập dữ liệu có kiểm soát trước khi dùng cloud. Bản local hiện tại chưa có tài khoản hay bài làm; không cần di chuyển tài khoản.

## Kiểm tra đã chuẩn bị

- npm test: đăng ký, đăng nhập, reset, chấm bài, phân quyền, tên không trùng và chống truy cập tệp riêng.
- npm run test:preserve: đối chiếu giao diện, thư viện và 3D/2D với bản gốc.
- npm run test:cloud: dùng SDK libSQL HTTP thật với database kiểm thử; kiểm tra dữ liệu, phiên và điểm vẫn còn sau khi khởi động lại máy chủ và xóa dữ liệu tạm, cookie HTTPS và giao dịch rollback.

Chạy local không có biến TURSO vẫn dùng SQLite tại data. Khi chạy Render, chương trình từ chối khởi động nếu thiếu TURSO để tránh mất dữ liệu do lưu tạm.

## Nguồn

- https://render.com/docs/free
- https://render.com/docs/deploy-node-express-app
- https://turso.tech/pricing
- https://docs.turso.tech/sdk/ts/reference

## Website ?? xu?t b?n

https://proteinexus-12h.onrender.com ? Render Live ng?y 10/10/2026. ?? x?c nh?n k?t n?i Turso, 23 t?p c?ng khai, m? h?nh 3D v? bi?u m?u t?i kho?n qua Internet.

Hai m? quy?n bi?n so?n/qu?n tr? n?m trong Render Environment; b?n ph?t h?nh kh?ng ch?a ch?ng.
