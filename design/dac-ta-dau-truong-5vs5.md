# HỒ SƠ CHUYỂN GIAO KỸ THUẬT CHO CLAUDE CODE
**Dự án:** Web Game Giáo dục **"Làng Giáng Sinh PEC 2026"** (`https://github.com/tungmt08c-lab/lang-giang-sinh-pec`)
**Triển khai hiện tại:** Cloudflare Pages (`public/` là web root)
**Mục tiêu bàn giao:** Chuyển giao toàn bộ tài sản đồ họa (83 file), âm thanh đọc từ tiếng Anh (78 file `.mp3`), mã nguồn `public/index.html` đã vá lỗi Safari/iOS + UI, cùng dữ liệu cấu hình chuẩn `public/data/arena-5v5-config.json` và đặc tả kỹ thuật chi tiết để **Claude code hoàn thiện Trạm 7: Đấu Trường Bông Tuyết 5vs5 (bao gồm chế độ Go-Live Chung Kết)** và phần Backend trước ngày ra mắt `14/12/2026`.

---

## 1. QUAN TRỌNG: NHỮNG GÌ ĐÃ CẬP NHẬT TRONG `public/` (KHÔNG GHI ĐÈ BẰNG BẢN CŨ)

Gói bàn giao này đã cập nhật sẵn các tệp nền tảng sau — **Claude cần giữ nguyên và phát triển tiếp trên nền `public/index.html` mới này**, không lấy lại `index.html` cũ trên nhánh `main`:

1. **`public/index.html` (đã vá trọn bộ lỗi Safari/iOS & 7 lỗi giao diện/gameplay)**:
   - **Tương thích Safari iOS / WebKit / Zalo In-App Browser**:
     - Thêm đầy đủ `xmlns:xlink`, cặp `href` + `xlink:href`, và kích thước tường minh `width`/`height` cho mọi thẻ `<svg>` và `<image>` (khắc phục lỗi Safari không vẽ ảnh bên trong SVG khi thiếu `width`/`height`).
     - Gỡ bỏ bộ lọc `<feComponentTransfer>` phức tạp gây lỗi render trạm khóa trên WebKit, thay bằng CSS `filter: saturate(.55) brightness(.88)`.
     - Bổ sung fallback `height: 100vh; height: -webkit-fill-available` trước `100dvh`, `top/right/bottom/left: 0` trước `inset: 0`, và `-webkit-backdrop-filter` cho toàn bộ modal/hud.
     - Cơ chế `unlockAudio()` mở khóa đồng bộ `AudioContext`/`webkitAudioContext` và `HTMLAudioElement` (`VOX`) ngay từ cú chạm đầu tiên (`touchstart`/`pointerdown`).
     - Bổ sung fallback `touchstart`/`touchmove`/`touchend` song song với Pointer Events cho thao tác kéo–thả ở Trạm Cây thông & Xe trượt; bọc `ResizeObserver` trong `requestAnimationFrame`.
   - **Hệ thống phát âm tiếng Anh bằng MP3 thật (`speak(text)`)**:
     - Tự động chuẩn hóa chuỗi qua `slug(t)` để phát tệp `audio/<slug>.mp3` từ thư mục `public/audio/`, chỉ fallback sang `speechSynthesis` khi không có file MP3 — giải quyết triệt để lỗi câm tiếng trong Zalo WebView Android/iOS.
   - **7 bản vá UI & Gameplay + 2 file đồ họa tinh chỉnh**:
     - Khôi phục cột đèn đường cổ tích, dây đèn nhấp nháy dọc đường làng và khói ống khói Xưởng gói quà trên bản đồ.
     - Chống đè chữ bảng tên 7 trạm (`fitStationLabels()`), dịch icon ổ khóa lên `(45, -72)` và thu gọn thẻ linh vật cuối bản đồ.
     - Nắp tuyết cong SVG mượt mà trên 3 nút Dock dưới (`Hộp quà`, `Xếp hạng`, `Đổi quà`), đưa `#toast` lên sát dưới HUD trên.
     - Điểm Trạm 2 (Cây thông) khớp đề án BGĐ (`+15` điểm bước thường, `+25` điểm ngôi sao đỉnh, tối đa `100` điểm/lượt); chống trùng cột vật phẩm rơi ở Trạm 3; preload ảnh quà đổi thưởng.
     - Cập nhật `public/assets/bg-map.jpg` (dọn sạch chi tiết thừa gần lối đi) và `public/assets/mascot-think.png` (chuẩn hóa nét khuỷu tay `#3B1F2B`).

