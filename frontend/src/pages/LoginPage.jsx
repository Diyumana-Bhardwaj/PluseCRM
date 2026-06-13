import { useState } from "react";

const CREDS = { email: "demo@pulsecrm.in", password: "pulse123" };

const FEATURES = [
  {
    title: "AI Customer Segmentation",
    desc: "Identify high impact audiences automatically",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="#FF6B35" strokeWidth="1.8"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Personalized Campaigns",
    desc: "AI writes messages that convert",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <line x1="22" y1="2" x2="11" y2="13" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="#FF6B35" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    title: "Live Campaign Tracking",
    desc: "See results as they happen",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
];

const FLOW = [
  { label: "Customer\nData",  color: "#4A6CF7", icon: <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#4A6CF7" strokeWidth="1.7" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="#4A6CF7" strokeWidth="1.7"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#4A6CF7" strokeWidth="1.7" strokeLinecap="round"/></svg> },
  { label: "AI Analysis",     color: "#4A6CF7", icon: <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4A6CF7" strokeWidth="1.6" fill="none"/><circle cx="9" cy="9" r="1.4" fill="#4A6CF7"/><circle cx="15" cy="9" r="1.4" fill="#4A6CF7"/><circle cx="9" cy="15" r="1.4" fill="#4A6CF7"/><circle cx="15" cy="15" r="1.4" fill="#4A6CF7"/></svg> },
  { label: "Opportunity",     color: "#F5A623", icon: <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#F5A623" strokeWidth="1.7" strokeLinejoin="round" fill="none"/></svg> },
  { label: "Campaign",        color: "#A78BFA", icon: <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="#A78BFA" strokeWidth="1.8" strokeLinejoin="round" fill="none"/></svg> },
  { label: "Revenue",         color: "#22C55E", icon: <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="1.7" fill="none"/><text x="12" y="17" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700">₹</text></svg> },
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("demo@pulsecrm.in");
  const [password, setPassword] = useState("pulse123");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === CREDS.email && password === CREDS.password) {
        onLogin();
      } else {
        setError("Invalid credentials. Use demo@pulsecrm.in / pulse123");
        setLoading(false);
      }
    }, 900);
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#040B16] text-white font-sans">

      {/* ═══════════════ LEFT PANEL ═══════════════ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden px-12 py-7 relative">

        {/* glow */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-3/4 h-44"
          style={{ background: "radial-gradient(ellipse at 20% 100%, rgba(255,107,53,0.22) 0%, transparent 70%)" }} />

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 mb-2 shrink-0">
          <div className="w-9 h-9 rounded-[9px] flex items-center justify-center"
            style={{ background: "rgba(255,107,53,0.1)", border: "1.5px solid rgba(255,107,53,0.3)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 12 Q6 5 12 12 Q18 19 21 12" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <circle cx="12" cy="12" r="2" fill="#FF6B35"/>
            </svg>
          </div>
          <span className="text-[30px] font-bold tracking-tight">
            <span className="text-white">Pulse</span>
            <span className="text-[#F05C0E]">CRM</span>
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[1.2px] text-dim"
            style={{ background: "#1F2128", border: "1px solid #2D3139" }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9.8 6.2H15.3L10.7 9.3L12.5 14.5L8 11.4L3.5 14.5L5.3 9.3L0.7 6.2H6.2L8 1Z" fill="#FF6B35"/>
            </svg>
            AI-NATIVE CUSTOMER INTELLIGENCE
          </div>

        {/* ── Middle content — fills remaining space ── */}
        <div className="flex-1 flex flex-col justify-center min-h-0">

          {/* eyebrow */}
          

          {/* headline */}
          <h1 className="text-[42px] font-extrabold leading-[1.07] tracking-[-1.8px] text-white mb-4">
            Know who needs{" "}
            <span className="text-[#F05C0E]">attention</span>{" "}
            before<br />they disappear.
          </h1>

          {/* sub */}
          <p className="text-[17px] leading-relaxed text-muted max-w-[80%] mb-7">
            PulseCRM continuously analyzes customer behavior,
            discovers segments, and recommends campaigns that drive revenue.
          </p>

          {/* features */}
          <div className="flex flex-col gap-3.5 mb-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 shrink-0 rounded-[9px] flex items-center justify-center"
                  style={{ background: "#1A1D24", border: "1px solid #2D3139" }}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-[17px] font-semibold text-white leading-tight">{f.title}</p>
                  <p className="text-[16px] text-muted mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Flow strip — pinned at bottom ── */}
        <div className="shrink-0 flex items-center pb-5 relative z-10">
          {FLOW.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 rounded-[10px] flex items-center justify-center"
                  style={{ background: "#1A1D24", border: `1px solid ${step.color}60` }}>
                  {step.icon}
                </div>
                <span className="text-[10px] text-muted text-center whitespace-pre-line leading-tight">
                  {step.label}
                </span>
              </div>
              {i < FLOW.length - 1 && (
                <div className="flex items-center gap-1 px-3 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F05C0E] block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F05C0E] block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F05C0E] block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <div className="bg-[#111826] w-[50vw] shrink-0 flex items-center justify-center px-10 h-full overflow-hidden bg-[#151E2C]">
        <div className="w-[80%] rounded-2xl p-8"
          style={{ background: "#1C1F27", border: "2px solid #9ca3afdd" }}>

          <h2 className="text-[22px] font-bold tracking-tight text-white mb-1">Welcome back</h2>
          <p className="text-[13px] text-muted mb-6">Sign in to continue to PulseCRM</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-0">

            {/* Email */}
            <div className="mb-4">
              <label className="block text-[12px] font-medium text-[#D1D5DB] mb-1.5">Email</label>
              <div className="relative flex items-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 pointer-events-none">
                  <rect x="2" y="4" width="20" height="16" rx="3" stroke="#6B7280" strokeWidth="1.7" fill="none"/>
                  <polyline points="2,4 12,13 22,4" stroke="#6B7280" strokeWidth="1.7" strokeLinejoin="round" fill="none"/>
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="demo@pulsecrm.in"
                  className="w-full rounded-[9px] pl-10 pr-3 py-2.5 text-[13px] text-white placeholder-subtle transition-colors focus:border-brand"
                  style={{ background: "#13151A", border: "1px solid #2D3139" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-[12px] font-medium text-[#D1D5DB] mb-1.5">Password</label>
              <div className="relative flex items-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 pointer-events-none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6B7280" strokeWidth="1.7" fill="none"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6B7280" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
                  <circle cx="12" cy="16" r="1.5" fill="#6B7280"/>
                </svg>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[9px] pl-10 pr-10 py-2.5 text-[13px] text-white placeholder-subtle transition-colors focus:border-brand"
                  style={{ background: "#13151A", border: "1px solid #2D3139" }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 flex items-center text-muted hover:text-dim transition-colors">
                  {showPw
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12a10.06 10.06 0 0 1 2.06-3.94M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8a10.05 10.05 0 0 1-1.62 2.93M1 1l22 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.7" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" fill="none"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-5">
              <button type="button" onClick={() => setRemember(v => !v)}
                className="flex items-center gap-2 group">
                <div className="w-[17px] h-[17px] rounded-[4px] flex items-center justify-center transition-all"
                  style={{ background: remember ? "#FF6B35" : "transparent", border: `1.5px solid ${remember ? "#FF6B35" : "#374151"}` }}>
                  {remember && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-dim">Remember me</span>
              </button>
              <span className="text-[13px] text-muted cursor-pointer hover:text-dim transition-colors">Forgot password?</span>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-lg text-[13px] text-red-300"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-[9px] text-[14px] font-semibold text-white tracking-tight transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center"
              style={{ background: "#FF6B35" }}
              onMouseEnter={e => e.currentTarget.style.background = "#E55A26"}
              onMouseLeave={e => e.currentTarget.style.background = "#FF6B35"}>
              {loading
                ? <span className="w-[18px] h-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                : "Open Dashboard  →"
              }
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-subtle font-medium tracking-wide">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Demo credentials */}
          <div className="flex items-center gap-3 rounded-[9px] p-3.5 mb-4"
            style={{ background: "#13151A", border: "1px solid #2D3139" }}>
            <div className="w-9 h-9 shrink-0 rounded-[9px] flex items-center justify-center"
              style={{ background: "#1F2128", border: "1px solid #2D3139" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="#9CA3AF" strokeWidth="1.7"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#D1D5DB] mb-0.5">Demo Credentials</p>
              <p className="text-[11px] text-muted font-mono">demo@pulsecrm.in &nbsp;/&nbsp; pulse123</p>
            </div>
          </div>

          {/* Secure note */}
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-subtle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#4B5563" strokeWidth="1.7" fill="none"/>
              <polyline points="9,12 11,14 15,10" stroke="#4B5563" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Secure. Private. Built for modern marketers.
          </p>
        </div>
      </div>

    </div>
  );
}