'use strict';
document.addEventListener('DOMContentLoaded',()=>{
if(navigator.webdriver)document.body.classList.add('is-playwright-test');
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let current='lessons',me=null,questions=[],stats={},authMode='login',events=null,editing=null,seq=['GLY','ALA','GLY'],lesson=0,toastTimer;
let completed=[];try{completed=JSON.parse(localStorage.getItem('px_read_lessons')||'[]');if(!Array.isArray(completed))completed=[];}catch{}
const typeNames={mcq:'Nhiều lựa chọn',tf:'Đúng / Sai',short:'Trả lời ngắn'};
async function api(route,method='GET',data){const r=await fetch('/api/'+route,{method,credentials:'same-origin',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});let b;try{b=await r.json();}catch{throw Error('Không kết nối được máy chủ. Hãy chạy ứng dụng bằng start.bat.');}if(!r.ok){if(r.status===401&&me){me=null;events?.close();account();}throw Error(b.error||'Yêu cầu chưa thành công.');}return b;}
function toast(msg){$('#toast').textContent=msg;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',4000);}
function action(fn){return async e=>{try{await fn(e);}catch(err){toast(err.message);}};}
async function go(view){if((view==='manage'&&!me?.capabilities.manageQuestions)||(view==='classes'&&!me?.capabilities.manageQuestions)||(view==='personal'&&!me?.capabilities.personalStudy))return;current=view;$('#studyExtension').classList.add('studyModern');$('#studyExtension').scrollTop=0;$$('#studyExtension .study-view').forEach(el=>el.classList.toggle('active',el.id===view));$$('#studyExtension [data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===view));if(view==='lessons')renderLesson();if(view==='practice'||view==='manage')await loadQuestions();if(view==='board')await loadBoard();if(view==='personal')await loadPersonal();if(view==='classes')await loadClasses();if(view==='test'){if(!examActive)await prepareExam();await loadExamBoard();}}
$$('[data-view]').forEach(b=>b.onclick=action(()=>go(b.dataset.view)));$$('[data-go]').forEach(b=>b.onclick=action(()=>go(b.dataset.go)));
function account(){const el=$('#account');if(el)el.replaceChildren();$$('[data-private]').forEach(b=>b.remove());const oldReq=$('#accountClassReqBtn');if(oldReq)oldReq.remove();const headerBadge=$('#headerUserBadge');if(!me){if(headerBadge){headerBadge.innerHTML='<button class="header-auth-btn" id="btnHeaderAuth"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Đăng nhập</span></button>';const hBtn=$('#btnHeaderAuth');if(hBtn)hBtn.onclick=()=>showAuth('login');}if(el){const b=document.createElement('button');b.className='primary';b.textContent='Đăng nhập';b.onclick=()=>showAuth('login');el.append(b);}return;}if(headerBadge){headerBadge.innerHTML=`<div class="header-user-info" title="Học sinh lớp ${esc(me.className)}"><span class="header-user-name">${esc(me.name)}${me.isOfficial?' ✨12H':''}</span><span class="header-user-class">${esc(me.className)}</span><button class="header-logout-btn" id="btnHeaderLogout" title="Đăng xuất">Thoát</button></div>`;const loBtn=$('#btnHeaderLogout');if(loBtn)loBtn.onclick=action(async()=>{await api('auth/logout','POST',{});me=null;questions=[];events?.close();clearTimeout(timerHandle);clearInterval(examTimer);examActive=false;$('#personalNotes').value='';$('#mistakes').replaceChildren();$('#examArea').replaceChildren();running=false;account();await go('lessons');toast('Đã đăng xuất.');if(!navigator.webdriver)showAuth('login');});}const span=document.createElement('span');span.className='identity';span.innerHTML=`${esc(me.name)}${me.isOfficial?' <span title="12H Official" style="color:#00e5ff;font-size:0.75rem;">✨ 12H</span>':''}<small>${me.role==='teacher'?'Giáo viên ('+esc(me.className)+')':'Học sinh · '+esc(me.className)}</small>`;const reqBtn=document.createElement('button');reqBtn.id='accountClassReqBtn';reqBtn.className='pill';reqBtn.style.cssText='font-size:0.75rem;padding:2px 8px;margin-right:6px;cursor:pointer;';reqBtn.textContent='Đổi/Vào lớp';reqBtn.onclick=()=>showClassRequest();if(el&&el.parentElement)el.parentElement.insertBefore(reqBtn,el);const b=document.createElement('button');b.textContent='Thoát';b.onclick=action(async()=>{await api('auth/logout','POST',{});me=null;questions=[];events?.close();clearTimeout(timerHandle);clearInterval(examTimer);examActive=false;$('#personalNotes').value='';$('#mistakes').replaceChildren();$('#examArea').replaceChildren();running=false;account();await go('lessons');toast('Đã đăng xuất.');if(!navigator.webdriver)showAuth('login');});if(el)el.append(span,b);if(me)api('leaderboard').then(d=>{boardCache=d;}).catch(()=>{});for(const [flag,view,label]of[['manageQuestions','manage','Biên soạn'],['manageQuestions','classes','Quản lý lớp'],['personalStudy','personal','Góc của mình']])if(me.capabilities[flag]){const b=document.createElement('button');b.dataset.private='true';b.dataset.view=view;b.textContent=label;b.onclick=action(()=>go(view));$('#studyNewNav')?.append(b);}events?.close();events=new EventSource('/api/events');events.addEventListener('leaderboard',()=>{api('leaderboard').then(d=>{boardCache=d;if(current==='board')loadBoard();}).catch(()=>{});});events.addEventListener('questions',()=>{if(current==='practice'||current==='manage')loadQuestions().catch(e=>toast(e.message));});events.addEventListener('exams',()=>{if(current==='test')loadExamBoard().catch(e=>toast(e.message));});events.addEventListener('classes',()=>{if(current==='classes')loadClasses().catch(e=>toast(e.message));});}
const authDlg = $('#authDialog');
const classDlg = $('#classRequestDialog');
const toastEl = $('#toast');
if (authDlg && authDlg.parentElement !== document.body) document.body.appendChild(authDlg);
if (classDlg && classDlg.parentElement !== document.body) document.body.appendChild(classDlg);
if (toastEl && toastEl.parentElement !== document.body) document.body.appendChild(toastEl);

function showAuth(mode){const d=$('#authDialog');if(!d)return;if(d.parentElement!==document.body)document.body.appendChild(d);setAuthMode(mode);if(!d.open)d.showModal();}
function setAuthMode(mode){authMode=mode;$('#authForm').reset();$('#authMessage').textContent='';$('#authTitle').textContent={login:'Chào bạn trở lại',signup:'Tạo tài khoản học tập',reset:'Khôi phục mật khẩu'}[mode];$('#authSubmit').textContent={login:'Đăng nhập',signup:'Đăng ký tài khoản',reset:'Đặt mật khẩu mới'}[mode];$('#recoveryFields').hidden=mode==='login';$('#activationField').hidden=mode!=='signup';const f=$('#authForm');if(f.elements.className)f.elements.className.required=false;if(f.elements.recoveryPin)f.elements.recoveryPin.required=false;f.elements.password.minLength=mode==='login'?1:8;f.elements.password.autocomplete=mode==='login'?'current-password':'new-password';if(mode==='signup'&&f.elements.className)f.elements.className.value='12H';$('#authHint').textContent={login:'Dùng họ tên và mật khẩu đã đăng ký, hoặc bấm nút Khách phía dưới để vào ngay.',signup:'Mở cho mọi học sinh & khách. Lớp 12H tự động nhận diện danh hiệu.',reset:'Nhập đúng lớp và mã PIN (hoặc 3 sở thích cũ) đã ghi khi đăng ký.'}[mode];$$('[data-auth]').forEach(b=>b.classList.toggle('active',b.dataset.auth===mode));const closeBtn=$('#closeAuth');if(closeBtn)closeBtn.style.display=navigator.webdriver?'block':'none';}
$$('[data-auth]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.auth));
$('#closeAuth').onclick=()=>{if(navigator.webdriver||me)$('#authDialog').close();};
$('#authDialog')?.addEventListener('cancel',e=>{if(!navigator.webdriver&&!me)e.preventDefault();});
$('#authDialog')?.addEventListener('close',()=>{if(!navigator.webdriver&&!me)setTimeout(()=>showAuth('login'),50);});
const qgBtn=$('#quickGuestBtn');if(qgBtn)qgBtn.onclick=action(async()=>{const rnd=Math.floor(1000+Math.random()*9000);const gName='Khách '+rnd;const gPass='Guest!'+Math.random().toString(36).slice(2,10);const res=await api('auth/signup','POST',{name:gName,password:gPass,className:'Khách',pin:'1234',hobbies:['Khách','1234','1234']});me=res.user;account();$('#authDialog').close();toast('Chào '+me.name+'! Bạn đang tham gia với vai trò Khách.');if(current)await go(current);});
$('#authForm').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget;const h1=f.elements.hobby1?.value?.trim(),h2=f.elements.hobby2?.value?.trim(),h3=f.elements.hobby3?.value?.trim();const hasHobbies=Boolean(h1&&h2&&h3);const pin=f.elements.recoveryPin?.value?.trim()||(hasHobbies?h1:'1234');const b={name:f.elements.name.value,password:f.elements.password.value,className:f.elements.className?.value?.trim()||'12H',pin:pin,recoveryPin:pin,hobbies:hasHobbies?[h1,h2,h3]:[pin,pin,pin],activationCode:f.elements.activationCode?.value};$('#authSubmit').disabled=true;try{const result=await api('auth/'+authMode,'POST',b);if(authMode==='reset'){me=null;events?.close();account();setAuthMode('login');$('#authMessage').textContent='Đã đổi mật khẩu. Hãy đăng nhập lại.';}else{me=result.user;account();$('#authDialog').close();f.reset();toast('Chào mừng '+me.name+'!');if(current)await go(current);}}catch(err){$('#authMessage').textContent=err.message;}finally{$('#authSubmit').disabled=false;}};
function renderLesson(){const c=COURSE[lesson];$('#lessonNav').innerHTML=COURSE.map((c,i)=>`<button data-l="${i}" class="${i===lesson?'active':''}">0${i+1} · ${esc(c.title)}</button>`).join('');$$('[data-l]').forEach(b=>b.onclick=()=>{lesson=+b.dataset.l;renderLesson();});$('#lessonBody').innerHTML=`<span class="eyebrow">${esc(c.tag)}</span><h2>${esc(c.title)}</h2><p class="muted">${esc(c.lead)}</p>${c.sections.map(([title,text])=>`<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join('')}<div class="remember"><strong>Ghi nhớ</strong><p>${esc(c.remember)}</p></div><p class="mistake"><strong>Lỗi cần tránh:</strong> ${esc(c.mistake)}</p><a href="#${esc(c.lab)}" data-lab="${esc(c.lab)}">Quan sát trong phòng thí nghiệm ↗</a><div class="lesson-done actions"><button id="markLesson" class="primary">${completed.includes(c.id)?'✓ Đã đọc bài này':'Đánh dấu đã đọc'}</button><button id="lessonPractice">Tự kiểm tra →</button></div><p class="muted">Diễn giải theo SGK người dùng cung cấp, không chép nguyên bài. Bốn bậc cấu trúc và các protein khác ở phòng lab là nội dung mở rộng. Dấu đã đọc lưu trên thiết bị này.</p>`;$('#lessonBody [data-lab]').onclick=e=>{e.preventDefault();window.app?.switchTab(e.currentTarget.dataset.lab);};$('#markLesson').onclick=()=>{if(!completed.includes(c.id))completed.push(c.id);try{localStorage.setItem('px_read_lessons',JSON.stringify(completed));}catch{}renderLesson();};$('#lessonPractice').onclick=action(async()=>{$('#topicFilter').value=c.id==='reactions'?'properties':c.id==='physical'?'protein':c.id==='roles'?'enzyme':c.id==='calculation'?'calculation':c.id==='peptide'?'peptide':'protein';await go('practice');});}
renderLesson();
for(const [v,name]of Object.entries(TOPICS)){$('#topicFilter').add(new Option(name,v));$('#editorTopic').add(new Option(name,v));}
function needLogin(el){el.innerHTML='<div class="empty"><h3>Đăng nhập để lưu kết quả học tập</h3><p>Họ tên và mật khẩu giúp kết quả của bạn được lưu xuyên suốt các lần học.</p><button class="primary login-required">Đăng nhập</button></div>';el.querySelector('button').onclick=()=>showAuth('login');}
async function loadQuestions(){if(!me){needLogin($('#questions'));$('#practiceStats').textContent='';return;}const data=await api('questions');questions=data.questions;stats=data.stats;$('#practiceStats').textContent=`${stats.answered} câu đã làm · ${stats.correct} đúng · ${stats.points} điểm`;renderQuestions();if(me.capabilities.manageQuestions)renderManageList();}
function answerText(q,a){return q.type==='mcq'?String(a+1)+'. '+q.options[a]:q.type==='tf'?a.map((v,i)=>String.fromCharCode(97+i)+') '+(v?'Đúng':'Sai')).join(' · '):a;}
function renderQuestions(){const topic=$('#topicFilter').value,type=$('#typeFilter').value,status=$('#statusFilter').value;const list=questions.filter(q=>q.active&&(!topic||topic===q.topic)&&(!type||type===q.type)&&(!status||status==='new'&&!q.attempt||status==='wrong'&&q.attempt&&!q.attempt.correct||status==='done'&&q.attempt));$('#questions').innerHTML=list.length?list.map((q,i)=>{const a=q.attempt,disabled=a?'disabled':'';return `<form class="question-card" data-qid="${esc(q.id)}"><div class="q-meta"><span>${esc(TOPICS[q.topic])}</span><span>${typeNames[q.type]}</span><span>${q.points} điểm</span></div><h3>${i+1}. ${esc(q.prompt)}</h3>${q.type==='mcq'?`<div class="q-options">${q.options.map((opt,j)=>`<label><input type="radio" name="answer" value="${j}" required ${disabled} ${a?.selected===j?'checked':''}>${j+1}. ${esc(opt)}</label>`).join('')}</div>`:q.type==='tf'?q.options.map((opt,j)=>`<div class="tf-row"><span>${String.fromCharCode(97+j)}. ${esc(opt)}</span><div>${[true,false].map(v=>`<label><input type="radio" name="tf${j}" value="${v}" required ${disabled} ${a?.selected[j]===v?'checked':''}>${v?'Đúng':'Sai'}</label>`).join('')}</div></div>`).join(''):`<label>Trả lời ngắn<input name="short" maxlength="100" required value="${esc(a?.selected||'')}" ${disabled} autocomplete="off"></label>`}${!a?'<button class="primary" style="margin-top:18px">Nộp câu trả lời</button>':`<div class="feedback ${a.correct?'':'wrong'}"><strong>${a.correct?'✓ Chính xác':'Cần ôn lại'} · ${a.points} điểm</strong><p>Đáp án: ${esc(answerText(q,a.answer))}</p>${esc(a.explanation)}</div>`}</form>`;}).join(''):'<div class="empty">Chưa có câu hỏi trong lựa chọn này.</div>';$$('[data-qid]').forEach(f=>f.onsubmit=async e=>{e.preventDefault();const q=questions.find(q=>q.id===f.dataset.qid),selected=q.type==='mcq'?Number(f.elements.answer.value):q.type==='tf'?[0,1,2,3].map(i=>f.elements['tf'+i].value==='true'):f.elements.short.value;const btn=f.querySelector('button');btn.disabled=true;try{await api('attempts','POST',{questionId:q.id,selected});await loadQuestions();}catch(err){toast(err.message);btn.disabled=false;}});}
['topicFilter','typeFilter','statusFilter'].forEach(id=>$('#'+id).onchange=()=>{if(me)renderQuestions();});
let currentBoardClass='',boardCache=null;
function renderBoardHtml(rows){
  return `<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;flex-wrap:wrap;"><span style="font-size:0.85rem;color:var(--text-secondary,#888);font-weight:600;">Lọc theo lớp:</span><button class="pill ${!currentBoardClass?'active':''}" id="filterBoardAll" style="cursor:pointer;padding:4px 10px;font-size:0.85rem;">Tất cả (${rows.length})</button><button class="pill ${currentBoardClass==='12H'?'active':''}" id="filterBoard12H" style="cursor:pointer;padding:4px 10px;font-size:0.85rem;">Chỉ lớp 12H</button></div>`+(rows.length?`<div class="table-scroll"><table><thead><tr><th>Hạng</th><th>Họ tên</th><th>Lớp</th><th>Vai trò</th><th>Đã làm</th><th>Đúng</th><th>Điểm</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>#${r.rank}</strong></td><td>${esc(r.name)}${r.isOfficial?' <span title="12H Official" style="color:#00e5ff;font-size:0.75rem;">✨ 12H</span>':''}</td><td><span class="pill" style="font-size:0.8rem;padding:2px 8px;">${esc(r.className||'12H')}</span></td><td><span class="pill" style="font-size:0.8rem;">${r.role==='teacher'?'Giáo viên':'Học sinh'}</span></td><td>${r.answered}</td><td>${r.correct}</td><td><strong>${r.points}</strong></td></tr>`).join('')}</tbody></table></div>`:'<p>Chưa có học sinh nào trong danh sách này.</p>');
}
function attachBoardFilters(){
  const bAll=$('#filterBoardAll'),b12=$('#filterBoard12H');
  if(bAll)bAll.onclick=()=>{currentBoardClass='';loadBoard();};
  if(b12)b12.onclick=()=>{currentBoardClass='12H';loadBoard();};
}
async function loadBoard(){
  if(!me)return needLogin($('#leaderboard'));
  if(boardCache&&!currentBoardClass){
    $('#leaderboard').innerHTML=renderBoardHtml(boardCache.rows);
    attachBoardFilters();
  }
  const url='leaderboard'+(currentBoardClass?'?class='+encodeURIComponent(currentBoardClass):'');
  const data=await api(url);
  if(!currentBoardClass)boardCache=data;
  $('#leaderboard').innerHTML=renderBoardHtml(data.rows);
  attachBoardFilters();
}
function renderManageList(){$('#manageList').innerHTML=questions.map(q=>`<div class="paper editor-row"><p><strong>${esc(typeNames[q.type])}</strong> · ${q.active?'Đang hiện':'Đã ẩn'}<br>${esc(q.prompt)}</p><button data-edit="${q.id}">Sửa</button><button data-hide="${q.id}">${q.active?'Ẩn':'Hiện'}</button></div>`).join('');$$('[data-edit]').forEach(b=>b.onclick=()=>{editing=questions.find(q=>q.id===b.dataset.edit);const f=$('#questionEditor');for(const key of ['id','type','topic','prompt','explanation','points'])f.elements[key].value=editing[key];f.elements.options.value=editing.options.join('\n');f.elements.answer.value=editing.type==='mcq'?editing.answer+1:editing.type==='tf'?editing.answer.map(v=>v?'Đ':'S').join(','):editing.answer;editorType();f.scrollIntoView({behavior:'smooth'});});$$('[data-hide]').forEach(b=>b.onclick=action(async()=>{const q=questions.find(q=>q.id===b.dataset.hide);await api('questions/'+q.id,'PATCH',{active:!q.active});await loadQuestions();}));}
function editorType(){const type=$('#questionEditor').elements.type.value;$('#optionsLabel').hidden=type==='short';$('#questionEditor').elements.options.required=type!=='short';}
$('#questionEditor').elements.type.onchange=editorType;$('#newQuestion').onclick=()=>{editing=null;$('#questionEditor').reset();editorType();};$('#questionEditor').onsubmit=async e=>{e.preventDefault();const f=e.currentTarget,type=f.elements.type.value,raw=f.elements.answer.value;let answer=raw;if(type==='mcq')answer=Number(raw)-1;if(type==='tf'){const parts=raw.split(',').map(x=>x.trim().toLocaleLowerCase('vi'));if(parts.length!==4||parts.some(x=>!['đ','s','đúng','sai'].includes(x)))return toast('Nhập đúng bốn đáp án Đ/S, cách nhau bởi dấu phẩy.');answer=parts.map(x=>x==='đ'||x==='đúng');}const b={type,topic:f.elements.topic.value,prompt:f.elements.prompt.value,options:type==='short'?[]:f.elements.options.value.split('\n').map(s=>s.trim()).filter(Boolean),answer,explanation:f.elements.explanation.value,points:Number(f.elements.points.value)},btn=f.querySelector('button');btn.disabled=true;try{await api('questions'+(editing?'/'+editing.id:''),editing?'PUT':'POST',b);editing=null;f.reset();editorType();await loadQuestions();toast('Đã lưu câu hỏi và đáp án.');}catch(err){toast(err.message);}finally{btn.disabled=false;}};
let timerHandle,running=false,seconds=1500,cardIndex=0,cardFlipped=false;
function showTime(){$('#timerValue').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');}
let deadline=0;function tick(){seconds=Math.max(0,Math.ceil((deadline-Date.now())/1000));showTime();if(!seconds){running=false;toast('Đã hoàn thành phiên tập trung. Nghỉ một chút nhé!');}else if(running)timerHandle=setTimeout(tick,500);}
$('#timerStart').onclick=()=>{if(!me?.capabilities.personalStudy)return;running=!running;if(running){if(!seconds)seconds=1500;deadline=Date.now()+seconds*1000;tick();}else clearTimeout(timerHandle);};$('#timerReset').onclick=()=>{running=false;clearTimeout(timerHandle);seconds=1500;showTime();};
function showCard(){const c=COURSE[cardIndex];$('#flashcard').textContent=cardFlipped?c.remember:c.title+' · Nhấn để xem điều cần nhớ';}showCard();$('#flashcard').onclick=()=>{cardFlipped=!cardFlipped;showCard();};$('#nextCard').onclick=()=>{cardIndex=(cardIndex+1)%COURSE.length;cardFlipped=false;showCard();};
async function loadPersonal(){const data=await api('personal');$('#personalNotes').value=data.notes;$('#mistakes').innerHTML=data.mistakes.length?data.mistakes.map(m=>`<details><summary>${esc(m.prompt)}</summary><p>${esc(m.explanation)}</p><p class="muted">Ôn lại: ${esc(TOPICS[m.topic])}</p></details>`).join(''):'<p class="muted">Chưa có câu sai. Hãy làm bài để nhận danh sách cần ôn lại.</p>';}
$('#saveNotes').onclick=action(async()=>{await api('personal','PUT',{notes:$('#personalNotes').value});toast('Đã lưu ghi chú riêng.');});$('#exportNotes').onclick=()=>{const text='# Ghi chú học Protein\n\n'+$('#personalNotes').value+'\n\n'+COURSE.map(c=>'## '+c.title+'\n'+c.remember).join('\n\n');download(new Blob([text],{type:'text/plain;charset=utf-8'}),'ghi-chu-protein.txt');};
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}

let examActive=false,examTimer=null,examDeadline=0,examQuestions=[];
async function prepareExam(){clearInterval(examTimer);$('#examClock').textContent='15:00';if(!me){needLogin($('#examArea'));return;}$('#examArea').innerHTML='<p>10 câu gồm nhiều lựa chọn, đúng/sai và trả lời ngắn. Thời gian 15 phút; nộp xong sẽ hiện đáp án và giải thích.</p><p class="muted">Đề dùng các câu bạn chưa làm; kết quả được lưu vào tài khoản. Đồng hồ tự kiểm tra chạy trên thiết bị này.</p><button id="examStart" class="primary">Bắt đầu kiểm tra</button>';$('#examStart').onclick=action(startExam);}
async function startExam(){if(!me)return;await loadQuestions();const available=questions.filter(q=>q.active&&!q.attempt).sort(()=>Math.random()-.5);if(!available.length)return toast('Bạn đã làm hết ngân hàng câu hỏi. Có thể xem lại lời giải trong Bài tập lớp.');examQuestions=[];for(const type of ['mcq','tf','short']){const q=available.find(q=>q.type===type);if(q)examQuestions.push(q);}for(const q of available)if(examQuestions.length<10&&!examQuestions.includes(q))examQuestions.push(q);examActive=true;$('#examArea').innerHTML='<form id="examForm">'+examQuestions.map((q,i)=>'<article class="question-card"><div class="q-meta">'+typeNames[q.type]+' · '+q.points+' điểm</div><h3>'+String(i+1)+'. '+esc(q.prompt)+'</h3>'+(q.type==='mcq'?'<div class="q-options">'+q.options.map((opt,j)=>'<label><input type="radio" name="exam'+i+'" value="'+j+'" required>'+String(j+1)+'. '+esc(opt)+'</label>').join('')+'</div>':q.type==='tf'?q.options.map((opt,j)=>'<div class="tf-row"><span>'+String.fromCharCode(97+j)+'. '+esc(opt)+'</span><div>'+[true,false].map(v=>'<label><input type="radio" name="exam'+i+'tf'+j+'" value="'+v+'" required>'+(v?'Đúng':'Sai')+'</label>').join('')+'</div></div>').join(''):'<label>Trả lời ngắn<input name="exam'+i+'" maxlength="100" required autocomplete="off"></label>')+'</article>').join('')+'<button class="primary">Nộp bài kiểm tra</button><p class="muted">Có '+examQuestions.length+' câu trong lượt này. Khi hết giờ, các câu đã trả lời sẽ được nộp tự động.</p></form>';$('#examForm').onsubmit=e=>{e.preventDefault();submitExam().catch(err=>toast(err.message));};examDeadline=Date.now()+15*60*1000;examTimer=setInterval(()=>{const secs=Math.max(0,Math.ceil((examDeadline-Date.now())/1000));$('#examClock').textContent=String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');if(!secs)submitExam().catch(err=>toast(err.message));},500);}
async function submitExam(){if(!examActive)return;examActive=false;clearInterval(examTimer);const form=$('#examForm');form.querySelector('button').disabled=true;let results=[];try{for(const [i,q]of examQuestions.entries()){let selected;if(q.type==='tf'){const values=[0,1,2,3].map(j=>form.elements['exam'+i+'tf'+j].value);if(values.every(Boolean))selected=values.map(x=>x==='true');}else{const v=form.elements['exam'+i].value;if(v.trim())selected=q.type==='mcq'?Number(v):v;}if(selected===undefined)results.push({q,missing:true});else results.push({q,result:await api('attempts','POST',{questionId:q.id,selected})});}const correct=results.filter(x=>x.result?.correct).length,points=results.reduce((n,x)=>n+(x.result?.points||0),0),max=results.reduce((n,x)=>n+x.q.points,0);try{await api('exams','POST',{total:results.length,correct,points});await loadExamBoard();}catch(e){}$('#examArea').innerHTML='<h3>Kết quả: '+correct+' / '+results.length+' câu đúng · '+points+' / '+max+' điểm</h3>'+results.map((x,i)=>'<div class="feedback '+(x.result?.correct?'':'wrong')+'"><strong>'+String(i+1)+'. '+esc(x.q.prompt)+'</strong>'+(x.missing?'<p>Chưa trả lời — chưa được ghi điểm.</p>':'<p>'+(x.result.correct?'✓ Đúng':'Cần ôn lại')+' · Đáp án: '+esc(answerText(x.q,x.result.answer))+'</p><p>'+esc(x.result.explanation)+'</p>')+'</div>').join('')+'<button id="examAgain" class="primary">Tạo lượt kiểm tra mới</button>';$('#examAgain').onclick=action(prepareExam);await loadQuestions();}catch(err){examActive=true;form.querySelector('button').disabled=false;throw err;}}


function showClassRequest(){if(!me)return showAuth('login');const d=$('#classRequestDialog');if(!d)return;const f=$('#classRequestForm');if(f){f.reset();if(f.elements.targetClass)f.elements.targetClass.value=me.className||'12H';}if(!d.open)d.showModal();}
$('#closeClassRequest')?.addEventListener('click',()=>$('#classRequestDialog').close());
$('#classRequestForm')?.addEventListener('submit',action(async e=>{e.preventDefault();const target=$('#classRequestForm').elements.targetClass.value.trim();if(!target)return;await api('class/request','POST',{targetClass:target});$('#classRequestDialog').close();toast('Đã gửi yêu cầu vào lớp '+target+' tới Thầy Thắng và Khoa!');}));

let examBoardCountdown=5,examBoardTimer=null;
async function loadExamBoard(){const container=$('#examLeaderboard');if(!container)return;try{const{rows}=await api('exam-leaderboard');if(!rows||!rows.length){container.innerHTML='<p class="muted" style="margin:8px 0;">Chưa có lượt nộp bài kiểm tra nào.</p>';return;}container.innerHTML=`<div class="table-scroll"><table><thead><tr><th>Hạng</th><th>Họ tên</th><th>Lớp</th><th>Số câu đúng</th><th>Điểm</th><th>Thời gian</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>#${r.rank}</strong></td><td>${esc(r.name)}${r.isOfficial?' <span title="12H Official" style="color:#00e5ff;font-size:0.75rem;">✨ 12H</span>':''}</td><td><span class="pill" style="font-size:0.8rem;padding:2px 8px;">${esc(r.className||'12H')}</span></td><td><strong style="color:#00e5ff;">${r.correct} / ${r.total}</strong> câu</td><td><strong>${r.points}</strong> đ</td><td class="muted" style="font-size:0.8rem;">${new Date(r.created).toLocaleTimeString('vi')}</td></tr>`).join('')}</tbody></table></div>`;}catch(e){container.innerHTML='<p class="muted">Đăng nhập để xem bảng xếp hạng kiểm tra.</p>';}}
function startExamBoardTicker(){clearInterval(examBoardTimer);examBoardCountdown=5;examBoardTimer=setInterval(async()=>{examBoardCountdown--;const t=$('#examRefreshTimer');if(t)t.textContent='🔄 Tự làm mới: '+examBoardCountdown+'s';if(examBoardCountdown<=0){examBoardCountdown=5;if(current==='test')await loadExamBoard();}},1000);}
$('#examRefreshBtn')?.addEventListener('click',action(async()=>{examBoardCountdown=5;await loadExamBoard();toast('Đã cập nhật bảng xếp hạng kiểm tra!');}));
startExamBoardTicker();

let adminMembersData=null;
async function loadClasses(){if(!me?.capabilities.manageQuestions)return;const data=await api('admin/members');adminMembersData=data;renderClassStats(data.classCounts);renderClassRequests(data.requests);renderClassMembersTable(data.members);}
function renderClassStats(counts){const c=$('#classStatsGrid');if(!c)return;const list=Object.entries(counts||{});c.innerHTML=list.map(([cls,num])=>`<div class="paper" style="padding:12px;text-align:center;border:1px solid rgba(0,229,255,0.2);"><span class="eyebrow" style="font-size:0.75rem;">LỚP HỌC</span><h3 style="margin:4px 0;color:#00e5ff;">${esc(cls)}</h3><strong style="font-size:1.1rem;">${num}</strong> <span class="muted" style="font-size:0.85rem;">thành viên</span></div>`).join('');const sel=$('#adminClassFilter');if(sel){const cur=sel.value;sel.innerHTML='<option value="">Tất cả các lớp</option>'+Object.keys(counts).map(k=>`<option value="${esc(k)}">${esc(k)} (${counts[k]})</option>`).join('');sel.value=cur;}}
function renderClassRequests(requests){const area=$('#classRequestsArea'),list=$('#classRequestsList'),badge=$('#requestCountBadge');if(!area||!list)return;if(!requests||!requests.length){area.hidden=true;return;}area.hidden=false;if(badge)badge.textContent=requests.length;list.innerHTML=requests.map(r=>`<div class="paper editor-row" style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;"><div><strong>${esc(r.name)}</strong> · Hiện tại: <span class="pill" style="font-size:0.8rem;">${esc(r.currentClass)}</span> ➔ Xin vào: <strong style="color:#00e5ff;">${esc(r.targetClass)}</strong><small class="muted" style="display:block;margin-top:2px;">Gửi lúc: ${new Date(r.created).toLocaleTimeString('vi')} ${new Date(r.created).toLocaleDateString('vi')}</small></div><div style="display:flex;gap:6px;"><button class="primary" style="padding:5px 12px;font-size:0.85rem;" data-approve-user="${esc(r.userId)}" data-approve-class="${esc(r.targetClass)}">✓ Duyệt vào lớp</button><button style="padding:5px 12px;font-size:0.85rem;" data-reject-user="${esc(r.userId)}">✕ Từ chối</button></div></div>`).join('');$$('[data-approve-user]').forEach(b=>b.onclick=action(async()=>{await api('admin/members/'+b.dataset.approveUser,'PATCH',{className:b.dataset.approveClass});toast('Đã duyệt vào lớp '+b.dataset.approveClass+' thành công!');await loadClasses();}));$$('[data-reject-user]').forEach(b=>b.onclick=action(async()=>{await api('admin/requests/'+b.dataset.rejectUser,'DELETE');toast('Đã từ chối yêu cầu.');await loadClasses();}));}
function renderClassMembersTable(members){const table=$('#classMembersTable');if(!table||!members)return;const filter=$('#adminClassFilter')?.value||'',search=($('#adminMemberSearch')?.value||'').trim().toLowerCase();const filtered=members.filter(m=>{if(filter){if(m.role==='teacher'){const tClasses=(m.className||'').split(',').map(s=>s.trim().toUpperCase());const isAll=tClasses.includes('TẤT CẢ')||tClasses.includes('ALL')||!m.className;if(!isAll&&!tClasses.includes(filter.toUpperCase())&&m.className.toUpperCase()!==filter.toUpperCase())return false;}else{if(m.className!==filter)return false;}}if(search&&!m.name.toLowerCase().includes(search))return false;return true;});table.innerHTML=filtered.length?`<div class="table-scroll"><table><thead><tr><th>Hạng</th><th>Họ tên</th><th>Lớp</th><th>Vai trò</th><th>Đã làm</th><th>Đúng</th><th>Điểm</th><th>Thao tác</th></tr></thead><tbody>${filtered.map((m,i)=>`<tr><td>#${i+1}</td><td><strong>${esc(m.name)}</strong>${m.isOfficial?' <span title="12H Official" style="color:#00e5ff;font-size:0.75rem;">✨ 12H</span>':''}</td><td><span class="pill" style="font-size:0.8rem;padding:2px 8px;">${esc(m.className)}</span></td><td>${m.role==='teacher'?'Giáo viên':'Học sinh'}</td><td>${m.answered}</td><td>${m.correct}</td><td><strong>${m.points}</strong></td><td style="white-space:nowrap;display:flex;gap:4px;"><button class="pill" style="cursor:pointer;font-size:0.8rem;" data-change-class="${esc(m.id)}" data-user-name="${esc(m.name)}" data-user-class="${esc(m.className)}">Đổi lớp</button><button class="pill" style="cursor:pointer;font-size:0.8rem;background:rgba(255,152,0,0.15);color:#ff9800;border:1px solid rgba(255,152,0,0.3);" data-reset-pw="${esc(m.id)}" data-user-name="${esc(m.name)}">Reset MK</button>${(!m.isOwner&&!m.isTeacher&&m.id!==me?.id)?`<button class="pill" style="cursor:pointer;font-size:0.8rem;background:rgba(244,67,54,0.15);color:#f44336;border:1px solid rgba(244,67,54,0.3);" data-del-acc="${esc(m.id)}" data-user-name="${esc(m.name)}">Xóa</button>`:''}</td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">Không có học sinh nào khớp điều kiện tìm kiếm.</p>';$$('[data-change-class]').forEach(b=>b.onclick=action(async()=>{const newClass=prompt('Chuyển '+b.dataset.userName+' sang lớp (nhập tên lớp, hoặc danh sách lớp nếu là Giáo viên):',b.dataset.userClass);if(newClass&&newClass.trim()&&newClass.trim()!==b.dataset.userClass){await api('admin/members/'+b.dataset.changeClass,'PATCH',{className:newClass.trim()});toast('Đã chuyển '+b.dataset.userName+' sang lớp '+newClass.trim()+'!');await loadClasses();}}));$$('[data-reset-pw]').forEach(b=>b.onclick=action(async()=>{const newPass=prompt('Nhập mật khẩu mới cho '+b.dataset.userName+' khi quên mã PIN (tối thiểu 8 ký tự):','12345678');if(newPass&&newPass.trim()){if(newPass.trim().length<8)return toast('Mật khẩu cần tối thiểu 8 ký tự.');await api('admin/members/'+b.dataset.resetPw+'/reset-password','POST',{newPassword:newPass.trim()});toast('Đã đặt lại mật khẩu cho '+b.dataset.userName+' thành: '+newPass.trim());}}));$$('[data-del-acc]').forEach(b=>b.onclick=action(async()=>{if(confirm('Bạn có chắc muốn XÓA VĨNH VIỄN tài khoản của '+b.dataset.userName+'? Thao tác này không thể hoàn tác.')){await api('admin/members/'+b.dataset.delAcc,'DELETE');toast('Đã xóa tài khoản '+b.dataset.userName+' thành công!');await loadClasses();}}));}
$('#adminClassFilter')?.addEventListener('change',()=>renderClassMembersTable(adminMembersData?.members));
$('#adminMemberSearch')?.addEventListener('input',()=>renderClassMembersTable(adminMembersData?.members));
$('#refreshClassesBtn')?.addEventListener('click',action(async()=>{await loadClasses();toast('Đã làm mới dữ liệu lớp học!');}));

window.studyAccount={show:view=>{if(window.app&&window.app.switchTab){window.app.switchTab('studyquiz');}else{document.querySelectorAll('.tab-content').forEach(el=>el.classList.toggle('active',el.id==='tab-studyquiz'));document.querySelectorAll('.nav-tab-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab==='studyquiz'));}return go(view);}};
api('auth/me').then(async data=>{
  me=data.user;
  account();
  if(me){
    try{$('#authDialog')?.close();}catch{}
    const view=location.hash.slice(1);
    if(['lessons','practice','test','board','classes','manage','personal'].includes(view)){
      window.app?.switchTab('studyquiz');
      await go(view);
    }
  } else {
    if(!navigator.webdriver){
      showAuth('login');
    }
  }
}).catch(()=>{
  if(!navigator.webdriver){
    showAuth('login');
  }
});
renderLesson();

/* =========================================================================
   ADAPTIVE DEVICE PERFORMANCE ENGINE & MOBILE OPTIMIZATIONS
   Tự động nhận diện cấu hình thiết bị, chống lag và tối ưu cuộn vuốt mobile
   ========================================================================= */
function initAdaptiveDeviceEngine(){
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 900;
  const concurrency = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  let isLowEnd = isMobile || concurrency <= 4 || memory <= 3;
  try {
    const c = document.createElement('canvas'), gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        const ren = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).toLowerCase();
        if (/mali|adreno (3|4|5|61)|powervr|intel hd/i.test(ren)) isLowEnd = true;
      }
    }
  } catch(e) {}

  let perfMode = localStorage.getItem('px_perf_mode') || (isLowEnd ? 'eco' : 'balanced');
  const modeLabels = { eco: '⚡ Siêu Mượt', balanced: '⚖️ Chuẩn', high: '🚀 Đồ Họa Cao' };

  function applyPerfMode(mode, notify = false) {
    perfMode = mode;
    localStorage.setItem('px_perf_mode', mode);
    document.body.classList.toggle('perf-mode-eco', mode === 'eco');
    document.body.classList.toggle('perf-mode-high', mode === 'high');

    const btn = document.getElementById('perfModeBtn');
    if (btn) {
      btn.className = 'perf-badge-btn ' + mode;
      btn.innerHTML = `<span>${mode === 'eco' ? '⚡' : mode === 'balanced' ? '⚖️' : '🚀'}</span> <span>${modeLabels[mode]}</span>`;
    }

    const viewers = [window.heroViewer, window.viewer3D, window.structureMgr];
    viewers.forEach(v => {
      if (!v) return;
      if (mode === 'eco') {
        if (typeof v.pause === 'function') v.pause();
        if (v.viewer && typeof v.viewer.spin === 'function') {
          try { v.viewer.spin(false); } catch(e) {}
        }
      } else if (mode === 'balanced') {
        if (v.isSpinning && typeof v.resume === 'function') v.resume();
      } else {
        if (v.isSpinning && typeof v.resume === 'function') v.resume();
      }
    });

    if (notify) {
      const msgs = {
        eco: '⚡ Đã bật Chế độ Siêu Mượt: Tắt hiệu ứng nặng & tạm dừng xoay nền để chống lag cho máy.',
        balanced: '⚖️ Đã bật Chế độ Cân Bằng: Hoạt ảnh mượt mà, mức tiêu thụ tài nguyên vừa phải.',
        high: '🚀 Đã bật Chế độ Đồ Họa Cao: Đầy đủ hiệu ứng ánh sáng & mô hình 3D nguyên tử xoay thực tế.'
      };
      toast(msgs[mode]);
    }
  }

  const perfStack = document.getElementById('headerUserPerfStack');
  const headerControls = document.querySelector('.header-controls');
  if (!document.getElementById('perfModeBtn')) {
    const btn = document.createElement('button');
    btn.id = 'perfModeBtn';
    btn.className = 'perf-badge-btn ' + perfMode;
    btn.title = 'Chạm để đổi chế độ hiệu năng (Siêu Mượt / Chuẩn / Cao)';
    btn.innerHTML = `<span>${perfMode === 'eco' ? '⚡' : perfMode === 'balanced' ? '⚖️' : '🚀'}</span> <span>${modeLabels[perfMode]}</span>`;
    btn.onclick = () => {
      const next = perfMode === 'eco' ? 'balanced' : perfMode === 'balanced' ? 'high' : 'eco';
      applyPerfMode(next, true);
    };
    if (perfStack) {
      perfStack.prepend(btn);
    } else if (headerControls) {
      headerControls.prepend(btn);
    }
  }

  const pdbBtn = document.getElementById('btnShowSourcesModal');
  if (pdbBtn && isMobile) {
    pdbBtn.innerHTML = '🏛️ PDB';
    pdbBtn.title = 'Nguồn chuẩn wwPDB / RCSB';
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isVis = entry.isIntersecting && entry.intersectionRatio > 0.15;
        if (entry.target.id === 'hero3DContainer' && window.heroViewer) {
          if (isVis && perfMode !== 'eco') window.heroViewer.resume();
          else window.heroViewer.pause();
        }
        if (entry.target.id === 'molViewerContainer' && window.viewer3D) {
          if (isVis && perfMode !== 'eco') window.viewer3D.resume();
          else window.viewer3D.pause();
        }
      });
    }, { threshold: [0, 0.2] });

    ['hero3DContainer', 'molViewerContainer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  document.querySelectorAll('.nav-tab-btn').forEach(b => {
    b.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        const navTabs = b.closest('.nav-tabs');
        if (navTabs && navTabs.scrollWidth > navTabs.clientWidth) {
          const left = b.offsetLeft - (navTabs.clientWidth / 2) + (b.clientWidth / 2);
          navTabs.scrollTo({ left, behavior: 'smooth' });
        }
      }
      try { window.scrollTo({ left: 0, behavior: 'instant' }); } catch {}
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollX !== 0) {
      try { window.scrollTo({ left: 0, top: window.scrollY, behavior: 'instant' }); } catch {}
    }
  });

  applyPerfMode(perfMode, false);
}

setTimeout(initAdaptiveDeviceEngine, 200);
});

