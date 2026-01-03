from app.repositories.alert_repository import AlertRepository
from app.controllers.socket_controller import connected_users
from app.socket import socketio

class AlertService:

    @staticmethod
    def send_harassment_alert(lat, lng, sender_id):
        message = "🚨 HARASSMENT ALERT: A user needs immediate help!"

        alert = AlertRepository.save_alert(message, lat, lng)
        print("CONNECTED USERS AT SEND:", connected_users)
        for user_id, socket_id in connected_users.items():
            if int(user_id) == int(sender_id):
                continue  # ❌ DO NOT SEND TO SENDER

            socketio.emit(
                "new_alert",
                {
                    "message": alert.message,
                    "lat": alert.lat,
                    "lng": alert.lng,
                    "sender_id": sender_id   # ✅ ADD THIS
                },
                to=socket_id
            )

