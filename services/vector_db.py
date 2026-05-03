import chromadb

# Create DB client
client = chromadb.Client(
    settings=chromadb.config.Settings(
        persist_directory="./chroma_db"
    )
)

# Create collection
collection = client.get_or_create_collection(name="documents")


# Add data
def add_documents():
    collection.add(
        documents=[
            "I paid my electricity bill",
            "I have a headache and fever",
            "Python is a programming language"
        ],
        ids=["1", "2", "3"]
    )


# Get similar docs
def get_similar_docs(query_text, n=3):
    results = collection.query(
        query_texts=[query_text],
        n_results=n
    )
    return results["documents"][0]


# 🔥 Auto init (IMPORTANT)
def init_db():
    if collection.count() == 0:
        add_documents()