import {SIM_STAGES, TONES} from "../dummyData/CampaignData";

export default function LaunchSimModal({ stage, done, audienceCount, channel, campaignId, onViewLive, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[340px] p-6 flex flex-col items-center gap-4">

        {!done ? (
          <>
            <p className="text-[13px] font-bold text-[#1A1410]">Launching campaign…</p>
            <p className="text-[11px] text-[#9C9691]">
              Sending to {audienceCount.toLocaleString()} customers via {channel}
            </p>

            <div className="w-full flex flex-col gap-2 mt-1">
              {SIM_STAGES.map((s, i) => {
                const isActive  = i === stage - 1;
                const isDone    = i < stage;
                const isPending = i >= stage;
                return (
                  <div key={i} className="flex items-center gap-3">
                    {/* Line connector */}
                    <div className="flex flex-col items-center" style={{ width: 28 }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] transition-all duration-500 ${
                        isDone    ? "bg-green-100" :
                        isActive  ? "bg-[#FFF0EA] ring-2 ring-[#FF6B35] ring-offset-1" :
                                    "bg-[#F3F0EB]"
                      }`}>
                        {isDone ? "✓" : isActive ? (
                          <span className="w-3 h-3 rounded-full border-2 border-[#FF6B35] border-t-transparent animate-spin inline-block" />
                        ) : s.icon}
                      </div>
                      {i < SIM_STAGES.length - 1 && (
                        <div className={`w-0.5 h-4 mt-0.5 transition-all duration-500 ${isDone ? "bg-green-300" : "bg-[#E8E4DF]"}`} />
                      )}
                    </div>
                    <span className={`text-[12px] transition-all duration-300 ${
                      isDone   ? "text-green-700 font-medium" :
                      isActive ? "text-[#FF6B35] font-semibold" :
                                 "text-[#9C9691]"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Done state */}
            <div className="text-5xl animate-bounce">🚀</div>
            <p className="text-[16px] font-bold text-[#1A1410]">Launch Complete!</p>
            <p className="text-[12px] text-[#6B6560] text-center">
              {audienceCount.toLocaleString()} messages queued via {channel}
              {campaignId && <> · Campaign #{campaignId}</>}
            </p>
            <div className="w-full flex flex-col gap-2 mt-1">
              <button onClick={onViewLive}
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
                View Live Performance →
              </button>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl text-[13px] font-medium bg-[#F3F0EB] text-[#6B6560] hover:bg-[#EAE7E2] transition-colors">
                New Campaign
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}