2. **Lưu ý hạ tầng DNS cho Safari tại Việt Nam (thông tin triển khai)**:
   - Tên miền mặc định `*.pages.dev` của Cloudflare thường bị nhà mạng Việt Nam chặn phân giải DNS mặc định trên Safari iOS/macOS. Khi deploy chính thức cần trỏ Custom Domain (ví dụ `noel.pec.edu.vn` hoặc `giangsinh.pec.edu.vn`) vào project Cloudflare Pages.

---

## 2. DANH MỤC TÀI SẢN & DỮ LIỆU ĐÃ ĐÓNG GÓI SẴN

```text
Ban-Giao-Cho-Claude-Code/
├── CLAUDE-HANDOVER-SPEC.md             # Tài liệu đặc tả kỹ thuật này
├── README.md                           # Tổng quan repo
├── design/
│   ├── Ke-hoach-Game-Giang-sinh-2026-PEC.pdf  # Đề án gốc của BGĐ PEC
│   ├── ban-giao-thiet-ke.md            # Quy chuẩn màu sắc, nét vẽ #3B1F2B, tọa độ gốc
│   ├── file-goc-svg/                   # File vector gốc SVG phân lớp
│   └── mockups-5v5/                    # 7 bản vẽ tham chiếu UI & hiệu ứng Đấu trường 5vs5
│       ├── arena_12_zodiac_chibi_sheet.jpg    # Bảng 12 nhân vật Con Giáp Chibi
│       ├── arena_5v5_battlefield_mockup.jpg   # Giao diện 5 làn băng đối kháng trực tiếp
│       ├── arena_5v5_characters_and_poses.jpg # Các tư thế hành động thắng/thua/đẩy ngã
│       ├── arena_5v5_victory_cutscene.jpg     # Hoạt cảnh chiến thắng đồng đội 3 cảnh
│       ├── mockup_1_livestream_stage.jpg      # Màn hình Livestream 16:9 (OBS/Fanpage)
│       ├── mockup_2_mobile_trio.jpg           # Bộ 3 màn hình dọc 9:16 trên điện thoại
│       └── mockup_3_victory_podium.jpg        # Bục vinh danh + Giấy chứng nhận điện tử
└── public/
    ├── index.html                      # Base game đã fix Safari/iOS + tích hợp MP3
    ├── logo-pec.png                    # Logo PEC chính thức
    ├── data/
    │   └── arena-5v5-config.json       # Dữ liệu chuẩn: 5 cơ sở, 12 con giáp, luật 5vs5, VFX, 48 câu hỏi
    ├── audio/                          # 78 file .mp3 giọng đọc tiếng Anh chuẩn (en-US)
    └── assets/                         # 83 file hình (.png/.jpg) tối ưu dung lượng, nét #3B1F2B
```

### Danh mục 24 file đồ họa MỚI dành riêng cho Đấu Trường 5vs5 (nằm sẵn trong `public/assets/`):
- **12 Nhân vật Con Giáp Chibi trượt băng (`240×240 px`, PNG trong suốt, căn tâm đáy giày trượt tại `x=120, y=216`)**:
  - `av-01-ty.png` (Chuột Kem), `av-02-suu.png` (Trâu Vàng), `av-03-dan.png` (Hổ Bông), `av-04-mao.png` (Mèo Tuyết – chuẩn văn hóa Việt Nam), `av-05-thin.png` (Rồng Ngọc), `av-06-ran.png` (Rắn Bạc Hà), `av-07-ngo.png` (Ngựa Pony), `av-08-mui.png` (Dê Bông Xù), `av-09-than.png` (Khỉ Nhí), `av-10-dau.png` (Gà Vàng), `av-11-tuat.png` (Cún Corgi), `av-12-hoi.png` (Heo Hồng).
  - *Mặc định hướng mặt:* Nhìn chéo về bên phải (thuận chiều Đội Trái / Team A). Khi render cho **Đội Phải (Team B)** trên làn băng, chỉ cần lật ngang phần nhân vật bằng `transform: scaleX(-1)` (không lật chữ tên/điểm).
