const assert = require('assert');
const { start, server, db, ready } = require('../backend.cjs');
const codes = require('../data/activation-codes.json');

async function run() {
  await ready;
  const port = 3911;
  server.listen(port, '127.0.0.1');
  const base = `http://127.0.0.1:${port}/api/`;

  async function call(p, method = 'GET', body, cookie) {
    const res = await fetch(base + p, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(cookie ? { 'Cookie': cookie } : {}),
        'Origin': `http://127.0.0.1:${port}`
      },
      body: body ? JSON.stringify(body) : undefined
    });
    let data;
    try {
      data = await res.json();
    } catch(e) {
      data = null;
    }
    return {
      status: res.status,
      data,
      cookie: res.headers.get('set-cookie')?.split(';')[0] || cookie
    };
  }

  console.log('Testing Classes and Exam Leaderboard APIs...');

  // 1. Register a regular student
  const uid = Date.now();
  const regStud = await call('auth/signup', 'POST', {
    name: 'Học Sinh ' + uid,
    className: '12L',
    password: 'Password123!',
    pin: '1234'
  });
  assert.strictEqual(regStud.status, 201);
  const studentCookie = regStud.cookie;
  const studentUser = regStud.data.user;

  // 2. Register or Login Teacher Thang
  let regTeacher = await call('auth/signup', 'POST', {
    name: 'Phạm Quốc Thắng',
    className: '12H',
    password: 'Password123!',
    pin: '1234',
    activationCode: codes.teacher
  });
  if (regTeacher.status === 409) {
    regTeacher = await call('auth/login', 'POST', {
      name: 'Phạm Quốc Thắng',
      password: 'Password123!'
    });
  }
  assert(regTeacher.status === 200 || regTeacher.status === 201);
  assert.strictEqual(regTeacher.data.user.capabilities.manageQuestions, true);
  const teacherCookie = regTeacher.cookie;

  // 3. Register or Login Khoa
  let regKhoa = await call('auth/signup', 'POST', {
    name: 'Hồ Nguyễn Anh Khoa',
    className: '12H',
    password: 'Password123!',
    pin: '1234',
    activationCode: codes.owner
  });
  if (regKhoa.status === 409) {
    regKhoa = await call('auth/login', 'POST', {
      name: 'Hồ Nguyễn Anh Khoa',
      password: 'Password123!'
    });
  }
  assert(regKhoa.status === 200 || regKhoa.status === 201);
  assert.strictEqual(regKhoa.data.user.capabilities.manageQuestions, true);
  assert.strictEqual(regKhoa.data.user.capabilities.personalStudy, true);
  const khoaCookie = regKhoa.cookie;

  // 4. Test regular student blocked from admin members
  const studBlocked = await call('admin/members', 'GET', null, studentCookie);
  assert.strictEqual(studBlocked.status, 403, 'Regular student must be 403 Forbidden');

  // 5. Test Teacher accessing admin members
  const teacherMembers = await call('admin/members', 'GET', null, teacherCookie);
  assert.strictEqual(teacherMembers.status, 200);
  assert(teacherMembers.data.members.length >= 3);
  assert(teacherMembers.data.classCounts['12L'] >= 1);
  assert(teacherMembers.data.classCounts['12H'] >= 2);

  // 6. Test Khoa accessing admin members
  const khoaMembers = await call('admin/members', 'GET', null, khoaCookie);
  assert.strictEqual(khoaMembers.status, 200);

  // 7. Student requests to join class 12A1
  const sendReq = await call('class/request', 'POST', { targetClass: '12A1' }, studentCookie);
  assert.strictEqual(sendReq.status, 200);

  // Check student request state
  const getReq = await call('class/request', 'GET', null, studentCookie);
  assert.strictEqual(getReq.status, 200);
  assert.strictEqual(getReq.data.request.targetClass, '12A1');

  // Teacher sees the student's request
  const teacherViewReqs = await call('admin/members', 'GET', null, teacherCookie);
  const found = teacherViewReqs.data.requests.find(r => r.userId === studentUser.id);
  assert(found, 'Teacher must see pending class request');
  assert.strictEqual(found.targetClass, '12A1');

  // Teacher approves: patches member class to 12A1
  const approve = await call(`admin/members/${studentUser.id}`, 'PATCH', { className: '12A1' }, teacherCookie);
  assert.strictEqual(approve.status, 200);

  // Verify student class is now 12A1 and pending request was removed
  const teacherCheckAfter = await call('admin/members', 'GET', null, teacherCookie);
  const targetUser = teacherCheckAfter.data.members.find(m => m.id === studentUser.id);
  assert.strictEqual(targetUser.className, '12A1');
  assert(!teacherCheckAfter.data.requests.find(r => r.userId === studentUser.id), 'Request must be cleared');

  // 8. Exam session submission
  const examSub = await call('exams', 'POST', { total: 10, correct: 9, points: 45 }, studentCookie);
  assert.strictEqual(examSub.status, 201);

  // Exam leaderboard
  const examBoard = await call('exam-leaderboard', 'GET', null, studentCookie);
  assert.strictEqual(examBoard.status, 200);
  assert(examBoard.data.rows.length >= 1);
  const row = examBoard.data.rows[0];
  assert.strictEqual(row.correct, 9);
  assert.strictEqual(row.total, 10);
  assert.strictEqual(row.className, '12A1');

  // 9. Teacher assigns multiple classes to themselves
  const teacherId = teacherMembers.data.members.find(m => m.name === 'Phạm Quốc Thắng').id;
  const updateTeacherClasses = await call(`admin/members/${teacherId}`, 'PATCH', { className: '12H, 12L, 12A1' }, teacherCookie);
  assert.strictEqual(updateTeacherClasses.status, 200);

  const teacherCheckClasses = await call('admin/members', 'GET', null, teacherCookie);
  const updatedTeacher = teacherCheckClasses.data.members.find(m => m.id === teacherId);
  assert.strictEqual(updatedTeacher.className, '12H, 12L, 12A1');
  assert(teacherCheckClasses.data.classCounts['12L'] !== undefined);
  assert(teacherCheckClasses.data.classCounts['12A1'] !== undefined);

  // 10. Admin resets student password (when student forgets PIN)
  const resetRes = await call(`admin/members/${studentUser.id}/reset-password`, 'POST', { newPassword: 'NewPassword999!' }, teacherCookie);
  assert.strictEqual(resetRes.status, 200);
  assert.strictEqual(resetRes.data.temporaryPassword, 'NewPassword999!');

  // Student logs in with the new password
  const studentReLogin = await call('auth/login', 'POST', {
    name: studentUser.name,
    password: 'NewPassword999!'
  });
  assert.strictEqual(studentReLogin.status, 200);

  // Regular student cannot reset someone else's password
  const studResetBlocked = await call(`admin/members/${teacherId}/reset-password`, 'POST', { newPassword: 'Hacked1234!' }, studentReLogin.cookie);
  assert.strictEqual(studResetBlocked.status, 403);

  // 11. Admin deletes student account
  const deleteRes = await call(`admin/members/${studentUser.id}`, 'DELETE', null, teacherCookie);
  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteRes.data.deleted, studentUser.name);

  // Verify student is completely gone
  const afterDeleteMembers = await call('admin/members', 'GET', null, teacherCookie);
  assert(!afterDeleteMembers.data.members.find(m => m.id === studentUser.id), 'Deleted student must not be in members');

  // Admin cannot delete teacher or owner
  const cantDeleteTeacher = await call(`admin/members/${teacherId}`, 'DELETE', null, khoaCookie);
  assert.strictEqual(cantDeleteTeacher.status, 403);

  console.log('ALL CLASS, EXAM LEADERBOARD, RESET PW & DELETE ACCOUNT TESTS PASSED!');
  server.close();
  process.exit(0);
}

run().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
