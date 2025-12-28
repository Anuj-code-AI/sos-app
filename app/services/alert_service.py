from app.repositories.alert_repository import AlertRepository
from app.controllers.socket_controller import connected_users
from app.socket import socketio

class AlertService:

    @staticmethod
    def send_harassment_alert():
        message = "🚨 HARASSMENT ALERT: A user needs immediate help!"
        AlertRepository.save_alert(message)

        # PUSH TO ALL CONNECTED USERS
        for socket_id in connected_users.values():
            socketio.emit("new_alert", {"message": message}, to=socket_id)
