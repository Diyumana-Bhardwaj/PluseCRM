import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

// ── tiny icon wrapper ──────────────────────────────────────────────────────
function Icon({ path, className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const ICONS = {
  back:     "M15 19l-7-7 7-7",
  rocket:   "M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.96 2.91m0 0a6 6 0 01-8.457-8.456m8.456 8.456a6.001 6.001 0 00-8.456-8.456m0 0a14.926 14.926 0 012.916-5.97m0 0A14.98 14.98 0 0115.59 2m0 0h.59M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  play:     "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  dots:     "M5 12h.01M12 12h.01M19 12h.01",
  arrowUp:  "M5 10l7-7m0 0l7 7m-7-7v18",
  check:    "M5 13l4 4L19 7",
};

// ── static data ────────────────────────────────────────────────────────────
const TIMELINE_DATA = [210, 680, 1190, 980, 720, 480, 280, 110, 51];
const TIMELINE_LABELS = ["9 AM", "9:30", "10 AM", "10:30", "11 AM", "11:30", "12 PM", "12:30", "Now"];

const FUNNEL = [
  { label: "Sent",      value: 4830, pct: 100,  drop: null,              color: "bg-[#FF6B35]",  textColor: "text-white" },
  { label: "Delivered", value: 4701, pct: 97.3, drop: "−129 undelivered", color: "bg-[#FF8F5E]",  textColor: "text-white" },
  { label: "Read",      value: 3998, pct: 82.7, drop: "−703 not read",    color: "bg-[#FFAA80]",  textColor: "text-white" },
  { label: "Clicked",   value: 918,  pct: 19,   drop: "−3,080 no click",  color: "bg-[#FFCFAE]",  textColor: "text-[#C2410C]" },
  { label: "Purchased", value: 142,  pct: 2.9,  drop: "−776 no purchase", color: "bg-[#10B981]",  textColor: "text-white" },
];

const CITIES = [
  { name: "Delhi",     revenue: "₹28,400", pct: 100 },
  { name: "Mumbai",    revenue: "₹22,100", pct: 78  },
  { name: "Pune",      revenue: "₹14,800", pct: 52  },
  { name: "Hyderabad", revenue: "₹10,900", pct: 38  },
  { name: "Bengaluru", revenue: "₹5,000",  pct: 18  },
];

const PERSONAS = [
  { emoji: "👻", name: "Ghost Diners",    pct: "61%" },
  { emoji: "🏖️", name: "Weekend Warriors", pct: "24%" },
  { emoji: "👑", name: "VIP Diners",      pct: "15%" },
];

const DEVICES = [
  { label: "Android", pct: 58, color: "bg-[#FF6B35]" },
  { label: "iPhone",  pct: 36, color: "bg-[#6B7280]" },
  { label: "Desktop", pct: 6,  color: "bg-[#D1D5DB]" },
];

const FAILED = [
  { initials: "RK", name: "Rahul Kumar", phone: "+91 98765 XXXXX", reason: "WhatsApp not active on this number", badge: "Invalid" },
  { initials: "PM", name: "Priya Mehta",  phone: "+91 87654 XXXXX", reason: "Number opted out of marketing messages", badge: "Opted out" },
  { initials: "AS", name: "Anil Singh",   phone: "+91 76543 XXXXX", reason: "Message rate limit reached for this account", badge: "Rate limit" },
];

const LIVE_FEED = [
  { initials: "NK", name: "Neha K.",   time: "just now", event: "Order",   eventStyle: "bg-emerald-50 text-emerald-800" },
  { initials: "VR", name: "Vijay R.",  time: "1m ago",   event: "Clicked", eventStyle: "bg-blue-50 text-blue-800" },
  { initials: "SM", name: "Sunita M.", time: "2m ago",   event: "Order",   eventStyle: "bg-emerald-50 text-emerald-800" },
  { initials: "AR", name: "Amit R.",   time: "3m ago",   event: "Read",    eventStyle: "bg-gray-100 text-gray-700" },
  { initials: "PD", name: "Pooja D.",  time: "4m ago",   event: "Order",   eventStyle: "bg-emerald-50 text-emerald-800" },
];

const MINI_KPIS = [
  { label: "Cost per order",   value: "₹48.5" },
  { label: "Avg. response",    value: "4m 12s" },
  { label: "Opt-outs",         value: "23" },
  { label: "Repeat buyers",    value: "38" },
  { label: "New customers",    value: "104" },
];

// ── sub-components ─────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, delta, deltaType }) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl px-3.5 py-3">
      <p className="text-[10px] text-[#9C9691] mb-1">{label}</p>
      <p className="text-[20px] font-semibold text-[#1A1410] leading-none">{value}</p>
      {sub   && <p className="text-[11px] text-[#9C9691] mt-1">{sub}</p>}
      {delta && (
        <span className={`inline-flex items-center gap-0.5 mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
          deltaType === "up" ? "bg-emerald-50 text-emerald-800" : "bg-[#FFF0EA] text-[#C2410C]"
        }`}>
          <Icon path={ICONS.arrowUp} className={`w-2.5 h-2.5 ${deltaType === "hi" ? "rotate-0" : ""}`} />
          {delta}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">{children}</p>;
}

function TimelineChart() {
  const ref = useRef(null);
  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: "line",
      data: {
        labels: TIMELINE_LABELS,
        datasets: [{
          data: TIMELINE_DATA,
          borderColor: "#FF6B35",
          backgroundColor: "rgba(255,107,53,0.07)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1.5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false, min: 0 } },
      },
    });
    return () => chart.destroy();
  }, []);

  return (
    <div>
      <SectionLabel>Delivery timeline</SectionLabel>
      <div className="relative h-[100px]">
        <canvas ref={ref} role="img" aria-label="Line chart of messages delivered from 9 AM to now, peaking at 10 AM" />
      </div>
      <div className="flex justify-between mt-1">
        {["9 AM", "10 AM", "11 AM", "12 PM", "Now"].map(t => (
          <span key={t} className="text-[9px] text-[#C4C0BB]">{t}</span>
        ))}
      </div>
    </div>
  );
}

function FunnelChart() {
  return (
    <div>
      <SectionLabel>Campaign funnel</SectionLabel>
      <div className="flex flex-col gap-1">
        {FUNNEL.map((step, i) => (
          <div key={step.label}>
            {step.drop && (
              <p className="text-[9px] text-[#C4C0BB] pl-[68px] mb-1">↓ {step.drop}</p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#6B6560] w-[60px] text-right shrink-0">{step.label}</span>
              <div className="flex-1 bg-[#F3F0EB] rounded h-7 overflow-hidden">
                <div
                  className={`h-full ${step.color} rounded flex items-center px-2.5 transition-all`}
                  style={{ width: `${Math.max(step.pct, 3)}%` }}
                >
                  <span className={`text-[10px] font-medium ${step.textColor}`}>{step.value.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#1A1410] w-9 shrink-0">{step.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────
export default function CampaignPerformance({ navigate }) {
  const [pulseVisible, setPulseVisible] = useState(true);

  // live dot pulse
  useEffect(() => {
    const id = setInterval(() => setPulseVisible(v => !v), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex-1 overflow-hidden bg-[#FAF8F5] flex flex-col h-full">

      {/* ── Top bar ── */}
      <div className="px-5 py-3.5 bg-white border-b border-black/[0.07] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate?.("Campaigns")}
            className="w-7 h-7 rounded-lg bg-[#F3F0EB] flex items-center justify-center text-[#6B6560] hover:bg-[#EAE7E2] transition-colors"
          >
            <Icon path={ICONS.back} className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold text-[#1A1410] leading-tight">
              Ghoster List · Re-engagement
            </h1>
            <p className="text-[11px] text-[#9C9691]">
              WhatsApp · Launched today at 9:14 AM · 2h 43m running
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-emerald-500 transition-opacity duration-300 ${pulseVisible ? "opacity-100" : "opacity-30"}`}
            />
            <span className="text-[11px] font-medium text-emerald-800">Live</span>
          </div>
          <button className="w-7 h-7 rounded-lg bg-[#F3F0EB] flex items-center justify-center text-[#6B6560] hover:bg-[#EAE7E2] transition-colors">
            <Icon path={ICONS.dots} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ════ LEFT — Main content ════ */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* Delivery KPIs */}
          <div>
            <SectionLabel>Delivery overview</SectionLabel>
            <div className="grid grid-cols-4 gap-2.5">
              <KpiCard label="Recipients" value="4,830" sub="customers targeted" />
              <KpiCard label="Delivered"  value="4,701" delta="97.3%" deltaType="up" />
              <KpiCard label="Read"       value="3,998" delta="85.1%" deltaType="up" />
              <KpiCard label="Clicked"    value="918"   delta="19.5% CTR" deltaType="hi" />
            </div>
          </div>

          {/* Revenue KPIs */}
          <div className="grid grid-cols-4 gap-2.5">
            <KpiCard label="Orders"    value="142"     sub="converted so far" />
            <KpiCard label="Revenue"   value="₹81,200" delta="vs ₹68K last run" deltaType="up" />
            <KpiCard label="Avg. order" value="₹572"   sub="per conversion" />
            <KpiCard label="ROI"       value="11.8×"   delta="vs 9.2× prior"   deltaType="up" />
          </div>

          {/* Timeline + Funnel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-black/[0.07] rounded-xl p-4">
              <TimelineChart />
            </div>
            <div className="bg-white border border-black/[0.07] rounded-xl p-4">
              <FunnelChart />
            </div>
          </div>

          {/* Cities + Personas/Devices */}
          <div className="grid grid-cols-2 gap-4">

            {/* Top cities */}
            <div className="bg-white border border-black/[0.07] rounded-xl p-4">
              <SectionLabel>Top performing cities</SectionLabel>
              <div className="flex flex-col gap-2.5">
                {CITIES.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="text-[12px] text-[#1A1410] w-20 shrink-0">{c.name}</span>
                    <div className="flex-1 bg-[#F3F0EB] rounded-sm h-1.5 overflow-hidden">
                      <div className="h-full bg-[#FF6B35] rounded-sm" style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-[11px] text-[#6B6560] w-16 text-right shrink-0">{c.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personas + Devices */}
            <div className="bg-white border border-black/[0.07] rounded-xl p-4 flex flex-col gap-4">
              <div>
                <SectionLabel>Top personas converted</SectionLabel>
                <div className="flex flex-wrap gap-1.5">
                  {PERSONAS.map(p => (
                    <div
                      key={p.name}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF0EA] border border-[#FF6B35]/20"
                    >
                      <span className="text-[13px]">{p.emoji}</span>
                      <span className="text-[11px] font-medium text-[#C2410C]">{p.name}</span>
                      <span className="text-[10px] text-[#9C9691]">· {p.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-black/[0.06]" />

              <div>
                <SectionLabel>Device breakdown</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {DEVICES.map(d => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="text-[12px] text-[#1A1410] w-14 shrink-0">{d.label}</span>
                      <div className="flex-1 bg-[#F3F0EB] rounded-sm h-1.5 overflow-hidden">
                        <div className={`h-full rounded-sm ${d.color}`} style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="text-[11px] text-[#6B6560] w-7 text-right shrink-0">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Failed deliveries */}
          <div className="bg-white border border-black/[0.07] rounded-xl p-4">
            <SectionLabel>Failed deliveries · 129 messages</SectionLabel>
            <div className="flex flex-col divide-y divide-black/[0.05]">
              {FAILED.map(f => (
                <div key={f.name} className="flex items-center gap-3 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#F3F0EB] flex items-center justify-center text-[10px] font-medium text-[#6B6560] shrink-0">
                    {f.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1A1410]">{f.name} <span className="text-[#9C9691]">{f.phone}</span></p>
                    <p className="text-[10px] text-[#9C9691]">{f.reason}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-red-50 text-red-800 shrink-0">
                    {f.badge}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-2 w-full text-center text-[11px] text-[#FF6B35] hover:text-[#E55A26] transition-colors">
              View all 129 failed →
            </button>
          </div>

        </div>

        {/* ════ RIGHT — Sidebar ════ */}
        <div className="w-52 shrink-0 overflow-y-auto bg-white border-l border-black/[0.07] p-4 flex flex-col gap-4">

          {/* ROI callout */}
          <div>
            <SectionLabel>ROI</SectionLabel>
            <p className="text-[34px] font-semibold text-[#FF6B35] leading-none">11.8×</p>
            <p className="text-[11px] text-[#9C9691] mt-1">₹81,200 rev · ₹6,880 spend</p>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Key numbers */}
          <div>
            <SectionLabel>Key numbers</SectionLabel>
            <div className="flex flex-col divide-y divide-black/[0.05]">
              {MINI_KPIS.map(k => (
                <div key={k.label} className="flex justify-between items-center py-1.5">
                  <span className="text-[11px] text-[#9C9691]">{k.label}</span>
                  <span className="text-[12px] font-medium text-[#1A1410]">{k.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Live feed */}
          <div>
            <SectionLabel>Live feed</SectionLabel>
            <div className="flex flex-col divide-y divide-black/[0.05]">
              {LIVE_FEED.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#F3F0EB] flex items-center justify-center text-[9px] font-medium text-[#6B6560] shrink-0">
                    {item.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#1A1410] leading-none">{item.name}</p>
                    <p className="text-[9px] text-[#9C9691]">{item.time}</p>
                  </div>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0 ${item.eventStyle}`}>
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate?.("Campaigns")}
              className="w-full py-2.5 rounded-xl text-[12px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors flex items-center justify-center gap-1.5"
            >
              <Icon path={ICONS.rocket} className="w-3.5 h-3.5" />
              Follow-up campaign
            </button>
            <button className="w-full py-2.5 rounded-xl text-[12px] font-medium bg-[#F3F0EB] text-[#6B6560] hover:bg-[#EAE7E2] transition-colors flex items-center justify-center gap-1.5">
              <Icon path={ICONS.download} className="w-3.5 h-3.5" />
              Export report
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}