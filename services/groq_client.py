import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL_NAME = "llama-3.1-8b-instant"


# ---------- CATEGORY FUNCTION ----------
def classify_text(text):
    prompt = f"""
You are an AI classifier.

Classify the text into ONE category:
Finance, Health, Technology, Education, General

Rules:
- Always choose ONE category
- Confidence must be between 0 and 1
- Give short reasoning

Respond ONLY in VALID JSON:
{{
  "category": "",
  "confidence": 0.0,
  "reasoning": ""
}}

Text: "{text}"
"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        content = response.choices[0].message.content.strip()

        return {
            "result": content,
            "tokens_used": response.usage.total_tokens,
            "model": MODEL_NAME
        }

    except Exception as e:
        return {
            "result": f'{{"category":"Error","confidence":0.0,"reasoning":"{str(e)}"}}',
            "tokens_used": 0,
            "model": MODEL_NAME
        }


# ---------- RAG FUNCTION (STRICT FINAL VERSION) ----------
def generate_answer(question, context_docs):
    context = "\n".join(context_docs)

    prompt = f"""
You are an AI assistant.

STRICT RULES:
- Use ONLY the given context
- Do NOT assume anything
- Do NOT use outside knowledge
- Do NOT add extra explanation
- Answer in EXACTLY ONE sentence
- DO NOT infer or guess anything beyond the context
- If answer is not clearly in context, say: "Not enough information."

IMPORTANT:
- If context says "headache and fever", DO NOT say "flu"
- Only repeat what is explicitly written

Context:
{context}

Question:
{question}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1  # 🔥 lower = less hallucination
        )

        content = response.choices[0].message.content.strip()

        return {
            "answer": content,
            "tokens_used": response.usage.total_tokens,
            "model": MODEL_NAME
        }

    except Exception as e:
        return {
            "answer": f"Error: {str(e)}",
            "tokens_used": 0,
            "model": MODEL_NAME
        }