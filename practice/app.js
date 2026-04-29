const $ = (id) => document.getElementById(id);
const QUESTIONS = (window.AP_QUESTIONS || []).filter(q => q.answer && q.choices && q.choices.length >= 2);
let currentSet = [];
let currentIndex = 0;
let submitted = false;
let userAnswers = {};

const unitSel = $('unitSelect'), topicSel = $('topicSelect'), diffSel = $('difficultySelect'), countInput = $('countInput');
const buildBtn = $('buildBtn'), resetBtn = $('resetBtn'), examArea = $('examArea'), stats = $('stats');

function uniq(arr){ return [...new Set(arr)].filter(Boolean).sort(); }
function shuffle(arr){ return [...arr].sort(() => Math.random()-0.5); }
function answerSet(ans){ return new Set(String(ans||'').split(',').map(s=>s.trim()).filter(Boolean)); }
function sameAnswer(a,b){ const A=answerSet(a), B=answerSet(b); return A.size===B.size && [...A].every(x=>B.has(x)); }
function escapeHtml(str){
  return String(str ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function fixSymbols(str){
  let s = escapeHtml(str);
  // Scientific notation exported as "10 -6" or "10 3".
  s = s.replace(/10\s*([+-]?\d+)/g, '10<sup>$1</sup>');
  // Common unit exponents exported as separated digits.
  s = s.replace(/\b(m|cm|mm|km|s|kg|N|J|W|Pa|L)\s*([23])\b/g, '$1<sup>$2</sup>');
  s = s.replace(/\b(m\/s|m\/s\^?|kg\/m|N\s*[∙·]\s*m)\s*([23])\b/g, '$1<sup>$2</sup>');
  // Common physics variable subscripts. Keep conservative to avoid changing normal words.
  s = s.replace(/\b([vVxXrRmMpPTF])\s*([0-9])\b/g, '$1<sub>$2</sub>');
  // Tidy symbols and apostrophes.
  s = s.replace(/\s+∙\s+/g, ' &middot; ')
       .replace(/\s+·\s+/g, ' &middot; ')
       .replace(/-axis/g, '-axis')
       .replace(/\bpi\b/gi, 'π');
  return s;
}
function imgSrc(img){ return typeof img === 'string' ? img : (img && img.src ? img.src : ''); }
function imgAlt(img){ return typeof img === 'object' && img.alt ? img.alt : 'question diagram'; }
function imgAttrs(img){
  if(typeof img !== 'object') return '';
  const w = img.width ? ` width="${escapeHtml(img.width)}"` : '';
  const h = img.height ? ` height="${escapeHtml(img.height)}"` : '';
  return w + h;
}
function getChosenLabels(qIndex){
  return [...document.querySelectorAll(`input[name="q${qIndex}"]:checked`)].map(x=>x.value);
}
function saveCurrentAnswer(){
  if(!currentSet.length) return;
  userAnswers[currentSet[currentIndex].id] = getChosenLabels(currentIndex);
}
function restoreAnswer(q, qIndex){
  const saved = userAnswers[q.id] || [];
  setTimeout(()=>{
    saved.forEach(label => {
      const input = document.querySelector(`input[name="q${qIndex}"][value="${CSS.escape(label)}"]`);
      if(input) input.checked = true;
    });
  },0);
}
function selectedAnswerString(q){ return (userAnswers[q.id] || []).join(', '); }

function populate(){
  unitSel.innerHTML = '<option value="all">All AP Physics 1 Units</option>' + uniq(QUESTIONS.map(q=>q.topic.split(':')[0]+': '+q.topic.split(':').slice(1).join(':').trim())).map(u=>`<option>${u}</option>`).join('');
  diffSel.innerHTML = '<option value="all">All Difficulties</option>' + uniq(QUESTIONS.map(q=>q.difficulty)).map(d=>`<option>${d}</option>`).join('');
  updateTopics();
  stats.textContent = `${QUESTIONS.length} keyed multiple-choice questions loaded`;
}
function updateTopics(){
  const unit = unitSel.value;
  let pool = QUESTIONS;
  if(unit !== 'all') pool = pool.filter(q=>q.topic.startsWith(unit));
  topicSel.innerHTML = '<option value="all">All Topics</option>' + uniq(pool.map(q=>q.topic)).map(t=>`<option>${t}</option>`).join('');
}
unitSel.addEventListener('change', updateTopics);
function getPool(){
  let pool = QUESTIONS.filter(q=>q.answer && q.choices && q.choices.length >= 2);
  if(unitSel.value !== 'all') pool = pool.filter(q=>q.topic.startsWith(unitSel.value));
  if(topicSel.value !== 'all') pool = pool.filter(q=>q.topic === topicSel.value);
  if(diffSel.value !== 'all') pool = pool.filter(q=>q.difficulty === diffSel.value);
  return pool;
}
function render(){
  submitted = false;
  userAnswers = {};
  const pool = getPool();
  const n = Math.max(1, Math.min(parseInt(countInput.value||'20',10), pool.length));
  currentSet = shuffle(pool).slice(0,n);
  currentIndex = 0;
  if(!currentSet.length){
    examArea.innerHTML = '<p class="empty">No keyed multiple-choice questions match those filters.</p>';
    stats.textContent = 'No questions match those filters.';
    return;
  }
  renderQuestion();
  stats.textContent = `${pool.length} questions match filters • showing ${currentSet.length}`;
}
function renderQuestion(){
  const q = currentSet[currentIndex];
  const multi = String(q.answer||'').includes(',');
  const answeredCount = currentSet.filter(item => (userAnswers[item.id]||[]).length).length;
  const imgHtml = (q.images||[]).map(img => {
    const src = imgSrc(img);
    if(!src) return '';
    return `<img class="q-img" src="${src}" alt="${escapeHtml(imgAlt(img))}"${imgAttrs(img)} loading="lazy">`;
  }).join('');
  examArea.innerHTML = `<section class="question-card single ${submitted ? (sameAnswer(selectedAnswerString(q), q.answer) ? 'correct' : 'incorrect') : ''}" data-id="${q.id}">
    <div class="q-meta"><span>Question ${currentIndex+1} of ${currentSet.length}</span><span>${fixSymbols(q.topic)}</span><span>${fixSymbols(q.difficulty)}</span></div>
    <div class="progress"><div style="width:${Math.round(100*(currentIndex+1)/currentSet.length)}%"></div></div>
    <p class="q-text">${fixSymbols(q.question)}</p>
    ${imgHtml}
    <div class="choices">${q.choices.map(c=>`<label class="choice"><input type="${multi?'checkbox':'radio'}" name="q${currentIndex}" value="${escapeHtml(c.label)}"><b>${escapeHtml(c.label)}</b>. <span>${fixSymbols(c.text)}</span></label>`).join('')}</div>
    <div class="answer-box" ${submitted ? '' : 'hidden'}>${submitted ? answerFeedback(q) : ''}</div>
  </section>
  <div class="quiz-nav">
    <button id="prevBtn" type="button" ${currentIndex===0?'disabled':''}>← Previous</button>
    <span>${answeredCount}/${currentSet.length} answered</span>
    <button id="nextBtn" type="button" ${currentIndex===currentSet.length-1?'disabled':''}>Next →</button>
    <button id="submitBtn" type="button">Submit / Check Answers</button>
  </div>
  <div id="resultsArea"></div>`;
  restoreAnswer(q, currentIndex);
  $('prevBtn').addEventListener('click', ()=>{ saveCurrentAnswer(); currentIndex--; renderQuestion(); });
  $('nextBtn').addEventListener('click', ()=>{ saveCurrentAnswer(); currentIndex++; renderQuestion(); });
  $('submitBtn').addEventListener('click', score);
  if(submitted) renderResults();
}
function answerFeedback(q){
  const chosen = selectedAnswerString(q) || 'No answer selected';
  const ok = sameAnswer(chosen, q.answer);
  return `<b>${ok ? 'Correct' : 'Incorrect'}.</b> Your answer: ${fixSymbols(chosen)}<br><b>Correct answer:</b> ${fixSymbols(q.answer)}`;
}
function score(){
  saveCurrentAnswer();
  submitted = true;
  renderQuestion();
}
function renderResults(){
  let correct = 0;
  currentSet.forEach(q => { if(sameAnswer(selectedAnswerString(q), q.answer)) correct++; });
  stats.textContent = `Score: ${correct}/${currentSet.length} (${Math.round(100*correct/currentSet.length)}%)`;
  const rows = currentSet.map((q,i)=>{
    const chosen = selectedAnswerString(q) || '—';
    const ok = sameAnswer(chosen, q.answer);
    return `<button class="jump ${ok?'ok':'no'}" data-jump="${i}">${i+1}</button>`;
  }).join('');
  const results = $('resultsArea');
  if(results){
    results.innerHTML = `<div class="score-card"><strong>Score: ${correct}/${currentSet.length}</strong><p>Jump to a question:</p><div class="jump-grid">${rows}</div></div>`;
    results.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', e=>{ saveCurrentAnswer(); currentIndex = Number(e.currentTarget.dataset.jump); renderQuestion(); }));
  }
}
buildBtn.addEventListener('click', render);
resetBtn.addEventListener('click', ()=>{ unitSel.value='all'; diffSel.value='all'; countInput.value=25; updateTopics(); examArea.innerHTML=''; stats.textContent=`${QUESTIONS.length} keyed multiple-choice questions loaded`; });
populate();
