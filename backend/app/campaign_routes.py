import os
import json
import math
import datetime
import logging
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .cluster.constants import MODEL, OR_URL

logger = logging.getLogger(__name__)
router = APIRouter()


SYSTEM_PROMPT = """You are PulseCRM AI.
You write marketing content for restaurant brands.
Your writing style is inspired by Zomato, Swiggy, Blinkit and modern D2C startups.
You never sound corporate. You avoid clichés.
You write concise, witty and engaging copy.
You optimize for click-through rate and conversions.
Return exactly what is requested. Never explain your reasoning unless asked."""

async def _llm(user_prompt: str, max_tokens: int = 512) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured.")

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            OR_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type":  "application/json",
            },
            json={
                "model": MODEL,
                "max_tokens": max_tokens,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": user_prompt},
                ],
            },
        )
    print("Model:", MODEL)
    print("Key loaded:", bool(api_key))

    if resp.status_code != 200:
        print("========== OPENROUTER ERROR ==========")
        print("Status:", resp.status_code)
        print("Body:", resp.text)
        print("======================================")
        raise HTTPException(status_code=502, detail=resp.text)

    return resp.json()["choices"][0]["message"]["content"].strip()

def _parse_json_block(text: str) -> dict:
    clean = text.strip()
    if clean.startswith("```"):
        lines = clean.splitlines()
        clean = "\n".join(lines[1:-1]) if len(lines) > 2 else clean
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        return {}


# ── Channel benchmarks (realistic restaurant / food delivery) ─────────────────

_CHANNEL_DELIVERY: dict[str, float] = {
    "WhatsApp": 0.97,
    "SMS":      0.97,
    "Email":    0.90,
    "RCS":      0.92,
}

_CHANNEL_OPEN: dict[str, float] = {
    "WhatsApp": 0.82,
    "SMS":      0.94,
    "Email":    0.28,
    "RCS":      0.60,
}

_CHANNEL_CTR: dict[str, float] = {
    "WhatsApp": 0.24,
    "SMS":      0.13,
    "Email":    0.05,
    "RCS":      0.18,
}

# ── Persona-based post-click conversion rates ─────────────────────────────────

_PERSONA_CONVERSION: dict[str, float] = {
    "Premium Diner":   0.28,
    "Weekend Foodies": 0.18,
    "Ghost Diner":     0.08,
    "Deal Hunters":    0.24,
    "Loyal Regulars":  0.32,
    "New Users":       0.15,
}

_DEFAULT_CONVERSION = 0.18


def _persona_conversion(persona: str) -> float:
    persona_lower = persona.lower()
    for key, rate in _PERSONA_CONVERSION.items():
        if any(word in persona_lower for word in key.lower().split()):
            return rate
    return _DEFAULT_CONVERSION


def _estimate_results(
    audience:      int,
    channel:       str,
    avg_spend:     float,
    avg_frequency: float,
    avg_recency:   int,
    persona:       str = "",
) -> dict:
    safe_frequency = max(avg_frequency, 1.0)
    aov = avg_spend / safe_frequency if avg_spend > 0 else 0.0

    delivery_rate = _CHANNEL_DELIVERY.get(channel, 0.90)
    open_rate     = _CHANNEL_OPEN.get(channel, 0.50)
    ctr           = _CHANNEL_CTR.get(channel, 0.12)
    conversion    = _persona_conversion(persona)

    # Recency modifier
    if avg_recency <= 15:
        conversion *= 1.10
    elif avg_recency <= 30:
        conversion *= 1.0
    elif avg_recency <= 60:
        conversion *= 0.9
    else:
        conversion *= 0.8

    # Frequency modifier
    if avg_frequency > 8:
        conversion *= 1.15
    elif avg_frequency > 5:
        conversion *= 1.08
    elif avg_frequency < 2:
        conversion *= 0.90

    delivered = math.floor(audience * delivery_rate)
    opened    = math.floor(delivered * open_rate)
    clicked   = math.floor(opened * ctr)
    orders    = math.floor(clicked * conversion)
    revenue   = math.floor(orders * aov)

    # Confidence
    confidence = 90
    if audience < 50:
        confidence -= 8
    if avg_frequency < 2:
        confidence -= 3
    if avg_recency > 90:
        confidence -= 5
    confidence = max(65, confidence)

    return {
        "audience":          audience,
        "estimatedDelivery": delivered,
        "estimatedOpens":    opened,
        "estimatedClicks":   clicked,
        "estimatedOrders":   orders,
        "expectedRevenue":   revenue,
        "avgOrderValue":     round(aov),
        "expectedCTR":       round(ctr * 100),
        "conversionRate":    round(conversion * 100),
        "confidence":        confidence,
    }


# ── Pydantic models ───────────────────────────────────────────────────────────

class StrategyRequest(BaseModel):
    persona:        str
    customers:      int
    avgSpend:       Optional[float] = 0.0
    avgRecency:     Optional[int]   = 30
    avgFrequency:   Optional[float] = 2.0

class EstimateRequest(BaseModel):
    persona:       str
    channel:       str
    audience:      int
    avgSpend:      float
    avgFrequency:  float
    avgRecency:    int

class StrategyResponse(BaseModel):
    objective:  str
    reason:     str
    offer:      str
    channel:    str
    bestTime:   str
    confidence: int


class MessageRequest(BaseModel):
    persona:    str
    objective:  str
    offer:      str
    channel:    str
    tone:       Optional[str] = "Friendly"
    sampleName: Optional[str] = "{name}"


class MessageResponse(BaseModel):
    message: str


