import requests

BASE_URL = "http://127.0.0.1:5000"

# ---------- TEST DATA ----------
categorise_tests = [
    "I paid rent",
    "I feel sick and tired",
    "Java is used in backend",
    "I attended online class",
    "Bought a new phone",
    "Doctor gave tablets",
    "Stock market crashed",
    "Learning AI online",
    "I have stomach pain",
    "Paid electricity bill"
]

query_tests = [
    "What did I pay?",
    "What illness is mentioned?",
    "What programming language is mentioned?",
    "What did I buy?",
    "What health issue is there?",
    "What did doctor do?",
    "What is Python?",
    "What is stored in database?",
    "What did I learn?",
    "What happened in finance?"
]


# ---------- TEST FUNCTIONS ----------

def test_categorise():
    print("\n----- CATEGORY TEST -----")

    for text in categorise_tests:
        res = requests.post(f"{BASE_URL}/categorise", json={"text": text})
        print(f"\nInput: {text}")
        print("Output:", res.json())


def test_query():
    print("\n----- QUERY TEST -----")

    for q in query_tests:
        res = requests.post(f"{BASE_URL}/query", json={"question": q})
        print(f"\nQuestion: {q}")
        print("Output:", res.json())


if __name__ == "__main__":
    test_categorise()
    test_query()