from app.repositories.alert_repository import AlertRepository

class AlertService:

    @staticmethod
    def send_harassment_alert():
        message = "🚨 HARASSMENT ALERT: A user needs immediate help!"
        AlertRepository.save_alert(message)
