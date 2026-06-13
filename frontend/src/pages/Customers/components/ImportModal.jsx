import { useState, useRef } from "react";
import { useCRM } from "../../../context/CRMContext";
import { ICONS, STEPS } from "../DummyData/CustomerData";
import { makeCustomers, PERSONAS } from "../DummyData/seedData";

function Icon({ d, className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function ImportModal({ onClose }) {
  const { setCustomers } = useCRM();

  const [phase,    setPhase]    = useState("idle");     // idle | uploading | done | error
  const [stepIdx,  setStepIdx]  = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);       // File object
  const [errMsg,   setErrMsg]   = useState("");
  const [rowCount, setRowCount] = useState(0);

  const fileInputRef = useRef(null);

 
  async function loadSeedData() {
    setPhase("uploading");
    setStepIdx(0);
    setProgress(0);
    setErrMsg("");

    // Build CSV from seed customers
    const raw = makeCustomers(120);
    const headers = ["customer name", "email", "phone", "orders", "spend", "days_ago", "city", "gender", "age"];
    const rows = raw.map(c =>
      [c.name, c.email, c.phone, c.orders, c.spend, c.daysAgo, c.city, c.gender, c.age]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const csvBlob = new Blob([csvContent], { type: "text/csv" });
    const csvFile = new File([csvBlob], "seed_data.csv", { type: "text/csv" });

    // Now run through the exact same upload path as a real CSV
    await uploadFile(csvFile);
  }

  // ── Fake progress ticker while the real fetch is in flight ────────────────
  function startProgressTicker() {
    let prog = 0;
    let step = 0;
    const id = setInterval(() => {
      // Slow down near 90% so we don't hit 100 before the API responds
      const increment = prog < 70 ? 4 : prog < 90 ? 1 : 0;
      prog = Math.min(prog + increment, 90);
      setProgress(prog);
      if (prog % 20 === 0 && step < STEPS.length - 2) {
        step += 1;
        setStepIdx(step);
      }
    }, 80);
    return id;
  }

  // ── Main upload handler ───────────────────────────────────────────────────
  async function uploadFile(f) {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setErrMsg("Only CSV files are accepted.");
      setPhase("error");
      return;
    }

    setFile(f);
    setPhase("uploading");
    setStepIdx(0);
    setProgress(0);
    setErrMsg("");

    const tickerId = startProgressTicker();

    try {
      const formData = new FormData();
      formData.append("file", f);

      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      clearInterval(tickerId);

      if (!res.ok) {
        const detail = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(detail.detail ?? "Upload failed");
      }

      const data = await res.json();
      // data = { customers, segments, meta: { filename, totalRows } }

      // Finish progress animation
      setProgress(100);
      setStepIdx(STEPS.length - 1);
      setRowCount(data.meta?.totalRows ?? data.customers.length);

      // Push into global CRM context
      setCustomers(data.customers, data.segments, data.meta?.filename ?? f.name);

      setPhase("done");
    } catch (err) {
      clearInterval(tickerId);
      setErrMsg(err.message ?? "Something went wrong.");
      setPhase("error");
    }
  }

  // ── Event handlers ────────────────────────────────────────────────────────
  function onFileInputChange(e) {
    const f = e.target.files?.[0];
    if (f) uploadFile(f);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  }

  function onClickDropZone() {
    fileInputRef.current?.click();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl w-[460px] shadow-xl border border-black/[0.08]" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.07]">
          <p className="text-[15px] font-semibold text-[#1A1410]">Import Customer Dataset</p>
          <button onClick={onClose} className="text-[#9C9691] hover:text-[#1A1410] transition-colors">
            <Icon d={ICONS.close} className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ── IDLE ── */}
          {phase === "idle" && (
            <>
              {/* Hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={onFileInputChange}
              />

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={onClickDropZone}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 gap-3 transition-colors cursor-pointer mb-5 ${
                  dragging ? "border-[#FF6B35] bg-[#FFF0EA]" : "border-black/[0.12] hover:border-[#FF6B35] hover:bg-[#FFF8F5]"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFF0EA] border border-[#FF6B35]/20 flex items-center justify-center">
                  <Icon d={ICONS.upload} className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[#1A1410]">Drop CSV file here</p>
                  <p className="text-[12px] text-[#9C9691] mt-0.5">or click to browse</p>
                </div>
              </div>

              {/* Seed data shortcut */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-black/[0.07]" />
                <span className="text-[11px] text-[#9C9691] shrink-0">or try with sample data</span>
                <div className="flex-1 h-px bg-black/[0.07]" />
              </div>
              <button
                onClick={loadSeedData}
                className="w-full mb-5 py-2.5 rounded-xl text-[13px] font-medium border border-black/[0.1] text-[#6B6560] hover:bg-[#F3F0EB] hover:text-[#1A1410] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
                Load Seed Data  <span className="text-[#C4C0BB] font-normal">(120 customers)</span>
              </button>

              {/* Required columns hint */}
              <div className="bg-[#FAF8F5] rounded-xl px-4 py-3 mb-5">
                <p className="text-[11px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Required columns</p>
                <div className="grid grid-cols-2 gap-1">
                  {["Customer Name", "Email", "Phone", "Orders", "Total Spend", "Last Order Date"].map(r => (
                    <div key={r} className="flex items-center gap-1.5 text-[12px] text-[#6B6560]">
                      <Icon d={ICONS.check} className="w-3 h-3 text-green-500" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-[#F3F0EB] text-[#6B6560] hover:bg-[#EAE7E2] transition-colors border border-black/[0.07]">
                  Cancel
                </button>
                <button onClick={onClickDropZone} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
                  Upload File
                </button>
              </div>
            </>
          )}

          {/* ── UPLOADING ── */}
          {phase === "uploading" && (
            <div className="py-4">
              <div className="flex flex-col gap-2 mb-5">
                {STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-2 text-[13px] transition-all ${i <= stepIdx ? "text-[#1A1410]" : "text-[#C4C0BB]"}`}>
                    {i < stepIdx ? (
                      <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <Icon d={ICONS.check} className="w-2.5 h-2.5 text-white" />
                      </span>
                    ) : i === stepIdx ? (
                      <span className="w-4 h-4 rounded-full border-2 border-[#FF6B35] border-t-transparent animate-spin shrink-0 block" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-black/[0.1] shrink-0" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
              <div className="h-2 bg-[#F3F0EB] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#FF6B35] rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[11px] text-[#9C9691] text-right">{progress}%</p>
            </div>
          )}

          {/* ── DONE ── */}
          {phase === "done" && (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-1">
                <Icon d={ICONS.check} className="w-7 h-7 text-green-500" />
              </div>
              <p className="text-[16px] font-semibold text-[#1A1410]">Import complete</p>
              <p className="text-[13px] text-[#6B6560]">
                {rowCount.toLocaleString()} customers imported successfully.
              </p>
              <button onClick={onClose} className="mt-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors">
                View Customers
              </button>
            </div>
          )}

          {/* ── ERROR ── */}
          {phase === "error" && (
            <div className="py-6 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-1">
                <Icon d={ICONS.close} className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-[16px] font-semibold text-[#1A1410]">Import failed</p>
              <p className="text-[13px] text-[#6B6560] text-center max-w-[320px]">{errMsg}</p>
              <button
                onClick={() => { setPhase("idle"); setErrMsg(""); }}
                className="mt-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}