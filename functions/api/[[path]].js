// Máy chủ Làng Giáng Sinh PEC — Cloudflare Pages Functions + D1 (binding: DB)
// Biến bí mật cần đặt trên Cloudflare: STAFF_KEY (quầy lễ tân), ADMIN_KEY (xuất dữ liệu, thống kê)

const TK = 5, CANDY_CAP = 20, BOX_PTS = 50, MAX_KIDS_PER_PHONE = 3;
const TIERS = [[60, 'Bút'], [120, 'Vở'], [200, 'Ô hoặc gấu bông']];
const BRANCHES = ['Lạch Tray', 'Tô Hiệu', 'Vinhomes Imperia', 'Đà Nẵng', 'Thủy Nguyên'];
// Trạm đang mở: số giây tối thiểu một lượt, số kẹo tối đa, điểm tối đa theo số kẹo
const ST = {
  wrap: { min: 10, candy: 6, pts: c => c * 15 + 10 },
  tree: { min: 8, candy: 6, pts: c => c * 15 + 10 },
  sled: { min: 6, candy: 17, pts: c => c * 6 },
  snowman: { min: 10, candy: 5, pts: c => c * 20 },
};
const ROUND_TTL = 15 * 60 * 1000;
const CODE_AB = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL, ref TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL, lv INTEGER NOT NULL, school TEXT NOT NULL, school_key TEXT NOT NULL, branch TEXT NOT NULL, phone TEXT NOT NULL,
    consent_at TEXT NOT NULL, created_at TEXT NOT NULL, zalo INTEGER NOT NULL DEFAULT 0, invited_by INTEGER,
    candy INTEGER NOT NULL DEFAULT 0, candy_total INTEGER NOT NULL DEFAULT 0, season INTEGER NOT NULL DEFAULT 0, flagged INTEGER NOT NULL DEFAULT 0)`,
  `CREATE INDEX IF NOT EXISTS ix_players_phone ON players(phone)`,
  `CREATE INDEX IF NOT EXISTS ix_players_lv_season ON players(lv, season)`,
  `CREATE TABLE IF NOT EXISTS tokens(hash TEXT PRIMARY KEY, player_id INTEGER NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS days(player_id INTEGER NOT NULL, date TEXT NOT NULL, tk INTEGER NOT NULL DEFAULT ${TK}, pts INTEGER NOT NULL DEFAULT 0,
    candy INTEGER NOT NULL DEFAULT 0, box INTEGER NOT NULL DEFAULT 0, s3 INTEGER NOT NULL DEFAULT 0, s7 INTEGER NOT NULL DEFAULT 0,
    top3 INTEGER NOT NULL DEFAULT 0, rounds INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(player_id, date))`,
  `CREATE INDEX IF NOT EXISTS ix_days_date ON days(date, pts)`,
  `CREATE TABLE IF NOT EXISTS rounds(id TEXT PRIMARY KEY, player_id INTEGER NOT NULL, station TEXT NOT NULL, date TEXT NOT NULL,
    started_at INTEGER NOT NULL, finished_at INTEGER, pts INTEGER, candy INTEGER, flag TEXT)`,
  `CREATE TABLE IF NOT EXISTS codes(code TEXT PRIMARY KEY, player_id INTEGER NOT NULL, gift TEXT NOT NULL, need INTEGER NOT NULL,
    created_at TEXT NOT NULL, redeemed_at TEXT, redeemed_branch TEXT)`,
];
let ready = false;
async function init(db) {
  if (ready) return;
  await db.batch(SCHEMA.map(s => db.prepare(s)));
  ready = true;
}

// ---------- tiện ích ----------
const vnDay = (ms = Date.now()) => new Date(ms + 7 * 3600e3).toISOString().slice(0, 10);
const addDays = (d, n) => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const nowIso = () => new Date().toISOString();
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const fail = (msg, s = 400) => json({ error: msg }, s);
const rand = (n, ab = CODE_AB) => { const b = crypto.getRandomValues(new Uint8Array(n)); return Array.from(b, x => ab[x % ab.length]).join(''); };
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function sha(t) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))), x => x.toString(16).padStart(2, '0')).join(''); }
const clean = (t, n) => String(t ?? '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const keyOf = t => clean(t, 60).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
const normPhone = p => { let s = String(p ?? '').replace(/[^\d+]/g, ''); if (s.startsWith('+84')) s = '0' + s.slice(3); else if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2); return /^0\d{9}$/.test(s) ? s : null; };
function sameKey(a, b) { if (!a || !b || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

async function body(req) {
  const t = await req.text();
  if (t.length > 4000) throw new Error('big');
  return t ? JSON.parse(t) : {};
}
async function newToken(db, pid) {
  const tok = b64u(crypto.getRandomValues(new Uint8Array(32)));
  await db.prepare('INSERT INTO tokens(hash, player_id, created_at) VALUES(?,?,?)').bind(await sha(tok), pid, nowIso()).run();
  return tok;
}
async function auth(db, req) {
  const h = req.headers.get('authorization') || '';
  const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (tok.length < 20) return null;
  return db.prepare('SELECT p.* FROM tokens t JOIN players p ON p.id = t.player_id WHERE t.hash = ?').bind(await sha(tok)).first();
}
async function day(db, pid, d = vnDay()) {
  await db.prepare('INSERT OR IGNORE INTO days(player_id, date) VALUES(?,?)').bind(pid, d).run();
  return db.prepare('SELECT * FROM days WHERE player_id = ? AND date = ?').bind(pid, d).first();
}
async function streak(db, pid, today = vnDay()) {
  const rs = await db.prepare('SELECT date FROM days WHERE player_id = ? AND pts > 0 AND date <= ? ORDER BY date DESC LIMIT 40').bind(pid, today).all();
  const set = new Set(rs.results.map(r => r.date));
  let d = set.has(today) ? today : addDays(today, -1), n = 0;
  while (set.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
// Cộng điểm vào ngày + mùa, xét thưởng chuỗi 3 và 7 ngày
async function addPts(db, p, d, pts) {
  await db.batch([
    db.prepare('UPDATE days SET pts = pts + ? WHERE player_id = ? AND date = ?').bind(pts, p.id, d),
    db.prepare('UPDATE players SET season = season + ? WHERE id = ?').bind(pts, p.id),
  ]);
  const sk = await streak(db, p.id, d), row = await day(db, p.id, d);
  let bonus = 0, msg = '';
  if (sk === 3 && !row.s3) { bonus = 100; msg = 'Chơi 3 ngày liền: +100 điểm!'; await db.prepare('UPDATE days SET s3 = 1 WHERE player_id = ? AND date = ?').bind(p.id, d).run(); }
  if (sk === 7 && !row.s7) { bonus = 300; msg = 'Chơi 7 ngày liền: +300 điểm!'; await db.prepare('UPDATE days SET s7 = 1 WHERE player_id = ? AND date = ?').bind(p.id, d).run(); }
  if (bonus) await db.batch([
    db.prepare('UPDATE days SET pts = pts + ? WHERE player_id = ? AND date = ?').bind(bonus, p.id, d),
    db.prepare('UPDATE players SET season = season + ? WHERE id = ?').bind(bonus, p.id),
  ]);
  return msg;
}
// Top 3 "Ngôi sao hôm nay" của các ngày đã qua: +5 kẹo, trao khi bé mở game
async function awardTop3(db, p, today) {
  const rs = await db.prepare('SELECT date, pts FROM days WHERE player_id = ? AND date < ? AND top3 = 0').bind(p.id, today).all();
  let won = 0;
  for (const r of rs.results) {
    let flag = 2;
    if (r.pts > 0 && !p.flagged) {
      const c = await db.prepare('SELECT COUNT(*) n FROM days d JOIN players q ON q.id = d.player_id WHERE d.date = ? AND q.lv = ? AND q.flagged = 0 AND d.pts > ?').bind(r.date, p.lv, r.pts).first();
      if (c.n < 3) { flag = 1; won++; }
    }
    await db.prepare('UPDATE days SET top3 = ? WHERE player_id = ? AND date = ?').bind(flag, p.id, r.date).run();
  }
  if (won) await db.prepare('UPDATE players SET candy = candy + ?, candy_total = candy_total + ? WHERE id = ?').bind(5 * won, 5 * won, p.id).run();
  return won;
}
async function state(db, pid) {
  const p = await db.prepare('SELECT * FROM players WHERE id = ?').bind(pid).first();
  const d = await day(db, pid);
  const codes = await db.prepare('SELECT code, gift, created_at, redeemed_at FROM codes WHERE player_id = ? ORDER BY created_at DESC').bind(pid).all();
  return {
    profile: { name: p.name, lv: p.lv, school: p.school, branch: p.branch, code: p.code, ref: p.ref },
    candy: p.candy, zalo: !!p.zalo, season: p.season, streak: await streak(db, pid),
    day: { date: d.date, tk: d.tk, pts: d.pts, candy: d.candy, box: !!d.box },
    codes: codes.results.map(c => ({ code: c.code, gift: c.gift, date: vnDay(Date.parse(c.created_at)).split('-').reverse().join('/'), used: !!c.redeemed_at })),
  };
}
const cond = (scope, p) => scope === 'school' ? [' AND q.school_key = ?', p.school_key] : scope === 'branch' ? [' AND q.branch = ?', p.branch] : ['', null];
async function rankOf(db, p, tab, scope) {
  const [w, v] = cond(scope, p), today = vnDay();
  const args = x => v == null ? x : [...x.slice(0, 2), v, ...x.slice(2)];
  if (tab === 'day') {
    const mine = (await day(db, p.id, today)).pts;
    const sql = `FROM days d JOIN players q ON q.id = d.player_id WHERE d.date = ? AND q.lv = ?${w} AND q.flagged = 0`;
    const top = await db.prepare(`SELECT q.id, q.name, q.school, q.branch, d.pts sc ${sql} AND d.pts > 0 ORDER BY d.pts DESC, q.id LIMIT 10`).bind(...args([today, p.lv])).all();
    const ab = await db.prepare(`SELECT COUNT(*) n, MIN(d.pts) m ${sql} AND d.pts > ?`).bind(...args([today, p.lv, mine])).first();
    return { top: top.results, mine, rank: ab.n + 1, need: ab.n ? ab.m - mine + 1 : 0 };
  }
  const sql = `FROM players q WHERE q.lv = ?${w} AND q.flagged = 0`;
  const a1 = x => v == null ? x : [x[0], v, ...x.slice(1)];
  const top = await db.prepare(`SELECT q.id, q.name, q.school, q.branch, q.season sc ${sql} AND q.season > 0 ORDER BY q.season DESC, q.id LIMIT 10`).bind(...a1([p.lv])).all();
  const ab = await db.prepare(`SELECT COUNT(*) n, MIN(q.season) m ${sql} AND q.season > ?`).bind(...a1([p.lv, p.season])).first();
  return { top: top.results, mine: p.season, rank: ab.n + 1, need: ab.n ? ab.m - p.season + 1 : 0 };
}

// ---------- các API ----------
const R = {};

R['GET ping'] = async () => json({ ok: true, day: vnDay() });

R['POST register'] = async ({ db, req }) => {
  const b = await body(req);
  const name = clean(b.name, 20), school = clean(b.school, 60) || 'Chưa nhập trường', phone = normPhone(b.phone), lv = +b.lv;
  if (!name) return fail('Nhập tên gọi của bé');
  if (!phone) return fail('Số điện thoại phụ huynh chưa đúng (10 số, bắt đầu bằng 0)');
  if (![0, 1, 2].includes(lv)) return fail('Chọn cấp chơi');
  if (!BRANCHES.includes(b.branch)) return fail('Chọn cơ sở PEC gần nhà');
  if (b.consent !== true) return fail('Phụ huynh cần đánh dấu đồng ý');
  const n = await db.prepare('SELECT COUNT(*) n FROM players WHERE phone = ?').bind(phone).first();
  if (n.n >= MAX_KIDS_PER_PHONE) return fail(`Mỗi số điện thoại đăng ký tối đa ${MAX_KIDS_PER_PHONE} bé`);
  const dup = await db.prepare('SELECT id FROM players WHERE phone = ? AND name = ? COLLATE NOCASE').bind(phone, name).first();
  if (dup) return fail('Bé này đã đăng ký với số điện thoại này. Bấm "Đã đăng ký" để vào lại bằng mã của bé');
  let inviter = null;
  const refIn = clean(b.ref, 10).toUpperCase();
  if (refIn) {
    inviter = await db.prepare('SELECT id, phone FROM players WHERE ref = ?').bind(refIn).first();
    if (!inviter) return fail('Mã bạn mời không đúng, kiểm tra lại hoặc để trống');
    if (inviter.phone === phone) inviter = null; // anh chị em cùng nhà không tính
  }
  const t = nowIso();
  let pid = null;
  for (let i = 0; i < 5 && !pid; i++) {
    const r = await db.prepare(`INSERT OR IGNORE INTO players(code, ref, name, lv, school, school_key, branch, phone, consent_at, created_at, invited_by)
      VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(rand(6), 'B' + rand(5), name, lv, school, keyOf(school), b.branch, phone, t, t, inviter ? inviter.id : null).run();
    if (r.meta.changes) pid = r.meta.last_row_id;
  }
  if (!pid) return fail('Máy chủ bận, thử lại sau ít phút', 503);
  const d = vnDay();
  await day(db, pid, d);
  let msg = '';
  if (inviter) {
    await day(db, inviter.id, d);
    await db.batch([
      db.prepare('UPDATE days SET tk = tk + 1 WHERE player_id = ? AND date = ?').bind(pid, d),
      db.prepare('UPDATE days SET tk = tk + 1 WHERE player_id = ? AND date = ?').bind(inviter.id, d),
    ]);
    msg = 'Nhập mã bạn mời: bé và bạn mỗi người +1 vé';
  }
  return json({ token: await newToken(db, pid), state: await state(db, pid), msg });
};

