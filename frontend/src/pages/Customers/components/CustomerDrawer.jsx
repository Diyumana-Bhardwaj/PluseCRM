import Icon from "./Icon";
import { ICONS } from "../DummyData/CustomerData";
import { daysLabel } from "../utils/dateHelper";
export default function CustomerDrawer({ customer: c, onClose }) {
  if (!c) return null;

  // ── RFM: backend returns rfm_r/rfm_f/rfm_m + rfm_score string
  // Seed data stores rfm as a 3-char string e.g. "453"
  // Support both shapes gracefully.
  const rfmR = c.rfm_r ?? Number(c.rfm?.[0]) ?? "—";
  const rfmF = c.rfm_f ?? Number(c.rfm?.[1]) ?? "—";
  const rfmM = c.rfm_m ?? Number(c.rfm?.[2]) ?? "—";

  // ── Status badge style ────────────────────────────────────────────────────
  function statusStyle(s) {
    switch (s) {
      case "Active":     return "bg-green-50 text-green-700";
      case "High Value": return "bg-purple-50 text-purple-700";
      case "At Risk":    return "bg-amber-50 text-amber-700";
      case "Dormant":    return "bg-gray-100 text-gray-500";
      default:           return "bg-gray-100 text-gray-500";
    }
  }

  // ── Recommended campaign: driven by RFM, not hardcoded persona label ──────
  function recommendedCampaign() {
    if (rfmR >= 4 && rfmM >= 4) return { name: "VIP Reward Drop",      desc: "Reward your top spenders" };
    if (rfmR <= 2 && rfmF >= 3) return { name: "Win-Back Campaign",    desc: "Re-engage before they're gone" };
    if (rfmR <= 2)               return { name: "Reactivation Nudge",   desc: "Long time no see" };
    if (rfmF >= 4)               return { name: "Loyalty Booster",      desc: "Keep the streak going" };
    return                              { name: "Stay Connected",        desc: "General engagement push" };
  }
  const campaign = recommendedCampaign();

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[340px] z-50 bg-white border-l border-black/[0.08] flex flex-col shadow-xl">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-black/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0EA] flex items-center justify-center text-[14px] font-bold text-[#FF6B35]">
              {c.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#1A1410]">{c.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                  style={{ background: c.persona?.bg, color: c.persona?.color }}
                >
                  {c.persona?.label}
                </span>
                {c.status && (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${statusStyle(c.status)}`}>
                    {c.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#9C9691] hover:text-[#1A1410] transition-colors mt-0.5">
            <Icon d={ICONS.x} className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── Persona description (Gemini-generated) ── */}
          {c.persona?.description && (
            <>
              <div className="mb-4 bg-[#FAF8F5] rounded-xl px-4 py-3 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full shrink-0 mt-0.5" style={{ background: c.persona.bg }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.persona.color }} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold mb-0.5" style={{ color: c.persona.color }}>
                    {c.persona.label}
                  </p>
                  <p className="text-[12px] text-[#6B6560] leading-relaxed">{c.persona.description}</p>
                </div>
              </div>
              <div className="h-px bg-black/[0.07] mb-4" />
            </>
          )}

          {/* ── Contact ── */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Contact</p>
            <div className="space-y-2">
              {[
                { icon: ICONS.mail,  val: c.email },
                c.phone && { icon: ICONS.phone, val: c.phone },
              ].filter(Boolean).map(({ icon, val }) => (
                <div key={val} className="flex items-center gap-2.5 text-[12px] text-[#6B6560]">
                  <Icon d={icon} className="w-3.5 h-3.5 text-[#9C9691]" />
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-black/[0.07] mb-4" />

          {/* ── Demographics (only fields that exist) ── */}
          {(c.city || c.gender || c.age) && (
            <>
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Demographics</p>
                <div className="grid grid-cols-3 gap-2">
                  {c.city && (
                    <div className="bg-[#FAF8F5] rounded-xl px-3 py-2.5">
                      <p className="text-[10px] text-[#9C9691] mb-0.5">City</p>
                      <p className="text-[13px] font-semibold text-[#1A1410] truncate">{c.city}</p>
                    </div>
                  )}
                  {c.gender && (
                    <div className="bg-[#FAF8F5] rounded-xl px-3 py-2.5">
                      <p className="text-[10px] text-[#9C9691] mb-0.5">Gender</p>
                      <p className="text-[13px] font-semibold text-[#1A1410]">{c.gender}</p>
                    </div>
                  )}
                  {c.age && (
                    <div className="bg-[#FAF8F5] rounded-xl px-3 py-2.5">
                      <p className="text-[10px] text-[#9C9691] mb-0.5">Age</p>
                      <p className="text-[13px] font-semibold text-[#1A1410]">{c.age} yrs</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-px bg-black/[0.07] mb-4" />
            </>
          )}

          {/* ── Activity ── */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Activity</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { lbl: "Orders",      val: c.orders },
                { lbl: "Total Spend", val: `₹${c.spend.toLocaleString()}` },
                { lbl: "Avg Order",   val: `₹${(c.avgOrder ?? Math.round(c.spend / c.orders)).toLocaleString()}` },
                { lbl: "Last Order",  val: daysLabel(c.daysAgo) },
              ].map(({ lbl, val }) => (
                <div key={lbl} className="bg-[#FAF8F5] rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-[#9C9691] mb-0.5">{lbl}</p>
                  <p className="text-[14px] font-semibold text-[#1A1410]">{val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-black/[0.07] mb-4" />

          {/* ── RFM Score ── */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">RFM Score</p>
            <div className="bg-[#FAF8F5] rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                {[
                  { val: rfmR, lbl: "Recency",   tip: "How recently they ordered" },
                  { val: rfmF, lbl: "Frequency",  tip: "How often they order" },
                  { val: rfmM, lbl: "Monetary",   tip: "How much they spend" },
                ].map(({ val, lbl, tip }, i) => (
                  <>
                    {i > 0 && <div key={`sep-${i}`} className="text-[#C4C0BB] text-lg">·</div>}
                    <div key={lbl} className="text-center">
                      <p className="text-[22px] font-bold text-[#1A1410] leading-none">{val}</p>
                      <p className="text-[10px] text-[#9C9691] mt-1">{lbl}</p>
                      <p className="text-[9px] text-[#C4C0BB] mt-0.5">{tip}</p>
                    </div>
                  </>
                ))}
              </div>
              {/* Score bar visual */}
              <div className="flex gap-1 mt-1">
                {[rfmR, rfmF, rfmM].map((score, i) => (
                  <div key={i} className="flex-1 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(Number(score) / 5) * 100}%`,
                        background: Number(score) >= 4 ? "#16A34A" : Number(score) >= 3 ? "#FF6B35" : "#9C9691",
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-[#C4C0BB] mt-1.5 text-right">Score out of 5</p>
            </div>
          </div>

          <div className="h-px bg-black/[0.07] mb-4" />

          {/* ── Recommended Campaign ── */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Recommended Campaign</p>
            <div className="bg-[#FFF0EA] border border-[#FF6B35]/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <Icon d={ICONS.campaign} className="w-4 h-4 text-[#FF6B35]" />
              <div>
                <p className="text-[13px] font-semibold text-[#1A1410]">{campaign.name}</p>
                <p className="text-[11px] text-[#9C7060]">{campaign.desc}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}