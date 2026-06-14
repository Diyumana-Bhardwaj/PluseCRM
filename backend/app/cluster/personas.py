from .constants import FALLBACK_PERSONAS


def fallback_label(avg_r: float, avg_f: float, avg_m: float) -> str:
    if avg_r >= 4 and avg_f >= 4 and avg_m >= 4:
        return "Premium Diner"

    if avg_f >= 4 and avg_m >= 3:
        return "Loyal Regular"

    if avg_r < 3 and avg_f >= 3:
        return "At Risk"

    if avg_r >= 4 and avg_f < 2:
        return "New Explorer"

    if avg_r < 2 and avg_f < 2 and avg_m < 2:
        return "Ghost Diner"

    return "Weekend Warrior"


def resolve_labels(
    cluster_meta: list[dict],
    gemini_personas: list[dict],
) -> list[dict]:
    used: set[str] = set()

    for meta in cluster_meta:
        cid = meta["cluster_id"]
        r, f, m = meta["centroid_r"], meta["centroid_f"], meta["centroid_m"]

        if gemini_personas and cid < len(gemini_personas):
            label = gemini_personas[cid].get("label", "").strip()
            description = gemini_personas[cid].get("description", "").strip()
        else:
            label, description = "", ""

        if not label or label in used:
            label = fallback_label(r, f, m)

        if label in used:
            label = f"{label} {cid + 1}"

        used.add(label)
        meta["label"] = label
        meta["description"] = description

    return cluster_meta
