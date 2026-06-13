import {useState} from "react";
import Icon from "./Icon";
import { ICONS } from "../DummyData/CustomerData";
export default function AICampaignBrief({ filtered }) {
  const [open, setOpen] = useState(false);

  const totalCustomers = filtered.length;
  if (totalCustomers === 0) return null;

  // ── Core stats ────────────────────────────────────────────────────────────
  const avgSpend    = Math.round(filtered.reduce((s, c) => s + c.spend,    0) / totalCustomers);
  const avgOrder    = Math.round(filtered.reduce((s, c) => s + (c.avgOrder ?? Math.round(c.spend / c.orders)), 0) / totalCustomers);
  const avgOrders   = (filtered.reduce((s, c) => s + c.orders, 0) / totalCustomers).toFixed(1);
  const avgInactive = Math.round(filtered.reduce((s, c) => s + c.daysAgo,  0) / totalCustomers);
  const repeatPct   = Math.round(filtered.filter(c => c.orders > 1).length / totalCustomers * 100);

  // ── Status breakdown ──────────────────────────────────────────────────────
  const dormantCnt = filtered.filter(c => c.status === "Dormant").length;
  const activeCnt  = filtered.filter(c => c.status === "Active").length;
  const hvCnt      = filtered.filter(c => c.status === "High Value").length;
  const atRiskCnt  = filtered.filter(c => c.status === "At Risk").length;

  // ── Persona breakdown — fully dynamic, no hardcoded labels ───────────────
  const personaCounts = filtered.reduce((acc, c) => {
    const lbl = c.persona?.label;
    if (lbl) acc[lbl] = (acc[lbl] || 0) + 1;
    return acc;
  }, {});
  // Dominant persona = largest group
  const dominantPersona = Object.entries(personaCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "All Customers";


  const lapsedPct   = Math.round((dormantCnt + atRiskCnt) / totalCustomers * 100);
  const campaignType =
    lapsedPct >= 40  ? "win-back" :
    hvCnt / totalCustomers >= 0.3 ? "vip-nurture" :
    repeatPct >= 60  ? "loyalty"  : "engagement";

  const CAMPAIGN_META = {
    "win-back":    { name: "Win-back",         priority: "HIGH PRIORITY",   confidence: "89%" },
    "vip-nurture": { name: "VIP Nurture",      priority: "MEDIUM PRIORITY", confidence: "84%" },
    "loyalty":     { name: "Loyalty Booster",  priority: "MEDIUM PRIORITY", confidence: "81%" },
    "engagement":  { name: "Stay Connected",   priority: "LOW PRIORITY",    confidence: "76%" },
  };
  const meta = CAMPAIGN_META[campaignType];

  const convRate    = avgInactive < 30 ? 0.28 : avgInactive < 60 ? 0.21 : 0.14;
  const potentialRevenue = (totalCustomers * avgOrder * convRate)
    .toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const predictedOrders  = Math.round(totalCustomers * convRate);
  const convPct          = Math.round(convRate * 100);

  const openRate = campaignType === "win-back" ? "81%" : campaignType === "vip-nurture" ? "74%" : "68%";
  const ctr      = campaignType === "win-back" ? "24%" : campaignType === "vip-nurture" ? "19%" : "15%";


  const offers =
    avgSpend > 5000  ? ["Exclusive VIP offer", "Early access", "Complimentary upgrade"] :
    avgSpend > 2000  ? ["20% off", "Free delivery", "Combo upgrade"] :
                       ["₹50 cashback", "Buy 1 Get 1", "Free add-on"];

  const reasons = [
    lapsedPct >= 40
      ? `${lapsedPct}% of this group is dormant or at risk`
      : `${repeatPct}% are repeat customers — high engagement potential`,
    `Average inactivity of ${avgInactive} days detected`,
    `Avg order value ₹${avgOrder.toLocaleString()} — ${avgOrder > 1000 ? "strong" : "moderate"} revenue potential`,
    campaignType === "win-back" ? "Win-back campaigns recover ~24% of similar cohorts" : "Loyalty campaigns lift LTV by 18% on average",
    "WhatsApp performs best for this demographic",
  ];

  const segmentReasons = [
    lapsedPct > 0
      ? `${lapsedPct}% lapsed or at-risk — approaching churn threshold`
      : `${activeCnt} active customers with strong re-engagement potential`,
    `Average inactivity ${avgInactive}d — ${avgInactive > 45 ? "critical" : "moderate"} urgency`,
    `Win-back campaigns historically recovered 24% of similar cohorts`,
    `Estimated revenue opportunity ₹${potentialRevenue} at ${convPct}% predicted conversion`,
  ];

  // ── City breakdown ────────────────────────────────────────────────────────
  const cityCounts = filtered.reduce((acc, c) => {
    if (c.city) acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([city, count]) => ({ city, pct: Math.round(count / totalCustomers * 100) }));

  // ── Coupon usage: estimated from spend variance (higher variance = more deal-seekers) ──
  const spends      = filtered.map(c => c.spend);
  const meanSpend   = spends.reduce((a, b) => a + b, 0) / spends.length;
  const stdDev      = Math.sqrt(spends.reduce((a, b) => a + (b - meanSpend) ** 2, 0) / spends.length);
  const couponPct   = Math.min(85, Math.max(30, Math.round(50 + (stdDev / meanSpend) * 40)));

  return (
    <div className="mb-5">
      {/* collapsed toggle bar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-white border border-black/[0.08] rounded-xl px-4 py-3 hover:bg-[#FAF8F5] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EEEDFE] text-[#534AB7]">🤖 AI Campaign Brief</span>
          <span className="text-[13px] font-medium text-[#1A1410]">
            {dominantPersona} {meta.name} — {totalCustomers.toLocaleString()} customers
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAECE7] text-[#993C1D] font-medium">{meta.priority}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#E1F5EE] text-[#0F6E56] font-medium">{meta.confidence} confidence</span>
        </div>
        <Icon d={open ? ICONS.x : ICONS.chevron} className="w-3.5 h-3.5 text-[#9C9691]" />
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-3 gap-3">

          {/* ── Col 1: Brief + Impact ── */}
          <div className="bg-white border border-black/[0.08] rounded-xl p-4 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Audience</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-[#1A1410]">{dominantPersona}</span>
                <span className="text-[12px] text-[#6B6560]">{totalCustomers} customers</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#9C9691] border border-black/[0.06]">RFM + KMeans</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Why AI recommends this</p>
              <div className="space-y-1.5">
                {reasons.map(r => (
                  <div key={r} className="flex items-center gap-2 text-[12px] text-[#1A1410]">
                    <Icon d={ICONS.check} className="w-3 h-3 text-green-500 shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Business impact</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { lbl: "Potential revenue", val: `₹${potentialRevenue}` },
                  { lbl: "Predicted orders",  val: predictedOrders },
                  { lbl: "Expected open rate",val: openRate },
                  { lbl: "Expected CTR",      val: ctr },
                  { lbl: "Conversion",        val: `${convPct}%` },
                ].map(({ lbl, val }) => (
                  <div key={lbl} className="bg-[#FAF8F5] rounded-xl px-3 py-2">
                    <p className="text-[10px] text-[#9C9691]">{lbl}</p>
                    <p className="text-[14px] font-semibold text-[#1A1410]">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Recommended offer</p>
              <div className="flex gap-2 flex-wrap">
                {offers.map(o => (
                  <span key={o} className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#FAF8F5] text-[#6B6560] border border-black/[0.06]">{o}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 2: Customer Analysis ── */}
          <div className="bg-white border border-black/[0.08] rounded-xl p-4">
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-3">Customer analysis</p>
            <div className="space-y-0">
              {[
                { lbl: "Total customers",   val: totalCustomers.toLocaleString() },
                { lbl: "Average spend",     val: `₹${avgSpend.toLocaleString()}` },
                { lbl: "Avg order value",   val: `₹${avgOrder.toLocaleString()}` },
                { lbl: "Average orders",    val: avgOrders },
                { lbl: "Avg inactive days", val: avgInactive },
                { lbl: "Dominant persona",  val: dominantPersona },
                { lbl: "Repeat customers",  val: `${repeatPct}%` },
                { lbl: "Campaign type",     val: meta.name },
                { lbl: "Est. conversion",   val: `${convPct}%` },
                { lbl: "Pref. channel",     val: "WhatsApp" },
              ].map(({ lbl, val }) => (
                <div key={lbl} className="flex items-center justify-between py-[5px] border-b border-black/[0.05] last:border-0">
                  <span className="text-[12px] text-[#9C9691]">{lbl}</span>
                  <span className="text-[12px] font-semibold text-[#1A1410]">{val}</span>
                </div>
              ))}
            </div>

            {topCities.length > 0 && (
              <>
                <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mt-3 mb-2">Cities</p>
                <div className="space-y-1.5">
                  {topCities.map(({ city, pct }) => (
                    <div key={city} className="flex items-center gap-2">
                      <span className="text-[11px] text-[#9C9691] w-20 shrink-0">{city}</span>
                      <div className="flex-1 h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#AFA9EC] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-medium text-[#1A1410] w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Col 3: Breakdown + Reasoning ── */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-black/[0.08] rounded-xl p-4 flex-1">
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-3">Customer breakdown</p>

              <p className="text-[10px] font-semibold text-[#C4C0BB] uppercase tracking-[0.5px] mb-1.5">By value</p>
              {[
                { lbl: "High value", val: hvCnt,                   pct: Math.round(hvCnt / totalCustomers * 100),                        color: "#1D9E75",             opacity: 1   },
                { lbl: "Medium",     val: atRiskCnt + activeCnt,   pct: Math.round((atRiskCnt + activeCnt) / totalCustomers * 100),      color: "#1D9E75",             opacity: 0.6 },
                { lbl: "Low",        val: dormantCnt,               pct: Math.round(dormantCnt / totalCustomers * 100),                   color: "#1D9E75",             opacity: 0.3 },
              ].map(({ lbl, val, pct, color, opacity }) => (
                <div key={lbl} className="flex items-center gap-2 py-[4px]">
                  <span className="text-[11px] text-[#9C9691] w-16 shrink-0">{lbl}</span>
                  <div className="flex-1 h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 4)}%`, background: color, opacity }} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1A1410] w-6 text-right">{val}</span>
                </div>
              ))}

              <div className="h-px bg-black/[0.05] my-2.5" />
              <p className="text-[10px] font-semibold text-[#C4C0BB] uppercase tracking-[0.5px] mb-1.5">By status</p>
              {[
                { lbl: "Dormant",    val: dormantCnt, pct: Math.round(dormantCnt / totalCustomers * 100), color: "#EF9F27" },
                { lbl: "Active",     val: activeCnt,  pct: Math.round(activeCnt  / totalCustomers * 100), color: "#1D9E75" },
                { lbl: "At Risk",    val: atRiskCnt,  pct: Math.round(atRiskCnt  / totalCustomers * 100), color: "#E55A26" },
                { lbl: "High Value", val: hvCnt,      pct: Math.round(hvCnt      / totalCustomers * 100), color: "#7C3AED" },
              ].filter(({ val }) => val > 0).map(({ lbl, val, pct, color }) => (
                <div key={lbl} className="flex items-center gap-2 py-[4px]">
                  <span className="text-[11px] text-[#9C9691] w-16 shrink-0">{lbl}</span>
                  <div className="flex-1 h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 4)}%`, background: color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#1A1410] w-6 text-right">{val}</span>
                </div>
              ))}

              <div className="h-px bg-black/[0.05] my-2.5" />
              <p className="text-[10px] font-semibold text-[#C4C0BB] uppercase tracking-[0.5px] mb-2">Coupon usage</p>
              <div className="flex rounded-full overflow-hidden h-2 mb-1.5">
                <div style={{ width: `${couponPct}%`, background: "#AFA9EC" }} />
                <div style={{ flex: 1, background: "#F3F0EB" }} />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#9C9691]">Coupon users <span className="font-semibold text-[#1A1410]">{couponPct}%</span></span>
                <span className="text-[#9C9691]">Non-coupon <span className="font-semibold text-[#1A1410]">{100 - couponPct}%</span></span>
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] rounded-xl p-4">
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Why this segment?</p>
              <div className="space-y-2">
                {segmentReasons.map(r => (
                  <div key={r} className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#AFA9EC] mt-1.5 shrink-0" />
                    <span className="text-[12px] text-[#6B6560]">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}