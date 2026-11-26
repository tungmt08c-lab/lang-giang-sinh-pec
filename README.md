# Làng Giáng Sinh PEC

Game web mùa Noel 2026 của Trung tâm Ngoại ngữ và Du học PEC: trẻ từ mẫu giáo đến lớp 8 trở lên đi qua 7 trạm trong một ngôi làng Noel, làm thử thách tiếng Anh để gom kẹo gậy và đổi quà thật tại 5 cơ sở PEC.

- Chạy chương trình: 14/12 – 25/12/2026
- Ngày hội Game Noel tại cơ sở: 19 – 20/12/2026

## Cấu trúc thư mục

| Đường dẫn | Nội dung |
| --- | --- |
| `index.html` | Toàn bộ game: giao diện, 3 trạm cấp Kids, vé, điểm, kẹo, bảng xếp hạng, đổi quà |
| `logo-pec.png` | Logo PEC |
| `assets/` | Hình do người thiết kế vẽ (nền, công trình, linh vật, biểu tượng…), tên file theo tài liệu yêu cầu thiết kế |
| `design/` | Ảnh khung bản đồ, ảnh bản hiện tại, tờ trình kế hoạch gửi BGĐ |

## Phân việc

| Người | Việc |
| --- | --- |
| Người thiết kế | Vẽ hình theo tài liệu "Yêu cầu thiết kế – Game Làng Giáng Sinh PEC", nộp vào thư mục Google Drive chung |
| Claude | Đưa hình vào `assets/`, ghép vào game, làm chuyển động, nối máy chủ |
| Người lập trình (nếu có) | Làm trên nhánh riêng, mở pull request vào `main` |
| PGĐ Kinh doanh | Duyệt hình và từng bản cập nhật |

## Quy ước

- Nhánh `main` là bản chạy thật; sửa đổi lớn làm trên nhánh riêng rồi gộp vào.
- Tên file hình viết thường, không dấu, nối bằng gạch ngang, đúng như danh sách trong tài liệu yêu cầu thiết kế.
- Không đưa lên kho: dữ liệu học viên, số điện thoại phụ huynh, mật khẩu, khóa API.

## Xem thử trên máy

Mở `index.html` bằng trình duyệt. Điểm và kẹo trong bản chạy thử lưu trên máy đang chơi; bảng xếp hạng đang dùng dữ liệu mẫu.

## Đưa lên mạng

Dự kiến dùng Cloudflare Pages giống Word Battle: nối kho này vào Cloudflare, mỗi lần nhánh `main` có thay đổi thì trang tự cập nhật.
