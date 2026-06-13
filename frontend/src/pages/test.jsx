import { useState, useEffect } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const OPPORTUNITIES = [
  {
    emoji: "😴", title: "The Ghoster List", subtitle: "Weekly buyers gone silent",
    audience: "Ghost Diners",
    customers: 187, potential: "₹68,000", potentialRaw: 68000, confidence: 92, ctr: "22%", orders: 38,
    costPerMsg: 0.50, inactive: "42 days", channel: "WhatsApp", tone: "Friendly",
    why: ["Previously ordered every week", "Orders dropped 81% last month", "High recovery potential via WhatsApp"],
    suggestion: "15–20% discount or free delivery",
    defaultMsg: "Hey {name} 👋 Your biryani misses you!\n\nIt's been 42 days since your last order. We know life gets busy — but good food waits for no one 😄\n\nCome back today and get *20% OFF* your next order. No minimum. Just tap the link below 👇\n\nhttps://order.pulsecrm.in/r/gh42\n\nOffer valid until midnight tonight. See you soon! 🍱",
  },
  {
    emoji: "👑", title: "VIP Treatment", subtitle: "Top spenders, new menu drop",
    audience: "Premium Diners",
    customers: 64, potential: "₹42,000", potentialRaw: 42000, confidence: 87, ctr: "17%", orders: 21,
    costPerMsg: 0.50, inactive: "14 days", channel: "Email", tone: "Premium",
    why: ["Top 10% spenders by revenue", "Haven't seen the new menu yet", "High LTV customers worth retaining"],
    suggestion: "Exclusive early access or loyalty reward",
    defaultMsg: "Hi {name},\n\nAs one of our most valued guests, you deserve to be first.\n\nWe've just launched our *Monsoon Special Menu* — a curated selection crafted by our head chef, available exclusively to our inner circle before the public announcement.\n\nYour loyalty earns you early access and complimentary dessert on your next visit.\n\n👉 Explore the menu: https://order.pulsecrm.in/r/vip14\n\nReservations recommended. Your usual table is waiting.\n\nWarm regards,\nThe PulseCRM Kitchen Team 👑",
  },
  {
    emoji: "🌙", title: "Late Night Club", subtitle: "Post-10PM regulars, quiet this week",
    audience: "Night Snackers",
    customers: 89, potential: "₹18,000", potentialRaw: 18000, confidence: 81, ctr: "19%", orders: 24,
    costPerMsg: 0.30, inactive: "7 days", channel: "SMS", tone: "Funny",
    why: ["Only order after 10 PM", "No order placed this week", "Impulse buyers — short punchy messages work best"],
    suggestion: "Late-night combo deal or free dessert",
    defaultMsg: "It's late. You know what that means 🌙\n\n{name}, your stomach called. It's disappointed.\n\nFree delivery after 10 PM tonight ONLY. Your usual is one tap away 👇\n\nhttps://order.pulsecrm.in/r/ln07\n\nDon't sleep on this (pun intended) 😅",
  },
];

const CHANNELS = ["WhatsApp", "SMS", "Email", "RCS"];
const TONES    = ["Friendly", "Urgent", "Premium", "Funny", "Professional"];

const AI_MESSAGES = {
  Friendly: (name, opp) =>
`Hey ${name} 👋 We noticed you've been away for a while!

Your favourites are still here — freshly made and waiting. We've missed having you around 😊

Here's *20% OFF* your next order, just because we miss you:
👉 https://order.pulsecrm.in/r/fr01

Offer expires in 24 hours. Tap and treat yourself 🍱`,

  Urgent: (name, opp) =>
`⚠️ ${name}, this is time-sensitive.

Your exclusive *25% discount* unlocks RIGHT NOW — but expires at midnight tonight.

Every minute you wait is money left on the table 🔥

👉 Claim before it's gone: https://order.pulsecrm.in/r/urg

This link is personal to you. Not shareable. Go now.`,

  Premium: (name, opp) =>
`Dear ${name},

As a valued member of our inner circle, we believe in giving you more than just great food — we offer an experience.

We've reserved a *private offer* exclusively for guests like you: complimentary upgrade on your next order, no conditions attached.

👉 Redeem here: https://order.pulsecrm.in/r/vip
Valid through this weekend only.

With appreciation,
The PulseCRM Team 👑`,

  Funny: (name, opp) =>
`${name}... your stomach called. It said it misses us 😅

We tried to console it but honestly, nothing we said helped. The only cure is obviously biryani.

Doctor's orders: tap this link immediately 🍕
👉 https://order.pulsecrm.in/r/fun

Free delivery. No excuses. We'll be waiting.

P.S. Your stomach said "hi" 👋`,

  Professional: (name, opp) =>
`Hello ${name},

We're reaching out with a time-sensitive offer available to a select group of customers.

Based on your order history with us, you qualify for a *20% discount* on your next purchase — valid for the next 24 hours.

To redeem, please visit:
https://order.pulsecrm.in/r/pro

Should you have any questions, our support team is available at support@pulsecrm.in.

Best regards,
PulseCRM Customer Success`,
};

