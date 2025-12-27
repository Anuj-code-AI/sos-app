from app.extensions import db
from app.models.alert import Alert

class AlertRepository:

    @staticmethod
    def save_alert(message):
        alert = Alert(message=message)
        db.session.add(alert)
        db.session.commit()

    @staticmethod
    def get_all_alerts():
        return Alert.query.order_by(Alert.created_at.desc()).all()
