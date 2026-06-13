import { useState, useMemo, useRef, useEffect } from "react";
import { useCRM, APP_STATES } from "../../context/CRMContext";
import { CITIES, GENDERS } from "./DummyData/seedData";
import { ICONS, STEPS } from "./DummyData/CustomerData";
import CustomerDrawer from "./components/CustomerDrawer";
import Dropdown from "./components/Dropdown";
import ImportModal from "./components/ImportModal";
import MoreFiltersButton from "./components/MoreFilter";
import AICampaignBrief from "./components/CampaignBreif";
import Icon from "./components/Icon";
import { daysLabel } from "./utils/dateHelper";

function statusStyle(s) {
  switch (s) {
    case "Active":     return "bg-green-50 text-green-700";
    case "High Value": return "bg-purple-50 text-purple-700";
    case "At Risk":    return "bg-amber-50 text-amber-700";
    case "Dormant":    return "bg-gray-100 text-gray-500";
    default:           return "bg-gray-100 text-gray-500";
  }
}

const PAGE_SIZE = 15;

export default function Customers({ navigate }) {

  const {
    customers,
    segments,
    stats,
    appState,
    dataset,
    selectedSegment,
    clearSegment,
    selectCampaignAudience,
  } = useCRM();


  const personaOptions = useMemo(() => {
    const labels = [...new Set(customers.map(c => c.persona?.label).filter(Boolean))];
    return labels;
  }, [customers]);


  const [search,        setSearch]        = useState("");
  const [personaFilter, setPersonaFilter] = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [spendFilter,   setSpendFilter]   = useState("All");
  const [cityFilter,    setCityFilter]    = useState("All");
  const [genderFilter,  setGenderFilter]  = useState("All");
  const [minOrders,     setMinOrders]     = useState("");
  const [maxOrders,     setMaxOrders]     = useState("");
  const [minAge,        setMinAge]        = useState("");
  const [maxAge,        setMaxAge]        = useState("");
  const [page,          setPage]          = useState(1);
  const [showImport,    setShowImport]    = useState(false);
  const [selected,      setSelected]      = useState(null);
  const [openDropdown,  setOpenDropdown]  = useState(null);


  useEffect(() => {
    if (selectedSegment) {
      setPersonaFilter(selectedSegment);
      clearSegment();
      setPage(1);
    }
  }, [selectedSegment]);

  const fieldFlags = useMemo(() => {
    if (!customers.length) return { city: false, gender: false, age: false };
    const sample = customers[0];
    return {
      city:   customers.some(c => c.city   && c.city   !== ""),
      gender: customers.some(c => c.gender && c.gender !== ""),
      age:    customers.some(c => c.age    && c.age > 0),
    };
  }, [customers]);

  useEffect(() => {
    if (!fieldFlags.city)   setCityFilter("All");
    if (!fieldFlags.gender) setGenderFilter("All");
    if (!fieldFlags.age)    { setMinAge(""); setMaxAge(""); }
  }, [fieldFlags]);


  const cityOptions = useMemo(() => {
    const fromData = [...new Set(customers.map(c => c.city).filter(Boolean))];
    return fromData.length ? fromData : CITIES;
  }, [customers]);


  const filtered = useMemo(() => {
    return customers.filter(c => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
      if (personaFilter !== "All" && c.persona?.label !== personaFilter) return false;
      if (statusFilter  !== "All" && c.status !== statusFilter)           return false;
      if (spendFilter === "0-1k"  && c.spend >= 1000)  return false;
      if (spendFilter === "1k-5k" && (c.spend < 1000  || c.spend >= 5000)) return false;
      if (spendFilter === "5k+"   && c.spend < 5000)   return false;
      if (cityFilter   !== "All"  && c.city !== cityFilter)    return false;
      if (genderFilter !== "All"  && c.gender !== genderFilter) return false;
      if (minOrders !== "" && c.orders < Number(minOrders)) return false;
      if (maxOrders !== "" && c.orders > Number(maxOrders)) return false;
      if (minAge    !== "" && c.age    < Number(minAge))    return false;
      if (maxAge    !== "" && c.age    > Number(maxAge))    return false;
      return true;
    });
  }, [customers, search, personaFilter, statusFilter, spendFilter, cityFilter, genderFilter, minOrders, maxOrders, minAge, maxAge]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setSearch(""); setPersonaFilter("All"); setStatusFilter("All"); setSpendFilter("All");
    setCityFilter("All"); setGenderFilter("All");
    setMinOrders(""); setMaxOrders(""); setMinAge(""); setMaxAge("");
    setPage(1);
  }

  const hasFilters = search || personaFilter !== "All" || statusFilter !== "All" || spendFilter !== "All"
    || cityFilter !== "All" || genderFilter !== "All" || minOrders || maxOrders || minAge || maxAge;

  const dropdownProps = { openDropdown, setOpenDropdown, setPage };

  const totalCustomers = stats?.totalCustomers  ?? 0;
  const totalOrders    = stats?.totalOrders     ?? 0;
  const avgSpend       = stats?.avgSpend        ?? 0;
  const lastSync       = dataset.importedAt
    ? new Date(dataset.importedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5]" onClick={() => setOpenDropdown(null)}>
      <div className="px-7 py-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-bold tracking-tight text-[#1A1410]">Customers</h1>
            <p className="text-[13px] text-[#6B6560] mt-0.5">Import, manage and analyze customer data.</p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors"
          >
            <Icon d={ICONS.upload} className="w-4 h-4" />
            {appState === APP_STATES.NO_DATA ? "Import Dataset" : "Re-import"}
          </button>
        </div>

        {/* ── Quick Stats (live from context) ── */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { lbl: "Total Customers", val: totalCustomers.toLocaleString(),          sub: dataset.filename ?? "No dataset yet" },
            { lbl: "Total Orders",    val: totalOrders.toLocaleString(),              sub: "Across all customers" },
            { lbl: "Average Spend",   val: avgSpend ? `₹${avgSpend.toLocaleString()}` : "—", sub: "Per customer" },
            { lbl: "Last Sync",       val: lastSync,                                  sub: "After import" },
          ].map(s => (
            <div key={s.lbl} className="bg-white border border-black/[0.08] rounded-xl px-4 py-3.5">
              <p className="text-[11px] text-[#9C9691] mb-1">{s.lbl}</p>
              <p className="text-[20px] font-bold text-[#1A1410] tracking-tight">{s.val}</p>
              <p className="text-[11px] text-[#C4C0BB] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-2 mb-4 flex-wrap" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 bg-white border border-black/[0.08] rounded-lg px-3 py-1.5 flex-1 max-w-[260px]">
            <Icon d={ICONS.search} className="w-3.5 h-3.5 text-[#9C9691] shrink-0" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search customers..."
              className="flex-1 bg-transparent text-[12px] text-[#1A1410] placeholder-[#C4C0BB] outline-none"
            />
          </div>

          <Dropdown id="persona" label="Persona"   value={personaFilter} options={personaOptions}                                   onChange={setPersonaFilter} {...dropdownProps} />
          <Dropdown id="status"  label="Status"    value={statusFilter}  options={["Active","High Value","At Risk","Dormant"]}       onChange={setStatusFilter}  {...dropdownProps} />
          <Dropdown id="spend"   label="Min Spend" value={spendFilter}   options={["0-1k","1k-5k","5k+"]}                           onChange={setSpendFilter}   {...dropdownProps} />

          <MoreFiltersButton
            cityFilter={cityFilter}     setCityFilter={setCityFilter}
            genderFilter={genderFilter} setGenderFilter={setGenderFilter}
            minOrders={minOrders}       setMinOrders={setMinOrders}
            maxOrders={maxOrders}       setMaxOrders={setMaxOrders}
            minAge={minAge}             setMinAge={setMinAge}
            maxAge={maxAge}             setMaxAge={setMaxAge}
            openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
            setPage={setPage}
            onReset={resetFilters}
            cityOptions={cityOptions}
            fieldFlags={fieldFlags}
          />

          {hasFilters && (
            <button onClick={resetFilters} className="px-3 py-1.5 rounded-lg text-[12px] text-[#9C9691] hover:text-[#1A1410] hover:bg-[#F3F0EB] transition-colors">
              Reset all
            </button>
          )}

          <div className="ml-auto flex items-center gap-4">
            <span className="text-[13px] text-[#9C9691]">
              Selected: <span className="font-semibold text-[#1F1F1F]">{filtered.length.toLocaleString()}</span>
            </span>
            <button onClick={() => {
              selectCampaignAudience(filtered);
              navigate("Campaigns");
            }}
            className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#E55A26]">
              Create Campaign →
            </button>
          </div>
        </div>

        {/* ── AI Campaign Brief ── */}
        <AICampaignBrief filtered={filtered} />

        {/* ── Table ── */}
        <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden">
          {appState === APP_STATES.NO_DATA ? (
            /* ── No data yet — onboarding empty state ── */
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Icon d={ICONS.upload} className="w-10 h-10 text-[#C4C0BB]" />
              <p className="text-[14px] font-medium text-[#6B6560]">No customer data yet</p>
              <p className="text-[12px] text-[#9C9691]">Upload a CSV to get started.</p>
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors"
              >
                <Icon d={ICONS.upload} className="w-4 h-4" />
                {appState === APP_STATES.NO_DATA ? "Import Dataset" : "Re-import"}
              </button>
              </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Icon d={ICONS.user} className="w-10 h-10 text-[#C4C0BB]" />
              <p className="text-[14px] font-medium text-[#6B6560]">No customers found</p>
              <p className="text-[12px] text-[#9C9691]">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.07]">
                    <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3 pl-5">Customer</th>
                    {fieldFlags.city   && <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">City</th>}
                    {fieldFlags.age    && <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">Age</th>}
                    <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">Orders</th>
                    <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">Total Spend</th>
                    <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">Last Order</th>
                    <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">Persona</th>
                    <th className="text-left text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.5px] px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`transition-colors hover:bg-[#FAF8F5] cursor-pointer ${i < pageData.length - 1 ? "border-b border-black/[0.05]" : ""}`}
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-4 py-3 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#FFF0EA] flex items-center justify-center text-[10px] font-bold text-[#FF6B35] shrink-0">
                            {c.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-[12px] font-medium text-[#1A1410]">{c.name}</p>
                            <p className="text-[11px] text-[#9C9691]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      {fieldFlags.city && <td className="px-4 py-3 text-[12px] text-[#6B6560]">{c.city}</td>}
                      {fieldFlags.age  && <td className="px-4 py-3 text-[12px] text-[#6B6560]">{c.age}</td>}
                      <td className="px-4 py-3 text-[12px] text-[#6B6560]">{c.orders}</td>
                      <td className="px-4 py-3 text-[12px] font-medium text-[#1A1410]">₹{c.spend.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[12px] text-[#6B6560]">{daysLabel(c.daysAgo)}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: c.persona?.bg, color: c.persona?.color }}>
                          {c.persona?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${statusStyle(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 pr-5">
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(c); }}
                          className="text-[12px] font-medium text-[#FF6B35] hover:underline"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-black/[0.07]">
                <p className="text-[12px] text-[#9C9691]">
                  Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} customers
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F3F0EB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <Icon d={ICONS.chevronL} className="w-3.5 h-3.5" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-[12px] font-medium transition-colors ${page === p ? "bg-[#FF6B35] text-white" : "text-[#6B6560] hover:bg-[#F3F0EB]"}`}>
                        {p}
                      </button>
                    );
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B6560] hover:bg-[#F3F0EB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <Icon d={ICONS.chevronR} className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
      <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}