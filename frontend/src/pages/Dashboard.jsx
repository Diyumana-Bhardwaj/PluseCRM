import { useState } from "react";
import Customers from "./Customers/Customers";
import Campaign from "./Campaign/Campaign";
import CampaignPerformance from './Performance';
import Analytics from './Analysis';
import { NAV_ITEMS, PAST_CAMPAIGNS } from "./Dashboard/constants/dashboardData";
import NavIcon from "./Dashboard/components/NavIcon";
import DashboardHome from "./Dashboard/DashboardHome";
import LiveFeed from "./Dashboard/components/LiveFeed";
import ComingSoon from "./Dashboard/components/ComingSoon";


const APP_STATES = {
  NO_DATA:         { hasDataset: false, hasCampaign: false },
  DATA_READY:      { hasDataset: true,  hasCampaign: false },
  CAMPAIGN_LIVE:   { hasDataset: true,  hasCampaign: true  },
};

const CURRENT_STATE = APP_STATES.CAMPAIGN_LIVE;

function isNavEnabled(label, { hasDataset, hasCampaign }) {
  if (label === "Dashboard" || label === "Customers") return true;
  if (label === "Campaigns")   return hasDataset;
  if (label === "Live Performance")   return hasCampaign;
  if (label === "Analytics") return hasCampaign;
  return true;
}

const PAGE_REGISTRY = {
  Dashboard:     { component: null,      showFeed: true  },
  Customers:     { component: Customers, showFeed: false },
  Campaigns:     { component: Campaign,  showFeed: false },
  "Live Performance":     { component: CampaignPerformance, showFeed: false },
  Analytics: { component: Analytics,      showFeed: false },
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  // selectedSegment is passed from DashboardHome → Customers when "View Segment" is clicked
  const [selectedSegment, setSelectedSegment] = useState(null);

  const appState = CURRENT_STATE;

  function navigate(page, opts = {}) {
    if (!isNavEnabled(page, appState)) return; // guard disabled pages
    if (opts.segment) setSelectedSegment(opts.segment);
    else setSelectedSegment(null);
    setActiveNav(page);
  }

  function renderPage() {
    const entry = PAGE_REGISTRY[activeNav];
    if (!entry) return <ComingSoon label={activeNav} />;

    if (activeNav === "Dashboard") {
      return (
        <DashboardHome
          hasDataset={appState.hasDataset}
          navigate={navigate}
        />
      );
    }

    if (activeNav === "Customers" && entry.component) {
      return (
        <Customers
          navigate={navigate}
          initialSegment={selectedSegment}
        />
      );
    }

    if (entry.component) {
      const PageComponent = entry.component;
      return <PageComponent navigate={navigate} />;
    }

    return <ComingSoon label={activeNav} />;
  }

  const showFeed = PAGE_REGISTRY[activeNav]?.showFeed && appState.hasCampaign;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] text-[#1A1410] font-sans">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="w-[220px] shrink-0 bg-white border-r border-black/[0.08] flex flex-col overflow-hidden">

        {/* Logo */}
        <div className="px-4 py-[18px] pb-3.5 border-b border-black/[0.07] flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-[9px] bg-[#FFF0EA] border border-[#FF6B35]/20 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 12 Q6 5 12 12 Q18 19 21 12" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="2" fill="#FF6B35"/>
            </svg>
          </div>
          <span className="text-[18px] font-bold tracking-tight">
            Pulse<span className="text-[#FF6B35]">CRM</span>
          </span>
        </div>

        {/* Nav */}
        <div className="px-2 pt-3 pb-1 shrink-0">
          <p className="text-[10px] font-semibold text-[#9C9691] tracking-[0.8px] uppercase px-2 pb-1.5">Menu</p>
          {NAV_ITEMS.map((item) => {
            const enabled = isNavEnabled(item.label, appState);
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                disabled={!enabled}
                title={!enabled ? "Complete the previous step first" : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] mb-0.5 transition-all ${
                  !enabled
                    ? "text-[#C4BFB9] cursor-not-allowed opacity-50"
                    : isActive
                    ? "bg-[#FFF0EA] text-[#FF6B35] font-medium"
                    : "text-[#6B6560] hover:bg-[#F3F0EB] hover:text-[#1A1410]"
                }`}
              >
                <NavIcon d={item.icon} />
                <span className="flex-1 text-left">{item.label}</span>
                {/* Lock icon for disabled pages */}
                {!enabled && (
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Past Campaigns — only show when there's data */}
        {appState.hasDataset && (
          <div className="px-2 pt-2 flex-1 overflow-y-auto">
            <p className="text-[10px] font-semibold text-[#9C9691] tracking-[0.8px] uppercase px-2 pb-1.5">Past Campaigns</p>
            {PAST_CAMPAIGNS.map((c) => (
              <div
                key={c.name}
                onClick={() => navigate("Campaigns")}
                className="px-2.5 py-2 rounded-lg mb-0.5 cursor-pointer hover:bg-[#F3F0EB] transition-colors"
              >
                <p className="text-[12px] font-medium text-[#1A1410] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                  {c.name}
                </p>
                <p className="text-[11px] text-[#9C9691] mt-0.5 pl-3">{c.meta}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-black/[0.07] flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#FFF0EA] flex items-center justify-center text-[12px] font-semibold text-[#FF6B35]">
            A
          </div>
          <div>
            <p className="text-[12px] font-medium text-[#1A1410]">Alex Kumar</p>
            <p className="text-[11px] text-[#9C9691]">Marketer</p>
          </div>
        </div>
      </aside>

      {renderPage()}
      {showFeed && <LiveFeed />}

    </div>
  );
}