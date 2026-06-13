import { createContext, useContext, useReducer, useMemo, useState } from "react";

export const APP_STATES = {
  NO_DATA:       "NO_DATA",
  DATA_READY:    "DATA_READY",
  CAMPAIGN_LIVE: "CAMPAIGN_LIVE",
};

export const ACTIONS = {
  SET_CUSTOMERS:   "SET_CUSTOMERS",   
  SET_CAMPAIGN:    "SET_CAMPAIGN",    
  SELECT_SEGMENT:  "SELECT_SEGMENT",  
  CLEAR_SEGMENT:   "CLEAR_SEGMENT",
  RESET:           "RESET",
};

const initialState = {
  appState:        APP_STATES.NO_DATA,
  customers:       [],
  segments:        {},
  dataset: {
    filename:    null,
    importedAt:  null,  
    totalRows:   0,
  },
  activeCampaign:  null,
  pastCampaigns:   [],
  selectedSegment: null,
};

function crmReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_CUSTOMERS: {
      const { customers, segments, filename } = action.payload;
      return {
        ...state,
        appState:  APP_STATES.DATA_READY,
        customers,
        segments,
        dataset: {
          filename:   filename ?? "dataset.csv",
          importedAt: new Date().toISOString(),
          totalRows:  customers.length,
        },
      };
    }

    case ACTIONS.SET_CAMPAIGN: {
      const { campaign } = action.payload;
      return {
        ...state,
        appState:       APP_STATES.CAMPAIGN_LIVE,
        activeCampaign: campaign,
        pastCampaigns:  state.activeCampaign
          ? [state.activeCampaign, ...state.pastCampaigns]
          : state.pastCampaigns,
      };
    }

    case ACTIONS.SELECT_SEGMENT:
      return { ...state, selectedSegment: action.payload.segment };

    case ACTIONS.CLEAR_SEGMENT:
      return { ...state, selectedSegment: null };

    case ACTIONS.RESET:
      return { ...initialState };

    default:
      return state;
  }
}

const CRMContext = createContext(null);
export function computeStats(customers) {
  if (!customers.length) return null;
  const totalSpend  = customers.reduce((s, c) => s + c.spend, 0);
  const totalOrders = customers.reduce((s, c) => s + c.orders, 0);
  return {
    totalCustomers: customers.length,
    totalOrders,
    avgSpend:       Math.round(totalSpend / customers.length),
    // Persona breakdown: { "Ghost Diner": 42, "Premium Diner": 18, ... }
    personaCounts:  customers.reduce((acc, c) => {
      acc[c.persona.label] = (acc[c.persona.label] || 0) + 1;
      return acc;
    }, {}),
    // Top 3 opportunities ordered by segment size
    topOpportunities: Object.entries(
      customers.reduce((acc, c) => {
        acc[c.persona.label] = (acc[c.persona.label] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, count]) => ({ label, count })),
  };
}

export function CRMProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);
  const stats = useMemo(() => computeStats(state.customers), [state.customers]);
  const [campaignAudience, setCampaignAudience] = useState([]);

  function selectCampaignAudience(customers) {
    setCampaignAudience(customers);
  }

  function setCustomers(customers, segments, filename) {
    dispatch({
      type:    ACTIONS.SET_CUSTOMERS,
      payload: { customers, segments, filename },
    });
  }

  function launchCampaign(campaign) {
    dispatch({
      type:    ACTIONS.SET_CAMPAIGN,
      payload: { campaign },
    });
  }

  function selectSegment(segment) {
    dispatch({ type: ACTIONS.SELECT_SEGMENT, payload: { segment } });
  }

  function clearSegment() {
    dispatch({ type: ACTIONS.CLEAR_SEGMENT });
  }

  function reset() {
    dispatch({ type: ACTIONS.RESET });
  }

  const value = {
    ...state,
    stats,
    setCustomers,
    launchCampaign,
    selectSegment,
    clearSegment,
    reset,
    campaignAudience,
    selectCampaignAudience,
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used inside <CRMProvider>");
  return ctx;
}

export default CRMContext;