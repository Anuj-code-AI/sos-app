from app.extensions import db
from app.models.alert import Alert

class AlertRepository:

    @staticmethod
    def save_alert(message, lat, lng, priority="UNKNOWN", category=None):
        alert = Alert(
            message=message,
            lat=lat,
            lng=lng,
            priority=priority,
            category=category
        )
        db.session.add(alert)
        db.session.commit()
        return alert