- **5 Huy hiệu Cơ sở PEC (`192×192 px`, PNG trong suốt)**:
  - `badge-branch-lachtray.png` (`#E73236`), `badge-branch-tohieu.png` (`#33B865`), `badge-branch-imperia.png` (`#F2B600`), `badge-branch-danang.png` (`#3D9BE9`), `badge-branch-thuynguyen.png` (`#A146C9`).
- **4 File Kỹ năng & Hiệu ứng Tương tác**:
  - `sk-shield.png` (`192×192` – Khiên Tuyết Ấm), `sk-double.png` (`192×192` – Ngôi Sao Nhân Đôi `×2`), `sk-snowball.png` (`192×192` – Bão Tuyết Mờ 1 Giây), `fx-frost-overlay.png` (`540×960` – lớp sương băng phủ lên vùng đáp án để đối thủ dùng ngón tay lau sạch).
- **3 File Vinh danh & Chứng nhận Chung kết**:
  - `arena-podium.png` (`900×520` – Bục băng Top 1–2–3), `arena-cup.png` (`390×390` – Cúp Pha Lê Cực Quang), `cert-frame-pec.png` (`720×900` – Khung Giấy chứng nhận điện tử xuất ảnh PNG cho phụ huynh tải về).
- *(Ngoài ra có sẵn `st-arena.png` trên bản đồ và `bg-sled.jpg` / `bg-snowman.jpg` có thể tái sử dụng làm nền bầu trời sân băng).*

---

## 3. ĐẶC TẢ KỸ THUẬT CHI TIẾT ĐỂ CLAUDE CODE TRẠM 7: ĐẤU TRƯỜNG BÔNG TUYẾT 5VS5

Đọc toàn bộ hằng số, danh sách nhân vật, luật tính điểm và kho câu hỏi từ `/data/arena-5v5-config.json` để dễ bảo trì và mở rộng ngân hàng đề sau này.

### 3.1. Mở khóa Trạm 7 & Chọn Nhân Vật Con Giáp
1. Trong mảng `STATIONS` của `public/index.html`, bật `open: 1` cho `{id:'arena', name:'Đấu trường Bông tuyết', x:166, y:252, ly:46, open:1}` và thêm nhánh `else if(st.id==='arena') playArena();` trong hàm khởi chạy trạm.
2. Lưu thêm `S.profile.avatarId` (mặc định gợi ý theo năm sinh hoặc `'mao'` – Mèo Tuyết). Cho phép bé đổi nhân vật bất cứ lúc nào tại **Sảnh Đấu Trường (Lobby)** qua lưới `4×3` hiển thị 12 con giáp từ `config.zodiacAvatars` (mỗi ô có ảnh `file`, nhãn `zodiac` + `name`, viền sáng màu `accent` khi chọn).

### 3.2. Ghép Đội 5vs5 Theo Cơ Sở (2 Chế Độ: Ghép Thường & Chung Kết Go-Live)
- **Chế độ Hàng ngày (Quick Match 5vs5)**:
  - Học sinh bấm **"Tìm Trận 5vs5"** -> xếp vào hàng đợi theo `(level, branch)` để lập đội 5 bạn cùng cơ sở PEC đối đầu 5 bạn cơ sở khác.
  - **Cơ chế chống kẹt phòng (`fallbackWaitSeconds: 8`)**: Nếu sau `8 giây` chưa đủ 10 người thật cùng cấp độ, tự động ghép **Đội Liên Minh Cơ Sở** hoặc điền các vị trí trống bằng **Smart Bot Con Giáp** (tên học sinh mẫu + thời gian trả lời ngẫu nhiên hợp lý `2.2s – 6.8s`, tỉ lệ đúng `65%–80%`) để trận đấu **luôn bắt đầu mượt mà trong vòng ≤ 8 giây**, kể cả khi chạy offline/demo không có backend hay khi ít người online.
