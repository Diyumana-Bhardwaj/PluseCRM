export default function PhonePreview({ channel, message, opp, hasImage }) {
  const time = "10:24";
  const name = "Rahul";

  // Parse message: bold *text*, links, line breaks
  function renderText(text) {
    if (!text) return <span className="text-[#9C9691] text-[10px] italic">Your message will appear here…</span>;
    const filled = text.replace(/\{name\}/g, name);
    return filled.split("\n").map((line, li) => {
      if (!line) return <br key={li} />;
      const parts = line.split(/(\*[^*]+\*|https?:\/\/\S+)/g);
      return (
        <span key={li} className="block leading-relaxed">
          {parts.map((part, pi) => {
            if (part.startsWith("*") && part.endsWith("*"))
              return <strong key={pi} className="font-semibold">{part.slice(1, -1)}</strong>;
            if (part.startsWith("http"))
              return <span key={pi} className="underline opacity-80 break-all">{part}</span>;
            return part;
          })}
        </span>
      );
    });
  }

  const WA = () => (
    <div className="bg-[#0B141A] rounded-[28px] overflow-hidden h-full flex flex-col">
      {/* status bar */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <span className="text-white text-[8px] font-semibold">{time}</span>
        <div className="flex items-center gap-1">
          <span className="text-white text-[8px]">●●●</span>
        </div>
      </div>
      {/* header */}
      <div className="bg-[#1F2C34] px-3 py-2 flex items-center gap-2 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
          {opp.title.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[10px] font-semibold leading-none truncate">{opp.title}</p>
          <p className="text-[#8696A0] text-[8px] mt-0.5">Business · {opp.customers} recipients</p>
        </div>
      </div>
      {/* wallpaper bg */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2" style={{ background: "#0B141A" }}>
        {/* date stamp */}
        <div className="text-center">
          <span className="text-[7px] text-[#8696A0] bg-[#182229] rounded px-2 py-0.5">Today</span>
        </div>
        {hasImage && (
          <div className="self-end max-w-[82%]">
            <div className="bg-[#005C4B] rounded-xl overflow-hidden rounded-br-none">
              <div className="h-20 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white text-2xl">🍱</span>
              </div>
              <div className="px-2.5 py-1.5">
                <p className="text-[9px] text-white/80">Campaign Banner</p>
                <p className="text-[7px] text-[#8696A0] text-right mt-1">{time} ✓✓</p>
              </div>
            </div>
          </div>
        )}
        <div className="self-end max-w-[85%]">
          <div className="bg-[#005C4B] rounded-xl rounded-br-none px-2.5 py-2">
            <div className="text-[10px] text-[#E9EDEF]">{renderText(message)}</div>
            <p className="text-[7px] text-[#8696A0] text-right mt-1.5">{time} ✓✓</p>
          </div>
        </div>
        {/* CTA */}
        <div className="self-end max-w-[85%]">
          <div className="bg-[#1F2C34] border border-white/[0.06] rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-semibold text-[#25D366]">🛒  Order Now</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SMS = () => (
    <div className="bg-black rounded-[28px] overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <span className="text-white text-[8px] font-semibold">{time}</span>
        <span className="text-white text-[8px]">●●●</span>
      </div>
      <div className="bg-[#1C1C1E] px-3 py-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#636366] flex items-center justify-center text-white text-[9px] font-bold">
          P
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold">PulseCRM</p>
          <p className="text-[#98989F] text-[8px]">+91 98765 00001</p>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2 bg-black">
        <div className="text-center">
          <span className="text-[7px] text-[#636366]">Today {time}</span>
        </div>
        <div className="self-start max-w-[85%]">
          <div className="bg-[#1C1C1E] rounded-2xl rounded-tl-none px-3 py-2">
            <div className="text-[10px] text-white">{renderText(message)}</div>
          </div>
          <p className="text-[7px] text-[#636366] mt-1 ml-1">{time}</p>
        </div>
      </div>
    </div>
  );

  const Email = () => (
    <div className="bg-[#F6F6F6] rounded-[28px] overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 flex items-center justify-between bg-[#F6F6F6]">
        <span className="text-[#1A1A1A] text-[8px] font-semibold">{time}</span>
        <span className="text-[#1A1A1A] text-[8px]">●●●</span>
      </div>
      <div className="bg-white mx-2 mb-2 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm border border-black/[0.06]">
        {/* email header strip */}
        <div className="bg-[#FF6B35] px-3 py-2">
          <p className="text-white text-[9px] font-bold">PulseCRM</p>
        </div>
        {hasImage && (
          <div className="h-20 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white text-2xl">🍱</span>
          </div>
        )}
        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-[9px] text-[#6B7280] mb-1">To: rahul@gmail.com</p>
          <p className="text-[11px] font-semibold text-[#1A1410] mb-2">We miss you, {name}! 🍱</p>
          <div className="text-[9.5px] text-[#374151]">{renderText(message)}</div>
          <div className="mt-3 bg-[#FF6B35] rounded-lg px-3 py-1.5 text-center">
            <p className="text-[10px] font-semibold text-white">Order Now →</p>
          </div>
        </div>
      </div>
    </div>
  );

  const RCS = () => (
    <div className="bg-white rounded-[28px] overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 flex items-center justify-between bg-white">
        <span className="text-[#1A1A1A] text-[8px] font-semibold">{time}</span>
        <span className="text-[#1A1A1A] text-[8px]">●●●</span>
      </div>
      <div className="bg-[#1A73E8] px-3 py-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
          P
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold">PulseCRM</p>
          <p className="text-blue-200 text-[8px]">Verified Business</p>
        </div>
      </div>
      <div className="flex-1 p-2.5 flex flex-col gap-2 bg-[#F0F4FF]">
        <div className="text-center">
          <span className="text-[7px] text-[#636366] bg-white/60 rounded px-2 py-0.5">Today</span>
        </div>
        {hasImage && (
          <div className="self-start bg-white rounded-2xl overflow-hidden shadow-sm max-w-[90%]">
            <div className="h-20 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-2xl">🍱</span>
            </div>
          </div>
        )}
        <div className="self-start max-w-[88%] bg-white rounded-2xl rounded-tl-none px-2.5 py-2 shadow-sm">
          <div className="text-[10px] text-[#1A1A1A]">{renderText(message)}</div>
          <p className="text-[7px] text-[#8E8E93] mt-1.5">{time} · Read</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["Order Now", "View Menu", "Unsubscribe"].map(lbl => (
            <div key={lbl} className="bg-white rounded-full px-2.5 py-1 shadow-sm border border-[#1A73E8]/20">
              <p className="text-[9px] font-medium text-[#1A73E8]">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const previews = { WhatsApp: WA, SMS, Email, RCS };
  const Preview  = previews[channel] || WA;
  return <Preview />;
}