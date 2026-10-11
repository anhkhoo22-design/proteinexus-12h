'use strict';
const http = require('node:http'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const scrypt = require('node:util').promisify(crypto.scrypt), {createDatabase} = require('./database.cjs'), roster = require('./roster.cjs');
const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
fs.mkdirSync(dataDir, {
  recursive: true
});
const db = createDatabase(path.join(dataDir, 'proteinexus.sqlite'));
const ready = (async () => {
  await db.exec(`${db.remote ? '' : 'PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;'}
CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,name TEXT NOT NULL,name_key TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('student','teacher')),class_name TEXT NOT NULL,recovery TEXT NOT NULL,created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS login_sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES accounts(id),expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS bank(id TEXT PRIMARY KEY,type TEXT NOT NULL,topic TEXT NOT NULL,prompt TEXT NOT NULL,options TEXT NOT NULL,answer TEXT NOT NULL,explanation TEXT NOT NULL,points INTEGER NOT NULL,active INTEGER NOT NULL DEFAULT 1,author TEXT,created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS submissions(user_id TEXT REFERENCES accounts(id),question_id TEXT REFERENCES bank(id),selected TEXT,correct INTEGER,points INTEGER,answer TEXT,explanation TEXT,created INTEGER,PRIMARY KEY(user_id,question_id));
CREATE TABLE IF NOT EXISTS notes(user_id TEXT PRIMARY KEY REFERENCES accounts(id),content TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS exam_sessions(id TEXT PRIMARY KEY,user_id TEXT REFERENCES accounts(id),total_questions INTEGER NOT NULL,correct INTEGER NOT NULL,points INTEGER NOT NULL,created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS class_requests(user_id TEXT PRIMARY KEY REFERENCES accounts(id),target_class TEXT NOT NULL,created INTEGER NOT NULL);`);
  await db.batch(require('./curriculum.cjs').questions.map(q => ({
    sql: 'INSERT OR IGNORE INTO bank VALUES(?,?,?,?,?,?,?,?,1,NULL,?)',
    args: [q.id, q.type || 'mcq', q.topic, q.prompt, JSON.stringify(q.options || []), JSON.stringify(q.answer), q.explanation, q.points, Date.now()]
  })));
})();
if (db.remote && (!process.env.TEACHER_ACTIVATION_CODE || !process.env.OWNER_ACTIVATION_CODE)) throw Error('Cloud deployment requires stable TEACHER_ACTIVATION_CODE and OWNER_ACTIVATION_CODE');
const codeFile = path.join(dataDir, 'activation-codes.json');
if (!db.remote && !fs.existsSync(codeFile)) fs.writeFileSync(codeFile, JSON.stringify({
  teacher: crypto.randomBytes(20).toString('base64url'),
  owner: crypto.randomBytes(20).toString('base64url')
}, null, 2), {
  mode: 0o600
});
const codes = db.remote ? {
  teacher: process.env.TEACHER_ACTIVATION_CODE,
  owner: process.env.OWNER_ACTIVATION_CODE
} : JSON.parse(fs.readFileSync(codeFile, 'utf8'));
const limits = new Map(), clients = new Set(), SESSION_MS = 7 * 86400000, digest = s => crypto.createHash('sha256').update(s).digest('hex');
function fail(status, message) {
  throw Object.assign(new Error(message), {
    status
  });
}
function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(data));
}
function token(req) {
  return (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('px_session='))?.slice(11);
}
async function session(req) {
  const t = token(req);
  return t ? await db.prepare('SELECT a.* FROM login_sessions s JOIN accounts a ON a.id=s.user_id WHERE token=? AND expires>?').get(digest(t), Date.now()) : null;
}
function canManage(u) {
  return u.role === 'teacher' || u.name === roster.owner;
}
async function auth(req, p) {
  const u = await session(req);
  if (!u) fail(401, 'Bạn cần đăng nhập để tiếp tục.');
  if (p === 'manage' && !canManage(u) || p === 'owner' && u.name !== roster.owner) fail(403, 'Bạn không có quyền sử dụng chức năng này.');
  return u;
}
function user(u) {
  return {
    id: u.id,
    name: u.name,
    role: u.role,
    className: u.class_name,
    isOfficial: roster.names.has(roster.nameKey(u.name)) && u.class_name === '12H',
    capabilities: {
      manageQuestions: canManage(u),
      personalStudy: u.name === roster.owner
    }
  };
}
function cookie(res, t, expired = false) {
  res.setHeader('Set-Cookie', `px_session=${t}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${expired ? 0 : SESSION_MS / 1000}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}
async function login(res, id) {
  const t = crypto.randomBytes(32).toString('base64url');
  await db.prepare('INSERT INTO login_sessions VALUES(?,?,?)').run(digest(t), id, Date.now() + SESSION_MS);
  cookie(res, t);
}
async function body(req) {
  let n = 0, parts = [];
  for await (const c of req) {
    n += c.length;
    if (n > 32768) fail(413, 'Dữ liệu quá lớn.');
    parts.push(c);
  }
  try {
    const b = JSON.parse(Buffer.concat(parts).toString('utf8'));
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw Error();
    return b;
  } catch {
    fail(400, 'Dữ liệu không hợp lệ.');
  }
}
function text(v, label, max = 2000) {
  if (typeof v !== 'string' || !v.trim() || v.length > max) fail(400, `${label} không hợp lệ (tối đa ${max} ký tự).`);
  return v.trim();
}
function password(v) {
  if (typeof v !== 'string' || v.length < 8 || v.length > 128) fail(400, 'Mật khẩu cần từ 8 đến 128 ký tự.');
  return v;
}
async function hash(v) {
  const salt = crypto.randomBytes(16).toString('hex');
  return salt + ':' + (await scrypt(v, salt, 64)).toString('hex');
}
async function verify(v, stored) {
  const [salt, h] = stored.split(':');
  return crypto.timingSafeEqual(await scrypt(v, salt, 64), Buffer.from(h, 'hex'));
}
function recovery(b) {
  const cls = (typeof b.className === 'string' && b.className.trim()) ? b.className.trim().normalize('NFC') : '12H';
  if (Array.isArray(b.hobbies) && b.hobbies.length === 3 && b.hobbies.every(x => typeof x === 'string' && x.trim() && x.length <= 100)) {
    return JSON.stringify([cls, ...b.hobbies.map(x => x.normalize('NFC').trim())]);
  }
  const pin = typeof b.pin === 'string' ? b.pin.trim() : typeof b.recoveryPin === 'string' ? b.recoveryPin.trim() : '';
  if (pin && pin.length >= 2 && pin.length <= 50) {
    return JSON.stringify([cls, pin.normalize('NFC')]);
  }
  fail(400, 'Nhập mã bảo mật khôi phục (PIN hoặc sở thích).');
}
function limit(req, key, max = 30) {
  const k = req.socket.remoteAddress + ':' + key, n = Date.now();
  let v = limits.get(k);
  if (!v || v.reset < n) {
    v = {
      count: 0,
      reset: n + 60000
    };
    limits.set(k, v);
  }
  if (++v.count > max) fail(429, 'Bạn đã thử nhiều lần. Vui lòng chờ một phút.');
}
function qInput(b) {
  if (!['amino', 'peptide', 'protein', 'properties', 'enzyme', 'application', 'calculation'].includes(b.topic)) fail(400, 'Chủ đề không hợp lệ.');
  if (!['mcq', 'tf', 'short'].includes(b.type)) fail(400, 'Dạng câu hỏi không hợp lệ.');
  let options = [], answer = b.answer;
  if (b.type === 'mcq') {
    if (!Array.isArray(b.options) || b.options.length !== 4) fail(400, 'Cần bốn lựa chọn.');
    options = b.options.map(x => text(x, 'Lựa chọn', 500));
    if (new Set(options).size !== 4 || !Number.isInteger(answer) || answer < 0 || answer > 3) fail(400, 'Lựa chọn hoặc đáp án không hợp lệ.');
  }
  if (b.type === 'tf') {
    if (!Array.isArray(b.options) || b.options.length !== 4 || !Array.isArray(answer) || answer.length !== 4 || answer.some(x => typeof x !== 'boolean')) fail(400, 'Cần bốn nhận định và bốn đáp án đúng/sai.');
    options = b.options.map(x => text(x, 'Nhận định', 500));
  }
  if (b.type === 'short') answer = text(answer, 'Đáp án ngắn', 100);
  if (!Number.isInteger(b.points) || b.points < 1 || b.points > 100) fail(400, 'Điểm phải từ 1 đến 100.');
  return {
    type: b.type,
    topic: b.topic,
    prompt: text(b.prompt, 'Câu hỏi'),
    options,
    answer,
    explanation: text(b.explanation, 'Giải thích'),
    points: b.points
  };
}
async function board(classFilter) {
  let sql = `SELECT a.name,a.role,a.class_name className,COUNT(s.question_id) answered,COALESCE(SUM(s.correct),0) correct,COALESCE(SUM(s.points),0) points FROM accounts a LEFT JOIN submissions s ON s.user_id=a.id WHERE a.role='student'`;
  const args = [];
  if (classFilter) {
    sql += ` AND a.class_name=?`;
    args.push(classFilter);
  }
  sql += ` GROUP BY a.id ORDER BY points DESC,correct DESC,a.created,a.id`;
  const rows = await db.prepare(sql).all(...args);
  let last = '', rank = 0;
  return rows.map((r, i) => {
    const k = `${r.points}:${r.correct}`;
    if (k !== last) rank = i + 1;
    last = k;
    return {
      ...r,
      isOfficial: roster.names.has(roster.nameKey(r.name)) && r.className === '12H',
      rank
    };
  });
}
async function examBoard() {
  const rows = await db.prepare(`SELECT e.id, a.name, a.class_name className, e.total_questions total, e.correct, e.points, e.created FROM exam_sessions e JOIN accounts a ON a.id=e.user_id ORDER BY e.correct DESC, e.points DESC, e.created DESC LIMIT 50`).all();
  return rows.map((r, i) => ({
    ...r,
    rank: i + 1,
    isOfficial: roster.names.has(roster.nameKey(r.name)) && r.className === '12H'
  }));
}
async function broadcast(type = 'leaderboard') {
  for (const c of clients) {
    if (!await session(c.req)) c.res.end(); else {
      let data = { updated: true };
      if (type === 'leaderboard') data = await board();
      else if (type === 'exams') data = await examBoard();
      c.res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
    }
  }
}
function shortKey(v) {
  return v.normalize('NFC').trim().toLocaleLowerCase('vi').replace(/,/g, '.').replace(/\s+/g, ' ');
}
async function api(req, res, url) {
  const route = url.pathname, m = req.method;
  if (m !== 'GET') {
    if (m !== 'DELETE' && !(req.headers['content-type'] || '').startsWith('application/json')) fail(415, 'Yêu cầu dữ liệu JSON.');
    if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) fail(403, 'Nguồn yêu cầu không hợp lệ.');
  }
  if (route === '/api/health' && m === 'GET') {
    await db.prepare('SELECT 1 AS ok').get();
    return json(res, 200, {
      ok: true
    });
  }
  if (route === '/api/auth/me' && m === 'GET') {
    const u = await session(req);
    return json(res, 200, {
      user: u ? user(u) : null
    });
  }
  if (route === '/api/auth/signup' && m === 'POST') {
    limit(req, 'signup');
    const b = await body(req);
    const rawName = text(b.name, 'Họ tên', 80);
    const key = roster.nameKey(rawName);
    if (key.length < 2) fail(400, 'Họ tên quá ngắn.');
    const name = roster.names.get(key) || rawName;
    password(b.password);
    const className = (typeof b.className === 'string' && b.className.trim()) ? b.className.trim().slice(0, 30) : '12H';
    const recoveryValue = recovery(b);
    if (name === roster.teacher || name === roster.owner) {
      const required = name === roster.teacher ? process.env.TEACHER_ACTIVATION_CODE || codes.teacher : process.env.OWNER_ACTIVATION_CODE || codes.owner;
      if (typeof b.activationCode !== 'string' || !crypto.timingSafeEqual(Buffer.from(digest(b.activationCode)), Buffer.from(digest(required)))) fail(403, 'Mã kích hoạt riêng không đúng.');
    }
    if (await db.prepare('SELECT id FROM accounts WHERE name_key=?').get(key)) fail(409, 'Họ tên này đã đăng ký. Hãy đăng nhập hoặc khôi phục mật khẩu.');
    const id = crypto.randomUUID(), role = name === roster.teacher ? 'teacher' : 'student', pw = await hash(b.password), rec = await hash(recoveryValue);
    try {
      await db.prepare('INSERT INTO accounts VALUES(?,?,?,?,?,?,?,?)').run(id, name, key, pw, role, className, rec, Date.now());
    } catch (e) {
      if (e.code?.includes('SQLITE')) fail(409, 'Họ tên này đã đăng ký.');
      throw e;
    }
    await login(res, id);
    await broadcast();
    return json(res, 201, {
      user: user(await db.prepare('SELECT * FROM accounts WHERE id=?').get(id))
    });
  }
  if (route === '/api/auth/login' && m === 'POST') {
    const b = await body(req), key = roster.nameKey(text(b.name, 'Họ tên', 80));
    limit(req, 'login:' + key, 12);
    if (typeof b.password !== 'string' || b.password.length > 128) fail(400, 'Mật khẩu không hợp lệ.');
    const u = await db.prepare('SELECT * FROM accounts WHERE name_key=?').get(key), valid = await verify(b.password, u?.password || ('0').repeat(32) + ':' + ('00').repeat(64));
    if (!u || !valid) fail(401, 'Họ tên hoặc mật khẩu không đúng.');
    await login(res, u.id);
    return json(res, 200, {
      user: user(u)
    });
  }
  if (route === '/api/auth/reset' && m === 'POST') {
    const b = await body(req), key = roster.nameKey(text(b.name, 'Họ tên', 80));
    limit(req, 'reset:' + key, 5);
    password(b.password);
    const rec = recovery(b), u = await db.prepare('SELECT * FROM accounts WHERE name_key=?').get(key), valid = await verify(rec, u?.recovery || ('0').repeat(32) + ':' + ('00').repeat(64));
    if (!u || !valid) fail(400, 'Thông tin khôi phục không đúng. Lớp và mã bảo mật phải khớp nguyên văn.');
    const pw = await hash(b.password);
    await db.batch([{
      sql: 'UPDATE accounts SET password=? WHERE id=?',
      args: [pw, u.id]
    }, {
      sql: 'DELETE FROM login_sessions WHERE user_id=?',
      args: [u.id]
    }]);
    cookie(res, '', true);
    await broadcast();
    return json(res, 200, {
      ok: true
    });
  }
  if (route === '/api/auth/logout' && m === 'POST') {
    const t = token(req);
    if (t) await db.prepare('DELETE FROM login_sessions WHERE token=?').run(digest(t));
    cookie(res, '', true);
    return json(res, 200, {
      ok: true
    });
  }
  if (route === '/api/questions' && m === 'GET') {
    const u = await auth(req), manage = canManage(u), rows = await db.prepare(manage ? 'SELECT * FROM bank ORDER BY created,id' : 'SELECT * FROM bank WHERE active=1 ORDER BY created,id').all(), attempts = await db.prepare('SELECT * FROM submissions WHERE user_id=?').all(u.id), byId = new Map(attempts.map(a => [a.question_id, {
      selected: JSON.parse(a.selected),
      correct: !!a.correct,
      points: a.points,
      answer: JSON.parse(a.answer),
      explanation: a.explanation
    }]));
    return json(res, 200, {
      questions: rows.map(q => ({
        id: q.id,
        type: q.type,
        topic: q.topic,
        prompt: q.prompt,
        options: JSON.parse(q.options),
        points: q.points,
        active: !!q.active,
        ...manage ? {
          answer: JSON.parse(q.answer),
          explanation: q.explanation
        } : {},
        attempt: byId.get(q.id) || null
      })),
      stats: await db.prepare('SELECT COUNT(*) answered,COALESCE(SUM(correct),0) correct,COALESCE(SUM(points),0) points FROM submissions WHERE user_id=?').get(u.id)
    });
  }
  if (route === '/api/questions' && m === 'POST') {
    const u = await auth(req, 'manage'), q = qInput(await body(req)), id = crypto.randomUUID();
    await db.prepare('INSERT INTO bank VALUES(?,?,?,?,?,?,?,?,1,?,?)').run(id, q.type, q.topic, q.prompt, JSON.stringify(q.options), JSON.stringify(q.answer), q.explanation, q.points, u.id, Date.now());
    await broadcast('questions');
    return json(res, 201, {
      id
    });
  }
  const match = route.match(/^\/api\/questions\/([\w-]+)$/);
  if (match && m === 'PUT') {
    await auth(req, 'manage');
    const id = match[1], q = qInput(await body(req));
    if (!await db.prepare('SELECT id FROM bank WHERE id=?').get(id)) fail(404, 'Không tìm thấy câu hỏi.');
    if (await db.prepare('SELECT 1 FROM submissions WHERE question_id=?').get(id)) fail(409, 'Câu đã có bài làm. Hãy ẩn rồi tạo bản mới để giữ kết quả.');
    await db.prepare('UPDATE bank SET type=?,topic=?,prompt=?,options=?,answer=?,explanation=?,points=? WHERE id=?').run(q.type, q.topic, q.prompt, JSON.stringify(q.options), JSON.stringify(q.answer), q.explanation, q.points, id);
    await broadcast('questions');
    return json(res, 200, {
      ok: true
    });
  }
  if (match && m === 'PATCH') {
    await auth(req, 'manage');
    const b = await body(req);
    if (typeof b.active !== 'boolean') fail(400, 'Trạng thái không hợp lệ.');
    if (!(await db.prepare('UPDATE bank SET active=? WHERE id=?').run(+b.active, match[1])).changes) fail(404, 'Không tìm thấy câu hỏi.');
    await broadcast('questions');
    return json(res, 200, {
      ok: true
    });
  }
  if (route === '/api/attempts' && m === 'POST') {
    const u = await auth(req), b = await body(req);
    if (typeof b.questionId !== 'string') fail(400, 'Câu hỏi không hợp lệ.');
    const q = await db.prepare('SELECT * FROM bank WHERE id=? AND active=1').get(b.questionId);
    if (!q) fail(404, 'Câu hỏi đã ẩn hoặc không tồn tại.');
    const selected = b.selected, answer = JSON.parse(q.answer);
    if (q.type === 'mcq' && (!Number.isInteger(selected) || selected < 0 || selected > 3) || q.type === 'tf' && (!Array.isArray(selected) || selected.length !== 4 || selected.some(x => typeof x !== 'boolean')) || q.type === 'short' && (typeof selected !== 'string' || !selected.trim() || selected.length > 100)) fail(400, 'Bạn cần trả lời đầy đủ.');
    const correct = +(q.type === 'short' ? shortKey(selected) === shortKey(answer) : JSON.stringify(selected) === JSON.stringify(answer)), points = correct ? q.points : 0, result = await db.prepare('INSERT OR IGNORE INTO submissions VALUES(?,?,?,?,?,?,?,?)').run(u.id, q.id, JSON.stringify(selected), correct, points, q.answer, q.explanation, Date.now()), a = await db.prepare('SELECT * FROM submissions WHERE user_id=? AND question_id=?').get(u.id, q.id);
    if (result.changes) await broadcast();
    return json(res, 200, {
      selected: JSON.parse(a.selected),
      correct: !!a.correct,
      points: a.points,
      answer: JSON.parse(a.answer),
      explanation: a.explanation,
      alreadyAnswered: !result.changes
    });
  }
  if (route === '/api/leaderboard' && m === 'GET') {
    await auth(req);
    const cls = url.searchParams.get('class');
    return json(res, 200, {
      rows: await board(cls || undefined)
    });
  }
  if (route === '/api/personal' && m === 'GET') {
    const u = await auth(req, 'owner');
    return json(res, 200, {
      notes: (await db.prepare('SELECT content FROM notes WHERE user_id=?').get(u.id))?.content || '',
      mistakes: await db.prepare('SELECT b.topic,b.prompt,s.explanation FROM submissions s JOIN bank b ON b.id=s.question_id WHERE s.user_id=? AND s.correct=0').all(u.id)
    });
  }
  if (route === '/api/personal' && m === 'PUT') {
    const u = await auth(req, 'owner'), b = await body(req);
    if (typeof b.notes !== 'string' || b.notes.length > 10000) fail(400, 'Ghi chú tối đa 10.000 ký tự.');
    await db.prepare('INSERT INTO notes VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET content=excluded.content').run(u.id, b.notes);
    return json(res, 200, {
      ok: true
    });
  }
  if (route === '/api/exams' && m === 'POST') {
    const u = await auth(req), b = await body(req);
    const total = Number(b.total) || 10, correct = Number(b.correct) || 0, points = Number(b.points) || 0;
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO exam_sessions VALUES(?,?,?,?,?,?)').run(id, u.id, total, correct, points, Date.now());
    await broadcast('exams');
    return json(res, 201, { ok: true, id, rows: await examBoard() });
  }
  if (route === '/api/exam-leaderboard' && m === 'GET') {
    await auth(req);
    return json(res, 200, { rows: await examBoard() });
  }
  if (route === '/api/class/request' && m === 'GET') {
    const u = await auth(req);
    const reqRow = await db.prepare('SELECT target_class targetClass, created FROM class_requests WHERE user_id=?').get(u.id);
    return json(res, 200, { request: reqRow || null, currentClass: u.class_name });
  }
  if (route === '/api/class/request' && m === 'POST') {
    const u = await auth(req), b = await body(req);
    const target = text(b.targetClass, 'Lớp yêu cầu', 30);
    await db.prepare('INSERT INTO class_requests VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET target_class=excluded.target_class, created=excluded.created').run(u.id, target, Date.now());
    await broadcast('classes');
    return json(res, 200, { ok: true, targetClass: target });
  }
  if (route === '/api/admin/members' && m === 'GET') {
    await auth(req, 'manage');
    const members = await db.prepare(`SELECT a.id, a.name, a.class_name className, a.role, a.created, COUNT(s.question_id) answered, COALESCE(SUM(s.correct),0) correct, COALESCE(SUM(s.points),0) points FROM accounts a LEFT JOIN submissions s ON s.user_id=a.id GROUP BY a.id ORDER BY a.class_name, points DESC, a.name`).all();
    const requests = await db.prepare(`SELECT r.user_id userId, r.target_class targetClass, r.created, a.name, a.class_name currentClass FROM class_requests r JOIN accounts a ON a.id=r.user_id ORDER BY r.created DESC`).all();
    const classCounts = {};
    for (const mem of members) {
      const clsList = mem.role === 'teacher'
        ? mem.className.split(',').map(s => s.trim()).filter(Boolean)
        : [mem.className];
      for (const c of clsList) {
        classCounts[c] = (classCounts[c] || 0) + 1;
      }
    }
    return json(res, 200, {
      members: members.map(mem => ({
        ...mem,
        isTeacher: mem.role === 'teacher',
        isOwner: mem.name === roster.owner,
        isOfficial: roster.names.has(roster.nameKey(mem.name)) && (mem.className === '12H' || (mem.role === 'teacher' && mem.className.includes('12H')))
      })),
      requests,
      classCounts
    });
  }
  const resetMatch = route.match(/^\/api\/admin\/members\/([0-9a-f-]+)\/reset-password$/i);
  if (resetMatch && m === 'POST') {
    const admin = await auth(req, 'manage');
    const userId = resetMatch[1];
    const targetAcc = await db.prepare('SELECT * FROM accounts WHERE id=?').get(userId);
    if (!targetAcc) fail(404, 'Không tìm thấy tài khoản.');
    if (targetAcc.name === roster.owner && admin.name !== roster.owner) {
      fail(403, 'Chỉ chủ sở hữu mới có quyền đặt lại mật khẩu cho tài khoản này.');
    }
    const b = await body(req);
    const newPass = typeof b.newPassword === 'string' && b.newPassword.trim() ? b.newPassword.trim() : '12345678';
    password(newPass);
    const newHash = await hash(newPass);
    await db.prepare('UPDATE accounts SET password=? WHERE id=?').run(newHash, userId);
    await db.prepare('DELETE FROM login_sessions WHERE user_id=?').run(userId);
    return json(res, 200, { ok: true, name: targetAcc.name, temporaryPassword: newPass });
  }
  const memberMatch = route.match(/^\/api\/admin\/members\/([0-9a-f-]+)$/i);
  if (memberMatch && m === 'PATCH') {
    await auth(req, 'manage');
    const b = await body(req);
    const target = text(b.className, 'Tên lớp', 100);
    const userId = memberMatch[1];
    await db.prepare('UPDATE accounts SET class_name=? WHERE id=?').run(target, userId);
    await db.prepare('DELETE FROM class_requests WHERE user_id=?').run(userId);
    await broadcast('classes');
    await broadcast('leaderboard');
    return json(res, 200, { ok: true, className: target });
  }
  if (memberMatch && m === 'DELETE') {
    const admin = await auth(req, 'manage');
    const userId = memberMatch[1];
    const targetAcc = await db.prepare('SELECT * FROM accounts WHERE id=?').get(userId);
    if (!targetAcc) fail(404, 'Không tìm thấy tài khoản.');
    if (targetAcc.name === roster.owner || targetAcc.name === roster.teacher || targetAcc.id === admin.id) {
      fail(403, 'Không thể xóa tài khoản giáo viên hoặc quản trị viên.');
    }
    await db.prepare('DELETE FROM submissions WHERE user_id=?').run(userId);
    await db.prepare('DELETE FROM exam_sessions WHERE user_id=?').run(userId);
    await db.prepare('DELETE FROM class_requests WHERE user_id=?').run(userId);
    await db.prepare('DELETE FROM notes WHERE user_id=?').run(userId);
    await db.prepare('DELETE FROM login_sessions WHERE user_id=?').run(userId);
    await db.prepare('DELETE FROM accounts WHERE id=?').run(userId);
    await broadcast('classes');
    await broadcast('leaderboard');
    await broadcast('exams');
    return json(res, 200, { ok: true, deleted: targetAcc.name });
  }
  const reqMatch = route.match(/^\/api\/admin\/requests\/([0-9a-f-]+)$/i);
  if (reqMatch && m === 'DELETE') {
    await auth(req, 'manage');
    await db.prepare('DELETE FROM class_requests WHERE user_id=?').run(reqMatch[1]);
    await broadcast('classes');
    return json(res, 200, { ok: true });
  }
  if (route === '/api/events' && m === 'GET') {
    await auth(req);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    });
    res.write(': connected\n\n');
    const c = {
      req,
      res
    };
    clients.add(c);
    const timer = setInterval(async () => {
      if (!await session(req)) return res.end();
      res.write(': heartbeat\n\n');
    }, 15000);
    res.on('close', () => {
      clearInterval(timer);
      clients.delete(c);
    });
    return;
  }
  fail(404, 'Không tìm thấy chức năng.');
}
const allowed = new Set(['index.html', 'lab.html', 'study-addon.js', 'study-addon.css', 'course-data.js', 'style.css', 'app.js', 'chemical-2d-engine.js', 'education-data.js', 'education-manager.js', 'protein-data.js', 'structure-levels.js', 'viewer3d.js', 'virtual-lab.js']);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.pdb': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml'
};
const https = require('node:https'), remotePdb = new Map();
function downloadPdb(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, response => {
      if (response.statusCode !== 200) {
        response.resume();
        return reject(Error('PDB not found'));
      }
      let size = 0, parts = [];
      response.on('data', part => {
        size += part.length;
        if (size > 32 * 1024 * 1024) {
          response.destroy();
          reject(Error('PDB too large'));
        } else parts.push(part);
      });
      response.on('end', () => resolve(Buffer.concat(parts)));
      response.on('error', reject);
    });
    request.setTimeout(12000, () => request.destroy(Error('PDB timeout')));
    request.on('error', reject);
  });
}
async function customPdb(id) {
  id = id.toUpperCase();
  if (remotePdb.has(id)) return remotePdb.get(id);
  let content;
  try {
    content = await downloadPdb('https://files.rcsb.org/download/' + id + '.pdb');
  } catch {
    try {
      content = await downloadPdb('https://www.ebi.ac.uk/pdbe/entry-files/download/pdb' + id.toLowerCase() + '.ent');
    } catch {
      fail(404, 'Không tải được PDB. Kiểm tra mã và kết nối mạng.');
    }
  }
  if (!content.toString('utf8').includes('ATOM')) fail(404, 'Mô hình không có tọa độ nguyên tử.');
  if (remotePdb.size >= 20) remotePdb.delete(remotePdb.keys().next().value);
  remotePdb.set(id, content);
  return content;
}
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  try {
    await ready;
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/pdb/')) {
      const id = url.pathname.slice(9);
      if (!(/^[a-z0-9]{4}$/i).test(id)) fail(400, 'Mã PDB không hợp lệ.');
      const p = path.join(__dirname, 'pdb', id.toUpperCase() + '.pdb');
      if (!fs.existsSync(p)) {
        const content = await customPdb(id);
        res.writeHead(200, {
          'Content-Type': mime['.pdb']
        });
        return res.end(content);
      }
      res.writeHead(200, {
        'Content-Type': mime['.pdb']
      });
      return fs.createReadStream(p).pipe(res);
    }
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (!['GET', 'HEAD'].includes(req.method)) fail(405, 'Phương thức không hỗ trợ.');
    const f = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    if (!allowed.has(f) && !(/^lib\/(3Dmol-min|three\.min|OrbitControls)\.js$/).test(f) && !(/^pdb\/([A-Z0-9]{4}|linear_peptide)\.pdb$/).test(f)) fail(404, 'Không tìm thấy trang.');
    const p = path.join(__dirname, f);
    if (!fs.existsSync(p)) fail(404, 'Không tìm thấy tệp.');
    res.writeHead(200, {
      'Content-Type': mime[path.extname(f)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(p).on('error', () => res.destroy()).pipe(res);
  } catch (e) {
    if (!res.headersSent) json(res, e.status || 500, {
      error: e.status ? e.message : 'Máy chủ gặp lỗi. Vui lòng thử lại.'
    }); else res.end();
    if (!e.status) console.error(e);
  }
});
const clean = setInterval(async () => {
  try { await db.prepare('DELETE FROM login_sessions WHERE expires<?').run(Date.now()); } catch(e) { console.error('Session cleanup temporarily unavailable'); }
  for (const [k, v] of limits) if (v.reset < Date.now()) limits.delete(k);
}, 60000);
clean.unref();
async function start() {
  await ready;
  server.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => console.log(`Proteinexus: http://localhost:${server.address().port}`));
}
if (require.main === module) start().catch(e => {
  console.error(e.message);
  process.exitCode = 1;
});
module.exports = {
  server,
  db,
  start,
  ready
};
