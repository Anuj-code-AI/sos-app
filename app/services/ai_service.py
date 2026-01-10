import os
import json
import requests

class AIService:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    @staticmethod
    def classify_message(message: str):
        """
        Returns:
            (priority, category)
            priority: HIGH | MEDIUM | LOW | UNKNOWN
            category: VIOLENCE | HARASSMENT | FIRE | MEDICAL | THEFT | OTHER
        """

        # Fallback if key not set (demo safety)
        if not AIService.GEMINI_API_KEY:
            return "UNKNOWN", "OTHER"

        try:
            url = (
                "https://generativelanguage.googleapis.com/v1beta/models/"
                "gemini-1.5-flash:generateContent?key=" + AIService.GEMINI_API_KEY
            )

            prompt = f"""
You are an emergency classification system.

Classify the following message into:
1. priority: HIGH, MEDIUM, or LOW
2. category: VIOLENCE, HARASSMENT, FIRE, MEDICAL, THEFT, OTHER

Message:
"{message}"

Respond ONLY in JSON like:
{{"priority": "HIGH", "category": "VIOLENCE"}}
"""

            payload = {
                "contents": [
                    {
                        "parts": [{"text": prompt}]
                    }
                ]
            }

            resp = requests.post(url, json=payload, timeout=10)
            data = resp.json()

            text = data["candidates"][0]["content"]["parts"][0]["text"]

            # Extract JSON safely
            start = text.find("{")
            end = text.rfind("}") + 1
            json_str = text[start:end]

            result = json.loads(json_str)

            priority = result.get("priority", "UNKNOWN")
            category = result.get("category", "OTHER")

            return priority, category

        except Exception as e:
            print("Gemini classification failed:", e)
            return "UNKNOWN", "OTHER"
