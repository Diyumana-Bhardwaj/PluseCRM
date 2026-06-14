# PulseCRM — AI-Native Customer Intelligence Platform

> **Live Product →** [https://pluse-crm.vercel.app](https://pluse-crm.vercel.app/)
> **Demo credentials:** `demo@pulsecrm.in` / `pulse123`

---

## What Is PulseCRM?

PulseCRM is an AI-native Customer Engagement Platform built for marketers who work with customer purchase data. Most CRM tools stop at storing data and generating reports — they leave the marketer to manually figure out who to target, what to say, and when to send it. PulseCRM flips this model.

The platform continuously analyzes customer behavior, identifies high-value opportunities, recommends campaign strategies, generates personalized messaging, simulates delivery through a real callback-driven channel service, and tracks revenue attribution — all in a single connected workflow.

**The system recommends. The marketer decides.**

---

## Core Problem It Solves

Traditional CRMs give marketers raw data and expect them to do the thinking:

```
Customer Data → Customer Table → Manual Filtering → Campaign → Reports
```

PulseCRM replaces this with an AI-first pipeline:

```
Customer Data → AI Analysis → Business Opportunities → Marketer Decision
             → Campaign Execution → Performance Analytics → Continuous Learning
```

Every number on every screen is derived from real imported data. Nothing is hardcoded. A marketer uploading a CSV of 500 customers for a coffee brand gets different segment names, different opportunity cards, and different recommended channels than a marketer uploading data for a fashion label — because the ML pipeline generates everything from the actual data shape.

---

## Architecture

```
React Frontend (Vite + Tailwind)
         │
         ▼
FastAPI Backend (Python)
         │
    ┌────┴─────────────────┐
    ▼                      ▼
CSV Parser            MongoDB
    │
    ▼
RFM Scoring Engine
    │
    ▼
KMeans Clustering (scikit-learn)
    │
    ▼
Persona Generation (Gemini 2.0 Flash via OpenRouter)
         │  [Rule-based fallback if LLM unavailable]
    │
    ▼
Segment Analytics Engine
    │
    ▼
LLM Campaign Intelligence (OpenRouter)
    │
    ▼
Stubbed Channel Service ←──── Webhook Callbacks
    │
    ▼
Campaign Analytics
```

**Key architectural principle:** The React frontend performs zero business logic calculations. All intelligence — cluster assignments, persona names, opportunity rankings, campaign projections, funnel estimates — is computed on the backend and returned as structured JSON. The frontend is a rendering layer.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | MongoDB |
| ML Pipeline | scikit-learn (KMeans), pandas (RFM) |
| LLM | Gemini 2.0 Flash via OpenRouter |
| Channel Simulation | Custom stubbed service with async webhooks |
| Deployment | Vercel (frontend), Railway (backend) |

---

## The ML Pipeline — How Customer Intelligence Works

This is the core of the platform. When a CSV is uploaded, the following runs synchronously before any data reaches the frontend.

### Step 1 — CSV Parsing with Flexible Column Mapping

The parser does not expect fixed column names. It uses alias matching so real-world messy CSV exports work without preprocessing:

```
"Customer Name", "customer_name", "Full Name", "Name"  →  internal: name
"Days Since Last Order", "recency", "last_order_days"  →  internal: recency
```

Supported fields: customer name, email, phone, total orders, total spend, days since last order, city, gender, age.

### Step 2 — RFM Feature Engineering

Every customer is scored on three behavioral dimensions using quantile-based bucketing (pandas `qcut`):

- **Recency (R)** — how recently did they order? (1–5, higher = more recent)
- **Frequency (F)** — how many orders have they placed? (1–5, higher = more frequent)
- **Monetary (M)** — how much have they spent in total? (1–5, higher = higher spend)

RFM scores are computed as percentile ranks across the entire uploaded dataset, not against fixed thresholds. This means the scoring adapts to whatever data is uploaded.

### Step 3 — KMeans Clustering

The three RFM scores become a 3-dimensional feature vector per customer. KMeans (k=5) clusters all customers into five behavioral segments. The number of clusters is fixed at 5 because it produces consistently interpretable business segments across different dataset sizes without overfitting.

Feature scaling is applied before clustering so no single RFM dimension dominates. After clustering, per-cluster centroids capture the behavioral signature of each segment.

### Step 4 — AI Persona Generation (Gemini 2.0 Flash)

All five cluster centroids are sent to Gemini in a single prompt. The prompt includes average Recency, Frequency, and Monetary values for each cluster and asks Gemini to return a JSON array of five objects, each containing a memorable food/retail-themed persona name and a one-line behavioral description.

Example output for a restaurant dataset:
- **Ghost Diners** — Weekly buyers who have gone silent for 40+ days
- **Premium Diners** — High-spend customers who order frequently and recently
- **Weekend Warriors** — Consistent Saturday/Sunday orderers with mid-range spend
- **Night Snackers** — Post-10PM regulars with high frequency but lower basket size
- **Morning Regulars** — Breakfast orderers with strong loyalty but low average order value

If the Gemini API is unavailable or the key is missing, a rule-based fallback assigns generic persona names using RFM score thresholds. The pipeline never breaks.

Cluster colors are assigned by sorting on recency score — the best-recency cluster gets green, the worst gets gray — so color meaning stays consistent across different datasets.

### Step 5 — Status Derivation

After clustering, each customer receives a derived status label based on their actual RFM scores:

- **High Value** — high frequency + high monetary score
- **Active** — high recency score
- **At Risk** — lapsed but was historically frequent
- **Dormant** — lapsed and low frequency

This runs in `_derive_status()` on the backend. The frontend never computes status.

### Step 6 — Segment Analytics

Per-segment business metrics are computed: customer count, average spend, average orders, average recency, potential revenue estimate, recommended channel, and recommended offer type. These feed the Dashboard, the Customer Intelligence workspace, and the Campaign Builder.

→ [Technical Architecture Document](./artifacts/PulseCRM-Overview.docx)

---

## Application Stages

### Stage 1 — Data Import

The import modal supports both CSV upload and a built-in seed dataset (120 synthetic customers). Critically, the seed data path does not bypass the ML pipeline — it converts the generated customers to CSV format and posts through the same `/api/analyze` endpoint. Both paths undergo identical processing.

During upload, the interface visualizes each processing stage in real time rather than showing a generic spinner:

```
Uploading → Parsing → Customer Intelligence → Segment Generation → Final Processing
```

Each stage has success and failure states. If the pipeline fails at any point, a descriptive error screen appears with a retry option.

→ [Frontend Flow Document](./artifacts/PulseCRM-Frontend&Flow.docx)

---

### Stage 2 — Customer Intelligence Workspace

The Customers page is the intelligence workspace, not a customer list. It combines customer management, segmentation, filtering, and AI recommendations in one view.

**Dataset Summary** at the top shows total customers, total orders, average spend, and last sync time — all computed live from the uploaded data, not hardcoded.

**Dynamic Filters** are generated entirely from the actual dataset. If a CSV has no city column, the city filter doesn't appear. If a CSV introduces a new persona name from Gemini, the persona filter automatically includes it. There are no hardcoded filter options anywhere in the codebase.

Filter dimensions:
- Persona (derived from Gemini cluster labels)
- Status (Active, High Value, At Risk, Dormant)
- Spending range (min/max from dataset)
- City (if present in dataset)
- Gender (if present in dataset)
- Age range (if present in dataset)
- Order count range

**Customer Drawer** — clicking any customer opens a side drawer with their RFM scores displayed as visual bar indicators (green for 4–5, orange for 3, gray for 1–2), persona description from Gemini, behavioral stats, and a recommended campaign type derived from their RFM scores.

**Segment Analysis Panel** — selecting a segment reveals an AI-generated analysis: executive summary, revenue opportunity, AI confidence score, behavioral patterns (preferred category, channel, active hours), expected recovery probability, and specific recommendations for best channel, timing, offer type, and messaging tone.

Selecting any segment here pre-loads it as the campaign audience in the Campaign Builder.

→ [Customer Intelligence Document](./artifacts/Customer&Data_Handling_stage.docx)

---

### Stage 3 — Dashboard Intelligence

The Dashboard answers one question: **"What should I do today?"**

It has four distinct states:

```
No Dataset       →  Import Dataset CTA
Dataset Imported →  Run Analysis prompt
Analysis Done    →  AI Opportunities + Insights
Campaign Running →  Live Campaign Progress panel
```

**AI Opportunities** — three cards generated by sending real segment data to the LLM via `/api/dashboard-insights`. The prompt includes every segment's label, customer count, average spend, average orders, recency, potential revenue, recommended channel, and offer type. The LLM returns structured JSON: opportunity title, subtitle, emoji, confidence score, channel recommendation, an analyst-style quote, and three key stats. These are ranked by potential revenue.

Each card has two actions: "View Segment" (navigates to Customers with that persona pre-filtered) and "Launch" (navigates to Campaign Builder with that segment pre-loaded as audience).

**AI Insights** — six behavioral findings generated in the same API call, covering: revenue concentration, churn risk, loyalty opportunity, order frequency patterns, best channel mix, and one non-obvious pattern. Every insight uses actual numbers from the segment data.

**Insights caching** — a fingerprint system prevents redundant LLM calls. When segments load, a fingerprint is created from segment labels and customer count. The insights are only re-fetched when the fingerprint changes, meaning navigating away and back shows cached insights instantly.

**Live Feed Sidebar** — appears when a campaign is running, showing delivery progress, message metrics, and a real-time timeline of events.

→ [Dashboard Document](./artifacts/PulseCRM-dashboard.docx)

---

### Stage 4 — Campaign Builder

The Campaign Builder is a five-step flow on a single scrollable page. The audience is already resolved before the page renders — either from a segment selected in the Customers workspace or from a Dashboard opportunity card. The page never asks the marketer to re-select an audience.

**Step 1 — Audience Summary**
Four stat cards computed fresh from the resolved customer objects: Persona, Customer Count, Average Spend, Average Frequency. A banner shows whether a filtered subset or the full list is being targeted.

**Step 2 — AI Strategy Generation**
Clicking "Generate Strategy" posts to `/api/generate-strategy` with persona label, customer count, and behavioral averages. The LLM returns a JSON object with: objective, reason, offer, recommended channel, best time, and confidence score.

The strategy card displays the AI's reasoning and lets the marketer override every field — objective via dropdown, offer via text, timing via text, channel via pill buttons. Changing channel automatically re-fetches the campaign estimate.

Confidence is displayed as a color-coded badge: green above 85%, amber above 70%, red below.

**Step 3 — AI Message Generation**
The marketer picks a tone (Friendly, Urgent, Exclusive, Playful, Professional) and clicks Generate. The backend calls the LLM with persona, objective, offer, channel, and tone, returning a short personalized marketing message. The message renders in an editable textarea. The `{name}` placeholder is supported for per-recipient personalization. The marketer can regenerate unlimited times.

**Step 4 — Campaign Configuration**
Campaign name (auto-filled as "Objective – Persona" if blank), schedule datetime (empty = immediate), expiry date, and three attachment options: banner image, deep link, promo code. The banner toggle is wired to the phone preview so it updates visually.

**Step 5 — Estimated Results**
Computed by `/api/estimate-campaign` using benchmark tables on the backend:
- `_CHANNEL_DELIVERY` — delivery rate per channel
- `_CHANNEL_OPEN` — open rate per channel
- `_CHANNEL_CTR` — click-through rate per channel
- `_PERSONA_CONVERSION` — conversion modifier per persona type

The backend applies recency and frequency modifiers to adjust conversion rates and computes a confidence score based on audience size and behavioral signals. The frontend displays six stat cards: Audience, Estimated Reach, Expected CTR, Estimated Orders, Expected Revenue, Channel/Best Time.

**Launch Simulation**
Clicking Launch shows a five-stage fullscreen modal: Validating audience → Personalising messages → Connecting to channel → Queuing delivery → Campaign live. Each stage activates with 1.2-second intervals. The actual API call fires in the background during the animation, decoupling UX from backend latency.

→ [Campaign Builder Document](./artifacts/Campaign_Creation&Lanch.docx)

---

### Stage 5 — Channel Service & Delivery Simulation

This is the most architecturally significant component. PulseCRM does not integrate any real messaging provider. Instead, a separate stubbed Channel Service simulates the full communication lifecycle with async webhook callbacks.

**Flow:**

```
Campaign Launch
      │
      ▼
POST /api/campaign  (CRM Backend)
      │
      ▼
Channel Service  (separate service)
      │  [simulates outcomes per recipient]
      │
      ▼  async callbacks
POST /api/webhook/delivery  →  delivered / failed
POST /api/webhook/open      →  opened
POST /api/webhook/click     →  clicked
POST /api/webhook/order     →  order placed
      │
      ▼
MongoDB (state updated per callback)
      │
      ▼
Frontend (live metrics update)
```

Each recipient gets individually simulated outcomes. Callback timing is staggered to simulate realistic delivery curves (not all-at-once). The system handles volume, ordering, and failures in the callback loop — the same way real channel providers like WhatsApp Business API or Kaleyra actually work.

Campaign metrics tracked: Queued → Sent → Delivered → Opened → Clicked → Orders → Revenue. The marketer sees aggregate progress, not individual customer events.

---

### Stage 6 — Campaign Analytics

After a campaign completes, it moves to Analytics. Metrics tracked:

- Recipients, Sent, Delivered, Opened, Read, Clicked, Failed
- Orders Generated, Revenue Generated
- Conversion Rate, CTR, Delivery Rate
- Delivery Timeline (chart)
- Revenue Attribution (which segment drove which revenue)
- Campaign Comparison table (ROI, Revenue, CTR, Orders across all campaigns)
- Top performing cities
- Device breakdown
- Failed deliveries with failure reasons

The Analytics page also surfaces AI insights from the completed campaign — patterns the marketer can act on for the next campaign.

---

## Key Engineering Decisions

**No frontend formulas.** All campaign projections, funnel estimates, and business metrics are computed on the backend. The React frontend only renders what the server returns. Benchmark tables (`_CHANNEL_DELIVERY`, `_CHANNEL_OPEN`, `_CHANNEL_CTR`, `_PERSONA_CONVERSION`) live exclusively in Python.

**No hardcoded personas.** Segment labels, descriptions, opportunity titles, insight text, and recommended channels all come from the live ML pipeline. The same codebase works identically regardless of what the uploaded CSV produces.

**LLM fallback resilience.** Gemini persona generation has a rule-based fallback. If the API key is missing or the service is unavailable, the pipeline continues with generic persona labels. No user-visible failure occurs.

**Insights fingerprinting.** Dashboard LLM calls are gated behind a fingerprint derived from segment labels and customer count. Navigating away and back uses cached insights. Re-importing a different CSV triggers fresh generation.

**State lifted for navigation persistence.** AI insights state lives in `Dashboard.jsx`, not `DashboardHome.jsx`. Since `DashboardHome` unmounts on navigation, keeping state there would lose the data on return. Lifting it one level preserves it for the session.

**Context-driven segment navigation.** `selectedSegment` in `CRMContext` acts as a one-time signal. The Customers page reads it, applies the filter, then calls `clearSegment`. Navigating away and back doesn't re-apply the filter unexpectedly.

**Same pipeline for seed data.** The built-in sample dataset converts generated customers to CSV and posts through `/api/analyze` — not a shortcut endpoint. This ensures the demo experience is identical to a real import.

---

## What Each Page Answers

| Page | Business Question |
|---|---|
| Dashboard | What should I do today? |
| Customers | Who should I target and why? |
| Campaign Builder | How should I communicate? |
| Analytics | Did the campaign succeed? |

No page duplicates another page's responsibility. Every screen exists to support the continuous workflow — not as an isolated feature.

---

## Design Philosophy

The platform is built around one principle: **the marketer should spend time making business decisions, not manually searching through customer data.**

AI is woven into the product at every step — it segments customers, names personas, surfaces opportunities, recommends strategies, generates messages, and interprets results. But it never replaces the marketer's judgment. Every AI recommendation is visible, editable, and overridable. The confidence scores are explicit. The reasoning is shown. The marketer always has final control before anything goes out.

---

## Detailed Documentation

Each stage of the product has an accompanying design and engineering document:

- [Product Design Overview](./artifacts/PulseCRM%20Product_Design.pdf) — full product philosophy, workflow, and stage-by-stage specifications
- [Technical Architecture & ML Pipeline](./artifacts/PulseCRM-Overview.docx) — system architecture, RFM scoring, KMeans, persona generation
- [Dashboard Intelligence](./artifacts/PulseCRM-dashboard.docx) — state architecture, AI opportunities, insights caching, navigation system
- [Customer Intelligence Workspace](./artifacts/Customer&Data_Handling_stage.docx) — dynamic filters, dataset processing, segment analysis
- [Campaign Builder & Launch](./artifacts/Campaign_Creation&Lanch.docx) — step flow, AI strategy generation, message generation, launch simulation
- [Frontend Product Workflow](./artifacts/PulseCRM-Frontend&Flow.docx) — end-to-end UX decisions and application states

---

## Future Scope

- Predictive churn modeling (identify at-risk customers before they lapse)
- Dynamic audience refresh (segments auto-update as new orders arrive)
- A/B campaign testing with statistical significance
- Multi-brand dataset support
- Real communication provider integrations (WhatsApp Business API, Twilio)
- Customer lifetime value prediction
- Campaign scheduling with AI-recommended send times
- Reinforcement learning for campaign optimization across successive runs
