/**
 * Campaigns.jsx — PulseCRM Campaign Builder
 *
 * Flow:
 *   Audience Summary → AI Strategy → Review/Edit Strategy
 *   → AI Message → Live Preview → Config → Estimated Results → Launch
 *   → Live Performance (navigates away)
 *
 * Backend calls (all via VITE_API_URL env var):
 *   POST /api/generate-strategy
 *   POST /api/generate-message
 *   POST /api/campaign
 */

import { useState, useEffect, useRef } from "react";
import { useCRM } from "../../context/CRMContext";
import PhonePreview from "./components/PhonePreview";

// ── Icon helper ───────────────────────────────────────────────────────────────

function Icon({ d, className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24"
         stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const IC = {
  upload:  "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  rocket:  "M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 00-2.58 5.841",
  sparkle: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  check:   "M5 13l4 4L19 7",
  arrowL:  "M15 19l-7-7 7-7",
  edit:    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  image:   "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  link:    "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  tag:     "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  clock:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  users:   "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  chart:   "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  calendar:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
};

const CHANNELS  = ["WhatsApp", "SMS", "Email", "RCS"];
const TONES     = ["Friendly", "Urgent", "Exclusive", "Playful", "Professional"];
const API_BASE  = import.meta.env.VITE_API_URL ?? "";

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-[#FAF8F5] rounded-xl px-3 py-2.5 border border-black/[0.05]">
      <p className="text-[10px] text-[#9C9691] mb-0.5">{label}</p>
      <p className="text-[15px] font-bold text-[#1A1410]">{value}</p>
      {sub && <p className="text-[10px] text-[#9C9691]">{sub}</p>}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-black/[0.06]" />;
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner({ size = "w-3.5 h-3.5", color = "border-[#FF6B35]" }) {
  return (
    <span className={`${size} rounded-full border-2 border-black/10 border-t-current ${color} animate-spin`} />
  );
}

// ── Confidence badge ──────────────────────────────────────────────────────────

function ConfidenceBadge({ value }) {
  const color =
    value >= 85 ? "bg-green-50 text-green-700 border-green-200" :
    value >= 70 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-red-50   text-red-700   border-red-200";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${color}`}>
      {value}% confidence
    </span>
  );
}

const SIM_STAGES = [
  { label: "Validating audience",       icon: "👥" },
  { label: "Personalising messages",    icon: "✍️" },
  { label: "Connecting to channel",     icon: "📡" },
  { label: "Queuing delivery",          icon: "📬" },
  { label: "Campaign live",             icon: "✅" },
];

function LaunchSimModal({ stage, done, audienceCount, channel, campaignId, onViewLive, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[340px] p-6 flex flex-col items-center gap-4">

        {!done ? (
          <>
            <p className="text-[13px] font-bold text-[#1A1410]">Launching campaign…</p>
            <p className="text-[11px] text-[#9C9691]">
              Sending to {audienceCount.toLocaleString()} customers via {channel}
            </p>

            <div className="w-full flex flex-col gap-2 mt-1">
              {SIM_STAGES.map((s, i) => {
                const isActive  = i === stage - 1;
                const isDone    = i < stage;
                const isPending = i >= stage;
                return (
                  <div key={i} className="flex items-center gap-3">
                    {/* Line connector */}
                    <div className="flex flex-col items-center" style={{ width: 28 }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] transition-all duration-500 ${
                        isDone    ? "bg-green-100" :
                        isActive  ? "bg-[#FFF0EA] ring-2 ring-[#FF6B35] ring-offset-1" :
                                    "bg-[#F3F0EB]"
                      }`}>
                        {isDone ? "✓" : isActive ? (
                          <span className="w-3 h-3 rounded-full border-2 border-[#FF6B35] border-t-transparent animate-spin inline-block" />
                        ) : s.icon}
                      </div>
                      {i < SIM_STAGES.length - 1 && (
                        <div className={`w-0.5 h-4 mt-0.5 transition-all duration-500 ${isDone ? "bg-green-300" : "bg-[#E8E4DF]"}`} />
                      )}
                    </div>
                    <span className={`text-[12px] transition-all duration-300 ${
                      isDone   ? "text-green-700 font-medium" :
                      isActive ? "text-[#FF6B35] font-semibold" :
                                 "text-[#9C9691]"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Done state */}
            <div className="text-5xl animate-bounce">🚀</div>
            <p className="text-[16px] font-bold text-[#1A1410]">Launch Complete!</p>
            <p className="text-[12px] text-[#6B6560] text-center">
              {audienceCount.toLocaleString()} messages queued via {channel}
              {campaignId && <> · Campaign #{campaignId}</>}
            </p>
            <div className="w-full flex flex-col gap-2 mt-1">
              <button onClick={onViewLive}
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
                View Live Performance →
              </button>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-[13px] font-medium bg-[#F3F0EB] text-[#6B6560] hover:bg-[#EAE7E2] transition-colors">
                New Campaign
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════

export default function Campaigns({ navigate }) {
  const { campaignAudience, customers } = useCRM();

  // ── Audience resolution ──────────────────────────────────────────────────
  const audience      = campaignAudience?.length ? campaignAudience : customers;
  const audienceCount = audience.length;
  const isFiltered    = campaignAudience?.length > 0 && campaignAudience.length < customers.length;

  const personaLabel = (() => {
    if (!isFiltered) return null;
    const labels = [...new Set(audience.map(c => c.persona?.label).filter(Boolean))];
    return labels.length ? labels.join(", ") : null;
  })();

  const avgSpend = (() => {
    if (!audience.length) return 0;
    const total = audience.reduce((s, c) => s + (c.monetary ?? c.spend ?? 0), 0);
    return Math.round(total / audience.length);
  })();

  const expectedRevenue = Math.round(avgSpend * audienceCount * 0.31 * 0.30);

  // ── Step state ───────────────────────────────────────────────────────────
  // Steps: audience → strategy → message → config → launch → live
  const [step, setStep] = useState("audience"); // audience | strategy | message | config | launched

  // ── Strategy state ───────────────────────────────────────────────────────
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [strategyError,   setStrategyError]   = useState("");
  const [strategy, setStrategy] = useState(null);
  // {objective, reason, offer, channel, bestTime, confidence}

  // Editable strategy fields
  const [editObjective, setEditObjective] = useState("");
  const [editOffer,     setEditOffer]     = useState("");
  const [editChannel,   setEditChannel]   = useState("WhatsApp");
  const [editBestTime,  setEditBestTime]  = useState("");

  // ── Message state ────────────────────────────────────────────────────────
  const [msgLoading,   setMsgLoading]   = useState(false);
  const [msgError,     setMsgError]     = useState("");
  const [message,      setMessage]      = useState("");
  const [tone,         setTone]         = useState("Friendly");
  const [hasGenerated, setHasGenerated] = useState(false);

  // ── Config state ─────────────────────────────────────────────────────────
  const [campaignName, setCampaignName] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [expiryDate,   setExpiryDate]   = useState("");
  const [hasImage,     setHasImage]     = useState(false);
  const [previewCh,    setPreviewCh]    = useState("WhatsApp");

  // ── Launch state ─────────────────────────────────────────────────────────
  const [launching,   setLaunching]   = useState(false);
  const [launchError, setLaunchError] = useState("");
  const [launchedId,  setLaunchedId]  = useState(null);
  const [simStage, setSimStage] = useState(-1); // -1 = not started
  const [simDone,  setSimDone]  = useState(false);
  const [estimate, setEstimate] = useState(null);

  const avgRecency = Math.round(
    audience.reduce((s, c) => s + (c.recency ?? c.rfm_r ?? 30), 0) / (audienceCount || 1)
  );
  const avgFrequency = +(
    audience.reduce((s, c) => s + (c.frequency ?? c.rfm_f ?? 2), 0) / (audienceCount || 1)
  ).toFixed(1);


  // ── Sync editable fields when strategy arrives ───────────────────────────
  useEffect(() => {
    if (!strategy) return;
    setEditObjective(strategy.objective);
    setEditOffer(strategy.offer);
    setEditChannel(strategy.channel);
    setEditBestTime(strategy.bestTime);
    setPreviewCh(strategy.channel);
    fetchEstimate(editChannel);
  }, [strategy]);

  // ── Gate: no dataset ─────────────────────────────────────────────────────
  if (!customers.length) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Icon d={IC.upload} className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-[18px] font-bold text-[#1A1410] mb-2">No dataset yet</h2>
          <p className="text-[13px] text-[#6B6560] mb-6">
            Import a customer CSV from the Customers page before building a campaign.
          </p>
          <button onClick={() => navigate?.("Customers")}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
            Go to Customers →
          </button>
        </div>
      </main>
    );
  }

  // ── Gate: launched ───────────────────────────────────────────────────────
  if (step === "launched") {
    return (
      <main className="flex-1 overflow-y-auto bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Icon d={IC.rocket} className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1A1410] mb-1">Campaign Launched! 🚀</h2>
          <p className="text-[13px] text-[#6B6560] mb-1">
            <strong className="text-[#1A1410]">{audienceCount.toLocaleString()}</strong> messages queued
            {personaLabel && <> for <strong className="text-[#1A1410]">{personaLabel}</strong></>}
          </p>
          <p className="text-[12px] text-[#9C9691] mb-1">via {editChannel} · Campaign #{launchedId}</p>
          <p className="text-[12px] text-[#9C9691] mb-6">Live feed is now active on the Dashboard</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => navigate?.("Dashboard")}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
              View Live Feed →
            </button>
            <button onClick={() => navigate?.("Analytics")}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium bg-white border border-black/[0.08] text-[#6B6560] hover:bg-[#F3F0EB] transition-colors">
              Analytics →
            </button>
            <button onClick={() => {
              setStep("audience"); setStrategy(null); setMessage("");
              setHasGenerated(false); setLaunchedId(null); setCampaignName("");
            }}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium bg-white border border-black/[0.08] text-[#6B6560] hover:bg-[#F3F0EB] transition-colors">
              New Campaign
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleGenerateStrategy() {
    setStrategyLoading(true);
    setStrategyError("");
    try {
      const res = await fetch(`${API_BASE}/api/generate-strategy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona:      personaLabel ?? "All Customers",
          customers:    audienceCount,
          avgSpend,
          avgRecency,   // TODO: derive from audience RFM data
          avgFrequency,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setStrategy(data);
      setStep("strategy");
    } catch (e) {
      setStrategyError("Could not reach AI. Please try again.");
      console.error(e);
    } finally {
      setStrategyLoading(false);
    }
  }

  async function fetchEstimate(ch = editChannel) {
    try {
      const res = await fetch(`${API_BASE}/api/estimate-campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona:      personaLabel ?? "All Customers",
          channel:      ch,
          audience:     audienceCount,
          avgSpend,
          avgFrequency,
          avgRecency,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setEstimate(data);
    } catch (e) {
      console.error("Estimate failed", e);
    }
  }

  async function handleGenerateMessage() {
    setMsgLoading(true);
    setMsgError("");
    try {
      const res = await fetch(`${API_BASE}/api/generate-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona:   personaLabel ?? "All Customers",
          objective: editObjective,
          offer:     editOffer,
          channel:   editChannel,
          tone,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setMessage(data.message);
      setHasGenerated(true);
      setStep("message");
    } catch (e) {
      setMsgError("Message generation failed. Please try again.");
      console.error(e);
    } finally {
      setMsgLoading(false);
    }
  }

  async function handleLaunch() {
    if (!message.trim()) return;
    setSimStage(0);
    setSimDone(false);

    const stages = [0, 1, 2, 3, 4];
    for (let i = 0; i < stages.length; i++) {
      await new Promise(r => setTimeout(r, 1200));
      setSimStage(i + 1);
    }

    // After animation completes, do the actual API call silently
    try {
      const res = await fetch(`${API_BASE}/api/campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        campaignName || `${editObjective} – ${personaLabel ?? "All"}`,
          persona:     personaLabel ?? "All Customers",
          objective:   editObjective,
          offer:       editOffer,
          channel:     editChannel,
          message,
          schedule:    scheduleDate || "immediate",
          expiryDate:  expiryDate || null,
          audienceIds: audience.map(c => c.id ?? c.customer_id ?? ""),
          avgSpend,
          avgFrequency,
          avgRecency,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLaunchedId(data.campaignId);
      }
    } catch (e) {
      console.error("Launch error", e);
    }

    setSimDone(true);
  }

  // ── Progress indicator ───────────────────────────────────────────────────
  const STEPS = ["audience", "strategy", "message", "config"];
  const stepIdx = STEPS.indexOf(step);


  // ════════════════════════════════════════════════════════════════════════════
  // Render
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <main className="flex-1 overflow-hidden bg-[#FAF8F5] flex flex-col">

      {/* ── Top bar ── */}
      <div className="px-6 py-4 bg-white border-b border-black/[0.07] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate?.("Dashboard")}
            className="w-7 h-7 rounded-lg bg-[#F3F0EB] flex items-center justify-center text-[#6B6560] hover:bg-[#EAE7E2] transition-colors">
            <Icon d={IC.arrowL} className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-[#1A1410] leading-tight">Campaign Builder</h1>
            <p className="text-[11px] text-[#9C9691]">AI-powered · strategy → message → launch</p>
          </div>
        </div>
        {/* Progress pills */}
        <div className="flex items-center gap-1.5">
          {["Audience", "Strategy", "Message", "Config"].map((s, i) => (
            <div key={s} className={`flex items-center gap-1.5`}>
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                i < stepIdx  ? "bg-green-100 text-green-700" :
                i === stepIdx ? "bg-[#FF6B35] text-white" :
                                "bg-[#F3F0EB] text-[#9C9691]"
              }`}>{s}</span>
              {i < 3 && <span className="text-[#C4C0BB] text-[10px]">›</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Audience banner ── */}
      <div className={`px-6 py-2.5 flex items-center gap-3 border-b border-black/[0.06] ${isFiltered ? "bg-[#FFF8F5]" : "bg-[#F9FAFB]"}`}>
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isFiltered ? "bg-[#FF6B35]" : "bg-[#9C9691]"}`} />
        <p className="text-[12px] text-[#6B6560] flex-1">
          {isFiltered ? (
            <>Targeting <strong className="text-[#1A1410]">{audienceCount.toLocaleString()} selected customers</strong>
              {personaLabel && <> — <span className="text-[#FF6B35]">{personaLabel}</span></>}
            </>
          ) : (
            <>Targeting <strong className="text-[#1A1410]">all {audienceCount.toLocaleString()} customers</strong>
              <span className="text-[#9C9691]"> (no filter applied)</span>
            </>
          )}
        </p>
        <button onClick={() => navigate?.("Customers")}
          className="text-[11px] font-medium text-[#FF6B35] hover:underline shrink-0">
          {isFiltered ? "Change audience →" : "Filter audience →"}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ════ LEFT — Steps ════ */}
        <div className="w-[62%] shrink-0 overflow-y-auto border-r border-black/[0.07] bg-white px-5 py-5 space-y-5">

          {/* ── 1. Audience Summary ── */}
          <div>
            <SectionLabel>Audience summary</SectionLabel>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <StatCard label="Persona"   value={personaLabel ?? "All Customers"} />
              <StatCard label="Customers" value={audienceCount.toLocaleString()} />
              <StatCard label="Avg spend" value={`₹${avgSpend.toLocaleString()}`} />
              <StatCard label="Avg. frequency" value={`${avgFrequency}x`} sub="per customer" />
            </div>
          </div>

          <Divider />

          {/* ── 2. AI Strategy ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>AI campaign strategy</SectionLabel>
              {strategy && (
                <button onClick={handleGenerateStrategy} disabled={strategyLoading}
                  className="flex items-center gap-1 text-[10px] text-[#FF6B35] hover:underline disabled:opacity-50">
                  <Icon d={IC.refresh} className="w-3 h-3" /> Regenerate
                </button>
              )}
            </div>

            {/* Not yet generated */}
            {!strategy && (
              <div className="bg-[#FFF8F5] border border-[#FF6B35]/20 rounded-xl p-4 text-center">
                <Icon d={IC.sparkle} className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                <p className="text-[13px] font-semibold text-[#1A1410] mb-1">Let AI recommend a strategy</p>
                <p className="text-[11px] text-[#6B6560] mb-3">
                  Based on your audience's RFM profile, Gemini will suggest the best objective, offer, channel and timing.
                </p>
                {strategyError && <p className="text-[11px] text-red-500 mb-2">{strategyError}</p>}
                <button onClick={handleGenerateStrategy} disabled={strategyLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors disabled:opacity-60 mx-auto">
                  {strategyLoading ? <><Spinner color="border-white" /> Analysing audience…</> : <><Icon d={IC.sparkle} className="w-3.5 h-3.5" /> Generate Strategy</>}
                </button>
              </div>
            )}

            {/* Strategy card */}
            {strategy && (
              <div className="bg-[#FFF8F5] border border-[#FF6B35]/20 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon d={IC.sparkle} className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <p className="text-[12px] font-semibold text-[#1A1410]">Recommended strategy</p>
                  </div>
                  <ConfidenceBadge value={strategy.confidence} />
                </div>

                {/* Reason */}
                <div className="bg-white/70 rounded-lg px-3 py-2 border border-black/[0.05]">
                  <p className="text-[10px] font-semibold text-[#9C9691] mb-0.5">Why this campaign?</p>
                  <p className="text-[11px] text-[#6B6560]">{strategy.reason}</p>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-2 gap-2">

                  <div>
                    <p className="text-[10px] text-[#9C9691] mb-1">Objective</p>
                    <select value={editObjective} onChange={e => setEditObjective(e.target.value)}
                      className="w-full bg-white border border-black/[0.08] rounded-lg px-2 py-1.5 text-[11px] text-[#1A1410] outline-none focus:border-[#FF6B35]/50">
                      {["Retention","Reactivation","Upsell","Acquisition"].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#9C9691] mb-1">Best time</p>
                    <input value={editBestTime} onChange={e => setEditBestTime(e.target.value)}
                      className="w-full bg-white border border-black/[0.08] rounded-lg px-2 py-1.5 text-[11px] text-[#1A1410] outline-none focus:border-[#FF6B35]/50"
                      placeholder="e.g. Friday 6 PM" />
                  </div>

                  <div className="col-span-2">
                    <p className="text-[10px] text-[#9C9691] mb-1">Recommended offer</p>
                    <input value={editOffer} onChange={e => setEditOffer(e.target.value)}
                      className="w-full bg-white border border-black/[0.08] rounded-lg px-2 py-1.5 text-[11px] text-[#1A1410] outline-none focus:border-[#FF6B35]/50"
                      placeholder="e.g. 20% off on weekend orders" />
                  </div>

                </div>

                {/* Channel */}
                <div>
                  <p className="text-[10px] text-[#9C9691] mb-1.5">Recommended channel</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {CHANNELS.map(ch => (
                      <button key={ch} onClick={() => { setEditChannel(ch); setPreviewCh(ch);fetchEstimate(ch); }}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                          editChannel === ch
                            ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                            : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5]"
                        }`}>
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {strategy && (
            <>
              <Divider />

              {/* ── 3. Message ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <SectionLabel>AI message generation</SectionLabel>
                  {hasGenerated && (
                    <button onClick={handleGenerateMessage} disabled={msgLoading}
                      className="flex items-center gap-1 text-[10px] text-[#FF6B35] hover:underline disabled:opacity-50">
                      <Icon d={IC.refresh} className="w-3 h-3" /> Regenerate
                    </button>
                  )}
                </div>

                {/* Tone selector */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {TONES.map(t => (
                    <button key={t} onClick={() => setTone(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        tone === t
                          ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                          : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5]"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>

                {!hasGenerated && (
                  <div className="mb-3 text-center py-3 bg-[#FAF8F5] rounded-xl border border-black/[0.05]">
                    <p className="text-[11px] text-[#9C9691] mb-2">
                      Strategy ready — generate your personalised message
                    </p>
                    {msgError && <p className="text-[11px] text-red-500 mb-2">{msgError}</p>}
                    <button onClick={handleGenerateMessage} disabled={msgLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#1A1410] text-white hover:bg-[#333] transition-colors disabled:opacity-60 mx-auto">
                      {msgLoading ? <><Spinner color="border-white" /> Writing…</> : <><Icon d={IC.sparkle} className="w-3.5 h-3.5" /> Generate AI Message</>}
                    </button>
                  </div>
                )}

                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={7}
                  placeholder={hasGenerated ? "" : "Message will appear here after generation…"}
                  className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1410] placeholder-[#C4C0BB] resize-none outline-none focus:border-[#FF6B35]/50 transition-colors leading-relaxed font-mono"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-[#C4C0BB]">
                    {message.length} chars · use {"{name}"} for personalisation
                  </span>
                  {hasGenerated && (
                    <button onClick={handleGenerateMessage} disabled={msgLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#FFF0EA] text-[#FF6B35] border border-[#FF6B35]/20 hover:bg-[#FFE4D6] transition-colors disabled:opacity-60">
                      {msgLoading ? <Spinner /> : <Icon d={IC.sparkle} className="w-3 h-3" />}
                      {msgLoading ? "Writing…" : "Regenerate"}
                    </button>
                  )}
                </div>
              </div>

              <Divider />

              {/* ── 4. Configuration ── */}
              <div>
                <SectionLabel>Campaign configuration</SectionLabel>
                <div className="grid grid-cols-2 gap-3">

                  <div className="col-span-2">
                    <p className="text-[10px] text-[#9C9691] mb-1">Campaign name</p>
                    <input value={campaignName}
                      onChange={e => setCampaignName(e.target.value)}
                      placeholder={`${editObjective} – ${personaLabel ?? "All Customers"}`}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-3 py-2 text-[12px] text-[#1A1410] outline-none focus:border-[#FF6B35]/50 transition-colors" />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#9C9691] mb-1 flex items-center gap-1">
                      <Icon d={IC.calendar} className="w-3 h-3" /> Schedule
                    </p>
                    <input type="datetime-local" value={scheduleDate}
                      onChange={e => setScheduleDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-3 py-2 text-[12px] text-[#1A1410] outline-none focus:border-[#FF6B35]/50 transition-colors" />
                    <p className="text-[10px] text-[#9C9691] mt-0.5">Leave blank for immediate</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#9C9691] mb-1 flex items-center gap-1">
                      <Icon d={IC.clock} className="w-3 h-3" /> Expiry date
                    </p>
                    <input type="date" value={expiryDate}
                      onChange={e => setExpiryDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-3 py-2 text-[12px] text-[#1A1410] outline-none focus:border-[#FF6B35]/50 transition-colors" />
                  </div>

                </div>

                {/* Attachments */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button onClick={() => setHasImage(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                      hasImage ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5]"
                    }`}>
                    <Icon d={IC.image} className="w-3 h-3" />
                    {hasImage ? "Banner added ✓" : "Generate banner"}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5] transition-colors">
                    <Icon d={IC.link} className="w-3 h-3" /> Deep link
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5] transition-colors">
                    <Icon d={IC.tag} className="w-3 h-3" /> Promo code
                  </button>
                </div>
              </div>

              <Divider />

              {/* ── 5. Estimated Results ── */}
              {estimate && (
                <div>
                  <SectionLabel>Estimated results</SectionLabel>
                  <div className="grid grid-cols-3 gap-2 mb-1">
                    <StatCard label="Audience"         value={audienceCount.toLocaleString()} sub="customers" />
                    <StatCard label="Estimated reach"  value={estimate.estimatedDelivery.toLocaleString()} sub={`${editChannel} delivery`} />
                    <StatCard label="Expected CTR"     value={`${estimate.expectedCTR}%`} sub="click-through rate" />
                    <StatCard label="Est. orders"      value={estimate.estimatedOrders.toLocaleString()} />
                    <StatCard label="Expected revenue" value={`₹${estimate.expectedRevenue.toLocaleString()}`} />
                    <div className="bg-[#FFF8F5] rounded-xl px-3 py-2.5 border border-[#FF6B35]/20 flex flex-col justify-center">
                      <p className="text-[10px] text-[#9C9691] mb-0.5">Channel</p>
                      <p className="text-[12px] font-bold text-[#FF6B35]">{editChannel}</p>
                      <p className="text-[10px] text-[#9C9691]">{editBestTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[#9C9691]">{editChannel} · {editBestTime}</span>
                    <ConfidenceBadge value={estimate.confidence} />
                  </div>
                </div>
              )}

              <Divider />

              {/* ── 6. Launch ── */}
              {launchError && (
                <p className="text-[11px] text-red-500 text-center">{launchError}</p>
              )}
              <button
                onClick={handleLaunch}
                disabled={launching || !message.trim()}
                className="w-full py-3 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {launching
                  ? <><Spinner color="border-white" size="w-4 h-4" /> Queuing {audienceCount.toLocaleString()} messages…</>
                  : <><Icon d={IC.rocket} className="w-4 h-4" /> Launch Campaign — {audienceCount.toLocaleString()} {isFiltered ? "selected customers" : "customers"}</>
                }
              </button>
            </>
          )}

        </div>

        {/* ════ RIGHT — Live Preview ════ */}
        <div className="flex-1 overflow-y-auto bg-[#FAF8F5] px-5 py-5 flex flex-col gap-5">
          <div>
            <SectionLabel>Live preview</SectionLabel>
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => setPreviewCh(ch)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                    previewCh === ch
                      ? "bg-[#1A1410] text-white border-[#1A1410]"
                      : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#F3F0EB]"
                  }`}>
                  {ch}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-[220px] h-[420px] bg-[#1A1410] rounded-[36px] p-[10px] shadow-2xl">
                  <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-16 h-5 bg-[#1A1410] rounded-full z-10" />
                  <div className="w-full h-full rounded-[28px] overflow-hidden">
                    <PhonePreview
                      channel={previewCh}
                      message={message || "Your message will appear here after generation."}
                      opp={{ title: editObjective || "Campaign", emoji: "📢" }}
                      hasImage={hasImage}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-black/[0.08] rounded-full px-3 py-1 text-[10px] font-semibold text-[#6B6560] shadow-sm whitespace-nowrap">
                  {previewCh} Preview
                </div>
              </div>
            </div>
          </div>

          {/* Strategy summary (right panel) */}
          {strategy && (
            <div className="bg-white rounded-xl border border-black/[0.07] p-3.5 space-y-2 mt-4">
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px]">Strategy at a glance</p>
              {[
                ["Objective", editObjective],
                ["Offer",     editOffer],
                ["Channel",   editChannel],
                ["Best time", editBestTime],
              ].map(([lbl, val]) => val ? (
                <div key={lbl} className="flex items-start justify-between gap-2">
                  <span className="text-[11px] text-[#9C9691] shrink-0">{lbl}</span>
                  <span className="text-[11px] font-medium text-[#1A1410] text-right">{val}</span>
                </div>
              ) : null)}
              <div className="pt-1 border-t border-black/[0.05]">
                <ConfidenceBadge value={strategy.confidence} />
              </div>
            </div>
          )}
        </div>
      </div>
      {simStage >= 0 && (
        <LaunchSimModal
          stage={simStage}
          done={simDone}
          audienceCount={audienceCount}
          channel={editChannel}
          campaignId={launchedId}
          onViewLive={() => navigate?.("Live Performance")}
          onClose={() => {
            setSimStage(-1);
            setSimDone(false);
            setStep("audience");
            setStrategy(null);
            setMessage("");
            setHasGenerated(false);
            setLaunchedId(null);
            setCampaignName("");
          }}
        />
      )}
    </main>
  );
}