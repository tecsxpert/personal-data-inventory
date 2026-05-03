from flask import Blueprint, request, jsonify
from services.groq_client import classify_text
import json

# Create blueprint
categorise_bp = Blueprint("categorise", __name__)

# Define POST route
@categorise_bp.route("/categorise", methods=["POST"])
def categorise():
    # Get JSON data from request
    data = request.get_json()

    # Validate input
    if not data or "text" not in data:
        return jsonify({
            "error": "Text is required"
        }), 400

    text = data["text"]

    # Call Groq AI function
    result = classify_text(text)

    # Convert AI response to JSON
    try:
        parsed = json.loads(result)
    except:
        parsed = {
            "category": "Unknown",
            "confidence": 0.0,
            "reasoning": result
        }

    return jsonify(parsed)