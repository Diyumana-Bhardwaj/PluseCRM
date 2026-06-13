"""
formatter.py — Final response assembly.

Takes the enriched customers list and the analytics-enriched cluster_meta
and produces the canonical API response objects.

Customer-level response shape:
{
    ...original_fields,
    "cluster_id":   int,
    "confidence":   float,   # 0–100
    "persona": {
        "label":       str,
        "description": str,
    }
}

Segment-level response shape (from analytics.py — see that module for full schema).

Colour mapping belongs to the frontend. This module ships no hex codes.
"""


def format_customers(customers: list[dict], cluster_meta: list[dict]) -> list[dict]:
    """
    Attach a lightweight persona object to each customer dict.

    cluster_meta must already contain label + description (i.e. resolve_labels
    has been called).
    """
    meta_by_id = {m["cluster_id"]: m for m in cluster_meta}
    result = []

    for c in customers:
        cid  = c.get("cluster_id")
        meta = meta_by_id.get(cid, {})
        result.append({
            **c,
            "persona": {
                "label":       meta.get("label", "Unknown"),
                "description": meta.get("description", ""),
            },
        })

    return result


def format_segments(cluster_meta_with_analytics: list[dict]) -> list[dict]:
    """
    Return the segment summaries exactly as produced by analytics.py,
    dropping internal centroid fields that are not useful to the API consumer.
    """
    internal_keys = {"centroid_r", "centroid_f", "centroid_m", "value_score"}
    return [
        {k: v for k, v in seg.items() if k not in internal_keys}
        for seg in cluster_meta_with_analytics
    ]
