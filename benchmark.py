import requests
import time
import statistics

BASE_URL = "http://127.0.0.1:5000"

# ---------- CONFIG ----------
TOTAL_REQUESTS = 20

# ---------- STORE RESULTS ----------
results = {
    "categorise": [],
    "query": [],
    "health": [],
    "generate-report": []
}


# ---------- HELPER ----------
def percentile(data, percent):
    size = len(data)
    return sorted(data)[int(size * percent / 100)]


# ---------- BENCHMARK FUNCTIONS ----------

def benchmark_categorise():
    print("\nBenchmarking /categorise")

    for _ in range(TOTAL_REQUESTS):
        start = time.time()

        requests.post(
            f"{BASE_URL}/categorise",
            json={"text": "I paid electricity bill"}
        )

        elapsed = (time.time() - start) * 1000
        results["categorise"].append(elapsed)


def benchmark_query():
    print("\nBenchmarking /query")

    for _ in range(TOTAL_REQUESTS):
        start = time.time()

        requests.post(
            f"{BASE_URL}/query",
            json={"question": "What did I pay?"}
        )

        elapsed = (time.time() - start) * 1000
        results["query"].append(elapsed)


def benchmark_health():
    print("\nBenchmarking /health")

    for _ in range(TOTAL_REQUESTS):
        start = time.time()

        requests.get(f"{BASE_URL}/health")

        elapsed = (time.time() - start) * 1000
        results["health"].append(elapsed)


def benchmark_report():
    print("\nBenchmarking /generate-report")

    for _ in range(TOTAL_REQUESTS):
        start = time.time()

        requests.post(
            f"{BASE_URL}/generate-report",
            json={
                "text": "Monthly report",
                "webhook_url": ""
            }
        )

        elapsed = (time.time() - start) * 1000
        results["generate-report"].append(elapsed)


# ---------- PRINT RESULTS ----------

def print_stats(name, timings):
    print(f"\n{name.upper()} RESULTS")
    print(f"p50: {percentile(timings, 50):.2f} ms")
    print(f"p95: {percentile(timings, 95):.2f} ms")
    print(f"p99: {percentile(timings, 99):.2f} ms")
    print(f"avg: {statistics.mean(timings):.2f} ms")


# ---------- MAIN ----------

if __name__ == "__main__":
    benchmark_categorise()
    benchmark_query()
    benchmark_health()
    benchmark_report()

    for endpoint, timings in results.items():
        print_stats(endpoint, timings)