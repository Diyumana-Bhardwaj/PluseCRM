export const NAV_ITEMS = [
  { icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", label: "Dashboard" },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", label: "Customers" },
  { icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", label: "Campaigns" },
  { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Live Performance" },
  { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2", label: "Analytics" },
];

export const PAST_CAMPAIGNS = [
  { color: "#16A34A", name: "Ghost Diners",    meta: "43 orders · ₹18,000" },
  { color: "#2563EB", name: "VIP Treatment",   meta: "12 orders · ₹7,800"  },
  { color: "#D97706", name: "Late Night Club", meta: "28 orders · ₹9,200"  },
  { color: "#DC2626", name: "Weekend Warriors",meta: "19 orders · ₹5,600"  },
];

export const OPPORTUNITIES = [
  {
    conf: "92%", title: "The Ghoster List",
    subtitle: "Weekly buyers gone silent",
    stats: [{ val: "187", lbl: "Customers" }, { val: "₹68k", lbl: "Potential" }, { val: "42d", lbl: "Inactive" }],
    quote: '"Your biryani hasn\'t forgotten you. Have you forgotten it?"',
    channel: "WhatsApp recommended", featured: true,
  },
  {
    conf: "87%", title: "VIP Treatment",
    subtitle: "Top spenders, new menu drop",
    stats: [{ val: "64", lbl: "Customers" }, { val: "₹42k", lbl: "Potential" }, { val: "3.4x", lbl: "Avg Spend" }],
    quote: '"You were first last time. Be first again."',
    channel: "Email recommended", featured: false,
  },
  {
    conf: "81%", title: "Late Night Club",
    subtitle: "Post-10PM regulars, quiet this week",
    stats: [{ val: "89", lbl: "Customers" }, { val: "₹18k", lbl: "Potential" }, { val: "7d", lbl: "Inactive" }],
    quote: '"It\'s late. You know what that means."',
    channel: "SMS recommended", featured: false,
  },
];

export const INSIGHTS = [
  { icon: "⚠️", title: "Weekend orders down 18%",   body: "Compared to last week. Weekend Warriors segment needs attention." },
  { icon: "⭐", title: "Premium Diners spend 3.4x", body: "Top segment far outperforms average. Focus on retention now."     },
  { icon: "🔥", title: "WhatsApp outperforms SMS",  body: "WhatsApp campaigns deliver 27% higher CTR across all segments."  },
];

export const RECENT_CAMPAIGNS = [
  { name: "Ghost Diners",   revenue: "₹18,000", orders: 43, ctr: "23%", converted: 31, status: "Completed" },
  { name: "VIP Treatment",  revenue: "₹7,800",  orders: 12, ctr: "17%", converted: 9,  status: "Completed" },
  { name: "Late Night Club",revenue: "₹9,200",  orders: 28, ctr: "19%", converted: 18, status: "Scheduled" },
];

export const FEED_EVENTS = [
  { time: "10:05", name: "Rahul Sharma", action: "Ordered · ₹450 🔥", dotColor: "#16A34A", isAmount: true  },
  { time: "10:03", name: "Rahul Sharma", action: "Clicked link 👀",   dotColor: "#2563EB"                  },
  { time: "10:01", name: "Priya Singh",  action: "Opened message",    dotColor: "#D97706"                  },
  { time: "10:00", name: "Aakash Mehta", action: "Delivered ✓",       dotColor: "#9CA3AF"                  },
  { time: "09:59", name: "Sneha Rao",    action: "Failed ✗",          dotColor: "#DC2626", isError: true   },
  { time: "09:58", name: "Vikram Nair",  action: "Ordered · ₹320",   dotColor: "#16A34A", isAmount: true  },
  { time: "09:57", name: "Meera Joshi",  action: "Opened message",    dotColor: "#D97706"                  },
];

export const CAMPAIGN_METRICS = [
  { label: "Sent",      value: 184, total: 187, showBar: true },
  { label: "Delivered", value: 171, total: null },
  { label: "Opened",    value: 94,  total: null },
  { label: "Clicked",   value: 31,  total: null },
  { label: "Orders",    value: 17,  total: null },
];

export const TIMELINE_EVENTS = [
  {
    time: "10:01",
    title: "Sent",
    detail: "187 messages dispatched",
    status: "done",   // done | active | pending
    dotColor: "#9C9691",
  },
  {
    time: "10:02",
    title: "Delivered",
    detail: "171 delivered · 16 pending",
    status: "done",
    dotColor: "#9C9691",
  },
  {
    time: "10:03",
    title: "Opened",
    detail: "94 opened so far",
    status: "active",
    dotColor: "#FF6B35",
  },
  {
    time: "10:05",
    title: "Orders",
    detail: "Waiting for more conversions",
    status: "pending",
    dotColor: "#D1CCC8",
  },
];
