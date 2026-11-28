MONTER — WEBSITE KHO GAME & KEY

CÁCH DÙNG
1. Giải nén MONTER-website.zip.
2. Mở app.js bằng trình soạn thảo code.
3. Tìm mảng `const products = [...]`.
4. Mỗi sản phẩm có:
   - name: tên gói
   - game: PUBG Mobile / Free Fire / Liên Quân / Game khác
   - icon: emoji minh họa
   - stock: số key hiển thị
   - directUrl: link trực tiếp
   - keyUrl: link lấy key (đường dẫn đến hệ thống vượt link của bạn)
   - ipaUrl: link IPA
5. Thay dấu # bằng URL thật. Lưu ý đặt URL trong dấu nháy kép.
6. Mở index.html để xem thử hoặc tải cả thư mục lên dịch vụ hosting tĩnh.

LƯU Ý QUAN TRỌNG
- Đây là bản giao diện frontend tĩnh. Nút chỉ hoạt động khi bạn điền URL thật.
- Chức năng lấy key tự động, xác minh vượt link, kho key chống cấp trùng và trang quản trị chưa được kết nối backend trong bản này.
- Không đặt danh sách key bí mật, mật khẩu hay API secret trong app.js vì người truy cập có thể xem mã nguồn.
- Để làm cấp key thật cần backend/API và cơ sở dữ liệu riêng.