R['POST login'] = async ({ db, req }) => {
  const b = await body(req);
  const phone = normPhone(b.phone), code = clean(b.code, 10).toUpperCase();
  if (!phone || code.length !== 6) return fail('Nhập số điện thoại phụ huynh và mã 6 ký tự của bé');
  const p = await db.prepare('SELECT id FROM players WHERE phone = ? AND code = ?').bind(phone, code).first();
  if (!p) return fail('Không tìm thấy bé với số điện thoại và mã này', 404);
  return json({ token: await newToken(db, p.id), state: await state(db, p.id) });
};

R['GET me'] = async ({ db, p }) => {
  const won = await awardTop3(db, p, vnDay());
  return json({ state: await state(db, p.id), msg: won ? `Bé lọt top 3 Ngôi sao hôm nay: +${5 * won} kẹo gậy!` : '' });
};

R['POST round/start'] = async ({ db, req, p }) => {
  const b = await body(req), st = ST[b.station];
  if (!st) return fail('Trạm này chưa mở');
  const d = vnDay();
  await day(db, p.id, d);
  const r = await db.prepare('UPDATE days SET tk = tk - 1, rounds = rounds + 1 WHERE player_id = ? AND date = ? AND tk > 0').bind(p.id, d).run();
  if (!r.meta.changes) return json({ mode: 'practice', state: await state(db, p.id) });
  const id = b64u(crypto.getRandomValues(new Uint8Array(12)));
  await db.prepare('INSERT INTO rounds(id, player_id, station, date, started_at) VALUES(?,?,?,?,?)').bind(id, p.id, b.station, d, Date.now()).run();
  return json({ mode: 'scored', round: id, state: await state(db, p.id) });
};

