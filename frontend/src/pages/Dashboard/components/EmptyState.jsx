export default function EmptyState({ navigate }) {
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