import { OPPORTUNITIES, INSIGHTS, RECENT_CAMPAIGNS } from "./constants/dashboardData";
import OpportunityCard from "./components/OpportunityCard";

export default function DashboardHome() {
  return (
    <main className="flex-1 overflow-y-auto bg-[#FAF8F5]">
      <div className="px-7 py-6 max-w-[900px]">

        {/* Topbar */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[20px] font-bold tracking-tight">
              Good morning, <span className="text-[#FF6B35]">Alex</span> 👋
            </h1>
            <p className="text-[13px] text-[#6B6560] mt-0.5">
              Tuesday, 11 June · AI analyzed 2,483 orders overnight
            </p>
          </div>
        </div>

        {/* AI Banner */}
        <div className="bg-white border border-black/[0.08] border-l-[3px] border-l-[#FF6B35] rounded-xl px-4 py-3 flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" />
            <p className="text-[13px] text-[#6B6560]">
              <strong className="font-semibold text-[#1A1410]">3 high-impact opportunities found.</strong>{" "}
              Total recoverable revenue:{" "}
              <strong className="font-semibold text-[#1A1410]">₹1,28,000</strong>
            </p>
          </div>
          <span className="text-[10px] font-semibold tracking-[0.6px] uppercase bg-[#FFF0EA] text-[#FF6B35] border border-[#FF6B35]/20 rounded-md px-2 py-1 shrink-0">
            AI Ready
          </span>
        </div>

        {/* Opportunity Cards */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[14px] font-semibold text-[#1A1410]">AI Opportunities</p>
          <span className="text-[11px] font-medium bg-[#FFF0EA] text-[#FF6B35] rounded-full px-2.5 py-0.5">3 new</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {OPPORTUNITIES.map((opp) => <OpportunityCard key={opp.title} opp={opp} />)}
        </div>

        {/* AI Insights */}
        <p className="text-[14px] font-semibold text-[#1A1410] mb-3">AI Insights</p>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {INSIGHTS.map((ins) => (
            <div key={ins.title} className="bg-white border border-black/[0.08] rounded-xl p-3.5">
              <p className="text-[16px] mb-1.5">{ins.icon}</p>
              <p className="text-[13px] font-semibold text-[#1A1410] mb-1">{ins.title}</p>
              <p className="text-[11px] text-[#6B6560] leading-relaxed">{ins.body}</p>
            </div>
          ))}
        </div>


        {/* Recent Results */}
        <p className="text-[14px] font-semibold text-[#1A1410] mb-3">Recent Results</p>
        <div className="bg-white border border-black/[0.08] rounded-xl px-4 py-3.5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/[0.08]">
                {["Campaign", "Revenue", "Orders", "CTR", "Converted in 1h", "Status"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] pb-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_CAMPAIGNS.map((c, i) => (
                <tr key={c.name} className={i < RECENT_CAMPAIGNS.length - 1 ? "border-b border-black/[0.05]" : ""}>
                  <td className="py-2.5 text-[12px] font-medium text-[#1A1410]">{c.name}</td>
                  <td className="py-2.5 text-[12px] font-semibold text-green-600">{c.revenue}</td>
                  <td className="py-2.5 text-[12px] text-[#6B6560]">{c.orders}</td>
                  <td className="py-2.5 text-[12px] text-[#6B6560]">{c.ctr}</td>
                  <td className="py-2.5 text-[12px] text-[#6B6560]">{c.converted}</td>
                  <td className="py-2.5">
                    <span className={`text-[10px] font-semibold rounded-md px-2 py-0.5 ${
                      c.status === "Completed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    }`}>{c.status}</span>
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
