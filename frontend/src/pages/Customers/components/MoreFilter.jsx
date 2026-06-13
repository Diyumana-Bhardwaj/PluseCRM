import {useState, useRef, useEffect} from "react";
import Icon from "./Icon";
import { ICONS } from "../DummyData/CustomerData";
import Dropdown from "./Dropdown";
export default function MoreFiltersButton({
  cityFilter, setCityFilter,
  genderFilter, setGenderFilter,
  minOrders, setMinOrders,
  maxOrders, setMaxOrders,
  minAge, setMinAge,
  maxAge, setMaxAge,
  openDropdown, setOpenDropdown,
  setPage,
  onReset,
  cityOptions = [],
  fieldFlags = { city: true, gender: true, age: true },
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Only count active filters for fields that actually exist
  const activeCount = [
    fieldFlags.city   && cityFilter !== "All",
    fieldFlags.gender && genderFilter !== "All",
    minOrders !== "",
    maxOrders !== "",
    fieldFlags.age && minAge !== "",
    fieldFlags.age && maxAge !== "",
  ].filter(Boolean).length;

  const isActive = activeCount > 0;

  // If no optional fields exist at all, don't render the button
  const hasAnyField = fieldFlags.city || fieldFlags.gender || fieldFlags.age;

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function RangeInput({ placeholderMin, placeholderMax, valMin, valMax, onMin, onMax }) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={placeholderMin}
          value={valMin}
          onChange={e => { onMin(e.target.value); setPage(1); }}
          className="w-full px-3 py-1.5 rounded-lg text-[12px] text-[#1A1410] border border-black/[0.08] bg-white placeholder-[#C4C0BB] outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all"
        />
        <span className="text-[11px] text-[#C4C0BB] shrink-0">–</span>
        <input
          type="number"
          placeholder={placeholderMax}
          value={valMax}
          onChange={e => { onMax(e.target.value); setPage(1); }}
          className="w-full px-3 py-1.5 rounded-lg text-[12px] text-[#1A1410] border border-black/[0.08] bg-white placeholder-[#C4C0BB] outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all"
        />
      </div>
    );
  }

  if (!hasAnyField) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
          isActive
            ? "bg-[#FFF0EA] text-[#FF6B35] border-[#FF6B35]/30"
            : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#F3F0EB]"
        }`}
      >
        <Icon d={ICONS.filter} className="w-3 h-3" />
        More Filters
        {isActive && (
          <span className="ml-0.5 w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <Icon d={ICONS.chevron} className="w-3 h-3" />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-xl border border-black/[0.08] shadow-xl z-30 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.07]">
            <p className="text-[13px] font-semibold text-[#1A1410]">More Filters</p>
            <button onClick={() => setOpen(false)} className="text-[#9C9691] hover:text-[#1A1410] transition-colors">
              <Icon d={ICONS.x} className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-4 py-4 space-y-4">

            {/* City — only if dataset has city */}
            {fieldFlags.city && (
              <div>
                <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2 flex items-center gap-1.5">
                  <Icon d={ICONS.location} className="w-3 h-3" /> City
                </p>
                <Dropdown
                  id="city"
                  label="All Cities"
                  value={cityFilter}
                  options={cityOptions}
                  onChange={v => { setCityFilter(v); setPage(1); }}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  setPage={setPage}
                />
              </div>
            )}

            {/* Gender — only if dataset has gender */}
            {fieldFlags.gender && (
              <div>
                <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2 flex items-center gap-1.5">
                  <Icon d={ICONS.gender} className="w-3 h-3" /> Gender
                </p>
                <Dropdown
                  id="gender"
                  label="All Genders"
                  value={genderFilter}
                  options={["Male", "Female", "Other"]}
                  onChange={v => { setGenderFilter(v); setPage(1); }}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  setPage={setPage}
                />
              </div>
            )}

            {/* Orders range — always available (orders is required) */}
            <div>
              <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2 flex items-center gap-1.5">
                <Icon d={ICONS.orders} className="w-3 h-3" /> Orders Range
              </p>
              <RangeInput
                placeholderMin="Min orders"
                placeholderMax="Max orders"
                valMin={minOrders}
                valMax={maxOrders}
                onMin={setMinOrders}
                onMax={setMaxOrders}
              />
            </div>

            {/* Age range — only if dataset has age */}
            {fieldFlags.age && (
              <div>
                <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2 flex items-center gap-1.5">
                  <Icon d={ICONS.age} className="w-3 h-3" /> Age Range
                </p>
                <RangeInput
                  placeholderMin="Min age"
                  placeholderMax="Max age"
                  valMin={minAge}
                  valMax={maxAge}
                  onMin={setMinAge}
                  onMax={setMaxAge}
                />
              </div>
            )}

          </div>

          {/* footer */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-black/[0.07] bg-[#FAF8F5]">
            <button
              onClick={() => {
                setCityFilter("All"); setGenderFilter("All");
                setMinOrders(""); setMaxOrders("");
                setMinAge(""); setMaxAge("");
                setPage(1);
              }}
              className="flex-1 py-2 rounded-lg text-[12px] font-medium bg-white text-[#6B6560] border border-black/[0.08] hover:bg-[#F3F0EB] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex-1 py-2 rounded-lg text-[12px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}