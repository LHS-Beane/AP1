/* ═══════════════════════════════════════════════════════════
   AP Physics 1 – Practice Exam Builder  ·  app.js
   Features: Timer · Dark Mode · Keyboard Nav · Flagging
             Formula Sheet · Analytics · Session History
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── GLOBALS ────────────────────────────────────────────────
const QUESTIONS = (window.AP_QUESTIONS || []).filter(
  q => q.answer && q.choices && q.choices.length >= 2
);

let currentSet   = [];
let currentIndex = 0;
let submitted    = false;
let userAnswers  = {};   // { questionId: "A" | "A,B" }
let flagged      = new Set();
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

// ── UTILITY ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

function escHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function formatPhysics(str) {
  let s = escHtml(str);
  s = s.replace(/([A-Za-zΔδ])\^([+-]?\d+)/g, '$1<sup>$2</sup>');
  s = s.replace(/10\s*\^\s*([+-]?\d+)/g, '10<sup>$1</sup>');
  s = s.replace(/×\s*10([+-]\d+)\b/g, '× 10<sup>$1</sup>');
  s = s.replace(/\bm\/s\^2\b/g, 'm/s<sup>2</sup>');
  s = s.replace(/\bm\^2\b/g, 'm<sup>2</sup>');
  s = s.replace(/\bm\^3\b/g, 'm<sup>3</sup>');
  s = s.replace(/\bkg·m\/s\b/g, 'kg·m/s');
  s = s.replace(/\b(v|x|y|r|R|m|M|p|T|F|a|g|k|I|L|ω|α)_?([0-9])\b/g, '$1<sub>$2</sub>');
  s = s.replace(/\bmu_([a-z])\b/gi, 'μ<sub>$1</sub>');
  s = s.replace(/\btheta\b/gi, 'θ');
  s = s.replace(/\bpi\b/gi, 'π');
  s = s.replace(/\balpha\b/gi, 'α');
  s = s.replace(/\bomega\b/gi, 'ω');
  s = s.replace(/\btau\b/gi, 'τ');
  s = s.replace(/\bDelta\b/gi, 'Δ');
  return s;
}

function answeredCount() {
  return currentSet.filter(q => userAnswers[q.question] != null).length;
}

function getUniqueId(q) { return q.question; }

// ── DARK MODE ─────────────────────────────────────────────
function initTheme() {
  const stored = localStorage.getItem('ap-physics-theme') || 'light';
  document.documentElement.setAttribute('data-theme', stored);
  updateThemeBtn(stored);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ap-physics-theme', next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const btn = $('themeBtn');
  if (btn) btn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// ── TIMER ─────────────────────────────────────────────────
function startTimer(seconds) {
  clearInterval(timerInterval);
  timerSeconds = seconds;
  timerRunning = true;
  const display = $('timerDisplay');
  if (display) display.style.display = 'flex';
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      autoSubmit();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  const display = $('timerDisplay');
  if (display) display.style.display = 'none';
}

function updateTimerDisplay() {
  const display = $('timerDisplay');
  if (!display) return;
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  display.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  display.classList.toggle('warning', timerSeconds <= 300 && timerSeconds > 0);
}

function autoSubmit() {
  if (!submitted) {
    saveCurrentAnswer();
    submitted = true;
    renderQuestion();
    alert('⏰ Time is up! Your answers have been submitted.');
  }
}

// ── POPULATE FILTERS ───────────────────────────────────────
function populate() {
  const unitSel = $('unitSelect');
  const units = uniq(QUESTIONS.map(q => q.topic));
  unitSel.innerHTML = '<option value="all">All Units</option>' +
    units.map(u => `<option value="${escHtml(u)}">${escHtml(u)}</option>`).join('');

  updateTopics();
  updateStats();
  renderTopicCounts();
  renderHistory();
}

function updateTopics() {
  const unitSel  = $('unitSelect');
  const topicSel = $('topicSelect');
  const unit = unitSel.value;
  let pool = unit === 'all' ? QUESTIONS : QUESTIONS.filter(q => q.topic === unit);
  const topics = uniq(pool.map(q => q.topic));
  topicSel.innerHTML = '<option value="all">All Topics</option>' +
    topics.map(t => `<option value="${escHtml(t)}">${escHtml(t)}</option>`).join('');
}

function updateStats() {
  const chips = $('statChips');
  if (!chips) return;
  const units = uniq(QUESTIONS.map(q => q.topic)).length;
  const easy  = QUESTIONS.filter(q => q.difficulty === 'Easy').length;
  const hard  = QUESTIONS.filter(q => q.difficulty === 'Hard').length;
  chips.innerHTML = `
    <div class="stat-chip"><b>${QUESTIONS.length}</b><span>Questions</span></div>
    <div class="stat-chip"><b>${units}</b><span>Units</span></div>
    <div class="stat-chip"><b>${easy}</b><span>Easy</span></div>
    <div class="stat-chip"><b>${hard}</b><span>Hard</span></div>`;
}

function renderTopicCounts() {
  const el = $('topicCounts');
  if (!el) return;
  const counts = {};
  QUESTIONS.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
  el.innerHTML = Object.entries(counts).map(([topic, n]) =>
    `<div class="count-row"><span>${escHtml(topic)}</span><span class="count-badge">${n}</span></div>`
  ).join('');
}

// ── FILTER POOL ────────────────────────────────────────────
function getPool() {
  const unit  = $('unitSelect').value;
  const topic = $('topicSelect').value;
  const diff  = $('difficultySelect').value;
  return QUESTIONS.filter(q =>
    (unit  === 'all' || q.topic      === unit)  &&
    (topic === 'all' || q.topic      === topic) &&
    (diff  === 'all' || q.difficulty === diff)
  );
}

// ── BUILD EXAM ─────────────────────────────────────────────
function buildExam() {
  stopTimer();
  submitted    = false;
  userAnswers  = {};
  flagged      = new Set();
  currentIndex = 0;

  const pool = getPool();
  const n    = Math.max(1, Math.min(parseInt($('countInput').value || '10', 10), pool.length));

  currentSet = shuffle(pool).slice(0, n);

  if (!currentSet.length) {
    $('examArea').innerHTML = `<div class="empty-state">
      <div class="icon">🔭</div>
      <h3>No Questions Found</h3>
      <p>No questions match those filters. Try broadening your selection.</p>
    </div>`;
    return;
  }

  // Start timer if enabled
  const timerEl = $('timerToggle');
  if (timerEl && timerEl.checked) {
    const mins = parseInt($('timerMinutes').value || '25', 10);
    startTimer(mins * 60);
  }

  renderQuestion();
}

// ── RENDER QUESTION ────────────────────────────────────────
function renderQuestion() {
  const q   = currentSet[currentIndex];
  const id  = getUniqueId(q);
  const multi = String(q.answer).includes(',');
  const answered = answeredCount();
  const isFlagged = flagged.has(id);

  // difficulty badge class
  const diffClass = {
    'Easy': 'badge-easy', 'Medium': 'badge-medium', 'Hard': 'badge-hard'
  }[q.difficulty] || 'badge-unit';

  const choicesHtml = q.choices.map((c, i) => {
    const keyNum = i + 1;
    return `<label class="choice-label ${submitted ? 'disabled' : ''}" data-label="${escHtml(c.label)}">
      <input type="${multi ? 'checkbox' : 'radio'}" name="q_choice"
        value="${escHtml(c.label)}" ${submitted ? 'disabled' : ''}>
      <span class="choice-letter">${escHtml(c.label)}</span>
      <span class="choice-text">${formatPhysics(c.text || '')}</span>
      ${!submitted ? `<span class="kbd-hint">${keyNum}</span>` : ''}
    </label>`;
  }).join('');

  // Answer feedback
  let feedbackHtml = '';
  if (submitted) {
    const chosen = userAnswers[id] || '';
    const correct = normalizeAnswer(chosen) === normalizeAnswer(q.answer);
    feedbackHtml = `<div class="feedback-box ${correct ? 'correct' : 'incorrect'}">
      <div class="feedback-head">
        <span class="feedback-icon">${correct ? '✅' : '❌'}</span>
        <span>${correct ? 'Correct!' : 'Incorrect'}</span>
        ${!correct ? `<span style="font-weight:400;color:var(--ink-2);">Correct answer: <strong>${escHtml(q.answer)}</strong></span>` : ''}
      </div>
      ${q.explanation ? `<div class="feedback-explanation">${formatPhysics(q.explanation)}</div>` : ''}
    </div>`;
  }

  // Streak badge
  let streak = 0;
  if (submitted) {
    for (let i = currentIndex; i >= 0; i--) {
      const qid = getUniqueId(currentSet[i]);
      if (normalizeAnswer(userAnswers[qid] || '') === normalizeAnswer(currentSet[i].answer)) streak++;
      else break;
    }
  }

  const html = `
    <div class="question-card ${submitted ? (isCurrentCorrect() ? 'correct' : 'incorrect') : ''}">
      <div class="q-header">
        <div class="q-badges">
          <span class="badge badge-unit">${escHtml(q.topic)}</span>
          <span class="badge ${diffClass}">${escHtml(q.difficulty)}</span>
          ${isFlagged ? '<span class="badge badge-flagged">🚩 Flagged</span>' : ''}
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          ${streak >= 2 && submitted ? `<span class="streak-badge visible">🔥 ${streak} streak</span>` : ''}
          <button class="flag-btn ${isFlagged ? 'flagged' : ''}" id="flagBtn" title="Flag for review">
            ${isFlagged ? '🚩 Flagged' : '🏳 Flag'}
          </button>
        </div>
      </div>

      <div class="progress-track">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.round(100 * (currentIndex + 1) / currentSet.length)}%"></div>
        </div>
        <span class="progress-label">${currentIndex + 1} / ${currentSet.length}</span>
      </div>

      <p class="q-text">${formatPhysics(q.question)}</p>
      <div class="choices" id="choicesContainer">${choicesHtml}</div>
      ${feedbackHtml}
    </div>

    <div class="quiz-nav">
      <button class="btn btn-secondary" id="prevBtn" ${currentIndex === 0 ? 'disabled' : ''}>← Prev</button>
      <span class="nav-answered">${answered}/${currentSet.length} answered</span>
      <button class="btn btn-secondary" id="nextBtn" ${currentIndex === currentSet.length - 1 ? 'disabled' : ''}>Next →</button>
      <button class="btn btn-primary" id="submitBtn">
        ${submitted ? '📊 Results' : '✔ Submit'}
      </button>
    </div>

    <div id="resultsArea"></div>`;

  $('examArea').innerHTML = html;
  renderNavigator();
  restoreAnswer();
  bindCardEvents();

  if (submitted) renderResults();
}

function isCurrentCorrect() {
  if (!submitted || !currentSet.length) return false;
  const q   = currentSet[currentIndex];
  const id  = getUniqueId(q);
  const chosen = userAnswers[id] || '';
  return normalizeAnswer(chosen) === normalizeAnswer(q.answer);
}

function normalizeAnswer(str) {
  return String(str || '').split(',').map(s => s.trim().toUpperCase()).sort().join(',');
}

// ── BIND EVENTS ON CARD ────────────────────────────────────
function bindCardEvents() {
  const prevBtn   = $('prevBtn');
  const nextBtn   = $('nextBtn');
  const submitBtn = $('submitBtn');
  const flagBtn   = $('flagBtn');

  prevBtn?.addEventListener('click', () => { saveCurrentAnswer(); currentIndex--; renderQuestion(); });
  nextBtn?.addEventListener('click', () => { saveCurrentAnswer(); currentIndex++; renderQuestion(); });
  submitBtn?.addEventListener('click', () => {
    if (!submitted) { saveCurrentAnswer(); submitted = true; stopTimer(); }
    renderQuestion();
  });
  flagBtn?.addEventListener('click', toggleFlag);

  // Update "answered" count live as user picks choices
  const container = $('choicesContainer');
  container?.addEventListener('change', () => {
    saveCurrentAnswer();
    updateNavAnswered();
  });
}

function updateNavAnswered() {
  const el = qs('.nav-answered');
  if (el) el.textContent = `${answeredCount()}/${currentSet.length} answered`;
}

// ── FLAG ───────────────────────────────────────────────────
function toggleFlag() {
  if (!currentSet.length) return;
  const id = getUniqueId(currentSet[currentIndex]);
  if (flagged.has(id)) flagged.delete(id);
  else flagged.add(id);
  renderNavigator();
  // Update flag btn without full re-render
  const btn = $('flagBtn');
  const isFlagged = flagged.has(id);
  if (btn) {
    btn.textContent = isFlagged ? '🚩 Flagged' : '🏳 Flag';
    btn.classList.toggle('flagged', isFlagged);
  }
  const badgeContainer = qs('.q-badges');
  if (badgeContainer) {
    const existing = qs('.badge-flagged', badgeContainer);
    if (isFlagged && !existing) {
      const span = document.createElement('span');
      span.className = 'badge badge-flagged';
      span.textContent = '🚩 Flagged';
      badgeContainer.appendChild(span);
    } else if (!isFlagged && existing) {
      existing.remove();
    }
  }
}

// ── NAVIGATOR GRID ─────────────────────────────────────────
function renderNavigator() {
  const el = $('qNavigator');
  if (!el || !currentSet.length) return;

  const btns = currentSet.map((q, i) => {
    const id = getUniqueId(q);
    let cls = '';
    if (i === currentIndex)       cls = 'current';
    else if (submitted) {
      const chosen = userAnswers[id] || '';
      cls = normalizeAnswer(chosen) === normalizeAnswer(q.answer) ? 'correct' : 'incorrect';
    } else if (flagged.has(id))   cls = 'flagged-q';
    else if (userAnswers[id])     cls = 'answered';
    return `<button class="jump-btn ${cls}" data-jump="${i}" title="Q${i + 1}: ${escHtml(q.topic)}">${i + 1}</button>`;
  }).join('');

  el.innerHTML = `<h3>Question Navigator</h3><div class="jump-grid">${btns}</div>`;
  el.querySelectorAll('[data-jump]').forEach(btn =>
    btn.addEventListener('click', e => {
      saveCurrentAnswer();
      currentIndex = Number(e.currentTarget.dataset.jump);
      renderQuestion();
    })
  );
}

// ── SAVE / RESTORE ANSWERS ─────────────────────────────────
function saveCurrentAnswer() {
  if (!currentSet.length || submitted) return;
  const q = currentSet[currentIndex];
  const id = getUniqueId(q);
  const inputs = qsa('input[name="q_choice"]:checked');
  const labels = inputs.map(i => i.value);
  userAnswers[id] = labels.join(',') || null;
}

function restoreAnswer() {
  if (!currentSet.length) return;
  const q   = currentSet[currentIndex];
  const id  = getUniqueId(q);
  const saved = userAnswers[id];
  if (!saved) return;
  const values = saved.split(',').map(s => s.trim());
  values.forEach(v => {
    const input = qs(`input[name="q_choice"][value="${CSS.escape(v)}"]`);
    if (input) input.checked = true;
  });
  // Style selected
  qsa('.choice-label').forEach(label => {
    const input = qs('input', label);
    if (input?.checked) label.classList.add('selected');
  });
}

// ── SCORE & RESULTS ────────────────────────────────────────
function renderResults() {
  const el = $('resultsArea');
  if (!el) return;

  let correct = 0;
  currentSet.forEach(q => {
    const chosen = userAnswers[getUniqueId(q)] || '';
    if (normalizeAnswer(chosen) === normalizeAnswer(q.answer)) correct++;
  });

  const pct   = Math.round(100 * correct / currentSet.length);
  const grade = pct >= 75 ? 'great' : pct >= 50 ? 'ok' : 'poor';
  const msg   = pct >= 75 ? '🎉 Excellent work!' : pct >= 50 ? '📈 Keep studying!' : '📚 Review and retry!';

  // Analytics by topic
  const topicStats = {};
  currentSet.forEach(q => {
    const t = q.topic;
    if (!topicStats[t]) topicStats[t] = { correct: 0, total: 0 };
    topicStats[t].total++;
    const chosen = userAnswers[getUniqueId(q)] || '';
    if (normalizeAnswer(chosen) === normalizeAnswer(q.answer)) topicStats[t].correct++;
  });

  // Analytics by difficulty
  const diffStats = {};
  currentSet.forEach(q => {
    const d = q.difficulty;
    if (!diffStats[d]) diffStats[d] = { correct: 0, total: 0 };
    diffStats[d].total++;
    const chosen = userAnswers[getUniqueId(q)] || '';
    if (normalizeAnswer(chosen) === normalizeAnswer(q.answer)) diffStats[d].correct++;
  });

  const topicRows = Object.entries(topicStats).map(([t, s]) => {
    const p = Math.round(100 * s.correct / s.total);
    const barClass = p >= 75 ? 'good' : p >= 50 ? 'ok' : 'poor';
    return `<div class="analytics-row">
      <span class="analytics-label" title="${escHtml(t)}">${escHtml(t.replace(/^Unit \d+: /, ''))}</span>
      <div class="analytics-bar-track"><div class="analytics-bar-fill ${barClass}" style="width:${p}%"></div></div>
      <span class="analytics-pct">${s.correct}/${s.total}</span>
    </div>`;
  }).join('');

  const diffRows = Object.entries(diffStats).map(([d, s]) => {
    const p = Math.round(100 * s.correct / s.total);
    const barClass = p >= 75 ? 'good' : p >= 50 ? 'ok' : 'poor';
    return `<div class="analytics-row">
      <span class="analytics-label">${escHtml(d)}</span>
      <div class="analytics-bar-track"><div class="analytics-bar-fill ${barClass}" style="width:${p}%"></div></div>
      <span class="analytics-pct">${s.correct}/${s.total}</span>
    </div>`;
  }).join('');

  const jumpBtns = currentSet.map((q, i) => {
    const chosen = userAnswers[getUniqueId(q)] || '';
    const ok = normalizeAnswer(chosen) === normalizeAnswer(q.answer);
    return `<button class="jump-btn ${ok ? 'correct' : 'incorrect'}" data-jump="${i}" title="Q${i+1}">${i + 1}</button>`;
  }).join('');

  el.innerHTML = `<div class="score-card">
    <div class="score-header">
      <div class="score-circle ${grade}">
        <span class="pct">${pct}%</span>
        <span class="frac">${correct}/${currentSet.length}</span>
      </div>
      <div class="score-info">
        <h2>${msg}</h2>
        <p>You answered ${correct} of ${currentSet.length} questions correctly.</p>
        <p style="margin-top:6px;font-size:.82rem;color:var(--muted)">
          Answers are locked. Generate a new set to try again.
        </p>
      </div>
    </div>

    <div class="analytics-grid">
      <div class="analytics-section">
        <h4>📚 By Unit</h4>${topicRows}
      </div>
      <div class="analytics-section">
        <h4>🎯 By Difficulty</h4>${diffRows}
      </div>
    </div>

    <div style="margin-top:18px;">
      <h4 style="font-size:.8rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Jump to Question</h4>
      <div class="jump-grid">${jumpBtns}</div>
    </div>
  </div>`;

  el.querySelectorAll('[data-jump]').forEach(btn =>
    btn.addEventListener('click', e => {
      currentIndex = Number(e.currentTarget.dataset.jump);
      renderQuestion();
      $('examArea').scrollIntoView({ behavior: 'smooth' });
    })
  );

  saveHistory(correct, currentSet.length, pct);
}

// ── SESSION HISTORY ────────────────────────────────────────
function saveHistory(correct, total, pct) {
  const history = JSON.parse(localStorage.getItem('ap-physics-history') || '[]');
  history.unshift({
    date: new Date().toLocaleDateString(),
    correct, total, pct,
    unit: $('unitSelect').value
  });
  localStorage.setItem('ap-physics-history', JSON.stringify(history.slice(0, 5)));
  renderHistory();
}

function renderHistory() {
  const el = $('historyList');
  if (!el) return;
  const history = JSON.parse(localStorage.getItem('ap-physics-history') || '[]');
  if (!history.length) {
    el.innerHTML = '<li class="history-item" style="color:var(--muted);font-size:.82rem;">No sessions yet.</li>';
    return;
  }
  el.innerHTML = history.map(h => `
    <li class="history-item">
      <span style="font-size:.75rem;color:var(--muted)">${h.date}</span>
      <span class="history-score">${h.correct}/${h.total}</span>
      <span style="color:${h.pct >= 75 ? 'var(--good)' : h.pct >= 50 ? 'var(--warn)' : 'var(--bad)'};font-weight:700">${h.pct}%</span>
      <span style="font-size:.78rem;color:var(--muted);flex:1;text-align:right">${h.unit === 'all' ? 'All Units' : h.unit}</span>
    </li>`).join('');
}

// ── FORMULA SHEET MODAL ────────────────────────────────────
const FORMULAS = [
  {
    unit: 'Unit 1: Kinematics',
    items: [
      { eq: 'v = v₀ + at',         desc: 'Velocity under constant acceleration' },
      { eq: 'x = x₀ + v₀t + ½at²', desc: 'Position under constant acceleration' },
      { eq: 'v² = v₀² + 2aΔx',     desc: 'Velocity-displacement relation' },
      { eq: 'x = (v + v₀)/2 · t',  desc: 'Average velocity shortcut' },
    ]
  },
  {
    unit: 'Unit 2: Forces & Newton\'s Laws',
    items: [
      { eq: 'F_net = ma',        desc: 'Newton\'s 2nd Law' },
      { eq: 'W = mg',            desc: 'Weight near Earth\'s surface' },
      { eq: 'f_s ≤ μₛFₙ',       desc: 'Static friction (max)' },
      { eq: 'f_k = μₖFₙ',       desc: 'Kinetic friction' },
      { eq: 'F₁₂ = −F₂₁',       desc: 'Newton\'s 3rd Law (action-reaction)' },
    ]
  },
  {
    unit: 'Unit 3: Work, Energy & Power',
    items: [
      { eq: 'W = Fd cosθ',       desc: 'Work done by a constant force' },
      { eq: 'KE = ½mv²',         desc: 'Kinetic energy' },
      { eq: 'PE_g = mgh',        desc: 'Gravitational potential energy' },
      { eq: 'PE_s = ½kx²',       desc: 'Elastic (spring) potential energy' },
      { eq: 'P = W/t = Fv',      desc: 'Power' },
      { eq: 'W_net = ΔKE',       desc: 'Work-energy theorem' },
    ]
  },
  {
    unit: 'Unit 4: Momentum & Impulse',
    items: [
      { eq: 'p = mv',            desc: 'Linear momentum' },
      { eq: 'J = FΔt = Δp',      desc: 'Impulse-momentum theorem' },
      { eq: 'Σp = constant',     desc: 'Conservation of momentum (closed system)' },
    ]
  },
  {
    unit: 'Unit 5: Rotation',
    items: [
      { eq: 'τ = rF sinθ',       desc: 'Torque' },
      { eq: 'τ_net = Iα',        desc: 'Rotational Newton\'s 2nd Law' },
      { eq: 'L = Iω',            desc: 'Angular momentum' },
      { eq: 'KE_rot = ½Iω²',    desc: 'Rotational kinetic energy' },
      { eq: 'I_disk = ½MR²',     desc: 'Moment of inertia – solid disk' },
      { eq: 'I_ring = MR²',      desc: 'Moment of inertia – ring/hoop' },
      { eq: 'I_rod = 1/12 ML²',  desc: 'Moment of inertia – rod about center' },
    ]
  },
  {
    unit: 'Unit 6: Oscillations',
    items: [
      { eq: 'T_s = 2π√(m/k)',    desc: 'Period – mass-spring' },
      { eq: 'T_p = 2π√(L/g)',    desc: 'Period – simple pendulum' },
      { eq: 'f = 1/T',           desc: 'Frequency from period' },
      { eq: 'v_max = Aω',        desc: 'Max speed in SHM' },
    ]
  },
  {
    unit: 'Unit 7: Gravitation',
    items: [
      { eq: 'F_g = Gm₁m₂/r²',   desc: 'Newton\'s law of gravitation' },
      { eq: 'g = GM/r²',         desc: 'Gravitational field strength' },
      { eq: 'T² ∝ r³',           desc: 'Kepler\'s 3rd Law' },
      { eq: 'v_orb = √(GM/r)',   desc: 'Circular orbital speed' },
    ]
  }
];

function renderFormulaSheet() {
  const body = $('formulaBody');
  if (!body) return;
  body.innerHTML = FORMULAS.map(section => `
    <div class="formula-unit">
      <h3>${escHtml(section.unit)}</h3>
      <div class="formula-grid">
        ${section.items.map(item => `
          <div class="formula-item">
            <div class="formula-eq">${escHtml(item.eq)}</div>
            <div class="formula-desc">${escHtml(item.desc)}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function openModal(id) { $(id)?.classList.remove('hidden'); }
function closeModal(id){ $(id)?.classList.add('hidden'); }

// ── KEYBOARD SHORTCUTS ─────────────────────────────────────
function handleKeyboard(e) {
  // Don't intercept when typing in inputs
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (!currentSet.length) return;

  if (e.key === 'ArrowRight' || e.key === 'n') {
    if (currentIndex < currentSet.length - 1) {
      saveCurrentAnswer(); currentIndex++; renderQuestion();
    }
    return;
  }
  if (e.key === 'ArrowLeft' || e.key === 'p') {
    if (currentIndex > 0) {
      saveCurrentAnswer(); currentIndex--; renderQuestion();
    }
    return;
  }
  if (e.key === 'f' || e.key === 'F') {
    toggleFlag(); return;
  }
  if (e.key === 'Enter' && !submitted) {
    saveCurrentAnswer(); submitted = true; stopTimer(); renderQuestion(); return;
  }
  // Number keys 1-5 → select answer choice
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= 5 && !submitted) {
    const inputs = qsa('input[name="q_choice"]');
    const target = inputs[num - 1];
    if (target) {
      if (target.type === 'radio') {
        inputs.forEach(i => i.checked = false);
        target.checked = true;
      } else {
        target.checked = !target.checked;
      }
      target.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

// ── RESET ─────────────────────────────────────────────────
function resetAll() {
  stopTimer();
  submitted    = false;
  userAnswers  = {};
  flagged      = new Set();
  currentSet   = [];
  currentIndex = 0;
  $('unitSelect').value       = 'all';
  $('difficultySelect').value = 'all';
  $('countInput').value       = 10;
  updateTopics();
  $('examArea').innerHTML     = '';
  $('qNavigator').innerHTML   = '';
}

// ── INIT ───────────────────────────────────────────────────
function init() {
  initTheme();
  populate();
  renderFormulaSheet();

  // Sidebar events
  $('unitSelect').addEventListener('change', updateTopics);
  $('buildBtn').addEventListener('click', buildExam);
  $('resetBtn').addEventListener('click', resetAll);
  $('printBtn').addEventListener('click', () => window.print());
  $('themeBtn').addEventListener('click', toggleTheme);

  // Modals
  $('formulaBtn').addEventListener('click', () => openModal('formulaModal'));
  $('shortcutsBtn').addEventListener('click', () => openModal('shortcutsModal'));
  $('closeFormula').addEventListener('click', () => closeModal('formulaModal'));
  $('closeShortcuts').addEventListener('click', () => closeModal('shortcutsModal'));

  // Close modals on overlay click
  ['formulaModal', 'shortcutsModal'].forEach(id => {
    $(id).addEventListener('click', e => {
      if (e.target === $(id)) closeModal(id);
    });
  });

  // Keyboard
  document.addEventListener('keydown', handleKeyboard);

  // Timer toggle visibility
  $('timerToggle').addEventListener('change', e => {
    $('timerMinutesRow').style.display = e.target.checked ? 'block' : 'none';
  });

  // Initial empty state
  $('examArea').innerHTML = `<div class="empty-state">
    <div class="icon">⚛️</div>
    <h3>Ready to Practice</h3>
    <p>Configure your exam using the panel on the left, then click <strong>Generate Exam</strong> to begin.</p>
  </div>`;
}

document.addEventListener('DOMContentLoaded', init);
