from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json

        name = data.get("name", "")
        description = data.get("description", "")
        category = data.get("category", "")
        status = data.get("status", "")

        if not name:
            return jsonify({"error": "Missing name"}), 400

        prompt = f"""
You are an AI that analyzes personal data/services.

Data item:
- Name: {name}
- Description: {description}
- Category: {category}
- Status: {status}

Provide:
1. Summary (what this service is)
2. Risk level (Low / Medium / High)
3. Recommendation (what user should do)

STRICT RULES:
- Return ONLY JSON
- No markdown
- No explanation outside JSON

Format:
{{
  "summary": "",
  "risk": "",
  "recommendation": ""
}}
"""

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )

        ai_text = completion.choices[0].message.content.strip()

        # Clean markdown
        if ai_text.startswith("```"):
            ai_text = ai_text.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(ai_text)

        return jsonify(parsed)

    except json.JSONDecodeError:
        return jsonify({
            "error": "Invalid JSON from AI",
            "raw_output": ai_text
        }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)