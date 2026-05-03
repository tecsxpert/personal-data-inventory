from flask import Blueprint, request, jsonify
from services.groq_client import classify_text
import json

categorise_bp = Blueprint("categorise", __name__)

@categorise_bp.route("/categorise", methods=["POST"])
def categorise():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    result = classify_text(data["text"])

    try:
        parsed = json.loads(result)
    except:
        parsed = {
            "category": "Unknown",
            "confidence": 0.0,
            "reasoning": result
        }

    return jsonify(parsed)