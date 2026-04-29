
const $ = (id) => document.getElementById(id);
const QUESTIONS = (window.AP_QUESTIONS || []).filter(q => q.answer && q.choices && q.choices.length >= 2);
let currentSet = [];
let currentIndex = 0;
let submitted = false;
let userAnswers = {};

const unitSel = $('unitSelect'), topicSel = $('topicSelect'), diffSel = $('difficultySelect'), countInput = $('countInput');
const buildBtn = $('buildBtn'), resetBtn = $('resetBtn'), examArea = $('examArea'), stats = $('stats');

function uniq(arr){ return [...new Set(arr)].filter(Boolean).sort((a,b)=>a.localeCompare(b, undefined, {numeric:true})); }
function shuffle(arr){ const copy=[...arr]; for(let i=copy.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; } return copy; }
function answerSet(ans){ return new Set(String(ans||'').split(',').map(s=>s.trim()).filter(Boolean)); }
function sameAnswer(a,b){ const A=answerSet(a), B=answerSet(b); return A.size===B.size && [...A].every(x=>B.has(x)); }
function escapeHtml(str){
  return String(str ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function formatPhysics(str){
  let s = escapeHtml(str);
  // Normalize common physics notation from TestGen/PDF exports.
  s = s.replace(/([A-Za-z])\s*\^\s*([+-]?\d+)/g, '$1<sup>$2</sup>');
  s = s.replace(/10\s*\^\s*([+-]?\d+)/g, '10<sup>$1</sup>');
  s = s.replace(/10\s*([+-]\d+)/g, '10<sup>$1</sup>');
  s = s.replace(/×\s*10\s*([+-]?\d+)/g, '× 10<sup>$1</sup>');
  s = s.replace(/x\s*10\s*([+-]?\d+)/gi, '× 10<sup>$1</sup>');
  s = s.replace(/\b(m|cm|mm|km|s|kg|N|J|W|Pa|L)\s*([23])\b/g, '$1<sup>$2</sup>');
  s = s.replace(/\b(m\/s|kg\/m|N\s*[∙·]\s*s|N\s*[∙·]\s*m)\s*([23])\b/g, '$1<sup>$2</sup>');
  s = s.replace(/\b(v|x|y|r|R|m|M|p|P|T|F|a|g|k)\s*([0-9])\b/g, '$1<sub>$2</sub>');
  s = s.replace(/\b(v|x|y|a|F)_([a-zA-Z0-9]+)\b/g, '$1<sub>$2</sub>');
  s = s.replace(/\bpi\b/gi, 'π');
  s = s.replace(/\btheta\b/gi, 'θ');
  s = s.replace(/\bmu\b/gi, 'μ');
  s = s.replace(/\s*[∙·]\s*/g, ' &middot; ');
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
function imageHtml(img, cls='q-img'){
  const src = imgSrc(img);
  if(!src) return '';
  return `<img class="${cls}" src="${src}" alt="${escapeHtml(imgAlt(img))}"${imgAttrs(img)} loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-error',textContent:'Diagram failed to load. Re-download the ZIP and keep questions.js with this page.'}))">`;
}
function getChosenLabels(qIndex){
  return [...document.querySelectorAll(`input[name="q${qIndex}"]:checked`)].map(x=>x.value);
}
function saveCurrentAnswer(){
  if(!currentSet.length || submitted) return;
  userAnswers[currentSet[currentIndex].id] = getChosenLabels(currentIndex);
}
function restoreAnswer(q, qIndex){
  const saved = userAnswers[q.id] || [];
  saved.forEach(label => {
    const input = document.querySelector(`input[name="q${qIndex}"][value="${CSS.escape(label)}"]`);
    if(input) input.checked = true;
  });
}
function selectedAnswerString(q){ return (userAnswers[q.id] || []).join(', '); }

function populate(){
  unitSel.innerHTML = '<option value="all">All AP Physics 1 Units</option>' + uniq(QUESTIONS.map(q=>q.topic.split(':')[0]+': '+q.topic.split(':').slice(1).join(':').trim())).map(u=>`<option>${u}</option>`).join('');
  diffSel.innerHTML = '<option value="all">All Difficulties</option>' + uniq(QUESTIONS.map(q=>q.difficulty)).map(d=>`<option>${d}</option>`).join('');
  updateTopics();
  const keyed = QUESTIONS.length;
  const withImgs = QUESTIONS.filter(q => q.images && q.images.length).length;
  stats.textContent = `${keyed} keyed MC questions loaded • ${withImgs} with diagrams`;
}
function updateTopics(){
  const unit = unitSel.value;
  let pool = QUESTIONS;
  if(unit !== 'all') pool = pool.filter(q=>q.topic === unit);
  topicSel.innerHTML = '<option value="all">All Topics</option>' + uniq(pool.map(q=>q.topic)).map(t=>`<option>${t}</option>`).join('');
}
unitSel.addEventListener('change', updateTopics);
function getPool(){
  let pool = QUESTIONS.filter(q=>q.answer && q.choices && q.choices.length >= 2);
  if(unitSel.value !== 'all') pool = pool.filter(q=>q.topic === unitSel.value);
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
  const imgHtml = (q.images||[]).map(img => imageHtml(img)).join('');
  const chosen = selectedAnswerString(q);
  const stateClass = submitted ? (sameAnswer(chosen, q.answer) ? 'correct' : 'incorrect') : '';
  examArea.innerHTML = `<section class="question-card single ${stateClass}" data-id="${q.id}">
    <div class="q-meta"><span>Question ${currentIndex+1} of ${currentSet.length}</span><span>${formatPhysics(q.topic)}</span><span>${formatPhysics(q.difficulty)}</span><span>Source ${escapeHtml(q.source)} #${escapeHtml(q.sourceNumber)}</span></div>
    <div class="progress"><div style="width:${Math.round(100*(currentIndex+1)/currentSet.length)}%"></div></div>
    <p class="q-text">${formatPhysics(q.question)}</p>
    ${imgHtml}
    <div class="choices">${q.choices.map(c=>`<label class="choice ${submitted?'disabled':''}"><input ${submitted?'disabled':''} type="${multi?'checkbox':'radio'}" name="q${currentIndex}" value="${escapeHtml(c.label)}"><b>${escapeHtml(c.label)}</b>. <span>${formatPhysics(c.text || '')}</span></label>`).join('')}</div>
    <div class="answer-box" ${submitted ? '' : 'hidden'}>${submitted ? answerFeedback(q) : ''}</div>
  </section>
  <div class="quiz-nav">
    <button id="prevBtn" type="button" ${currentIndex===0?'disabled':''}>← Previous</button>
    <span>${answeredCount}/${currentSet.length} answered</span>
    <button id="nextBtn" type="button" ${currentIndex===currentSet.length-1?'disabled':''}>Next →</button>
    <button id="submitBtn" type="button">${submitted?'Recheck Score':'Submit / Check Answers'}</button>
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
  return `<b>${ok ? 'Correct' : 'Incorrect'}.</b> Your answer: ${formatPhysics(chosen)}<br><b>Correct answer:</b> ${formatPhysics(q.answer)}`;
}
function score(){
  if(!submitted) saveCurrentAnswer();
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
    return `<button class="jump ${ok?'ok':'no'}" data-jump="${i}" title="Question ${i+1}: ${ok?'correct':'incorrect'}">${i+1}</button>`;
  }).join('');
  const results = $('resultsArea');
  if(results){
    results.innerHTML = `<div class="score-card"><strong>Score: ${correct}/${currentSet.length}</strong><p>Jump to a question:</p><div class="jump-grid">${rows}</div><p class="review-note">Answers are locked after submission. Generate a new set to try again.</p></div>`;
    results.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', e=>{ currentIndex = Number(e.currentTarget.dataset.jump); renderQuestion(); }));
  }
}
buildBtn.addEventListener('click', render);
resetBtn.addEventListener('click', ()=>{ unitSel.value='all'; diffSel.value='all'; countInput.value=25; updateTopics(); examArea.innerHTML=''; stats.textContent=`${QUESTIONS.length} keyed MC questions loaded`; });
populate();
