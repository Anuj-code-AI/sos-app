from app.extensions import db
from datetime import datetime

class Alert(db.Model):
    __tablename__ = "alerts"

    id = db.Column(db.Integer, primary_key=True)

    # Original fields
    message = db.Column(db.String(255), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    # ✅ AI-enriched fields
    priority = db.Column(db.String(20), nullable=False, default="UNKNOWN")
    category = db.Column(db.String(50), nullable=True)

    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
