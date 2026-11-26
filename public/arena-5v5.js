/* ==========================================================================
   MODULE TRẠM 7: ĐẤU TRƯỜNG BÔNG TUYẾT 5VS5 — PHIÊN BẢN ĐỐI KHÁNG CẬN CẢNH
   - Sân khấu chính Zoom cận cảnh 2 nhân vật khổng lồ (132px) đối mặt trực diện
   - 4 cặp đồng đội còn lại hiển thị trực tiếp trên thanh Mini-Squad phía trên
   - Nạp lực khi chốt đáp án -> Lao vọt áp sát -> Tung Cú Đấm Găng Tuyết Khổng Lồ!
   - Chớp sáng Hit-Stop, Rung lắc màn hình, Sóng xung kích Canvas & Đấm văng xoay vòng!
   - Đọ Quyền Tốc Độ giữa sân khi cả 2 cùng trả lời đúng!
   ========================================================================== */
(function () {
  'use strict';

  const FALLBACK_CFG = {
    campuses: [
      { id: 'lachtray', name: 'Lạch Tray', teamTitle: 'Chiến Binh Sao Đỏ', color: '#E73236', badge: 'assets/badge-branch-lachtray.png' },
      { id: 'tohieu', name: 'Tô Hiệu', teamTitle: 'Vệ Binh Rừng Thông', color: '#33B865', badge: 'assets/badge-branch-tohieu.png' },
      { id: 'imperia', name: 'Vinhomes Imperia', teamTitle: 'Kỵ Sĩ Cực Quang', color: '#F2B600', badge: 'assets/badge-branch-imperia.png' },
      { id: 'danang', name: 'Đà Nẵng', teamTitle: 'Tinh Linh Băng Lam', color: '#3D9BE9', badge: 'assets/badge-branch-danang.png' },
      { id: 'thuynguyen', name: 'Thủy Nguyên', teamTitle: 'Tuần Lộc Tím Đêm', color: '#A146C9', badge: 'assets/badge-branch-thuynguyen.png' }
    ],
    zodiacAvatars: [
      { id: 'ty', order: 1, zodiac: 'Tý', name: 'Chuột Kem', years: [2020, 2008], file: 'assets/av-01-ty.png', accent: '#BCC8E6' },
      { id: 'suu', order: 2, zodiac: 'Sửu', name: 'Trâu Vàng', years: [2021, 2009], file: 'assets/av-02-suu.png', accent: '#FFD525' },
      { id: 'dan', order: 3, zodiac: 'Dần', name: 'Hổ Bông', years: [2022, 2010], file: 'assets/av-03-dan.png', accent: '#FFAE42' },
      { id: 'mao', order: 4, zodiac: 'Mão', name: 'Mèo Tuyết', years: [2023, 2011], file: 'assets/av-04-mao.png', accent: '#FFB0C8' },
      { id: 'thin', order: 5, zodiac: 'Thìn', name: 'Rồng Ngọc', years: [2024, 2012], file: 'assets/av-05-thin.png', accent: '#5CE0B8' },
      { id: 'ran', order: 6, zodiac: 'Tỵ', name: 'Rắn Bạc Hà', years: [2013], file: 'assets/av-06-ran.png', accent: '#82ED9E' },
      { id: 'ngo', order: 7, zodiac: 'Ngọ', name: 'Ngựa Pony', years: [2014], file: 'assets/av-07-ngo.png', accent: '#E0985A' },
      { id: 'mui', order: 8, zodiac: 'Mùi', name: 'Dê Bông Xù', years: [2015], file: 'assets/av-08-mui.png', accent: '#F2C98A' },
      { id: 'than', order: 9, zodiac: 'Thân', name: 'Khỉ Nhí', years: [2016], file: 'assets/av-09-than.png', accent: '#C9834B' },
      { id: 'dau', order: 10, zodiac: 'Dậu', name: 'Gà Vàng', years: [2017], file: 'assets/av-10-dau.png', accent: '#FFE45E' },
      { id: 'tuat', order: 11, zodiac: 'Tuất', name: 'Cún Corgi', years: [2018], file: 'assets/av-11-tuat.png', accent: '#F2A855' },
      { id: 'hoi', order: 12, zodiac: 'Hợi', name: 'Heo Hồng', years: [2019], file: 'assets/av-12-hoi.png', accent: '#FFB3C9' }
    ],
    questionBank: {
      kids: [
        { id: 'K01', tier: 1, q: 'Listen! Which one is a STAR?', audio: 'star', opts: ['⭐', '🌙', '🎄', '🔔'], ans: 0 },
        { id: 'K02', tier: 1, q: "What color is Santa's hat? 🎅", audio: 'hat', opts: ['Blue', 'Red', 'Green', 'Purple'], ans: 1 },
        { id: 'K03', tier: 1, q: 'Listen! Touch the SNOWMAN!', audio: 'snowman', opts: ['🦌', '⛄', '🧸', '🎂'], ans: 1 },
        { id: 'K04', tier: 1, q: 'Which animal loves milk and says Meow? 🥛', audio: 'cat', opts: ['🐶 dog', '🐷 pig', '🐱 cat', '🦆 duck'], ans: 2 },
        { id: 'K05', tier: 1, q: 'Count the gifts: 🎁🎁🎁 — How many?', audio: 'gift', opts: ['Two', 'Three', 'Four', 'Five'], ans: 1 },
        { id: 'K06', tier: 2, q: 'Put on your warm ________! 🧣', audio: 'scarf', opts: ['scarf', 'shoes', 'apple', 'train'], ans: 0 },
        { id: 'K07', tier: 2, q: 'Which one is COLD and white? ❄️', audio: 'snow', opts: ['pizza', 'snow', 'bread', 'sun'], ans: 1 },
        { id: 'K08', tier: 2, q: 'Find the missing letter: C _ N D Y 🍬', audio: 'candy', opts: ['A', 'E', 'O', 'U'], ans: 0 },
        { id: 'K09', tier: 2, q: 'Listen! Put the purple bell on the tree.', audio: 'put-the-purple-bell-on-the-tree', opts: ['🔴 Red bell', '🔵 Blue bell', '🟣 Purple bell', '🟣 Purple gift'], ans: 2 },
        { id: 'K10', tier: 2, q: "Which animal pulls Santa's sleigh? 🛷", audio: 'deer', opts: ['🐰 rabbit', '🐟 fish', '🦌 deer', '🐮 cow'], ans: 2 },
        { id: 'K11', tier: 3, q: 'Odd one out! Which one is NOT food?', audio: 'gloves', opts: ['🎂 cake', '🍪 cookie', '🧤 gloves', '🍎 apple'], ans: 2 },
        { id: 'K12', tier: 3, q: 'Listen! Put the yellow star on the top.', audio: 'put-the-yellow-star-on-the-top', opts: ['Under the bed', 'On top of the tree', 'In the milk', 'In the shoe'], ans: 1 },
        { id: 'K13', tier: 3, q: 'Unscramble the word: G - I - F - T 🎁', audio: 'gift', opts: ['FIGT', 'GIFT', 'TGIF', 'GITF'], ans: 1 },
        { id: 'K14', tier: 3, q: 'Which pair is clothes for winter?', audio: 'clothes', opts: ['🧣 scarf & 🧤 gloves', '🍎 apple & 🥛 milk', '🚗 car & 🤖 robot', '🐟 fish & 🐦 bird'], ans: 0 },
        { id: 'K15', tier: 3, q: 'What do we say on December 25th? 🎉', audio: 'merry-christmas', opts: ['Happy Birthday!', 'Good night!', 'Merry Christmas!', 'Goodbye!'], ans: 2 }
      ],
      junior: [
        { id: 'J01', tier: 1, q: 'Santa Claus climbs down the ________ to bring gifts.', opts: ['window', 'chimney', 'garden', 'balcony'], ans: 1 },
        { id: 'J02', tier: 1, q: "It is freezing outside! Don't forget to wear your ________.", opts: ['sunglasses', 'sandals', 'mittens', 'shorts'], ans: 2 },
        { id: 'J03', tier: 1, q: 'Children hang Christmas ________ by the fireplace.', opts: ['stockings', 'pockets', 'blankets', 'pillows'], ans: 0 },
        { id: 'J04', tier: 1, q: 'Look! The children ________ a big snowman right now.', opts: ['build', 'built', 'are building', 'builds'], ans: 2 },
        { id: 'J05', tier: 1, q: 'Which word has a DIFFERENT vowel sound?', opts: ['snow', 'coat', 'cow', 'bowl'], ans: 2 },
        { id: 'J06', tier: 2, q: "Elves work hard in Santa's ________ at the North Pole.", opts: ['workshop', 'hospital', 'airport', 'library'], ans: 0 },
        { id: 'J07', tier: 2, q: '________ gifts did you wrap today? — Six gifts!', opts: ['How much', 'How many', 'How long', 'How often'], ans: 1 },
        { id: 'J08', tier: 2, q: 'A circle of pine leaves hung on the door is a ________.', opts: ['ribbon', 'candle', 'wreath', 'sleigh'], ans: 2 },
        { id: 'J09', tier: 2, q: 'Last Christmas, my family ________ hot chocolate together.', opts: ['drink', 'drinks', 'drank', 'drinking'], ans: 2 },
        { id: 'J10', tier: 2, q: 'Correct sentence: tree / decorated / lights / We / the / with', opts: ['We lights decorated with the tree.', 'We decorated the tree with lights.', 'The tree decorated we with lights.', 'With lights we the tree decorated.'], ans: 1 },
        { id: 'J11', tier: 3, q: 'Which sleigh is moving ________: the red one or the blue one?', opts: ['fast', 'faster', 'fastest', 'more fast'], ans: 1 },
        { id: 'J12', tier: 3, q: 'If it ________ tonight, the whole village will turn white!', opts: ['snow', 'snowed', 'snows', 'snowing'], ans: 2 },
        { id: 'J13', tier: 3, q: 'Spot the mistake: She writed a long letter to Santa yesterday.', opts: ['She', 'writed', 'long', 'to'], ans: 1 },
        { id: 'J14', tier: 3, q: 'I have a carrot nose, coal eyes, and melt in the sun. Who am I?', opts: ['A gingerbread man', 'A reindeer', 'A snowman', 'A penguin'], ans: 2 },
        { id: 'J15', tier: 3, q: 'Thank you for helping me fix my sleigh! — Best reply:', opts: ["You're welcome, Santa!", 'Never mind!', 'Yes, please!', 'Same to you!'], ans: 0 }
      ],
      teen: [
        { id: 'T01', tier: 1, q: 'Traditional songs sung at Christmas are called Christmas ________.', opts: ['anthems', 'carols', 'chants', 'rhymes'], ans: 1 },
        { id: 'T02', tier: 1, q: 'By Christmas Eve, PEC students ________ over 1,000 gifts!', opts: ['collect', 'collected', 'will have collected', 'are collecting'], ans: 2 },
        { id: 'T03', tier: 1, q: 'Which word means shining softly with a flickering light?', opts: ['twinkling', 'freezing', 'melting', 'roaring'], ans: 0 },
        { id: 'T04', tier: 1, q: 'Neither Santa nor the elves ________ tired after the journey.', opts: ['is', 'was', 'were', 'has been'], ans: 2 },
        { id: 'T05', tier: 1, q: 'Idiom: The more, the ________! Come join our Christmas party!', opts: ['happier', 'merrier', 'better', 'jollier'], ans: 1 },
        { id: 'T06', tier: 2, q: 'Despite ________, hundreds of families joined the PEC Festival.', opts: ['it snowed', 'the heavy snow', 'snows', 'of the snow'], ans: 1 },
        { id: 'T07', tier: 2, q: "What does the idiom 'in the nick of time' mean?", opts: ['Very early', 'Just in time before it is too late', 'Once a year', 'Wasting time'], ans: 1 },
        { id: 'T08', tier: 2, q: 'Which word has primary stress on the SECOND syllable?', opts: ['CHRISTmas', 'REINdeer', 'DeCEMber', 'SNOWflake'], ans: 2 },
        { id: 'T09', tier: 2, q: 'Santa asked the little boy what ________ for Christmas.', opts: ['did he want', 'he wants', 'he wanted', 'wanted he'], ans: 2 },
        { id: 'T10', tier: 2, q: 'Heartfelt gifts are far more meaningful than ________ ones.', opts: ['extravagant', 'generous', 'thoughtful', 'festive'], ans: 0 },
        { id: 'T11', tier: 3, q: "Idiom: Seeing only a tiny part is 'just the tip of the ________'.", opts: ['mountain', 'glacier', 'iceberg', 'snowfall'], ans: 2 },
        { id: 'T12', tier: 3, q: 'Had the reindeer not seen the star, the sleigh ________ lost.', opts: ['would get', 'would have gotten', 'will get', 'got'], ans: 1 },
        { id: 'T13', tier: 3, q: "When someone quits a habit 'cold turkey', how do they do it?", opts: ['During Christmas', 'Slowly', 'Abruptly and completely', 'Secretly'], ans: 2 },
        { id: 'T14', tier: 3, q: "Choose the closest synonym to JOVIAL ('a jovial Santa'):", opts: ['Cheerful and friendly', 'Strict and quiet', 'Exhausted', 'Mysterious'], ans: 0 },
        { id: 'T15', tier: 3, q: 'Proverb: One kind word can warm three ________ months.', opts: ['autumn', 'winter', 'cloudy', 'stormy'], ans: 1 }
      ],
      audienceGoldenQuestions: [
        { id: 'A01', q: 'Trung tâm Anh ngữ PEC hiện có bao nhiêu cơ sở đón bé đổi quà Giáng Sinh tại Hải Phòng?', opts: ['3 cơ sở', '5 cơ sở', '2 cơ sở', '4 cơ sở'], ans: 1 },
        { id: 'A02', q: 'Linh vật Tuần Lộc của Làng Giáng Sinh PEC có chiếc mũi màu gì đặc biệt?', opts: ['Đỏ chót', 'Nâu đen dễ thương', 'Xanh băng', 'Vàng óng'], ans: 1 },
        { id: 'A03', q: 'Slogan gắn liền với thương hiệu Anh ngữ PEC từ năm 2005 là gì?', opts: ['Fly to the sky!', 'Learning to be!', 'Win the game!', 'Let it snow!'], ans: 1 }
      ]
    }
  };

  let CFG = FALLBACK_CFG;
  fetch('data/arena-5v5-config.json')
    .then(r => (r.ok ? r.json() : null))
    .then(d => { if (d && d.zodiacAvatars) CFG = d; })
    .catch(() => {});

  /* SVG Găng Đấm Tuyết Sấm Sét khổng lồ (viền #3B1F2B đồng bộ phong cách PEC, không dùng trùng ID defs) */
  const MEGA_GLOVE_SVG = `<img class="ar-mega-fist" src="assets/sk-snowball.png" alt="" aria-hidden="true">`;

  /* ---------- BỘ ÂM THANH VÕ ĐÀI WEBAUDIO (TIẾNG NẠP LỰC + ĐẤM TRẦM LỰC + NỔ VA CHẠM) ---------- */
  let fightAC = null;
  function getAC() {
    try {
      fightAC = fightAC || new (window.AudioContext || window.webkitAudioContext)();
      if (fightAC.state === 'suspended') fightAC.resume();
      return fightAC;
    } catch (e) { return null; }
  }

  function sfxCharge(muted) {
    if (muted) return;
    const ac = getAC(); if (!ac) return;
    const t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(680, t + 0.22);
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.25);
  }

  function sfxWhoosh(muted, delay) {
    if (muted) return;
    const ac = getAC(); if (!ac) return;
    const t = ac.currentTime + (delay || 0);
    const buf = ac.createBuffer(1, ac.sampleRate * 0.18, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ac.createBufferSource(); src.buffer = buf;
    const flt = ac.createBiquadFilter(); flt.type = 'bandpass';
    flt.frequency.setValueAtTime(900, t);
    flt.frequency.exponentialRampToValueAtTime(280, t + 0.17);
    const g = ac.createGain(); g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
    src.connect(flt); flt.connect(g); g.connect(ac.destination);
    src.start(t);
  }

  function sfxHeavyPunch(muted, delay) {
    if (muted) return;
    const ac = getAC(); if (!ac) return;
    const t = ac.currentTime + (delay || 0);
    // 1. Sub-bass cú đấm cực đầm (210Hz -> 36Hz)
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(215, t);
    o.frequency.exponentialRampToValueAtTime(36, t + 0.24);
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    o.connect(g); g.connect(ac.destination);
    o.start(t); o.stop(t + 0.27);

    // 2. Crunch băng vỡ giòn tan (White-noise burst)
    const buf = ac.createBuffer(1, ac.sampleRate * 0.16, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.8);
    }
    const noise = ac.createBufferSource(); noise.buffer = buf;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.26, t);
    ng.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
    noise.connect(ng); ng.connect(ac.destination);
    noise.start(t);
  }

  const ARENA_IMGS = {};
  function preloadArena() {
    const list = [
      'fx-frost-overlay.png', 'arena-cup.png', 'arena-podium.png', 'cert-frame-pec.png',
      'sk-shield.png', 'sk-double.png', 'sk-snowball.png'
    ];
    CFG.campuses.forEach(c => list.push(c.badge.replace(/^assets\//, '')));
    CFG.zodiacAvatars.forEach(a => list.push(a.file.replace(/^assets\//, '')));
    list.forEach(f => {
      if (!ARENA_IMGS[f]) {
        const im = new Image();
        im.src = 'assets/' + f;
        ARENA_IMGS[f] = im;
      }
    });
  }

  const KID_NAMES = [
    'Minh Khôi', 'Bảo Ngọc', 'Gia Huy', 'An Nhiên', 'Tuấn Kiệt', 'Hà My',
    'Đức Anh', 'Khánh Linh', 'Đăng Khoa', 'Phương Thảo', 'Nhật Minh', 'Trâm Anh',
    'Hoàng Bách', 'Thảo Nhi', 'Quang Hải', 'Ngọc Diệp', 'Thiện Nhân', 'Bảo Châu'
  ];

  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
  };
  const pick = a => a[(Math.random() * a.length) | 0];

  function createRoomBus(room) {
    const key = 'pec-arena-room-' + String(room || 'PEC8').toUpperCase();
    let bc = null, ws = null;
    const handlers = [];
    const emitLocal = msg => handlers.forEach(fn => { try { fn(msg); } catch (e) {} });

    try {
      if (window.BroadcastChannel) {
        bc = new BroadcastChannel(key);
        bc.onmessage = e => { if (e && e.data) emitLocal(e.data); };
      }
    } catch (e) {}

    const onStorage = e => {
      if (e.key === key + ':ev' && e.newValue) {
        try { emitLocal(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);

    if (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      try {
        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(proto + '//' + location.host + '/api/arena?room=' + encodeURIComponent(room || 'PEC8'));
        ws.onmessage = e => { try { emitLocal(JSON.parse(e.data)); } catch (err) {} };
        ws.onerror = () => { try { ws.close(); } catch (err) {} ws = null; };
      } catch (e) { ws = null; }
    }

    return {
      send(payload) {
        const msg = Object.assign({ ts: Date.now(), room: String(room || 'PEC8').toUpperCase() }, payload);
        if (bc) try { bc.postMessage(msg); } catch (e) {}
        try { localStorage.setItem(key + ':ev', JSON.stringify(msg)); } catch (e) {}
        if (ws && ws.readyState === 1) try { ws.send(JSON.stringify(msg)); } catch (e) {}
      },
      saveState(st) { try { localStorage.setItem(key + ':state', JSON.stringify(st)); } catch (e) {} },
      loadState() { try { return JSON.parse(localStorage.getItem(key + ':state') || 'null'); } catch (e) { return null; } },
      on(fn) { handlers.push(fn); },
      close() {
        window.removeEventListener('storage', onStorage);
        if (bc) try { bc.close(); } catch (e) {}
        if (ws) try { ws.close(); } catch (e) {}
      }
    };
  }

  function spawnCheerBubble(emoji) {
    const el = document.createElement('div');
    el.className = 'ar-cheer-float';
    el.textContent = emoji || '❄️';
    el.style.left = (12 + Math.random() * 76).toFixed(1) + 'vw';
    el.style.setProperty('--cx', (Math.random() * 60 - 30).toFixed(0) + 'px');
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 1950);
  }

  function buildExtraPool(lv, B) {
    const extra = [];
    if (lv === 0 && B && B.WRAP_WORDS) {
      B.WRAP_WORDS.forEach((pair, idx) => {
        const w = pair[0], em = pair[1];
        const distractors = shuffle(B.WRAP_WORDS.filter(x => x[0] !== w)).slice(0, 3);
        const opts = shuffle([pair].concat(distractors));
        extra.push({
          id: 'KX' + idx,
          tier: (idx % 3) + 1,
          q: 'Listen & choose: "' + w.toUpperCase() + '"',
          audio: w,
          opts: opts.map(o => o[1] + ' ' + o[0]),
          ans: opts.findIndex(o => o[0] === w)
        });
      });
    } else if (lv === 1) {
      extra.push(
        { id: 'JX1', tier: 1, q: 'Reindeer have big antlers on their ________.', opts: ['heads', 'tails', 'shoes', 'pockets'], ans: 0 },
        { id: 'JX2', tier: 1, q: 'Christmas Eve is celebrated on December ________.', opts: ['20th', '24th', '26th', '31st'], ans: 1 },
        { id: 'JX3', tier: 2, q: 'My sister enjoys ________ Christmas cookies with Mom.', opts: ['bake', 'baking', 'baked', 'to baking'], ans: 1 },
        { id: 'JX4', tier: 2, q: "There isn't ________ snow on the roof yet.", opts: ['many', 'much', 'a few', 'several'], ans: 1 },
        { id: 'JX5', tier: 3, q: 'The gifts ________ wrapped carefully by the elves.', opts: ['was', 'were', 'is', 'has'], ans: 1 },
        { id: 'JX6', tier: 3, q: 'How ________ does Santa visit children? — Once a year!', opts: ['often', 'far', 'tall', 'heavy'], ans: 0 }
      );
    } else {
      extra.push(
        { id: 'TX1', tier: 1, q: 'A plant with red berries hung at Christmas is ________.', opts: ['holly', 'bamboo', 'cactus', 'lotus'], ans: 0 },
        { id: 'TX2', tier: 1, q: 'We look forward to ________ the PEC Finale together!', opts: ['watch', 'watching', 'watched', 'be watched'], ans: 1 },
        { id: 'TX3', tier: 2, q: 'Scarcely ________ the bell rung when the match started.', opts: ['had', 'has', 'did', 'was'], ans: 0 },
        { id: 'TX4', tier: 2, q: 'Which word is an ANTONYM of "generous"?', opts: ['kind', 'stingy', 'cheerful', 'festive'], ans: 1 },
        { id: 'TX5', tier: 3, q: 'Not only the kids but also the teacher ________ cheering loudly.', opts: ['are', 'is', 'were', 'have been'], ans: 1 },
        { id: 'TX6', tier: 3, q: '"To break the ice" means to make people feel ________.', opts: ['freezing cold', 'more relaxed together', 'angry', 'sleepy'], ans: 1 }
      );
    }
    return extra;
  }

  /* ==========================================================================
     KHỞI ĐỘNG ĐẤU TRƯỜNG 5VS5
     ========================================================================== */
  function startArena(B, launchOpts) {
    preloadArena();
    const S = B.S;
    const stage = document.getElementById('stage');
    const stepsEl = document.getElementById('steps');
    const appEl = document.querySelector('.app');
    const modeBadgeEl = document.getElementById('mode');
    if (stepsEl) stepsEl.innerHTML = '';

    let timers = [], rafs = [], activeBus = null, destroyed = false;
    const later = (fn, ms) => { const id = setTimeout(() => { if (!destroyed) fn(); }, ms); timers.push(id); return id; };
    const clearTimers = () => {
      timers.forEach(clearTimeout); timers = [];
      rafs.forEach(cancelAnimationFrame); rafs = [];
    };

    let selAvatar = (S.profile && S.profile.avatarId) || S.arenaAvatar || 'mao';
    let selBranchName = (S.profile && S.profile.branch) || S.arenaBranch || 'Tô Hiệu';
    let selLv = (S.profile && typeof S.profile.lv === 'number') ? S.profile.lv : (S.arenaLv || 0);
    let selPlayerName = (S.profile && S.profile.name) || S.arenaName || 'Chiến Binh Nhí';
    let autoPlayDemo = false;
    let roomPin = (launchOpts && launchOpts.room) ? String(launchOpts.room).toUpperCase() : 'PEC8';

    const getCampusByName = name => CFG.campuses.find(c => c.name === name) || CFG.campuses[0];
    const getAvatar = id => CFG.zodiacAvatars.find(a => a.id === id) || CFG.zodiacAvatars[3];

    function persistChoice() {
      S.arenaAvatar = selAvatar;
      S.arenaBranch = selBranchName;
      S.arenaLv = selLv;
      S.arenaName = selPlayerName;
      if (S.profile) {
        S.profile.avatarId = selAvatar;
        S.profile.branch = selBranchName;
        S.profile.lv = selLv;
      }
      B.save();
    }

    function setWideMode(on) {
      if (appEl) appEl.classList.toggle('arena-wide', !!on);
    }

    /* ==================== 1. SẢNH CHỌN 12 CON GIÁP ==================== */
    function renderLobby() {
      clearTimers();
      setWideMode(false);
      autoPlayDemo = false;
      if (modeBadgeEl) modeBadgeEl.style.display = '';
      if (activeBus) { activeBus.close(); activeBus = null; }
      const ptitle = document.getElementById('ptitle');
      if (ptitle) ptitle.textContent = 'Đấu trường 5vs5';
      if (stepsEl) stepsEl.innerHTML = '';

      const camp = getCampusByName(selBranchName);
      const av = getAvatar(selAvatar);
      const lvLabels = ['Tiểu Tinh Linh (Mầm non–Lớp 3)', 'Tuần Lộc (Lớp 4–7)', 'Ông Già Noel (Lớp 8+)'];

      stage.innerHTML = `
        <div class="ar-wrap">
          <div class="ar-card">
            <div class="ar-sec-head">
              <h4>1. Đội Cơ Sở & Nhân Vật Của Bé</h4>
              <span>12 Con Giáp Chibi</span>
            </div>

            <div class="ar-setup-row">
              <label class="ar-mini-fld">Cơ sở PEC đại diện
                <select id="arSelBr" ${S.profile ? 'disabled' : ''}>
                  ${CFG.campuses.map(c => `<option value="${esc(c.name)}" ${c.name === selBranchName ? 'selected' : ''}>PEC ${esc(c.name)}</option>`).join('')}
                </select>
              </label>
              <label class="ar-mini-fld">Bảng đấu cấp độ
                <select id="arSelLv" ${S.profile ? 'disabled' : ''}>
                  ${lvLabels.map((lb, i) => `<option value="${i}" ${i === selLv ? 'selected' : ''}>${lb}</option>`).join('')}
                </select>
              </label>
            </div>

            <div class="ar-hero-preview">
              <img class="av-big" src="${av.file}" alt="${esc(av.name)}">
              <div class="ar-hero-info">
                <b>${esc(S.profile ? S.profile.name : selPlayerName)} · ${esc(av.zodiac)} (${esc(av.name)})</b>
                <small style="color:${camp.color === '#E73236' ? '#FF9AA0' : '#FFE680'}">⚑ Đội PEC ${esc(camp.name)} — ${esc(camp.teamTitle)}</small>
              </div>
              <img class="br-ico" src="${camp.badge}" alt="${esc(camp.name)}">
            </div>

            <div class="ar-zodiac-grid" id="arZGrid">
              ${CFG.zodiacAvatars.map(z => `
                <button type="button" class="ar-zbtn ${z.id === selAvatar ? 'on' : ''}" data-zid="${z.id}" aria-label="${esc(z.zodiac)} ${esc(z.name)}">
                  <img src="${z.file}" alt="${esc(z.name)}">
                  <span class="zn">${z.order}. ${esc(z.zodiac)}</span>
                  <span class="zy">${esc(z.name)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <button type="button" class="ar-cta-main" id="arBtnQuick">
            <span>❄️</span> Vào Sân Băng Đấu 5vs5!
          </button>

          ${S.profile ? '' : '<p class="hint" style="text-align:center">Đăng ký để trận đấu được tính điểm và kẹo</p>'}
        </div>
      `;

      stage.querySelector('#arSelBr').onchange = e => { selBranchName = e.target.value; persistChoice(); B.tone(988, 0.08, 'triangle', 0.07); renderLobby(); };
      stage.querySelector('#arSelLv').onchange = e => { selLv = +e.target.value; persistChoice(); B.tone(1046, 0.08, 'triangle', 0.07); renderLobby(); };
      stage.querySelector('#arZGrid').onclick = e => {
        const b = e.target.closest('[data-zid]');
        if (!b) return;
        B.unlockAudio();
        selAvatar = b.dataset.zid;
        persistChoice();
        B.tone(1175, 0.09, 'triangle', 0.09);
        B.tone(1568, 0.12, 'sine', 0.08, 0.06);
        renderLobby();
      };

      const readPin = () => { roomPin = (stage.querySelector('#arPinIn').value || 'PEC8').trim().toUpperCase() || 'PEC8'; return roomPin; };
      // Vé chỉ bị trừ khi bấm vào trận, không trừ khi mới mở sảnh
      const qb = stage.querySelector('#arBtnQuick');
      qb.onclick = () => {
        if (qb.disabled) return; qb.disabled = true; B.unlockAudio(); persistChoice();
        Promise.resolve(B.beginRound ? B.beginRound() : null).then(() => { if (!destroyed) startMatchmaking(false, roomPin); }, () => { qb.disabled = false; });
      };
    }

    /* ==================== 2. GHÉP ĐỘI 5VS5 NGẪU NHIÊN THEO CƠ SỞ ==================== */
    function buildMatchSetup(oppCampusOverride) {
      const myCamp = getCampusByName(selBranchName);
      const others = CFG.campuses.filter(c => c.id !== myCamp.id);
      const oppCamp = oppCampusOverride || pick(others);
      const names = shuffle(KID_NAMES);
      const otherAvs = shuffle(CFG.zodiacAvatars.filter(a => a.id !== selAvatar));
      const oppAvs = shuffle(CFG.zodiacAvatars);

      const teamA = [], teamB = [];
      let ni = 0;
      for (let lane = 0; lane < 5; lane++) {
        if (lane === 2) {
          teamA.push({ lane, isMe: true, name: S.profile ? S.profile.name : selPlayerName, avatar: getAvatar(selAvatar), score: 0, streak: 0, wins: 0, correctMs: 0, immunity: 0 });
        } else {
          teamA.push({ lane, isMe: false, bot: true, name: names[ni++] + ' 🤖', avatar: otherAvs[lane < 2 ? lane : lane - 1], score: 0, streak: 0, wins: 0, correctMs: 0, acc: 0.72 + Math.random() * 0.14 });
        }
        teamB.push({ lane, isMe: false, bot: true, name: names[ni++] + ' 🤖', avatar: oppAvs[lane], score: 0, streak: 0, wins: 0, correctMs: 0, immunity: 0, acc: 0.66 + Math.random() * 0.16 });
      }

      const lvKey = ['kids', 'junior', 'teen'][selLv] || 'kids';
      const basePool = (CFG.questionBank[lvKey] || CFG.questionBank.kids).concat(buildExtraPool(selLv, B));
      const usedIds = {};
      const rounds = [];

      for (let r = 1; r <= 10; r++) {
        const tier = r <= 3 ? 1 : r <= 7 ? 2 : 3;
        let candidates = shuffle(basePool.filter(q => q.tier === tier && !usedIds[q.id]));
        if (candidates.length < 5) candidates = candidates.concat(shuffle(basePool.filter(q => !usedIds[q.id])));
        if (candidates.length < 5) { Object.keys(usedIds).forEach(k => delete usedIds[k]); candidates = shuffle(basePool); }
        const laneQs = candidates.slice(0, 5);
        laneQs.forEach(q => { usedIds[q.id] = 1; });
        rounds.push({ round: r, mult: r >= 9 ? 2 : 1, laneQs });
      }

      return {
        room: roomPin, level: selLv, myCamp, oppCamp, teamA, teamB,
        teamAScore: 0, teamBScore: 0, cheerA: 12, cheerB: 10,
        rounds, roundIdx: 0, laneBalance: [50, 50, 50, 50, 50],
        skillsUsed: { shield: false, double: false, snowball: false },
        skillsArmed: { shield: false, double: false, snowballNext: false },
        incomingFrostNext: false, enemyFrostCastDone: false
      };
    }

    function startMatchmaking(isLiveRoom, pin) {
      clearTimers();
      if (modeBadgeEl) modeBadgeEl.style.display = 'none';
      activeBus = createRoomBus(pin);
      const savedRoom = isLiveRoom ? activeBus.loadState() : null;
      const oppOverride = savedRoom && savedRoom.oppCampId
        ? CFG.campuses.find(c => c.id === savedRoom.oppCampId && c.name !== selBranchName)
        : null;
      const M = buildMatchSetup(oppOverride);

      stage.innerHTML = `
        <div class="ar-wrap">
          <div class="ar-card ar-mm">
            <div class="ar-round-pill" style="display:inline-block;margin-bottom:6px">
              ${isLiveRoom ? '📡 PHÒNG GO-LIVE #' + esc(pin) : '🤖 TRẬN LUYỆN CÙNG 9 BẠN MÁY'}
            </div>
            <div class="ar-vs-banner">
              <div class="ar-team-card" style="--tc:${M.myCamp.color}">
                <img class="bdg" src="${M.myCamp.badge}" alt="">
                <b>PEC ${esc(M.myCamp.name)}</b>
                <small>${esc(M.myCamp.teamTitle)}</small>
              </div>
              <div class="ar-vs-badge">VS</div>
              <div class="ar-team-card" style="--tc:${M.oppCamp.color}">
                <img class="bdg" src="${M.oppCamp.badge}" id="mmOppBdg" alt="">
                <b id="mmOppName">Đang quay số...</b>
                <small id="mmOppSub">Tìm đối thủ 5vs5</small>
              </div>
            </div>
            <div id="mmPairs"></div>
            <p class="hint" id="mmStatus" style="margin-top:8px;color:#FFE680">Đồng đội và đối thủ là bạn máy · bé đấu ở làn giữa</p>
          </div>
        </div>
      `;

      let spin = 0;
      const spinTick = () => {
        if (spin < 4) {
          const rc = CFG.campuses[(spin + 1) % CFG.campuses.length];
          const bdg = document.getElementById('mmOppBdg');
          const nm = document.getElementById('mmOppName');
          if (bdg) bdg.src = rc.badge;
          if (nm) nm.textContent = 'PEC ' + rc.name;
          B.tone(660 + spin * 90, 0.06, 'triangle', 0.06);
          spin++;
          later(spinTick, 150);
        } else {
          const bdg = document.getElementById('mmOppBdg');
          const nm = document.getElementById('mmOppName');
          const sb = document.getElementById('mmOppSub');
          if (bdg) bdg.src = M.oppCamp.badge;
          if (nm) nm.textContent = 'PEC ' + M.oppCamp.name;
          if (sb) sb.textContent = M.oppCamp.teamTitle;
          B.jingle();

          const pairsBox = document.getElementById('mmPairs');
          if (pairsBox) {
            pairsBox.innerHTML = M.teamA.map((pa, i) => {
              const pb = M.teamB[i];
              return `
                <div class="ar-roster-pair ${pa.isMe ? 'me' : ''}">
                  <div class="ar-rp-side"><img src="${pa.avatar.file}" alt=""><span>${esc(pa.name)}${pa.isMe ? ' (Bạn)' : ''}</span></div>
                  <span style="color:#FFE680;font-family:'Baloo 2'">❄️</span>
                  <div class="ar-rp-side r"><img src="${pb.avatar.file}" alt=""><span>${esc(pb.name)}</span></div>
                </div>
              `;
            }).join('');
          }
          const stTxt = document.getElementById('mmStatus');
          if (stTxt) stTxt.textContent = 'Đã khóa đối thủ! Bước ra Sân Băng...';
          syncBroadcast(M, 'INTRO');
          later(() => runMatchBattle(M), 1250);
        }
      };
      spinTick();
    }

    function syncBroadcast(M, phase, extra) {
      if (!activeBus) return;
      const snap = {
        type: 'MATCH_SNAPSHOT', phase, room: M.room,
        round: M.roundIdx + 1,
        mult: M.rounds[M.roundIdx] ? M.rounds[M.roundIdx].mult : 1,
        myCamp: M.myCamp, oppCamp: M.oppCamp,
        teamAScore: M.teamAScore, teamBScore: M.teamBScore,
        laneBalance: M.laneBalance,
        laneQs: M.rounds[M.roundIdx] ? M.rounds[M.roundIdx].laneQs.map(q => q.q) : [],
        teamA: M.teamA.map(p => ({ name: p.name, isMe: p.isMe, av: p.avatar.file, zodiac: p.avatar.zodiac, score: p.score, streak: p.streak, lastAct: p.lastAct || '', lastTag: p.lastTag || '' })),
        teamB: M.teamB.map(p => ({ name: p.name, av: p.avatar.file, zodiac: p.avatar.zodiac, score: p.score, streak: p.streak, lastAct: p.lastAct || '', lastTag: p.lastTag || '' })),
        extra: extra || null
      };
      activeBus.saveState(snap);
      activeBus.send(snap);
    }

    /* ==================== 3. VÕ ĐÀI CẬN CẢNH ĐỐI KHÁNG 1V1 + 4 CẶP ĐỒNG ĐỘI ==================== */
    function runMatchBattle(M) {
      clearTimers();
      setWideMode(false);
      if (modeBadgeEl) modeBadgeEl.style.display = 'none';

      if (activeBus) {
        activeBus.on(msg => {
          if (!msg) return;
          if (msg.type === 'SPECTATOR_CHEER') spawnCheerBubble(msg.emoji || '❄️');
          else if (msg.type === 'MC_FORCE_FROST') {
            M.incomingFrostNext = true;
            B.toast('🎙️ MC vừa kích hoạt thử thách Bão Tuyết Mờ!');
          }
        });
      }

      let dispScoreA = 0, dispScoreB = 0;
      const allyLanes = [0, 1, 3, 4]; // 4 cặp đồng đội ngoài người chơi (L3 = index 2)

      function animateTeamScores(targetA, targetB) {
        const elA = document.getElementById('arScA');
        const elB = document.getElementById('arScB');
        const tugL = document.getElementById('arTugL');
        const tugR = document.getElementById('arTugR');
        const tugSp = document.getElementById('arTugSp');
        const startA = dispScoreA, startB = dispScoreB;
        const t0 = performance.now();

        const step = now => {
          if (destroyed) return;
          const k = Math.min(1, (now - t0) / 520);
          const ease = 1 - Math.pow(1 - k, 3);
          dispScoreA = Math.round(startA + (targetA - startA) * ease);
          dispScoreB = Math.round(startB + (targetB - startB) * ease);
          if (elA) elA.textContent = dispScoreA.toLocaleString('vi-VN');
          if (elB) elB.textContent = dispScoreB.toLocaleString('vi-VN');
          const sum = Math.max(1, targetA + targetB);
          const pctA = targetA === 0 && targetB === 0 ? 50 : Math.max(16, Math.min(84, (targetA / sum) * 100));
          if (tugL) tugL.style.width = pctA.toFixed(1) + '%';
          if (tugR) tugR.style.width = (100 - pctA).toFixed(1) + '%';
          if (tugSp) tugSp.style.left = pctA.toFixed(1) + '%';
          if (k < 1) rafs.push(requestAnimationFrame(step));
        };
        rafs.push(requestAnimationFrame(step));
      }

      const me = M.teamA[2];
      const opp = M.teamB[2];

      stage.innerHTML = `
        <div class="ar-wrap">
          <!-- Thanh Điểm Tổng Kéo Co 2 Cơ Sở -->
          <div class="ar-score-hud">
            <div class="ar-sh-top">
              <div class="ar-sh-team">
                <img src="${M.myCamp.badge}" alt="">
                <div>
                  <div class="tn">PEC ${esc(M.myCamp.name)}</div>
                  <div class="ts" id="arScA">0</div>
                </div>
              </div>
              <div class="ar-clock-box">
                <span class="ar-round-pill" id="arRndPill">LƯỢT 1/10</span>
                <div class="ar-timer" id="arClock">10</div>
              </div>
              <div class="ar-sh-team r">
                <img src="${M.oppCamp.badge}" alt="">
                <div>
                  <div class="tn">PEC ${esc(M.oppCamp.name)}</div>
                  <div class="ts" id="arScB">0</div>
                </div>
              </div>
            </div>
            <div class="ar-tug" style="--ca:${M.myCamp.color};--cb:${M.oppCamp.color}">
              <div class="ar-tug-l" id="arTugL"></div>
              <div class="ar-tug-r" id="arTugR"></div>
              <div class="ar-tug-spark" id="arTugSp"></div>
            </div>
          </div>

          <!-- Dải 4 Cặp Đồng Đội Đang Chiến Đấu Cùng Lúc -->
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0 2px">
            <span style="font-size:11px;font-weight:800;color:#CFE2FF">⚡ 4 cặp đồng đội cùng đội hình 5vs5:</span>
            <button type="button" class="lk" id="arToggleAuto" style="display:none;font-size:11px;min-height:18px;color:${autoPlayDemo ? '#5CE0B8' : '#FFE680'}">
              ${autoPlayDemo ? '🤖 Tự đấu mẫu: BẬT' : '🤖 Tự đấu mẫu: TẮT'}
            </button>
          </div>
          <div class="ar-mini-squad">
            ${allyLanes.map(li => `
              <div class="ar-ms-cell" id="arMsCell${li}">
                <div class="ar-ms-vs">
                  <img class="l" src="${M.teamA[li].avatar.file}" alt="">
                  <span class="ms-mid" id="arMsMid${li}">⚔</span>
                  <img class="r" src="${M.teamB[li].avatar.file}" alt="">
                </div>
                <div class="ar-ms-st" id="arMsSt${li}">Làn ${li + 1}</div>
              </div>
            `).join('')}
          </div>

          <!-- VÕ ĐÀI CẬN CẢNH NHÂN VẬT LỚN (HERO CLOSE-UP DUEL STAGE) -->
          <div class="ar-duel-viewport" id="arViewport">
            <div class="ar-duel-cam" id="arCam">
              <div class="ar-speed-lines"></div>
              <div class="ar-stage-vs">VS</div>

              <!-- Chiến binh CỦA BẠN (Bên Trái - Khổng lồ) -->
              <div class="ar-gladiator left" id="arHeroL">
                <div class="ar-glad-shadow"></div>
                <div class="ar-glad-body">
                  <div class="ar-power-flame"></div>
                  <img class="ar-glad-img" src="${me.avatar.file}" alt="${esc(me.avatar.name)}">
                  ${MEGA_GLOVE_SVG}
                  <div class="ar-ko-stars">💫⭐💫</div>
                </div>
                <div class="ar-glad-plate" style="border-color:${M.myCamp.color}">
                  <b>${esc(me.name)} (Bạn)</b>
                  <small id="arHeroMetaL">0 điểm · Sẵn sàng!</small>
                </div>
              </div>

              <!-- ĐỐI THỦ TRỰC TIẾP (Bên Phải - Khổng lồ) -->
              <div class="ar-gladiator right" id="arHeroR">
                <div class="ar-glad-shadow"></div>
                <div class="ar-glad-body">
                  <div class="ar-power-flame"></div>
                  <img class="ar-glad-img" src="${opp.avatar.file}" alt="${esc(opp.avatar.name)}">
                  ${MEGA_GLOVE_SVG}
                  <div class="ar-ko-stars">💫⭐💫</div>
                </div>
                <div class="ar-glad-plate" style="border-color:${M.oppCamp.color}">
                  <b>${esc(opp.name)}</b>
                  <small id="arHeroMetaR">0 điểm · Sẵn sàng!</small>
                </div>
              </div>

              <canvas class="ar-duel-fx" id="arDuelFx"></canvas>
            </div>
            <div class="ar-hit-flash" id="arHitFlash"></div>
            <div class="ar-comic-burst" id="arComicBurst"></div>
          </div>

          <!-- KHUNG CÂU HỎI & 4 ĐÁP ÁN -->
          <div class="ar-qbox" id="arQBox">
            <div class="ar-qhead">
              <div class="ar-qtext" id="arQText">Đang phát câu hỏi...</div>
              <button type="button" class="ar-qsay" id="arQSay" style="display:none" aria-label="Nghe câu hỏi">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#6E3800"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#6E3800" stroke-width="2.2" stroke-linecap="round"/></svg>
              </button>
            </div>
            <div class="ar-opts" id="arOpts"></div>
            <div class="ar-frost-wrap" id="arFrostWrap" style="display:none">
              <canvas class="ar-frost-cv" id="arFrostCv"></canvas>
              <div class="ar-frost-tip">❄️ Dùng ngón tay quẹt lau tan sương băng!</div>
            </div>
          </div>

          <!-- THANH 3 KỸ NĂNG CHIẾN THUẬT -->
          <div class="ar-skills" id="arSkills"></div>
        </div>
      `;

      stage.querySelector('#arToggleAuto').onclick = () => {
        autoPlayDemo = !autoPlayDemo;
        const bAuto = stage.querySelector('#arToggleAuto');
        bAuto.textContent = autoPlayDemo ? '🤖 Tự đấu mẫu: BẬT' : '🤖 Tự đấu mẫu: TẮT';
        bAuto.style.color = autoPlayDemo ? '#5CE0B8' : '#FFE680';
        B.toast(autoPlayDemo ? '🤖 Đã bật Tự đấu mẫu: máy tự trả lời để bạn xem trọn hiệu ứng tung cú đấm!' : '👆 Đã tắt Tự đấu mẫu: bạn tự chọn đáp án!');
      };

      /* ---------- HIỆU ỨNG SÓNG XUNG KÍCH, SAO NỔ & MẢNH BĂNG VĂNG TRÊN CANVAS VÕ ĐÀI ---------- */
      let fxRings = [], fxShards = [], fxLooping = false;
      function triggerImpactVFX(hitXRatio, hitYRatio, colorMain) {
        const vp = document.getElementById('arViewport');
        const cv = document.getElementById('arDuelFx');
        const flash = document.getElementById('arHitFlash');
        if (!vp || !cv) return;

        // Hit-stop chớp sáng + Rung lắc toàn khung hình!
        if (flash) { flash.classList.remove('bang'); void flash.offsetWidth; flash.classList.add('bang'); }
        vp.classList.remove('shake'); void vp.offsetWidth; vp.classList.add('shake');

        const r = vp.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.max(1, Math.round(r.width * dpr));
        cv.height = Math.max(1, Math.round(r.height * dpr));
        const cx = r.width * hitXRatio;
        const cy = r.height * hitYRatio;

        // 2 vòng sóng xung kích lan tỏa cực nhanh
        fxRings.push({ x: cx, y: cy, r: 8, maxR: 118, col: '#FFFFFF', w: 7, life: 0.38, maxLife: 0.38 });
        fxRings.push({ x: cx, y: cy, r: 4, maxR: 145, col: colorMain || '#FFD525', w: 5, life: 0.48, maxLife: 0.48 });

        // 26 mảnh băng, tia lửa vàng & ngôi sao bắn tung tóe khỏi điểm va chạm!
        const palette = ['#FFFFFF', '#FFD525', '#FF545A', '#5CE0B8', '#8ED8FF'];
        for (let i = 0; i < 26; i++) {
          const ang = (Math.PI * 2 * i) / 26 + (Math.random() - 0.5) * 0.25;
          const spd = 95 + Math.random() * 195;
          fxShards.push({
            x: cx, y: cy,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 40,
            sz: 4 + Math.random() * 6,
            col: palette[i % palette.length],
            star: i % 3 === 0,
            life: 0.72
          });
        }

        if (!fxLooping) {
          fxLooping = true;
          let last = performance.now();
          const loop = now => {
            if (destroyed) { fxLooping = false; return; }
            const c = document.getElementById('arDuelFx');
            if (!c) { fxLooping = false; return; }
            const ctx = c.getContext('2d');
            const dp = Math.min(2, window.devicePixelRatio || 1);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            ctx.setTransform(dp, 0, 0, dp, 0, 0);
            ctx.clearRect(0, 0, c.width / dp, c.height / dp);

            for (let i = fxRings.length - 1; i >= 0; i--) {
              const rg = fxRings[i];
              rg.life -= dt;
              if (rg.life <= 0) { fxRings.splice(i, 1); continue; }
              const p = 1 - rg.life / rg.maxLife;
              const curR = rg.r + (rg.maxR - rg.r) * (1 - Math.pow(1 - p, 2));
              ctx.globalAlpha = Math.max(0, rg.life / rg.maxLife);
              ctx.strokeStyle = rg.col;
              ctx.lineWidth = rg.w * (1 - p * 0.6);
              ctx.beginPath();
              ctx.arc(rg.x, rg.y, Math.max(0, curR), 0, Math.PI * 2);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }

            for (let i = fxShards.length - 1; i >= 0; i--) {
              const s = fxShards[i];
              s.life -= dt;
              s.x += s.vx * dt;
              s.y += s.vy * dt;
              s.vy += 280 * dt;
              if (s.life <= 0) { fxShards.splice(i, 1); continue; }
              ctx.globalAlpha = Math.max(0, s.life / 0.72);
              ctx.fillStyle = s.col;
              if (s.star) {
                ctx.beginPath();
                ctx.arc(s.x, s.y, Math.max(0, s.sz * 0.9), 0, Math.PI * 2);
                ctx.fill();
              } else {
                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.rotate(s.life * 10);
                ctx.fillRect(-s.sz / 2, -s.sz / 2, s.sz, s.sz * 1.3);
                ctx.restore();
              }
              ctx.globalAlpha = 1;
            }

            if (fxRings.length || fxShards.length) rafs.push(requestAnimationFrame(loop));
            else fxLooping = false;
          };
          rafs.push(requestAnimationFrame(loop));
        }
      }

      function activateInteractiveFrost() {
        const wrap = document.getElementById('arFrostWrap');
        const cv = document.getElementById('arFrostCv');
        if (!wrap || !cv) return;
        wrap.style.display = 'block';
        const rect = wrap.getBoundingClientRect();
        const w = Math.max(240, Math.round(rect.width || 320));
        const h = Math.max(120, Math.round(rect.height || 150));
        cv.width = w; cv.height = h;
        const ctx = cv.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        const frostIm = ARENA_IMGS['fx-frost-overlay.png'];
        if (frostIm && frostIm.complete && frostIm.naturalWidth > 0) ctx.drawImage(frostIm, 0, 0, w, h);
        else { ctx.fillStyle = 'rgba(195, 236, 255, 0.95)'; ctx.fillRect(0, 0, w, h); }

        let wipedStrokes = 0;
        const wipeAt = (clientX, clientY) => {
          const r = cv.getBoundingClientRect();
          const x = clientX - r.left, y = clientY - r.top;
          ctx.globalCompositeOperation = 'destination-out';
          const rad = ctx.createRadialGradient(x, y, 6, x, y, 38);
          rad.addColorStop(0, 'rgba(0,0,0,1)');
          rad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = rad;
          ctx.beginPath(); ctx.arc(x, y, 38, 0, Math.PI * 2); ctx.fill();
          if (++wipedStrokes >= 15) { wrap.style.display = 'none'; B.toast('✨ Đã lau sạch sương băng!'); }
        };
        cv.onpointerdown = e => { e.preventDefault(); wipeAt(e.clientX, e.clientY); };
        cv.onpointermove = e => { if (e.buttons || e.pointerType === 'touch') wipeAt(e.clientX, e.clientY); };
        cv.ontouchstart = e => { e.preventDefault(); if (e.touches[0]) wipeAt(e.touches[0].clientX, e.touches[0].clientY); };
        cv.ontouchmove = e => { e.preventDefault(); if (e.touches[0]) wipeAt(e.touches[0].clientX, e.touches[0].clientY); };
        later(() => { if (wrap.style.display !== 'none') wrap.style.display = 'none'; }, 2400);
      }

      function renderSkillButtons() {
        const box = document.getElementById('arSkills');
        if (!box) return;
        const canSnowball = selLv >= 1 && !M.skillsUsed.snowball && me.streak >= 3 && (opp.immunity || 0) <= 0;
        box.innerHTML = `
          <button type="button" class="ar-skbtn ${M.skillsArmed.shield ? 'armed' : ''}" id="skShield" ${M.skillsUsed.shield && !M.skillsArmed.shield ? 'disabled' : ''}>
            <img src="assets/sk-shield.png" alt="">
            <div><b>Khiên Tuyết</b><br><span style="color:#FFE680">${M.skillsArmed.shield ? 'Đang bật!' : M.skillsUsed.shield ? 'Đã dùng' : 'Đỡ đòn +30đ'}</span></div>
          </button>
          <button type="button" class="ar-skbtn ${M.skillsArmed.double ? 'armed' : ''}" id="skDouble" ${M.skillsUsed.double && !M.skillsArmed.double ? 'disabled' : ''}>
            <img src="assets/sk-double.png" alt="">
            <div><b>Sao Nhân Đôi</b><br><span style="color:#FFE680">${M.skillsArmed.double ? 'Đang ×2!' : M.skillsUsed.double ? 'Đã dùng' : 'Nhân ×2 điểm'}</span></div>
          </button>
          ${selLv >= 1 ? `
            <button type="button" class="ar-skbtn ${M.skillsArmed.snowballNext ? 'armed' : ''}" id="skSnow" ${(!canSnowball && !M.skillsArmed.snowballNext) ? 'disabled' : ''}>
              <img src="assets/sk-snowball.png" alt="">
              <div><b>Bão Tuyết 1s</b><br><span style="color:#5CE0B8">${M.skillsArmed.snowballNext ? 'Đã nạp!' : M.skillsUsed.snowball ? 'Đã dùng' : 'Mở ở Combo ×3'}</span></div>
            </button>
          ` : ''}
        `;

        const bSh = box.querySelector('#skShield');
        if (bSh && !bSh.disabled) bSh.onclick = () => {
          if (M.skillsUsed.shield) return;
          M.skillsUsed.shield = true; M.skillsArmed.shield = true;
          B.tone(880, 0.12, 'sine', 0.1); B.toast('🛡️ Đã bật Khiên Tuyết Ấm đỡ đòn lượt này!');
          renderSkillButtons();
        };
        const bDb = box.querySelector('#skDouble');
        if (bDb && !bDb.disabled) bDb.onclick = () => {
          if (M.playerLockedThisRound) { B.toast('Bật Sao Nhân Đôi trước khi chọn đáp án nhé!'); return; }
          if (M.skillsUsed.double) return;
          M.skillsUsed.double = true; M.skillsArmed.double = true;
          B.tone(1318, 0.12, 'triangle', 0.1); B.toast('⭐ Đã bật Sao Nhân Đôi: lượt này ×2 điểm!');
          renderSkillButtons();
        };
        const bSn = box.querySelector('#skSnow');
        if (bSn && !bSn.disabled) bSn.onclick = () => {
          if (M.skillsUsed.snowball) return;
          M.skillsUsed.snowball = true; M.skillsArmed.snowballNext = true;
          B.tone(1046, 0.14, 'triangle', 0.1); B.toast('❄️ Đã nạp Bão Tuyết phủ mờ đối thủ ở câu sau!');
          renderSkillButtons();
        };
      }

      /* ---------- VÒNG LẶP 10 LƯỢT ĐẤU CẬN CẢNH ---------- */
      function startRound(rIdx) {
        M.roundIdx = rIdx;
        M.playerLockedThisRound = false;
        if (stepsEl) {
          stepsEl.innerHTML = Array.from({ length: 10 }, (_, i) => `<i class="${i < rIdx ? 'ok' : i === rIdx ? 'now' : ''}" style="width:18px;height:18px"></i>`).join('');
        }

        // Reset camera & tư thế võ sĩ về thế thủ sẵn sàng chiến đấu
        const vp = document.getElementById('arViewport');
        const heroL = document.getElementById('arHeroL');
        const heroR = document.getElementById('arHeroR');
        const metaL = document.getElementById('arHeroMetaL');
        const metaR = document.getElementById('arHeroMetaR');
        if (vp) vp.className = 'ar-duel-viewport';
        if (heroL) heroL.className = 'ar-gladiator left' + (me.streak >= 2 ? ' on-fire' : '');
        if (heroR) heroR.className = 'ar-gladiator right' + (opp.streak >= 2 ? ' on-fire' : '');
        if (metaL) metaL.textContent = `${me.score}đ${me.streak >= 2 ? ' · 🔥×' + me.streak : ' · Đang đấu!'}`;
        if (metaR) metaR.textContent = `${opp.score}đ${opp.streak >= 2 ? ' · 🔥×' + opp.streak : ' · Đang đấu!'}`;

        allyLanes.forEach(li => {
          const cell = document.getElementById('arMsCell' + li);
          const mid = document.getElementById('arMsMid' + li);
          const st = document.getElementById('arMsSt' + li);
          if (cell) cell.className = 'ar-ms-cell';
          if (mid) mid.textContent = '⚔';
          if (st) st.textContent = `Làn ${li + 1} · Đang tính`;
        });

        const rData = M.rounds[rIdx];
        const pill = document.getElementById('arRndPill');
        if (pill) {
          pill.textContent = rData.mult > 1 ? `🔥 LƯỢT ${rData.round}/10 · ×2!` : `LƯỢT ${rData.round}/10`;
          pill.className = 'ar-round-pill' + (rData.mult > 1 ? ' x2' : '');
        }
        if (rData.round === 9) {
          B.jingle();
          B.toast('🔥 VỀ ĐÍCH BÙNG NỔ (LƯỢT 9 & 10): NHÂN ĐÔI ĐIỂM!');
        }

        if (opp.immunity > 0) opp.immunity--;

        const myQ = rData.laneQs[2];
        const qText = document.getElementById('arQText');
        const qSay = document.getElementById('arQSay');
        const optsEl = document.getElementById('arOpts');
        if (qText) qText.textContent = myQ.q;
        if (qSay) {
          if (myQ.audio) {
            qSay.style.display = 'grid';
            qSay.onclick = () => { B.unlockAudio(); B.speak(myQ.audio); };
            later(() => B.speak(myQ.audio), 160);
          } else {
            qSay.style.display = 'none';
          }
        }

        const letters = ['A', 'B', 'C', 'D'];
        if (optsEl) {
          optsEl.innerHTML = myQ.opts.map((op, oi) => `
            <button type="button" class="ar-opt" data-oi="${oi}">
              <span class="ok-let">${letters[oi]}</span>
              <span>${esc(op)}</span>
            </button>
          `).join('');
        }

        if (M.incomingFrostNext) {
          M.incomingFrostNext = false;
          activateInteractiveFrost();
        }
        renderSkillButtons();

        const roundStart = performance.now();
        const ansA = Array(5).fill(null);
        const ansB = Array(5).fill(null);
        let roundResolved = false;

        for (let i = 0; i < 5; i++) {
          const qLane = rData.laneQs[i];
          if (i !== 2) {
            const dA = Math.round(1600 + Math.random() * 5200);
            const okA = Math.random() < M.teamA[i].acc;
            later(() => {
              if (roundResolved || ansA[i]) return;
              ansA[i] = { ok: okA, choice: okA ? qLane.ans : (qLane.ans + 1) % 4, ms: dA };
            }, dA);
          }

          const frostPen = (i === 2 && M.skillsArmed.snowballNext) ? 1350 : 0;
          if (i === 2 && M.skillsArmed.snowballNext) {
            M.skillsArmed.snowballNext = false;
            opp.immunity = 3;
          }
          const dB = Math.min(9600, Math.round(1800 + Math.random() * 5200 + frostPen));
          const okB = Math.random() < (M.teamB[i].acc - (frostPen ? 0.2 : 0));
          later(() => {
            if (roundResolved || ansB[i]) return;
            ansB[i] = { ok: okB, choice: okB ? qLane.ans : (qLane.ans + 2) % 4, ms: dB };
            if (i === 2) {
              if (heroR) heroR.classList.add('charging');
              if (metaR) metaR.textContent = `⚡ Đã nạp đòn (${(dB / 1000).toFixed(1)}s)`;
            }
          }, dB);
        }

        if (optsEl) {
          optsEl.onclick = e => {
            const btn = e.target.closest('[data-oi]');
            if (!btn || ansA[2] || roundResolved) return;
            B.unlockAudio();
            const choice = +btn.dataset.oi;
            const ms = Math.max(320, Math.min(9900, Math.round(performance.now() - roundStart)));
            ansA[2] = { ok: choice === myQ.ans, choice, ms };
            M.playerLockedThisRound = true;
            btn.classList.add('picked');

            // Nhân vật của người chơi gồng hào quang NẠP LỰC ĐẤM ngay tức khắc!
            sfxCharge(S.mute);
            if (heroL) heroL.classList.add('charging');
            if (metaL) metaL.textContent = `⚡ Nạp cầu tuyết ${(ms / 1000).toFixed(1)}s!`;

            later(() => {
              if (roundResolved) return;
              for (let i = 0; i < 5; i++) {
                const ql = rData.laneQs[i];
                if (!ansA[i]) {
                  const ok = Math.random() < M.teamA[i].acc;
                  ansA[i] = { ok, choice: ok ? ql.ans : (ql.ans + 1) % 4, ms: Math.min(9500, ms + 240 + i * 100) };
                }
                if (!ansB[i]) {
                  const ok = Math.random() < M.teamB[i].acc;
                  ansB[i] = { ok, choice: ok ? ql.ans : (ql.ans + 2) % 4, ms: Math.min(9600, ms + 300 + i * 110) };
                }
              }
              resolveRound();
            }, 680);
          };
        }

        syncBroadcast(M, 'QUESTION');

        if (autoPlayDemo) {
          later(() => {
            if (roundResolved || ansA[2] || !autoPlayDemo || !optsEl) return;
            const pickRight = Math.random() < 0.84;
            const idxPick = pickRight ? myQ.ans : (myQ.ans + 1) % 4;
            const targetBtn = optsEl.querySelector(`[data-oi="${idxPick}"]`);
            if (targetBtn) targetBtn.click();
          }, 1900);
        }

        const clockEl = document.getElementById('arClock');
        const tickClock = () => {
          if (destroyed || roundResolved) return;
          const elapsed = performance.now() - roundStart;
          const rem = Math.max(0, 10 - elapsed / 1000);
          if (clockEl) {
            clockEl.textContent = Math.ceil(rem);
            clockEl.classList.toggle('urg', rem <= 3.2);
          }
          if (elapsed >= 10000) resolveRound();
          else later(tickClock, 120);
        };
        tickClock();

        /* ---------- PHA PHÂN ĐỊNH & TUNG CÚ ĐẤM CẬN CẢNH (2.85 GIÂY) ---------- */
        function resolveRound() {
          if (roundResolved || destroyed) return;
          roundResolved = true;
          const frostWrap = document.getElementById('arFrostWrap');
          if (frostWrap) frostWrap.style.display = 'none';

          if (optsEl) {
            Array.prototype.forEach.call(optsEl.querySelectorAll('.ar-opt'), b => {
              const oi = +b.dataset.oi;
              if (oi === myQ.ans) b.classList.add('correct');
              else if (ansA[2] && ansA[2].choice === oi) b.classList.add('wrong');
            });
          }

          const speedBonus = ms => (ms <= 1500 ? 50 : Math.max(0, Math.round((50 * (10000 - ms)) / 8500)));
          const mult = rData.mult;
          let deltaTeamA = 0, deltaTeamB = 0;

          for (let i = 0; i < 5; i++) {
            const pa = M.teamA[i], pb = M.teamB[i];
            const a = ansA[i] || { ok: false, choice: -1, ms: 10000 };
            const b = ansB[i] || { ok: false, choice: -1, ms: 10000 };
            let ptsA = 0, ptsB = 0, outcome = 'MISS', stageActA = '', stageActB = '';

            if (a.ok && !b.ok) {
              ptsA = (100 + speedBonus(a.ms)) * mult;
              outcome = 'A_SOLO_PUNCH';
              stageActA = 'act-win'; stageActB = 'act-fall';
              pa.streak++; pb.streak = 0; pa.wins++; pa.correctMs += a.ms;
              M.laneBalance[i] = Math.min(82, M.laneBalance[i] + 12);
            } else if (!a.ok && b.ok) {
              ptsB = (100 + speedBonus(b.ms)) * mult;
              outcome = 'B_SOLO_PUNCH';
              stageActB = 'act-win'; stageActA = 'act-fall';
              pb.streak++; pa.streak = 0; pb.wins++; pb.correctMs += b.ms;
              M.laneBalance[i] = Math.max(18, M.laneBalance[i] - 12);
            } else if (a.ok && b.ok) {
              pa.correctMs += a.ms; pb.correctMs += b.ms;
              const diff = Math.abs(a.ms - b.ms);
              if (diff <= 150) {
                ptsA = (100 + speedBonus(a.ms)) * mult;
                ptsB = (100 + speedBonus(b.ms)) * mult;
                outcome = 'TIE_CLASH';
                stageActA = 'act-win'; stageActB = 'act-win';
                pa.streak++; pb.streak++;
              } else if (a.ms < b.ms) {
                ptsA = (100 + speedBonus(a.ms)) * mult;
                ptsB = 70 * mult;
                outcome = 'A_CLASH_WIN';
                stageActA = 'act-win'; stageActB = 'act-fall';
                pa.streak++; pb.streak = 0; pa.wins++;
                M.laneBalance[i] = Math.min(82, M.laneBalance[i] + 8);
              } else {
                ptsB = (100 + speedBonus(b.ms)) * mult;
                ptsA = 70 * mult;
                outcome = 'B_CLASH_WIN';
                stageActB = 'act-win'; stageActA = 'act-fall';
                pb.streak++; pa.streak = 0; pb.wins++;
                M.laneBalance[i] = Math.max(18, M.laneBalance[i] - 8);
              }
            } else {
              outcome = 'BOTH_MISS';
              pa.streak = 0; pb.streak = 0;
            }

            // Kỹ năng & Biểu diễn CÚ ĐẤM CẬN CẢNH trên Làn 3 của Người chơi!
            if (i === 2) {
              let comicText = '';
              if (M.skillsArmed.double) {
                M.skillsArmed.double = false;
                if (ptsA > 0) ptsA *= 2;
              }
              if (M.skillsArmed.shield) {
                M.skillsArmed.shield = false;
                if (!a.ok) {
                  ptsA = 30 * mult;
                  outcome = 'SHIELD_BLOCK';
                }
              }
              if (selLv >= 1 && !M.enemyFrostCastDone && pb.streak >= 2 && rIdx < 8) {
                M.enemyFrostCastDone = true;
                M.incomingFrostNext = true;
              }

              // Bật Camera Zoom + Speed Lines trên Võ Đài Cận Cảnh!
              if (vp) {
                vp.classList.add('clash-mode');
                if (outcome === 'A_SOLO_PUNCH' || outcome === 'A_CLASH_WIN') vp.classList.add('zoom-l');
                else if (outcome === 'B_SOLO_PUNCH' || outcome === 'B_CLASH_WIN') vp.classList.add('zoom-r');
                else vp.classList.add('zoom-c');
              }

              if (outcome === 'A_SOLO_PUNCH') {
                comicText = `❄️ CẦU TUYẾT SẤM SÉT! +${ptsA}Đ!`;
                if (heroL) { heroL.className = 'ar-gladiator left do-punch'; }
                if (heroR) { heroR.className = 'ar-gladiator right do-ko'; }
                sfxWhoosh(S.mute, 0.22);
                later(() => {
                  sfxHeavyPunch(S.mute, 0);
                  B.ding(); B.gain();
                  triggerImpactVFX(0.74, 0.46, '#FFD525');
                  if (heroL) B.confettiAt(heroL, 20);
                }, 560);
              } else if (outcome === 'B_SOLO_PUNCH') {
                comicText = `💥 TRÚNG ĐÒN ĐỐI THỦ! (+${ptsB}Đ)`;
                if (heroR) { heroR.className = 'ar-gladiator right do-punch'; }
                if (heroL) { heroL.className = 'ar-gladiator left do-ko'; }
                sfxWhoosh(S.mute, 0.22);
                later(() => {
                  sfxHeavyPunch(S.mute, 0);
                  B.buzz();
                  triggerImpactVFX(0.26, 0.46, '#FF545A');
                }, 560);
              } else if (outcome === 'A_CLASH_WIN') {
                const diffS = ((b.ms - a.ms) / 1000).toFixed(1);
                comicText = `⚡ NHANH HƠN ${diffS}s! +${ptsA}Đ!`;
                if (heroL) heroL.className = 'ar-gladiator left do-clash-win';
                if (heroR) heroR.className = 'ar-gladiator right do-clash-lose';
                sfxWhoosh(S.mute, 0.16);
                later(() => {
                  sfxHeavyPunch(S.mute, 0);
                  B.ding(); B.gain();
                  triggerImpactVFX(0.62, 0.46, '#5CE0B8');
                  if (heroL) B.confettiAt(heroL, 16);
                }, 520);
              } else if (outcome === 'B_CLASH_WIN') {
                const diffS = ((a.ms - b.ms) / 1000).toFixed(1);
                comicText = `⚡ CHẬM HƠN ${diffS}s! (Vẫn +${ptsA}Đ)`;
                if (heroR) heroR.className = 'ar-gladiator right do-clash-win';
                if (heroL) heroL.className = 'ar-gladiator left do-clash-lose';
                sfxWhoosh(S.mute, 0.16);
                later(() => {
                  sfxHeavyPunch(S.mute, 0);
                  B.ding(); B.gain();
                  triggerImpactVFX(0.38, 0.46, '#FFA800');
                }, 520);
              } else if (outcome === 'TIE_CLASH') {
                comicText = `✦ SONG QUYỀN HÒA SIÊU TỐC! +${ptsA}Đ`;
                if (heroL) heroL.className = 'ar-gladiator left do-clash-win';
                if (heroR) heroR.className = 'ar-gladiator right do-clash-win';
                later(() => {
                  sfxHeavyPunch(S.mute, 0);
                  B.ding(); B.gain();
                  triggerImpactVFX(0.5, 0.46, '#FFD525');
                }, 500);
              } else if (outcome === 'SHIELD_BLOCK') {
                comicText = `🛡️ KHIÊN BĂNG ĐỠ ĐÒN! +${ptsA}Đ`;
                if (heroR) heroR.className = 'ar-gladiator right do-punch';
                later(() => { B.tone(1046, 0.2, 'sine', 0.12); triggerImpactVFX(0.35, 0.46, '#5CE0B8'); }, 520);
              } else {
                comicText = '😅 CẢ HAI CÙNG HỤT ĐÀ TRƯỢT BĂNG!';
                if (heroL) heroL.className = 'ar-gladiator left do-slip';
                if (heroR) heroR.className = 'ar-gladiator right do-slip';
                B.buzz();
              }

              const burstEl = document.getElementById('arComicBurst');
              if (burstEl) {
                burstEl.className = 'ar-comic-burst';
                burstEl.textContent = comicText;
                later(() => { if (!destroyed) burstEl.classList.add('pop-in'); }, 420);
              }
            } else {
              // Cập nhật trực tiếp trạng thái đấm thắng/thua trên 4 ô đồng đội Mini-Squad
              const cell = document.getElementById('arMsCell' + i);
              const mid = document.getElementById('arMsMid' + i);
              const st = document.getElementById('arMsSt' + i);
              if (ptsA > ptsB) {
                if (cell) cell.className = 'ar-ms-cell win-a';
                if (mid) mid.textContent = '❄️';
                if (st) st.textContent = `+${ptsA}đ Thắng làn!`;
              } else if (ptsB > ptsA) {
                if (cell) cell.className = 'ar-ms-cell win-b';
                if (mid) mid.textContent = '💥';
                if (st) st.textContent = `Đội bạn +${ptsB}đ`;
              } else {
                if (mid) mid.textContent = '⚡';
                if (st) st.textContent = ptsA > 0 ? `Hòa +${ptsA}đ` : 'Trượt băng';
              }
            }

            if (pa.streak > 0 && pa.streak % 3 === 0) {
              ptsA += 50;
              if (i === 2) B.toast(`🔥 CHUỖI BẤT BẠI ×${pa.streak}! +50 điểm Đồng đội!`);
            }
            if (pb.streak > 0 && pb.streak % 3 === 0) ptsB += 50;

            pa.score += ptsA;
            pb.score += ptsB;
            pa.lastAct = stageActA; pb.lastAct = stageActB;
            pa.lastTag = ptsA > 0 ? `+${ptsA}đ` : '0đ';
            pb.lastTag = ptsB > 0 ? `+${ptsB}đ` : '0đ';
            deltaTeamA += ptsA;
            deltaTeamB += ptsB;
          }

          if (metaL) metaL.textContent = `${me.score} điểm${me.streak >= 2 ? ' · 🔥×' + me.streak : ''}`;
          if (metaR) metaR.textContent = `${opp.score} điểm${opp.streak >= 2 ? ' · 🔥×' + opp.streak : ''}`;

          M.teamAScore += deltaTeamA;
          M.teamBScore += deltaTeamB;
          animateTeamScores(M.teamAScore, M.teamBScore);
          syncBroadcast(M, 'CLASH');

          later(() => {
            if (rIdx + 1 < 10) startRound(rIdx + 1);
            else runVictoryCutscene(M);
          }, 2850);
        }
      }

      startRound(0);
    }

    /* ==================== 4. HOẠT CẢNH CHIẾN THẮNG ĐỒNG ĐỘI 6 GIÂY (3 CẢNH) ==================== */
    function runVictoryCutscene(M) {
      clearTimers();
      setWideMode(false);
      if (stepsEl) stepsEl.innerHTML = '';

      const totalMsA = M.teamA.reduce((s, p) => s + p.correctMs, 0);
      const totalMsB = M.teamB.reduce((s, p) => s + p.correctMs, 0);
      const teamAWon = M.teamAScore > M.teamBScore || (M.teamAScore === M.teamBScore && totalMsA <= totalMsB);
      const winCamp = teamAWon ? M.myCamp : M.oppCamp;
      const winSquad = teamAWon ? M.teamA : M.teamB;
      const loseSquad = teamAWon ? M.teamB : M.teamA;
      const all10 = M.teamA.concat(M.teamB).slice().sort((a, b) => b.score - a.score);
      const mvp = all10[0];

      syncBroadcast(M, 'VICTORY', { winCamp, mvpName: mvp.name, mvpScore: mvp.score });
      sfxHeavyPunch(S.mute, 0.1);
      B.jingle();
      B.confetti(window.innerWidth / 2, window.innerHeight * 0.35, 36);

      stage.innerHTML = `
        <div class="ar-wrap">
          <div class="ar-cutscene" id="arCutBox">
            <canvas class="ar-cut-cv" id="arCutCv"></canvas>
            <div>
              <div class="ar-round-pill x2" style="display:inline-block;margin-bottom:6px">★ HOẠT CẢNH CHIẾN THẮNG ĐỒNG ĐỘI ★</div>
              <div class="ar-cut-title" id="arCutTitle">LIÊN HOÀN QUYỀN PEC ${esc(winCamp.name.toUpperCase())}!</div>
            </div>

            <div class="ar-cut-stage" id="arCutStage">
              <div style="display:flex;align-items:center;gap:8px;width:100%;justify-content:space-around">
                <div style="display:flex;gap:3px">
                  ${winSquad.map(p => `<img src="${p.avatar.file}" style="width:54px;height:54px;object-fit:contain;animation:arDashWinL 1.6s infinite" alt="">`).join('')}
                </div>
                <div style="font:800 28px 'Baloo 2';color:#FFE680">❄️⚡🌊</div>
                <div style="display:flex;gap:2px">
                  ${loseSquad.map(p => `<img src="${p.avatar.file}" style="width:44px;height:44px;object-fit:contain;animation:arKnockFallR 2s forwards" alt="">`).join('')}
                </div>
              </div>
            </div>

            <div style="position:relative;z-index:4;width:100%">
              <div style="font:800 22px 'Baloo 2';color:#fff;text-shadow:0 2px 0 #2B1440">
                PEC ${esc(M.myCamp.name)}: <span style="color:#FFE680">${M.teamAScore.toLocaleString('vi-VN')}</span>
                &nbsp;—&nbsp;
                <span style="color:#FFE680">${M.teamBScore.toLocaleString('vi-VN')}</span> :PEC ${esc(M.oppCamp.name)}
              </div>
              <p class="hint" id="arCutSub" style="margin-top:3px">Cảnh 1/3: 5 chiến binh hợp lực tung Bão Cầu Tuyết áp đảo!</p>
            </div>
          </div>
        </div>
      `;

      const cutCv = document.getElementById('arCutCv');
      if (cutCv) {
        const box = document.getElementById('arCutBox');
        const br = box.getBoundingClientRect();
        cutCv.width = Math.max(300, Math.round(br.width));
        cutCv.height = Math.max(360, Math.round(br.height));
        const ctx = cutCv.getContext('2d');
        const bits = Array.from({ length: 42 }, (_, k) => ({
          x: Math.random() * cutCv.width, y: Math.random() * cutCv.height,
          vy: 45 + Math.random() * 75, vx: (Math.random() - 0.5) * 35,
          r: 4 + Math.random() * 5,
          c: ['#FF4D5A', '#FFD525', '#4FD27A', '#5AB2FF', '#FF8FD0', '#FFFFFF'][k % 6]
        }));
        let last = performance.now();
        const cutLoop = now => {
          if (destroyed || !document.getElementById('arCutCv')) return;
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          ctx.clearRect(0, 0, cutCv.width, cutCv.height);
          bits.forEach(b => {
            b.y += b.vy * dt; b.x += b.vx * dt;
            if (b.y > cutCv.height + 10) { b.y = -10; b.x = Math.random() * cutCv.width; }
            ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.r, b.r * 1.4);
          });
          rafs.push(requestAnimationFrame(cutLoop));
        };
        rafs.push(requestAnimationFrame(cutLoop));
      }

      later(() => {
        const stg = document.getElementById('arCutStage');
        const ttl = document.getElementById('arCutTitle');
        const sub = document.getElementById('arCutSub');
        if (!stg) return;
        B.jingle();
        B.confetti(window.innerWidth / 2, window.innerHeight * 0.3, 32);
        if (ttl) ttl.textContent = `🏆 ĐỘI PEC ${winCamp.name.toUpperCase()} ĐĂNG QUANG!`;
        if (sub) sub.textContent = 'Cảnh 2/3: 5 chiến binh Con Giáp nhảy múa nâng Cúp Pha Lê Cực Quang!';
        stg.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:6px">
            <div style="display:flex;align-items:center;gap:10px">
              <img src="${winCamp.badge}" style="width:62px;height:62px;object-fit:contain" alt="">
              <img class="ar-cut-cup" src="assets/arena-cup.png" alt="Cúp Vô Địch">
              <img src="${winCamp.badge}" style="width:62px;height:62px;object-fit:contain" alt="">
            </div>
            <div class="ar-cut-heroes">
              ${winSquad.map(p => `<div class="ar-cut-hero"><img src="${p.avatar.file}" alt="${esc(p.name)}"><span>${esc(p.name)}</span></div>`).join('')}
            </div>
          </div>
        `;
      }, 2050);

      later(() => {
        const stg = document.getElementById('arCutStage');
        const ttl = document.getElementById('arCutTitle');
        const sub = document.getElementById('arCutSub');
        if (!stg) return;
        B.ding();
        if (ttl) ttl.textContent = `👑 MVP ĐẤU TRƯỜNG: ${mvp.name.toUpperCase()}!`;
        if (sub) sub.textContent = `Cảnh 3/3: Quyền Vương ghi điểm cao nhất trận (${mvp.score} điểm)!`;
        stg.innerHTML = `
          <div class="ar-podium-box">
            <div class="ar-mvp-badge">👑 MVP: ${esc(mvp.name)} · ${mvp.score} điểm</div>
            <div style="margin-bottom:-22px;position:relative;z-index:2">
              <img src="${mvp.avatar.file}" style="width:92px;height:92px;object-fit:contain;animation:arVictoryDance 0.6s infinite alternate" alt="">
            </div>
            <img class="ar-podium-img" src="assets/arena-podium.png" alt="Bục vinh danh">
          </div>
        `;
      }, 4350);

      later(() => renderMatchSummary(M, teamAWon, winCamp, mvp), 6150);
    }

    /* ==================== 5. BẢNG TỔNG KẾT & TẢI GIẤY CHỨNG NHẬN PNG ==================== */
    function renderMatchSummary(M, teamAWon, winCamp, mvp) {
      clearTimers();
      const me = M.teamA[2];
      if (!M.rewardGranted) {
        M.rewardGranted = true;
        const stationPts = Math.min(100, Math.max(40, Math.round(me.score / 12) + (teamAWon ? 20 : 5)));
        B.awardStationPoints(stationPts);
      }

      const allPlayers = M.teamA.map(p => Object.assign({ camp: M.myCamp.name }, p))
        .concat(M.teamB.map(p => Object.assign({ camp: M.oppCamp.name }, p)))
        .sort((a, b) => b.score - a.score);

      stage.innerHTML = `
        <div class="ar-wrap">
          <div class="ar-card" style="text-align:center">
            <div class="ar-mvp-badge">
              ${teamAWon ? '🏆 CHIẾN THẮNG ĐỒNG ĐỘI!' : '🌟 NỖ LỰC TUYỆT VỜI!'} · ĐỘI PEC ${esc(winCamp.name.toUpperCase())}
            </div>
            <div style="display:flex;justify-content:center;align-items:center;gap:14px;margin:6px 0">
              <div>
                <img src="${M.myCamp.badge}" style="width:44px;height:44px;object-fit:contain" alt="">
                <div style="font:800 22px 'Baloo 2';color:#FFE680">${M.teamAScore.toLocaleString('vi-VN')}</div>
                <small style="font-size:11px;color:#E4DCFF">PEC ${esc(M.myCamp.name)}</small>
              </div>
              <img src="assets/arena-cup.png" style="width:68px;height:68px;object-fit:contain" alt="">
              <div>
                <img src="${M.oppCamp.badge}" style="width:44px;height:44px;object-fit:contain" alt="">
                <div style="font:800 22px 'Baloo 2';color:#FFE680">${M.teamBScore.toLocaleString('vi-VN')}</div>
                <small style="font-size:11px;color:#E4DCFF">PEC ${esc(M.oppCamp.name)}</small>
              </div>
            </div>
            <p class="sub" style="margin:4px 0 10px">
              Bạn đạt <b style="color:#FFE680">${me.score} điểm</b> (${me.wins}/10 lượt thắng) · MVP: <b style="color:#5CE0B8">${esc(mvp.name)} (${mvp.score}đ)</b>
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
              <button type="button" class="btn g" id="arBtnCert" style="font-size:15.5px;padding:6px 14px">📜 Tải Giấy Chứng Nhận PNG</button>
              <button type="button" class="btn ghost" id="arBtnReplayCut" style="font-size:14.5px;padding:6px 12px">🎬 Xem Lại Hoạt Cảnh</button>
            </div>
          </div>

          <div class="ar-card">
            <div class="ar-sec-head"><h4>Bảng Xếp Hạng 10 Chiến Binh</h4><span>Tổng kết 10 lượt</span></div>
            <ol class="lb" style="margin-top:4px">
              ${allPlayers.map((p, idx) => `
                <li class="${p.isMe ? 'me' : ''}">
                  <span class="rk">${idx + 1}</span>
                  <span style="display:flex;align-items:center;gap:6px">
                    <img src="${p.avatar.file}" style="width:28px;height:28px;object-fit:contain" alt="">
                    <span>${esc(p.name)}${p.isMe ? ' (Bạn)' : ''}<small>PEC ${esc(p.camp)} · Thắng ${p.wins} hiệp</small></span>
                  </span>
                  <span class="sc">${p.score}đ</span>
                </li>
              `).join('')}
            </ol>
          </div>

          <div style="display:flex;gap:10px">
            <button type="button" class="btn ghost" id="arSumHome" style="flex:1">Về Làng</button>
            <button type="button" class="btn" id="arSumAgain" style="flex:1">❄️ Đấu Trận Mới</button>
          </div>
        </div>
      `;

      stage.querySelector('#arBtnReplayCut').onclick = () => { B.unlockAudio(); runVictoryCutscene(M); };
      stage.querySelector('#arSumHome').onclick = () => B.goHome();
      stage.querySelector('#arSumAgain').onclick = () => { B.unlockAudio(); renderLobby(); };
      stage.querySelector('#arBtnCert').onclick = () => downloadCertificate(M, teamAWon, mvp);
    }

    function downloadCertificate(M, teamAWon, mvp) {
      const me = M.teamA[2];
      const title = mvp.isMe ? '👑 MVP QUYỀN VƯƠNG ĐẤU TRƯỜNG 5VS5' : (teamAWon ? '🏆 QUÁN QUÂN ĐỒNG ĐỘI 5VS5' : '🌟 CHIẾN BINH BĂNG GIÁ DŨNG CẢM');
      const cv = document.createElement('canvas');
      cv.width = 720; cv.height = 900;
      const ctx = cv.getContext('2d');

      const frame = ARENA_IMGS['cert-frame-pec.png'];
      if (frame && frame.complete && frame.naturalWidth > 0) ctx.drawImage(frame, 0, 0, 720, 900);
      else { ctx.fillStyle = '#FFF8E8'; ctx.fillRect(0, 0, 720, 900); }

      ctx.fillStyle = 'rgba(255, 250, 238, 0.92)';
      ctx.strokeStyle = '#E6B422'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(86, 175, 548, 560, 24) : ctx.rect(86, 175, 548, 560);
      ctx.fill(); ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#B3141D'; ctx.font = '800 30px "Baloo 2", sans-serif';
      ctx.fillText('GIẤY CHỨNG NHẬN CHIẾN BINH', 360, 228);
      ctx.fillStyle = '#2B1440'; ctx.font = '700 18px "Be Vietnam Pro", sans-serif';
      ctx.fillText('ĐẤU TRƯỜNG BÔNG TUYẾT 5VS5 · LÀNG GIÁNG SINH PEC 2026', 360, 260);

      const avIm = ARENA_IMGS[me.avatar.file.replace(/^assets\//, '')];
      if (avIm && avIm.complete && avIm.naturalWidth > 0) ctx.drawImage(avIm, 235, 282, 130, 130);
      const bdgIm = ARENA_IMGS[M.myCamp.badge.replace(/^assets\//, '')];
      if (bdgIm && bdgIm.complete && bdgIm.naturalWidth > 0) ctx.drawImage(bdgIm, 375, 296, 102, 102);

      ctx.fillStyle = '#5A4A78'; ctx.font = '700 18px "Be Vietnam Pro", sans-serif';
      ctx.fillText('Trao tặng Chiến binh Nhí xuất sắc:', 360, 448);
      ctx.fillStyle = '#D11F29'; ctx.font = '800 40px "Baloo 2", sans-serif';
      ctx.fillText(me.name.toUpperCase(), 360, 496);
      ctx.fillStyle = '#1E7F45'; ctx.font = '800 24px "Baloo 2", sans-serif';
      ctx.fillText(title, 360, 544);
      ctx.fillStyle = '#2B1440'; ctx.font = '700 20px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`Đội đại diện: Trung tâm Anh ngữ PEC ${M.myCamp.name}`, 360, 588);
      ctx.fillText(`Điểm cá nhân: ${me.score} điểm · Tổng điểm Đội: ${M.teamAScore.toLocaleString('vi-VN')} điểm`, 360, 622);
      ctx.fillStyle = '#7A6899'; ctx.font = '600 16px "Be Vietnam Pro", sans-serif';
      ctx.fillText('PEC English Center — "Learning to be!" · Hải Phòng, Tháng 12/2026', 360, 686);

      try {
        const a = document.createElement('a');
        a.href = cv.toDataURL('image/png');
        a.download = 'Chung-Nhan-PEC-5vs5-' + (me.name.replace(/\s+/g, '-') || 'ChienBinh') + '.png';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        B.jingle(); B.toast('📜 Đã tải Giấy chứng nhận PNG sắc nét về máy!');
      } catch (err) {
        const cv2 = document.createElement('canvas'); cv2.width = 720; cv2.height = 900;
        const c2 = cv2.getContext('2d');
        c2.fillStyle = '#1D124F'; c2.fillRect(0, 0, 720, 900);
        c2.fillStyle = '#FFF9EC'; c2.fillRect(48, 48, 624, 804);
        c2.strokeStyle = '#FFD525'; c2.lineWidth = 10; c2.strokeRect(60, 60, 600, 780);
        c2.textAlign = 'center'; c2.fillStyle = '#D11F29'; c2.font = '800 34px sans-serif';
        c2.fillText('GIẤY CHỨNG NHẬN CHIẾN BINH PEC', 360, 200);
        c2.fillStyle = '#2B1440'; c2.font = '800 42px sans-serif';
        c2.fillText(me.name.toUpperCase(), 360, 420);
        c2.fillStyle = '#1E7F45'; c2.font = '700 26px sans-serif';
        c2.fillText(title, 360, 490);
        c2.fillStyle = '#2B1440'; c2.font = '700 22px sans-serif';
        c2.fillText(`PEC ${M.myCamp.name} · ${me.score} điểm cá nhân`, 360, 560);
        const a2 = document.createElement('a');
        a2.href = cv2.toDataURL('image/png');
        a2.download = 'Chung-Nhan-PEC-5vs5.png';
        document.body.appendChild(a2); a2.click(); document.body.removeChild(a2);
        B.jingle(); B.toast('📜 Đã tải Giấy chứng nhận PNG về máy!');
      }
    }

    /* ==================== 6. KHÁN GIẢ CỔ VŨ & CÂU HỎI VÀNG ==================== */
    function renderSpectatorView(pin) {
      clearTimers();
      setWideMode(false);
      if (modeBadgeEl) modeBadgeEl.style.display = 'none';
      activeBus = createRoomBus(pin);
      const ptitle = document.getElementById('ptitle');
      if (ptitle) ptitle.textContent = 'Khán giả #' + pin;
      let gqIdx = 0;

      function paintSpec(snap) {
        const cA = (snap && snap.myCamp) || CFG.campuses[1];
        const cB = (snap && snap.oppCamp) || CFG.campuses[0];
        const sA = snap ? snap.teamAScore : 1240;
        const sB = snap ? snap.teamBScore : 1180;
        const gq = CFG.questionBank.audienceGoldenQuestions[gqIdx % CFG.questionBank.audienceGoldenQuestions.length];

        stage.innerHTML = `
          <div class="ar-wrap">
            <div class="ar-card" style="text-align:center">
              <div class="ar-round-pill x2" style="display:inline-block;margin-bottom:8px">
                📡 TRỰC TIẾP PHÒNG #${esc(pin)} · ${snap ? 'LƯỢT ' + snap.round + '/10' : 'ĐANG CHỜ MC MỞ MÀN'}
              </div>
              <div class="ar-vs-banner" style="margin:4px 0 10px">
                <div class="ar-team-card" style="--tc:${cA.color}"><img class="bdg" src="${cA.badge}" alt=""><b>PEC ${esc(cA.name)}</b><div style="font:800 24px 'Baloo 2';color:#FFE680">${sA.toLocaleString('vi-VN')}</div></div>
                <div class="ar-vs-badge">VS</div>
                <div class="ar-team-card" style="--tc:${cB.color}"><img class="bdg" src="${cB.badge}" alt=""><b>PEC ${esc(cB.name)}</b><div style="font:800 24px 'Baloo 2';color:#FFE680">${sB.toLocaleString('vi-VN')}</div></div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <button type="button" class="btn" id="spCheerA" style="font-size:15px;padding:6px 10px">❤️ Cổ vũ ${esc(cA.name)}</button>
                <button type="button" class="btn g" id="spCheerB" style="font-size:15px;padding:6px 10px">❄️ Cổ vũ ${esc(cB.name)}</button>
              </div>
            </div>
            <div class="ar-qbox">
              <div class="ar-sec-head"><h4>🎁 Câu Hỏi Vàng Khán Giả</h4><span>+10 Kẹo</span></div>
              <div class="ar-qtext" style="margin-bottom:8px">${esc(gq.q)}</div>
              <div class="ar-opts" id="spGqOpts">
                ${gq.opts.map((op, i) => `<button type="button" class="ar-opt" data-gi="${i}"><span class="ok-let">${'ABCD'[i]}</span><span>${esc(op)}</span></button>`).join('')}
              </div>
            </div>
            <button type="button" class="btn ghost" id="spBackLobby">← Quay lại Sảnh Đấu Trường</button>
          </div>
        `;

        stage.querySelector('#spCheerA').onclick = () => { B.tone(1175, 0.07, 'triangle', 0.06); spawnCheerBubble('❤️'); activeBus.send({ type: 'SPECTATOR_CHEER', side: 'A', emoji: '❤️' }); };
        stage.querySelector('#spCheerB').onclick = () => { B.tone(1318, 0.07, 'triangle', 0.06); spawnCheerBubble('❄️'); activeBus.send({ type: 'SPECTATOR_CHEER', side: 'B', emoji: '❄️' }); };
        stage.querySelector('#spGqOpts').onclick = e => {
          const b = e.target.closest('[data-gi]');
          if (!b) return;
          if (+b.dataset.gi === gq.ans) {
            b.classList.add('correct'); B.ding(); B.gain(); B.confettiAt(b, 18);
            B.toast('🎉 Chính xác! Khán giả nhận ngay +1 phần quà & kẹo gậy!');
            later(() => { gqIdx++; paintSpec(activeBus.loadState()); }, 1100);
          } else { b.classList.add('wrong'); B.buzz(); }
        };
        stage.querySelector('#spBackLobby').onclick = renderLobby;
      }

      paintSpec(activeBus.loadState());
      activeBus.on(msg => {
        if (msg.type === 'MATCH_SNAPSHOT') paintSpec(msg);
        if (msg.type === 'SPECTATOR_CHEER') spawnCheerBubble(msg.emoji);
      });
    }

    /* ==================== 7. MÀN HÌNH SÂN KHẤU LIVESTREAM 16:9 ==================== */
    function renderStageBroadcastView(pin) {
      clearTimers();
      setWideMode(true);
      if (modeBadgeEl) modeBadgeEl.style.display = 'none';
      activeBus = createRoomBus(pin);
      const ptitle = document.getElementById('ptitle');
      if (ptitle) ptitle.textContent = '📺 SÂN KHẤU CHUNG KẾT GO-LIVE 5VS5 · PHÒNG #' + pin;

      function paintStage(snap) {
        const cA = (snap && snap.myCamp) || CFG.campuses[1];
        const cB = (snap && snap.oppCamp) || CFG.campuses[0];
        const sA = snap ? snap.teamAScore : 2840;
        const sB = snap ? snap.teamBScore : 2690;
        const rnd = snap ? snap.round : 6;
        const tA = (snap && snap.teamA) || CFG.zodiacAvatars.slice(0, 5).map((av, i) => ({ name: KID_NAMES[i], av: av.file, score: 520 + i * 35, streak: i === 2 ? 3 : 1, lastAct: i % 2 === 0 ? 'act-win' : '' }));
        const tB = (snap && snap.teamB) || CFG.zodiacAvatars.slice(5, 10).map((av, i) => ({ name: KID_NAMES[i + 5], av: av.file, score: 490 + i * 30, streak: 0, lastAct: i % 2 === 0 ? 'act-fall' : '' }));
        const lqs = (snap && snap.laneQs && snap.laneQs.length === 5) ? snap.laneQs : CFG.questionBank.kids.slice(0, 5).map(q => q.q);
        const bal = (snap && snap.laneBalance) || [62, 44, 68, 50, 58];

        stage.innerHTML = `
          <div class="ar-stage-grid">
            <div class="ar-wrap">
              <div class="ar-score-hud">
                <div class="ar-sh-top">
                  <div class="ar-sh-team"><img src="${cA.badge}" style="width:52px;height:52px" alt=""><div><div class="tn" style="font-size:14px">ĐỘI PEC ${esc(cA.name.toUpperCase())}</div><div class="ts" style="font-size:32px">${sA.toLocaleString('vi-VN')}</div></div></div>
                  <div class="ar-clock-box"><span class="ar-round-pill ${rnd >= 9 ? 'x2' : ''}">TRỰC TIẾP · LƯỢT ${rnd}/10</span><div style="font:800 13px 'Baloo 2';color:#5CE0B8;margin-top:3px">5 CẶP ĐẤU ĐỒNG THỜI</div></div>
                  <div class="ar-sh-team r"><img src="${cB.badge}" style="width:52px;height:52px" alt=""><div><div class="tn" style="font-size:14px">ĐỘI PEC ${esc(cB.name.toUpperCase())}</div><div class="ts" style="font-size:32px">${sB.toLocaleString('vi-VN')}</div></div></div>
                </div>
                <div class="ar-tug" style="--ca:${cA.color};--cb:${cB.color}">
                  <div class="ar-tug-l" style="width:${Math.round((sA / Math.max(1, sA + sB)) * 100)}%"></div>
                  <div class="ar-tug-r" style="width:${100 - Math.round((sA / Math.max(1, sA + sB)) * 100)}%"></div>
                </div>
              </div>

              <div class="ar-rink">
                ${[0, 1, 2, 3, 4].map(i => `
                  <div class="ar-lane" style="--mid:${bal[i]}%">
                    <span class="ar-lane-tag">LÀN ${i + 1}: ${esc(lqs[i]).slice(0, 44)}</span>
                    <div class="ar-ftr l ${tA[i].lastAct || ''}">
                      <div class="ar-sprite-box">${tA[i].streak >= 3 ? '<div class="ar-aura"></div>' : ''}<img class="ar-sprite" src="${tA[i].av}" alt=""><div class="ar-dizzy">⭐💫⭐</div></div>
                      <div class="ar-fmeta"><b>${esc(tA[i].name)}</b><small class="pts-pop">${tA[i].score}đ ${tA[i].lastTag ? '(' + esc(tA[i].lastTag) + ')' : ''}</small></div>
                    </div>
                    <div class="ar-ftr r ${tB[i].lastAct || ''}">
                      <div class="ar-sprite-box"><img class="ar-sprite" src="${tB[i].av}" alt=""><div class="ar-dizzy">⭐💫⭐</div></div>
                      <div class="ar-fmeta"><b>${esc(tB[i].name)}</b><small>${tB[i].score}đ ${tB[i].lastTag ? '(' + esc(tB[i].lastTag) + ')' : ''}</small></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="ar-wrap">
              <div class="ar-card">
                <div class="ar-sec-head"><h4>🏁 Đường Đua 5 Cơ Sở PEC</h4><span>Season Live</span></div>
                <div class="ar-campus-race">
                  ${CFG.campuses.map((c, idx) => {
                    const pts = c.id === cA.id ? 14200 + sA : c.id === cB.id ? 13900 + sB : 13500 - idx * 420;
                    return `<div class="ar-cr-row"><img src="${c.badge}" alt=""><div><div style="display:flex;justify-content:space-between"><span>${esc(c.name)}</span><span style="color:#FFE680">${pts.toLocaleString('vi-VN')}</span></div><div class="ar-cr-bar"><i style="width:${Math.min(100, Math.round(pts / 180))}%;--cc:${c.color}"></i></div></div></div>`;
                  }).join('')}
                </div>
              </div>
              <div class="ar-card" style="text-align:center">
                <div style="font:800 17px 'Baloo 2';color:#5CE0B8">📱 MÃ PHÒNG GO-LIVE</div>
                <div style="font:800 30px 'Baloo 2';color:#FFE680;letter-spacing:3px;margin:4px 0">#${esc(pin)}</div>
                <div style="display:flex;flex-direction:column;gap:7px">
                  <button type="button" class="btn g" id="stgDemoPlay" style="font-size:15px;min-height:42px">▶ Tự Đấu Mẫu Cận Cảnh</button>
                  <button type="button" class="btn ghost" id="stgBack" style="font-size:14px;min-height:40px">← Về Sảnh Chọn Nhân Vật</button>
                </div>
              </div>
            </div>
          </div>
        `;

        stage.querySelector('#stgDemoPlay').onclick = () => { autoPlayDemo = true; startMatchmaking(true, pin); };
        stage.querySelector('#stgBack').onclick = renderLobby;
      }

      paintStage(activeBus.loadState());
      activeBus.on(msg => {
        if (msg.type === 'MATCH_SNAPSHOT') paintStage(msg);
        if (msg.type === 'SPECTATOR_CHEER') spawnCheerBubble(msg.emoji);
      });
    }

    /* ==================== 8. BẢNG MC ĐIỀU KHIỂN ==================== */
    function renderHostDirectorView(pin) {
      clearTimers();
      setWideMode(false);
      if (modeBadgeEl) modeBadgeEl.style.display = 'none';
      activeBus = createRoomBus(pin);
      const ptitle = document.getElementById('ptitle');
      if (ptitle) ptitle.textContent = '🎙️ Bảng MC #' + pin;

      stage.innerHTML = `
        <div class="ar-wrap">
          <div class="ar-card">
            <div class="ar-sec-head"><h4>🎙️ Điều Khiển Đêm Chung Kết</h4><span>Phòng #${esc(pin)}</span></div>
            <div style="display:flex;flex-direction:column;gap:9px">
              <button type="button" class="btn" id="mcDrawPair">🎲 Quay Số Bốc Thăm 2 Cơ Sở Đối Đầu</button>
              <button type="button" class="btn g" id="mcFireCheer">🎉 Bắn Mưa Pháo Tuyết Cổ Vũ Toàn Sân</button>
              <button type="button" class="btn ghost" id="mcFrostTest">❄️ Kích Hoạt Thử Thách Bão Tuyết Mờ 1s</button>
              <button type="button" class="btn ghost" id="mcOpenStage">📺 Chuyển Sang Màn Hình Sân Khấu 16:9</button>
              <button type="button" class="btn ghost" id="mcBack">← Quay lại Sảnh Đấu Trường</button>
            </div>
            <div id="mcLog" style="margin-top:10px;padding:8px 10px;border-radius:12px;background:rgba(0,0,0,0.28);font-size:12.5px;color:#FFE680;font-weight:700">
              Trạng thái: Sẵn sàng phát sóng phòng #${esc(pin)}
            </div>
          </div>
        </div>
      `;

      const log = t => { const el = document.getElementById('mcLog'); if (el) el.textContent = t; };
      stage.querySelector('#mcDrawPair').onclick = () => {
        const pair = shuffle(CFG.campuses).slice(0, 2);
        B.jingle(); B.confetti(window.innerWidth / 2, window.innerHeight * 0.4, 28);
        activeBus.saveState({ myCamp: pair[0], oppCamp: pair[1], oppCampId: pair[1].id, teamAScore: 0, teamBScore: 0, round: 1 });
        activeBus.send({ type: 'MATCH_SNAPSHOT', myCamp: pair[0], oppCamp: pair[1], teamAScore: 0, teamBScore: 0, round: 1 });
        log(`🎲 Đã bốc thăm cặp Chung kết: PEC ${pair[0].name} vs PEC ${pair[1].name}!`);
      };
      stage.querySelector('#mcFireCheer').onclick = () => {
        B.ding();
        ['❄️', '❤️', '⭐', '🔥'].forEach((em, k) => later(() => {
          spawnCheerBubble(em);
          activeBus.send({ type: 'SPECTATOR_CHEER', side: k % 2 ? 'A' : 'B', emoji: em });
        }, k * 140));
        log('🎉 Đã phát hiệu ứng Mưa Pháo Tuyết lên toàn bộ màn hình!');
      };
      stage.querySelector('#mcFrostTest').onclick = () => { activeBus.send({ type: 'MC_FORCE_FROST' }); log('❄️ Đã gửi hiệu ứng Bão Tuyết Mờ sang màn hình thí sinh!'); };
      stage.querySelector('#mcOpenStage').onclick = () => renderStageBroadcastView(pin);
      stage.querySelector('#mcBack').onclick = renderLobby;
    }

    B.setCleanup(() => {
      destroyed = true;
      clearTimers();
      setWideMode(false);
      autoPlayDemo = false;
      if (modeBadgeEl) modeBadgeEl.style.display = '';
      if (activeBus) { activeBus.close(); activeBus = null; }
    });

    if (launchOpts && launchOpts.view === 'stage') renderStageBroadcastView(roomPin);
    else if (launchOpts && launchOpts.view === 'host') renderHostDirectorView(roomPin);
    else if (launchOpts && launchOpts.role === 'spectator') renderSpectatorView(roomPin);
    else renderLobby();
  }

  window.PECArena = { start: startArena };
})();
