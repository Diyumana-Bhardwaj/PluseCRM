import io
import pandas as pd
from datetime import datetime, timezone

COLUMN_ALIASES: dict[str, list[str]] = {
    "name":       ["customer name", "name", "full name", "customer", "client name"],
    "email":      ["email", "email address", "e-mail", "mail"],
    "phone":      ["phone", "phone number", "mobile", "contact number", "tel"],
    "orders":     ["orders", "order count", "total orders", "num orders", "order_count"],
    "spend":      ["spend", "total spend", "total spent", "revenue", "total_spend", "amount"],
    "days_ago":   ["days ago", "days_ago", "last order days", "days since last order",
                   "recency", "last_order_days"],
    # Optional fields — will be filled with defaults if absent
    "city":       ["city", "location", "town", "region"],
    "gender":     ["gender", "sex"],
    "age":        ["age", "customer age"],
}

REQUIRED_FIELDS = ["name", "email", "orders", "spend", "days_ago"]
CITIES_DEFAULT  = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai",
                   "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"]


def _resolve_columns(df: pd.DataFrame) -> dict[str, str]:
    """Return a mapping of standard_field → actual CSV column name."""
    cols_lower = {c.strip().lower(): c for c in df.columns}
    resolved: dict[str, str] = {}
    for field, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            if alias in cols_lower:
                resolved[field] = cols_lower[alias]
                break
    return resolved


def parse_csv(file_bytes: bytes, filename: str = "dataset.csv") -> list[dict]:
    df = pd.read_csv(io.BytesIO(file_bytes))
    df.columns = df.columns.str.strip()
    df = df.dropna(how="all")

    resolved = _resolve_columns(df)

    # Check required fields
    missing = [f for f in REQUIRED_FIELDS if f not in resolved]
    if missing:
        raise ValueError(
            f"Missing required columns: {missing}. "
            f"Your CSV has: {list(df.columns)}. "
            f"Accepted names: { {f: COLUMN_ALIASES[f] for f in missing} }"
        )

    customers = []
    n = len(df)

    for i, row in df.iterrows():
        try:
            orders  = max(1, int(float(row[resolved["orders"]])))
            spend   = max(0, float(row[resolved["spend"]]))
            days_ago = max(0, int(float(row[resolved["days_ago"]])))
        except (ValueError, TypeError):
            continue  # skip malformed rows silently

        customer = {
            "id":       i + 1,
            "name":     str(row[resolved["name"]]).strip(),
            "email":    str(row[resolved["email"]]).strip().lower(),
            "phone":    str(row[resolved["phone"]]).strip() if "phone" in resolved else "",
            "orders":   orders,
            "spend":    round(spend, 2),
            "daysAgo":  days_ago,
            "avgOrder": round(spend / orders, 2),
            # Optional fields with defaults
            "city":    str(row[resolved["city"]]).strip()
                       if "city" in resolved else CITIES_DEFAULT[i % len(CITIES_DEFAULT)],
            "gender":  str(row[resolved["gender"]]).strip()
                       if "gender" in resolved else ("Male" if i % 2 == 0 else "Female"),
            "age":     max(18, int(float(row[resolved["age"]])))
                       if "age" in resolved else 18 + (i % 43),
        }
        customers.append(customer)

    if not customers:
        raise ValueError("No valid rows found in the CSV after parsing.")

    return customers
