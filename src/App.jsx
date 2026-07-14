import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080e1a;
    --surface:   #0f1829;
    --surface2:  #162035;
    --border:    #1e2d45;
    --primary:   #2dd4bf;
    --primary2:  #0ea5e9;
    --accent:    #7c3aed;
    --gold:      #f59e0b;
    --text:      #e2e8f0;
    --muted:     #64748b;
    --danger:    #ef4444;
    --radius:    14px;
    --font-display: 'Syne', sans-serif;
    --font-body:    'Inter', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

  .app { display: flex; flex-direction: column; min-height: 100vh; max-width: 430px; margin: 0 auto; position: relative; }

  /* NAV */
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(15,24,41,0.97); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; justify-content: space-around; padding: 8px 4px 20px; z-index: 100; }
  .nav-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; color: var(--muted); cursor: pointer; padding: 6px 10px; border-radius: 10px; transition: all .2s; font-family: var(--font-body); }
  .nav-btn.active { color: var(--primary); }
  .nav-btn svg { width: 22px; height: 22px; }
  .nav-btn span { font-size: 10px; font-weight: 500; }

  /* PAGES */
  .page { padding: 52px 20px 90px; min-height: 100vh; }
  .page-title { font-family: var(--font-display); font-size: 26px; font-weight: 800; margin-bottom: 4px; }
  .page-sub { color: var(--muted); font-size: 14px; margin-bottom: 24px; }

  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; margin-bottom: 14px; }
  .card-sm { background: var(--surface2); border-radius: 10px; padding: 14px; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; border-radius: 10px; border: none; font-family: var(--font-body); font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; }
  .btn-primary { background: linear-gradient(135deg, var(--primary), var(--primary2)); color: #000; }
  .btn-primary:hover { opacity: .9; transform: translateY(-1px); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
  .btn-ghost { background: transparent; color: var(--muted); border: none; }
  .btn-full { width: 100%; }
  .btn-danger { background: var(--danger); color: #fff; }
  .btn-gold { background: linear-gradient(135deg, var(--gold), #f97316); color: #000; }

  /* INPUTS */
  .input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color .2s; }
  .input:focus { border-color: var(--primary); }
  textarea.input { resize: vertical; min-height: 100px; }
  .label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; display: block; }

  /* TAGS */
  .tag { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .tag-teal { background: rgba(45,212,191,.15); color: var(--primary); }
  .tag-purple { background: rgba(124,58,237,.15); color: #a78bfa; }
  .tag-gold { background: rgba(245,158,11,.15); color: var(--gold); }

  /* GRID */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

  /* STAT CARD */
  .stat { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; text-align: center; }
  .stat-val { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--primary); }
  .stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* MOOD SLIDER */
  .mood-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .mood-dot { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border); background: var(--surface2); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: var(--muted); transition: all .15s; }
  .mood-dot.sel { border-color: var(--primary); background: rgba(45,212,191,.2); color: var(--primary); }

  /* BREATHING CIRCLE */
  .breath-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0; gap: 24px; }
  .breath-circle { width: 180px; height: 180px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 600; color: var(--text); transition: transform 1s ease-in-out, background .5s; background: radial-gradient(circle, rgba(45,212,191,.3), rgba(14,165,233,.1)); border: 2px solid rgba(45,212,191,.4); }
  .breath-circle.expand { transform: scale(1.4); }
  .breath-circle.hold { transform: scale(1.4); }
  .breath-circle.shrink { transform: scale(1); }
  .breath-label { font-size: 22px; font-weight: 700; color: var(--primary); }
  .breath-count { font-size: 48px; font-weight: 800; font-family: var(--font-display); color: var(--text); }

  /* CHAT */
  .coach-page { display: flex; flex-direction: column; height: 100vh; padding: 52px 0 0; }
  .coach-header { padding: 0 20px 12px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 16px 20px; }
  .msg { max-width: 82%; padding: 12px 14px; border-radius: 14px; font-size: 14px; line-height: 1.5; }
  .msg-ai { background: var(--surface2); border: 1px solid var(--border); color: var(--text); align-self: flex-start; border-bottom-left-radius: 4px; }
  .msg-user { background: linear-gradient(135deg, var(--primary), var(--primary2)); color: #000; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
  .chat-input-row { display: flex; gap: 8px; padding: 12px 20px 90px; border-top: 1px solid var(--border); flex-shrink: 0; background: var(--bg); }
  .chat-input-row .input { flex: 1; }

  /* PROGRESS BAR */
  .prog-bar { height: 6px; border-radius: 3px; background: var(--border); overflow: hidden; margin-top: 6px; }
  .prog-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--primary), var(--primary2)); transition: width .4s; }

  /* AFFIRMATION CARD */
  .affirm-card { background: linear-gradient(135deg, var(--surface), var(--surface2)); border: 1px solid var(--border); border-radius: 18px; padding: 32px 24px; text-align: center; min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; transition: transform .2s; }
  .affirm-text { font-size: 20px; font-weight: 700; line-height: 1.4; }
  .affirm-nav { display: flex; justify-content: center; gap: 12px; margin-top: 8px; }

  /* PREMIUM BADGE */
  .premium-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; background: linear-gradient(135deg, var(--gold), #f97316); border-radius: 20px; font-size: 10px; font-weight: 700; color: #000; }

  /* AUTH */
  .auth-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background: var(--bg); }
  .auth-logo { font-family: var(--font-display); font-size: 36px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--primary2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
  .auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 28px 24px; width: 100%; max-width: 380px; }

  /* MISC */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .row { display: flex; align-items: center; justify-content: space-between; }
  .col { display: flex; flex-direction: column; gap: 4px; }
  .mt4 { margin-top: 4px; } .mt8 { margin-top: 8px; } .mt12 { margin-top: 12px; } .mt16 { margin-top: 16px; } .mt24 { margin-top: 24px; }
  .mb8 { margin-bottom: 8px; } .mb12 { margin-bottom: 12px; } .mb16 { margin-bottom: 16px; }
  .text-sm { font-size: 13px; } .text-xs { font-size: 11px; } .text-muted { color: var(--muted); }
  .text-primary { color: var(--primary); } .text-gold { color: var(--gold); }
  .fw600 { font-weight: 600; } .fw700 { font-weight: 700; }
  .flex { display: flex; } .gap8 { gap: 8px; } .gap12 { gap: 12px; } .items-center { align-items: center; }
  .locked { opacity: .5; pointer-events: none; }
  .pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .pill { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface2); font-size: 13px; cursor: pointer; transition: all .15s; }
  .pill.active { border-color: var(--primary); color: var(--primary); background: rgba(45,212,191,.1); }
  .hero-glow { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(45,212,191,.12), transparent 70%); pointer-events: none; }
  select.input option { background: var(--surface2); }
  .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: var(--surface2); border: 1px solid var(--primary); color: var(--text); padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; z-index: 999; animation: fadeIn .3s; }
  @keyframes fadeIn { from { opacity:0; transform: translateX(-50%) translateY(-10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .chart-bar-wrap { display: flex; align-items: flex-end; gap: 6px; height: 120px; }
  .chart-bar { flex: 1; border-radius: 4px 4px 0 0; background: linear-gradient(180deg, var(--primary), var(--primary2)); min-height: 4px; transition: height .4s; }
  .chart-label { font-size: 10px; color: var(--muted); text-align: center; margin-top: 4px; }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const SPORTS = ["Basketball","Soccer","Football","Baseball","Tennis","Swimming","Track & Field","Volleyball","Wrestling","Golf","Gymnastics","Hockey","Lacrosse","Rugby","Softball","Cross Country","Cycling","Rowing","Boxing","MMA","Skiing","Surfing","Cheerleading","Dance","Other"];

const AFFIRMATIONS = {
  Confidence: ["I perform at my best when it matters most.", "I trust my training and my instincts.", "I belong at this level.", "My confidence grows with every rep.", "I am prepared for this moment."],
  Resilience: ["Setbacks are setups for comebacks.", "I get stronger through adversity.", "One bad play doesn't define my game.", "I bounce back faster every time.", "I am tougher than any challenge I face."],
  Focus: ["I control what I can control.", "My attention is my superpower.", "I stay present, one play at a time.", "Distractions don't live in my zone.", "I lock in when it counts."],
  Teamwork: ["My teammates make me better.", "We win together, we grow together.", "I lift those around me.", "Trust in my team is strength.", "We are stronger as one."],
  "Pre-Game": ["Game time is my time.", "I've put in the work — now I perform.", "My body is ready. My mind is locked.", "I thrive under pressure.", "This is what I trained for."],
};

const BREATHING = [
  { name: "Box Breathing", desc: "4-4-4-4 rhythm for calm focus", steps: ["Inhale", "Hold", "Exhale", "Hold"], times: [4,4,4,4], color: "#2dd4bf" },
  { name: "4-7-8 Relaxation", desc: "Deep calm before competition", steps: ["Inhale", "Hold", "Exhale", ""], times: [4,7,8,0], color: "#7c3aed" },
  { name: "Power Breath", desc: "Energize before big moments", steps: ["Inhale", "Exhale", "Hold", ""], times: [2,2,4,0], color: "#f59e0b" },
];

const MEDITATIONS = [
  { title: "Pre-Game Visualization", duration: "10 min", desc: "See your success before it happens.", steps: ["Find a comfortable seated position and close your eyes.", "Take 3 deep breaths, releasing tension with each exhale.", "Visualize yourself arriving at your competition. Feel the energy.", "See yourself warming up with confidence and ease.", "Picture the key moments — executing your skills perfectly.", "Feel the emotions: focus, power, calm certainty.", "Bring that feeling back with you as you open your eyes."] },
  { title: "Focus Reset", duration: "5 min", desc: "Clear your mind between performances.", steps: ["Close your eyes and take one long slow breath.", "Scan your body — release any tension you find.", "Picture a blank white canvas in your mind.", "When a thought appears, note it and let it drift away.", "Return to your breath. You are here. You are ready."] },
  { title: "Recovery & Rest", duration: "15 min", desc: "Restore your body and mind after effort.", steps: ["Lie down in a comfortable position.", "Starting at your feet, consciously relax each muscle group.", "Work slowly upward — calves, thighs, hips, core, chest.", "Let your arms go heavy. Your shoulders. Your jaw.", "Breathe naturally. You did the work. Now you restore."] },
];

const SELF_TALK_PATTERNS = [
  { negative: "I always choke under pressure", reframe: "Pressure is a privilege — it means I'm competing for something real. I've handled pressure before and I will again." },
  { negative: "I'm not good enough to be here", reframe: "I earned my place here through work. Every competitor has doubts. My presence is proof of my ability." },
  { negative: "I made a mistake, now everything is ruined", reframe: "One mistake is one moment. Elite performers make errors and refocus. What's my next play?" },
  { negative: "Everyone is watching me fail", reframe: "People are focused on their own experience. And even if they watch, I perform for myself — not for their approval." },
  { negative: "I can't do this", reframe: "I haven't done it yet in this moment. I have the skills. I take one step at a time." },
];

// ── STORAGE ───────────────────────────────────────────────────────────────────
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 22, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.66z",
  wind: "M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2 M9.6 4.6A2 2 0 1 1 11 8H2 M12.6 19.4A2 2 0 1 0 14 16H2",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  trend: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  plus: "M12 5v14 M5 12h14",
  send: "M22 2L11 13 M22 2L15 22 8 13 2 9z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  crown: "M2 20h20 M4 20L6 9l6 5 6-9 6 9 2 11",
  chevLeft: "M15 18l-6-6 6-6",
  chevRight: "M9 18l6-6-6-6",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const users = store.get("mg_users") || {};

  const submit = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        const u = users[email];
        if (!u || u.pass !== pass) return setErr("Invalid email or password.");
        store.set("mg_session", { email, name: u.name, sport: u.sport, premium: u.premium || false });
        onAuth({ email, name: u.name, sport: u.sport, premium: u.premium || false });
      } else {
        if (!email || !pass || !name || !sport) return setErr("All fields required.");
        if (users[email]) return setErr("Account already exists.");
        users[email] = { pass, name, sport, premium: false };
        store.set("mg_users", users);
        store.set("mg_session", { email, name, sport, premium: false });
        onAuth({ email, name, sport, premium: false });
      }
    }, 600);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-logo">MindGame</div>
      <p className="text-muted text-sm mb16" style={{textAlign:"center"}}>Sports Mental Performance</p>
      <div className="auth-card">
        <div className="flex gap8 mb16">
          {["login","signup"].map(m => (
            <button key={m} className={`btn btn-outline ${mode===m?"btn-primary":""}`} style={{flex:1,padding:"8px"}} onClick={()=>setMode(m)}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>
        {mode === "signup" && <>
          <label className="label">Display Name</label>
          <input className="input mb12" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          <label className="label">Your Sport</label>
          <select className="input mb12" value={sport} onChange={e=>setSport(e.target.value)}>
            <option value="">Select sport...</option>
            {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </>}
        <label className="label">Email</label>
        <input className="input mb12" type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="label">Password</label>
        <input className="input mb16" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        {err && <p style={{color:"var(--danger)",fontSize:13,marginBottom:12}}>{err}</p>}
        <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
          {loading ? <div className="spinner"/> : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({ user, onNav, onToast }) {
  const sessions = store.get(`mg_sessions_${user.email}`) || [];
  const journals = store.get(`mg_journals_${user.email}`) || [];
  const streak = store.get(`mg_streak_${user.email}`) || 0;

  const tools = [
    { label: "Pre-Game", icon: "flame", page: "pregame", color: "#f59e0b" },
    { label: "Meditation", icon: "brain", page: "meditation", color: "#7c3aed" },
    { label: "Breathing", icon: "wind", page: "breathing", color: "#2dd4bf" },
    { label: "Affirmations", icon: "heart", page: "affirmations", color: "#ec4899" },
    { label: "Recovery", icon: "refresh", page: "recovery", color: "#0ea5e9" },
    { label: "Self-Talk", icon: "message", page: "selftalk", color: "#10b981" },
    { label: "Journal", icon: "book", page: "journal", color: "#8b5cf6" },
    { label: "Practice Log", icon: "trend", page: "practice", color: "#10b981" },
    { label: "AI Coach", icon: "star", page: "coach", color: "#f59e0b", premium: true },
  ];

  return (
    <div className="page" style={{position:"relative",overflow:"hidden"}}>
      <div className="hero-glow"/>
      <div className="mb16">
        <p className="text-muted text-sm">Good to see you,</p>
        <h1 className="page-title" style={{fontSize:30}}>{user.name} 👋</h1>
        <div className="flex gap8 items-center mt4">
          <span className="tag tag-teal">{user.sport}</span>
          {user.premium && <span className="premium-badge">⭐ Premium</span>}
        </div>
      </div>

      <div className="grid3 mb16">
        <div className="stat"><div className="stat-val">{streak}</div><div className="stat-label">Day Streak</div></div>
        <div className="stat"><div className="stat-val">{sessions.length}</div><div className="stat-label">Sessions</div></div>
        <div className="stat"><div className="stat-val">{journals.length}</div><div className="stat-label">Entries</div></div>
      </div>

      <h2 className="fw600 mb12" style={{fontSize:16}}>Mental Tools</h2>
      <div className="grid2">
        {tools.map(t => (
          <button key={t.page} className="card" style={{textAlign:"left",cursor:"pointer",border:`1px solid var(--border)`,position:"relative"}} onClick={()=>onNav(t.page)}>
            {t.premium && !user.premium && <span className="premium-badge" style={{position:"absolute",top:10,right:10}}>PRO</span>}
            <div style={{width:38,height:38,borderRadius:10,background:`${t.color}22`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
              <Icon d={Icons[t.icon]} size={20} stroke={t.color}/>
            </div>
            <div className="fw600 text-sm">{t.label}</div>
          </button>
        ))}
      </div>

      {!user.premium && (
        <div className="card mt16" style={{background:"linear-gradient(135deg,rgba(245,158,11,.1),rgba(249,115,22,.05))",border:"1px solid rgba(245,158,11,.3)"}}>
          <div className="row">
            <div>
              <div className="fw700 text-gold">Unlock Premium</div>
              <div className="text-sm text-muted mt4">AI Coach + advanced insights</div>
            </div>
            <button className="btn btn-gold" style={{padding:"8px 16px",fontSize:13}} onClick={()=>onNav("premium")}>$4.99/mo</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PRE-GAME ──────────────────────────────────────────────────────────────────
function PreGamePage({ user, onToast }) {
  const [active, setActive] = useState(null);
  const [step, setStep] = useState(0);

  const routines = [
    { title: "Full Prep (20 min)", steps: ["Sit quietly and close your eyes. Take 5 slow deep breaths.", "Visualize the venue. See it clearly — the lights, the sounds, the feel.", "Recall your best recent performance. Feel how it felt.", "Set your intention for today: one word that describes how you'll compete.", "Run through your warm-up in your mind, executing every movement perfectly.", "Name 3 things you're grateful for about this competition.", "Open your eyes. Say your power word out loud. You are ready."] },
    { title: "Quick Focus (5 min)", steps: ["Take 3 box breaths: inhale 4, hold 4, exhale 4, hold 4.", "Close your eyes. Picture yourself making your first big play successfully.", "Say your affirmation: 'I am prepared. I am focused. I perform.'", "Open your eyes. Channel the energy. Let's go."] },
  ];

  const logSession = () => {
    const sessions = store.get(`mg_sessions_${user.email}`) || [];
    sessions.push({ type: "pre_game", date: new Date().toISOString() });
    store.set(`mg_sessions_${user.email}`, sessions);
    onToast("Session logged! 🔥");
    setActive(null); setStep(0);
  };

  if (active !== null) {
    const r = routines[active];
    const done = step >= r.steps.length;
    return (
      <div className="page">
        <button className="btn btn-ghost mb12" onClick={()=>{setActive(null);setStep(0);}}><Icon d={Icons.chevLeft} size={18}/> Back</button>
        <h1 className="page-title">{r.title}</h1>
        <div className="prog-bar mb16"><div className="prog-fill" style={{width:`${((step)/r.steps.length)*100}%`}}/></div>
        {!done ? (
          <>
            <div className="card" style={{minHeight:160,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
              <div>
                <div className="tag tag-teal mb12">Step {step+1} of {r.steps.length}</div>
                <p style={{fontSize:17,fontWeight:600,lineHeight:1.5}}>{r.steps[step]}</p>
              </div>
            </div>
            <button className="btn btn-primary btn-full mt16" onClick={()=>setStep(s=>s+1)}>Next</button>
          </>
        ) : (
          <div className="card" style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:48}}>🏆</div>
            <h2 className="fw700 mt12">Routine Complete!</h2>
            <p className="text-muted text-sm mt8">You're mentally prepared. Go compete.</p>
            <button className="btn btn-primary btn-full mt16" onClick={logSession}>Log This Session</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Pre-Game Prep</h1>
      <p className="page-sub">Get your mind competition-ready</p>
      {routines.map((r,i) => (
        <div key={i} className="card" style={{cursor:"pointer"}} onClick={()=>setActive(i)}>
          <div className="row">
            <div><div className="fw700">{r.title}</div><div className="text-sm text-muted mt4">{r.steps.length} steps</div></div>
            <Icon d={Icons.chevRight} stroke="var(--primary)"/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MEDITATION ────────────────────────────────────────────────────────────────
function MeditationPage({ user, onToast }) {
  const [active, setActive] = useState(null);
  const [step, setStep] = useState(0);

  const logSession = () => {
    const sessions = store.get(`mg_sessions_${user.email}`) || [];
    sessions.push({ type: "meditation", date: new Date().toISOString() });
    store.set(`mg_sessions_${user.email}`, sessions);
    onToast("Meditation logged 🧘");
    setActive(null); setStep(0);
  };

  if (active !== null) {
    const m = MEDITATIONS[active];
    const done = step >= m.steps.length;
    return (
      <div className="page">
        <button className="btn btn-ghost mb12" onClick={()=>{setActive(null);setStep(0);}}><Icon d={Icons.chevLeft} size={18}/> Back</button>
        <h1 className="page-title">{m.title}</h1>
        <div className="prog-bar mb16"><div className="prog-fill" style={{width:`${(step/m.steps.length)*100}%`}}/></div>
        {!done ? (
          <>
            <div className="breath-wrap" style={{paddingTop:20}}>
              <div className="breath-circle"><span style={{textAlign:"center",padding:"0 16px"}}>{m.steps[step]}</span></div>
            </div>
            <div className="tag tag-purple" style={{display:"block",textAlign:"center",margin:"0 auto 16px"}}>{step+1} / {m.steps.length}</div>
            <button className="btn btn-primary btn-full" onClick={()=>setStep(s=>s+1)}>Continue</button>
          </>
        ) : (
          <div className="card" style={{textAlign:"center",padding:32}}>
            <div style={{fontSize:48}}>🌊</div>
            <h2 className="fw700 mt12">Session Complete</h2>
            <p className="text-muted text-sm mt8">Your mind is clear and focused.</p>
            <button className="btn btn-primary btn-full mt16" onClick={logSession}>Log Session</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Meditation</h1>
      <p className="page-sub">Guided sessions for focus and calm</p>
      {MEDITATIONS.map((m,i) => (
        <div key={i} className="card" style={{cursor:"pointer"}} onClick={()=>setActive(i)}>
          <div className="row">
            <div><div className="fw700">{m.title}</div><div className="text-sm text-muted mt4">{m.duration} · {m.desc}</div></div>
            <Icon d={Icons.chevRight} stroke="var(--primary)"/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── BREATHING ─────────────────────────────────────────────────────────────────
function BreathingPage({ user, onToast }) {
  const [active, setActive] = useState(null);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);

  const ex = active !== null ? BREATHING[active] : null;

  useEffect(() => {
    if (!running || !ex) return;
    const phase = ex.steps[phaseIdx];
    const duration = ex.times[phaseIdx];
    if (!phase || duration === 0) {
      setPhaseIdx(p => (p+1) % ex.steps.filter(s=>s).length);
      return;
    }
    setCount(duration);
    timerRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          const nextIdx = (phaseIdx+1) % ex.steps.length;
          setPhaseIdx(nextIdx);
          if (nextIdx === 0) setCycles(c2=>c2+1);
          return 0;
        }
        return c-1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, phaseIdx, active]);

  const stop = () => {
    setRunning(false); clearInterval(timerRef.current);
    setPhaseIdx(0); setCount(0);
    if (cycles > 0) {
      const sessions = store.get(`mg_sessions_${user.email}`) || [];
      sessions.push({ type: "breathing", date: new Date().toISOString(), cycles });
      store.set(`mg_sessions_${user.email}`, sessions);
      onToast(`${cycles} cycles logged 💨`);
    }
    setCycles(0);
  };

  const phaseLabels = ["Inhale","Hold","Exhale","Hold"];
  const circleClass = ex && running ? (phaseIdx===0||phaseIdx===1?"expand":"shrink") : "";

  if (active !== null) return (
    <div className="page">
      <button className="btn btn-ghost mb12" onClick={()=>{stop();setActive(null);}}><Icon d={Icons.chevLeft} size={18}/> Back</button>
      <h1 className="page-title">{ex.name}</h1>
      <p className="page-sub">{ex.desc}</p>
      <div className="breath-wrap">
        <div className="breath-label">{running ? (ex.steps[phaseIdx] || "...") : "Ready"}</div>
        <div className={`breath-circle ${circleClass}`} style={{borderColor:ex.color,background:`radial-gradient(circle, ${ex.color}33, ${ex.color}11)`}}>
          <span className="breath-count">{running ? count : "GO"}</span>
        </div>
        <div className="text-muted text-sm">{cycles} cycles completed</div>
      </div>
      <button className={`btn btn-full ${running?"btn-danger":"btn-primary"}`} onClick={()=>running?stop():setRunning(true)}>
        {running ? "Stop" : "Start"}
      </button>
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Breathing</h1>
      <p className="page-sub">Regulate your nervous system</p>
      {BREATHING.map((b,i) => (
        <div key={i} className="card" style={{cursor:"pointer",borderLeft:`3px solid ${b.color}`}} onClick={()=>setActive(i)}>
          <div className="row">
            <div><div className="fw700">{b.name}</div><div className="text-sm text-muted mt4">{b.desc}</div></div>
            <Icon d={Icons.chevRight} stroke={b.color}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AFFIRMATIONS ──────────────────────────────────────────────────────────────
function AffirmationsPage({ user, onToast }) {
  const [cat, setCat] = useState("Confidence");
  const [idx, setIdx] = useState(0);
  const [favs, setFavs] = useState(store.get(`mg_favs_${user.email}`) || []);

  const cards = AFFIRMATIONS[cat];
  const card = cards[idx % cards.length];
  const isFav = favs.includes(card);

  const toggleFav = () => {
    const next = isFav ? favs.filter(f=>f!==card) : [...favs, card];
    setFavs(next); store.set(`mg_favs_${user.email}`, next);
    onToast(isFav ? "Removed from favorites" : "Added to favorites ⭐");
  };

  return (
    <div className="page">
      <h1 className="page-title">Affirmations</h1>
      <p className="page-sub">Build your champion mindset</p>
      <div className="pill-row">
        {Object.keys(AFFIRMATIONS).map(c => (
          <button key={c} className={`pill ${cat===c?"active":""}`} onClick={()=>{setCat(c);setIdx(0);}}>{c}</button>
        ))}
      </div>
      <div className="affirm-card">
        <div style={{fontSize:36}}>💬</div>
        <p className="affirm-text">"{card}"</p>
        <button className="btn btn-ghost" onClick={toggleFav} style={{color:isFav?"var(--gold)":"var(--muted)"}}>
          <Icon d={Icons.star} size={18} fill={isFav?"var(--gold)":"none"} stroke={isFav?"var(--gold)":"var(--muted)"}/> {isFav?"Saved":"Save"}
        </button>
      </div>
      <div className="affirm-nav mt16">
        <button className="btn btn-outline" onClick={()=>setIdx(i=>i-1)} disabled={idx===0}><Icon d={Icons.chevLeft} size={18}/></button>
        <span className="text-muted text-sm" style={{padding:"0 12px",lineHeight:"36px"}}>{(idx%cards.length)+1} / {cards.length}</span>
        <button className="btn btn-outline" onClick={()=>setIdx(i=>i+1)} disabled={idx>=cards.length-1}><Icon d={Icons.chevRight} size={18}/></button>
      </div>
      {favs.length > 0 && (
        <div className="mt24">
          <h2 className="fw600 mb12" style={{fontSize:15}}>Your Favorites</h2>
          {favs.map((f,i) => <div key={i} className="card-sm mb8 text-sm">"{f}"</div>)}
        </div>
      )}
    </div>
  );
}

// ── RECOVERY ──────────────────────────────────────────────────────────────────
function RecoveryPage({ user, onToast }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const prompts = [
    { q: "What happened today that was tough?", key: "what" },
    { q: "How are you feeling about it right now?", key: "feeling" },
    { q: "What's one thing you actually did well today?", key: "well" },
    { q: "What's one thing this experience taught you?", key: "lesson" },
    { q: "What's your next action to move forward?", key: "action" },
  ];

  const save = () => {
    const journals = store.get(`mg_journals_${user.email}`) || [];
    journals.push({ type:"recovery", date: new Date().toISOString(), content: JSON.stringify(answers), title: "Recovery Entry" });
    store.set(`mg_journals_${user.email}`, journals);
    onToast("Recovery entry saved 💪");
    setStep(0); setAnswers({});
  };

  const done = step >= prompts.length;

  return (
    <div className="page">
      <h1 className="page-title">Recovery</h1>
      <p className="page-sub">Process setbacks and bounce back stronger</p>
      {!done ? (
        <>
          <div className="prog-bar mb16"><div className="prog-fill" style={{width:`${(step/prompts.length)*100}%`}}/></div>
          <div className="card mb12">
            <div className="tag tag-teal mb12">Prompt {step+1} of {prompts.length}</div>
            <p className="fw600" style={{fontSize:16,marginBottom:14}}>{prompts[step].q}</p>
            <textarea className="input" rows={4} placeholder="Write freely..." value={answers[prompts[step].key]||""} onChange={e=>setAnswers(a=>({...a,[prompts[step].key]:e.target.value}))}/>
          </div>
          <div className="flex gap8">
            {step>0 && <button className="btn btn-outline" onClick={()=>setStep(s=>s-1)}>Back</button>}
            <button className="btn btn-primary" style={{flex:1}} onClick={()=>setStep(s=>s+1)}>Next</button>
          </div>
        </>
      ) : (
        <div className="card" style={{textAlign:"center",padding:32}}>
          <div style={{fontSize:48}}>🌱</div>
          <h2 className="fw700 mt12">Reflection Complete</h2>
          <p className="text-muted text-sm mt8">You've processed this setback with intention. That's what champions do.</p>
          <button className="btn btn-primary btn-full mt16" onClick={save}>Save Entry</button>
          <button className="btn btn-ghost btn-full mt8" onClick={()=>{setStep(0);setAnswers({});}}>Start Over</button>
        </div>
      )}
    </div>
  );
}

// ── SELF-TALK ─────────────────────────────────────────────────────────────────
function SelfTalkPage() {
  const [revealed, setRevealed] = useState({});
  const [custom, setCustom] = useState("");
  const [reframe, setReframe] = useState("");
  const [loading, setLoading] = useState(false);

  const getReframe = async () => {
    if (!custom.trim()) return;
    setLoading(true); setReframe("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: `As a sports psychologist, reframe this negative self-talk into a powerful, constructive thought an elite athlete would use. Keep it authentic and under 2 sentences.\n\nNegative thought: "${custom}"` }]
        })
      });
      const data = await res.json();
      setReframe(data.content?.[0]?.text || "Try rephrasing and try again.");
    } catch { setReframe("Could not connect. Check your connection."); }
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">Self-Talk</h1>
      <p className="page-sub">Flip negative patterns into fuel</p>

      <h2 className="fw600 mb12" style={{fontSize:15}}>Common Patterns</h2>
      {SELF_TALK_PATTERNS.map((p,i) => (
        <div key={i} className="card mb12">
          <div className="flex gap8 items-center mb8">
            <span className="tag" style={{background:"rgba(239,68,68,.15)",color:"#f87171"}}>Negative</span>
          </div>
          <p className="text-sm fw600 mb12">"{p.negative}"</p>
          {revealed[i] ? (
            <>
              <div className="divider"/>
              <div className="flex gap8 items-center mb8"><span className="tag tag-teal">Reframe</span></div>
              <p className="text-sm">{p.reframe}</p>
            </>
          ) : (
            <button className="btn btn-outline" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setRevealed(r=>({...r,[i]:true}))}>Reveal Reframe</button>
          )}
        </div>
      ))}

      <div className="card mt16" style={{border:"1px solid rgba(45,212,191,.3)"}}>
        <div className="fw700 mb4">AI Reframe Tool</div>
        <p className="text-sm text-muted mb12">Type any negative thought — get an instant reframe</p>
        <textarea className="input mb12" rows={3} placeholder="I always mess up under pressure..." value={custom} onChange={e=>setCustom(e.target.value)}/>
        <button className="btn btn-primary btn-full" onClick={getReframe} disabled={loading}>
          {loading ? <><div className="spinner"/>Thinking...</> : "Get My Reframe"}
        </button>
        {reframe && (
          <div className="card-sm mt12" style={{background:"rgba(45,212,191,.08)",border:"1px solid rgba(45,212,191,.2)"}}>
            <div className="tag tag-teal mb8">Your Reframe</div>
            <p className="text-sm fw600">"{reframe}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── JOURNAL ───────────────────────────────────────────────────────────────────
function JournalPage({ user, onToast }) {
  const [view, setView] = useState("list");
  const [entries, setEntries] = useState(store.get(`mg_journals_${user.email}`) || []);
  const [form, setForm] = useState({ type:"general", title:"", content:"", mood_before:null, mood_after:null });

  const save = () => {
    if (!form.title || !form.content) return onToast("Add a title and content");
    const next = [...entries, { ...form, date: new Date().toISOString(), id: Date.now() }];
    setEntries(next); store.set(`mg_journals_${user.email}`, next);
    onToast("Journal entry saved 📓");
    setForm({ type:"general", title:"", content:"", mood_before:null, mood_after:null });
    setView("list");
  };

  const typeColors = { pre_game:"#f59e0b", post_game:"#0ea5e9", recovery:"#10b981", self_talk:"#8b5cf6", general:"#64748b" };

  return (
    <div className="page">
      <div className="row mb16">
        <h1 className="page-title" style={{marginBottom:0}}>Journal</h1>
        <button className="btn btn-primary" style={{padding:"8px 16px",fontSize:13}} onClick={()=>setView(v=>v==="list"?"new":"list")}>
          {view==="list" ? <><Icon d={Icons.plus} size={16}/>New</> : "Cancel"}
        </button>
      </div>

      {view === "new" ? (
        <>
          <label className="label">Entry Type</label>
          <select className="input mb12" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
            {["general","pre_game","post_game","recovery","self_talk"].map(t=><option key={t} value={t}>{t.replace("_"," ")}</option>)}
          </select>
          <label className="label">Title</label>
          <input className="input mb12" placeholder="Give this entry a name..." value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          <label className="label">Mood Before (1-10)</label>
          <div className="mood-row mb12">{Array.from({length:10},(_,i)=><button key={i+1} className={`mood-dot ${form.mood_before===i+1?"sel":""}`} onClick={()=>setForm(f=>({...f,mood_before:i+1}))}>{i+1}</button>)}</div>
          <label className="label">Entry</label>
          <textarea className="input mb12" rows={5} placeholder="Write your thoughts..." value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))}/>
          <label className="label">Mood After (1-10)</label>
          <div className="mood-row mb16">{Array.from({length:10},(_,i)=><button key={i+1} className={`mood-dot ${form.mood_after===i+1?"sel":""}`} onClick={()=>setForm(f=>({...f,mood_after:i+1}))}>{i+1}</button>)}</div>
          <button className="btn btn-primary btn-full" onClick={save}>Save Entry</button>
        </>
      ) : entries.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}>
          <div style={{fontSize:48}}>📓</div>
          <p className="mt12">No entries yet. Start your mental journey.</p>
        </div>
      ) : (
        [...entries].reverse().map((e,i) => (
          <div key={i} className="card" style={{borderLeft:`3px solid ${typeColors[e.type]||"#64748b"}`}}>
            <div className="row mb8">
              <span className="fw600 text-sm">{e.title}</span>
              <span className="text-xs text-muted">{new Date(e.date).toLocaleDateString()}</span>
            </div>
            <span className="tag" style={{background:`${typeColors[e.type]}22`,color:typeColors[e.type],fontSize:10,marginBottom:8,display:"inline-block"}}>{e.type.replace("_"," ")}</span>
            <p className="text-sm text-muted" style={{marginTop:4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{e.content}</p>
            {(e.mood_before||e.mood_after) && (
              <div className="flex gap8 mt8">
                {e.mood_before && <span className="text-xs text-muted">Before: <span style={{color:"var(--primary)"}}>{e.mood_before}/10</span></span>}
                {e.mood_after && <span className="text-xs text-muted">After: <span style={{color:"var(--primary)"}}>{e.mood_after}/10</span></span>}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ── PROGRESS ──────────────────────────────────────────────────────────────────
function ProgressPage({ user }) {
  const sessions = store.get(`mg_sessions_${user.email}`) || [];
  const journals = store.get(`mg_journals_${user.email}`) || [];

  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    const key = d.toDateString();
    const count = sessions.filter(s=>new Date(s.date).toDateString()===key).length;
    return { label: ["Su","Mo","Tu","We","Th","Fr","Sa"][d.getDay()], count };
  });
  const maxCount = Math.max(...last7.map(d=>d.count),1);

  const typeCount = {};
  sessions.forEach(s => { typeCount[s.type] = (typeCount[s.type]||0)+1; });

  const moods = journals.filter(j=>j.mood_before).map(j=>j.mood_before);
  const avgMood = moods.length ? (moods.reduce((a,b)=>a+b,0)/moods.length).toFixed(1) : "—";

  return (
    <div className="page">
      <h1 className="page-title">Progress</h1>
      <p className="page-sub">Your mental fitness journey</p>

      <div className="grid2 mb16">
        <div className="stat"><div className="stat-val">{sessions.length}</div><div className="stat-label">Total Sessions</div></div>
        <div className="stat"><div className="stat-val">{avgMood}</div><div className="stat-label">Avg Mood</div></div>
      </div>

      <div className="card mb14">
        <div className="fw600 mb12">Last 7 Days</div>
        <div className="chart-bar-wrap">
          {last7.map((d,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>
              <div className="chart-bar" style={{height:`${(d.count/maxCount)*100}%`,width:"100%",opacity:d.count===0?.2:1}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:6}}>
          {last7.map((d,i)=><div key={i} className="chart-label" style={{flex:1}}>{d.label}</div>)}
        </div>
      </div>

      <div className="card mb14">
        <div className="fw600 mb12">Sessions by Type</div>
        {Object.entries(typeCount).length === 0 ? (
          <p className="text-sm text-muted">No sessions yet.</p>
        ) : Object.entries(typeCount).map(([type,count])=>(
          <div key={type} className="mb8">
            <div className="row mb4"><span className="text-sm">{type.replace("_"," ")}</span><span className="text-sm text-primary fw600">{count}</span></div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(count/sessions.length)*100}%`}}/></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="fw600 mb12">Journal Mood Trend</div>
        {journals.filter(j=>j.mood_before).length === 0 ? (
          <p className="text-sm text-muted">Log journal entries with mood to see trends.</p>
        ) : (
          <div className="chart-bar-wrap">
            {journals.filter(j=>j.mood_before).slice(-10).map((j,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>
                <div className="chart-bar" style={{height:`${(j.mood_before/10)*100}%`,width:"100%",background:"linear-gradient(180deg,#7c3aed,#a78bfa)"}}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── AI COACH ──────────────────────────────────────────────────────────────────
function CoachPage({ user, onToast }) {
  const [msgs, setMsgs] = useState([
    { role:"assistant", text:`Hey ${user.name}! I'm Dr. Mind, your personal sports psychologist. I'm here to help you with any mental challenges you're facing — nerves, focus, confidence, recovery from tough losses, or anything else on your mind. What's going on?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    setMsgs(m=>[...m,{role:"user",text:userMsg}]);
    setLoading(true);

    const journals = store.get(`mg_journals_${user.email}`) || [];
    const sessions = store.get(`mg_sessions_${user.email}`) || [];
    const context = `Athlete: ${user.name}, Sport: ${user.sport}. Recent sessions: ${sessions.length}. Recent journal entries: ${journals.slice(-3).map(j=>j.title+": "+j.content?.slice(0,100)).join("; ")}`;

    try {
      const history = msgs.map(m=>({ role: m.role==="assistant"?"assistant":"user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:`You are Dr. Mind, an empathetic and highly skilled sports psychologist and mental performance coach. You help athletes with focus, confidence, anxiety, recovery from setbacks, and peak mental performance. You use evidence-based techniques from sports psychology. Be warm, specific, and practical. Context about this athlete: ${context}`,
          messages:[...history,{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting. Please try again.";
      setMsgs(m=>[...m,{role:"assistant",text:reply}]);
    } catch { setMsgs(m=>[...m,{role:"assistant",text:"Connection issue. Please try again."}]); }
    setLoading(false);
  };

  return (
    <div className="coach-page">
      <div className="coach-header">
        <div className="row">
          <div>
            <h1 className="page-title" style={{marginBottom:2}}>Dr. Mind</h1>
            <p className="text-xs text-muted">Your AI Sports Psychologist</p>
          </div>
          <span className="premium-badge">⭐ Premium</span>
        </div>
      </div>
      <div className="chat-messages">
        {msgs.map((m,i)=>(
          <div key={i} className={`msg ${m.role==="assistant"?"msg-ai":"msg-user"}`}>{m.text}</div>
        ))}
        {loading && <div className="msg msg-ai"><div className="flex gap8 items-center"><div className="spinner"/><span>Thinking...</span></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div className="chat-input-row">
        <input className="input" placeholder="Talk to Dr. Mind..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <button className="btn btn-primary" style={{padding:"12px 14px"}} onClick={send}><Icon d={Icons.send} size={16}/></button>
      </div>
    </div>
  );
}

// ── PREMIUM ───────────────────────────────────────────────────────────────────
function PremiumPage({ user, onUpgrade }) {
  const perks = ["Unlimited AI Coach (Dr. Mind) conversations","Advanced mood & progress analytics","Priority feature access","No ads, ever"];
  return (
    <div className="page">
      <div style={{textAlign:"center",padding:"24px 0 16px"}}>
        <div style={{fontSize:52}}>⭐</div>
        <h1 className="page-title mt12">MindGame Premium</h1>
        <p className="text-muted text-sm mt4">Unlock your full mental performance potential</p>
      </div>
      <div className="card" style={{background:"linear-gradient(135deg,rgba(245,158,11,.1),rgba(249,115,22,.05))",border:"1px solid rgba(245,158,11,.3)"}}>
        {perks.map((p,i)=>(
          <div key={i} className="flex gap8 items-center mb12">
            <Icon d={Icons.check} size={16} stroke="var(--gold)"/>
            <span className="text-sm">{p}</span>
          </div>
        ))}
        <div className="divider"/>
        <div style={{textAlign:"center"}}>
          <div className="fw700" style={{fontSize:28}}>$4.99<span className="text-muted text-sm fw600">/month</span></div>
          <div className="text-xs text-muted mt4">Cancel anytime</div>
        </div>
        <button className="btn btn-gold btn-full mt16" onClick={onUpgrade}>Unlock Premium</button>
        <p className="text-xs text-muted mt8" style={{textAlign:"center"}}>Demo: click to simulate upgrade</p>
      </div>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfilePage({ user, onUpdate, onLogout }) {
  const [sport, setSport] = useState(user.sport);

  const save = () => {
    const users = store.get("mg_users") || {};
    if (users[user.email]) { users[user.email].sport = sport; store.set("mg_users", users); }
    const updated = { ...user, sport };
    store.set("mg_session", updated);
    onUpdate(updated);
  };

  return (
    <div className="page">
      <h1 className="page-title">Profile</h1>
      <p className="page-sub">{user.email}</p>
      <div className="card mb14" style={{textAlign:"center",padding:28}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--primary),var(--primary2))",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:24,fontWeight:700,color:"#000"}}>
          {user.name[0].toUpperCase()}
        </div>
        <div className="fw700" style={{fontSize:18}}>{user.name}</div>
        {user.premium && <span className="premium-badge mt8" style={{display:"inline-flex"}}>⭐ Premium Member</span>}
      </div>
      <label className="label">Your Sport</label>
      <select className="input mb12" value={sport} onChange={e=>setSport(e.target.value)}>
        {SPORTS.map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      <button className="btn btn-primary btn-full mb12" onClick={save}>Save Changes</button>
      <div className="divider"/>
      <button className="btn btn-danger btn-full mt12" onClick={onLogout}>Log Out</button>
    </div>
  );
}

// ── LEVELS DATA ───────────────────────────────────────────────────────────────
const LEVELS = [
  { level: 1, title: "Rookie",        icon: "🥉", xpRequired: 0,    color: "#94a3b8" },
  { level: 2, title: "Contender",     icon: "🥈", xpRequired: 100,  color: "#60a5fa" },
  { level: 3, title: "Competitor",    icon: "🥇", xpRequired: 250,  color: "#34d399" },
  { level: 4, title: "Athlete",       icon: "🏅", xpRequired: 500,  color: "#a78bfa" },
  { level: 5, title: "Elite",         icon: "🏆", xpRequired: 900,  color: "#f59e0b" },
  { level: 6, title: "All-Star",      icon: "⭐", xpRequired: 1400, color: "#f97316" },
  { level: 7, title: "Champion",      icon: "👑", xpRequired: 2000, color: "#ef4444" },
  { level: 8, title: "Legend",        icon: "🔥", xpRequired: 3000, color: "#ec4899" },
];

const MENTAL_AREAS = ["Focus","Confidence","Composure","Energy","Communication","Resilience","Motivation","Preparation"];

const getLevel = (xp) => {
  let current = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xpRequired) current = l; }
  return current;
};

const getNextLevel = (xp) => {
  for (const l of LEVELS) { if (xp < l.xpRequired) return l; }
  return null;
};

const getXpForLog = (log) => {
  let xp = 20; // base
  if (log.duration >= 60) xp += 10;
  if (log.duration >= 120) xp += 10;
  if (log.notes) xp += 5;
  if (log.mentalAreas?.length > 0) xp += log.mentalAreas.length * 3;
  return xp;
};

// ── PRACTICE TRACKER ──────────────────────────────────────────────────────────
function PracticeTrackerPage({ user, onToast }) {
  const [view, setView] = useState("list");
  const [logs, setLogs] = useState(store.get(`mg_practice_${user.email}`) || []);
  const [xp, setXp] = useState(store.get(`mg_xp_${user.email}`) || 0);
  const [form, setForm] = useState({ activity:"", duration:"", mentalAreas:[], notes:"", rating:null });
  const [feedback, setFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  const currentLevel = getLevel(xp);
  const nextLevel = getNextLevel(xp);
  const xpToNext = nextLevel ? nextLevel.xpRequired - xp : 0;
  const xpProgress = nextLevel ? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100;

  const toggleArea = (area) => {
    setForm(f => ({
      ...f,
      mentalAreas: f.mentalAreas.includes(area)
        ? f.mentalAreas.filter(a => a !== area)
        : [...f.mentalAreas, area]
    }));
  };

  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);

  const startFeedbackChat = async (log) => {
    setLoadingFeedback(true);
    const allLogs = [...logs, log];
    const recentSummary = allLogs.slice(-5).map(l =>
      `${l.activity} (${l.duration}min) — mental areas: ${l.mentalAreas?.join(", ") || "none"}, rating: ${l.rating}/5, notes: ${l.notes || "none"}`
    ).join("\n");

    const openingPrompt = `You are Dr. Mind, a personal sports psychologist. Be conversational and caring but concise. In 4-5 sentences: greet them by name, acknowledge what they just logged, identify the biggest mental area to improve based on their data, give one concrete technique or drill they can use to fix it, then ask one follow up question to keep the conversation going.\n\nAthlete: ${user.name}, Sport: ${user.sport}\nJust logged: ${log.activity} (${log.duration}min), mental rating: ${log.rating}/5, areas: ${log.mentalAreas?.join(", ") || "none"}, notes: "${log.notes || "none"}"\nRecent history:\n${recentSummary}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: openingPrompt }]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Great session logged! How are you feeling about your mental performance lately?";
      setChatMsgs([{ role: "assistant", text: reply }]);
    } catch {
      setChatMsgs([{ role: "assistant", text: "Great session! How are you feeling mentally after that practice?" }]);
    }
    setLoadingFeedback(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const updatedMsgs = [...chatMsgs, { role: "user", text: userMsg }];
    setChatMsgs(updatedMsgs);
    setChatLoading(true);

    const allLogs = logs;
    const recentSummary = allLogs.slice(-5).map(l =>
      `${l.activity} (${l.duration}min) — mental areas: ${l.mentalAreas?.join(", ") || "none"}, rating: ${l.rating}/5`
    ).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are Dr. Mind, a personal sports psychologist for ${user.name} who plays ${user.sport}. Be warm and conversational but keep responses to 3-5 sentences. Always be specific to what they share — give real advice, name actual techniques, and ask follow up questions to dig deeper. No generic fluff. Recent logs: ${recentSummary}.`,
          messages: updatedMsgs.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Tell me more about how you're feeling.";
      setChatMsgs(m => [...m, { role: "assistant", text: reply }]);
    } catch {
      setChatMsgs(m => [...m, { role: "assistant", text: "Connection issue. Please try again." }]);
    }
    setChatLoading(false);
  };

  const saveLog = async () => {
    if (!form.activity || !form.duration || !form.rating) return onToast("Fill in activity, duration and rating");
    const log = { ...form, date: new Date().toISOString(), id: Date.now() };

    // Generate a short tip for this log
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a sports psychologist. Based on this practice log, give ONE specific thing this athlete needs to work on mentally. One sentence only, be direct and actionable.\n\nAthlete: ${user.name}, Sport: ${user.sport}\nActivity: ${log.activity}, Duration: ${log.duration}min, Mental rating: ${log.rating}/5, Areas: ${log.mentalAreas?.join(", ") || "none"}, Notes: "${log.notes || "none"}"`
          }]
        })
      });
      const data = await res.json();
      log.tip = data.content?.[0]?.text || null;
    } catch { log.tip = null; }

    const earnedXp = getXpForLog(log);
    const oldLevel = getLevel(xp);
    const newXp = xp + earnedXp;
    const updatedLevel = getLevel(newXp);
    const next = [...logs, log];
    setLogs(next);
    store.set(`mg_practice_${user.email}`, next);
    setXp(newXp);
    store.set(`mg_xp_${user.email}`, newXp);
    if (updatedLevel.level > oldLevel.level) {
      setNewLevel(updatedLevel);
      setShowLevelUp(true);
    } else {
      onToast(`+${earnedXp} XP earned! 💪`);
    }
    setChatMsgs([]);
    startFeedbackChat(log);
    setForm({ activity:"", duration:"", mentalAreas:[], notes:"", rating:null });
    setView("feedback");
  };

  const ratingLabels = ["", "Poor", "Below Avg", "Average", "Good", "Excellent"];

  if (showLevelUp) return (
    <div className="page" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",minHeight:"70vh"}}>
      <div style={{fontSize:72}}>{newLevel?.icon}</div>
      <h1 className="page-title mt16" style={{fontSize:32}}>Level Up!</h1>
      <p className="text-muted mt8">You reached</p>
      <div style={{fontSize:24,fontWeight:800,color:newLevel?.color,margin:"8px 0"}}>{newLevel?.title}</div>
      <div className="tag tag-teal mt8">Level {newLevel?.level}</div>
      <button className="btn btn-primary mt24" onClick={()=>setShowLevelUp(false)}>Keep Going 🔥</button>
    </div>
  );

  return (
    <div className="page">
      {/* Level Card */}
      <div className="card mb16" style={{background:`linear-gradient(135deg, ${currentLevel.color}22, ${currentLevel.color}11)`, border:`1px solid ${currentLevel.color}44`}}>
        <div className="row mb8">
          <div className="flex gap8 items-center">
            <span style={{fontSize:28}}>{currentLevel.icon}</span>
            <div>
              <div className="fw700" style={{color:currentLevel.color}}>{currentLevel.title}</div>
              <div className="text-xs text-muted">Level {currentLevel.level}</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="fw700" style={{color:currentLevel.color}}>{xp} XP</div>
            {nextLevel && <div className="text-xs text-muted">{xpToNext} to next</div>}
          </div>
        </div>
        {nextLevel && (
          <>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${xpProgress}%`,background:`linear-gradient(90deg,${currentLevel.color},${nextLevel.color})`}}/></div>
            <div className="row mt4">
              <span className="text-xs text-muted">{currentLevel.title}</span>
              <span className="text-xs text-muted">{nextLevel.title} {nextLevel.icon}</span>
            </div>
          </>
        )}
      </div>

      <div className="row mb16">
        <h1 className="page-title" style={{marginBottom:0}}>Practice Log</h1>
        <button className="btn btn-primary" style={{padding:"8px 16px",fontSize:13}} onClick={()=>setView(v=>v==="list"?"new":"list")}>
          {view==="list"||view==="feedback" ? <><Icon d={Icons.plus} size={16}/>Log</>: "Cancel"}
        </button>
      </div>

      {view === "new" && (
        <>
          <label className="label">Activity / Practice Type</label>
          <input className="input mb12" placeholder="e.g. Team practice, gym, game..." value={form.activity} onChange={e=>setForm(f=>({...f,activity:e.target.value}))}/>
          <label className="label">Duration (minutes)</label>
          <input className="input mb12" type="number" placeholder="e.g. 90" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/>
          <label className="label">Mental Performance Rating</label>
          <div className="mood-row mb12">
            {[1,2,3,4,5].map(r=>(
              <button key={r} className={`mood-dot ${form.rating===r?"sel":""}`} style={{width:48,height:48,fontSize:11}} onClick={()=>setForm(f=>({...f,rating:r}))}>
                {r}
              </button>
            ))}
          </div>
          {form.rating && <p className="text-xs text-muted mb12" style={{textAlign:"center"}}>{ratingLabels[form.rating]}</p>}
          <label className="label">Mental Areas (select all that apply)</label>
          <div className="mood-row mb12">
            {MENTAL_AREAS.map(a=>(
              <button key={a} className={`pill ${form.mentalAreas.includes(a)?"active":""}`} style={{fontSize:12}} onClick={()=>toggleArea(a)}>{a}</button>
            ))}
          </div>
          <label className="label">Notes (optional)</label>
          <textarea className="input mb16" rows={3} placeholder="How did it feel? What happened?" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
          <button className="btn btn-primary btn-full" onClick={saveLog}>Save & Get Feedback</button>
        </>
      )}

      {view === "feedback" && (
        <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 280px)"}}>
          <div className="card mb12" style={{border:"1px solid rgba(45,212,191,.3)",flexShrink:0}}>
            <div className="row">
              <div className="fw700">🧠 Dr. Mind — Practice Review</div>
              <button className="btn btn-ghost" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>setView("list")}>View Logs</button>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:12}}>
            {chatMsgs.length === 0 && loadingFeedback && (
              <div className="msg msg-ai"><div className="flex gap8 items-center"><div className="spinner"/><span>Analyzing your practice...</span></div></div>
            )}
            {chatMsgs.map((m,i)=>(
              <div key={i} className={`msg ${m.role==="assistant"?"msg-ai":"msg-user"}`}>{m.text}</div>
            ))}
            {chatLoading && <div className="msg msg-ai"><div className="flex gap8 items-center"><div className="spinner"/><span>Thinking...</span></div></div>}
            <div ref={chatBottomRef}/>
          </div>
          <div className="flex gap8" style={{paddingTop:12,borderTop:"1px solid var(--border)"}}>
            <input className="input" style={{flex:1}} placeholder="Ask Dr. Mind anything..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
            <button className="btn btn-primary" style={{padding:"12px 14px"}} onClick={sendChat}><Icon d={Icons.send} size={16}/></button>
          </div>
        </div>
      )}

      {view === "list" && (
        logs.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)"}}>
            <div style={{fontSize:48}}>🏋️</div>
            <p className="mt12">No practice logs yet. Start logging to level up!</p>
            <button className="btn btn-primary mt16" onClick={()=>setView("new")}>Log First Session</button>
          </div>
        ) : (
          [...logs].reverse().map((l,i)=>(
            <div key={i} className="card">
              <div className="row mb8">
                <span className="fw600 text-sm">{l.activity}</span>
                <span className="text-xs text-muted">{new Date(l.date).toLocaleDateString()}</span>
              </div>
              <div className="flex gap8 mb8">
                <span className="tag tag-teal">{l.duration} min</span>
                <span className="tag tag-purple">{"⭐".repeat(l.rating)}</span>
              </div>
              {l.mentalAreas?.length > 0 && (
                <div className="flex gap8 mb8" style={{flexWrap:"wrap"}}>
                  {l.mentalAreas.map(a=><span key={a} className="tag" style={{background:"rgba(100,116,139,.15)",color:"var(--muted)",fontSize:10}}>{a}</span>)}
                </div>
              )}
              {l.notes && <p className="text-xs text-muted mb8">{l.notes}</p>}
              {l.tip && (
                <div style={{background:"rgba(45,212,191,.08)",border:"1px solid rgba(45,212,191,.2)",borderRadius:8,padding:"8px 12px",marginTop:4}}>
                  <span className="text-xs fw600" style={{color:"var(--primary)"}}>🧠 Dr. Mind: </span>
                  <span className="text-xs" style={{color:"var(--text)"}}>{l.tip}</span>
                </div>
              )}
            </div>
          ))
        )
      )}
    </div>
  );
}

// ── LOCKED PAGE ───────────────────────────────────────────────────────────────
function LockedPage({ onNav }) {
  return (
    <div className="page" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",minHeight:"70vh"}}>
      <Icon d={Icons.lock} size={48} stroke="var(--gold)"/>
      <h2 className="fw700 mt16">Premium Feature</h2>
      <p className="text-muted text-sm mt8">Unlock AI Coach and advanced features with Premium</p>
      <button className="btn btn-gold mt24" onClick={()=>onNav("premium")}>View Premium Plans</button>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => store.get("mg_session"));
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); };

  const handleAuth = (u) => { setUser(u); setPage("home"); };
  const handleLogout = () => { store.set("mg_session", null); setUser(null); setPage("home"); };
  const handleUpgrade = () => {
    const users = store.get("mg_users") || {};
    if (users[user.email]) { users[user.email].premium = true; store.set("mg_users", users); }
    const updated = { ...user, premium: true };
    store.set("mg_session", updated);
    setUser(updated); setPage("home");
    showToast("Welcome to Premium! ⭐");
  };

  if (!user) return (
    <>
      <style>{css}</style>
      <AuthScreen onAuth={handleAuth}/>
    </>
  );

  const nav = [
    { id:"home", icon:"home", label:"Home" },
    { id:"practice", icon:"flame", label:"Train" },
    { id:"journal", icon:"book", label:"Journal" },
    { id:"coach", icon:"star", label:"Coach" },
    { id:"profile", icon:"user", label:"Profile" },
  ];

  const renderPage = () => {
    const props = { user, onToast: showToast, onNav: setPage };
    switch(page) {
      case "home": return <HomePage {...props}/>;
      case "pregame": return <PreGamePage {...props}/>;
      case "meditation": return <MeditationPage {...props}/>;
      case "breathing": return <BreathingPage {...props}/>;
      case "affirmations": return <AffirmationsPage {...props}/>;
      case "recovery": return <RecoveryPage {...props}/>;
      case "selftalk": return <SelfTalkPage {...props}/>;
      case "journal": return <JournalPage {...props}/>;
      case "progress": return <ProgressPage {...props}/>;
      case "practice": return <PracticeTrackerPage {...props}/>;
      case "coach": return user.premium ? <CoachPage {...props}/> : <LockedPage onNav={setPage}/>;
      case "premium": return <PremiumPage user={user} onUpgrade={handleUpgrade}/>;
      case "profile": return <ProfilePage user={user} onUpdate={setUser} onLogout={handleLogout}/>;
      default: return <HomePage {...props}/>;
    }
  };

  const mainPages = ["home","progress","journal","coach","profile"];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {renderPage()}
        <nav className="bottom-nav">
          {nav.map(n => (
            <button key={n.id} className={`nav-btn ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
              <Icon d={Icons[n.icon]} size={22}/>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}
      </div>
      <Analytics />
    </>
  );
}
