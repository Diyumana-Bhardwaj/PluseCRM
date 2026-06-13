import pandas as pd


def score_rfm(customers: list[dict]) -> list[dict]:
    if not customers:
        return customers

    df = pd.DataFrame(customers)

    df["rfm_r"] = pd.qcut(df["daysAgo"].rank(method="first", ascending=True),
                           q=5, labels=[5, 4, 3, 2, 1]).astype(int)

    # Frequency: more orders = higher score
    df["rfm_f"] = pd.qcut(df["orders"].rank(method="first", ascending=True),
                           q=5, labels=[1, 2, 3, 4, 5]).astype(int)

    # Monetary: higher spend = higher score
    df["rfm_m"] = pd.qcut(df["spend"].rank(method="first", ascending=True),
                           q=5, labels=[1, 2, 3, 4, 5]).astype(int)

    df["rfm_score"] = (
        df["rfm_r"].astype(str)
        + df["rfm_f"].astype(str)
        + df["rfm_m"].astype(str)
    )

    return df.to_dict(orient="records")
