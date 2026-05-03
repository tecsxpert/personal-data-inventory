from flask import Flask
from routes.categorise import categorise_bp
from routes.query import query_bp
from services.vector_db import init_db

app = Flask(__name__)

# 🔥 Initialize DB
init_db()

# Register routes
app.register_blueprint(categorise_bp)
app.register_blueprint(query_bp)

@app.route("/")
def home():
    return "API is running"

if __name__ == "__main__":
    app.run(debug=True)