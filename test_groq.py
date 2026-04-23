from services.groq_client import GroqClient
import json

client = GroqClient()

user_input = input("Ask something: ")
response = client.generate_response(user_input)

print("\n=== AI Response ===\n")

# Pretty print JSON nicely
if isinstance(response, dict):
    print(json.dumps(response, indent=4))
else:
    print(response)