- **Chế độ Đêm Chung Kết Go-Live (Room PIN + Livestream)**:
  - Hỗ trợ nhập **Mã Phòng 4 chữ số** (ví dụ `PEC8` / `2026`) hoặc vào qua query URL:
    - Thí sinh thi đấu (`9:16` mobile): `/?room=XXXX` (sau khi xác thực SĐT/Hồ sơ Top 25–30).
    - Khán giả cổ vũ (`9:16` mobile): `/?room=XXXX&role=spectator` (thả tim/bông tuyết nạp thanh Năng lượng Cơ sở + trả lời `audienceGoldenQuestions` giữa hiệp).
    - Màn hình Sân khấu Livestream OBS (`16:9` desktop): `/?view=stage&room=XXXX` (hiển thị trọn vẹn 5 làn băng song song, thanh tỷ số tổng 2 đội lớn ở đỉnh, bảng đua 5 cơ sở bên cạnh và mã QR góc màn hình; tham chiếu `design/mockups-5v5/mockup_1_livestream_stage.jpg`).
    - Bảng điều khiển MC/Đạo diễn: `/?view=host&room=XXXX` (nút Quay số chia đội ngẫu nhiên theo cơ sở, Phát câu hỏi tiếp, Tạm dừng kỹ thuật, Kích hoạt Câu hỏi Vàng Khán giả, Trao Cúp Chung cuộc).

### 3.3. Kiến Trúc Phòng Đấu Thời Gian Thực (Khuyến nghị Cloudflare Workers + Durable Objects)
Vì repo đang deploy trực tiếp trên **Cloudflare Pages**, kiến trúc gọn nhẹ và đồng bộ nhất là sử dụng **Pages Functions (`functions/api/...`) + Cloudflare Durable Objects (WebSocket)** + **Cloudflare D1** (lưu hồ sơ, BXH, mã quà). *(Lưu ý: Luôn giữ chế độ Local/Bot Simulation chạy ngay trên trình duyệt khi chưa kết nối WebSocket để giáo viên/BGĐ mở link test bất cứ lúc nào cũng chơi thử được trọn vẹn 10 câu 5vs5!)*

**State Machine của 1 trận 5vs5 (`10 lượt câu hỏi`, tổng thời lượng ~2 phút 15 giây):**
```text
LOBBY_PICK_AVATAR
  └─> TEAM_LINEUP_INTRO (3.0s: 5 chiến binh Đội A trượt từ trái vào vs 5 chiến binh Đội B trượt từ phải vào trên 5 làn băng L1..L5)
       └─> LOOP round = 1..10:
            ├─ ROUND_QUESTION (10.0s đồng hồ chung cho cả 10 người)
            └─ ROUND_CLASH_VFX (2.8s cập nhật điểm ngay lập tức + diễn hoạt hành động thắng/thua trên từng làn 1..5)
       └─> TEAM_VICTORY_CUTSCENE (6.0s hoạt cảnh 3 phân cảnh sôi động)
            └─> MATCH_SUMMARY_AND_MVP_CERT (Bảng điểm 10 người + Vinh danh MVP + Tải Giấy chứng nhận PNG)
```

### 3.4. Thuật Toán Chia Câu Hỏi 5 Cặp Đấu Song Song (Chống Nhìn Bài 100%)
Trong mỗi lượt `round` (`1..10`):
- Chọn Tier độ khó theo lượt: Lượt `1–3` lấy câu `tier: 1`; Lượt `4–7` lấy câu `tier: 2`; Lượt `8–10` lấy câu `tier: 3` (từ `questionBank.kids` / `junior` / `teen` tương ứng cấp chơi; có thể trộn thêm câu tự sinh từ `WRAP_WORDS`/`TOPICS` cho cấp Kids để đề vô hạn).
- Rút ngẫu nhiên **5 câu hỏi KHÁC NHAU cùng `tier`**: `[Q_0, Q_1, Q_2, Q_3, Q_4]` cho 5 làn băng `lane = 0..4`.
- **Quy tắc ghép cặp công bằng tuyệt đối**:
  - Hai đối thủ trực tiếp trên cùng làn `i` (`TeamA.players[i]` và `TeamB.players[i]`) nhận **CÙNG câu `Q_i`** và cùng thứ tự đáp án để đọ tốc độ + độ chính xác sòng phẳng.
  - 5 thành viên trong cùng một đội (`i = 0..4`) nhận **5 câu hoàn toàn khác nhau** trong cùng 10 giây đó -> ngồi cạnh nhau tại cơ sở hay gọi điện cũng không thể nhắc bài.
  - Với cấp `Kids`, nếu câu hỏi có trường `"audio"` (ví dụ `"star"`, `"hat"`, `"put-the-purple-bell-on-the-tree"`), tự động gọi `speak(q.audio)` khi mở câu và hiện nút loa lớn để bé bấm nghe lại.

