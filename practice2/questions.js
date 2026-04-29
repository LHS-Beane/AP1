// AP Physics 1 – Question Bank
// window.AP_QUESTIONS is consumed by app.js
// Format: { question, choices:[{label,text}], answer:"A", difficulty, topic, explanation }

window.AP_QUESTIONS = [

  /* ─── UNIT 1: KINEMATICS ─────────────────────────────── */
  {
    topic:"Unit 1: Kinematics", difficulty:"Easy",
    question:"A car travels 120 m in 6 s at constant speed. What is its speed?",
    choices:[{label:"A",text:"10 m/s"},{label:"B",text:"20 m/s"},{label:"C",text:"30 m/s"},{label:"D",text:"720 m/s"}],
    answer:"B",
    explanation:"v = d/t = 120 m ÷ 6 s = 20 m/s. At constant speed, the simple ratio applies."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Easy",
    question:"On a position-time graph, what does a horizontal (flat) line represent?",
    choices:[{label:"A",text:"Constant acceleration"},{label:"B",text:"Maximum speed"},{label:"C",text:"Zero velocity"},{label:"D",text:"Negative displacement"}],
    answer:"C",
    explanation:"A horizontal line means position is not changing with time, so velocity = Δx/Δt = 0."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Medium",
    question:"A ball is dropped from rest and falls freely for 4 s. How far does it fall? (g = 10 m/s²)",
    choices:[{label:"A",text:"40 m"},{label:"B",text:"80 m"},{label:"C",text:"160 m"},{label:"D",text:"320 m"}],
    answer:"B",
    explanation:"Using Δy = ½gt²: Δy = ½(10)(4²) = ½(10)(16) = 80 m."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Medium",
    question:"A sprinter accelerates from rest at 3 m/s² for 4 s. What is her final velocity?",
    choices:[{label:"A",text:"7 m/s"},{label:"B",text:"12 m/s"},{label:"C",text:"16 m/s"},{label:"D",text:"24 m/s"}],
    answer:"B",
    explanation:"v = v₀ + at = 0 + (3)(4) = 12 m/s."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Medium",
    question:"On a velocity-time graph, what does the area under the curve represent?",
    choices:[{label:"A",text:"Acceleration"},{label:"B",text:"Force"},{label:"C",text:"Displacement"},{label:"D",text:"Jerk"}],
    answer:"C",
    explanation:"Area under a v-t graph = ∫v dt = displacement. The slope of a v-t graph gives acceleration."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Medium",
    question:"A car decelerates from 30 m/s to rest over 150 m. What is its acceleration?",
    choices:[{label:"A",text:"−1 m/s²"},{label:"B",text:"−2 m/s²"},{label:"C",text:"−3 m/s²"},{label:"D",text:"−6 m/s²"}],
    answer:"C",
    explanation:"v² = v₀² + 2aΔx → 0 = 900 + 2a(150) → a = −900/300 = −3 m/s²."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Hard",
    question:"A projectile is launched horizontally at 20 m/s from a 45 m cliff. How far from the base does it land? (g = 10 m/s²)",
    choices:[{label:"A",text:"45 m"},{label:"B",text:"60 m"},{label:"C",text:"90 m"},{label:"D",text:"180 m"}],
    answer:"B",
    explanation:"Time to fall: t = √(2h/g) = √(90/10) = 3 s. Range = v·t = 20 × 3 = 60 m. Horizontal and vertical motions are independent."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Hard",
    question:"A ball is thrown upward at 25 m/s. What is its height 3 s later? (g = 10 m/s²)",
    choices:[{label:"A",text:"30 m"},{label:"B",text:"45 m"},{label:"C",text:"75 m"},{label:"D",text:"120 m"}],
    answer:"A",
    explanation:"y = v₀t − ½gt² = 25(3) − ½(10)(9) = 75 − 45 = 30 m."
  },

  /* ─── UNIT 2: FORCES & NEWTON'S LAWS ───────────────────── */
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Easy",
    question:"A net force of 18 N acts on a 3 kg object. What is its acceleration?",
    choices:[{label:"A",text:"3 m/s²"},{label:"B",text:"6 m/s²"},{label:"C",text:"9 m/s²"},{label:"D",text:"54 m/s²"}],
    answer:"B",
    explanation:"F = ma → a = F/m = 18/3 = 6 m/s²."
  },
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Easy",
    question:"Newton's 3rd Law states that for every action force there is a reaction force that is:",
    choices:[{label:"A",text:"Smaller and in the same direction"},{label:"B",text:"Equal and in the same direction"},{label:"C",text:"Equal and in the opposite direction"},{label:"D",text:"Larger and in the opposite direction"}],
    answer:"C",
    explanation:"Action-reaction pairs are always equal in magnitude and opposite in direction, acting on different objects."
  },
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Medium",
    question:"A 5 kg block is pushed across a frictionless surface by a 20 N horizontal force. What is the normal force on the block? (g = 10 m/s²)",
    choices:[{label:"A",text:"0 N"},{label:"B",text:"20 N"},{label:"C",text:"50 N"},{label:"D",text:"70 N"}],
    answer:"C",
    explanation:"On a horizontal frictionless surface, F_N = mg = 5 × 10 = 50 N. The horizontal force does not affect the normal force here."
  },
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Medium",
    question:"A 10 kg box rests on a surface with μk = 0.3. What is the kinetic friction force? (g = 10 m/s²)",
    choices:[{label:"A",text:"3 N"},{label:"B",text:"30 N"},{label:"C",text:"100 N"},{label:"D",text:"300 N"}],
    answer:"B",
    explanation:"f_k = μk · F_N = 0.3 × (10 × 10) = 0.3 × 100 = 30 N."
  },
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Medium",
    question:"Two objects, 2 kg and 8 kg, are connected by a rope on a frictionless surface. A 30 N force pulls the 8 kg block. What is the tension in the rope?",
    choices:[{label:"A",text:"3 N"},{label:"B",text:"6 N"},{label:"C",text:"24 N"},{label:"D",text:"30 N"}],
    answer:"B",
    explanation:"System acceleration: a = F/m_total = 30/10 = 3 m/s². Tension on 2 kg block: T = m₁a = 2 × 3 = 6 N."
  },
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Hard",
    question:"A 4 kg block on a 30° frictionless incline. What is its acceleration down the slope? (g = 10 m/s²)",
    choices:[{label:"A",text:"5 m/s²"},{label:"B",text:"8.66 m/s²"},{label:"C",text:"10 m/s²"},{label:"D",text:"40 m/s²"}],
    answer:"A",
    explanation:"Net force along incline = mg sin30° = 4(10)(0.5) = 20 N. a = F/m = 20/4 = 5 m/s²."
  },

  /* ─── UNIT 3: WORK, ENERGY & POWER ─────────────────────── */
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Easy",
    question:"A force of 10 N moves a box 5 m in the direction of the force. How much work is done?",
    choices:[{label:"A",text:"2 J"},{label:"B",text:"15 J"},{label:"C",text:"50 J"},{label:"D",text:"500 J"}],
    answer:"C",
    explanation:"W = Fd cosθ = 10 × 5 × cos0° = 50 J. Since force and displacement are parallel, cos0° = 1."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Easy",
    question:"A 2 kg object moves at 6 m/s. What is its kinetic energy?",
    choices:[{label:"A",text:"6 J"},{label:"B",text:"12 J"},{label:"C",text:"36 J"},{label:"D",text:"72 J"}],
    answer:"C",
    explanation:"KE = ½mv² = ½(2)(6²) = ½(2)(36) = 36 J."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Medium",
    question:"A 3 kg ball is held 5 m above the ground and released from rest. What is its speed just before hitting the ground? (g = 10 m/s²)",
    choices:[{label:"A",text:"5 m/s"},{label:"B",text:"10 m/s"},{label:"C",text:"15 m/s"},{label:"D",text:"150 m/s"}],
    answer:"B",
    explanation:"Energy conservation: mgh = ½mv² → v = √(2gh) = √(2×10×5) = √100 = 10 m/s."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Medium",
    question:"A machine does 600 J of work in 30 s. What is its power output?",
    choices:[{label:"A",text:"2 W"},{label:"B",text:"20 W"},{label:"C",text:"200 W"},{label:"D",text:"18,000 W"}],
    answer:"B",
    explanation:"P = W/t = 600/30 = 20 W."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Medium",
    question:"A 5 kg object slides down a frictionless ramp that is 8 m tall. How much kinetic energy does it have at the bottom? (g = 10 m/s²)",
    choices:[{label:"A",text:"40 J"},{label:"B",text:"80 J"},{label:"C",text:"400 J"},{label:"D",text:"800 J"}],
    answer:"C",
    explanation:"All PE converts to KE (frictionless). KE = mgh = 5 × 10 × 8 = 400 J."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Hard",
    question:"A spring (k = 100 N/m) is compressed 0.5 m against a 1 kg block on a frictionless surface. What is the block's speed when the spring returns to its natural length?",
    choices:[{label:"A",text:"2 m/s"},{label:"B",text:"5 m/s"},{label:"C",text:"10 m/s"},{label:"D",text:"25 m/s"}],
    answer:"B",
    explanation:"All elastic PE converts to KE: ½kx² = ½mv² → v = x√(k/m) = 0.5 × √(100/1) = 0.5 × 10 = 5 m/s."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Hard",
    question:"A constant 15 N force acts at 60° to the displacement over 8 m. How much work does the force do?",
    choices:[{label:"A",text:"60 J"},{label:"B",text:"104 J"},{label:"C",text:"120 J"},{label:"D",text:"180 J"}],
    answer:"A",
    explanation:"W = Fd cosθ = 15 × 8 × cos60° = 120 × 0.5 = 60 J."
  },

  /* ─── UNIT 4: MOMENTUM & IMPULSE ───────────────────────── */
  {
    topic:"Unit 4: Momentum & Impulse", difficulty:"Easy",
    question:"A 4 kg object moves at 5 m/s. What is its momentum?",
    choices:[{label:"A",text:"0.8 kg·m/s"},{label:"B",text:"9 kg·m/s"},{label:"C",text:"20 kg·m/s"},{label:"D",text:"100 kg·m/s"}],
    answer:"C",
    explanation:"p = mv = 4 × 5 = 20 kg·m/s."
  },
  {
    topic:"Unit 4: Momentum & Impulse", difficulty:"Medium",
    question:"A 0.5 kg ball strikes a wall at 8 m/s and bounces back at 8 m/s. What impulse does the wall exert on the ball?",
    choices:[{label:"A",text:"0 N·s"},{label:"B",text:"4 N·s"},{label:"C",text:"8 N·s"},{label:"D",text:"−8 N·s"}],
    answer:"C",
    explanation:"J = Δp = m(v_f − v_i) = 0.5(−8 − 8) = 0.5(−16) = −8 N·s. The magnitude is 8 N·s away from wall."
  },
  {
    topic:"Unit 4: Momentum & Impulse", difficulty:"Medium",
    question:"A 1200 kg car moving at 20 m/s collides and sticks to a stationary 800 kg car. What is their combined velocity after the collision?",
    choices:[{label:"A",text:"8 m/s"},{label:"B",text:"12 m/s"},{label:"C",text:"14 m/s"},{label:"D",text:"20 m/s"}],
    answer:"B",
    explanation:"Conservation of momentum: m₁v₁ = (m₁+m₂)v_f → 1200(20) = 2000 v_f → v_f = 24000/2000 = 12 m/s."
  },
  {
    topic:"Unit 4: Momentum & Impulse", difficulty:"Medium",
    question:"Which of the following best explains why airbags reduce injury in a car crash?",
    choices:[{label:"A",text:"They eliminate the impulse on the passenger"},{label:"B",text:"They decrease momentum change"},{label:"C",text:"They increase the time of collision, reducing average force"},{label:"D",text:"They increase the force of collision to stiffen the passenger"}],
    answer:"C",
    explanation:"J = FΔt = Δp. Since momentum change is fixed by the crash, increasing Δt means a smaller average F, reducing injury."
  },
  {
    topic:"Unit 4: Momentum & Impulse", difficulty:"Hard",
    question:"A 3 kg ball moving at 6 m/s east collides elastically with a stationary 3 kg ball. After the collision, what happens?",
    choices:[{label:"A",text:"Both balls move east at 3 m/s"},{label:"B",text:"The first ball stops; the second moves east at 6 m/s"},{label:"C",text:"Both balls move west"},{label:"D",text:"First ball moves east at 6 m/s; second stays still"}],
    answer:"B",
    explanation:"In a perfectly elastic collision between equal masses where one is stationary, the first object stops completely and the second takes all the velocity. This follows from conservation of both momentum and kinetic energy."
  },

  /* ─── UNIT 5: ROTATION ──────────────────────────────────── */
  {
    topic:"Unit 5: Rotation", difficulty:"Easy",
    question:"A wrench applies a force of 40 N at 0.25 m from the pivot, perpendicular to the handle. What is the torque?",
    choices:[{label:"A",text:"0.16 N·m"},{label:"B",text:"10 N·m"},{label:"C",text:"40 N·m"},{label:"D",text:"160 N·m"}],
    answer:"B",
    explanation:"τ = rF sinθ = 0.25 × 40 × sin90° = 10 N·m."
  },
  {
    topic:"Unit 5: Rotation", difficulty:"Medium",
    question:"A uniform beam of length 4 m and weight 200 N is balanced at its center. A 100 N weight hangs 1 m from the left end. How far from the right end must a 50 N weight hang to maintain balance?",
    choices:[{label:"A",text:"0.5 m"},{label:"B",text:"1 m"},{label:"C",text:"2 m"},{label:"D",text:"4 m"}],
    answer:"C",
    explanation:"Taking torques about the center: 100(1) = 50(d) on the right → d = 2 m from center. So it hangs 2 m from the right end (at the right end if the beam is 4 m, so 4 − 2 = 2 m from the right)."
  },
  {
    topic:"Unit 5: Rotation", difficulty:"Medium",
    question:"The rotational analog of Newton's second law is:",
    choices:[{label:"A",text:"τ = Iα"},{label:"B",text:"τ = mv²"},{label:"C",text:"L = ½Iω"},{label:"D",text:"τ = mvr"}],
    answer:"A",
    explanation:"τ_net = Iα, where τ is net torque, I is moment of inertia, and α is angular acceleration. This parallels F = ma."
  },
  {
    topic:"Unit 5: Rotation", difficulty:"Hard",
    question:"A figure skater spinning with arms extended (I = 4 kg·m²) at ω = 2 rad/s pulls in her arms so I = 1 kg·m². What is her new angular velocity?",
    choices:[{label:"A",text:"0.5 rad/s"},{label:"B",text:"4 rad/s"},{label:"C",text:"8 rad/s"},{label:"D",text:"16 rad/s"}],
    answer:"C",
    explanation:"Conservation of angular momentum: L = I₁ω₁ = I₂ω₂ → 4(2) = 1(ω₂) → ω₂ = 8 rad/s."
  },
  {
    topic:"Unit 5: Rotation", difficulty:"Hard",
    question:"A solid disk (I = ½MR²) and a ring (I = MR²) of the same mass and radius roll from rest down the same incline. Which reaches the bottom first?",
    choices:[{label:"A",text:"The ring, because it has more rotational inertia"},{label:"B",text:"The disk, because it has less rotational inertia"},{label:"C",text:"They arrive at the same time"},{label:"D",text:"The disk, because it has more linear momentum"}],
    answer:"B",
    explanation:"Objects with less rotational inertia convert more PE to translational KE, accelerating faster. The disk (I = ½MR²) beats the ring (I = MR²) every time, regardless of M or R."
  },

  /* ─── UNIT 6: OSCILLATIONS ──────────────────────────────── */
  {
    topic:"Unit 6: Oscillations", difficulty:"Easy",
    question:"A mass-spring system has k = 100 N/m and m = 1 kg. What is its period of oscillation?",
    choices:[{label:"A",text:"0.2π s"},{label:"B",text:"0.628 s"},{label:"C",text:"2π/10 s ≈ 0.628 s"},{label:"D",text:"2π s"}],
    answer:"C",
    explanation:"T = 2π√(m/k) = 2π√(1/100) = 2π/10 ≈ 0.628 s."
  },
  {
    topic:"Unit 6: Oscillations", difficulty:"Medium",
    question:"If the mass on a spring is quadrupled, how does the period change?",
    choices:[{label:"A",text:"It doubles"},{label:"B",text:"It quadruples"},{label:"C",text:"It halves"},{label:"D",text:"It is unchanged"}],
    answer:"A",
    explanation:"T = 2π√(m/k). If m → 4m, then T → 2π√(4m/k) = 2 × 2π√(m/k). The period doubles."
  },
  {
    topic:"Unit 6: Oscillations", difficulty:"Medium",
    question:"A simple pendulum has length L = 0.25 m. What is its period? (g = 10 m/s²)",
    choices:[{label:"A",text:"π/10 s"},{label:"B",text:"π/5 s ≈ 0.63 s"},{label:"C",text:"π s"},{label:"D",text:"2π s"}],
    answer:"B",
    explanation:"T = 2π√(L/g) = 2π√(0.25/10) = 2π√(0.025) = 2π(0.158) ≈ π/5 ≈ 0.628 s."
  },
  {
    topic:"Unit 6: Oscillations", difficulty:"Medium",
    question:"In simple harmonic motion, at which position is the kinetic energy maximum?",
    choices:[{label:"A",text:"At maximum amplitude"},{label:"B",text:"At the equilibrium position"},{label:"C",text:"At half the amplitude"},{label:"D",text:"KE is constant throughout"}],
    answer:"B",
    explanation:"At equilibrium, PE = 0 and all energy is kinetic. At maximum amplitude, KE = 0 and all energy is potential."
  },
  {
    topic:"Unit 6: Oscillations", difficulty:"Hard",
    question:"A 0.5 kg mass on a spring (k = 50 N/m) oscillates with amplitude A = 0.2 m. What is the maximum speed of the mass?",
    choices:[{label:"A",text:"1 m/s"},{label:"B",text:"2 m/s"},{label:"C",text:"5 m/s"},{label:"D",text:"10 m/s"}],
    answer:"B",
    explanation:"At equilibrium, all PE converts to KE: ½kA² = ½mv_max² → v_max = A√(k/m) = 0.2√(50/0.5) = 0.2√100 = 0.2 × 10 = 2 m/s."
  },

  /* ─── UNIT 7: GRAVITATION ───────────────────────────────── */
  {
    topic:"Unit 7: Gravitation", difficulty:"Easy",
    question:"What happens to the gravitational force between two objects if the distance between them doubles?",
    choices:[{label:"A",text:"It doubles"},{label:"B",text:"It halves"},{label:"C",text:"It decreases to one-quarter"},{label:"D",text:"It stays the same"}],
    answer:"C",
    explanation:"F_g = Gm₁m₂/r². If r → 2r, then F → Gm₁m₂/(2r)² = F/4. The force decreases to one-quarter."
  },
  {
    topic:"Unit 7: Gravitation", difficulty:"Medium",
    question:"A satellite orbits Earth at radius r with speed v. If the orbit radius doubles to 2r, what is the new orbital speed?",
    choices:[{label:"A",text:"v/2"},{label:"B",text:"v/√2"},{label:"C",text:"v√2"},{label:"D",text:"2v"}],
    answer:"B",
    explanation:"Orbital speed: v = √(GM/r). If r → 2r, v_new = √(GM/2r) = v/√2 ≈ 0.707v."
  },
  {
    topic:"Unit 7: Gravitation", difficulty:"Medium",
    question:"A planet has twice Earth's mass and twice Earth's radius. How does its surface gravity compare to Earth's?",
    choices:[{label:"A",text:"g/4"},{label:"B",text:"g/2"},{label:"C",text:"g"},{label:"D",text:"2g"}],
    answer:"B",
    explanation:"g = GM/R². New g = G(2M)/(2R)² = 2GM/4R² = GM/2R² = g_Earth/2."
  },
  {
    topic:"Unit 7: Gravitation", difficulty:"Hard",
    question:"Kepler's Third Law states that T² ∝ r³ for planetary orbits. If Planet X has an orbital radius 4 times that of Earth, what is its orbital period compared to Earth's?",
    choices:[{label:"A",text:"4 years"},{label:"B",text:"8 years"},{label:"C",text:"16 years"},{label:"D",text:"64 years"}],
    answer:"B",
    explanation:"T² ∝ r³ → (T_X/T_E)² = (r_X/r_E)³ = 4³ = 64 → T_X/T_E = √64 = 8. Planet X takes 8 Earth-years."
  },
  {
    topic:"Unit 7: Gravitation", difficulty:"Hard",
    question:"A satellite is in a circular orbit. Which statement about the net work done on the satellite is correct?",
    choices:[{label:"A",text:"Work is positive because gravity accelerates it"},{label:"B",text:"Work is negative because the satellite loses energy"},{label:"C",text:"Net work is zero because gravity is perpendicular to velocity"},{label:"D",text:"Net work depends on orbital speed"}],
    answer:"C",
    explanation:"In a circular orbit, gravity always points toward the center, perpendicular to the tangential velocity. Since W = Fd cosθ and θ = 90°, net work = 0. Speed and KE remain constant."
  },

  /* ─── MIXED / AP EXAM STYLE ────────────────────────────── */
  {
    topic:"Unit 2: Forces & Newton's Laws", difficulty:"Hard",
    question:"Two blocks (A: 5 kg, B: 3 kg) are stacked on a frictionless surface. A horizontal force F pushes block A. The coefficient of static friction between A and B is 0.4. What is the maximum force F before B slides? (g = 10 m/s²)",
    choices:[{label:"A",text:"8 N"},{label:"B",text:"12.8 N"},{label:"C",text:"32 N"},{label:"D",text:"64 N"}],
    answer:"C",
    explanation:"Max friction on B = μmg = 0.4(3)(10) = 12 N. This gives max acceleration a = 12/3 = 4 m/s². Max F = (m_A + m_B) × a = 8 × 4 = 32 N."
  },
  {
    topic:"Unit 3: Work, Energy & Power", difficulty:"Hard",
    question:"A 2 kg block slides 4 m down a 30° incline with μk = 0.2. What is the work done by friction? (g = 10 m/s²)",
    choices:[{label:"A",text:"−6.9 J"},{label:"B",text:"−13.9 J"},{label:"C",text:"13.9 J"},{label:"D",text:"40 J"}],
    answer:"B",
    explanation:"F_N = mg cos30° = 2(10)(0.866) = 17.3 N. f_k = μF_N = 0.2(17.3) = 3.46 N. W_friction = −f_k × d = −3.46 × 4 = −13.9 J."
  },
  {
    topic:"Unit 1: Kinematics", difficulty:"Hard",
    question:"Two cars start at the same point. Car A moves east at 20 m/s; Car B moves north at 15 m/s. After 4 s, what is the distance between them?",
    choices:[{label:"A",text:"25 m"},{label:"B",text:"80 m"},{label:"C",text:"100 m"},{label:"D",text:"140 m"}],
    answer:"C",
    explanation:"After 4 s: Car A is 80 m east; Car B is 60 m north. Distance = √(80² + 60²) = √(6400 + 3600) = √10000 = 100 m."
  },
  {
    topic:"Unit 6: Oscillations", difficulty:"Hard",
    question:"A pendulum clock runs correctly on Earth (g = 9.8 m/s²). If taken to the Moon (g = 1.6 m/s²), how does it run?",
    choices:[{label:"A",text:"Faster, because there is less gravity"},{label:"B",text:"Slower, because T = 2π√(L/g) increases when g decreases"},{label:"C",text:"At the same rate; period depends only on length"},{label:"D",text:"Faster, because the Moon has less atmosphere"}],
    answer:"B",
    explanation:"T = 2π√(L/g). Since g_Moon < g_Earth, √(L/g_Moon) > √(L/g_Earth), so T increases and the clock runs slow."
  },
  {
    topic:"Unit 4: Momentum & Impulse", difficulty:"Hard",
    question:"An 80 kg astronaut at rest throws a 2 kg wrench at 15 m/s. What is the astronaut's recoil speed?",
    choices:[{label:"A",text:"0.25 m/s"},{label:"B",text:"0.375 m/s"},{label:"C",text:"0.5 m/s"},{label:"D",text:"15 m/s"}],
    answer:"B",
    explanation:"Conservation of momentum (initial p = 0): 0 = m_a × v_a + m_w × v_w → v_a = −(2 × 15)/80 = −30/80 = −0.375 m/s. Speed = 0.375 m/s."
  }
];
