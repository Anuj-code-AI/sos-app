from app.extensions import db
from app.models.alert import Alert

class AlertRepository:

    @staticmethod
    def save_alert(message, lat, lng):
        alert = Alert(
            message=message,
            lat=lat,
            lng=lng
        )
        db.session.add(alert)
        db.session.commit()
        return alert
