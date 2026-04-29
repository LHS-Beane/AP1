const $ = (id) => document.getElementById(id);
const QUESTIONS = window.AP_QUESTIONS || [];
let currentSet = [];
let submitted = false;

const unitSel = $('unitSelect'), topicSel = $('topicSelect'), diffSel = $('difficultySelect'), countInput = $('countInput');
const buildBtn = $('buildBtn'), resetBtn = $('resetBtn'), examArea = $('examArea'), stats = $('stats');

function uniq(arr){ return [...new Set(arr)].filter(Boolean).sort(); }
function shuffle(arr){ return [...arr].sort(() => Math.random()-0.5); }
function answerSet(ans){ return new Set(String(ans||'').split(',').map(s=>s.trim()).filter(Boolean)); }
function sameAnswer(a,b){ const A=answerSet(a), B=answerSet(b); return A.size===B.size && [...A].every(x=>B.has(x)); }

function populate(){
  unitSel.innerHTML = '<option value="all">All AP Physics 1 Units</option>' + uniq(QUESTIONS.map(q=>q.topic.split(':')[0]+': '+q.topic.split(':').slice(1).join(':').trim())).map(u=>`<option>${u}</option>`).join('');
  diffSel.innerHTML = '<option value="all">All Difficulties</option>' + uniq(QUESTIONS.map(q=>q.difficulty)).map(d=>`<option>${d}</option>`).join('');
  updateTopics();
  stats.textContent = `${QUESTIONS.length} multiple-choice questions loaded • ${QUESTIONS.filter(q=>q.answer).length} with answer keys`;
}
function updateTopics(){
  const unit = unitSel.value;
  let pool = QUESTIONS;
  if(unit !== 'all') pool = pool.filter(q=>q.topic.startsWith(unit));
  topicSel.innerHTML = '<option value="all">All Topics</option>' + uniq(pool.map(q=>q.topic)).map(t=>`<option>${t}</option>`).join('');
}
unitSel.addEventListener('change', updateTopics);
function getPool(){
  let pool = QUESTIONS.filter(q=>q.choices && q.choices.length >= 2);
  if(unitSel.value !== 'all') pool = pool.filter(q=>q.topic.startsWith(unitSel.value));
  if(topicSel.value !== 'all') pool = pool.filter(q=>q.topic === topicSel.value);
  if(diffSel.value !== 'all') pool = pool.filter(q=>q.difficulty === diffSel.value);
  return pool;
}
function render(){
  submitted = false;
  const pool = getPool();
  const n = Math.max(1, Math.min(parseInt(countInput.value||'20',10), pool.length));
  currentSet = shuffle(pool).slice(0,n);
  examArea.innerHTML = currentSet.map((q,i)=>{
    const multi = String(q.answer||'').includes(',');
    return `<section class="question-card" data-id="${q.id}">
      <div class="q-meta"><span>Question ${i+1}</span><span>${q.topic}</span><span>${q.difficulty}</span></div>
      <p class="q-text">${q.question}</p>
      ${(q.images||[]).map(src=>`<img class="q-img" src="${src}" alt="question diagram">`).join('')}
      <div class="choices">${q.choices.map(c=>`<label class="choice"><input type="${multi?'checkbox':'radio'}" name="q${i}" value="${c.label}"><b>${c.label}</b>. ${c.text}</label>`).join('')}</div>
      <div class="answer-box" hidden></div>
    </section>`;
  }).join('') + (currentSet.length?'<div class="actions"><button id="submitBtn">Submit / Check Answers</button><button id="keyBtn">Show Answer Key</button></div>':'<p>No questions match those filters.</p>');
  $('submitBtn')?.addEventListener('click', score);
  $('keyBtn')?.addEventListener('click', showKey);
  stats.textContent = `${pool.length} questions match filters • showing ${currentSet.length}`;
}
function score(){
  let correct=0, keyed=0;
  currentSet.forEach((q,i)=>{
    const card = document.querySelector(`[data-id="${q.id}"]`);
    const chosen = [...card.querySelectorAll('input:checked')].map(x=>x.value).join(', ');
    const box = card.querySelector('.answer-box');
    if(q.answer){ keyed++; if(sameAnswer(chosen,q.answer)) correct++; }
    card.classList.toggle('correct', q.answer && sameAnswer(chosen,q.answer));
    card.classList.toggle('incorrect', q.answer && !sameAnswer(chosen,q.answer));
    box.hidden=false;
    box.innerHTML = q.answer ? `<b>Correct answer:</b> ${q.answer}` : `<b>No key available for this item.</b>`;
  });
  stats.textContent = keyed ? `Score: ${correct}/${keyed} keyed questions (${Math.round(100*correct/keyed)}%)` : 'No keyed questions in this set.';
}
function showKey(){
  currentSet.forEach((q,i)=>{
    const card = document.querySelector(`[data-id="${q.id}"]`);
    const box = card.querySelector('.answer-box');
    box.hidden=false;
    box.innerHTML = q.answer ? `<b>Correct answer:</b> ${q.answer}` : `<b>No key available for this item.</b>`;
  });
}
buildBtn.addEventListener('click', render);
resetBtn.addEventListener('click', ()=>{ unitSel.value='all'; diffSel.value='all'; countInput.value=20; updateTopics(); examArea.innerHTML=''; stats.textContent=`${QUESTIONS.length} multiple-choice questions loaded • ${QUESTIONS.filter(q=>q.answer).length} with answer keys`; });
populate();
