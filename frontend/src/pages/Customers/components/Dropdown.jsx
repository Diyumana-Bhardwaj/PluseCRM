import { ICONS } from "../DummyData/CustomerData";
import Icon from "./Icon";
export default function Dropdown({ id, label, value, options, onChange, openDropdown, setOpenDropdown, setPage }) {
  const open = openDropdown === id;
  const isActive = value !== "All";
  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpenDropdown(open ? null : id); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
          isActive
            ? "bg-[#FFF0EA] text-[#FF6B35] border-[#FF6B35]/30"
            : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#F3F0EB]"
        }`}
      >
        {isActive ? value : label}
        <Icon d={ICONS.chevron} className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-black/[0.08] rounded-xl shadow-lg z-20 py-1 min-w-[150px]">
          {["All", ...options].map(opt => (
            <button
              key={opt}
              onClick={e => { e.stopPropagation(); onChange(opt); setOpenDropdown(null); setPage(1); }}
              className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                value === opt ? "text-[#FF6B35] font-medium bg-[#FFF0EA]" : "text-[#6B6560] hover:bg-[#F3F0EB]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}