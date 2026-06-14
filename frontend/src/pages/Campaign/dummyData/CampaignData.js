export const OPPORTUNITIES = [
  {
    emoji: "😴", title: "The Ghoster List", subtitle: "Weekly buyers gone silent",
    customers: 187, potential: "₹68,000", confidence: 92, ctr: "22%", orders: 38,
    inactive: "42 days", channel: "WhatsApp", tone: "Friendly",
    why: ["Previously ordered every week", "Orders dropped 81% last month", "High recovery potential via WhatsApp"],
    suggestion: "15–20% discount or free delivery",
    defaultMsg: "Hey {name} 👋 Your biryani misses you! It's been 42 days since your last order. Come back today and get 20% OFF — just for you. 🍱",
  },
  {
    emoji: "👑", title: "VIP Treatment", subtitle: "Top spenders, new menu drop",
    customers: 64, potential: "₹42,000", confidence: 87, ctr: "17%", orders: 21,
    inactive: "14 days", channel: "Email", tone: "Premium",
    why: ["Top 10% spenders by revenue", "Haven't seen the new menu yet", "High LTV customers worth retaining"],
    suggestion: "Exclusive early access or loyalty reward",
    defaultMsg: "Hi {name}, as one of our most valued guests, you deserve to be first. Our new menu is here — and you're invited to try it before anyone else. 👑",
  },
  {
    emoji: "🌙", title: "Late Night Club", subtitle: "Post-10PM regulars, quiet this week",
    customers: 89, potential: "₹18,000", confidence: 81, ctr: "19%", orders: 24,
    inactive: "7 days", channel: "SMS", tone: "Funny",
    why: ["Only order after 10 PM", "No order placed this week", "Impulse buyers — short punchy messages work best"],
    suggestion: "Late-night combo deal or free dessert",
    defaultMsg: "It's late. You know what that means. 🌙 Your usual is waiting — grab it now with free delivery after 10 PM tonight only. {name}, don't sleep on this.",
  },
];

export const CHANNELS = ["WhatsApp", "SMS", "Email", "RCS"];
export const TONES    = ["Friendly", "Urgent", "Premium", "Funny", "Professional"];

export const AI_MESSAGES = {
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

export const ICONS = {
    tag: "M7 7h.01M7 3H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2zm10 10h.01M17 13h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2z",
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
};

export const SIM_STAGES = [
  { label: "Validating audience",       icon: "👥" },
  { label: "Personalising messages",    icon: "✍️" },
  { label: "Connecting to channel",     icon: "📡" },
  { label: "Queuing delivery",          icon: "📬" },
  { label: "Campaign live",             icon: "✅" },
];


export const IC = {
  upload:  "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  rocket:  "M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 00-2.58 5.841",
  sparkle: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  check:   "M5 13l4 4L19 7",
  arrowL:  "M15 19l-7-7 7-7",
  edit:    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  image:   "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  link:    "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  tag:     "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  clock:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  users:   "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  chart:   "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  calendar:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
};

export const CHANNELS  = ["WhatsApp", "SMS", "Email", "RCS"];
export const TONES     = ["Friendly", "Urgent", "Exclusive", "Playful", "Professional"];