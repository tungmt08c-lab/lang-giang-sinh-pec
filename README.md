# Làng Giáng Sinh PEC

Game web mùa Noel 2026 của Trung tâm Ngoại ngữ và Du học PEC: trẻ từ mẫu giáo đến lớp 8 trở lên đi qua 7 trạm trong một ngôi làng Noel, làm thử thách tiếng Anh để gom kẹo gậy và đổi quà thật tại 5 cơ sở PEC.

- Chạy chương trình: 14/12 – 25/12/2026
- Ngày hội Game Noel tại cơ sở: 19 – 20/12/2026

## Cấu trúc thư mục

| Đường dẫn | Nội dung |
| --- | --- |
| `public/` | Phần được đưa lên mạng — chỉ để file của game ở đây |
| `public/index.html` | Toàn bộ game: giao diện, 3 trạm cấp Kids, vé, điểm, kẹo, bảng xếp hạng, đổi quà |
| `public/logo-pec.png` | Logo PEC |
| `public/assets/` | Hình do người thiết kế vẽ (nền, công trình, linh vật, biểu tượng…), tên file theo tài liệu yêu cầu thiết kế |
| `public/arena-5v5.js`, `public/arena-5v5.css`, `public/data/arena-5v5-config.json` | Trạm 7 Đấu trường Bông tuyết 5vs5: sảnh chọn con giáp, trận 10 lượt với 9 bạn máy, kỹ năng, hoạt cảnh thắng, giấy chứng nhận. Kho câu hỏi và luật trong file cấu hình |
| `public/audio/` | 78 file phát âm tiếng Anh, tên file = câu viết thường nối gạch ngang |
| `public/quay/` | Trang quầy đổi quà cho lễ tân: tra mã, xác nhận đã trao quà |
| `public/quantri/` | Trang theo dõi: số đăng ký, lượt chơi, đổi quà, lượt bất thường, tải danh sách phụ huynh |
| `functions/api/` | Máy chủ (Cloudflare Pages Functions + cơ sở dữ liệu D1): đăng ký, vé, điểm, kẹo, xếp hạng, mã đổi quà |
| `design/mockups-5v5/`, `design/dac-ta-dau-truong-5vs5.md` | Bản vẽ tham chiếu và đặc tả Đấu trường 5vs5 (nội bộ) |
| `design/` | Tài liệu nội bộ, không đưa lên mạng: ảnh khung bản đồ, ảnh bản hiện tại, tờ trình kế hoạch gửi BGĐ |

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

Mở `public/index.html` bằng trình duyệt: game tự chạy chế độ cục bộ (điểm lưu trên máy, bảng xếp hạng dữ liệu mẫu).

Chạy kèm máy chủ: `npx wrangler pages dev public --d1 DB --binding STAFF_KEY=... ADMIN_KEY=...` rồi mở http://localhost:8788. Game dò `/api/ping`, có máy chủ thì lưu điểm thật.

## Máy chủ

| Việc | Cách làm |
| --- | --- |
| Đăng ký | Phụ huynh nhập tên gọi, cấp, trường, cơ sở, số điện thoại, đánh dấu đồng ý. Mỗi số tối đa 3 bé. Bé nhận mã 6 ký tự để vào lại trên máy khác |
| Vé | 5 vé/ngày theo giờ Việt Nam; hộp quà ngày +1 vé +50 điểm; nhóm Zalo +2 vé (1 lần); mã bạn mời +1 vé cho cả hai |
| Chấm điểm | Máy chủ trừ vé khi bắt đầu lượt, giới hạn 100 điểm/lượt, 20 kẹo/ngày, đối chiếu điểm với số kẹo, gắn cờ lượt nhanh bất thường |
| Thưởng | Chuỗi 3 ngày +100, 7 ngày +300; top 3 Ngôi sao hôm nay mỗi cấp +5 kẹo (trao khi bé mở game hôm sau) |
| Đổi quà | 60 / 120 / 200 kẹo ra mã `PEC-XXXXX`; lễ tân tra mã ở `/quay/` và bấm xác nhận đã trao |
| Bảo mật | Bảng xếp hạng chỉ hiện tên gọi và trường; số điện thoại chỉ có trong file CSV ở trang `/quantri/`; quầy chỉ thấy 3 số cuối |

Bảng dữ liệu tự tạo ở lần gọi đầu tiên.

## Cài đặt trên Cloudflare (một lần)

1. Workers & Pages → D1 → tạo cơ sở dữ liệu `lang-giang-sinh-pec`.
2. Dự án Pages `lang-giang-sinh-pec` → Settings → Bindings → thêm D1, tên biến `DB`, chọn cơ sở dữ liệu vừa tạo.
3. Settings → Variables and Secrets → thêm 2 biến loại Secret: `STAFF_KEY` (đưa cho lễ tân 5 cơ sở) và `ADMIN_KEY` (chỉ người quản lý giữ). Mỗi khóa dài từ 16 ký tự trở lên.
4. Triển khai lại bản mới nhất (Deployments → Retry deployment) để nhận cài đặt.

Chưa gắn D1 thì game vẫn chạy chế độ cục bộ như bản chạy thử.

## Đưa lên mạng

Game chạy trên Cloudflare Pages, dự án `lang-giang-sinh-pec`, địa chỉ https://lang-giang-sinh-pec.pages.dev. Mỗi lần nhánh `main` có thay đổi, Cloudflare tự triển khai lại thư mục `public/` (không có bước build). Tài liệu nội bộ để ngoài `public/` nên không lên mạng.
