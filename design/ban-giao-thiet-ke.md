# Bàn Giao Thiết Kế Giao Diện – Game Làng Giáng Sinh PEC

Trọn bộ **59 file thiết kế đồ họa (Đợt 1 + Đợt 2)**, **file gốc vector SVG** và **bản game xem thử đã ghép hình** đã được hoàn thiện tại thư mục dự án:
- Thư mục tổng: [lang-giang-sinh-pec](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec)
- File nén nộp Google Drive 1-click: [Game-Noel-PEC-Thiet-Ke.zip](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Game-Noel-PEC-Thiet-Ke.zip)
- Bản chạy thử giao diện mới trên trình duyệt: [index.html](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Preview-Game/index.html)

> [!TIP]
> Bạn có thể mở trực tiếp [Preview-Game/index.html](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Preview-Game/index.html) trên trình duyệt để trải nghiệm ngay bản đồ Làng Giáng Sinh, linh vật đổi biểu cảm, và cả 3 màn chơi với bộ đồ họa mới!

---

## 1. Bản Xem Trước Trực Quan (Showcase)

````carousel
![Tổng hợp toàn bộ tài nguyên giao diện Đợt 1 & Đợt 2](C:/Users/MSI/.gemini/antigravity/brain/74437f7e-66b4-4c11-92f5-2c60881291c8/showcase_all_assets_sheet.jpg)
<!-- slide -->
![Bản đồ Làng Giáng Sinh ghép thử 7 công trình đúng tọa độ chân đế](C:/Users/MSI/.gemini/antigravity/brain/74437f7e-66b4-4c11-92f5-2c60881291c8/showcase_map_with_7_stations.jpg)
<!-- slide -->
![Ảnh nền bản đồ sạch bg-map.jpg 1080×2628 px (không gắn sẵn 7 công trình)](C:/Users/MSI/.gemini/antigravity/brain/74437f7e-66b4-4c11-92f5-2c60881291c8/dot1_bg_map.jpg)
````

---

## 2. Kiểm Định Thông Số Kỹ Thuật & Quy Chuẩn Xuất File

> [!IMPORTANT]
> Mọi file đã được kiểm tra tự động đảm bảo đúng 100% quy chuẩn bàn giao cho Claude và PGĐ Kinh doanh duyệt:
> - **Kích thước ×3 sắc nét**: Đúng chính xác từng pixel theo bảng yêu cầu (`1080×2628`, `390×390`, `480×520`, `192×192`, `1080×1920`, `900×990`, `240×240`, `200×200`, `160×160`, `330×200`).
> - **Tách nền chống răng cưa**: Toàn bộ vật thể xuất PNG 32-bit trong suốt không viền trắng, chừa lề trống an toàn `>= 12 px`, viền nâu tím đậm `#3B1F2B` đồng bộ.
> - **Dung lượng tối ưu**: Tất cả file PNG đều `< 300 KB` (`8.5 KB – 283 KB`), tất cả ảnh nền JPG đều `< 1,5 MB` (`108 KB – 322 KB`).
> - **Bản quyền & Trẻ em**: Tuần lộc PEC sáng tác riêng dùng **mũi nâu đen `#3B1F2B`** (tuyệt đối không dùng mũi đỏ bản quyền), chỉ dùng từ tiếng Anh ngắn (`POST`), không dùng ảnh người thật.

### Đợt 1 — 16 File ([Dot-1](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1))

