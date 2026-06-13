export default function FeedEvent({ ev, isLast }) {
  return (
    <div className="flex gap-2.5">
      <p className="text-[10px] text-[#9C9691] min-w-[38px] pt-0.5">{ev.time}</p>
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: ev.dotColor }} />
        {!isLast && <div className="w-px flex-1 bg-black/[0.08] min-h-[18px]" />}
      </div>
      <div className="pb-3">
        <p className="text-[12px] font-medium text-[#1A1410]">{ev.name}</p>
        <p className={`text-[11px] ${ev.isAmount ? "text-green-600 font-semibold" : ev.isError ? "text-red-500" : "text-[#6B6560]"}`}>
          {ev.action}
        </p>
      </div>
    </div>
  );
}
