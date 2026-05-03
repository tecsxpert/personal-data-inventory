from flask import Blueprint, request, jsonify
from services.vector_db import get_similar_docs
from services.groq_client import generate_answer
from services.metrics import log_response_time
import time

query_bp = Blueprint("query", __name__)

@query_bp.route("/query", methods=["POST"])
def query():
    data = request.get_json()

    # Validate input
    if not data or "question" not in data:
        return jsonify({"error": "Question is required"}), 400

    question = data["question"]

    try:
        # ⏱ Start timer
        start = time.time()

        # Step 1: Retrieve documents
        docs = get_similar_docs(question)

        # Step 2: Generate answer
        answer = generate_answer(question, docs)

        # ⏱ End timer
        end = time.time()

        # Log response time
        log_response_time(end - start)

        return jsonify({
            "answer": answer,
            "sources": docs
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500