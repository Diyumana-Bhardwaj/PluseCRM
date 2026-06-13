import { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

// ─── icons ────────────────────────────────────────────────────────────────
function Icon({ path, className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
const IC = {
  back:     "M15 19l-7-7 7-7",
  sparkle:  "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  arrow:    "M5 10l7-7m0 0l7 7m-7-7v18",
  arrowD:   "M19 14l-7 7m0 0l-7-7m7 7V3",
  rocket:   "M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.96 2.91m0 0a6 6 0 01-8.457-8.456m8.456 8.456a6.001 6.001 0 00-8.456-8.456m0 0a14.926 14.926 0 012.916-5.97m0 0A14.98 14.98 0 0115.59 2m0 0h.59M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check:    "M5 13l4 4L19 7",
  chevron:  "M19 9l-7 7-7-7",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
};

// ─── data ─────────────────────────────────────────────────────────────────
const RANGES = ["Past 7 days", "Past month", "Past quarter", "Custom"];

const EXEC_KPIS = [
  { label: "Total revenue",    value: "₹12.4L",  delta: "+18%",  up: true  },
  { label: "Campaign spend",   value: "₹88,200", delta: "+4%",   up: false },
  { label: "Blended ROI",      value: "14.1×",   delta: "+22%",  up: true  },
  { label: "Orders",           value: "2,841",   delta: "+31%",  up: true  },
  { label: "Avg. order value", value: "₹436",    delta: "+8%",   up: true  },
  { label: "Repeat rate",      value: "38%",     delta: "+5pp",  up: true  },
  { label: "New customers",    value: "1,204",   delta: "+12%",  up: true  },
  { label: "Predicted churn",  value: "231",     delta: "next 7d", up: false, warn: true },
];

const CAMPAIGNS_TABLE = [
  { name: "Ghoster List",       channel: "WhatsApp", roi: "11.8×", revenue: "₹81,200", ctr: "19.5%", orders: 142, status: "Live",      statusStyle: "bg-emerald-50 text-emerald-800" },
  { name: "Weekend Warriors",   channel: "WhatsApp", roi: "9.2×",  revenue: "₹63,400", ctr: "22.1%", orders: 118, status: "Completed", statusStyle: "bg-gray-100 text-gray-600" },
  { name: "VIP Exclusives",     channel: "Email",    roi: "18.4×", revenue: "₹1.1L",   ctr: "31.4%", orders: 204, status: "Completed", statusStyle: "bg-gray-100 text-gray-600" },
  { name: "Lapsed 60d",         channel: "SMS",      roi: "4.1×",  revenue: "₹28,800", ctr: "9.8%",  orders: 54,  status: "Paused",    statusStyle: "bg-amber-50 text-amber-800" },
  { name: "Birthday Offers",    channel: "RCS",      roi: "22.6×", revenue: "₹1.4L",   ctr: "44.2%", orders: 311, status: "Completed", statusStyle: "bg-gray-100 text-gray-600" },
  { name: "Monday Flash Sale",  channel: "WhatsApp", roi: "3.2×",  revenue: "₹18,100", ctr: "7.3%",  orders: 29,  status: "Completed", statusStyle: "bg-gray-100 text-gray-600" },
];

const AI_INSIGHTS = [
  { text: "WhatsApp campaigns generated 34% more revenue than SMS this month.",        action: null },
  { text: "Delhi customers respond best after 8 PM — reschedule evening campaigns.",   action: "Reschedule" },
  { text: "Ghost Diners have the highest recovery rate across all personas.",           action: null },
  { text: "Premium Diners ignore discounts but respond strongly to exclusivity.",       action: "Create campaign" },
  { text: "Weekend Warriors represent ₹2.4L in untapped revenue this quarter.",        action: "Create campaign" },
  { text: "Female customers have 18% higher repeat purchase rates.",                    action: null },
  { text: "SMS performance dropped 12% compared to last month — review copy.",         action: null },
  { text: "231 customers are predicted to churn in the next 7 days.",                  action: "Re-engage now" },
];

const CHANNEL_LABELS = ["WhatsApp", "SMS", "Email", "RCS"];
const CHANNEL_REVENUE = [420000, 180000, 310000, 95000];
const CHANNEL_ORDERS  = [1240, 420, 890, 291];

// ─── reusable primitives ──────────────────────────────────────────────────
function SectionLabel({ children }) {
  return <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">{children}</p>;
}

function KpiCard({ label, value, delta, up, warn }) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl px-3.5 py-3">
      <p className="text-[10px] text-[#9C9691] mb-1">{label}</p>
      <p className={`text-[20px] font-semibold leading-none ${warn ? "text-amber-600" : "text-[#1A1410]"}`}>{value}</p>
      {delta && (
        <span className={`inline-flex items-center gap-0.5 mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
          warn ? "bg-amber-50 text-amber-700" : up ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
        }`}>
          {!warn && <Icon path={up ? IC.arrow : IC.arrowD} className="w-2.5 h-2.5" />}
          {delta}
        </span>
      )}
    </div>
  );
}

// ─── chart components ─────────────────────────────────────────────────────
function RevenueAreaChart() {
  const ref = useRef(null);
  useEffect(() => {
    const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const data   = [38000,52000,41000,67000,74000,91000,58000,62000,78000,55000,83000,97000,110000,124000];
    const chart  = new Chart(ref.current, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Revenue",
          data,
          borderColor: "#FF6B35",
          backgroundColor: "rgba(255,107,53,0.07)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          callbacks: { label: ctx => `₹${(ctx.parsed.y/1000).toFixed(0)}K` }
        }},
        scales: {
          x: { grid: { display: false }, ticks: { color: "#9C9691", font: { size: 10 } } },
          y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { color: "#9C9691", font: { size: 10 }, callback: v => `₹${v/1000}K` } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <SectionLabel>Revenue trend</SectionLabel>
      <div className="relative h-[160px]">
        <canvas ref={ref} role="img" aria-label="Area chart showing revenue trend over the past two weeks, rising from ₹38K to ₹1.24L">Revenue grew from ₹38K to ₹1.24L over 14 days.</canvas>
      </div>
    </div>
  );
}

function ChannelChart() {
  const ref = useRef(null);
  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: CHANNEL_LABELS,
        datasets: [
          {
            label: "Revenue (₹)",
            data: CHANNEL_REVENUE,
            backgroundColor: ["#FF6B35","#6B7280","#3B82F6","#10B981"],
            borderRadius: 4,
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          callbacks: { label: ctx => `₹${(ctx.parsed.y/1000).toFixed(0)}K` }
        }},
        scales: {
          x: { grid: { display: false }, ticks: { color: "#9C9691", font: { size: 10 } } },
          y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { color: "#9C9691", font: { size: 10 }, callback: v => `₹${v/1000}K` } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <SectionLabel>Revenue by channel</SectionLabel>
      <div className="flex gap-2 mb-3 flex-wrap">
        {CHANNEL_LABELS.map((ch, i) => (
          <span key={ch} className="flex items-center gap-1 text-[10px] text-[#6B6560]">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: ["#FF6B35","#6B7280","#3B82F6","#10B981"][i] }} />
            {ch}
          </span>
        ))}
      </div>
      <div className="relative h-[130px]">
        <canvas ref={ref} role="img" aria-label="Bar chart showing revenue by channel. WhatsApp leads at ₹4.2L, followed by Email ₹3.1L, SMS ₹1.8L, RCS ₹95K">WhatsApp leads revenue at ₹4.2L.</canvas>
      </div>
    </div>
  );
}

