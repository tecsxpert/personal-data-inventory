import threading
import requests
from services.jobs import update_job

def process_report(job_id, input_text, webhook_url):
    # Simulate heavy task
    result = f"Report generated for: {input_text}"

    # Update job status
    update_job(job_id, result)

    # Send webhook
    if webhook_url:
        try:
            requests.post(webhook_url, json={
                "job_id": job_id,
                "status": "completed",
                "result": result
            })
        except:
            pass


def start_background_job(job_id, input_text, webhook_url):
    thread = threading.Thread(
        target=process_report,
        args=(job_id, input_text, webhook_url)
    )
    thread.start()