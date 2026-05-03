from flask import Blueprint, request, jsonify
from services.vector_db import get_similar_docs
from services.groq_client import generate_answer

query_bp = Blueprint("query", __name__)

@query_bp.route("/query", methods=["POST"])
def query():
    data = request.get_json()

    if not data or "question" not in data:
        return jsonify({"error": "Question is required"}), 400

    question = data["question"]

    docs = get_similar_docs(question)
    answer = generate_answer(question, docs)

    return jsonify({
        "answer": answer,
        "sources": docs
    })