'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'proteinexus-api-'));
process.env.DATA_DIR = data;
const {server, db, ready} = require('../backend.cjs');
const checks = [];
async function main() {
  await ready;
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  async function call(route, method = 'GET', body, cookie = '', extra = {}) {
    const r = await fetch(base + '/api/' + route, {
      method,
      headers: {
        ...body ? {
          'Content-Type': 'application/json'
        } : {},
        ...cookie ? {
          Cookie: cookie
        } : {},
        ...extra
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return {
      status: r.status,
      data: await r.json(),
      cookie: r.headers.get('set-cookie')?.split(';')[0] || cookie
    };
  }
  const check = name => checks.push(name), registration = {
    name: 'Nguyễn Bình An',
    password: 'Test!Pass123',
    className: '12H',
    hobbies: ['Đọc sách', 'Bơi lội', 'Hóa học']
  };
  assert.equal((await call('questions')).status, 401);
  check('Authentication required');
  assert.equal((await call('auth/signup', 'POST', {
    ...registration,
    name: ' '
  })).status, 400);
  assert.equal((await call('auth/signup', 'POST', {
    ...registration,
    name: 'Học Sinh Khách',
    className: '12A'
  })).status, 201);
  check('Open enrollment and class flexibility');
  let r = await call('auth/signup', 'POST', {
    ...registration,
    role: 'teacher'
  });
  assert.equal(r.status, 201);
  const student = r.cookie;
  assert.equal(r.data.user.role, 'student');
  assert.equal(r.data.user.capabilities.manageQuestions, false);
  assert.equal(r.data.user.name, registration.name);
  r = await call('auth/signup', 'POST', {
    ...registration,
    name: '  NGUYỄN  BÌNH AN '
  });
  assert.equal(r.status, 409);
  check('Canonical name uniqueness and no client role escalation');
  const simultaneous = await Promise.all([1, 2].map(() => call('auth/signup', 'POST', {
    ...registration,
    name: 'Trần Huỳnh Anh'
  })));
  assert.deepEqual(simultaneous.map(x => x.status).sort(), [201, 409]);
  check('Concurrent one-time registration');
  assert.equal((await call('auth/login', 'POST', {
    name: registration.name,
    password: 'wrong'
  })).status, 401);
  r = await call('auth/login', 'POST', {
    name: registration.name,
    password: registration.password
  });
  assert.equal(r.status, 200);
  check('Name/password login');
  const account = await db.prepare('SELECT * FROM accounts WHERE name=?').get(registration.name);
  assert(!account.password.includes(registration.password));
  assert(!account.recovery.includes('Đọc sách'));
  check('Password and recovery hashes');
  r = await call('questions', 'GET', undefined, student);
  assert.equal(r.status, 200);
  const bank = r.data.questions;
  assert(bank.length >= 48);
  assert(bank.every(q => !(('answer' in q)) && !(('explanation' in q))));
  assert.deepEqual([...new Set(bank.map(q => q.type))].sort(), ['mcq', 'short', 'tf']);
  check('Three formats and answers hidden before submission');
  assert.equal((await call('questions', 'POST', {
    type: 'short'
  }, student)).status, 403);
  assert.equal((await call('personal', 'GET', undefined, student)).status, 403);
  check('Server-side permission enforcement');
  for (const [id, selected] of [['core-01', 0], ['tf-01', [true, true, false, false]], ['short-04', '0,8']]) {
    r = await call('attempts', 'POST', {
      questionId: id,
      selected
    }, student);
    assert.equal(r.status, 200);
    assert.equal(r.data.correct, true);
    assert(r.data.explanation);
  }
  r = await call('attempts', 'POST', {
    questionId: 'core-01',
    selected: 3
  }, student);
  assert.equal(r.data.alreadyAnswered, true);
  assert.equal(r.data.selected, 0);
  assert.equal((await call('questions', 'GET', undefined, student)).data.stats.answered, 3);
  assert.equal((await call('attempts', 'POST', {
    questionId: 'tf-02',
    selected: [true]
  }, student)).status, 400);
  check('Grading, numeric commas, immutable first submission, complete TF required');
  r = await call('auth/reset', 'POST', {
    ...registration,
    hobbies: ['đọc sách', 'Bơi lội', 'Hóa học'],
    password: 'New!Pass123'
  });
  assert.equal(r.status, 400);
  r = await call('auth/reset', 'POST', {
    ...registration,
    hobbies: ['Bơi lội', 'Đọc sách', 'Hóa học'],
    password: 'New!Pass123'
  });
  assert.equal(r.status, 400);
  r = await call('auth/reset', 'POST', {
    ...registration,
    password: 'New!Pass123'
  });
  assert.equal(r.status, 200);
  assert.equal((await call('questions', 'GET', undefined, student)).status, 401);
  assert.equal((await call('auth/login', 'POST', {
    name: registration.name,
    password: registration.password
  })).status, 401);
  assert.equal((await call('auth/login', 'POST', {
    name: registration.name,
    password: 'New!Pass123'
  })).status, 200);
  check('Exact ordered recovery and all previous sessions revoked');
  const codes = JSON.parse(fs.readFileSync(path.join(data, 'activation-codes.json')));
  for (const name of ['Phạm Quốc Thắng', 'Hồ Nguyễn Anh Khoa']) assert.equal((await call('auth/signup', 'POST', {
    ...registration,
    name
  })).status, 403);
  const teacher = await call('auth/signup', 'POST', {
    ...registration,
    name: 'Phạm Quốc Thắng',
    activationCode: codes.teacher
  });
  assert.equal(teacher.status, 201);
  assert.equal(teacher.data.user.role, 'teacher');
  assert.equal(teacher.data.user.capabilities.personalStudy, false);
  const owner = await call('auth/signup', 'POST', {
    ...registration,
    name: 'Hồ Nguyễn Anh Khoa',
    activationCode: codes.owner
  });
  assert.equal(owner.status, 201);
  assert.equal(owner.data.user.role, 'student');
  assert.equal(owner.data.user.capabilities.personalStudy, true);
  check('Privileged activation and two public roles');
  for (const c of [teacher.cookie, owner.cookie]) {
    r = await call('questions', 'POST', {
      type: 'short',
      topic: 'protein',
      prompt: 'Tổng số gốc amino acid của insulin?',
      answer: '51',
      explanation: '21 + 30 = 51.',
      points: 10
    }, c);
    assert.equal(r.status, 201);
    assert.equal((await call('questions/' + r.data.id, 'PUT', {
      type: 'short',
      topic: 'protein',
      prompt: 'Số gốc của insulin?',
      answer: '51',
      explanation: '21 + 30 = 51.',
      points: 10
    }, c)).status, 200);
    assert.equal((await call('questions/' + r.data.id, 'PATCH', {
      active: false
    }, c)).status, 200);
  }
  assert.equal((await call('questions/core-01', 'PUT', {
    type: 'short',
    topic: 'protein',
    prompt: 'Sửa câu đã chấm?',
    answer: '51',
    explanation: 'Lời giải.',
    points: 10
  }, teacher.cookie)).status, 409);
  check('Create/edit/hide questions, submitted questions protected');
  assert.equal((await call('personal', 'PUT', {
    notes: 'Ghi chú riêng của mình.'
  }, owner.cookie)).status, 200);
  assert.equal((await call('personal', 'GET', undefined, owner.cookie)).data.notes, 'Ghi chú riêng của mình.');
  r = await call('leaderboard', 'GET', undefined, owner.cookie);
  const publicOwner = r.data.rows.find(x => x.name === 'Hồ Nguyễn Anh Khoa');
  assert.equal(publicOwner.role, 'student');
  assert(!(('capabilities' in publicOwner)));
  assert(!JSON.stringify(r.data).includes('personalStudy'));
  check('Private notes and public profile conceal privileged capabilities');
  for (const f of ['roster.cjs', 'backend.cjs', 'curriculum.cjs', 'data/activation-codes.json', 'data/proteinexus.sqlite', 'package.json', 'sources/x']) assert.equal((await fetch(base + '/' + f)).status, 404);
  assert.equal((await call('auth/logout', 'POST', {}, owner.cookie, {
    Origin: 'https://untrusted.example'
  })).status, 403);
  check('Private files blocked and cross-origin writes rejected');
  assert.equal(require('../roster.cjs').students.length, 35);
  assert.equal(new Set(require('../roster.cjs').students).size, 35);
  check('35 unique roster names');
  const https = require('node:https'), originalGet = https.get, urls = [];
  https.get = (url, callback) => {
    urls.push(url);
    const request = new (require('node:events').EventEmitter)();
    request.setTimeout = () => request;
    request.destroy = e => request.emit('error', e);
    process.nextTick(() => {
      const response = require('node:stream').Readable.from([Buffer.from('ATOM      1  CA  GLY A   1      0.000   0.000   0.000\n')]);
      response.statusCode = url.includes('ebi.ac.uk') ? 200 : 404;
      callback(response);
    });
    return request;
  };
  try {
    for (let i = 0; i < 2; i++) {
      const response = await fetch(base + '/api/pdb/9XYZ');
      assert.equal(response.status, 200);
      assert((await response.text()).includes('ATOM'));
    }
    assert.equal(urls.length, 2);
    assert(urls[0].startsWith('https://files.rcsb.org/download/'));
    assert(urls[1].startsWith('https://www.ebi.ac.uk/pdbe/'));
    assert.equal((await fetch(base + '/api/pdb/INVALID')).status, 400);
  } finally {
    https.get = originalGet;
  }
  check('Original custom PDB proxy, fallback and cache');
  console.log(checks.map(x => 'PASS ' + x).join('\n'));
  console.log('Total: ' + checks.length + ' groups passed.');
}
main().catch(e => {
  console.error(e);
  process.exitCode = 1;
}).finally(async () => {
  await new Promise(r => server.close(r));
  db.close();
  const resolved = fs.realpathSync(data);
  if (!resolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith('proteinexus-api-')) throw Error('Unexpected test directory');
  fs.rmSync(resolved, {
    recursive: true,
    force: true
  });
});
