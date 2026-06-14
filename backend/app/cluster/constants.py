FALLBACK_PERSONAS = [
    "Premium Diner",
    "Loyal Regular",
    "Weekend Warrior",
    "Night Snacker",
    "Ghost Diner",
]


RFM_WEIGHTS = {
    "monetary":  0.5,
    "frequency": 0.3,
    "recency":   0.2,
}

MODEL  = "google/gemini-2.5-flash" 
OR_URL = "https://openrouter.ai/api/v1/chat/completions"