// Cổng vào phòng đấu trực tiếp: xác thực rồi chuyển WebSocket vào Durable Object ArenaRoom (binding ARENA)
// Bé (player): mã phiên đăng nhập gửi trong Sec-WebSocket-Protocol: ["pec", "t.<token>"]
// MC (host): khóa quầy hoặc khóa quản trị, mã hóa base64url: ["pec", "k.<base64url(khóa)>"]
// Màn sân khấu (stage) và khán giả (spectator): không cần đăng nhập
async function sha(t) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))), x => x.toString(16).padStart(2, '0')).join(''); }
function sameKey(a, b) { if (!a || !b || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
const fromB64u = s => { try { s = s.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(s + '==='.slice((s.length + 3) % 4)); return new TextDecoder().decode(Uint8Array.from(bin, ch => ch.charCodeAt(0))); } catch (e) { return ''; } };
const deny = (msg, s) => new Response(msg, { status: s });

export async function onRequest({ request, env }) {
  if (request.headers.get('Upgrade') !== 'websocket') return deny('Cần kết nối WebSocket', 426);
  if (!env.ARENA) return deny('Phòng đấu trực tiếp chưa được bật', 503);
  const url = new URL(request.url);
  const room = String(url.searchParams.get('room') || '').toUpperCase();
  if (!/^[A-Z0-9]{3,8}$/.test(room)) return deny('Mã phòng gồm 3–8 chữ hoặc số', 400);
  const role = url.searchParams.get('role') || 'spectator';
  if (!['player', 'host', 'stage', 'spectator'].includes(role)) return deny('Sai vai trò', 400);
  const protos = (request.headers.get('Sec-WebSocket-Protocol') || '').split(',').map(s => s.trim());
  const cred = protos.find(p => p.startsWith('t.') || p.startsWith('k.')) || '';
  const h = new Headers({ Upgrade: 'websocket', 'X-Role': role });
  if (protos.includes('pec')) h.set('Sec-WebSocket-Protocol', 'pec');
  if (role === 'player') {
    if (!env.DB || !cred.startsWith('t.')) return deny('Cần đăng ký để vào phòng thi', 401);
    const p = await env.DB.prepare('SELECT p.id, p.name, p.branch, p.flagged FROM tokens t JOIN players p ON p.id = t.player_id WHERE t.hash = ?').bind(await sha(cred.slice(2))).first();
    if (!p) return deny('Phiên đăng nhập đã hết', 401);
    h.set('X-Pid', String(p.id)); h.set('X-Name', encodeURIComponent(p.name)); h.set('X-Branch', encodeURIComponent(p.branch));
  }
  if (role === 'host') {
    const k = cred.startsWith('k.') ? fromB64u(cred.slice(2)) : '';
    if (!(sameKey(k, env.STAFF_KEY || '') || sameKey(k, env.ADMIN_KEY || ''))) return deny('Sai khóa MC', 401);
  }
  const stub = env.ARENA.get(env.ARENA.idFromName(room));
  return stub.fetch(new Request('https://arena/room/' + room, { headers: h }));
}
