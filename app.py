from flask import Flask

# Import routes
from routes.categorise import categorise_bp
from routes.query import query_bp
from routes.health import health_bp

# Import DB init
from services.vector_db import init_db

# Create app
app = Flask(__name__)

# Initialize database (important)
init_db()

# Register all routes
app.register_blueprint(categorise_bp)
app.register_blueprint(query_bp)
app.register_blueprint(health_bp)

# Home route
@app.route("/")
def home():
    return "API is running"

# Run server
if __name__ == "__main__":
    app.run(debug=True)