### 3.5. Quy Tắc Tính Điểm Theo Đội Sau 10 Lượt & Bộ Kỹ Năng
Đọc tham số từ `config.matchRules`:
- **Hệ số lượt**: Lượt `1–8` nhân `×1`; **Lượt `9–10` (Về Đích Bùng Nổ)** nhân `×2` toàn bộ điểm kiếm được.
- **Điểm mỗi cặp đấu `i` trong 1 lượt** (`dt_ms` = thời gian từ lúc mở câu đến lúc chốt đáp án, tối đa `10000 ms`):
  - `speedBonus(dt_ms) = dt_ms <= 1500 ? 50 : Math.max(0, Math.round(50 * (10000 - dt_ms) / 8500))`
  - **Chỉ 1 người trả lời đúng (`SOLO_WIN`)**: Người đúng nhận `(100 + speedBonus) * roundMult`; đối thủ `0` điểm.
  - **Cả 2 cùng đúng nhưng chênh lệch `> 150 ms` (`SPEED_WIN`)**: Người nhanh hơn thắng đối kháng làn và nhận `(100 + speedBonus) * roundMult`; người chậm hơn vẫn mang về cho đội `70 * roundMult` điểm khuyến khích.
  - **Cả 2 cùng đúng và chênh lệch `<= 150 ms` (`TIE_CLASH`)**: Hòa siêu tốc, cả hai cùng nhận `(100 + speedBonus) * roundMult`.
  - **Cả 2 cùng sai hoặc hết giờ (`BOTH_MISS`)**: `0` điểm (trừ khi bật *Khiên Tuyết Ấm*).
  - **Thưởng Chuỗi Thắng Làn (`Combo ×3`)**: Thắng đối kháng làn 3 lượt liên tiếp cộng thêm `+50` điểm trực tiếp vào Tổng Điểm Đội.
- **3 Kỹ năng chiến thuật (mỗi trận dùng tối đa 1 lần/kỹ năng)**:
  1. **Khiên Tuyết Ấm (`sk-shield.png`, mọi cấp)**: Nếu lượt đó trả lời sai/hết giờ, giữ nguyên chuỗi `streak` và vẫn nhận `+30` điểm an ủi cho đội.
  2. **Ngôi Sao Nhân Đôi (`sk-double.png`, mọi cấp)**: Bấm kích hoạt trong `2 giây` đầu trước khi chọn đáp án -> nhân `×2` điểm cá nhân kiếm được ở lượt đó nếu trả lời đúng.
  3. **Bão Tuyết Mờ 1 Giây (`sk-snowball.png` + `fx-frost-overlay.png`, chỉ mở cho `Junior` & `Teen` khi đạt `streak >= 3`)**: Phủ lớp sương băng (`<canvas>` vẽ `fx-frost-overlay.png`) lên khung đáp án của **đối thủ trực tiếp cùng làn** ở đầu câu kế tiếp; đối thủ quẹt ngón tay/chuột (`globalCompositeOperation = 'destination-out'`) ~1 giây là lau tan sương để chọn đáp án; đối thủ sau khi bị ném được miễn nhiễm `3 lượt` (`targetImmunityRounds: 3`).
- **Điều kiện thắng chung cuộc**: Kết thúc Lượt 10, đội có **`teamTotalScore` (Tổng điểm của cả 5 thành viên qua 10 lượt) cao hơn** giành chiến thắng. Nếu bằng điểm tuyệt đối, xét `tieBreaker`: đội có tổng thời gian phản xạ đúng (`totalCorrectResponseMs`) thấp hơn thắng.

### 3.6. Thiết Kế Giao Diện 5 Làn Băng & Hiệu Ứng Hành Động Đối Kháng (`ROUND_CLASH_VFX` – `2.8s`)
Tham chiếu trực quan tại `design/mockups-5v5/arena_5v5_battlefield_mockup.jpg` và `arena_5v5_characters_and_poses.jpg`:

