from services.groq_client import GroqClient
import json

client = GroqClient()

user_input = input("Ask something: ")
response = client.generate_response(user_input)

print("\n=== AI Response ===\n")

# Pretty print JSON properly (₹ symbol fix)
if isinstance(response, dict):
    print(json.dumps(response, indent=4, ensure_ascii=False))
else:
    print(response)