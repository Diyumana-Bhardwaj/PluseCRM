import { CAMPAIGN_METRICS, TIMELINE_EVENTS } from "../constants/dashboardData";
function MetricRow({ label, value, total, showBar }) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-[#9C9691]">{label}</span>
        <span className="text-[12px] font-semibold text-[#1A1410]">
          {total ? `${value} / ${total}` : value}
        </span>
      </div>
      {showBar && (
        <div className="h-1 bg-[#F3F0EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF6B35] rounded-full transition-all"
            style={{ width: `${Math.round((value / total) * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function TimelineEvent({ ev, isLast }) {
  return (
    <div className="flex gap-2.5">
      <p className="text-[10px] text-[#9C9691] min-w-[36px] pt-0.5 shrink-0">{ev.time}</p>
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-2 h-2 rounded-full mt-1 shrink-0"
          style={{ background: ev.dotColor }}
        />
        {!isLast && <div className="w-px flex-1 bg-black/[0.08] min-h-[20px]" />}
      </div>
      <div className="pb-3">
        <p className={`text-[12px] font-medium ${ev.status === "pending" ? "text-[#C4BFB9]" : "text-[#1A1410]"}`}>
          {ev.title}
        </p>
        <p className={`text-[11px] ${ev.status === "active" ? "text-[#FF6B35] font-medium" : ev.status === "pending" ? "text-[#C4BFB9]" : "text-[#6B6560]"}`}>
          {ev.detail}
        </p>
      </div>
    </div>
  );
}

export default function LiveFeed() {
  return (
    <aside className="w-[350px] shrink-0 bg-white border-l border-black/[0.08] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-black/[0.07] flex items-center justify-between shrink-0">
        <div>
          <p className="text-[13px] font-semibold text-[#1A1410]">Campaign Progress</p>
          <p className="text-[11px] text-[#9C9691] mt-0.5">Ghost Diners · WhatsApp</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Metrics */}
      <div className="px-4 pt-3.5 pb-1 border-b border-black/[0.07] shrink-0">
        {CAMPAIGN_METRICS.map((m) => (
          <MetricRow key={m.label} {...m} />
        ))}

        {/* Revenue callout */}
        <div className="mt-3 bg-[#F3F0EB] rounded-lg px-3 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-[#6B6560] font-medium">Revenue so far</span>
          <span className="text-[14px] font-bold text-green-600">₹12,400</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-3 pt-3">
        <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.7px] px-1 mb-2.5">Delivery Timeline</p>
        {TIMELINE_EVENTS.map((ev, i) => (
          <TimelineEvent key={ev.time} ev={ev} isLast={i === TIMELINE_EVENTS.length - 1} />
        ))}
      </div>

      {/* Footer totals */}
      <div className="px-3 py-2.5 border-t border-black/[0.07] bg-[#F3F0EB] shrink-0">
        {[
          ["Messages sent", "184 / 187", false],
          ["Orders placed",  "17",        true],
          ["Revenue today",  "₹12,400",   true],
        ].map(([lbl, val, green]) => (
          <div key={lbl} className="flex justify-between text-[11px] mb-1 last:mb-0">
            <span className="text-[#9C9691]">{lbl}</span>
            <span className={`font-semibold ${green ? "text-green-600" : "text-[#1A1410]"}`}>{val}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}