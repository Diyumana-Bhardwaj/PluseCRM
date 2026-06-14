import pandas as pd

_CAMPAIGN_RULES: dict[tuple, dict] = {
    ("high", "high"): {
        "channel": "Email",
        "offer":   "Early Access / Loyalty Reward",
        "time":    "12 PM – 2 PM",
    },
    ("high", "low"): {
        "channel": "Push Notification",
        "offer":   "Welcome Back – First Reorder Discount",
        "time":    "6 PM – 8 PM",
    },
    ("low", "high"): {
        "channel": "WhatsApp",
        "offer":   "Win-Back – 20 % Off Next Order",
        "time":    "7 PM – 9 PM",
    },
    ("low", "low"): {
        "channel": "SMS",
        "offer":   "Re-engagement Offer – Free Delivery",
        "time":    "5 PM – 7 PM",
    },
}


def _campaign_rec(avg_r: float, avg_f: float) -> dict:
    r_band = "high" if avg_r >= 3.5 else "low"
    f_band = "high" if avg_f >= 3.5 else "low"
    return _CAMPAIGN_RULES[(r_band, f_band)]


def compute_analytics(
    customers: list[dict],
    cluster_meta: list[dict],
) -> list[dict]:
    df = pd.DataFrame(customers)
    meta_by_id = {m["cluster_id"]: m for m in cluster_meta}

    results = []
    for cid, group in df.groupby("cluster_id"):
        meta = meta_by_id.get(int(cid), {})
        avg_r = meta.get("centroid_r", 0)
        avg_f = meta.get("centroid_f", 0)
        rec = _campaign_rec(avg_r, avg_f)

        avg_spend   = round(group["spend"].mean(), 2)
        avg_orders  = round(group["orders"].mean(), 2)
        count       = len(group)

        results.append({
            **meta,
            "customer_count":      count,
            "avg_spend":           avg_spend,
            "avg_orders":          avg_orders,
            "avg_recency_days":    round(group["daysAgo"].mean(), 1),
            "avg_order_value":     round(group["avgOrder"].mean(), 2),
            "potential_revenue":   round(avg_spend * count, 2),
            "recommended_channel": rec["channel"],
            "recommended_offer":   rec["offer"],
            "best_send_time":      rec["time"],
        })

    return sorted(results, key=lambda x: x["cluster_id"])