R['POST round/finish'] = async ({ db, req, p }) => {
  const b = await body(req);
  const r = await db.prepare('SELECT * FROM rounds WHERE id = ? AND player_id = ?').bind(String(b.round || ''), p.id).first();
  if (!r) return fail('Không tìm thấy lượt chơi', 404);
  if (r.finished_at) return fail('Lượt này đã được tính điểm', 409);
  const st = ST[r.station], now = Date.now(), dur = (now - r.started_at) / 1000;
  let candy = Math.max(0, Math.min(st.candy, Math.floor(+b.candy || 0)));
  let pts = Math.max(0, Math.min(100, Math.round(+b.pts || 0)));
  const flags = [];
  if (now - r.started_at > ROUND_TTL) { flags.push('quá giờ'); pts = 0; candy = 0; }
  if (dur < st.min) { flags.push(`nhanh bất thường ${dur.toFixed(1)}s`); pts = 0; candy = 0; }
  if (pts > st.pts(candy)) { flags.push(`điểm ${pts} > kẹo ${candy}`); pts = Math.min(pts, st.pts(candy)); }
  const d = r.date, row = await day(db, p.id, d);
  const got = Math.min(candy, Math.max(0, CANDY_CAP - row.candy));
  await db.batch([
    db.prepare('UPDATE rounds SET finished_at = ?, pts = ?, candy = ?, flag = ? WHERE id = ? AND finished_at IS NULL').bind(now, pts, got, flags.join('; ') || null, r.id),
    db.prepare('UPDATE days SET candy = candy + ? WHERE player_id = ? AND date = ?').bind(got, p.id, d),
    db.prepare('UPDATE players SET candy = candy + ?, candy_total = candy_total + ? WHERE id = ?').bind(got, got, p.id),
  ]);
  const bonus = pts > 0 ? await addPts(db, p, d, pts) : '';
  const me = await db.prepare('SELECT * FROM players WHERE id = ?').bind(p.id).first();
  const rk = await rankOf(db, me, 'season', 'all');
  return json({ pts, candy: got, bonus, rank: rk.rank, need: rk.need, state: await state(db, p.id) });
};