class CampaignRequest(BaseModel):
    name:         str
    persona:      str
    objective:    str
    offer:        str
    channel:      str
    message:      str
    schedule:     Optional[str]        = None
    expiryDate:   Optional[str]        = None
    attachment:   Optional[str]        = None
    audienceIds:  Optional[list[str]]  = []
    avgSpend:     Optional[float]      = 0.0
    avgFrequency: Optional[float]      = 2.0
    avgRecency:   Optional[int]        = 30


class CampaignResponse(BaseModel):
    campaignId: int
    status:     str
    queuedAt:   str


# ── In-memory store ───────────────────────────────────────────────────────────

_campaign_store: list[dict] = []
_id_counter = 0


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/generate-strategy", response_model=StrategyResponse)
async def generate_strategy(req: StrategyRequest):
    prompt = f"""You are a Senior CRM Marketing Manager at Zomato.

Given a customer segment, recommend the highest-performing campaign.

Return ONLY JSON with these exact keys:
{{
  "objective": "<Retention | Reactivation | Upsell | Acquisition>",
  "reason":    "<one sentence>",
  "offer":     "<realistic specific offer>",
  "channel":   "<WhatsApp | SMS | Email | RCS>",
  "bestTime":  "<e.g. Friday 6 PM>",
  "confidence": <integer 75–95>
}}

Segment:
  Persona      : {req.persona}
  Customers    : {req.customers}
  Avg spend    : ₹{req.avgSpend:.0f}
  Avg recency  : {req.avgRecency} days since last order
  Avg frequency: {req.avgFrequency:.1f} orders/month

Think like a growth marketer. Do NOT mention AI."""

    try:
        parsed = _parse_json_block(await _llm(prompt, max_tokens=300))
    except Exception as e:
        print("Generate Strategy Error:", repr(e))
        raise

    return StrategyResponse(
        objective  = parsed.get("objective", "Retention"),
        reason     = parsed.get("reason",    f"{req.persona} segment shows declining engagement."),
        offer      = parsed.get("offer",     "15% off on your next order"),
        channel    = parsed.get("channel",   "WhatsApp"),
        bestTime   = parsed.get("bestTime",  "Friday 6 PM"),
        confidence = max(60, min(99, int(parsed.get("confidence", 82)))),
    )


@router.post("/generate-message", response_model=MessageResponse)
async def generate_message(req: MessageRequest):
    channel_notes = {
        "WhatsApp": "conversational, 1-2 emoji, under 180 chars",
        "SMS":      "no emoji, plain text, under 160 chars",
        "Email":    "greeting + body + CTA, under 300 chars",
        "RCS":      "rich text, under 250 chars",
        "Push":     "punchy headline + one line, under 100 chars",
    }

    prompt = f"""You are a senior CRM copywriter at Zomato.

Write a marketing message that feels human. Never sound robotic.
The message should feel like it came from Zomato or Swiggy.

Guidelines:
- Friendly, playful, conversational, slightly Gen-Z but still professional
- Short, high conversion, no cheesy marketing
- Maximum 180 characters
- 1-2 emojis only
- Strong CTA
- Mention the offer naturally

Customer Persona : {req.persona}
Campaign Goal    : {req.objective}
Offer            : {req.offer}
Channel          : {req.channel} ({channel_notes.get(req.channel, "concise")})
Tone             : {req.tone}
Name placeholder : {{name}}

Return ONLY the message. Do not wrap in quotes."""

    try:
        message = await _llm(prompt, max_tokens=200)
    except Exception:
        message = f"Hey {{name}} 👋\n\nYour next order deserves a treat! Enjoy {req.offer}.\n\nOrder Now 🍕"

    return MessageResponse(message=message)

@router.post("/estimate-campaign")
async def estimate_campaign(req: EstimateRequest):
    return _estimate_results(
        audience      = req.audience,
        channel       = req.channel,
        avg_spend     = req.avgSpend,
        avg_frequency = req.avgFrequency,
        avg_recency   = req.avgRecency,
        persona       = req.persona,
    )

@router.post("/campaign", response_model=CampaignResponse)
async def create_campaign(req: CampaignRequest):
    global _id_counter
    _id_counter += 1
    now = datetime.datetime.utcnow().isoformat() + "Z"

    estimated = _estimate_results(
        audience      = len(req.audienceIds) if req.audienceIds else 0,
        channel       = req.channel,
        avg_spend     = req.avgSpend or 0.0,
        avg_frequency = req.avgFrequency or 2.0,
        avg_recency   = req.avgRecency or 30,
        persona       = req.persona,
    )

    record = {
        "campaignId":   _id_counter,
        "status":       "running",
        "queuedAt":     now,
        "name":         req.name,
        "persona":      req.persona,
        "objective":    req.objective,
        "offer":        req.offer,
        "channel":      req.channel,
        "message":      req.message,
        "schedule":     req.schedule or "immediate",
        "expiryDate":   req.expiryDate,
        "attachment":   req.attachment,
        "audienceIds":  req.audienceIds or [],
        "avgRecency":   req.avgRecency,
        "avgFrequency": req.avgFrequency,
        "estimated":    estimated,
        "sent":         0,
        "delivered":    0,
        "opened":       0,
        "clicked":      0,
        "revenue":      0,
    }
    _campaign_store.append(record)
    logger.info("Campaign %s created: %s → %s (%s)", _id_counter, req.persona, req.channel, req.objective)

    return CampaignResponse(
        campaignId = _id_counter,
        status     = "running",
        queuedAt   = now,
    )


@router.get("/campaigns")
async def list_campaigns():
    return {"campaigns": _campaign_store}


@router.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: int):
    for c in _campaign_store:
        if c["campaignId"] == campaign_id:
            return c
    raise HTTPException(status_code=404, detail="Campaign not found.")