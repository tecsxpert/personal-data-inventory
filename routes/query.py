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

    # Optional skip cache
    skip_cache = data.get("skip_cache", False)

    try:
        start = time.time()

        # 🔥 Check cache
        key, cached = get_cache(question)

        if cached and not skip_cache:
            increment_hit()
            result = json.loads(cached)

            log_response_time(time.time() - start)

            return jsonify({
                "answer": result["answer"],
                "sources": result["sources"],
                "cached": True
            })

        # ❌ Cache miss
        increment_miss()

        docs = get_similar_docs(question)
        answer = generate_answer(question, docs)

        result = {
            "answer": answer,
            "sources": docs
        }

        # Save cache
        if not skip_cache:
            set_cache(key, result)

        log_response_time(time.time() - start)

        return jsonify({
            **result,
            "cached": False
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500