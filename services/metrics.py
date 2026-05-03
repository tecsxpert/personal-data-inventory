import time

# Store last 10 response times
response_times = []

# Track start time
start_time = time.time()

# Cache (simple)
cache_hits = 0
cache_misses = 0


def log_response_time(duration):
    response_times.append(duration)

    # keep only last 10
    if len(response_times) > 10:
        response_times.pop(0)


def get_avg_response_time():
    if not response_times:
        return 0
    return sum(response_times) / len(response_times)


def get_uptime():
    return time.time() - start_time


def get_cache_stats():
    return {
        "hits": cache_hits,
        "misses": cache_misses
    }