- **Bố cục thích ứng thông minh**:
  - **Trên Điện thoại thí sinh (`9:16`, rộng `360–430px`)**:
    - **Đỉnh màn hình**: Thanh Tỷ Số Tổng Kéo Co của 2 Đội (Huy hiệu cơ sở Trái vs Phải, điểm tổng nhảy số `requestAnimationFrame` mượt mà, đồng hồ tròn 10s ở giữa).
    - **Khung Mini-Arena 4 đồng đội (`cao ~110px`)**: Hiển thị trực tiếp 4 làn băng thu nhỏ của 4 cặp đồng đội để bé thấy không khí cả đội cùng chiến đấu và biết ngay đồng đội nào vừa đẩy ngã đối thủ.
    - **Làn Băng Chính của Bản Thân (`cao ~145px`)**: Nhân vật Con Giáp của bé (bên trái) đối mặt trực diện Con Giáp đối thủ (bên phải, lật `scaleX(-1)`), vạch tâm băng phát sáng ở giữa.
    - **Nửa dưới màn hình**: Thẻ câu hỏi + 4 nút đáp án lớn dễ bấm + thanh 2–3 nút Kỹ năng dưới đáy.
  - **Trên Màn hình Sân khấu / Máy tính bảng ngang (`16:9` hoặc `?view=stage`)**: Hiển thị đồng thời **cả 5 làn băng lớn xếp tầng 1..5** từ trên xuống dưới, mỗi làn rõ tên học sinh, huy hiệu cơ sở, điểm cộng bay lên và động tác chiến thắng.

- **5 Hoạt cảnh hành động ngay sau mỗi câu hỏi (`2.8 giây` dùng CSS Keyframes + Particle Canvas nhẹ 60fps)**:
  1. **`SOLO_WIN` (Đẩy ngã đối thủ & Giơ 2 tay chiến thắng)**:
     - `0.0s – 0.5s`: Nhân vật thắng nghiêng người lướt vọt tới trước (`translateX(+42px) rotate(8deg)`), tung quả cầu tuyết phát sáng vệt sao vàng bay trúng đối thủ.
     - `0.5s – 1.4s`: Quả cầu tuyết nổ bông tuyết trắng xóa! **Đối thủ bị đẩy trượt lùi về sau**, nghiêng ngã êm ái xuống đệm tuyết bông (`translateX(+34px) rotate(34deg) translateY(8px)`), trên đầu xoay vòng 3 ngôi sao choáng váng ngộ nghĩnh (`⭐💫⭐`). (Lưu ý: biểu cảm hài hước dễ thương, không bạo lực).
     - `1.4s – 2.8s`: **Nhân vật thắng bật nhảy cao 2 nhịp** (`translateY(-18px) scale(1.08)`), tỏa pháo giấy mini + chữ nổi vàng kim `+142Đ! TUYỆT ĐỈNH!`, đồng thời vạch băng trên làn dịch thêm `18%` sang phần sân đối phương.
  2. **`SPEED_WIN` (Đọ tốc độ thắng sát nút)**:
     - Cả hai cùng lao vào vạch giữa tóe tia chớp vàng `⚡`, người nhanh hơn hích vai đẩy đối thủ trượt lùi nửa bước (`translateX(+18px) rotate(12deg)`), hiện nhãn `⚡ NHANH HƠN 0.4s!` và bật nhảy ăn mừng.
  3. **`TIE_CLASH` (Hòa siêu tốc)**:
     - Hai quả cầu tuyết chạm nhau giữa sân nổ tung bụi tuyết cầu vồng, hai nhân vật cùng bật nhảy đập tay vui vẻ (`✦ HÒA SIÊU TỐC!`).
  4. **`BOTH_MISS` (Cùng trượt vỏ chuối/tuyết)**:
     - Cả hai lắc lư trượt chân ngồi phịch xuống tuyết kèm âm thanh `boing` vui nhộn để giảm áp lực tâm lý cho trẻ nhỏ.
  5. **`STREAK_AURA` (`Combo >= 3`)**:
     - Dưới giày trượt nhân vật xuất hiện vòng xoáy cực quang vàng rực xoay tròn liên tục kèm huy hiệu `🔥 BẤT BẠI ×3`.

