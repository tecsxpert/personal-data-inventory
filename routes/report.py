from flask import Blueprint, request, jsonify
from services.jobs import create_job, get_job
from services.worker import start_background_job

report_bp = Blueprint("report", __name__)

@report_bp.route("/generate-report", methods=["POST"])
def generate_report():
    data = request.get_json() or {}
    text = data.get("text")
    webhook_url = data.get("webhook_url")

    if not text:
        return jsonify({"error": "text required"}), 400

    job_id = create_job()
    start_background_job(job_id, text, webhook_url)

    return jsonify({"job_id": job_id, "status": "processing"})


# 🔥 ADD THIS (job status endpoint)
@report_bp.route("/job/<job_id>", methods=["GET"])
def get_job_status(job_id):
    job = get_job(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)