from app.repositories.alert_repository import AlertRepository
from app.controllers.socket_controller import connected_users
from app.socket import socketio

class AlertService:

    @staticmethod
    def send_harassment_alert(lat, lng, sender_id, custom_message=""):
        # If user wrote something, use it. Else use default.
        if custom_message and custom_message.strip():
            message = "🚨 HARASSMENT ALERT: " + custom_message.strip()
        else:
            message = "🚨 HARASSMENT ALERT: A user needs immediate help!"

        alert = AlertRepository.save_alert(message, lat, lng)

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
                    "sender_id": sender_id
                },
                to=socket_id
            )
