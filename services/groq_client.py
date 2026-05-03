import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_text(text):
    """
    Classifies input text into predefined categories
    and returns JSON with category, confidence, reasoning
    """

    prompt = f"""
    Classify the following text into one of these categories:
    Finance, Health, Technology, Education, General

    Also provide:
    - confidence (0 to 1)
    - reasoning

    Text: "{text}"

    Respond ONLY in JSON format:
    {{
        "category": "",
        "confidence": 0.0,
        "reasoning": ""
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3  # more consistent output
        )

        output = response.choices[0].message.content.strip()

        return output

    except Exception as e:
        return f"""
        {{
            "category": "Error",
            "confidence": 0.0,
            "reasoning": "Error occurred: {str(e)}"
        }}
        """