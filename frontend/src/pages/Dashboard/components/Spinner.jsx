export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-black/10 border-t-[#FF6B35] animate-spin" />
        <p className="text-[12px] text-[#9C9691]">AI is analysing your segments…</p>
      </div>
    </div>
  );
}