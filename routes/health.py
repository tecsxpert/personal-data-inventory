from flask import Blueprint, jsonify
from services.metrics import get_avg_response_time, get_uptime, get_cache_stats
from services.vector_db import collection

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "model": "llama-3.1-8b-instant",
        "avg_response_time": round(get_avg_response_time(), 3),
        "chroma_doc_count": collection.count(),
        "uptime_seconds": round(get_uptime(), 2),
        "cache": get_cache_stats()
    })