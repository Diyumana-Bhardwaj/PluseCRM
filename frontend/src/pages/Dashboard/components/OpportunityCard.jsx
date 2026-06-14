export default function OpportunityCard({ opp, onViewSegment, onLaunch }) {
  return (
    <div className={`bg-white rounded-xl p-4 flex flex-col transition-all duration-150 ${
      opp.featured ? "border border-[#FF6B35]" : "border border-black/[0.08] hover:border-[#FF6B35]"
    }`}>
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-2xl">{opp.emoji}</span>
        <span className="text-[11px] font-semibold text-green-600 bg-green-50 rounded-md px-2 py-0.5">
          {opp.conf} conf.
        </span>
      </div>
      <p className="text-[14px] font-bold text-[#1A1410] mb-0.5">{opp.title}</p>
      <p className="text-[12px] text-[#6B6560] mb-3">{opp.subtitle}</p>
      <div className="flex gap-3 mb-3">
        {opp.stats?.map((s) => (
          <div key={s.lbl} className="flex-1">
            <p className="text-[15px] font-bold text-[#1A1410]">{s.val}</p>
            <p className="text-[10px] text-[#9C9691] mt-0.5">{s.lbl}</p>
          </div>
        ))}
      </div>
      <div className="h-px bg-black/[0.07] mb-3" />
      <p className="text-[11px] text-[#6B6560] italic border-l-2 border-[#FF6B35]/30 pl-2 mb-2.5 leading-relaxed">
        {opp.quote}
      </p>
      <p className="text-[10px] text-[#9C9691] mb-3 flex items-center gap-1">
        <span className="text-[#FF6B35]">✦</span> {opp.channel}
      </p>
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onViewSegment}
          className="flex-1 py-1.5 rounded-lg text-[12px] font-medium bg-[#F3F0EB] border border-black/[0.08] text-[#6B6560] hover:bg-[#EAE7E2] transition-colors">
          View Segment
        </button>
        <button
          onClick={onLaunch}
          className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
          Launch →
        </button>
      </div>
    </div>
  );
}