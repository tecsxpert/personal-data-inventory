import json
from flask import Blueprint, request, jsonify
from services.groq_client import classify_text
import time

categorise_bp = Blueprint("categorise", __name__)

@categorise_bp.route("/categorise", methods=["POST"])
def categorise():
    data = request.get_json()

    # 🔹 Validate input
    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    text = data["text"]

    start = time.time()

    try:
        # 🔹 Call Groq classification
        result = classify_text(text)

        # 🔥 Parse model JSON string → dict
        parsed = json.loads(result["result"])

        response_time = int((time.time() - start) * 1000)

        # ✅ Final structured response
        return jsonify({
            "data": {
                "category": parsed.get("category", "Unknown"),
                "confidence": parsed.get("confidence", 0.0),
                "reasoning": parsed.get("reasoning", "")
            },
            "meta": {
                "model_used": result["model"],
                "tokens_used": result["tokens_used"],
                "response_time_ms": response_time
            }
        })

    except Exception as e:
        return jsonify({
            "error": "Invalid model output",
            "details": str(e)
        }), 500