| Nhóm | File bàn giao | Kích thước | Điểm nhấn thiết kế |
| :--- | :--- | :---: | :--- |
| **Nền bản đồ** | [bg-map.jpg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/bg-map.jpg) | `1080 × 2628` | Trời đêm tím `#120A35 → #D0609A`, cực quang, trăng phải, lâu đài xưởng quà; chừa sạch vùng HUD `0–320 px` & hộp thoại `840×300 px`; đường đá `~66 px` đi đúng 7 điểm chân đế. |
| **3 Công trình mở** | [st-wrap.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/st-wrap.png), [st-tree.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/st-tree.png), [st-sled.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/st-sled.png) | `390 × 390` | Mái vảy tím kem đường, cây thông phủ tuyết, xe trượt tuần lộc mũi nâu đen; chân đế cách đáy `24 px` kèm bóng elip mờ. |
| **4 Biểu cảm Linh vật** | [mascot-hello.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/mascot-hello.png), [mascot-happy.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/mascot-happy.png), [mascot-think.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/mascot-think.png), [mascot-oops.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/mascot-oops.png) | `480 × 520` | Giữ nguyên 100% tạo hình Tuần Lộc PEC (mắt to, má hồng, mũi nâu đen, mũ Noel đỏ, khăn sọc đỏ trắng) qua 4 trạng thái. |
| **8 Biểu tượng UI** | [ic-ticket.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-ticket.png), [ic-star.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-star.png), [ic-candy.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-candy.png), [ic-gift.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-gift.png), [ic-trophy.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-trophy.png), [ic-bag.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-bag.png), [ic-heart.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-heart.png), [ic-sleigh.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-1/ic-sleigh.png) | `192 × 192` | Khối tròn mập bóng như kẹo/nhựa, chiếm ~80% khung, rõ nét ngay cả ở cỡ 32–48 px trên điện thoại. |

### Đợt 2 — 43 File ([Dot-2](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2))

| Nhóm | File bàn giao | Kích thước | Điểm nhấn thiết kế |
| :--- | :--- | :---: | :--- |
| **4 Công trình tiếp** | [st-snowman.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/st-snowman.png), [st-talk.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/st-talk.png), [st-letter.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/st-letter.png), [st-arena.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/st-arena.png) | `390 × 390` | Người tuyết mũ cao, sân khấu rèm đỏ micro vàng, bưu điện biển `POST`, sân băng cờ đỏ-xanh-vàng. |
| **3 Nền màn chơi** | [bg-wrap.jpg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/bg-wrap.jpg), [bg-tree.jpg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/bg-tree.jpg), [bg-sled.jpg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/bg-sled.jpg) | `1080 × 1920` | Tường gỗ kệ quà thoáng giữa, phòng khách tím lò sưởi ấm, đồi tuyết đêm có mặt tuyết đúng 1/5 dưới. |
| **Cây thông & Đồ treo** | [tree-big.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/tree-big.png), `orn-ball-*.png` (8), `orn-bell-*.png` (8), `orn-gift-*.png` (8), [orn-star.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/orn-star.png) | `900×990`, `192×192`, `240×240` | Cây thông có đèn ấm chưa gắn châu/sao; 24 món đồ treo chuẩn 8 màu tiếng Anh (`red, blue, yellow, green, pink, purple, orange, white`). |
| **Trạm Xe trượt** | `fall-gift-*.png` (5 màu), [fall-coal.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/fall-coal.png), [sled-player.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/sled-player.png) | `200×200`, `160×160`, `330×200` | Hộp quà rơi chừa sẵn khung trắng nửa dưới làm ô chữ từ vựng; xe trượt ngang chở bao quà. |
| **3 Quà đổi PEC** | [prize-pen.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/prize-pen.png), [prize-book.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/prize-book.png), [prize-bear.png](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/Dot-2/prize-bear.png) | `240 × 240` | Bút sao vàng, sổ bìa xanh Giáng Sinh, gấu bông đội mũ Noel thắt nơ xanh. |

### File Gốc Chỉnh Sửa & Giấy Phép ([File-Goc-SVG](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/File-Goc-SVG))
- [bg-map-layout-editable.svg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/File-Goc-SVG/bg-map-layout-editable.svg) — Khung bản đồ tách lớp Trời, Tuyết, Đường đá, Điểm chân đế (nhập trực tiếp vào Canva / Illustrator / Figma).
- [ui-icons-and-ornaments-master.svg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/File-Goc-SVG/ui-icons-and-ornaments-master.svg) & [stations-and-props-master.svg](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/File-Goc-SVG/stations-and-props-master.svg) — Vector gốc các biểu tượng, công trình và vật phẩm để PEC tái sử dụng cho mùa Tết.
- [README-Ban-Giao-Va-Giay-Phep.md](file:///C:/Users/MSI/.gemini/antigravity/scratch/lang-giang-sinh-pec/README-Ban-Giao-Va-Giay-Phep.md) — Ghi chú giấy phép thương mại và hướng dẫn bàn giao.
