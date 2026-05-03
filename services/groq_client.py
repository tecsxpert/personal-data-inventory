import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ---------- Day 3 ----------
def classify_text(text):
    prompt = f"""
    Classify the following text into one of these categories:
    Finance, Health, Technology, Education, General

    Respond ONLY in JSON format:
    {{
        "category": "",
        "confidence": 0.0,
        "reasoning": ""
    }}

    Text: "{text}"
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    return response.choices[0].message.content.strip()


# ---------- Day 5 ----------
def generate_answer(question, context_docs):
    context = "\n".join(context_docs)

    prompt = f"""
    Answer the question using the context below.

    Context:
    {context}

    Question:
    {question}

    Give a clear and concise answer.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    return response.choices[0].message.content.strip()