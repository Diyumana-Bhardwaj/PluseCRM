export default function CampaignSummary({ opp }) {
  const cost = (opp.customers * opp.costPerMsg).toFixed(0);
  const roi  = Math.round(opp.potentialRaw / (opp.customers * opp.costPerMsg));

  return (
    <div className="bg-white border border-black/[0.08] rounded-xl p-4">
      <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-3">Campaign Summary</p>
      <div className="space-y-0">
        {[
          { lbl: "Audience",         val: opp.audience },
          { lbl: "Recipients",       val: opp.customers.toLocaleString() },
          { lbl: "Estimated cost",   val: `₹${cost}` },
          { lbl: "Expected revenue", val: opp.potential },
          { lbl: "Expected ROI",     val: `${roi}×` },
        ].map(({ lbl, val }, i) => (
          <div key={lbl} className={`flex items-center justify-between py-2 ${i < 4 ? "border-b border-black/[0.05]" : ""}`}>
            <span className="text-[12px] text-[#9C9691]">{lbl}</span>
            <span className={`text-[12px] font-semibold ${lbl === "Expected ROI" ? "text-green-600" : lbl === "Expected revenue" ? "text-[#FF6B35]" : "text-[#1A1410]"}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}