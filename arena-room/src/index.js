// Phòng đấu trực tiếp Đấu trường Bông tuyết 5vs5 — Cloudflare Durable Object
// Máy chủ giữ đề, đồng hồ, chấm điểm; thí sinh chỉ nhận câu hỏi của làn mình (không kèm đáp án).
// Trang game (Pages) xác thực rồi chuyển kết nối WebSocket vào đây qua binding ARENA.
import CFG from './config.json';

const LV_KEYS = ['kids', 'junior', 'teen'];
const Q_MS = 10000, REVEAL_MS = 3200, INTRO_MS = 4500, GRACE_MS = 600;
const BOT_NAMES = ['Minh Khôi', 'Bảo Châu', 'Gia Huy', 'An Nhiên', 'Đức Anh', 'Thảo Nhi', 'Quang Hải', 'Ngọc Diệp', 'Hoàng Bách', 'Khánh Linh', 'Phương Thảo', 'Đăng Khoa', 'Hà My', 'Thiện Nhân', 'Bảo Ngọc', 'Trâm Anh'];
const LANE_ORDER = [2, 1, 3, 0, 4]; // bé vào trước đứng làn giữa
const R = CFG.matchRules.scoring;

const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const campusById = id => CFG.campuses.find(c => c.id === id) || null;
const campusByName = n => CFG.campuses.find(c => c.name === n) || null;
const avatarById = id => CFG.zodiacAvatars.find(a => a.id === id) || null;
const speedBonus = ms => (ms <= R.fullSpeedWindowMs ? R.maxSpeedBonusPoints : Math.max(0, Math.round((R.maxSpeedBonusPoints * (10000 - ms)) / 8500)));
const clean = (t, n) => String(t ?? '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, n);

export class ArenaRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.conns = new Set();
    this.timers = [];
    this.resetRoom();
  }

  resetRoom() {
    this.timers.forEach(clearTimeout); this.timers = [];
    this.phase = 'lobby'; // lobby | intro | question | reveal | finished
    this.a = this.a || null; this.b = this.b || null; this.lv = this.lv ?? 0;
    this.teams = { A: Array(5).fill(null), B: Array(5).fill(null) };
    this.round = 0; this.rounds = []; this.scoreA = 0; this.scoreB = 0;
    this.laneBalance = [50, 50, 50, 50, 50];
    this.cheers = { A: 0, B: 0 };
    this.lastReveal = null; this.final = null;
    // xếp lại các bé đang kết nối vào đội theo cơ sở
    for (const c of this.conns) if (c.role === 'player') { c.slot = null; this.seat(c); }
  }

  later(fn, ms) { const id = setTimeout(() => { try { fn(); } catch (e) { console.error(e && e.stack || e); } }, ms); this.timers.push(id); return id; }

  async fetch(req) {
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('Cần kết nối WebSocket', { status: 426 });
    const role = req.headers.get('X-Role');
    if (!['player', 'host', 'stage', 'spectator'].includes(role)) return new Response('Sai vai trò', { status: 400 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();
    const c = {
      ws: server, role,
      pid: req.headers.get('X-Pid') || null,
      name: decodeURIComponent(req.headers.get('X-Name') || ''),
      branch: decodeURIComponent(req.headers.get('X-Branch') || ''),
      av: 'mao', slot: null, cheerAt: [], msgAt: [],
    };
    this.conns.add(c);
    server.addEventListener('message', e => this.onMessage(c, e.data));
    const gone = () => this.onClose(c);
    server.addEventListener('close', gone);
    server.addEventListener('error', gone);
    this.onOpen(c);
    const h = req.headers.get('Sec-WebSocket-Protocol') ? { 'Sec-WebSocket-Protocol': 'pec' } : {};
    return new Response(null, { status: 101, webSocket: client, headers: h });
  }

  send(c, msg) { try { c.ws.send(JSON.stringify(msg)); } catch (e) {} }
  broadcast(msg, filter) { const s = JSON.stringify(msg); for (const c of this.conns) if (!filter || filter(c)) { try { c.ws.send(s); } catch (e) {} } }

  /* ---------- kết nối ---------- */
  onOpen(c) {
    if (c.role === 'player') {
      // vào lại (mất mạng rồi kết nối lại): giữ chỗ và điểm cũ
      for (const T of ['A', 'B']) this.teams[T].forEach((p, lane) => {
        if (p && p.pid && p.pid === c.pid) { p.conn = c; c.slot = { team: T, lane }; c.av = p.av; }
      });
      for (const o of this.conns) if (o !== c && o.role === 'player' && o.pid === c.pid) { this.send(o, { t: 'err', msg: 'Bé đã vào phòng trên máy khác' }); try { o.ws.close(4000, 'replaced'); } catch (e) {} this.conns.delete(o); }
      if (!c.slot) this.seat(c);
    }
    this.send(c, { t: 'hello', role: c.role, you: c.slot, room: this.publicState() });
    if (this.phase !== 'lobby') this.catchUp(c);
    this.pushRoom();
  }

  onClose(c) {
    if (!this.conns.has(c)) return;
    this.conns.delete(c);
    if (c.role === 'player' && c.slot && this.phase === 'lobby') {
      const p = this.teams[c.slot.team][c.slot.lane];
      if (p && p.conn === c) this.teams[c.slot.team][c.slot.lane] = null;
    } else if (c.slot) {
      const p = this.teams[c.slot.team][c.slot.lane];
      if (p && p.conn === c) p.conn = null; // đang thi: giữ chỗ, coi như chưa trả lời
    }
    this.pushRoom();
  }

  seat(c) {
    if (!this.a || !this.b) { this.send(c, { t: 'info', msg: 'Đang chờ MC chọn 2 cơ sở thi đấu' }); return; }
    if (this.phase !== 'lobby') { this.send(c, { t: 'info', msg: 'Trận đang diễn ra, bé xem cùng khán giả nhé' }); return; }
    const camp = campusByName(c.branch);
    const T = camp && camp.id === this.a ? 'A' : camp && camp.id === this.b ? 'B' : null;
    if (!T) { this.send(c, { t: 'info', msg: `Trận này dành cho PEC ${campusById(this.a).name} và PEC ${campusById(this.b).name}. Bé ở lại cổ vũ nhé!` }); return; }
    const lane = LANE_ORDER.find(l => !this.teams[T][l]);
    if (lane === undefined) { this.send(c, { t: 'info', msg: 'Đội của bé đã đủ 5 bạn, bé ở lại cổ vũ nhé!' }); return; }
    this.teams[T][lane] = { human: true, pid: c.pid, name: c.name, av: c.av, conn: c, ...this.freshStats() };
    c.slot = { team: T, lane };
    this.send(c, { t: 'seat', you: c.slot });
  }

  freshStats() { return { score: 0, streak: 0, wins: 0, correctMs: 0, skills: { shield: false, double: false, snowball: false }, armed: {}, frostNext: false, slowNext: 0, act: '', tag: '' }; }

  /* ---------- tin nhắn ---------- */
  onMessage(c, raw) {
    const now = Date.now();
    c.msgAt = c.msgAt.filter(t => now - t < 1000); c.msgAt.push(now);
    if (c.msgAt.length > 20) return; // chặn gửi dồn
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    if (!m || typeof m.t !== 'string') return;
    if (m.t === 'ping') return this.send(c, { t: 'pong' });
    if (m.t === 'cheer') return this.onCheer(c, m);
    if (c.role === 'player') {
      if (m.t === 'avatar') return this.onAvatar(c, m);
      if (m.t === 'ans') return this.onAnswer(c, m, now);
      if (m.t === 'skill') return this.onSkill(c, m);
    }
    if (c.role === 'host') {
      if (m.t === 'setup') return this.onSetup(c, m);
      if (m.t === 'start') return this.onStart(c);
      if (m.t === 'frost') return this.onHostFrost();
      if (m.t === 'confetti') return this.broadcast({ t: 'cheer', side: 'all', emoji: '🎉', burst: true });
      if (m.t === 'reset') { this.resetRoom(); this.broadcast({ t: 'reset' }); return this.pushRoom(); }
    }
  }

  onCheer(c, m) {
    const now = Date.now();
    c.cheerAt = c.cheerAt.filter(t => now - t < 1000);
    if (c.cheerAt.length >= 4) return;
    c.cheerAt.push(now);
    const side = m.side === 'B' ? 'B' : 'A';
    this.cheers[side]++;
    const emoji = ['❄️', '❤️', '⭐', '🔥', '🎉'].includes(m.emoji) ? m.emoji : '❄️';
    this.broadcast({ t: 'cheer', side, emoji, A: this.cheers.A, B: this.cheers.B });
  }

  onAvatar(c, m) {
    if (!avatarById(m.av)) return;
    c.av = m.av;
    if (c.slot && this.phase === 'lobby') { const p = this.teams[c.slot.team][c.slot.lane]; if (p) p.av = m.av; }
    this.pushRoom();
  }

  onSetup(c, m) {
    if (this.phase !== 'lobby' && this.phase !== 'finished') return this.send(c, { t: 'err', msg: 'Trận đang diễn ra, bấm Làm lại phòng trước' });
    if (!campusById(m.a) || !campusById(m.b) || m.a === m.b) return this.send(c, { t: 'err', msg: 'Chọn 2 cơ sở khác nhau' });
    this.a = m.a; this.b = m.b; this.lv = [0, 1, 2].includes(+m.lv) ? +m.lv : 0;
    this.resetRoom();
    this.broadcast({ t: 'reset' });
    this.pushRoom();
  }

  onStart(c) {
    if (this.phase !== 'lobby') return this.send(c, { t: 'err', msg: 'Phòng không ở trạng thái chờ' });
    if (!this.a || !this.b) return this.send(c, { t: 'err', msg: 'Chưa chọn 2 cơ sở' });
    const used = new Set();
    for (const T of ['A', 'B']) this.teams[T].forEach(p => p && used.add(p.name));
    const names = shuffle(BOT_NAMES.filter(n => !used.has(n)));
    for (const T of ['A', 'B']) for (let l = 0; l < 5; l++) {
      if (!this.teams[T][l]) this.teams[T][l] = { human: false, name: names.pop() + ' 🤖', av: pick(CFG.zodiacAvatars).id, acc: (T === 'A' ? 0.7 : 0.68) + Math.random() * 0.14, ...this.freshStats() };
    }
    this.buildRounds();
    this.phase = 'intro';
    this.broadcast({ t: 'intro', match: this.matchInfo(), introMs: INTRO_MS });
    this.pushSnapshot('INTRO');
    this.later(() => this.startRound(1), INTRO_MS);
  }

  onHostFrost() {
    for (const c of this.conns) if (c.role === 'player' && c.slot) this.send(c, { t: 'frost', by: 'MC' });
  }

  /* ---------- trận đấu ---------- */
  buildRounds() {
    const pool = CFG.questionBank[LV_KEYS[this.lv]] || CFG.questionBank.kids;
    const used = {};
    this.rounds = [];
    for (let r = 1; r <= 10; r++) {
      const tier = r <= 3 ? 1 : r <= 7 ? 2 : 3;
      let cand = shuffle(pool.filter(q => q.tier === tier && !used[q.id]));
      if (cand.length < 5) cand = cand.concat(shuffle(pool.filter(q => !used[q.id] && !cand.includes(q))));
      if (cand.length < 5) { for (const k in used) delete used[k]; cand = cand.concat(shuffle(pool.filter(q => !cand.includes(q)))); }
      const laneQs = cand.slice(0, 5);
      laneQs.forEach(q => { used[q.id] = 1; });
      this.rounds.push({ round: r, mult: r >= 9 ? 2 : 1, laneQs });
    }
  }

  startRound(r) {
    this.round = r;
    this.phase = 'question';
    const rd = this.rounds[r - 1];
    this.qStart = Date.now();
    this.ans = { A: Array(5).fill(null), B: Array(5).fill(null) };
    this.resolved = false;
    this.botDue = 0;
    for (const T of ['A', 'B']) this.teams[T].forEach((p, l) => {
      const q = rd.laneQs[l];
      if (p.human) {
        if (p.conn) {
          this.send(p.conn, { t: 'q', r, mult: rd.mult, ms: Q_MS, q: { q: q.q, opts: q.opts, audio: q.audio || null } });
          if (p.frostNext) { p.frostNext = false; this.send(p.conn, { t: 'frost', by: 'opp' }); }
        }
      } else {
        // bạn máy trả lời theo độ khó, chậm hơn nếu vừa bị phủ tuyết
        const slow = p.slowNext || 0; p.slowNext = 0;
        const ms = Math.min(9600, Math.round(1600 + Math.random() * 5200 + slow));
        const ok = Math.random() < (p.acc - (slow ? 0.2 : 0));
        this.botDue = Math.max(this.botDue, ms);
        this.later(() => {
          if (this.resolved || this.round !== r || this.ans[T][l]) return;
          this.ans[T][l] = { c: ok ? q.ans : (q.ans + 1 + Math.floor(Math.random() * 3)) % 4, ms };
          this.notifyAnswered(T, l);
        }, ms);
      }
    });
    this.broadcast({ t: 'qall', r, mult: rd.mult, ms: Q_MS, laneQs: rd.laneQs.map(q => q.q) }, c => c.role !== 'player' || !c.slot);
    this.pushSnapshot('QUESTION');
    this.later(() => this.resolve(r), Q_MS + GRACE_MS);
  }

  notifyAnswered(T, l) {
    const O = T === 'A' ? 'B' : 'A';
    const opp = this.teams[O][l];
    if (opp && opp.human && opp.conn) this.send(opp.conn, { t: 'oppans' });
    this.broadcast({ t: 'answered', team: T, lane: l }, c => c.role === 'stage' || c.role === 'host');
  }

  onAnswer(c, m, now) {
    if (this.phase !== 'question' || !c.slot || +m.r !== this.round) return;
    const { team: T, lane: l } = c.slot;
    if (this.ans[T][l]) return;
    const choice = +m.c;
    if (![0, 1, 2, 3].includes(choice)) return;
    const ms = Math.max(320, Math.min(9900, now - this.qStart));
    this.ans[T][l] = { c: choice, ms };
    this.send(c, { t: 'locked', ms });
    this.notifyAnswered(T, l);
    // tất cả bé thật đã chốt: phân định sớm
    const humansLeft = ['A', 'B'].some(X => this.teams[X].some((p, k) => p.human && p.conn && !this.ans[X][k]));
    // tất cả bé thật đã chốt: phân định sớm, nhưng vẫn chờ các bạn máy trả lời xong
    const r = this.round;
    if (!humansLeft) this.later(() => this.resolve(r), Math.max(700, this.botDue - (now - this.qStart) + 300));
  }

  onSkill(c, m) {
    if (!c.slot || this.phase === 'lobby' || this.phase === 'finished') return;
    const p = this.teams[c.slot.team][c.slot.lane];
    const k = m.k;
    if (!p || !['shield', 'double', 'snowball'].includes(k) || p.skills[k]) return;
    if (k === 'snowball' && this.lv < 1) return;
    p.skills[k] = true;
    if (k === 'snowball') {
      const opp = this.teams[c.slot.team === 'A' ? 'B' : 'A'][c.slot.lane];
      if (opp.human) opp.frostNext = true; else opp.slowNext = 1350;
    } else p.armed[k] = true;
    this.send(c, { t: 'skillok', k });
  }

  resolve(r) {
    if (this.resolved || this.round !== r || this.phase !== 'question') return;
    this.resolved = true;
    this.phase = 'reveal';
    const rd = this.rounds[r - 1], mult = rd.mult;
    const lanes = [];
    let dA = 0, dB = 0;
    for (let l = 0; l < 5; l++) {
      const q = rd.laneQs[l], pa = this.teams.A[l], pb = this.teams.B[l];
      const ra = this.ans.A[l], rb = this.ans.B[l];
      const a = { c: ra ? ra.c : -1, ms: ra ? ra.ms : 10000 }; a.ok = a.c === q.ans;
      const b = { c: rb ? rb.c : -1, ms: rb ? rb.ms : 10000 }; b.ok = b.c === q.ans;
      let pA = 0, pB = 0, outcome = 'BOTH_MISS';
      if (a.ok && !b.ok) { pA = (R.baseCorrectPoints + speedBonus(a.ms)) * mult; outcome = 'A_SOLO'; pa.streak++; pb.streak = 0; pa.wins++; pa.correctMs += a.ms; this.laneBalance[l] = Math.min(82, this.laneBalance[l] + 12); }
      else if (!a.ok && b.ok) { pB = (R.baseCorrectPoints + speedBonus(b.ms)) * mult; outcome = 'B_SOLO'; pb.streak++; pa.streak = 0; pb.wins++; pb.correctMs += b.ms; this.laneBalance[l] = Math.max(18, this.laneBalance[l] - 12); }
      else if (a.ok && b.ok) {
        pa.correctMs += a.ms; pb.correctMs += b.ms;
        if (Math.abs(a.ms - b.ms) <= R.tieWindowMs) { pA = (R.baseCorrectPoints + speedBonus(a.ms)) * mult; pB = (R.baseCorrectPoints + speedBonus(b.ms)) * mult; outcome = 'TIE'; pa.streak++; pb.streak++; }
        else if (a.ms < b.ms) { pA = (R.baseCorrectPoints + speedBonus(a.ms)) * mult; pB = R.slowerCorrectConsolationPoints * mult; outcome = 'A_CLASH'; pa.streak++; pb.streak = 0; pa.wins++; this.laneBalance[l] = Math.min(82, this.laneBalance[l] + 8); }
        else { pB = (R.baseCorrectPoints + speedBonus(b.ms)) * mult; pA = R.slowerCorrectConsolationPoints * mult; outcome = 'B_CLASH'; pb.streak++; pa.streak = 0; pb.wins++; this.laneBalance[l] = Math.max(18, this.laneBalance[l] - 8); }
      } else { pa.streak = 0; pb.streak = 0; }
      const out = { A: { ...a, shield: false, combo: false }, B: { ...b, shield: false, combo: false } };
      // kỹ năng
      for (const [T, p, side] of [['A', pa, out.A], ['B', pb, out.B]]) {
        if (p.armed.double) { p.armed.double = false; if (T === 'A' ? pA > 0 : pB > 0) { if (T === 'A') pA *= 2; else pB *= 2; side.double = true; } }
        if (p.armed.shield) { p.armed.shield = false; if (!side.ok) { if (T === 'A') pA = 30 * mult; else pB = 30 * mult; side.shield = true; } }
      }
      if (pa.streak > 0 && pa.streak % 3 === 0) { pA += R.streak3BonusTeamPoints; out.A.combo = true; }
      if (pb.streak > 0 && pb.streak % 3 === 0) { pB += R.streak3BonusTeamPoints; out.B.combo = true; }
      // bạn máy dùng Bão Tuyết lên bé thật một lần khi đang chuỗi thắng (cấp Tuần Lộc trở lên)
      for (const [p, o] of [[pa, pb], [pb, pa]]) if (!p.human && o.human && this.lv >= 1 && p.streak >= 2 && !p.skills.snowball && r < 9) { p.skills.snowball = true; o.frostNext = true; }
      pa.score += pA; pb.score += pB; dA += pA; dB += pB;
      pa.act = pA > pB ? 'act-win' : pA < pB ? 'act-fall' : ''; pb.act = pB > pA ? 'act-win' : pB < pA ? 'act-fall' : '';
      pa.tag = pA > 0 ? `+${pA}đ` : '0đ'; pb.tag = pB > 0 ? `+${pB}đ` : '0đ';
      out.A.pts = pA; out.B.pts = pB; out.A.streak = pa.streak; out.B.streak = pb.streak; out.A.score = pa.score; out.B.score = pb.score;
      lanes.push({ ans: q.ans, outcome, bal: this.laneBalance[l], ...out });
    }
    this.scoreA += dA; this.scoreB += dB;
    this.lastReveal = { t: 'reveal', r, mult, lanes, scoreA: this.scoreA, scoreB: this.scoreB };
    this.broadcast(this.lastReveal);
    this.pushSnapshot('CLASH');
    this.later(() => (r < 10 ? this.startRound(r + 1) : this.finish()), REVEAL_MS);
  }

  finish() {
    this.phase = 'finished';
    const all = [];
    for (const T of ['A', 'B']) this.teams[T].forEach((p, l) => all.push({ team: T, lane: l, name: p.name, av: p.av, human: p.human, score: p.score, wins: p.wins }));
    all.sort((x, y) => y.score - x.score);
    let winner = this.scoreA > this.scoreB ? 'A' : this.scoreB > this.scoreA ? 'B' : null;
    if (!winner) { const msA = this.teams.A.reduce((s, p) => s + p.correctMs, 0), msB = this.teams.B.reduce((s, p) => s + p.correctMs, 0); winner = msA <= msB ? 'A' : 'B'; }
    this.final = { t: 'end', scoreA: this.scoreA, scoreB: this.scoreB, winner, standings: all, mvp: all[0] };
    this.broadcast(this.final);
    this.pushSnapshot('FINISHED');
  }

  /* ---------- trạng thái gửi đi ---------- */
  matchInfo() {
    const pub = p => ({ name: p.name, av: p.av, human: p.human });
    return { a: this.a, b: this.b, lv: this.lv, teamA: this.teams.A.map(pub), teamB: this.teams.B.map(pub) };
  }

  publicState() {
    const slot = p => p ? { name: p.name, av: p.av, human: p.human, online: !!(p.conn || !p.human) } : null;
    let viewers = 0; for (const c of this.conns) if (c.role !== 'player' || !c.slot) viewers++;
    return { phase: this.phase, a: this.a, b: this.b, lv: this.lv, round: this.round, scoreA: this.scoreA, scoreB: this.scoreB, teamA: this.teams.A.map(slot), teamB: this.teams.B.map(slot), viewers, cheers: this.cheers };
  }

  pushRoom() { this.broadcast({ t: 'room', room: this.publicState() }); }

  // ảnh chụp trạng thái cho màn sân khấu và khán giả (giữ định dạng MATCH_SNAPSHOT cũ)
  snapshot(phase) {
    const rd = this.rounds[this.round - 1];
    const m = p => ({ name: p ? p.name : '', av: p ? (avatarById(p.av) || CFG.zodiacAvatars[0]).file : '', zodiac: p ? (avatarById(p.av) || CFG.zodiacAvatars[0]).zodiac : '', score: p ? p.score : 0, streak: p ? p.streak : 0, lastAct: p ? p.act : '', lastTag: p ? p.tag : '', human: p ? p.human : false });
    return { type: 'MATCH_SNAPSHOT', phase, round: this.round || 0, mult: rd ? rd.mult : 1, myCamp: campusById(this.a), oppCamp: campusById(this.b), teamAScore: this.scoreA, teamBScore: this.scoreB, laneBalance: this.laneBalance, laneQs: rd ? rd.laneQs.map(q => q.q) : [], teamA: this.teams.A.map(m), teamB: this.teams.B.map(m), final: this.final };
  }

  pushSnapshot(phase) {
    const s = this.snapshot(phase); this.lastSnap = s;
    this.broadcast({ t: 'snap', snap: s }, c => c.role !== 'player' || !c.slot);
    this.broadcast({ t: 'room', room: this.publicState() }, c => c.role === 'host');
  }

  catchUp(c) {
    if (c.role === 'player' && c.slot && this.phase !== 'finished') {
      this.send(c, { t: 'intro', match: this.matchInfo(), introMs: 0, round: this.round });
      const p = this.teams[c.slot.team][c.slot.lane];
      if (this.phase === 'question' && !this.ans[c.slot.team][c.slot.lane]) {
        const rd = this.rounds[this.round - 1], q = rd.laneQs[c.slot.lane];
        this.send(c, { t: 'q', r: this.round, mult: rd.mult, ms: Math.max(0, Q_MS - (Date.now() - this.qStart)), q: { q: q.q, opts: q.opts, audio: q.audio || null } });
      }
      if (p && p.skills) this.send(c, { t: 'skills', used: p.skills });
    }
    if (this.lastSnap) this.send(c, { t: 'snap', snap: this.lastSnap });
    if (this.final) this.send(c, this.final);
  }
}

export default {
  async fetch() { return new Response('Not found', { status: 404 }); }
};