### 3.7. Hoạt Cảnh Chiến Thắng Đồng Đội Sôi Động Cuối Trận (`6.0 giây`, 3 Phân Cảnh)
Tham chiếu trực quan tại `design/mockups-5v5/arena_5v5_victory_cutscene.jpg` và `mockup_3_victory_podium.jpg`:
- **Phân cảnh 1 (`0.0s – 2.0s` – Cơn Lốc Tuyết Đồng Đội)**: Cả 5 nhân vật Con Giáp của đội thắng xếp đội hình chữ V trượt lên giữa sân, hợp lực tạo sóng tuyết cầu vồng đẩy 5 nhân vật đội bạn ngã nhào vui nhộn vào đụn tuyết bông mềm mại bên rìa sân.
- **Phân cảnh 2 (`2.0s – 4.5s` – Vũ Điệu Nâng Cúp Cơ Sở)**: Sân băng rực sáng đèn sân khấu theo màu cờ cơ sở thắng cuộc, mưa kẹo gậy & pháo giấy vàng kim rơi ngập màn hình; `assets/arena-cup.png` cùng Huy hiệu Cơ sở khổng lồ hạ xuống trung tâm, 5 nhân vật đồng loạt bật nhảy múa ăn mừng theo nhịp nhạc `jingle` chiến thắng; bảng tỷ số tổng chốt kết quả (ví dụ `TÔ HIỆU 5.480 – 4.920 LẠCH TRAY`).
- **Phân cảnh 3 (`4.5s – 6.0s` + Màn Tổng Kết – Hào Quang MVP & Xuất Chứng Nhận)**:
  - Đèn Spotlight vàng chiếu vào thành viên ghi nhiều điểm nhất trận (**MVP Đấu Trường**) đứng trên bục `assets/arena-podium.png` với vương miện sao.
  - Cung cấp nút **"Tải Giấy Chứng Nhận Chiến Binh PEC"**: Vẽ lên `<canvas width="720" height="900">` khung `assets/cert-frame-pec.png` + ảnh Con Giáp bé chọn + Họ tên bé + Cơ sở PEC + Danh hiệu (*Quán Quân Đồng Đội / MVP Đấu Trường / Chiến Binh Xuất Sắc Làng Giáng Sinh PEC 2026*) + Điểm số, cho phép tải ngay file `.png` sắc nét về máy để phụ huynh khoe lên Facebook/Zalo.

---

## 4. CÁC HẠNG MỤC BACKEND & MỞ RỘNG CẦN LƯU Ý THEO ĐỀ ÁN BGĐ PEC

Ngoài Trạm 7 (ưu tiên số 1 theo yêu cầu hiện tại), đề án gốc `design/Ke-hoach-Game-Giang-sinh-2026-PEC.pdf` có các yêu cầu vận hành sau để Claude tích hợp đồng bộ khi dựng API/Database:
1. **Đăng ký SĐT phụ huynh (`#regF`)**: Thêm trường Số điện thoại Việt Nam (`10 chữ số`), giới hạn tối đa `3 bé / 1 SĐT`, đồng bộ hồ sơ & điểm lên server thay vì chỉ lưu `localStorage`.
2. **Bảng xếp hạng (`#board`)**: Bổ sung thêm phạm vi lọc **`Lớp`** bên cạnh `Trường · Cơ sở · Toàn hệ thống`, lấy dữ liệu thật từ Database.
3. **Đổi quà (`#shop`)**: Sinh mã đổi quà `PEC-XXXXX` từ server có kiểm tra tồn kho quà theo 5 cơ sở (`Bút: 60 kẹo`, `Vở: 120 kẹo`, `Ô hoặc Gấu bông: 200 kẹo`) và trang tra cứu/gạch mã đơn giản cho lễ tân 5 cơ sở.
4. **Các trạm đơn 4–6 (`Đắp người tuyết`, `Nói với Ông già Noel`, `Thư gửi Ông già Noel`)**: Tất cả đồ họa (`st-snowman.png`, `st-talk.png`, `st-letter.png`, `bg-snowman.jpg`, `snowman-*.png`) đã có sẵn 100% trong `public/assets/` nếu tiếp tục mở khóa các trạm đơn ở chặng tiếp theo.
