export default function Spinner({ size = "w-3.5 h-3.5", color = "border-[#FF6B35]" }) {
  return (
    <span className={`${size} rounded-full border-2 border-black/10 border-t-current ${color} animate-spin`} />
  );
}