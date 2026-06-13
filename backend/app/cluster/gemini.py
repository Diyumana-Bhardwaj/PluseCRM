import os
import json
import logging
import hashlib
import urllib.request
import urllib.error

from .constants import FALLBACK_PERSONAS, MODEL, OR_URL

logger = logging.getLogger(__name__)
_persona_cache: dict[str, list[dict]] = {}


def _centroid_signature(centroids: list[tuple]) -> str:

    rounded = [(round(r, 1), round(f, 1), round(m, 1)) for r, f, m in centroids]
    return hashlib.md5(json.dumps(rounded, sort_keys=True).encode()).hexdigest()


def _call_openrouter(centroids: list[tuple]) -> list[dict]:
    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        raise EnvironmentError("OPENROUTER_API_KEY not set.")

    clusters_text = "\n".join(
        f"  Cluster {i}: Recency={r:.2f}/5, Frequency={f:.2f}/5, Monetary={m:.2f}/5"
        for i, (r, f, m) in enumerate(centroids)
    )

    prompt = f"""You are an expert CRM strategist working at Zomato, Swiggy and Blinkit.
Transform customer analytics into memorable marketing personas.

Rules:
- Persona names must be short, catchy and memorable
- Avoid boring names like "High Value Customers"
- Sound like startup or Zomato internal segment names
- Modern, fun, slightly Gen-Z but professional
- No emojis. Never mention RFM scores.

Clusters ({len(centroids)} total, sorted highest to lowest value):
{clusters_text}

Return ONLY a JSON array of exactly {len(centroids)} objects:
[{{"label": "...", "description": "..."}}, ...]
No markdown, no extra text."""

    body = json.dumps({
        "model": MODEL,
        "max_tokens": 400,
        "messages": [
            {"role": "system", "content": "You are PulseCRM AI. Return exactly what is requested. Never explain your reasoning."},
            {"role": "user",   "content": prompt},
        ],
    }).encode()

    req = urllib.request.Request(
        OR_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type":  "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = json.loads(resp.read())

    text = raw["choices"][0]["message"]["content"].strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    personas = json.loads(text.strip())
    if not isinstance(personas, list) or len(personas) != len(centroids):
        raise ValueError(f"Got {len(personas)} personas for {len(centroids)} clusters.")
    return personas


def get_personas(centroids: list[tuple]) -> list[dict]:
    sig = _centroid_signature(centroids)

    if sig in _persona_cache:
        logger.debug("Persona cache hit (sig=%s).", sig[:8])
        return _persona_cache[sig]

    try:
        personas = _call_openrouter(centroids)
        _persona_cache[sig] = personas
        logger.info("Gemini personas cached (sig=%s).", sig[:8])
        return personas
    except (EnvironmentError, urllib.error.URLError,
            KeyError, json.JSONDecodeError, ValueError) as exc:
        logger.warning("Gemini unavailable (%s) — using fallback personas.", exc)
        return []
