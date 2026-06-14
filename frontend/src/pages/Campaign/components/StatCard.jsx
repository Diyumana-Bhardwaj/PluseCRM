export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-[#FAF8F5] rounded-xl px-3 py-2.5 border border-black/[0.05]">
      <p className="text-[10px] text-[#9C9691] mb-0.5">{label}</p>
      <p className="text-[15px] font-bold text-[#1A1410]">{value}</p>
      {sub && <p className="text-[10px] text-[#9C9691]">{sub}</p>}
    </div>
  );
}