R['POST box'] = async ({ db, p }) => {
  const d = vnDay();
  await day(db, p.id, d);
  const r = await db.prepare('UPDATE days SET box = 1, tk = tk + 1 WHERE player_id = ? AND date = ? AND box = 0').bind(p.id, d).run();
  if (!r.meta.changes) return fail('Bé đã mở hộp quà hôm nay. Ngày mai quay lại mở hộp mới nhé!', 409);
  const msg = await addPts(db, p, d, BOX_PTS);
  return json({ msg: msg || 'Bé nhận được 1 vé và 50 điểm!', state: await state(db, p.id) });
};

R['POST zalo'] = async ({ db, p }) => {
  const d = vnDay();
  await day(db, p.id, d);
  const r = await db.prepare('UPDATE players SET zalo = 1 WHERE id = ? AND zalo = 0').bind(p.id).run();
  if (!r.meta.changes) return fail('Bé đã nhận vé thưởng nhóm Zalo rồi', 409);
  await db.prepare('UPDATE days SET tk = tk + 2 WHERE player_id = ? AND date = ?').bind(p.id, d).run();
  return json({ state: await state(db, p.id) });
};

R['POST redeem'] = async ({ db, req, p }) => {
  const b = await body(req), t = TIERS[+b.tier];
  if (!t) return fail('Chọn món quà');
  const r = await db.prepare('UPDATE players SET candy = candy - ? WHERE id = ? AND candy >= ?').bind(t[0], p.id, t[0]).run();
  if (!r.meta.changes) return fail('Bé chưa đủ kẹo gậy cho món quà này', 409);
  let code = null;
  for (let i = 0; i < 5 && !code; i++) {
    const c = 'PEC-' + rand(5);
    const x = await db.prepare('INSERT OR IGNORE INTO codes(code, player_id, gift, need, created_at) VALUES(?,?,?,?,?)').bind(c, p.id, t[1], t[0], nowIso()).run();
    if (x.meta.changes) code = c;
  }
  if (!code) { await db.prepare('UPDATE players SET candy = candy + ? WHERE id = ?').bind(t[0], p.id).run(); return fail('Máy chủ bận, thử lại sau', 503); }
  return json({ code, gift: t[1], state: await state(db, p.id) });
};

