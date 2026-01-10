from app.repositories.alert_repository import AlertRepository
from app.controllers.socket_controller import connected_users
from app.socket import socketio
from app.services.ai_service import AIService

class AlertService:

    @staticmethod
    def send_harassment_alert(lat, lng, sender_id, custom_message=""):
        # If user wrote something, use it. Else use default.
        if custom_message and custom_message.strip():
            raw_message = custom_message.strip()
            message = "🚨 HARASSMENT ALERT: " + raw_message
        else:
            raw_message = "A user needs immediate help!"
            message = "🚨 HARASSMENT ALERT: " + raw_message

        # 🔥 Call Gemini for classification
        priority, category = AIService.classify_message(raw_message)

        print("AI CLASSIFICATION =>", priority, category)

        # ✅ Save enriched alert
        alert = AlertRepository.save_alert(
            message=message,
            lat=lat,
            lng=lng,
            priority=priority,
            category=category
        )

        print("CONNECTED USERS AT SEND:", connected_users)

        for user_id, socket_id in connected_users.items():
            if str(user_id) == str(sender_id):
                continue  # ❌ DO NOT SEND TO SENDER

            socketio.emit(
                "new_alert",
                {
                    "message": alert.message,
                    "lat": alert.lat,
                    "lng": alert.lng,
                    "sender_id": sender_id,
                    "priority": alert.priority,
                    "category": alert.category
                },
                to=socket_id
            )
