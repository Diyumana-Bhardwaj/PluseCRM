import logging

from .rfm import score_rfm
from .kmeans import run_kmeans
from .gemini import get_personas
from .personas import resolve_labels
from .analytics import compute_analytics
from .formatter import format_customers, format_segments

logger = logging.getLogger(__name__)


def run_pipeline(
    raw_customers: list[dict],
    n_clusters: int = 5,
) -> dict:
    # 1. Score RFM
    scored = score_rfm(raw_customers)
    logger.info("RFM scoring complete (%d customers).", len(scored))

    # 2. Cluster
    clustered, cluster_meta = run_kmeans(scored, n_clusters=n_clusters)
    logger.info("KMeans complete (%d clusters).", len(cluster_meta))

    # 3. Generate personas (cached; Gemini-first, rule-based fallback)
    centroids = [
        (m["centroid_r"], m["centroid_f"], m["centroid_m"])
        for m in cluster_meta
    ]
    gemini_personas = get_personas(centroids)

    # 4. Resolve labels (merge Gemini result with fallback rules)
    cluster_meta = resolve_labels(cluster_meta, gemini_personas)

    # 5. Compute segment analytics
    cluster_meta = compute_analytics(clustered, cluster_meta)

    # 6. Format final response
    customers_out = format_customers(clustered, cluster_meta)
    segments_out  = format_segments(cluster_meta)

    return {
        "customers": customers_out,
        "segments":  segments_out,
    }
