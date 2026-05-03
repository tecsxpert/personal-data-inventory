from services.vector_db import add_documents, query_documents

# Add sample data
add_documents()

# Query test
query = "I paid my bill"
result = query_documents(query)

print("Query:", query)
print("Result:", result)