R['GET board'] = async ({ db, url, p }) => {
  const tab = url.searchParams.get('tab') === 'season' ? 'season' : 'day';
  const scope = ['school', 'branch'].includes(url.searchParams.get('scope')) ? url.searchParams.get('scope') : 'all';
  const rk = await rankOf(db, p, tab, scope);
  return json({
    rows: rk.top.map(x => ({ name: x.name, sub: scope === 'school' ? x.school : 'Cơ sở ' + x.branch, sc: x.sc, me: x.id === p.id })),
    mine: rk.mine, rank: rk.rank, need: rk.need,
  });
};

// ---------- quầy lễ tân ----------
const staffOk = (env, req) => sameKey(req.headers.get('x-key') || '', env.STAFF_KEY || '') || sameKey(req.headers.get('x-key') || '', env.ADMIN_KEY || '');
R['GET staff/code'] = async ({ db, env, req, url }) => {
  if (!staffOk(env, req)) return fail('Sai khóa quầy', 401);
  const c = await db.prepare('SELECT c.*, p.name, p.lv, p.school, p.branch, p.phone FROM codes c JOIN players p ON p.id = c.player_id WHERE c.code = ?').bind(clean(url.searchParams.get('code'), 12).toUpperCase()).first();
  if (!c) return fail('Không có mã này', 404);
  return json({ code: c.code, gift: c.gift, name: c.name, school: c.school, branch: c.branch, phone: '*******' + c.phone.slice(-3), created_at: c.created_at, redeemed_at: c.redeemed_at, redeemed_branch: c.redeemed_branch });
};
R['POST staff/redeem'] = async ({ db, env, req }) => {
  if (!staffOk(env, req)) return fail('Sai khóa quầy', 401);
  const b = await body(req);
  if (!BRANCHES.includes(b.branch)) return fail('Chọn cơ sở đang trao quà');
  const r = await db.prepare('UPDATE codes SET redeemed_at = ?, redeemed_branch = ? WHERE code = ? AND redeemed_at IS NULL').bind(nowIso(), b.branch, clean(b.code, 12).toUpperCase()).run();
  if (!r.meta.changes) return fail('Mã không có hoặc đã trao quà rồi', 409);
  return json({ ok: true });
};

