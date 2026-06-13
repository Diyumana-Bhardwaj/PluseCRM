"""
constants.py — Shared constants for the clustering pipeline.

Colour slots intentionally live in the frontend.
Backend only ships persona labels and business metadata.
"""

# Ordered persona definitions used for stable, value-based assignment.
# Each entry maps a rank (0 = highest business value) to a default label
# used when Gemini is unavailable.
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