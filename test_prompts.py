from services.groq_client import classify_text, generate_answer
from services.vector_db import get_similar_docs, add_documents

# 🔥 Load data first
add_documents()

test_cases = [
    "I paid my electricity bill",
    "I have fever and cold",
    "Python is used for AI",
    "I went to school today",
    "I bought a laptop",
    "My head hurts badly",
    "Bank transaction failed",
    "Learning programming online",
    "Doctor prescribed medicine",
    "I attended a coding class"
]

print("----- CLASSIFICATION TEST -----\n")

for text in test_cases:
    result = classify_text(text)
    print("Input:", text)
    print("Output:", result)
    print("-" * 40)


print("\n----- RAG TEST -----\n")

questions = [
    "What did I pay?",
    "What illness is mentioned?",
    "What is Python used for?"
]

for q in questions:
    docs = get_similar_docs(q)
    answer = generate_answer(q, docs)

    print("Question:", q)
    print("Answer:", answer)
    print("Sources:", docs)
    print("-" * 40)