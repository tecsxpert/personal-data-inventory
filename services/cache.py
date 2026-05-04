import redis
import hashlib
import json

# Connect Redis
r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

TTL = 900  # 15 minutes


def generate_key(question):
    return hashlib.sha256(question.encode()).hexdigest()


def get_cache(question):
    key = generate_key(question)
    data = r.get(key)
    return key, data


def set_cache(key, value):
    r.setex(key, TTL, json.dumps(value))


def increment_hit():
    r.incr("cache_hits")


def increment_miss():
    r.incr("cache_misses")


def get_cache_stats():
    return {
        "hits": int(r.get("cache_hits") or 0),
        "misses": int(r.get("cache_misses") or 0)
    }