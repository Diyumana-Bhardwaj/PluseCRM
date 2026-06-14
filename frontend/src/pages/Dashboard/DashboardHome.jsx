import { useState, useEffect, useRef} from "react";
import OpportunityCard from "./components/OpportunityCard";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function EmptyState({ navigate }) {
  return (
    <main className="flex-1 overflow-y-auto bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#FFF0EA] flex items-center justify-center mx-auto mb-4 text-3xl">
          📂
        </div>
        <h2 className="text-[18px] font-bold text-[#1A1410] mb-2">No data yet</h2>
        <p className="text-[13px] text-[#6B6560] mb-6 leading-relaxed">
          Upload your customer CSV to unlock AI-powered opportunities, segment insights, and campaign recommendations.
        </p>
        <button
          onClick={() => navigate("Customers")}
          className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
          Upload Customer Data →
        </button>
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#FF6B35] animate-spin" />
        <p className="text-[12px] text-[#9C9691]">AI is analysing your segments…</p>
      </div>
    </div>
  );
}

export default function DashboardHome({ hasDataset, segments, customers, navigate, insights, setInsights, fetchedForRef }) {
  const [loadingInsights, setLoading]   = useState(false);
  const [insightsError, setError]       = useState("");


  // REPLACE the existing useEffect with:
  useEffect(() => {
    if (!segments?.length) return;

    const fingerprint = segments.map(s => s.label).join(",") + "|" + (customers?.length ?? 0);

    // Skip if we already fetched for this exact dataset
    if (fetchedForRef.current === fingerprint) return;

    async function fetchInsights() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/dashboard-insights`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            segments,
            total_customers: customers?.length ?? 0,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setInsights(data);
        fetchedForRef.current = fingerprint; // mark as fetched for this dataset
      } catch (e) {
        console.error("Dashboard insights failed", e);
        setError("Could not load AI insights. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [segments, customers]);

  if (!hasDataset) return <EmptyState navigate={navigate} />;

  const totalPotential = segments?.reduce((s, seg) => s + (seg.potential_revenue ?? 0), 0) ?? 0;
  const totalOrders    = customers?.reduce((s, c) => s + (c.orders ?? 0), 0) ?? 0;

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr  = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  // Find segment object by label (for navigation)
  function segmentByLabel(label) {
    return segments?.find(s => s.label === label) ?? null;
  }

  return (
    <main className="flex-1 overflow-y-auto bg-[#FAF8F5]">
      <div className="px-7 py-6 max-w-[900px]">

        {/* Topbar */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[20px] font-bold tracking-tight">
              {greeting}, <span className="text-[#FF6B35]">Alex</span> 👋
            </h1>
            <p className="text-[13px] text-[#6B6560] mt-0.5">
              {dateStr} · AI analysed {totalOrders.toLocaleString()} orders
            </p>
          </div>
        </div>

        {/* AI Banner */}
        <div className="bg-white border border-black/[0.08] border-l-[3px] border-l-[#FF6B35] rounded-xl px-4 py-3 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" />
            <p className="text-[13px] text-[#6B6560]">
              <strong className="font-semibold text-[#1A1410]">
                {insights?.opportunities?.length ?? segments?.length ?? 0} high-impact opportunities found.
              </strong>{" "}
              Total recoverable revenue:{" "}
              <strong className="font-semibold text-[#1A1410]">₹{Math.round(totalPotential / 1000)}K</strong>
            </p>
          </div>
          <span className="text-[10px] font-semibold tracking-[0.6px] uppercase bg-[#FFF0EA] text-[#FF6B35] border border-[#FF6B35]/20 rounded-md px-2 py-1 shrink-0">
            AI Ready
          </span>
        </div>

        {loadingInsights && <Spinner />}

        {insightsError && (
          <p className="text-[12px] text-red-500 mb-4">{insightsError}</p>
        )}

        {insights && !loadingInsights && (
          <>
            {/* Opportunity Cards */}
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[14px] font-semibold text-[#1A1410]">AI Opportunities</p>
              <span className="text-[11px] font-medium bg-[#FFF0EA] text-[#FF6B35] rounded-full px-2.5 py-0.5">
                {insights.opportunities?.length} new
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {insights.opportunities?.map((opp, i) => {
                const seg = segmentByLabel(opp.segment_label);
                return (
                  <OpportunityCard
                    key={opp.title}
                    opp={{ ...opp, featured: i === 0 }}
                    onViewSegment={() => {
                      if (!seg) return;
                      // Pass the persona label so Customers page can filter by it
                      navigate("Customers", { segment: seg.label });
                    }}
                    onLaunch={() => {
                      if (!seg) return;
                      navigate("Campaigns", { segment: seg });
                    }}
                  />
                );
              })}
            </div>

            {/* AI Insights */}
            <p className="text-[14px] font-semibold text-[#1A1410] mb-3">AI Insights</p>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {insights.insights?.map((ins) => (
                <div key={ins.title} className="bg-white border border-black/[0.08] rounded-xl p-3.5">
                  <p className="text-[16px] mb-1.5">{ins.icon}</p>
                  <p className="text-[13px] font-semibold text-[#1A1410] mb-1">{ins.title}</p>
                  <p className="text-[11px] text-[#6B6560] leading-relaxed">{ins.body}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Segment Overview table — always shown when data exists */}
        <p className="text-[14px] font-semibold text-[#1A1410] mb-3">Segment Overview</p>
        <div className="bg-white border border-black/[0.08] rounded-xl px-4 py-3.5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.08]">
                {["Segment", "Customers", "Avg Spend", "Avg Orders", "Recency", "Channel"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] pb-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {segments?.map((seg, i) => (
                <tr
                  key={seg.label}
                  className={`cursor-pointer hover:bg-[#FAF8F5] transition-colors ${i < segments.length - 1 ? "border-b border-black/[0.05]" : ""}`}
                  onClick={() => navigate("Customers", { segment: seg.label })}
                >
                  <td className="py-2.5 text-[12px] font-medium text-[#1A1410]">{seg.label}</td>
                  <td className="py-2.5 text-[12px] text-[#6B6560]">{seg.customer_count}</td>
                  <td className="py-2.5 text-[12px] font-semibold text-green-600">₹{Math.round(seg.avg_spend).toLocaleString()}</td>
                  <td className="py-2.5 text-[12px] text-[#6B6560]">{seg.avg_orders.toFixed(1)}</td>
                  <td className="py-2.5 text-[12px] text-[#6B6560]">{Math.round(seg.avg_recency_days)}d ago</td>
                  <td className="py-2.5">
                    <span className="text-[10px] font-semibold bg-[#FFF0EA] text-[#FF6B35] rounded-md px-2 py-0.5">
                      {seg.recommended_channel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}