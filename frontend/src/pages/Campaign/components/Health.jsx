export default function CampaignHealth({ opp, message }) {
  const wordCount  = message.trim().split(/\s+/).filter(Boolean).length;
  const readSecs   = Math.max(3, Math.round(wordCount * 0.4));
  const spamWords  = ["FREE", "URGENT", "WINNER", "CASH", "PRIZE", "CLICK NOW"];
  const hasSpam    = spamWords.some(w => message.toUpperCase().includes(w));
  const spamScore  = hasSpam ? "Medium" : message.length > 300 ? "Medium" : "Low";
  const spamColor  = spamScore === "Low" ? "text-green-600" : "text-amber-600";

  const stats = [
    { lbl: "Reading time",       val: `${readSecs}s`       },
    { lbl: "Spam score",         val: spamScore, color: spamColor },
    { lbl: "Predicted open rate",val: `${opp.confidence - 10}%`   },
    { lbl: "Predicted CTR",      val: opp.ctr              },
    { lbl: "Reach",              val: opp.customers        },
  ];

  return (
    <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-black/[0.06]">
      <p className="text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2.5">Campaign Health</p>
      <div className="space-y-1.5">
        {stats.map(s => (
          <div key={s.lbl} className="flex items-center justify-between">
            <span className="text-[11px] text-[#6B6560]">{s.lbl}</span>
            <span className={`text-[11px] font-semibold ${s.color || "text-[#1A1410]"}`}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}