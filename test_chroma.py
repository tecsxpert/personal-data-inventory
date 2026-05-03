from services.vector_db import add_documents, get_similar_docs

add_documents()

query = "I paid my bill"
result = get_similar_docs(query)

print("Query:", query)
print("Result:", result)