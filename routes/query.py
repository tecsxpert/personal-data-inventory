from flask import Blueprint, request, jsonify
from services.vector_db import get_similar_docs
from services.groq_client import generate_answer
from services.metrics import log_response_time
from services.cache import (
    get_cache, set_cache, increment_hit, increment_miss
)
import time
import json

query_bp = Blueprint("query", __name__)

@query_bp.route("/query", methods=["POST"])
def query():
    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({"error": "Question is required"}), 400

    question = data["question"]
    skip_cache = data.get("skip_cache", False)

    start = time.time()

    try:
        # 🔹 CACHE CHECK
        key, cached = get_cache(question)

        if cached and not skip_cache:
            increment_hit()
            result = json.loads(cached)

            response_time = int((time.time() - start) * 1000)

            return jsonify({
                "data": result,
                "meta": {
                    "confidence": 0.95,
                    "model_used": "llama-3.1-8b-instant",
                    "tokens_used": 0,
                    "response_time_ms": response_time,
                    "cached": True
                }
            })

        # 🔹 CACHE MISS
        increment_miss()

        docs = get_similar_docs(question)
        llm_result = generate_answer(question, docs)

        result = {
            "answer": llm_result["answer"],
            "sources": docs
        }

        if not skip_cache:
            set_cache(key, result)

        response_time = int((time.time() - start) * 1000)

        log_response_time(response_time / 1000)

        return jsonify({
            "data": result,
            "meta": {
                "confidence": 0.9,
                "model_used": llm_result["model"],
                "tokens_used": llm_result["tokens_used"],
                "response_time_ms": response_time,
                "cached": False
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500