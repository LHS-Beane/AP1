# ⚛️ AP Physics 1 — Practice Exam Builder

An interactive, browser-based multiple-choice practice exam builder for AP Physics 1. Fully static — no server, no build step, no dependencies. Deploy to **GitHub Pages** in one click.

---

## 🚀 Features

| Feature | Details |
|---|---|
| **Question Bank** | 45+ questions across all 7 AP Physics 1 units |
| **Smart Filtering** | Filter by unit, topic, and difficulty (Easy / Medium / Hard) |
| **Exam Timer** | Optional countdown with configurable minutes; auto-submits on timeout |
| **Instant Feedback** | Per-question correct/incorrect with full written explanations |
| **Formula Sheet** | Full AP Physics 1 reference sheet organized by unit (modal) |
| **Analytics** | Post-exam breakdown by unit and difficulty with visual bar charts |
| **Question Navigator** | Visual grid showing answered/flagged/correct/incorrect status |
| **Flagging** | Flag questions for review; flagged items highlighted in navigator |
| **Dark Mode** | One-click toggle, persists via localStorage |
| **Keyboard Shortcuts** | Number keys select answers; arrow keys navigate; `f` flags; Enter submits |
| **Session History** | Last 5 exam scores stored locally |
| **Print / PDF** | Clean print layout; sidebar and UI chrome hidden automatically |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## 📚 Units Covered

- **Unit 1** — Kinematics
- **Unit 2** — Forces & Newton's Laws
- **Unit 3** — Work, Energy & Power
- **Unit 4** — Momentum & Impulse
- **Unit 5** — Rotation
- **Unit 6** — Oscillations (Simple Harmonic Motion)
- **Unit 7** — Gravitation

---

## 🗂 File Structure

```
ap-physics-exam-builder/
├── index.html       # Main page — all layout and modals
├── styles.css       # Design system with light/dark theme
├── app.js           # All interactivity (timer, scoring, analytics, modals)
├── questions.js     # Question bank — add/edit questions here
└── README.md
```

---

## ➕ Adding Questions

Open `questions.js` and add an object to the `window.AP_QUESTIONS` array:

```js
{
  topic:       "Unit 2: Forces & Newton's Laws",  // must match existing unit strings
  difficulty:  "Medium",                           // "Easy" | "Medium" | "Hard"
  question:    "A 5 kg block is pushed by a 20 N force on a frictionless surface. What is its acceleration?",
  choices: [
    { label: "A", text: "2 m/s²" },
    { label: "B", text: "4 m/s²" },
    { label: "C", text: "10 m/s²" },
    { label: "D", text: "100 m/s²" }
  ],
  answer:      "B",           // must match a label exactly
  explanation: "F = ma → a = 20/5 = 4 m/s²."
}
```

**Multi-select questions** (rare on AP but supported): set `answer: "A,C"` and the app switches to checkboxes automatically.

**Physics notation** in `question`, `choice.text`, and `explanation` fields supports:
- Superscripts: `m/s^2` → m/s²
- Subscripts: `v_0` → v₀
- Greek letters: `theta`, `omega`, `mu`, `pi`, `alpha`, `tau`, `Delta`
- Scientific notation: `1.6x10-19` → 1.6 × 10⁻¹⁹

---

## 🌐 Deploy to GitHub Pages

1. Fork or push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set Source to `main` branch, root folder `/`.
4. Click **Save**. Your site will be live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

No build tools, no Node.js, no configuration needed.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` – `5` | Select answer choice A – E |
| `→` or `n` | Next question |
| `←` or `p` | Previous question |
| `Enter` | Submit & check answers |
| `f` | Flag / unflag question |

---

## 🖨 Printing

Click **Print / PDF** in the sidebar. The UI chrome (sidebar, timer, navigation, score card) is hidden automatically via `@media print`, leaving clean question cards suitable for handouts.

---

## 📝 License

MIT — free for classroom and personal use.

---

*Built for AP Physics 1 students and teachers. Questions aligned to the College Board AP Physics 1 curriculum (2025 framework).*
