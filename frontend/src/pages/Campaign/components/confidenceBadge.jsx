export default function ConfidenceBadge({ value }) {
  const color =
    value >= 85 ? "bg-green-50 text-green-700 border-green-200" :
    value >= 70 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-red-50   text-red-700   border-red-200";
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${color}`}>
      {value}% confidence
    </span>
  );
}