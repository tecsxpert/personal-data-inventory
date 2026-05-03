import chromadb

# Initialize persistent DB (stored locally)
client = chromadb.Client(
    settings=chromadb.config.Settings(
        persist_directory="./chroma_db"
    )
)

# Create or get collection
collection = client.get_or_create_collection(name="documents")


def add_documents():
    collection.add(
        documents=[
            "I paid my electricity bill",
            "I have a headache and fever",
            "Python is a programming language"
        ],
        ids=["1", "2", "3"]
    )


def query_documents(query_text):
    results = collection.query(
        query_texts=[query_text],
        n_results=1
    )
    return results