import os
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from services.groq_client import GroqClient
import re
import logging

app = Flask(__name__)

# Day 8: Fix ZAP findings - add security headers
csp = {
    'default-src': '\'self\'',
    'script-src': '\'self\'',
    'style-src': '\'self\'',
    'img-src': '\'self\' data:',
    'object-src': '\'none\'',
}
talisman = Talisman(app, content_security_policy=csp, force_https=False) # production-ready CSP, HTTPS force disabled for local dev

# Day 4: Add flask-limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["30 per minute"],
    storage_uri="memory://",
)

# Day 9: PII audit - Logging configuration to avoid PII leakage
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PIIFilter(logging.Filter):
    def filter(self, record):
        # Basic filter to mask potential PII (emails, phone numbers) in logs
        msg = str(record.msg)
        msg = re.sub(r'[\w\.-]+@[\w\.-]+', '[EMAIL_MASKED]', msg)
        msg = re.sub(r'\+?\d{10,12}', '[PHONE_MASKED]', msg)
        record.msg = msg
        return True

logger.addFilter(PIIFilter())

# Day 3: Implement input sanitisation middleware
def sanitize_input(text):
    if not text:
        return text
    # Strip HTML tags
    clean = re.compile('<.*?>')
    text = re.sub(clean, '', text)
    # Basic prompt injection detection
    patterns = [
        r"ignore previous instructions",
        r"system prompt",
        r"you are now",
        r"bypass",
        r"jailbreak"
    ]
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return None
    return text.strip()

@app.before_request
def validate_input():
    if request.method == 'POST' and request.is_json:
        data = request.get_json()
        for key, value in data.items():
            if isinstance(value, str):
                sanitized = sanitize_input(value)
                if sanitized is None:
                    return jsonify({"error": "Potential prompt injection detected"}), 400
                data[key] = sanitized

@app.route('/health')
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/describe', methods=['POST'])
def describe():
    # Implementation placeholder for Day 3
    data = request.get_json()
    return jsonify({"message": "Description generated", "input": data.get('text')}), 200

@app.route('/generate-report', methods=['POST'])
@limiter.limit("10 per minute")
def generate_report():
    # Implementation placeholder for Day 4
    return jsonify({"message": "Report generation started"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