// ---------- quản trị ----------
const adminOk = (env, req, url) => sameKey(req.headers.get('x-key') || url.searchParams.get('key') || '', env.ADMIN_KEY || '');
R['GET admin/stats'] = async ({ db, env, req, url }) => {
  if (!adminOk(env, req, url)) return fail('Sai khóa quản trị', 401);
  const q = s => db.prepare(s).all().then(r => r.results);
  return json({
    byDay: await q(`SELECT date, COUNT(*) players, SUM(rounds) rounds, SUM(pts) pts FROM days WHERE rounds > 0 OR box = 1 GROUP BY date ORDER BY date`),
    regByDay: await q(`SELECT substr(datetime(created_at, '+7 hours'), 1, 10) date, COUNT(*) n FROM players GROUP BY 1 ORDER BY 1`),
    byBranch: await q(`SELECT branch, lv, COUNT(*) players, SUM(zalo) zalo, SUM(invited_by IS NOT NULL) invited FROM players GROUP BY branch, lv`),
    back3: await q(`SELECT COUNT(*) n FROM (SELECT player_id FROM days WHERE rounds > 0 GROUP BY player_id HAVING COUNT(*) >= 3)`),
    codes: await q(`SELECT gift, COUNT(*) issued, SUM(redeemed_at IS NOT NULL) redeemed FROM codes GROUP BY gift`),
    flagged: await q(`SELECT r.date, p.name, p.phone, r.station, r.flag FROM rounds r JOIN players p ON p.id = r.player_id WHERE r.flag IS NOT NULL ORDER BY r.started_at DESC LIMIT 100`),
  });
};
R['GET admin/players.csv'] = async ({ db, env, req, url }) => {
  if (!adminOk(env, req, url)) return fail('Sai khóa quản trị', 401);
  const rs = await db.prepare(`SELECT p.id, p.name, p.lv, p.school, p.branch, p.phone, datetime(p.created_at, '+7 hours') created, p.zalo, i.name inviter,
    p.season, p.candy_total, p.candy, (SELECT COUNT(*) FROM days d WHERE d.player_id = p.id AND d.rounds > 0) days_played,
    (SELECT COUNT(*) FROM codes c WHERE c.player_id = p.id) codes, (SELECT COUNT(*) FROM codes c WHERE c.player_id = p.id AND c.redeemed_at IS NOT NULL) redeemed
    FROM players p LEFT JOIN players i ON i.id = p.invited_by ORDER BY p.id`).all();
  const LV = ['Tiểu Tinh Linh', 'Tuần Lộc', 'Ông Già Noel'];
  const head = ['STT', 'Tên gọi', 'Cấp', 'Trường', 'Cơ sở', 'SĐT phụ huynh', 'Ngày đăng ký', 'Vào nhóm Zalo', 'Bạn mời', 'Điểm mùa', 'Kẹo đã nhận', 'Kẹo còn', 'Số ngày chơi', 'Mã đổi quà', 'Đã nhận quà'];
  const cell = v => { let s = String(v ?? ''); if (/^[=+\-@]/.test(s)) s = "'" + s; return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = rs.results.map((r, i) => [i + 1, r.name, LV[r.lv], r.school, r.branch, "'" + r.phone, r.created, r.zalo ? 'Có' : '', r.inviter, r.season, r.candy_total, r.candy, r.days_played, r.codes, r.redeemed].map(cell).join(','));
  return new Response('﻿' + [head.join(','), ...lines].join('\r\n'), { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="lang-giang-sinh-${vnDay()}.csv"`, 'cache-control': 'no-store' } });
};

const NEED_AUTH = new Set(['GET me', 'POST round/start', 'POST round/finish', 'POST box', 'POST zalo', 'POST redeem', 'GET board']);

export async function onRequest(ctx) {
  const { request: req, env, params } = ctx;
  if (!env.DB) return fail('Chưa gắn cơ sở dữ liệu', 503);
  const path = (Array.isArray(params.path) ? params.path : [params.path]).filter(Boolean).join('/');
  const k = `${req.method} ${path}`, h = R[k];
  if (!h) return fail('Không có đường dẫn này', 404);
  if (req.method === 'POST' && !(req.headers.get('content-type') || '').includes('application/json')) return fail('Sai định dạng', 415);
  try {
    await init(env.DB);
    const url = new URL(req.url), c = { db: env.DB, env, req, url };
    if (NEED_AUTH.has(k)) { c.p = await auth(env.DB, req); if (!c.p) return fail('Cần đăng ký hoặc đăng nhập lại', 401); }
    return await h(c);
  } catch (e) {
    if (e instanceof SyntaxError || e.message === 'big') return fail('Dữ liệu gửi lên không hợp lệ');
    console.error(k, e && e.stack || e);
    return fail('Máy chủ gặp lỗi, thử lại sau ít phút', 500);
  }
}