function Icon({ d, className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const ICONS = {
  sparkle:  "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  send:     "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  refresh:  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  image:    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  check:    "M5 13l4 4L19 7",
  chevronD: "M19 9l-7 7-7-7",
  users:    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  clock:    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  rocket:   "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  link:     "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  close:    "M6 18L18 6M6 6l12 12",
  arrowL:   "M15 19l-7-7 7-7",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  tag:      "M7 7h.01M7 3H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2zm10 10h.01M17 13h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2z",
};

// ── Phone Preview ─────────────────────────────────────────────────────────────

function PhonePreview({ channel, message, opp, hasImage }) {
  const time = "10:24";
  const name = "Rahul";

  // Parse message: bold *text*, links, line breaks
  function renderText(text) {
    if (!text) return <span className="text-[#9C9691] text-[10px] italic">Your message will appear here…</span>;
    const filled = text.replace(/\{name\}/g, name);
    return filled.split("\n").map((line, li) => {
      if (!line) return <br key={li} />;
      const parts = line.split(/(\*[^*]+\*|https?:\/\/\S+)/g);
      return (
        <span key={li} className="block leading-relaxed">
          {parts.map((part, pi) => {
            if (part.startsWith("*") && part.endsWith("*"))
              return <strong key={pi} className="font-semibold">{part.slice(1, -1)}</strong>;
            if (part.startsWith("http"))
              return <span key={pi} className="underline opacity-80 break-all">{part}</span>;
            return part;
          })}
        </span>
      );
    });
  }

  const WA = () => (
    <div className="bg-[#0B141A] rounded-[28px] overflow-hidden h-full flex flex-col">
      {/* status bar */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <span className="text-white text-[8px] font-semibold">{time}</span>
        <div className="flex items-center gap-1">
          <span className="text-white text-[8px]">●●●</span>
        </div>
      </div>
      {/* header */}
      <div className="bg-[#1F2C34] px-3 py-2 flex items-center gap-2 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
          {opp.title.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[10px] font-semibold leading-none truncate">{opp.title}</p>
          <p className="text-[#8696A0] text-[8px] mt-0.5">Business · {opp.customers} recipients</p>
        </div>
      </div>
      {/* wallpaper bg */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2" style={{ background: "#0B141A" }}>
        {/* date stamp */}
        <div className="text-center">
          <span className="text-[7px] text-[#8696A0] bg-[#182229] rounded px-2 py-0.5">Today</span>
        </div>
        {hasImage && (
          <div className="self-end max-w-[82%]">
            <div className="bg-[#005C4B] rounded-xl overflow-hidden rounded-br-none">
              <div className="h-20 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white text-2xl">🍱</span>
              </div>
              <div className="px-2.5 py-1.5">
                <p className="text-[9px] text-white/80">Campaign Banner</p>
                <p className="text-[7px] text-[#8696A0] text-right mt-1">{time} ✓✓</p>
              </div>
            </div>
          </div>
        )}
        <div className="self-end max-w-[85%]">
          <div className="bg-[#005C4B] rounded-xl rounded-br-none px-2.5 py-2">
            <div className="text-[10px] text-[#E9EDEF]">{renderText(message)}</div>
            <p className="text-[7px] text-[#8696A0] text-right mt-1.5">{time} ✓✓</p>
          </div>
        </div>
        {/* CTA */}
        <div className="self-end max-w-[85%]">
          <div className="bg-[#1F2C34] border border-white/[0.06] rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] font-semibold text-[#25D366]">🛒  Order Now</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SMS = () => (
    <div className="bg-black rounded-[28px] overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <span className="text-white text-[8px] font-semibold">{time}</span>
        <span className="text-white text-[8px]">●●●</span>
      </div>
      <div className="bg-[#1C1C1E] px-3 py-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#636366] flex items-center justify-center text-white text-[9px] font-bold">
          P
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold">PulseCRM</p>
          <p className="text-[#98989F] text-[8px]">+91 98765 00001</p>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2 bg-black">
        <div className="text-center">
          <span className="text-[7px] text-[#636366]">Today {time}</span>
        </div>
        <div className="self-start max-w-[85%]">
          <div className="bg-[#1C1C1E] rounded-2xl rounded-tl-none px-3 py-2">
            <div className="text-[10px] text-white">{renderText(message)}</div>
          </div>
          <p className="text-[7px] text-[#636366] mt-1 ml-1">{time}</p>
        </div>
      </div>
    </div>
  );

  const Email = () => (
    <div className="bg-[#F6F6F6] rounded-[28px] overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 flex items-center justify-between bg-[#F6F6F6]">
        <span className="text-[#1A1A1A] text-[8px] font-semibold">{time}</span>
        <span className="text-[#1A1A1A] text-[8px]">●●●</span>
      </div>
      <div className="bg-white mx-2 mb-2 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm border border-black/[0.06]">
        {/* email header strip */}
        <div className="bg-[#FF6B35] px-3 py-2">
          <p className="text-white text-[9px] font-bold">PulseCRM</p>
        </div>
        {hasImage && (
          <div className="h-20 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white text-2xl">🍱</span>
          </div>
        )}
        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-[9px] text-[#6B7280] mb-1">To: rahul@gmail.com</p>
          <p className="text-[11px] font-semibold text-[#1A1410] mb-2">We miss you, {name}! 🍱</p>
          <div className="text-[9.5px] text-[#374151]">{renderText(message)}</div>
          <div className="mt-3 bg-[#FF6B35] rounded-lg px-3 py-1.5 text-center">
            <p className="text-[10px] font-semibold text-white">Order Now →</p>
          </div>
        </div>
      </div>
    </div>
  );

  const RCS = () => (
    <div className="bg-white rounded-[28px] overflow-hidden h-full flex flex-col">
      <div className="px-4 pt-2 pb-1 flex items-center justify-between bg-white">
        <span className="text-[#1A1A1A] text-[8px] font-semibold">{time}</span>
        <span className="text-[#1A1A1A] text-[8px]">●●●</span>
      </div>
      <div className="bg-[#1A73E8] px-3 py-2 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
          P
        </div>
        <div>
          <p className="text-white text-[10px] font-semibold">PulseCRM</p>
          <p className="text-blue-200 text-[8px]">Verified Business</p>
        </div>
      </div>
      <div className="flex-1 p-2.5 flex flex-col gap-2 bg-[#F0F4FF]">
        <div className="text-center">
          <span className="text-[7px] text-[#636366] bg-white/60 rounded px-2 py-0.5">Today</span>
        </div>
        {hasImage && (
          <div className="self-start bg-white rounded-2xl overflow-hidden shadow-sm max-w-[90%]">
            <div className="h-20 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-2xl">🍱</span>
            </div>
          </div>
        )}
        <div className="self-start max-w-[88%] bg-white rounded-2xl rounded-tl-none px-2.5 py-2 shadow-sm">
          <div className="text-[10px] text-[#1A1A1A]">{renderText(message)}</div>
          <p className="text-[7px] text-[#8E8E93] mt-1.5">{time} · Read</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["Order Now", "View Menu", "Unsubscribe"].map(lbl => (
            <div key={lbl} className="bg-white rounded-full px-2.5 py-1 shadow-sm border border-[#1A73E8]/20">
              <p className="text-[9px] font-medium text-[#1A73E8]">{lbl}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const previews = { WhatsApp: WA, SMS, Email, RCS };
  const Preview  = previews[channel] || WA;
  return <Preview />;
}

// ── Campaign Health ───────────────────────────────────────────────────────────

function CampaignHealth({ opp, message }) {
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  const readSecs  = Math.max(3, Math.round(wordCount * 0.4));
  const spamWords = ["FREE", "URGENT", "WINNER", "CASH", "PRIZE", "CLICK NOW"];
  const hasSpam   = spamWords.some(w => message.toUpperCase().includes(w));
  const spamScore = hasSpam ? "Medium" : message.length > 400 ? "Medium" : "Low";
  const spamColor = spamScore === "Low" ? "text-green-600" : "text-amber-600";
  const hasLink   = /https?:\/\//.test(message);
  const hasCta    = /order|buy|tap|click|redeem|claim|get/i.test(message);

  const stats = [
    { lbl: "Reading time",        val: `${readSecs}s`,                          color: "" },
    { lbl: "Spam score",          val: spamScore,                                color: spamColor },
    { lbl: "Link included",       val: hasLink ? "Yes ✓" : "No",                 color: hasLink ? "text-green-600" : "text-amber-600" },
    { lbl: "CTA detected",        val: hasCta  ? "Yes ✓" : "Missing",            color: hasCta  ? "text-green-600" : "text-amber-600" },
    { lbl: "Predicted open rate", val: `${opp.confidence - 10}%`,                color: "" },
    { lbl: "Predicted CTR",       val: opp.ctr,                                  color: "" },
  ];

  return (
    <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-black/[0.06]">
      <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2.5">Campaign Health</p>
      <div className="space-y-1.5">
        {stats.map(s => (
          <div key={s.lbl} className="flex items-center justify-between">
            <span className="text-[11px] text-[#6B6560]">{s.lbl}</span>
            <span className={`text-[11px] font-semibold ${s.color || "text-[#1A1410]"}`}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Campaign Summary Card ─────────────────────────────────────────────────────

function CampaignSummary({ opp }) {
  const cost = (opp.customers * opp.costPerMsg).toFixed(0);
  const roi  = Math.round(opp.potentialRaw / (opp.customers * opp.costPerMsg));

  return (
    <div className="bg-white border border-black/[0.08] rounded-xl p-4">
      <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-3">Campaign Summary</p>
      <div className="space-y-0">
        {[
          { lbl: "Audience",         val: opp.audience },
          { lbl: "Recipients",       val: opp.customers.toLocaleString() },
          { lbl: "Estimated cost",   val: `₹${cost}` },
          { lbl: "Expected revenue", val: opp.potential },
          { lbl: "Expected ROI",     val: `${roi}×` },
        ].map(({ lbl, val }, i) => (
          <div key={lbl} className={`flex items-center justify-between py-2 ${i < 4 ? "border-b border-black/[0.05]" : ""}`}>
            <span className="text-[12px] text-[#9C9691]">{lbl}</span>
            <span className={`text-[12px] font-semibold ${lbl === "Expected ROI" ? "text-green-600" : lbl === "Expected revenue" ? "text-[#FF6B35]" : "text-[#1A1410]"}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Campaigns({ navigate }) {
  const [selectedOpp, setSelectedOpp] = useState(0);
  const [channel,     setChannel]     = useState("WhatsApp");
  const [msgSource,   setMsgSource]   = useState("ai");
  const [tone,        setTone]        = useState("Friendly");
  const [message,     setMessage]     = useState(OPPORTUNITIES[0].defaultMsg);
  const [generating,  setGenerating]  = useState(false);
  const [hasImage,    setHasImage]    = useState(false);
  const [launched,    setLaunched]    = useState(false);
  const [launching,   setLaunching]   = useState(false);
  const [savedAt,     setSavedAt]     = useState("Draft saved");
  const [previewCh,   setPreviewCh]   = useState("WhatsApp");

  const opp = OPPORTUNITIES[selectedOpp];

  useEffect(() => {
    const t = setTimeout(() => setSavedAt("Draft saved · just now"), 800);
    return () => clearTimeout(t);
  }, [message, channel, tone]);

  useEffect(() => setPreviewCh(channel), [channel]);

  function selectOpp(i) {
    const o = OPPORTUNITIES[i];
    setSelectedOpp(i);
    setMessage(o.defaultMsg);
    setChannel(o.channel);
    setTone(o.tone);
  }

  function generateMessage() {
    setGenerating(true);
    setTimeout(() => {
      const fn = AI_MESSAGES[tone] || AI_MESSAGES.Friendly;
      setMessage(fn("{name}", opp));
      setGenerating(false);
    }, 1200);
  }

  function handleLaunch() {
    setLaunching(true);
    setTimeout(() => { setLaunching(false); setLaunched(true); }, 1800);
  }

  if (launched) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Icon d={ICONS.rocket} className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1A1410] mb-1">Campaign Launched! 🚀</h2>
          <p className="text-[13px] text-[#6B6560] mb-1">
            <strong className="text-[#1A1410]">{opp.customers}</strong> messages queued for{" "}
            <strong className="text-[#1A1410]">{opp.title}</strong>
          </p>
          <p className="text-[12px] text-[#9C9691] mb-6">via {channel} · Live feed is now active on the Dashboard</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => navigate && navigate("Dashboard")}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors"
            >
              View Live Feed →
            </button>
            <button
              onClick={() => { setLaunched(false); selectOpp(0); }}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium bg-white border border-black/[0.08] text-[#6B6560] hover:bg-[#F3F0EB] transition-colors"
            >
              New Campaign
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[#FAF8F5] flex flex-col">

      {/* ── Top bar ── */}
      <div className="px-6 py-4 bg-white border-b border-black/[0.07] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate && navigate("Dashboard")}
            className="w-7 h-7 rounded-lg bg-[#F3F0EB] flex items-center justify-center text-[#6B6560] hover:bg-[#EAE7E2] transition-colors"
          >
            <Icon d={ICONS.arrowL} className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-[15px] font-bold text-[#1A1410] leading-tight">Campaign Builder</h1>
            <p className="text-[11px] text-[#9C9691]">Configure, preview and launch</p>
          </div>
        </div>
        <span className="text-[11px] text-[#9C9691] flex items-center gap-1.5">
          <Icon d={ICONS.check} className="w-3 h-3 text-green-500" />
          {savedAt}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ════ LEFT — Configuration ════ */}
        <div className="w-[58%] shrink-0 overflow-y-auto border-r border-black/[0.07] bg-white px-5 py-5 space-y-5">

          {/* ── Audience selector — single selected card ── */}
          <div>
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Audience</p>
            {/* compact selector tabs */}
            <div className="flex gap-2 mb-3">
              {OPPORTUNITIES.map((o, i) => (
                <button
                  key={o.title}
                  onClick={() => selectOpp(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                    selectedOpp === i
                      ? "border-[#FF6B35] bg-[#FFF0EA] text-[#FF6B35]"
                      : "border-black/[0.08] bg-white text-[#6B6560] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <span>{o.emoji}</span>
                  <span>{o.title}</span>
                </button>
              ))}
            </div>

            {/* Campaign Summary for selected */}
            <CampaignSummary opp={opp} />
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* AI Recommendation */}
          <div className="bg-[#FFF8F5] border border-[#FF6B35]/20 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <Icon d={ICONS.sparkle} className="w-3.5 h-3.5 text-[#FF6B35]" />
              <p className="text-[12px] font-semibold text-[#1A1410]">AI Recommendation</p>
            </div>
            <ul className="space-y-1 mb-2.5">
              {opp.why.map(w => (
                <li key={w} className="flex items-start gap-1.5 text-[11px] text-[#6B6560]">
                  <Icon d={ICONS.check} className="w-3 h-3 text-[#FF6B35] mt-0.5 shrink-0" />
                  {w}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[#9C9691]">
              <span className="font-medium text-[#6B6560]">Suggested offer:</span> {opp.suggestion}
            </p>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Channel */}
          <div>
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Channel</p>
            <div className="flex gap-2">
              {CHANNELS.map(ch => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-medium border transition-all ${
                    channel === ch
                      ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                      : "bg-white text-[#6B6560] border-black/[0.08] hover:border-[#FF6B35]/40 hover:bg-[#FAF8F5]"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Message */}
          <div>
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Message</p>

            <div className="flex gap-3 mb-3">
              {[["ai", "AI Generate"], ["custom", "Write manually"]].map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                  <div
                    onClick={() => setMsgSource(val)}
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      msgSource === val ? "border-[#FF6B35]" : "border-[#C4C0BB]"
                    }`}
                  >
                    {msgSource === val && <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />}
                  </div>
                  <span className="text-[12px] text-[#6B6560]">{lbl}</span>
                </label>
              ))}
            </div>

            {msgSource === "ai" && (
              <div className="mb-3">
                <p className="text-[10px] text-[#9C9691] mb-1.5">Tone</p>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                        tone === t
                          ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                          : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={7}
              placeholder="Your message will appear here. Click Generate or type your own."
              className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-[#1A1410] placeholder-[#C4C0BB] resize-none outline-none focus:border-[#FF6B35]/50 transition-colors leading-relaxed font-mono"
            />

            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-[#C4C0BB]">{message.length} chars · use {"{name}"} for personalisation · *bold*</span>
              {msgSource === "ai" && (
                <button
                  onClick={generateMessage}
                  disabled={generating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#FFF0EA] text-[#FF6B35] border border-[#FF6B35]/20 hover:bg-[#FFE4D6] transition-colors disabled:opacity-60"
                >
                  {generating
                    ? <span className="w-3 h-3 rounded-full border-2 border-[#FF6B35]/30 border-t-[#FF6B35] animate-spin" />
                    : <Icon d={ICONS.sparkle} className="w-3 h-3" />}
                  {generating ? "Generating…" : "Generate"}
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Attachments */}
          <div>
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Attachments</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setHasImage(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                  hasImage ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5]"
                }`}
              >
                <Icon d={ICONS.image} className="w-3 h-3" />
                {hasImage ? "Banner Added ✓" : "Generate Banner"}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5] transition-colors">
                <Icon d={ICONS.link} className="w-3 h-3" />
                Add Deep Link
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#FAF8F5] transition-colors">
                <Icon d={ICONS.tag} className="w-3 h-3" />
                Promo Code
              </button>
            </div>
          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* Launch */}
          <button
            onClick={handleLaunch}
            disabled={launching || !message.trim()}
            className="w-full py-3 rounded-xl text-[13px] font-semibold bg-[#FF6B35] text-white hover:bg-[#E55A26] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {launching
              ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Queuing {opp.customers} messages…</>
              : <><Icon d={ICONS.rocket} className="w-4 h-4" /> Launch to {opp.customers} {opp.audience}</>
            }
          </button>

        </div>

        {/* ════ RIGHT — Preview (strict 100% height, no scroll) ════ */}
        <div className="flex-1 bg-[#FAF8F5] px-5 py-5 flex flex-col gap-4">

          {/* channel tabs */}
          <div className="shrink-0">
            <p className="text-[10px] font-semibold text-[#9C9691] uppercase tracking-[0.6px] mb-2">Live Preview</p>
            <div className="flex gap-1.5">
              {CHANNELS.map(ch => (
                <button
                  key={ch}
                  onClick={() => setPreviewCh(ch)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                    previewCh === ch
                      ? "bg-[#1A1410] text-white border-[#1A1410]"
                      : "bg-white text-[#6B6560] border-black/[0.08] hover:bg-[#F3F0EB]"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* phone + health side by side, fills remaining height */}
          <div className="flex gap-4 flex-1 min-h-0">

            {/* phone */}
            <div className="flex justify-center items-start flex-1">
              <div className="relative" style={{ width: 220, flexShrink: 0 }}>
                <div className="w-[220px] bg-[#1A1410] rounded-[36px] p-[10px] shadow-2xl" style={{ height: "calc(100vh - 220px)", maxHeight: 480, minHeight: 340 }}>
                  <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-16 h-5 bg-[#1A1410] rounded-full z-10" />
                  <div className="w-full h-full rounded-[28px] overflow-hidden">
                    <PhonePreview
                      channel={previewCh}
                      message={message}
                      opp={opp}
                      hasImage={hasImage}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border border-black/[0.08] rounded-full px-3 py-1 text-[10px] font-semibold text-[#6B6560] shadow-sm whitespace-nowrap">
                  {previewCh} Preview
                </div>
              </div>
            </div>

            {/* health + summary stacked */}
            <div className="flex flex-col gap-3 w-[180px] shrink-0 overflow-hidden">
              <CampaignHealth opp={opp} message={message} />
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}