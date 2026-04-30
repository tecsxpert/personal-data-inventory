import os
import time
import logging
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.ERROR)

class GroqClient:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in .env file")

        self.client = Groq(api_key=api_key)

    def generate_response(self, prompt, retries=3):
        for attempt in range(retries):
            try:
                response = self.client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=[
                        {
                            "role": "user",
                            "content": f"""
You are a JSON generator.

User request: {prompt}

Return ONLY valid JSON.
Do NOT include explanations, notes, markdown, or extra text.

Format:
{{
    "destination": "",
    "days": "",
    "itinerary": [
        {{
            "day": 1,
            "plan": ""
        }}
    ],
    "budget": "",
    "tips": []
}}
"""
                        }
                    ]
                )

                content = response.choices[0].message.content.strip()

                # 🔥 Remove markdown if present
                if content.startswith("```"):
                    content = content.replace("```json", "").replace("```", "").strip()

                # 🔥 Keep only JSON part (remove extra text after last })
                if "}" in content:
                    content = content[:content.rfind("}") + 1]

                # ✅ Parse JSON
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    return {"error": "Invalid JSON response", "raw": content}

            except Exception as e:
                logging.error(f"Error on attempt {attempt + 1}: {e}")

                if attempt < retries - 1:
                    wait_time = 2 ** attempt  # 1s, 2s, 4s
                    print(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    return {"error": "Failed to get response from Groq API"}