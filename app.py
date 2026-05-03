from flask import Flask

# 🔹 Import all route blueprints
from routes.categorise import categorise_bp
from routes.query import query_bp
from routes.health import health_bp
from routes.report import report_bp   # Day 11 async

# 🔹 Create Flask app
app = Flask(__name__)

# 🔹 Register all endpoints
app.register_blueprint(categorise_bp)
app.register_blueprint(query_bp)
app.register_blueprint(health_bp)
app.register_blueprint(report_bp)   # includes /generate-report and /job/<id>

# 🔹 Optional root route (just to avoid 404 on /)
@app.route("/")
def home():
    return {
        "message": "AI Backend Running 🚀",
        "endpoints": [
            "/categorise",
            "/query",
            "/health",
            "/generate-report",
            "/job/<job_id>"
        ]
    }

# 🔹 Run server
if __name__ == "__main__":
    app.run(debug=True)