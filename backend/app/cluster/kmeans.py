import logging
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from .constants import RFM_WEIGHTS

logger = logging.getLogger(__name__)


def _business_value(r: float, f: float, m: float) -> float:
    w = RFM_WEIGHTS
    return w["monetary"] * m + w["frequency"] * f + w["recency"] * r


def _compute_confidence(X_scaled: np.ndarray, labels: np.ndarray,
                        centers: np.ndarray) -> np.ndarray:
    confidences = np.zeros(len(X_scaled))
    for cid in np.unique(labels):
        mask = labels == cid
        dists = np.linalg.norm(X_scaled[mask] - centers[cid], axis=1)
        max_d = dists.max() if dists.max() > 0 else 1.0
        confidences[mask] = (1 - dists / max_d) * 100
    return np.round(confidences, 1)


def run_kmeans(
    customers: list[dict],
    n_clusters: int = 5,
    random_state: int = 42,
) -> tuple[list[dict], list[dict]]:

    if not customers:
        return customers, []

    df = pd.DataFrame(customers)
    features = df[["rfm_r", "rfm_f", "rfm_m"]].values.astype(float)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(features)

    k = min(n_clusters, len(df))
    km = KMeans(n_clusters=k, random_state=random_state, n_init="auto")
    raw_labels = km.fit_predict(X_scaled)

    # Inverse-transform centroids back to 1–5 RFM scale
    centroids_rfm = scaler.inverse_transform(km.cluster_centers_)  # shape (k, 3)

    # ── Stable ranking by business value ─────────────────────────────────────
    # Sort raw cluster ids by composite score descending so rank 0 = best segment.
    value_scores = [
        _business_value(centroids_rfm[i, 0], centroids_rfm[i, 1], centroids_rfm[i, 2])
        for i in range(k)
    ]
    sorted_raw_ids = sorted(range(k), key=lambda i: value_scores[i], reverse=True)
    raw_to_rank = {raw: rank for rank, raw in enumerate(sorted_raw_ids)}

    # Re-map raw KMeans labels → stable rank-based cluster_id
    ranked_labels = np.array([raw_to_rank[lbl] for lbl in raw_labels])

    # Confidence per customer
    confidences = _compute_confidence(X_scaled, raw_labels, km.cluster_centers_)

    df["cluster_id"] = ranked_labels
    df["confidence"] = confidences
    cluster_meta = []
    for rank in range(k):
        raw_id = sorted_raw_ids[rank]
        r, f, m = centroids_rfm[raw_id]
        cluster_meta.append({
            "cluster_id":  rank,
            "centroid_r":  round(float(r), 3),
            "centroid_f":  round(float(f), 3),
            "centroid_m":  round(float(m), 3),
            "value_score": round(value_scores[raw_id], 3),
        })

    return df.to_dict(orient="records"), cluster_meta
