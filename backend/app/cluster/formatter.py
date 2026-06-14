def format_customers(customers: list[dict], cluster_meta: list[dict]) -> list[dict]:

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
    internal_keys = {"centroid_r", "centroid_f", "centroid_m", "value_score"}
    return [
        {k: v for k, v in seg.items() if k not in internal_keys}
        for seg in cluster_meta_with_analytics
    ]
