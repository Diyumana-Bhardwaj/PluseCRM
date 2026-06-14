// ── Section heading ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-black/[0.06]" />;
}

// ── Spinner ───────────────────────────────────────────────────────────────────

export default function Spinner({ size = "w-3.5 h-3.5", color = "border-[#FF6B35]" }) {
  return (
    <span className={`${size} rounded-full border-2 border-black/10 border-t-current ${color} animate-spin`} />
  );
}