"""
main.py — PulseCRM FastAPI backend.

Endpoints:
  POST /api/analyze   Upload a CSV → returns processed customers + segments
  GET  /api/health    Health check for deployment platforms
"""

import asyncio
import os
from dotenv import load_dotenv

from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.cluster.parser    import parse_csv
from app.cluster.pipeline  import run_pipeline
from app.campaign_routes import router as campaign_router

load_dotenv()
import traceback

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("PulseCRM backend started.")
    yield
    print("PulseCRM backend stopped.")

app = FastAPI(
    title="PulseCRM API",
    version="1.0.0",
    description="Customer segmentation and RFM analysis for PulseCRM.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
app.include_router(campaign_router, prefix="/api")

# ── Helpers ───────────────────────────────────────────────────────────────────

def _derive_status(customer: dict) -> str:
    r = customer.get("rfm_r", 3)
    f = customer.get("rfm_f", 3)
    m = customer.get("rfm_m", 3)

    if f >= 4 and m >= 4:
        return "High Value"
    if r >= 4:
        return "Active"
    if r <= 2 and f >= 3:
        return "At Risk"
    if r <= 2:
        return "Dormant"
    return "Active"


def _process_sync(file_bytes: bytes, filename: str) -> dict:
    """Run the full parse → RFM → cluster → persona → analytics pipeline."""
    customers = parse_csv(file_bytes, filename)

    # run_pipeline handles: score_rfm → kmeans → gemini → personas → analytics
    result = run_pipeline(customers)

    # Attach status (derived from RFM scores added by the pipeline)
    for c in result["customers"]:
        c["status"] = _derive_status(c)

    return result

@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10 MB.")

    try:
        loop   = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None, _process_sync, file_bytes, file.filename
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

    return {
        "customers": result["customers"],
        "segments":  result["segments"],
        "meta": {
            "filename":  file.filename,
            "totalRows": len(result["customers"]),
        },
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "type": type(exc).__name__},
    )