function FunnelChart() {
  const steps = [
    { label: "Sent",      val: "48,300", pct: 100 },
    { label: "Delivered", val: "46,912", pct: 97  },
    { label: "Opened",    val: "38,200", pct: 79  },
    { label: "Clicked",   val: "9,180",  pct: 19  },
    { label: "Purchased", val: "2,841",  pct: 5.9 },
  ];
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <SectionLabel>Overall funnel</SectionLabel>
      <div className="flex flex-col gap-1.5 mt-1">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-[10px] text-[#9C9691] w-14 text-right shrink-0">{s.label}</span>
            <div className="flex-1 bg-[#F3F0EB] rounded h-5 overflow-hidden">
              <div
                className="h-full rounded flex items-center px-2"
                style={{ width: `${Math.max(s.pct, 4)}%`, background: i === 4 ? "#10B981" : "#FF6B35", opacity: 1 - i * 0.12 }}
              >
                <span className="text-[9px] font-medium text-white">{s.val}</span>
              </div>
            </div>
            <span className="text-[10px] text-[#1A1410] w-7 shrink-0">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CohortHeatmap() {
  const weeks = ["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6"];
  const cohorts = ["Jan","Feb","Mar","Apr","May","Jun"];
  const data = [
    [100,72,58,44,38,31],
    [100,68,54,41,35],
    [100,74,61,48,40],
    [100,71,57,43],
    [100,76,62],
    [100,69],
  ];
  function opacity(v) { return v == null ? 0.04 : v / 100; }
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <SectionLabel>Cohort retention</SectionLabel>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[9px] text-[#9C9691] font-medium text-left pb-1.5 pr-2 w-8">Cohort</th>
              {weeks.map(w => (
                <th key={w} className="text-[9px] text-[#9C9691] font-medium text-center pb-1.5 px-0.5">{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c, ri) => (
              <tr key={c}>
                <td className="text-[10px] text-[#6B6560] pr-2 py-0.5">{c}</td>
                {weeks.map((_, ci) => {
                  const v = data[ri][ci];
                  return (
                    <td key={ci} className="px-0.5 py-0.5">
                      <div
                        className="w-full h-7 rounded flex items-center justify-center text-[9px] font-medium"
                        style={{
                          background: v != null ? `rgba(255,107,53,${opacity(v)})` : "transparent",
                          color: v != null ? (v > 60 ? "#C2410C" : "#6B6560") : "transparent",
                        }}
                      >
                        {v != null ? `${v}%` : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[9px] text-[#9C9691]">Low</span>
        {[0.08,0.2,0.35,0.55,0.75,1].map((o,i) => (
          <div key={i} className="w-5 h-2.5 rounded-sm" style={{ background: `rgba(255,107,53,${o})` }} />
        ))}
        <span className="text-[9px] text-[#9C9691]">High</span>
      </div>
    </div>
  );
}

function PersonaRevenueChart() {
  const ref = useRef(null);
  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: ["Ghost Diners","Weekend Warriors","VIP Diners","New Visitors","Lapsed 60d"],
        datasets: [
          { label: "WhatsApp", data: [180000,95000,240000,60000,45000], backgroundColor: "#FF6B35", borderRadius: 3 },
          { label: "SMS",      data: [40000, 32000, 80000, 20000,18000], backgroundColor: "#D1D5DB", borderRadius: 3 },
          { label: "Email",    data: [60000, 48000,120000, 35000,28000], backgroundColor: "#93C5FD", borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: {
          callbacks: { label: ctx => `${ctx.dataset.label}: ₹${(ctx.parsed.y/1000).toFixed(0)}K` }
        }},
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: "#9C9691", font: { size: 9 } } },
          y: { stacked: true, grid: { color: "rgba(0,0,0,0.04)" }, ticks: { color: "#9C9691", font: { size: 10 }, callback: v => `₹${v/1000}K` } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <SectionLabel>Revenue by persona</SectionLabel>
      <div className="flex gap-3 mb-3">
        {["WhatsApp","SMS","Email"].map((l,i) => (
          <span key={l} className="flex items-center gap-1 text-[10px] text-[#6B6560]">
            <span className="w-2 h-2 rounded-sm" style={{ background: ["#FF6B35","#D1D5DB","#93C5FD"][i], display:"inline-block" }} />
            {l}
          </span>
        ))}
      </div>
      <div className="relative h-[150px]">
        <canvas ref={ref} role="img" aria-label="Stacked bar chart showing revenue by persona and channel. VIP Diners lead at ₹4.4L total">VIP Diners generate the most revenue.</canvas>
      </div>
    </div>
  );
}

function CampaignTable() {
  const [sort, setSort] = useState("roi");
  const sorted = [...CAMPAIGNS_TABLE].sort((a, b) => {
    if (sort === "roi")     return parseFloat(b.roi)     - parseFloat(a.roi);
    if (sort === "revenue") return parseInt(b.revenue.replace(/[₹,L]/g,"")) - parseInt(a.revenue.replace(/[₹,L]/g,""));
    if (sort === "orders")  return b.orders - a.orders;
    return 0;
  });
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Campaign comparison</SectionLabel>
        <div className="flex gap-1">
          {["roi","revenue","orders"].map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                sort === s ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#F3F0EB]"
              }`}
            >
              {s === "roi" ? "ROI" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="border-b border-black/[0.06]">
              {["Campaign","Channel","ROI","Revenue","CTR","Orders","Status"].map(h => (
                <th key={h} className="text-[10px] font-semibold text-[#9C9691] text-left pb-2 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.05]">
            {sorted.map(c => (
              <tr key={c.name} className="hover:bg-[#FAF8F5] transition-colors">
                <td className="py-2.5 pr-3 text-[12px] font-medium text-[#1A1410] truncate">{c.name}</td>
                <td className="py-2.5 pr-3 text-[11px] text-[#6B6560]">{c.channel}</td>
                <td className="py-2.5 pr-3 text-[12px] font-semibold text-[#FF6B35]">{c.roi}</td>
                <td className="py-2.5 pr-3 text-[12px] text-[#1A1410]">{c.revenue}</td>
                <td className="py-2.5 pr-3 text-[12px] text-[#1A1410]">{c.ctr}</td>
                <td className="py-2.5 pr-3 text-[12px] text-[#1A1410]">{c.orders}</td>
                <td className="py-2.5">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${c.statusStyle}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Leaderboard({ title, data, worst }) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-xl p-4">
      <SectionLabel>{title}</SectionLabel>
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2.5">
            <span className={`text-[11px] font-semibold w-4 shrink-0 ${worst ? "text-red-400" : "text-[#FF6B35]"}`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#1A1410] truncate">{item.name}</p>
              <p className="text-[10px] text-[#9C9691]">{item.sub}</p>
            </div>
            <span className={`text-[12px] font-semibold shrink-0 ${worst ? "text-red-500" : "text-[#FF6B35]"}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiInsightsPanel({ navigate }) {
  const [dismissed, setDismissed] = useState([]);
  const visible = AI_INSIGHTS.filter((_, i) => !dismissed.includes(i));
  return (
    <div className="bg-[#FFF8F5] border border-[#FF6B35]/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon path={IC.sparkle} className="w-3.5 h-3.5 text-[#FF6B35]" />
        <p className="text-[12px] font-semibold text-[#1A1410]">AI insights</p>
        <span className="ml-auto text-[10px] text-[#9C9691]">{visible.length} active</span>
      </div>
      <div className="flex flex-col gap-2">
        {visible.map((ins, vi) => {
          const origIdx = AI_INSIGHTS.indexOf(ins);
          return (
            <div key={origIdx} className="flex items-start gap-2 bg-white border border-[#FF6B35]/10 rounded-lg px-3 py-2.5">
              <Icon path={IC.check} className="w-3 h-3 text-[#FF6B35] mt-0.5 shrink-0" />
              <p className="text-[11px] text-[#6B6560] flex-1 leading-relaxed">{ins.text}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                {ins.action && (
                  <button
                    onClick={() => navigate?.("Campaigns")}
                    className="text-[10px] font-medium text-[#FF6B35] bg-[#FFF0EA] border border-[#FF6B35]/20 px-2 py-0.5 rounded-md hover:bg-[#FFE4D6] transition-colors whitespace-nowrap"
                  >
                    {ins.action}
                  </button>
                )}
                <button
                  onClick={() => setDismissed(d => [...d, origIdx])}
                  className="text-[10px] text-[#C4C0BB] hover:text-[#9C9691] transition-colors px-1"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="text-[11px] text-[#9C9691] text-center py-3">All insights reviewed.</p>
        )}
      </div>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────
export default function Analytics({ navigate }) {
  const [range, setRange] = useState("Past month");
  const [rangeOpen, setRangeOpen] = useState(false);

  return (
    <main className="flex-1 overflow-hidden bg-[#FAF8F5] flex flex-col h-full">

      {/* top bar */}
      <div className="px-5 py-3.5 bg-white border-b border-black/[0.07] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate?.("Dashboard")}
            className="w-7 h-7 rounded-lg bg-[#F3F0EB] flex items-center justify-center text-[#6B6560] hover:bg-[#EAE7E2] transition-colors"
          >
            <Icon path={IC.back} className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold text-[#1A1410] leading-tight">Analytics</h1>
            <p className="text-[11px] text-[#9C9691]">Business performance overview</p>
          </div>
        </div>

        {/* date range picker */}
        <div className="relative">
          <button
            onClick={() => setRangeOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/[0.08] text-[12px] text-[#1A1410] hover:bg-[#F3F0EB] transition-colors"
          >
            <Icon path={IC.calendar} className="w-3.5 h-3.5 text-[#9C9691]" />
            {range}
            <Icon path={IC.chevron} className="w-3 h-3 text-[#9C9691]" />
          </button>
          {rangeOpen && (
            <div className="absolute right-0 top-9 bg-white border border-black/[0.08] rounded-xl shadow-lg py-1 z-20 w-40">
              {RANGES.map(r => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setRangeOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-[12px] hover:bg-[#FAF8F5] transition-colors ${
                    r === range ? "text-[#FF6B35] font-medium" : "text-[#1A1410]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

        {/* exec KPIs */}
        <div>
          <SectionLabel>Executive summary</SectionLabel>
          <div className="grid grid-cols-4 gap-2.5">
            {EXEC_KPIS.slice(0, 4).map(k => <KpiCard key={k.label} {...k} />)}
          </div>
          <div className="grid grid-cols-4 gap-2.5 mt-2.5">
            {EXEC_KPIS.slice(4).map(k => <KpiCard key={k.label} {...k} />)}
          </div>
        </div>

        {/* revenue area + channel bar */}
        <div className="grid grid-cols-2 gap-4">
          <RevenueAreaChart />
          <ChannelChart />
        </div>

        {/* funnel + persona stacked */}
        <div className="grid grid-cols-2 gap-4">
          <FunnelChart />
          <PersonaRevenueChart />
        </div>

        {/* cohort heatmap */}
        <CohortHeatmap />

        {/* leaderboards */}
        <div className="grid grid-cols-2 gap-4">
          <Leaderboard
            title="Top performing campaigns"
            data={[
              { name: "Birthday Offers",  sub: "RCS · 311 orders",    value: "22.6×" },
              { name: "VIP Exclusives",   sub: "Email · 204 orders",  value: "18.4×" },
              { name: "Ghoster List",     sub: "WhatsApp · 142 orders", value: "11.8×" },
            ]}
            worst={false}
          />
          <Leaderboard
            title="Campaigns needing attention"
            data={[
              { name: "Monday Flash Sale", sub: "WhatsApp · 29 orders",  value: "3.2×" },
              { name: "Lapsed 60d",        sub: "SMS · 54 orders",       value: "4.1×" },
              { name: "Weekend Warriors",  sub: "WhatsApp · 118 orders", value: "9.2×" },
            ]}
            worst={true}
          />
        </div>

        {/* campaign comparison table */}
        <CampaignTable />

        {/* AI insights */}
        <AiInsightsPanel navigate={navigate} />

        <div className="h-2" />
      </div>
    </main>
  );
}